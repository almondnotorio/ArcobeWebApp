import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sql = getDb();
  const rows = await sql`SELECT * FROM projects WHERE id = ${id}`;
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const sql = getDb();
  const data = await req.json();

  await sql`
    UPDATE projects SET
      title       = ${data.title},
      category    = ${data.category},
      location    = ${data.location},
      year        = ${data.year},
      description = ${data.description},
      client      = ${data.client || ''},
      value       = ${data.value || ''},
      size        = ${data.size || ''},
      featured    = ${data.featured ? 1 : 0},
      cover_image = ${data.cover_image || ''},
      images      = ${JSON.stringify(data.images || [])}
    WHERE id = ${id}
  `;

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const sql = getDb();
  await sql`DELETE FROM projects WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}
