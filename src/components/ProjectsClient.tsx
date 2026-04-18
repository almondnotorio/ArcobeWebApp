'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Building2, MapPin, Calendar } from 'lucide-react';
import { Project } from '@/types';

const CATEGORIES = ['All', 'Commercial', 'Residential', 'Infrastructure', 'Industrial', 'Institutional', 'Hospitality'];

const CATEGORY_COLORS: Record<string, string> = {
  Commercial: 'bg-blue-100 text-blue-800',
  Residential: 'bg-green-100 text-green-800',
  Infrastructure: 'bg-orange-100 text-orange-800',
  Industrial: 'bg-gray-100 text-gray-800',
  Institutional: 'bg-purple-100 text-purple-800',
  Hospitality: 'bg-pink-100 text-pink-800',
};

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState('All');

  const filtered = active === 'All' ? projects : projects.filter(p => p.category === active);

  return (
    <>
      {/* Page Header */}
      <section className="bg-acc-navy pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-acc-gold font-semibold tracking-widest text-sm mb-3">PORTFOLIO</p>
          <h1 className="text-5xl font-bold text-white">Our Work</h1>
          <p className="text-gray-300 mt-4 max-w-xl">
            Explore our portfolio of landmark projects spanning commercial, residential, infrastructure, and more across the Philippines.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-white border-b sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-4 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                  active === cat
                    ? 'bg-acc-navy text-white'
                    : 'text-gray-500 hover:text-acc-navy hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="bg-acc-light py-16 flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <Building2 size={48} className="mx-auto mb-4 opacity-30" />
              <p>No projects in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(p => (
                <Link key={p.id} href={`/projects/${p.id}`} className="group bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative h-60 bg-gray-200 overflow-hidden">
                    {p.cover_image && !p.cover_image.startsWith('/placeholder') ? (
                      <Image src={p.cover_image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-acc-navy to-acc-navy-dark flex items-center justify-center">
                        <Building2 size={56} className="text-white/10" />
                        <span className="absolute text-white/20 text-6xl font-bold">{p.title[0]}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-acc-navy/0 group-hover:bg-acc-navy/20 transition-colors" />
                    <div className="absolute top-4 left-4">
                      <span className={`text-xs font-semibold px-3 py-1 ${CATEGORY_COLORS[p.category] || 'bg-gray-100 text-gray-800'}`}>
                        {p.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-acc-navy group-hover:text-acc-gold transition-colors">{p.title}</h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPin size={13} />{p.location}</span>
                      <span className="flex items-center gap-1"><Calendar size={13} />{p.year}</span>
                    </div>
                    {p.value && (
                      <p className="text-acc-gold font-semibold text-sm mt-2">{p.value}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-3 line-clamp-2">{p.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
