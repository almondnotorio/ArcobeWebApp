/**
 * One-time database initialization script.
 * Run once after creating your Neon project:
 *
 *   DATABASE_URL="postgres://..." node scripts/init-db.mjs
 *
 * Or set DATABASE_URL in .env.local first, then:
 *   node --env-file=.env.local scripts/init-db.mjs
 */

import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set.');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function main() {
  console.log('Creating tables...');

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

  console.log('Tables ready.');

  // Default admin user
  const existingAdmin = await sql`SELECT id FROM admin_users WHERE username = 'admin'`;
  if (existingAdmin.length === 0) {
    const hash = bcrypt.hashSync('arcobe2024', 10);
    await sql`INSERT INTO admin_users (username, password) VALUES ('admin', ${hash})`;
    console.log('Admin user created (username: admin, password: arcobe2024).');
  } else {
    console.log('Admin user already exists, skipping.');
  }

  // Default settings
  const defaultSettings = [
    ['hero_title', 'Building the Future,\nOne Project at a Time'],
    ['hero_subtitle', 'Arcobe Construction Corporation delivers excellence in commercial, residential, and infrastructure construction across the Philippines.'],
    ['hero_image', '/hero-bg.jpg'],
    ['about_title', 'Who We Are'],
    ['about_text', 'Arcobe Construction Corporation (ACC) is a premier construction company dedicated to delivering high-quality building solutions. With decades of combined experience, our team of skilled engineers, architects, and craftsmen bring every vision to life with precision and integrity.'],
    ['stats_projects', '250+'],
    ['stats_years', '15+'],
    ['stats_clients', '120+'],
    ['stats_employees', '500+'],
    ['contact_email', 'info@arcobeconstruction.com'],
    ['contact_phone', '+63 2 8XXX XXXX'],
    ['contact_address', 'Metro Manila, Philippines'],
  ];

  for (const [key, value] of defaultSettings) {
    await sql`
      INSERT INTO settings (key, value)
      VALUES (${key}, ${value})
      ON CONFLICT (key) DO NOTHING
    `;
  }
  console.log('Default settings seeded.');

  // Sample projects
  const existing = await sql`SELECT COUNT(*) AS c FROM projects`;
  if (Number(existing[0].c) === 0) {
    const sampleProjects = [
      { title: 'Metro Office Tower', category: 'Commercial', location: 'Makati, Metro Manila', year: '2023', description: 'A 32-story mixed-use commercial tower featuring premium office spaces and retail podium with state-of-the-art facilities.', client: 'Metro Properties Inc.', value: '₱2.4B', size: '45,000 sqm', featured: 1, cover_image: '', images: '[]' },
      { title: 'Riverside Residential Complex', category: 'Residential', location: 'Pasig, Metro Manila', year: '2023', description: 'A modern residential development comprising 5 towers with 1,200 units, amenities, and green spaces.', client: 'Riverside Homes Corp.', value: '₱1.8B', size: '32,000 sqm', featured: 1, cover_image: '', images: '[]' },
      { title: 'National Highway Bridge', category: 'Infrastructure', location: 'Bulacan', year: '2022', description: 'A critical infrastructure project spanning 480 meters, improving connectivity and reducing travel time for thousands of commuters.', client: 'DPWH', value: '₱950M', size: '480m span', featured: 1, cover_image: '', images: '[]' },
      { title: 'Industrial Warehouse Complex', category: 'Industrial', location: 'Cavite', year: '2022', description: 'A large-scale industrial facility with 8 warehouse units, loading docks, and administrative offices.', client: 'Pacific Logistics Corp.', value: '₱680M', size: '28,000 sqm', featured: 0, cover_image: '', images: '[]' },
      { title: 'Medical Center Expansion', category: 'Institutional', location: 'Quezon City', year: '2023', description: 'Expansion of a major medical center adding a new 10-story patient wing with 300 beds and specialized treatment facilities.', client: 'Metro Health Systems', value: '₱1.2B', size: '22,000 sqm', featured: 0, cover_image: '', images: '[]' },
      { title: 'Luxury Resort Hotel', category: 'Hospitality', location: 'Batangas', year: '2021', description: '5-star beachfront resort hotel featuring 250 rooms, conference facilities, multiple dining venues, and a world-class spa.', client: 'Coastal Resorts Inc.', value: '₱1.5B', size: '35,000 sqm', featured: 0, cover_image: '', images: '[]' },
    ];

    for (const p of sampleProjects) {
      await sql`
        INSERT INTO projects (title, category, location, year, description, client, value, size, featured, cover_image, images)
        VALUES (${p.title}, ${p.category}, ${p.location}, ${p.year}, ${p.description}, ${p.client}, ${p.value}, ${p.size}, ${p.featured}, ${p.cover_image}, ${p.images})
      `;
    }
    console.log('Sample projects seeded.');
  } else {
    console.log('Projects table already has data, skipping seed.');
  }

  console.log('✓ Database initialization complete.');
}

main().catch((err) => {
  console.error('Initialization failed:', err);
  process.exit(1);
});
