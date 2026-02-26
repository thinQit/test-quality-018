import { NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';

const createContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10)
});

const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.string().optional()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    const contact = await db.contactSubmission.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
        status: 'new'
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: contact.id,
          createdAt: contact.createdAt.toISOString(),
          status: contact.status
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = querySchema.safeParse({
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      status: searchParams.get('status') || undefined
    });

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid query parameters' }, { status: 400 });
    }

    const page = parsed.data.page ? Math.max(1, Number(parsed.data.page)) : 1;
    const limit = parsed.data.limit ? Math.min(50, Math.max(1, Number(parsed.data.limit))) : 10;

    const where = parsed.data.status ? { status: parsed.data.status } : {};

    const [items, total] = await Promise.all([
      db.contactSubmission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.contactSubmission.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json(
      {
        success: true,
        data: {
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            email: item.email,
            message: item.message,
            status: item.status,
            createdAt: item.createdAt.toISOString()
          })),
          total,
          page,
          limit,
          totalPages
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
