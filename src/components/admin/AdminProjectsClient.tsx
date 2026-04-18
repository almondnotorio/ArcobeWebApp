'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusCircle, Pencil, Trash2, Star, Building2 } from 'lucide-react';
import { Project } from '@/types';

export default function AdminProjectsClient({ projects: initial }: { projects: Project[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initial);
  const [deleting, setDeleting] = useState<number | null>(null);

  const deleteProject = async (id: number) => {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    setDeleting(id);
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    setProjects(p => p.filter(x => x.id !== id));
    setDeleting(null);
    router.refresh();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-acc-navy">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">{projects.length} total projects</p>
        </div>
        <Link href="/admin/projects/new"
          className="flex items-center gap-2 bg-acc-navy text-white px-5 py-2.5 text-sm font-semibold hover:bg-acc-gold transition-colors">
          <PlusCircle size={16} /> Add Project
        </Link>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Project</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Category</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Location</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Year</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Featured</th>
                <th className="text-right px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-acc-navy/10 flex items-center justify-center rounded shrink-0">
                        <Building2 size={16} className="text-acc-navy" />
                      </div>
                      <div>
                        <p className="font-medium text-acc-navy">{p.title}</p>
                        {p.value && <p className="text-xs text-gray-400">{p.value}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{p.category}</td>
                  <td className="px-6 py-4 text-gray-600">{p.location}</td>
                  <td className="px-6 py-4 text-gray-600">{p.year}</td>
                  <td className="px-6 py-4">
                    {p.featured ? <Star size={16} className="text-acc-gold fill-acc-gold" /> : <Star size={16} className="text-gray-200" />}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/projects/${p.id}/edit`}
                        className="p-2 text-gray-400 hover:text-acc-navy hover:bg-gray-100 rounded transition-colors">
                        <Pencil size={15} />
                      </Link>
                      <button onClick={() => deleteProject(p.id)} disabled={deleting === p.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-40">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {projects.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Building2 size={40} className="mx-auto mb-3 opacity-30" />
              <p>No projects yet.</p>
              <Link href="/admin/projects/new" className="text-acc-gold hover:underline text-sm mt-1 inline-block">Add your first project</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
