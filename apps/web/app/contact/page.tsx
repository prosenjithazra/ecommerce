"use client";

import React, { useState } from "react";
import { Breadcrumb } from "../../components/UIComponents";
import {
  Phone,
  MapPin,
  Send,
  CheckCircle2,
} from "lucide-react";
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
                    className={`w-full bg-zinc-55 dark:bg-zinc-800 border ${errors.name ? "border-red-400 focus:border-red-500" : "border-zinc-200 dark:border-zinc-700 focus:border-indigo-500"} rounded-lg py-3 px-4 text-xs outline-none text-zinc-955 dark:text-zinc-50`}
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
                    className={`w-full bg-zinc-55 dark:bg-zinc-800 border ${errors.email ? "border-red-400 focus:border-red-500" : "border-zinc-200 dark:border-zinc-700 focus:border-indigo-500"} rounded-lg py-3 px-4 text-xs outline-none text-zinc-955 dark:text-zinc-50`}
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
                  className="w-full bg-zinc-55 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg py-3 px-4 text-xs outline-none focus:border-indigo-500 text-zinc-955 dark:text-zinc-50"
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
                  className={`w-full bg-zinc-55 dark:bg-zinc-800 border ${errors.message ? "border-red-400 focus:border-red-500" : "border-zinc-200 dark:border-zinc-700 focus:border-indigo-500"} rounded-lg py-3 px-4 text-xs outline-none text-zinc-955 dark:text-zinc-50 resize-none`}
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
        <div className="space-y-4 md:space-y-8">
          <div className="space-y-2 md:space-y-4">
            <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white">
              Studio details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-6">
              <div className="p-4 border border-zinc-150 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/30 flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                <span className="font-bold text-zinc-850 dark:text-white block text-xs sm:hidden">
                  Headquarters
                </span>
                <MapPin className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <div className="text-xs flex flex-col items-center sm:items-start">
                  <span className="font-bold text-zinc-850 dark:text-white hidden sm:block">
                    Headquarters
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400 mt-1 block">
                    {companySettings.address}
                  </span>
                </div>
              </div>
              <div className="p-4 border border-zinc-150 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/30 flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                <span className="font-bold text-zinc-850 dark:text-white block text-xs sm:hidden">
                  Call Us
                </span>
                <Phone className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <div className="text-xs flex flex-col items-center sm:items-start">
                  <span className="font-bold text-zinc-850 dark:text-white hidden sm:block">
                    Call Us
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400 mt-1 block">
                    <a
                      href={`tel:${companySettings.phone.replace(/\s+/g, "")}`}
                      className="hover:text-indigo-500 transition-colors"
                    >
                      {companySettings.phone}
                    </a>
                    <br />
                    {companySettings.hours}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Premium map placeholder */}
          <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-[16px] sm:rounded-[24px] overflow-hidden relative border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-center">
            {/* Visual representation */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-20"
              style={{
                backgroundImage:
                  "url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-74.006,40.7128,12,0/800x450?access_token=mock')",
              }}
            />
            <div className="relative text-center p-6 space-y-2 z-10">
              <MapPin className="w-8 h-8 text-rose-500 mx-auto animate-bounce" />
              <span className="font-extrabold text-xs text-zinc-900 dark:text-white block">
                Manhattan Studio Location
              </span>
              <p className="text-[10px] text-zinc-400">
                {companySettings.address}
              </p>
            </div>
          </div>

          {/* Social connections */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center lg:justify-start">
            <span className="text-sm font-bold text-zinc-800 whitespace-nowrap">
              Follow our print designs:
            </span>
            <div className="flex gap-2.5 items-center justify-center">
              <a
                href={companySettings.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#F9A37E] hover:bg-[#A8C69F] rounded-lg transition-colors text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  width="18"
                  height="18"
                  x="0"
                  y="0"
                  viewBox="0 0 1226.37 1226.37"
                >
                  <g>
                    <path
                      d="M727.348 519.284 1174.075 0h-105.86L680.322 450.887 370.513 0H13.185l468.492 681.821L13.185 1226.37h105.866l409.625-476.152 327.181 476.152h357.328L727.322 519.284zM582.35 687.828l-47.468-67.894-377.686-540.24H319.8l304.797 435.991 47.468 67.894 396.2 566.721H905.661L582.35 687.854z"
                      fill="currentColor"
                      opacity="1"
                    ></path>
                  </g>
                </svg>
              </a>
              <a
                href={companySettings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#F9A37E] hover:bg-[#A8C69F] rounded-lg transition-colors text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  width="18"
                  height="18"
                  x="0"
                  y="0"
                  viewBox="0 0 512.001 512.001"
                >
                  <g>
                    <path
                      d="M373.406 0H138.594C62.172 0 0 62.172 0 138.594V373.41C0 449.828 62.172 512 138.594 512H373.41C449.828 512 512 449.828 512 373.41V138.594C512 62.172 449.828 0 373.406 0zm108.578 373.41c0 59.867-48.707 108.574-108.578 108.574H138.594c-59.871 0-108.578-48.707-108.578-108.574V138.594c0-59.871 48.707-108.578 108.578-108.578H373.41c59.867 0 108.574 48.707 108.574 108.578zm0 0"
                      fill="currentColor"
                      opacity="1"
                    ></path>
                    <path
                      d="M256 116.004c-77.195 0-139.996 62.8-139.996 139.996S178.804 395.996 256 395.996 395.996 333.196 395.996 256 333.196 116.004 256 116.004zm0 249.976c-60.64 0-109.98-49.335-109.98-109.98 0-60.64 49.34-109.98 109.98-109.98 60.645 0 109.98 49.34 109.98 109.98 0 60.645-49.335 109.98-109.98 109.98zM399.344 66.285c-22.813 0-41.367 18.559-41.367 41.367 0 22.813 18.554 41.371 41.367 41.371s41.37-18.558 41.37-41.37-18.558-41.368-41.37-41.368zm0 52.719c-6.258 0-11.352-5.094-11.352-11.352 0-6.261 5.094-11.351 11.352-11.351 6.261 0 11.355 5.09 11.355 11.351 0 6.258-5.094 11.352-11.355 11.352zm0 0"
                      fill="currentColor"
                      opacity="1"
                    ></path>
                  </g>
                </svg>
              </a>
              <a
                href={companySettings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#F9A37E] hover:bg-[#A8C69F] rounded-lg transition-colors text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  width="18"
                  height="18"
                  x="0"
                  y="0"
                  viewBox="0 0 60 60"
                >
                  <g>
                    <path
                      d="M22.316 12.234v7.985h-5.85v9.766h5.85V59h12.021V29.985H42.4s.754-4.684 1.121-9.803H34.38v-6.677c0-.997 1.309-2.34 2.605-2.34h6.547V.999h-8.9C22.02 1 22.316 10.774 22.316 12.234z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeMiterlimit={1}
                    ></path>
                  </g>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
