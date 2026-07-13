"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../components/AppContext';

export default function SignUpPage() {
  const { loginUser } = useApp();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !acceptTerms) return;
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    loginUser(email);
    router.push('/');
  };

  const inputClass = "mt-1.5 w-full bg-[#FDFAF6] border border-[#E8E2D6] rounded-xl py-3 px-4 text-xs outline-none focus:border-[#F9A37E] text-[#4A453E] placeholder-[#A89B8A]";

  return (
    <div className="min-h-screen bg-[#FDFAF6] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block font-extrabold text-3xl tracking-tight text-[#4A453E] mb-3">
          PRINT<span className="text-[#F9A37E]">HUB</span>
        </Link>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E] tracking-tight">
          Create your creator account
        </h2>
        <p className="mt-1.5 text-xs text-[#A89B8A] hidden sm:block">
          Join to start custom designing custom premium apparel.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-[#E8E2D6] shadow-xl rounded-xl sm:rounded-3xl py-5 sm:py-8 px-4 sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-[#4A453E]">
                Full Name
              </label>
              <input
                id="name" type="text" required value={fullName}
                onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#4A453E]">
                Email address
              </label>
              <input
                id="email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="jane.doe@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-[#4A453E]">
                Phone Number (optional)
              </label>
              <input
                id="phone" type="tel" value={phone}
                onChange={(e) => setPhone(e.target.value)} placeholder="+1 555-0100"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-[#4A453E]">
                Password
              </label>
              <input
                id="password" type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 8 characters"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-xs font-bold text-[#4A453E]">
                Confirm Password
              </label>
              <input
                id="confirm-password" type="password" required value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password"
                className={inputClass}
              />
            </div>

            <div className="flex items-start pt-2">
              <label className="flex gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox" required checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-[#E8E2D6] accent-[#F9A37E]"
                />
                <span className="text-[10px] text-[#7A736A] font-medium leading-normal">
                  I accept the{' '}
                  <Link href="/terms" className="font-bold hover:underline text-[#F9A37E]">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="font-bold hover:underline text-[#F9A37E]">Privacy Policy</Link>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#F9A37E] hover:bg-[#e28e6c] text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-[#F9A37E]/25 active:scale-95 mt-2"
            >
              Register Account
            </button>
          </form>

          {/* Social login partition */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E8E2D6]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-[#A89B8A]">Or sign up with</span>
              </div>
            </div>

            <button
              onClick={() => {
                loginUser("google.creator@gmail.com");
                router.push('/');
              }}
              className="mt-4 w-full border border-[#E8E2D6] hover:bg-[#FDFAF6] text-[#4A453E] font-extrabold text-xs py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V13.4h6.887c-.648 2.41-2.519 4.13-5.136 4.13A5.79 5.79 0 0 1 8.2 11.75a5.79 5.79 0 0 1 5.79-5.786c1.5 0 2.87.57 3.93 1.5l2.44-2.44A9.15 9.15 0 0 0 13.99 2.5a9.25 9.25 0 0 0-9.25 9.25 9.25 9.25 0 0 0 9.25 9.25c5.11 0 9.19-3.67 9.19-9.25 0-.585-.05-1.155-.15-1.715z" />
              </svg>
              Google Account
            </button>
          </div>

          {/* Bottom Switcher buttons */}
          <div className="mt-6 pt-5 border-t border-[#E8E2D6] space-y-3">
            <span className="text-[10px] font-bold text-[#A89B8A] uppercase tracking-wider text-center block">
              Already have an account?
            </span>
            <Link
              href="/login"
              className="w-full bg-[#A8C69F] hover:bg-[#92b089] text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all shadow-md shadow-[#A8C69F]/20 flex items-center justify-center text-center animate-fade-in-up"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
