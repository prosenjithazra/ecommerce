"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";
import { useApp } from "../../../components/AppContext";

export default function AdminLoginPage() {
  const { loginUser, logout } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError(null);
    setSubmitting(true);

    try {
      const success = await loginUser(email, password);
      if (success) {
        // Decode token to verify if role is admin
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const payloadBase64 = token.split(".")[1];
            if (payloadBase64) {
              const decodedPayload = JSON.parse(window.atob(payloadBase64));
              if (decodedPayload.role !== "admin") {
                setError("Access denied. Only administrators can access this portal.");
                logout();
                setSubmitting(false);
                return;
              }
            }
          } catch (jwtErr) {
            console.error("JWT decoding failed:", jwtErr);
          }
        }
        
        // Redirect to admin panel
        router.push("/admin");
      } else {
        setError("Invalid email or password.");
        setSubmitting(false);
      }
    } catch (_err) {
      setError("An unexpected error occurred. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4F0] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block mb-1">
          <img src="/logoMainNew.png" alt="Kaiva Fashion Logo" className="h-12 w-auto mx-auto object-contain" />
        </Link>
        <span className="block text-[10px] font-black tracking-[0.25em] text-[#7A736A] uppercase mb-4">
          Admin Portal
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-[#4A453E] tracking-tight">
          Control Console Sign In
        </h2>
        <p className="mt-1 text-xs text-[#A89B8A] font-semibold">
          Access your e-commerce management dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-[#E8E2D6] shadow-xl rounded-2xl py-8 px-6 sm:px-10">
          
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 text-xs text-red-600 font-bold animate-fade-in-up">
              <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#4A453E]">
                Administrator Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kaivafashion.com"
                disabled={submitting}
                className="mt-1.5 w-full bg-[#FDFAF6] border border-[#E8E2D6] rounded-xl py-3 px-4 text-xs font-medium outline-none focus:border-[#F9A37E] text-[#4A453E] transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-xs font-bold text-[#4A453E]">
                  Secret Password
                </label>
              </div>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={submitting}
                  className="w-full bg-[#FDFAF6] border border-[#E8E2D6] rounded-xl py-3 px-4 pr-10 text-xs font-medium outline-none focus:border-[#F9A37E] text-[#4A453E] transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={submitting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89B8A] hover:text-[#4A453E] transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#4A453E] hover:bg-[#38332E] text-white font-extrabold text-xs py-3.5 px-6 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Verifying Identity...
                </>
              ) : (
                "Authorize & Enter"
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E8E2D6] text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#F9A37E] hover:text-[#E8855A] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
