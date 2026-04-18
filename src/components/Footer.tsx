import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';

interface FooterProps {
  settings?: Record<string, string>;
}

export default function Footer({ settings }: FooterProps) {
  const email = settings?.contact_email || 'info@arcobeconstruction.com';
  const phone = settings?.contact_phone || '+63 2 8XXX XXXX';
  const address = settings?.contact_address || 'Metro Manila, Philippines';

  return (
    <footer className="bg-[#0d0d0d] text-white">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-8">
              <Image src="/logo.png" alt="ACC" width={44} height={44} className="object-contain brightness-0 invert" />
              <div>
                <div className="font-bold text-lg tracking-wider">ARCOBE</div>
                <div className="text-[10px] tracking-[0.25em] text-gray-500">CONSTRUCTION CORPORATION</div>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-8">
              Delivering excellence in construction since 2009. Building landmark structures that define communities and drive progress across the Philippines.
            </p>
            <div className="flex gap-3">
              {/* Facebook */}
              <a href="#" className="w-9 h-9 border border-white/10 flex items-center justify-center hover:border-acc-gold hover:text-acc-gold transition-colors text-gray-500">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="w-9 h-9 border border-white/10 flex items-center justify-center hover:border-acc-gold hover:text-acc-gold transition-colors text-gray-500">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              {/* Instagram */}
              <a href="#" className="w-9 h-9 border border-white/10 flex items-center justify-center hover:border-acc-gold hover:text-acc-gold transition-colors text-gray-500">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* What We Build */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-6">What We Build</h4>
            <ul className="space-y-3">
              {[
                ['Buildings', '/projects?category=Commercial'],
                ['Civil Works', '/projects?category=Infrastructure'],
                ['Industrial', '/projects?category=Industrial'],
                ['Institutional', '/projects?category=Institutional'],
                ['Hospitality', '/projects?category=Hospitality'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-6">Company</h4>
            <ul className="space-y-3">
              {[
                ['About Arcobe', '/about'],
                ['Our Projects', '/projects'],
                ['News & Insights', '/about'],
                ['Careers', '/contact'],
                ['Contact Us', '/contact'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin size={15} className="mt-0.5 shrink-0 text-acc-gold" />
                <span className="text-sm text-gray-500">{address}</span>
              </li>
              <li className="flex gap-3">
                <Phone size={15} className="mt-0.5 shrink-0 text-acc-gold" />
                <a href={`tel:${phone}`} className="text-sm text-gray-500 hover:text-white transition-colors">{phone}</a>
              </li>
              <li className="flex gap-3">
                <Mail size={15} className="mt-0.5 shrink-0 text-acc-gold" />
                <a href={`mailto:${email}`} className="text-sm text-gray-500 hover:text-white transition-colors">{email}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Arcobe Construction Corporation. All rights reserved.</p>
          <p>PCAB Licensed · ISO Certified</p>
        </div>
      </div>
    </footer>
  );
}
