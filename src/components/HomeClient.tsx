'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Building2, ChevronDown } from 'lucide-react';
import { Project } from '@/types';

interface Props {
  settings: Record<string, string>;
  featuredProjects: Project[];
}

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatItem({ value, label, started }: { value: string; label: string; started: boolean }) {
  const num = parseInt(value.replace(/\D/g, '')) || 0;
  const suffix = value.replace(/[\d,]/g, '');
  const count = useCountUp(num, 2000, started);
  return (
    <div className="border-t-2 border-acc-gold pt-6">
      <div className="text-5xl lg:text-6xl font-bold text-white mb-2">
        {count}{suffix}
      </div>
      <div className="text-gray-400 text-sm tracking-widest uppercase">{label}</div>
    </div>
  );
}

const MARKETS = [
  {
    title: 'Buildings',
    desc: 'Commercial towers, institutional facilities, and residential communities built to last.',
    href: '/projects?category=Commercial',
    gradient: 'from-acc-navy-dark/80 to-acc-navy/60',
  },
  {
    title: 'Civil',
    desc: 'Roads, bridges, drainage, and public infrastructure connecting communities.',
    href: '/projects?category=Infrastructure',
    gradient: 'from-black/70 to-black/40',
  },
  {
    title: 'Industrial',
    desc: 'Warehouses, manufacturing plants, and logistics facilities engineered for performance.',
    href: '/projects?category=Industrial',
    gradient: 'from-acc-navy-dark/90 to-acc-navy/50',
  },
];

const NEWS = [
  {
    date: 'March 2025',
    category: 'Company News',
    title: 'Arcobe Completes Major Infrastructure Project Ahead of Schedule',
    excerpt: 'Our team delivered a critical road rehabilitation project weeks ahead of the contractual deadline, setting a new benchmark for the region.',
  },
  {
    date: 'January 2025',
    category: 'Awards',
    title: 'ACC Recognized as Top PCAB Contractor for Consecutive Year',
    excerpt: 'For the second year running, Arcobe Construction Corporation received recognition from the Philippine Contractors Accreditation Board.',
  },
  {
    date: 'November 2024',
    category: 'Innovation',
    title: 'Adopting BIM Technology Across All Major Projects',
    excerpt: 'Building Information Modelling is now standard practice across our project pipeline, improving coordination and reducing costly rework.',
  },
];

