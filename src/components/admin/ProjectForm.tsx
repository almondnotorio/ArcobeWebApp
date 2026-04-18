'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X, Star, Loader2 } from 'lucide-react';
import { Project } from '@/types';

type FormData = Omit<Project, 'id' | 'created_at'>;

interface Props {
  initial?: Partial<FormData>;
  projectId?: number;
}

const CATEGORIES = ['Commercial', 'Residential', 'Infrastructure', 'Industrial', 'Institutional', 'Hospitality'];

export default function ProjectForm({ initial, projectId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    title: initial?.title || '',
    category: initial?.category || 'Commercial',
    location: initial?.location || '',
    year: initial?.year || new Date().getFullYear().toString(),
    description: initial?.description || '',
    client: initial?.client || '',
    value: initial?.value || '',
    size: initial?.size || '',
    featured: initial?.featured ?? 0,
    cover_image: initial?.cover_image || '',
    images: initial?.images || '[]',
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const galleryImages: string[] = JSON.parse(form.images || '[]');

  const uploadFile = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (!res.ok) return null;
    const data = await res.json();
    return data.url;
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFile(file);
    if (url) setForm(f => ({ ...f, cover_image: url }));
    setUploading(false);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const urls = await Promise.all(files.map(uploadFile));
    const valid = urls.filter(Boolean) as string[];
    setForm(f => ({ ...f, images: JSON.stringify([...galleryImages, ...valid]) }));
    setUploading(false);
  };

  const removeGalleryImage = (idx: number) => {
    const updated = galleryImages.filter((_, i) => i !== idx);
    setForm(f => ({ ...f, images: JSON.stringify(updated) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const method = projectId ? 'PUT' : 'POST';
    const url = projectId ? `/api/projects/${projectId}` : '/api/projects';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, images: galleryImages }),
    });
    setSaving(false);
    if (res.ok) {
      router.push('/admin/projects');
      router.refresh();
    } else {
      setError('Failed to save project. Please try again.');
    }
  };

  const field = (label: string, key: keyof FormData, opts?: { type?: string; placeholder?: string; required?: boolean }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}{opts?.required && ' *'}</label>
      <input
        type={opts?.type || 'text'}
        required={opts?.required}
        value={form[key] as string}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={opts?.placeholder}
        className="w-full border border-gray-200 px-4 py-2.5 text-acc-navy focus:border-acc-navy outline-none"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-acc-navy">{projectId ? 'Edit Project' : 'Add New Project'}</h1>
        <button type="button" onClick={() => router.back()} className="text-sm text-gray-400 hover:text-gray-600">Cancel</button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main fields */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-gray-100 p-6 space-y-5">
            <h2 className="font-bold text-acc-navy border-b pb-3">Basic Information</h2>
            {field('Project Title', 'title', { required: true, placeholder: 'e.g. Metro Office Tower' })}

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Category *</label>
              <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full border border-gray-200 px-4 py-2.5 text-acc-navy focus:border-acc-navy outline-none bg-white">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {field('Location', 'location', { required: true, placeholder: 'e.g. Makati, Metro Manila' })}
              {field('Year Completed', 'year', { required: true, placeholder: '2024' })}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Description *</label>
              <textarea required rows={5} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Detailed description of the project..."
                className="w-full border border-gray-200 px-4 py-2.5 text-acc-navy focus:border-acc-navy outline-none resize-none" />
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6 space-y-5">
            <h2 className="font-bold text-acc-navy border-b pb-3">Project Details</h2>
            {field('Client / Developer', 'client', { placeholder: 'e.g. Metro Properties Inc.' })}
            <div className="grid grid-cols-2 gap-4">
              {field('Project Value', 'value', { placeholder: 'e.g. ₱2.4B' })}
              {field('Project Size', 'size', { placeholder: 'e.g. 45,000 sqm' })}
            </div>
          </div>

          {/* Gallery */}
          <div className="bg-white border border-gray-100 p-6">
            <h2 className="font-bold text-acc-navy border-b pb-3 mb-5">Project Gallery</h2>
            <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
            <button type="button" onClick={() => galleryRef.current?.click()} disabled={uploading}
              className="flex items-center gap-2 border-2 border-dashed border-gray-200 text-gray-400 hover:border-acc-navy hover:text-acc-navy transition-colors px-6 py-4 w-full justify-center text-sm">
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {uploading ? 'Uploading...' : 'Upload Gallery Images'}
            </button>
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {galleryImages.map((img, i) => (
                  <div key={i} className="relative group h-28 overflow-hidden">
                    <Image src={img} alt={`Gallery ${i}`} fill className="object-cover" />
                    <button type="button" onClick={() => removeGalleryImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Cover image */}
          <div className="bg-white border border-gray-100 p-6">
            <h2 className="font-bold text-acc-navy border-b pb-3 mb-4">Cover Image</h2>
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            <div onClick={() => coverRef.current?.click()}
              className="relative border-2 border-dashed border-gray-200 hover:border-acc-navy cursor-pointer transition-colors overflow-hidden" style={{ minHeight: 160 }}>
              {form.cover_image && !form.cover_image.startsWith('/placeholder') ? (
                <>
                  <Image src={form.cover_image} alt="Cover" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Upload size={24} className="text-white" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400 gap-2">
                  {uploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                  <span className="text-xs">{uploading ? 'Uploading...' : 'Click to upload'}</span>
                </div>
              )}
            </div>
            {form.cover_image && !form.cover_image.startsWith('/placeholder') && (
              <button type="button" onClick={() => setForm(f => ({ ...f, cover_image: '' }))}
                className="text-xs text-red-500 hover:underline mt-2">Remove image</button>
            )}
          </div>

          {/* Options */}
          <div className="bg-white border border-gray-100 p-6">
            <h2 className="font-bold text-acc-navy border-b pb-3 mb-4">Options</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.featured === 1} onChange={e => setForm(f => ({ ...f, featured: e.target.checked ? 1 : 0 }))}
                className="w-4 h-4 accent-acc-navy" />
              <div>
                <span className="flex items-center gap-1 text-sm font-medium text-acc-navy"><Star size={14} className="text-acc-gold" /> Featured Project</span>
                <p className="text-xs text-gray-400 mt-0.5">Show on homepage</p>
              </div>
            </label>
          </div>

          <button type="submit" disabled={saving}
            className="w-full bg-acc-navy text-white py-3 font-bold hover:bg-acc-gold transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : (projectId ? 'Update Project' : 'Create Project')}
          </button>
        </div>
      </div>
    </form>
  );
}
