import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

function isPublicContactPost(req: NextRequest) {
  return req.nextUrl.pathname === '/api/contacts' && req.method === 'POST';
}

function isHealth(req: NextRequest) {
  return req.nextUrl.pathname === '/api/health';
}

function isAuthRoute(req: NextRequest) {
  return req.nextUrl.pathname.startsWith('/api/auth');
}

export function middleware(req: NextRequest) {
  if (isHealth(req) || isAuthRoute(req) || isPublicContactPost(req)) {
    return NextResponse.next();
  }

  if (ADMIN_API_KEY && req.headers.get('x-api-key') === ADMIN_API_KEY) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
  }

  if (req.nextUrl.pathname.startsWith('/api/contacts') || req.nextUrl.pathname.startsWith('/dashboard')) {
    if (payload.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/contacts/:path*', '/api/auth/me']
};
