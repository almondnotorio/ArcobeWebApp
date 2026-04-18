import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

let initialized = false;

export function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  if (!initialized) {
    initialized = true;
    initSchema(sql).catch(() => { initialized = false; });
  }
  return sql;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function initSchema(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id        SERIAL PRIMARY KEY,
      title     TEXT NOT NULL,
      category  TEXT NOT NULL,
      location  TEXT NOT NULL,
      year      TEXT NOT NULL,
      description TEXT NOT NULL,
      client    TEXT DEFAULT '',
      value     TEXT DEFAULT '',
      size      TEXT DEFAULT '',
      featured  INTEGER DEFAULT 0,
      cover_image TEXT DEFAULT '',
      images    TEXT DEFAULT '[]',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id       SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `;

  // Default admin user
  const admins = await sql`SELECT id FROM admin_users WHERE username = 'admin'`;
  if (admins.length === 0) {
    const hash = bcrypt.hashSync('arcobe2024', 10);
    await sql`INSERT INTO admin_users (username, password) VALUES ('admin', ${hash})`;
  }

  // Default settings
  const defaults: [string, string][] = [
    ['hero_title', 'We Build\nWhat Matters'],
    ['hero_subtitle', 'Arcobe Construction Corporation delivers landmark projects across the Philippines — on time, on budget, and built to endure.'],
    ['hero_image', '/hero-bg.jpg'],
    ['about_title', 'Who We Are'],
    ['about_text', 'Arcobe Construction Corporation (ACC) is a premier construction company dedicated to delivering high-quality building solutions.'],
    ['stats_projects', '250+'],
    ['stats_years', '15+'],
    ['stats_clients', '120+'],
    ['stats_employees', '500+'],
    ['contact_email', 'info@arcobeconstruction.com'],
    ['contact_phone', '+63 2 8XXX XXXX'],
    ['contact_address', 'Metro Manila, Philippines'],
    ['service_1_title', 'Buildings'],
    ['service_1_image', ''],
    ['service_1_link', '/projects?category=Commercial'],
    ['service_2_title', 'Civil'],
    ['service_2_image', ''],
    ['service_2_link', '/projects?category=Infrastructure'],
    ['service_3_title', 'Industrial'],
    ['service_3_image', ''],
    ['service_3_link', '/projects?category=Industrial'],
  ];

  for (const [key, value] of defaults) {
    await sql`INSERT INTO settings (key, value) VALUES (${key}, ${value}) ON CONFLICT (key) DO NOTHING`;
  }

  // Sample projects
  const count = await sql`SELECT COUNT(*) AS c FROM projects`;
  if (Number((count[0] as { c: string | number }).c) === 0) {
    const samples = [
      { title: 'Metro Office Tower', category: 'Commercial', location: 'Makati, Metro Manila', year: '2023', description: 'A 32-story mixed-use commercial tower featuring premium office spaces and retail podium.', client: 'Metro Properties Inc.', value: '₱2.4B', size: '45,000 sqm', featured: 1 },
      { title: 'Riverside Residential Complex', category: 'Residential', location: 'Pasig, Metro Manila', year: '2023', description: 'A modern residential development comprising 5 towers with 1,200 units and amenities.', client: 'Riverside Homes Corp.', value: '₱1.8B', size: '32,000 sqm', featured: 1 },
      { title: 'National Highway Bridge', category: 'Infrastructure', location: 'Bulacan', year: '2022', description: 'A critical infrastructure project spanning 480 meters, improving connectivity for thousands of commuters.', client: 'DPWH', value: '₱950M', size: '480m span', featured: 1 },
      { title: 'Industrial Warehouse Complex', category: 'Industrial', location: 'Cavite', year: '2022', description: 'A large-scale industrial facility with 8 warehouse units and loading docks.', client: 'Pacific Logistics Corp.', value: '₱680M', size: '28,000 sqm', featured: 0 },
      { title: 'Medical Center Expansion', category: 'Institutional', location: 'Quezon City', year: '2023', description: 'Expansion of a major medical center adding a new 10-story patient wing with 300 beds.', client: 'Metro Health Systems', value: '₱1.2B', size: '22,000 sqm', featured: 0 },
      { title: 'Luxury Resort Hotel', category: 'Hospitality', location: 'Batangas', year: '2021', description: '5-star beachfront resort hotel featuring 250 rooms and world-class amenities.', client: 'Coastal Resorts Inc.', value: '₱1.5B', size: '35,000 sqm', featured: 0 },
    ];
    for (const p of samples) {
      await sql`
        INSERT INTO projects (title, category, location, year, description, client, value, size, featured, cover_image, images)
        VALUES (${p.title}, ${p.category}, ${p.location}, ${p.year}, ${p.description}, ${p.client}, ${p.value}, ${p.size}, ${p.featured}, '', '[]')
      `;
    }
  }
}
