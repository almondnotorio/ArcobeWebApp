'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle } from 'lucide-react';

export default function ContactClient({ settings }: { settings: Record<string, string> }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  return (
    <>
      {/* Header */}
      <section className="bg-acc-navy pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-acc-gold font-semibold tracking-widest text-sm mb-3">GET IN TOUCH</p>
          <h1 className="text-5xl font-bold text-white">Contact Us</h1>
          <p className="text-gray-300 mt-4 max-w-xl">Have a project in mind? Our team is ready to discuss your construction needs and provide a detailed proposal.</p>
        </div>
      </section>

      <section className="py-20 bg-acc-light flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <p className="text-acc-gold font-semibold tracking-widest text-sm mb-4">CONTACT INFORMATION</p>
              <div className="space-y-5">
                {[
                  { icon: MapPin, label: 'Address', value: settings.contact_address || 'Metro Manila, Philippines' },
                  { icon: Phone, label: 'Phone', value: settings.contact_phone || '+63 2 8XXX XXXX' },
                  { icon: Mail, label: 'Email', value: settings.contact_email || 'info@arcobeconstruction.com' },
                ].map(item => (
                  <div key={item.label} className="flex gap-4">
                    <div className="w-10 h-10 bg-acc-navy rounded-full flex items-center justify-center shrink-0">
                      <item.icon size={16} className="text-acc-gold" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">{item.label}</p>
                      <p className="text-acc-navy font-semibold text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-acc-navy p-6 text-white">
              <h3 className="font-bold mb-2">Office Hours</h3>
              <div className="text-gray-300 text-sm space-y-1">
                <p>Monday – Friday: 8:00 AM – 5:00 PM</p>
                <p>Saturday: 8:00 AM – 12:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="bg-white p-12 text-center">
                <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-acc-navy mb-2">Message Sent!</h3>
                <p className="text-gray-500">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', service: '', message: '' }); }}
                  className="mt-6 bg-acc-navy text-white px-6 py-2 font-semibold hover:bg-acc-navy-dark transition-colors">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Full Name *</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full border-b-2 border-gray-200 focus:border-acc-navy outline-none py-2 text-acc-navy transition-colors" placeholder="Juan dela Cruz" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Email *</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full border-b-2 border-gray-200 focus:border-acc-navy outline-none py-2 text-acc-navy transition-colors" placeholder="juan@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Phone</label>
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full border-b-2 border-gray-200 focus:border-acc-navy outline-none py-2 text-acc-navy transition-colors" placeholder="+63 9XX XXX XXXX" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Service Needed</label>
                    <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                      className="w-full border-b-2 border-gray-200 focus:border-acc-navy outline-none py-2 text-acc-navy bg-transparent transition-colors">
                      <option value="">Select a service</option>
                      {['Commercial Construction', 'Residential Development', 'Infrastructure', 'Industrial Facilities', 'Institutional Buildings', 'Hospitality & Leisure'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Project Description *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full border-2 border-gray-200 focus:border-acc-navy outline-none p-3 text-acc-navy resize-none transition-colors"
                    placeholder="Tell us about your project — location, scope, timeline, and any specific requirements..." />
                </div>
                <button type="submit" disabled={loading}
                  className="bg-acc-navy text-white px-8 py-4 font-bold flex items-center gap-2 hover:bg-acc-gold transition-colors disabled:opacity-60">
                  {loading ? 'Sending...' : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
