'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Save, Upload, Loader2, CheckCircle } from 'lucide-react';

export default function SettingsClient({ settings: initial }: { settings: Record<string, string> }) {
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const heroImgRef = useRef<HTMLInputElement>(null);

  const set = (key: string, value: string) => setSettings(s => ({ ...s, [key]: value }));

  const uploadHeroImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (res.ok) {
      const data = await res.json();
      set('hero_image', data.url);
    }
    setUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const textField = (label: string, key: string, opts?: { placeholder?: string; multiline?: boolean }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</label>
      {opts?.multiline ? (
        <textarea rows={3} value={settings[key] || ''} onChange={e => set(key, e.target.value)} placeholder={opts?.placeholder}
          className="w-full border border-gray-200 px-4 py-2.5 text-acc-navy focus:border-acc-navy outline-none resize-none text-sm" />
      ) : (
        <input type="text" value={settings[key] || ''} onChange={e => set(key, e.target.value)} placeholder={opts?.placeholder}
          className="w-full border border-gray-200 px-4 py-2.5 text-acc-navy focus:border-acc-navy outline-none text-sm" />
      )}
    </div>
  );

  return (
    <form onSubmit={handleSave} className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-acc-navy">Site Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage website content and contact information.</p>
        </div>
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 bg-acc-navy text-white px-6 py-2.5 text-sm font-semibold hover:bg-acc-gold transition-colors disabled:opacity-60">
          {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <CheckCircle size={15} /> : <Save size={15} />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-white border border-gray-100 p-6 space-y-5">
          <h2 className="font-bold text-acc-navy border-b pb-3">Hero Section</h2>
          {textField('Hero Title', 'hero_title', { placeholder: 'Building the Future,...', multiline: true })}
          {textField('Hero Subtitle', 'hero_subtitle', { multiline: true })}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Hero Background Image</label>
            <input ref={heroImgRef} type="file" accept="image/*" className="hidden" onChange={uploadHeroImage} />
            <div className="flex items-start gap-4">
              {settings.hero_image && settings.hero_image !== '/hero-bg.jpg' && (
                <div className="relative w-32 h-20 overflow-hidden border border-gray-200 shrink-0">
                  <Image src={settings.hero_image} alt="Hero" fill className="object-cover" />
                </div>
              )}
              <button type="button" onClick={() => heroImgRef.current?.click()} disabled={uploading}
                className="flex items-center gap-2 border-2 border-dashed border-gray-200 hover:border-acc-navy text-gray-400 hover:text-acc-navy transition-colors px-5 py-3 text-sm">
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white border border-gray-100 p-6 space-y-5">
          <h2 className="font-bold text-acc-navy border-b pb-3">Homepage Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            {textField('Projects Completed', 'stats_projects', { placeholder: '250+' })}
            {textField('Years of Experience', 'stats_years', { placeholder: '15+' })}
            {textField('Satisfied Clients', 'stats_clients', { placeholder: '120+' })}
            {textField('Employees', 'stats_employees', { placeholder: '500+' })}
          </div>
        </div>

        {/* About */}
        <div className="bg-white border border-gray-100 p-6 space-y-5">
          <h2 className="font-bold text-acc-navy border-b pb-3">About Section</h2>
          {textField('About Title', 'about_title', { placeholder: 'Who We Are' })}
          {textField('About Text', 'about_text', { multiline: true })}
        </div>

        {/* Contact */}
        <div className="bg-white border border-gray-100 p-6 space-y-5">
          <h2 className="font-bold text-acc-navy border-b pb-3">Contact Information</h2>
          {textField('Email', 'contact_email', { placeholder: 'info@arcobeconstruction.com' })}
          {textField('Phone', 'contact_phone', { placeholder: '+63 2 8XXX XXXX' })}
          {textField('Address', 'contact_address', { placeholder: 'Metro Manila, Philippines' })}
        </div>
      </div>
    </form>
  );
}
