import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { getDb } from '@/lib/db';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { Building2, Settings, PlusCircle, Eye } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token || !verifyToken(token)) redirect('/admin');

  const sql = getDb();
  const [totalRow] = await sql`SELECT COUNT(*) AS count FROM projects`;
  const [featuredRow] = await sql`SELECT COUNT(*) AS count FROM projects WHERE featured = 1`;
  const recentProjects = await sql`SELECT id, title, category, year FROM projects ORDER BY created_at DESC LIMIT 5` as Array<{ id: number; title: string; category: string; year: string }>;

  const totalProjects = Number(totalRow.count);
  const featuredCount = Number(featuredRow.count);

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-acc-navy mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-8">Welcome back. Here&apos;s an overview of your website.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500 font-medium">Total Projects</span>
              <Building2 size={20} className="text-acc-navy" />
            </div>
            <div className="text-4xl font-bold text-acc-navy">{totalProjects}</div>
            <Link href="/admin/projects" className="text-xs text-acc-gold mt-2 inline-block hover:underline">Manage projects →</Link>
          </div>
          <div className="bg-white border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500 font-medium">Featured Projects</span>
              <Eye size={20} className="text-acc-navy" />
            </div>
            <div className="text-4xl font-bold text-acc-navy">{featuredCount}</div>
            <p className="text-xs text-gray-400 mt-2">Shown on the homepage</p>
          </div>
          <div className="bg-acc-navy text-white p-6">
            <p className="text-sm text-gray-300 mb-4">Quick Actions</p>
            <div className="space-y-3">
              <Link href="/admin/projects/new" className="flex items-center gap-2 text-sm hover:text-acc-gold transition-colors">
                <PlusCircle size={16} /> Add New Project
              </Link>
              <Link href="/admin/settings" className="flex items-center gap-2 text-sm hover:text-acc-gold transition-colors">
                <Settings size={16} /> Site Settings
              </Link>
              <Link href="/" target="_blank" className="flex items-center gap-2 text-sm hover:text-acc-gold transition-colors">
                <Eye size={16} /> View Website
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="font-bold text-acc-navy">Recent Projects</h2>
            <Link href="/admin/projects" className="text-sm text-acc-gold hover:underline">View all</Link>
          </div>
          <div className="divide-y">
            {recentProjects.map(p => (
              <div key={p.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                <div>
                  <p className="font-medium text-acc-navy">{p.title}</p>
                  <p className="text-sm text-gray-400">{p.category} · {p.year}</p>
                </div>
                <Link href={`/admin/projects/${p.id}/edit`} className="text-sm text-acc-gold hover:underline">Edit</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
