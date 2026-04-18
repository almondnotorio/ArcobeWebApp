'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, Loader2, Save, CheckCircle, X, ImageIcon } from 'lucide-react';

const CARD_DEFAULTS = [
  { key: '1', label: 'Card 1', descPlaceholder: 'e.g. Buildings' },
  { key: '2', label: 'Card 2', descPlaceholder: 'e.g. Civil' },
  { key: '3', label: 'Card 3', descPlaceholder: 'e.g. Industrial' },
];

export default function ServicesClient({ settings: initial }: { settings: Record<string, string> }) {
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const set = (key: string, value: string) => setSettings(s => ({ ...s, [key]: value }));

  const uploadImage = async (cardKey: string, file: File) => {
    setUploading(cardKey);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (res.ok) {
      const data = await res.json();
      set(`service_${cardKey}_image`, data.url);
    }
    setUploading(null);
  };

  const handleSave = async () => {
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

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-acc-navy">What We Build</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the three service cards shown on the homepage.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-acc-navy text-white px-6 py-2.5 text-sm font-semibold hover:bg-acc-gold transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <CheckCircle size={15} /> : <Save size={15} />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Preview banner */}
      <div className="bg-acc-navy/5 border border-acc-navy/10 px-5 py-3 mb-8 flex items-center justify-between">
        <p className="text-sm text-acc-navy font-medium">Live preview on homepage → <span className="font-bold">What We Build</span> section</p>
        <a href="/" target="_blank" className="text-xs text-acc-gold font-bold hover:underline">View Site ↗</a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {CARD_DEFAULTS.map(({ key, label, descPlaceholder }) => {
          const imgKey = `service_${key}_image`;
          const titleKey = `service_${key}_title`;
          const linkKey = `service_${key}_link`;
          const currentImage = settings[imgKey] || '';
          const currentTitle = settings[titleKey] || '';
          const currentLink = settings[linkKey] || '';

          return (
            <div key={key} className="bg-white border border-gray-100 shadow-sm overflow-hidden">
              {/* Image area - looks like the actual card */}
              <div className="relative h-52 bg-gray-100 overflow-hidden group">
                {currentImage ? (
                  <>
                    <Image src={currentImage} alt={currentTitle} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-acc-navy/80 to-acc-navy/30" />
                    <div className="absolute bottom-4 left-4">
                      <p className="text-white font-bold text-xl">{currentTitle || label}</p>
                      <p className="text-acc-gold text-xs font-bold tracking-widest mt-1 uppercase">Learn More ↗</p>
                    </div>
                    <button
                      onClick={() => set(imgKey, '')}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={13} />
                    </button>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-acc-navy/10 flex flex-col items-center justify-center gap-2 text-gray-400">
                    <ImageIcon size={32} className="opacity-40" />
                    <p className="text-xs font-medium">No image uploaded</p>
                  </div>
                )}
              </div>

              {/* Fields */}
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label} — Title</label>
                  <input
                    type="text"
                    value={currentTitle}
                    onChange={e => set(titleKey, e.target.value)}
                    placeholder={descPlaceholder}
                    className="w-full border border-gray-200 px-3 py-2 text-sm text-acc-navy focus:border-acc-navy outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Link URL</label>
                  <input
                    type="text"
                    value={currentLink}
                    onChange={e => set(linkKey, e.target.value)}
                    placeholder="/projects?category=..."
                    className="w-full border border-gray-200 px-3 py-2 text-sm text-acc-navy focus:border-acc-navy outline-none"
                  />
                </div>

                {/* Upload button */}
                <input
                  ref={el => { fileRefs.current[key] = el; }}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) uploadImage(key, file);
                    e.target.value = '';
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileRefs.current[key]?.click()}
                  disabled={uploading === key}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-acc-navy text-gray-400 hover:text-acc-navy transition-colors py-3 text-sm font-medium disabled:opacity-50"
                >
                  {uploading === key ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                  {uploading === key ? 'Uploading...' : currentImage ? 'Replace Image' : 'Upload Image'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-100 px-5 py-4 text-sm text-blue-700">
        <strong>Tips:</strong> Use landscape images (16:9 ratio) at least 1200×800px for best quality. JPEG, PNG, or WebP accepted. Click <strong>Save Changes</strong> after uploading or editing any field.
      </div>
    </div>
  );
}
