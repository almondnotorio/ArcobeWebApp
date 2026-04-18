import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { getDb } from '@/lib/db';
import AdminLayout from '@/components/admin/AdminLayout';
import ServicesClient from '@/components/admin/ServicesClient';

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token || !verifyToken(token)) redirect('/admin');

  const sql = getDb();
  const rows = await sql`SELECT key, value FROM settings` as unknown as { key: string; value: string }[];
  const settings: Record<string, string> = {};
  for (const r of rows) settings[r.key] = r.value;

  return (
    <AdminLayout>
      <ServicesClient settings={settings} />
    </AdminLayout>
  );
}
