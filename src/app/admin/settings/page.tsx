import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { getDb } from '@/lib/db';
import AdminLayout from '@/components/admin/AdminLayout';
import SettingsClient from '@/components/admin/SettingsClient';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token || !verifyToken(token)) redirect('/admin');

  const sql = getDb();
  const settingsRows = await sql`SELECT key, value FROM settings` as unknown as { key: string; value: string }[];
  const settings: Record<string, string> = {};
  for (const r of settingsRows) settings[r.key] = r.value;

  return (
    <AdminLayout>
      <SettingsClient settings={settings} />
    </AdminLayout>
  );
}
