import { getDb } from '@/lib/db';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Building2, Users, Ruler } from 'lucide-react';
import { Project } from '@/types';

export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sql = getDb();
  const rows = await sql`SELECT * FROM projects WHERE id = ${id}` as Project[];
  const project = rows[0];
  if (!project) notFound();

  const settingsRows = await sql`SELECT key, value FROM settings` as { key: string; value: string }[];
  const settings: Record<string, string> = {};
  for (const r of settingsRows) settings[r.key] = r.value;

  const images: string[] = JSON.parse(project.images || '[]');
  const related = await sql`SELECT * FROM projects WHERE category = ${project.category} AND id != ${project.id} LIMIT 3` as Project[];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] bg-acc-navy">
        {project.cover_image && !project.cover_image.startsWith('/placeholder') ? (
          <Image src={project.cover_image} alt={project.title} fill className="object-cover opacity-50" priority />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 size={80} className="text-white/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-acc-navy/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-8 pb-12">
          <Link href="/projects" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft size={16} /> Back to Projects
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-acc-gold text-white text-xs font-bold px-3 py-1">{project.category}</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white">{project.title}</h1>
          <div className="flex flex-wrap gap-6 mt-4 text-gray-300 text-sm">
            <span className="flex items-center gap-1"><MapPin size={14} />{project.location}</span>
            <span className="flex items-center gap-1"><Calendar size={14} />{project.year}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-acc-navy mb-4">Project Overview</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{project.description}</p>

              {images.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-xl font-bold text-acc-navy mb-4">Project Gallery</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {images.map((img, i) => (
                      <div key={i} className="relative h-48 overflow-hidden">
                        <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-acc-light p-6">
                <h3 className="text-sm font-bold text-acc-navy tracking-widest mb-4">PROJECT DETAILS</h3>
                <div className="space-y-4">
                  {project.client && (
                    <div className="flex items-start gap-3">
                      <Users size={16} className="text-acc-gold mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Client</p>
                        <p className="text-sm font-semibold text-acc-navy">{project.client}</p>
                      </div>
                    </div>
                  )}
                  {project.value && (
                    <div className="flex items-start gap-3">
                      <Building2 size={16} className="text-acc-gold mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Project Value</p>
                        <p className="text-sm font-semibold text-acc-navy">{project.value}</p>
                      </div>
                    </div>
                  )}
                  {project.size && (
                    <div className="flex items-start gap-3">
                      <Ruler size={16} className="text-acc-gold mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Project Size</p>
                        <p className="text-sm font-semibold text-acc-navy">{project.size}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <Calendar size={16} className="text-acc-gold mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Year Completed</p>
                      <p className="text-sm font-semibold text-acc-navy">{project.year}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-acc-navy p-6 text-white">
                <h3 className="font-bold mb-2">Have a similar project?</h3>
                <p className="text-gray-300 text-sm mb-4">Our team is ready to bring your vision to life.</p>
                <Link href="/contact" className="block text-center bg-acc-gold text-white py-3 text-sm font-bold hover:bg-yellow-600 transition-colors">
                  Get a Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16 bg-acc-light">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-acc-navy mb-8">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(p => (
                <Link key={p.id} href={`/projects/${p.id}`} className="group bg-white shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative h-44 bg-acc-navy/10">
                    {p.cover_image && !p.cover_image.startsWith('/placeholder') ? (
                      <Image src={p.cover_image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-acc-navy to-acc-navy-dark flex items-center justify-center">
                        <Building2 size={40} className="text-white/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-acc-navy group-hover:text-acc-gold transition-colors">{p.title}</h3>
                    <p className="text-gray-400 text-sm">{p.location} · {p.year}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer settings={settings} />
    </div>
  );
}