export default function HomeClient({ settings, featuredProjects }: Props) {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.2 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const heroTitle = settings.hero_title || 'We Build\nWhat Matters';
  const heroSubtitle = settings.hero_subtitle || 'Arcobe Construction Corporation delivers landmark projects across the Philippines — on time, on budget, and built to endure.';

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          {settings.hero_image ? (
            <Image src={settings.hero_image} alt="Hero" fill className="object-cover" priority />
          ) : (
            <Image src="/hero-bg.jpg" alt="Hero" fill className="object-cover" priority />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pb-24 lg:pb-32">
          <p className="text-acc-gold text-xs font-bold tracking-[0.3em] uppercase mb-6">
            Arcobe Construction Corporation
          </p>
          <h1 className="text-6xl lg:text-8xl font-bold text-white leading-none mb-8 whitespace-pre-line">
            {heroTitle}
          </h1>
          <p className="text-gray-300 text-lg max-w-lg leading-relaxed mb-10">
            {heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 bg-acc-gold text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-yellow-600 transition-colors"
            >
              Explore Our Work <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-white/50 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:border-white hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <a href="#stats" className="absolute bottom-6 right-8 z-10 text-white/50 hover:text-white transition-colors flex flex-col items-center gap-1">
          <span className="text-xs tracking-widest">SCROLL</span>
          <ChevronDown size={20} className="animate-bounce" />
        </a>
      </section>

      {/* ─── STATS ────────────────────────────────────────────────── */}
      <section id="stats" ref={statsRef} className="bg-[#0d0d0d] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
            <StatItem value={settings.stats_projects || '250+'} label="Projects Completed" started={statsVisible} />
            <StatItem value={settings.stats_years || '15+'} label="Years of Excellence" started={statsVisible} />
            <StatItem value={settings.stats_clients || '120+'} label="Satisfied Clients" started={statsVisible} />
            <StatItem value={settings.stats_employees || '500+'} label="Expert Professionals" started={statsVisible} />
          </div>
        </div>
      </section>

      {/* ─── MARKETS ──────────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
          <p className="text-acc-gold text-xs font-bold tracking-[0.3em] uppercase mb-4">Our Expertise</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-acc-navy">What We Build</h2>
            <Link href="/projects" className="inline-flex items-center gap-2 text-acc-navy text-sm font-bold tracking-widest uppercase border-b border-acc-navy pb-1 hover:text-acc-gold hover:border-acc-gold transition-colors">
              View All Markets <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {MARKETS.map((market, i) => {
              const img = settings[`service_${i + 1}_image`];
              const title = settings[`service_${i + 1}_title`] || market.title;
              const link = settings[`service_${i + 1}_link`] || market.href;
              return (
                <Link
                  key={market.title}
                  href={link}
                  className="group relative h-[480px] overflow-hidden block"
                >
                  {img ? (
                    <Image
                      src={img}
                      alt={title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-acc-navy/80 flex items-center justify-center">
                      <Building2 size={48} className="text-white/20" />
                    </div>
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-t ${market.gradient} transition-opacity duration-300 group-hover:opacity-90`} />
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-3xl font-bold text-white mb-3">{title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {market.desc}
                      </p>
                      <div className="flex items-center gap-2 text-acc-gold text-sm font-bold tracking-widest uppercase">
                        Learn More <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PROJECTS ────────────────────────────────────── */}
      {featuredProjects.length > 0 && (
        <section className="bg-acc-light py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
              <div>
                <p className="text-acc-gold text-xs font-bold tracking-[0.3em] uppercase mb-4">Portfolio</p>
                <h2 className="text-4xl lg:text-5xl font-bold text-acc-navy">Featured Projects</h2>
              </div>
              <Link href="/projects" className="inline-flex items-center gap-2 text-acc-navy text-sm font-bold tracking-widest uppercase border-b border-acc-navy pb-1 hover:text-acc-gold hover:border-acc-gold transition-colors">
                All Projects <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map(p => (
                <Link key={p.id} href={`/projects/${p.id}`} className="group bg-white overflow-hidden">
                  <div className="relative h-60 bg-gray-200 overflow-hidden">
                    {p.cover_image && !p.cover_image.startsWith('/placeholder') ? (
                      <Image src={p.cover_image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 bg-acc-navy flex items-center justify-center">
                        <Building2 size={40} className="text-white/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-6 border-b border-gray-100">
                    <p className="text-acc-gold text-xs font-bold tracking-widest uppercase mb-2">{p.category}</p>
                    <h3 className="text-lg font-bold text-acc-navy group-hover:text-acc-gold transition-colors leading-snug mb-2">
                      {p.title}
                    </h3>
                    <p className="text-gray-500 text-sm">{p.location} · {p.year}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── ABOUT STRIP ──────────────────────────────────────────── */}
      <section className="bg-acc-navy py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-acc-gold text-xs font-bold tracking-[0.3em] uppercase mb-6">About Arcobe</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-8">
                100% Committed<br />to Every Build
              </h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Arcobe Construction Corporation is a PCAB-licensed general contractor serving developers, government agencies, and private clients across the Philippines. We combine engineering expertise with a relentless commitment to quality, safety, and on-time delivery.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed mb-10">
                From groundbreaking to turnover, our in-house teams handle every phase — design coordination, structural works, MEP, and fit-out — backed by an ISO-certified quality management system.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/about" className="inline-flex items-center gap-2 bg-acc-gold text-white px-7 py-3 text-sm font-bold tracking-widest uppercase hover:bg-yellow-600 transition-colors">
                  Learn More <ArrowRight size={16} />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 border border-white/30 text-white px-7 py-3 text-sm font-bold tracking-widest uppercase hover:border-white/60 transition-colors">
                  Work With Us
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-px bg-white/5">
              {[
                { num: '98%', label: 'Client Satisfaction Rate' },
                { num: '₱20B+', label: 'Total Project Value' },
                { num: '32', label: 'Industry Awards' },
                { num: '100%', label: 'Safety Record' },
              ].map(item => (
                <div key={item.label} className="bg-acc-navy p-10">
                  <div className="text-4xl font-bold text-acc-gold mb-3">{item.num}</div>
                  <div className="text-gray-400 text-sm tracking-wide uppercase">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEWS / INSIGHTS ──────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <p className="text-acc-gold text-xs font-bold tracking-[0.3em] uppercase mb-4">Latest Updates</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-acc-navy">News &amp; Insights</h2>
            </div>
            <Link href="/about" className="inline-flex items-center gap-2 text-acc-navy text-sm font-bold tracking-widest uppercase border-b border-acc-navy pb-1 hover:text-acc-gold hover:border-acc-gold transition-colors">
              All News <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {NEWS.map(article => (
              <article key={article.title} className="group cursor-default">
                <div className="h-52 bg-acc-light mb-6 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-acc-navy to-acc-navy-dark flex items-center justify-center">
                    <Building2 size={36} className="text-white/10" />
                  </div>
                </div>
                <p className="text-acc-gold text-xs font-bold tracking-widest uppercase mb-2">{article.category} · {article.date}</p>
                <h3 className="text-lg font-bold text-acc-navy group-hover:text-acc-gold transition-colors leading-snug mb-3">
                  {article.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{article.excerpt}</p>
                <div className="flex items-center gap-1 text-acc-navy text-xs font-bold tracking-widest uppercase mt-4 group-hover:text-acc-gold transition-colors">
                  Read More <ArrowRight size={12} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ───────────────────────────────────────────── */}
      <section className="relative bg-acc-navy overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero-bg.jpg" alt="" fill className="object-cover opacity-10" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div>
            <p className="text-acc-gold text-xs font-bold tracking-[0.3em] uppercase mb-4">Start a Project</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              Ready to Build<br />Something Great?
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-acc-gold text-white px-10 py-5 text-sm font-bold tracking-widest uppercase hover:bg-yellow-600 transition-colors whitespace-nowrap">
              Get a Free Quote <ArrowRight size={16} />
            </Link>
            <Link href="/projects" className="inline-flex items-center gap-2 border border-white/40 text-white px-10 py-5 text-sm font-bold tracking-widest uppercase hover:border-white/70 hover:bg-white/5 transition-colors whitespace-nowrap">
              See Our Work
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
