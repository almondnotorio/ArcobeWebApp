import { getDb } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectsClient from '@/components/ProjectsClient';
import { Project } from '@/types';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const sql = getDb();
  const projects = await sql`SELECT * FROM projects ORDER BY created_at DESC` as Project[];
  const settingsRows = await sql`SELECT key, value FROM settings` as { key: string; value: string }[];
  const settings: Record<string, string> = {};
  for (const r of settingsRows) settings[r.key] = r.value;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ProjectsClient projects={projects} />
      <Footer settings={settings} />
    </div>
  );
}
