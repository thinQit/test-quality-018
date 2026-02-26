import { NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';

const idSchema = z.string().min(1);

const updateSchema = z.object({
  status: z.enum(['new', 'read']).optional(),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  message: z.string().min(10).optional()
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const parsedId = idSchema.safeParse(params.id);
    if (!parsedId.success) {
      return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });
    }

    const contact = await db.contactSubmission.findUnique({ where: { id: parsedId.data } });
    if (!contact) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          message: contact.message,
          status: contact.status,
          createdAt: contact.createdAt.toISOString()
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const parsedId = idSchema.safeParse(params.id);
    if (!parsedId.success) {
      return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });
    }

    const body = await req.json();
    const parsedBody = updateSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    const contact = await db.contactSubmission.findUnique({ where: { id: parsedId.data } });
    if (!contact) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    const updated = await db.contactSubmission.update({
      where: { id: parsedId.data },
      data: parsedBody.data
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          message: updated.message,
          status: updated.status,
          createdAt: updated.createdAt.toISOString()
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const parsedId = idSchema.safeParse(params.id);
    if (!parsedId.success) {
      return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });
    }

    const contact = await db.contactSubmission.findUnique({ where: { id: parsedId.data } });
    if (!contact) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    await db.contactSubmission.delete({ where: { id: parsedId.data } });

    return NextResponse.json({ success: true, data: { success: true } }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
