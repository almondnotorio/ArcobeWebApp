import { getDb } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactClient from '@/components/ContactClient';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const sql = getDb();
  const settingsRows = await sql`SELECT key, value FROM settings` as { key: string; value: string }[];
  const settings: Record<string, string> = {};
  for (const r of settingsRows) settings[r.key] = r.value;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ContactClient settings={settings} />
      <Footer settings={settings} />
    </div>
  );
}
