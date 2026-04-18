import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const sql = getDb();
  const rows = await sql`SELECT * FROM admin_users WHERE username = ${username}`;
  const user = rows[0] as { id: number; username: string; password: string } | undefined;

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = signToken({ username: user.username });
  const res = NextResponse.json({ success: true });
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24,
  });
  return res;
}
