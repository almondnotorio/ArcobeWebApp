import { getDb } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomeClient from '@/components/HomeClient';
import { Project } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let featuredProjects: Project[] = [];
  let settings: Record<string, string> = {};

  try {
    const sql = getDb();
    const [projectRows, settingsRows] = await Promise.all([
      sql`SELECT * FROM projects WHERE featured = 1 LIMIT 6` as Promise<Project[]>,
      sql`SELECT key, value FROM settings` as Promise<{ key: string; value: string }[]>,
    ]);
    featuredProjects = projectRows;
    for (const r of settingsRows) settings[r.key] = r.value;
  } catch {
    // DB not ready yet — page renders with defaults baked into HomeClient
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HomeClient settings={settings} featuredProjects={featuredProjects} />
      <Footer settings={settings} />
    </div>
  );
}
