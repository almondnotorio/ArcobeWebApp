import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { getDb } from '@/lib/db';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminProjectsClient from '@/components/admin/AdminProjectsClient';
import { Project } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token || !verifyToken(token)) redirect('/admin');

  const sql = getDb();
  const projects = await sql`SELECT * FROM projects ORDER BY created_at DESC` as Project[];

  return (
    <AdminLayout>
      <AdminProjectsClient projects={projects} />
    </AdminLayout>
  );
}
