"use client";

import React, { useState } from 'react';
import { Breadcrumb } from '../../components/UIComponents';
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Facebook } from 'lucide-react';
import { useApp } from '../../components/AppContext';

export default function ContactPage() {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    showToast("Message Sent", "Thank you for contacting us. We'll get back to you shortly.", "success");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
      <Breadcrumb items={[{ name: "Contact Us" }]} />

      <section className="text-center space-y-3 max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Get in touch</h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">Have a question about printing quality, shipping, or bulk order pricing? Reach out and we will respond in less than 24 hours.</p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Contact form */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 shadow-xl rounded-3xl p-6 sm:p-10 space-y-6">
          <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white">Send us a message</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-650 dark:text-zinc-300 mb-1.5">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Jane"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3 px-4 text-xs outline-none focus:border-indigo-500 text-zinc-950 dark:text-zinc-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-650 dark:text-zinc-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jane@example.com"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3 px-4 text-xs outline-none focus:border-indigo-500 text-zinc-950 dark:text-zinc-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-650 dark:text-zinc-300 mb-1.5">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Bulk order inquiry"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3 px-4 text-xs outline-none focus:border-indigo-500 text-zinc-950 dark:text-zinc-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-650 dark:text-zinc-300 mb-1.5">Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write details about your request..."
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3 px-4 text-xs outline-none focus:border-indigo-500 text-zinc-955 dark:text-zinc-50 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#F9A37E] hover:bg-[#E8855A] text-white font-extrabold text-xs py-3.5 px-4 rounded-xl transition-all shadow-md shadow-[#F9A37E]/25 dark:shadow-none flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>

        {/* Info & Map details */}
        <div className="space-y-8">
          
          <div className="space-y-4">
            <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white">Studio details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 border border-zinc-150 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30 flex gap-3">
                <MapPin className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-zinc-850 dark:text-white block">Headquarters</span>
                  <span className="text-zinc-500 dark:text-zinc-400 mt-1 block">123 Creative Street, Suite 100, New York, NY 10001</span>
                </div>
              </div>
              <div className="p-4 border border-zinc-150 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30 flex gap-3">
                <Phone className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-zinc-850 dark:text-white block">Call Us</span>
                  <span className="text-zinc-500 dark:text-zinc-400 mt-1 block">+1 555-0199<br />Mon - Fri, 9am - 6pm EST</span>
                </div>
              </div>
            </div>
          </div>

          {/* Premium map placeholder */}
          <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-[32px] overflow-hidden relative border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-center">
            {/* Visual representation */}
            <div className="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-20" style={{ backgroundImage: "url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-74.006,40.7128,12,0/800x450?access_token=mock')" }} />
            <div className="relative text-center p-6 space-y-2 z-10">
              <MapPin className="w-8 h-8 text-rose-500 mx-auto animate-bounce" />
              <span className="font-extrabold text-xs text-zinc-900 dark:text-white block">Manhattan Studio Location</span>
              <p className="text-[10px] text-zinc-400">123 Creative Street, New York</p>
            </div>
          </div>

          {/* Social connections */}
          <div className="flex gap-4 items-center justify-center lg:justify-start">
            <span className="text-xs font-bold text-zinc-400">Follow our print designs:</span>
            <a href="#" className="p-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-colors text-zinc-650 dark:text-zinc-300">
              <Twitter className="w-4.5 h-4.5" />
            </a>
            <a href="#" className="p-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-colors text-zinc-650 dark:text-zinc-300">
              <Instagram className="w-4.5 h-4.5" />
            </a>
            <a href="#" className="p-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-colors text-zinc-650 dark:text-zinc-300">
              <Facebook className="w-4.5 h-4.5" />
            </a>
          </div>

        </div>
      </section>
    </div>
  );
}
