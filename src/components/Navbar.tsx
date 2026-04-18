'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';

const NAV_LINKS = [
  { href: '/projects', label: 'What We Build' },
  {
    label: 'Markets',
    children: [
      { href: '/projects?category=Commercial', label: 'Buildings' },
      { href: '/projects?category=Infrastructure', label: 'Civil' },
      { href: '/projects?category=Industrial', label: 'Industrial' },
      { href: '/projects?category=Institutional', label: 'Institutional' },
    ],
  },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Careers' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const textClass = scrolled ? 'text-gray-800' : 'text-white';
  const hoverClass = 'hover:text-acc-gold transition-colors duration-200';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}
      onMouseLeave={() => setDropdown(null)}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image src="/logo.png" alt="ACC Logo" width={48} height={48} className="h-12 w-auto object-contain" />
            <div className={`hidden sm:block leading-none ${textClass}`}>
              <div className="font-bold text-base tracking-wider">ARCOBE</div>
              <div className="text-[10px] tracking-[0.2em] opacity-70">CONSTRUCTION CORP.</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setDropdown(link.label)}
                >
                  <button className={`flex items-center gap-1 text-sm font-medium tracking-wide ${textClass} ${hoverClass}`}>
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform ${dropdown === link.label ? 'rotate-180' : ''}`} />
                  </button>
                  {dropdown === link.label && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white shadow-xl border-t-2 border-acc-gold py-2">
                      {link.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-5 py-3 text-sm text-gray-700 hover:bg-acc-light hover:text-acc-navy font-medium transition-colors"
                          onClick={() => setDropdown(null)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href!}
                  className={`text-sm font-medium tracking-wide ${textClass} ${hoverClass}`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/contact"
              className={`text-sm font-bold tracking-widest uppercase border px-5 py-2 transition-colors ${
                scrolled
                  ? 'border-acc-navy text-acc-navy hover:bg-acc-navy hover:text-white'
                  : 'border-white text-white hover:bg-white hover:text-acc-navy'
              }`}
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`lg:hidden ${textClass}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-6 py-6 flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              link.children ? (
                <div key={link.label}>
                  <div className="text-gray-500 text-xs font-bold tracking-widest uppercase py-3 border-b border-gray-100">
                    {link.label}
                  </div>
                  {link.children.map(child => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setOpen(false)}
                      className="block pl-4 py-2.5 text-gray-700 text-sm font-medium hover:text-acc-gold transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href!}
                  onClick={() => setOpen(false)}
                  className="text-gray-800 font-medium py-3 border-b border-gray-100 text-sm hover:text-acc-gold transition-colors"
                >
                  {link.label}
                </Link>
              )
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-4 bg-acc-navy text-white text-center py-4 text-sm font-bold tracking-widest uppercase hover:bg-acc-gold transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
