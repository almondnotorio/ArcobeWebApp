import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { Project } from '@/types';

export async function GET(req: NextRequest) {
  const sql = getDb();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured') === 'true';

  let projects: Project[];

  if (category && category !== 'All' && featured) {
    projects = await sql`SELECT * FROM projects WHERE category = ${category} AND featured = 1 ORDER BY created_at DESC` as Project[];
  } else if (category && category !== 'All') {
    projects = await sql`SELECT * FROM projects WHERE category = ${category} ORDER BY created_at DESC` as Project[];
  } else if (featured) {
    projects = await sql`SELECT * FROM projects WHERE featured = 1 ORDER BY created_at DESC` as Project[];
  } else {
    projects = await sql`SELECT * FROM projects ORDER BY created_at DESC` as Project[];
  }

  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sql = getDb();
  const data = await req.json();

  const rows = await sql`
    INSERT INTO projects (title, category, location, year, description, client, value, size, featured, cover_image, images)
    VALUES (
      ${data.title}, ${data.category}, ${data.location}, ${data.year}, ${data.description},
      ${data.client || ''}, ${data.value || ''}, ${data.size || ''},
      ${data.featured ? 1 : 0}, ${data.cover_image || ''}, ${JSON.stringify(data.images || [])}
    )
    RETURNING id
  `;

  return NextResponse.json({ id: rows[0].id });
}
