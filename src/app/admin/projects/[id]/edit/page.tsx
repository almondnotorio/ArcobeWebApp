import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { getDb } from '@/lib/db';
import AdminLayout from '@/components/admin/AdminLayout';
import ProjectForm from '@/components/admin/ProjectForm';
import { Project } from '@/types';

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token || !verifyToken(token)) redirect('/admin');

  const { id } = await params;
  const sql = getDb();
  const rows = await sql`SELECT * FROM projects WHERE id = ${id}` as unknown as Project[];
  const project = rows[0];
  if (!project) notFound();

  return (
    <AdminLayout>
      <ProjectForm
        projectId={project.id}
        initial={{
          title: project.title,
          category: project.category,
          location: project.location,
          year: project.year,
          description: project.description,
          client: project.client,
          value: project.value,
          size: project.size,
          featured: project.featured,
          cover_image: project.cover_image,
          images: project.images,
        }}
      />
    </AdminLayout>
  );
}
