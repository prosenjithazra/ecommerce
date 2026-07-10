"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../components/AppContext';

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
    <div className="min-h-screen bg-[#FDFAF6] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block font-extrabold text-3xl tracking-tight text-[#4A453E] mb-3">
          PRINT<span className="text-[#F9A37E]">HUB</span>
        </Link>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E] tracking-tight">
          Reset your password
        </h2>
        <p className="mt-1.5 text-xs text-[#A89B8A] px-4">
          Enter your email address and we will send you a 6-digit OTP code to verify your identity.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 border border-[#E8E2D6] shadow-sm rounded-3xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#4A453E]">
                Email address
              </label>
              <input
                id="email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className="mt-1.5 w-full bg-[#FDFAF6] border border-[#E8E2D6] rounded-xl py-3 px-4 text-xs outline-none focus:border-[#F9A37E] text-[#4A453E]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#F9A37E] hover:bg-[#e28e6c] text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-[#F9A37E]/25 active:scale-95"
            >
              Send OTP Code
            </button>

            <div className="text-center pt-2">
              <Link href="/login" className="text-xs font-bold text-[#A89B8A] hover:text-[#4A453E]">
                Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
