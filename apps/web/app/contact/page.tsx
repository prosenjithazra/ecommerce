"use client";

import React, { useState } from "react";
import { Breadcrumb } from "../../components/UIComponents";
import {
  Phone,
  MapPin,
  Mail,
  Send,
  CheckCircle2,
} from "lucide-react";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "../../components/BrandIcons";
import { useApp } from "../../components/AppContext";
import { getApiUrl } from "../../components/ApiConfig";

export default function ContactPage() {
  const { showToast, companySettings } = useApp();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const tempErrors: typeof errors = {};
    if (!formData.name.trim()) {
      tempErrors.name = "Name is required.";
    }
    if (!formData.email.trim()) {
      tempErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address.";
    }
    if (!formData.message.trim()) {
      tempErrors.message = "Message content cannot be blank.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast(
        "Invalid Input",
        "Please correct the form fields before submitting.",
        "error",
      );
      return;
    }

    fetch(getApiUrl("/contact"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.ok) {
          setIsSubmitted(true);
          showToast("Message Sent", "Thank you for contacting us.", "success");
          setFormData({ name: "", email: "", subject: "", message: "" });
        } else {
          throw new Error("Failed to send message");
        }
      })
      .catch(() => {
        showToast(
          "Error",
          "Could not send message. Please try again later.",
          "error",
        );
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-12 pb-12 md:pb-16">
      <Breadcrumb items={[{ name: "Contact Us" }]} />

      <section className="text-center space-y-3 max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Get in touch
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Have a question about printing quality, shipping, or bulk order
          pricing? Reach out and we will respond in less than 24 hours.
        </p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
        {/* Contact form or success state */}
        {!isSubmitted ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 shadow-xl rounded-lg p-4 sm:p-10 space-y-6">
            <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white">
              Send us a message
            </h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-650 dark:text-zinc-300 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name)
                        setErrors({ ...errors, name: undefined });
                    }}
                    placeholder="Jane"
                    className={`w-full bg-zinc-55 dark:bg-zinc-800 border ${errors.name ? "border-red-400 focus:border-red-500" : "border-zinc-200 dark:border-zinc-700 focus:border-[#F9A37E] focus:ring-2 focus:ring-[#F9A37E]/20"} rounded-lg py-3 px-4 text-xs outline-none text-zinc-955 dark:text-zinc-50`}
                  />
                  {errors.name && (
                    <p className="text-[10px] text-red-500 font-bold mt-1.5">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-650 dark:text-zinc-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email)
                        setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="jane@example.com"
                    className={`w-full bg-zinc-55 dark:bg-zinc-800 border ${errors.email ? "border-red-400 focus:border-red-500" : "border-zinc-200 dark:border-zinc-700 focus:border-[#F9A37E] focus:ring-2 focus:ring-[#F9A37E]/20"} rounded-lg py-3 px-4 text-xs outline-none text-zinc-955 dark:text-zinc-50`}
                  />
                  {errors.email && (
                    <p className="text-[10px] text-red-500 font-bold mt-1.5">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-650 dark:text-zinc-300 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="Bulk order inquiry"
                  className="w-full bg-zinc-55 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg py-3 px-4 text-xs outline-none focus:border-[#F9A37E] focus:ring-2 focus:ring-[#F9A37E]/20 text-zinc-955 dark:text-zinc-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-650 dark:text-zinc-300 mb-1.5">
                  Message
                </label>
                <textarea
                  rows={5}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message)
                      setErrors({ ...errors, message: undefined });
                  }}
                  placeholder="Write details about your request..."
                  className={`w-full bg-zinc-55 dark:bg-zinc-800 border ${errors.message ? "border-red-400 focus:border-red-500" : "border-zinc-200 dark:border-zinc-700 focus:border-[#F9A37E] focus:ring-2 focus:ring-[#F9A37E]/20"} rounded-lg py-3 px-4 text-xs outline-none text-zinc-955 dark:text-zinc-50 resize-none`}
                />
                {errors.message && (
                  <p className="text-[10px] text-red-500 font-bold mt-1.5">
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#F9A37E] hover:bg-[#E8855A] text-white font-extrabold text-xs py-3.5 px-4 rounded-lg transition-all shadow-md shadow-[#F9A37E]/25 dark:shadow-none flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 shadow-xl rounded-lg p-6 sm:p-10 text-center space-y-6 flex flex-col items-center justify-center py-16 animate-fade-in-overlay">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-full flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-8 h-8 animate-subtle-bounce" />
            </div>
            <div className="space-y-3">
              <h2 className="font-extrabold text-2xl text-zinc-900 dark:text-white tracking-tight">
                Thank You
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-md mx-auto whitespace-pre-line">
                Thank you for choosing Kliamo Fashion. Your trust and support
                inspire us to create stylish, comfortable, and high-quality
                fashion for every occasion. We&apos;re grateful to be a part of your
                journey and look forward to serving you with collections you&apos;ll
                love. Welcome to the Kliamo Fashion family!
              </p>
            </div>
            <button
              onClick={() => setIsSubmitted(false)}
              className="bg-[#F9A37E] hover:bg-[#E8855A] text-white font-extrabold text-xs py-3 px-6 rounded-lg transition-all shadow-sm"
            >
              Send Another Message
            </button>
          </div>
        )}

        {/* Info & Map details */}
        <div className="space-y-2 md:space-y-4">
          <div className="space-y-3">
            <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white">
              Get in touch
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Call Us */}
              <div className="group relative overflow-hidden p-3 rounded-xl bg-gradient-to-br from-[#FFF8F4] to-[#FFF0E8] border border-[#F9A37E]/20 hover:border-[#F9A37E]/50 hover:shadow-lg hover:shadow-[#F9A37E]/10 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#F9A37E]/15 flex items-center justify-center group-hover:bg-[#F9A37E]/25 transition-colors">
                    <Phone className="w-5 h-5 text-[#F9A37E]" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs font-black text-[#4A453E] uppercase tracking-wider">Call Us</p>
                    <a
                      href={`tel:${companySettings.phone.replace(/\s+/g, "")}`}
                      className="text-sm font-bold text-zinc-700 hover:text-[#F9A37E] transition-colors block"
                    >
                      {companySettings.phone}
                    </a>
                    <p className="text-xs text-zinc-600">{companySettings.hours}</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-[#F9A37E]/5 group-hover:bg-[#F9A37E]/10 transition-colors" />
              </div>

              {/* Email */}
              <div className="group relative overflow-hidden p-3 rounded-xl bg-gradient-to-br from-[#F4F8FF] to-[#EBF0FF] border border-blue-200/40 hover:border-blue-300/60 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-100/60 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Mail className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs font-black text-[#4A453E] uppercase tracking-wider">Email Us</p>
                    <a
                      href={`mailto:${companySettings.email}`}
                      className="text-sm font-bold text-zinc-700 hover:text-blue-500 transition-colors block truncate"
                    >
                      {companySettings.email}
                    </a>
                    <p className="text-xs text-zinc-600">We reply within 24 hours</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-blue-100/20 group-hover:bg-blue-100/40 transition-colors" />
              </div>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="aspect-video rounded-[10px] sm:rounded-[12px] overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-md">
            <iframe
              title="Studio Location"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(companySettings.address)}&output=embed&z=15`}
            />
          </div>

          {/* Social connections */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center lg:justify-start">
            <span className="text-sm font-bold text-zinc-800 whitespace-nowrap">
              Follow our print designs:
            </span>
            <div className="flex gap-2.5 items-center justify-center">
              <a
                href={companySettings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#F9A37E] hover:bg-[#E8855A] rounded-lg transition-colors text-white"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href={companySettings.youtubeUrl || companySettings.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#F9A37E] hover:bg-[#E8855A] rounded-lg transition-colors text-white"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href={companySettings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#F9A37E] hover:bg-[#E8855A] rounded-lg transition-colors text-white"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
