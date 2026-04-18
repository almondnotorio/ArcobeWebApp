import { getDb } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight, Shield, Clock, Star, Wrench } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const sql = getDb();
  const settingsRows = await sql`SELECT key, value FROM settings` as unknown as { key: string; value: string }[];
  const settings: Record<string, string> = {};
  for (const r of settingsRows) settings[r.key] = r.value;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="bg-acc-navy pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-acc-gold font-semibold tracking-widest text-sm mb-3">WHO WE ARE</p>
          <h1 className="text-5xl font-bold text-white max-w-2xl">Building More Than Structures</h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-acc-gold font-semibold tracking-widest text-sm mb-3">OUR STORY</p>
            <h2 className="text-4xl font-bold text-acc-navy mb-6">
              {settings.about_title || 'Who We Are'}
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>{settings.about_text || 'Arcobe Construction Corporation (ACC) is a premier construction company dedicated to delivering high-quality building solutions.'}</p>
              <p>Founded with a vision to transform the Philippine construction landscape, we have grown from a small contracting firm to a full-service construction corporation capable of handling projects of any scale and complexity.</p>
              <p>Our success is built on three pillars: exceptional craftsmanship, rigorous project management, and unwavering commitment to our clients&apos; vision.</p>
            </div>
            <Link href="/contact" className="inline-flex items-center gap-2 mt-8 bg-acc-navy text-white px-7 py-3 font-bold hover:bg-acc-navy-dark transition-colors">
              Work With Us <ArrowRight size={16} />
            </Link>
          </div>
          <div className="relative">
            <div className="bg-acc-light p-8 relative">
              <div className="bg-acc-navy p-8 text-white">
                <div className="text-5xl font-bold text-acc-gold mb-2">{settings.stats_years || '15+'}</div>
                <div className="text-xl font-semibold mb-4">Years of Excellence</div>
                <p className="text-gray-300 text-sm leading-relaxed">Building landmark structures that define communities and drive progress across the Philippines since 2009.</p>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-acc-gold opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-acc-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-acc-gold font-semibold tracking-widest text-sm mb-3">WHAT DRIVES US</p>
            <h2 className="text-4xl font-bold text-acc-navy">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Safety First', desc: 'Zero-accident culture with rigorous safety protocols on every jobsite.' },
              { icon: Star, title: 'Quality', desc: 'Uncompromising standards in materials, workmanship, and finishing.' },
              { icon: Clock, title: 'Reliability', desc: 'Consistent on-time delivery and transparent communication throughout.' },
              { icon: Wrench, title: 'Innovation', desc: 'Embracing the latest construction technology and sustainable practices.' },
            ].map(v => (
              <div key={v.title} className="bg-white p-8 text-center">
                <div className="w-16 h-16 bg-acc-navy/5 rounded-full flex items-center justify-center mx-auto mb-5">
                  <v.icon size={28} className="text-acc-navy" />
                </div>
                <h3 className="text-lg font-bold text-acc-navy mb-3">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-20 bg-acc-navy text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-acc-gold font-semibold tracking-widest text-sm mb-3">OUR JOURNEY</p>
            <h2 className="text-4xl font-bold">Company Milestones</h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 hidden lg:block" />
            <div className="space-y-8 lg:space-y-12">
              {[
                { year: '2009', event: 'Arcobe Construction Corporation founded in Metro Manila.' },
                { year: '2012', event: 'Awarded first major government infrastructure contract worth ₱200M.' },
                { year: '2015', event: 'Expanded to residential development sector; completed first 500-unit condominium project.' },
                { year: '2018', event: 'ISO 9001:2015 certification achieved; workforce expanded to 300+ professionals.' },
                { year: '2021', event: 'Completed ₱1.5B luxury resort hotel; entered international market.' },
                { year: '2024', event: 'Over ₱20B in total project value delivered; 250+ landmark projects completed.' },
              ].map((m, i) => (
                <div key={m.year} className={`flex items-center gap-8 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className="bg-white/5 border border-white/10 p-6 inline-block max-w-sm">
                      <div className="text-acc-gold font-bold text-xl mb-2">{m.year}</div>
                      <p className="text-gray-300 text-sm">{m.event}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-acc-gold shrink-0 hidden lg:block" />
                  <div className="flex-1 hidden lg:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}
