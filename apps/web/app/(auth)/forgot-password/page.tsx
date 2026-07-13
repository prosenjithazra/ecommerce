"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../components/AppContext';

export default function ForgotPasswordPage() {
  const { showToast } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    showToast("OTP Sent", `We have sent a verification code to ${email}`, "success");
    router.push('/verify-otp');
  };

  return (
    <div className="min-h-screen bg-[#FDFAF6] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block font-extrabold text-3xl tracking-tight text-[#4A453E] mb-3">
          PRINT<span className="text-[#F9A37E]">HUB</span>
        </Link>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E] tracking-tight">
          Reset your password
        </h2>
        <p className="mt-1.5 text-xs text-[#A89B8A] px-4 hidden sm:block">
          Enter your email address and we will send you a 6-digit OTP code to verify your identity.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-[#E8E2D6] shadow-xl rounded-lg sm:rounded-lg py-5 sm:py-8 px-4 sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#4A453E]">
                Email address
              </label>
              <input
                id="email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className="mt-1.5 w-full bg-[#FDFAF6] border border-[#E8E2D6] rounded-lg py-3 px-4 text-xs outline-none focus:border-[#F9A37E] text-[#4A453E]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#F9A37E] hover:bg-[#e28e6c] text-white font-extrabold text-xs py-3.5 px-6 rounded-lg transition-all shadow-lg shadow-[#F9A37E]/25 active:scale-95"
            >
              Send OTP Code
            </button>
          </form>

          {/* Bottom Switcher buttons */}
          <div className="mt-6 pt-5 border-t border-[#E8E2D6] space-y-3">
            <span className="text-[10px] font-bold text-[#A89B8A] uppercase tracking-wider text-center block">
              Want to sign in or register instead?
            </span>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/login"
                className="w-full bg-[#A8C69F] hover:bg-[#92b089] text-white font-extrabold text-xs py-3 px-4 rounded-lg transition-all shadow-md shadow-[#A8C69F]/20 flex items-center justify-center text-center"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="w-full border border-[#E8E2D6] hover:bg-[#FDFAF6] text-[#4A453E] font-extrabold text-xs py-3 px-4 rounded-lg transition-colors flex items-center justify-center text-center"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
