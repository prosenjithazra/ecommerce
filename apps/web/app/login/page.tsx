"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../components/AppContext';

export default function LoginPage() {
  const { loginUser } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    loginUser(email);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#FDFAF6] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block font-extrabold text-3xl tracking-tight text-[#4A453E] mb-3">
          PRINT<span className="text-[#F9A37E]">HUB</span>
        </Link>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E] tracking-tight">
          Welcome back to the studio
        </h2>
        <p className="mt-1.5 text-xs text-[#A89B8A]">
          Or{' '}
          <Link href="/signup" className="font-bold text-[#F9A37E] hover:text-[#E8855A]">
            register a free account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 border border-[#E8E2D6] shadow-sm rounded-3xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#4A453E]">Email address</label>
              <input
                id="email" type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 w-full bg-[#FDFAF6] border border-[#E8E2D6] rounded-xl py-3 px-4 text-xs outline-none focus:border-[#F9A37E] text-[#4A453E]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-[#4A453E]">Password</label>
              <div className="relative mt-1.5">
                <input
                  id="password" type={showPassword ? "text" : "password"} required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FDFAF6] border border-[#E8E2D6] rounded-xl py-3 px-4 pr-10 text-xs outline-none focus:border-[#F9A37E] text-[#4A453E]"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89B8A] hover:text-[#4A453E] transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E8E2D6] accent-[#F9A37E]" />
                <span className="text-[11px] text-[#7A736A] font-medium">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-[11px] font-bold text-[#F9A37E] hover:text-[#E8855A]">
                Forgot password?
              </Link>
            </div>

            <button type="submit"
              className="w-full bg-[#F9A37E] hover:bg-[#e28e6c] text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-[#F9A37E]/25 active:scale-95">
              Sign In
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E8E2D6]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-[#A89B8A]">Or continue with</span>
              </div>
            </div>

            <button
              onClick={() => { loginUser("google.creator@gmail.com"); router.push('/'); }}
              className="mt-4 w-full border border-[#E8E2D6] hover:bg-[#FDFAF6] text-[#4A453E] font-extrabold text-xs py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V13.4h6.887c-.648 2.41-2.519 4.13-5.136 4.13A5.79 5.79 0 0 1 8.2 11.75a5.79 5.79 0 0 1 5.79-5.786c1.5 0 2.87.57 3.93 1.5l2.44-2.44A9.15 9.15 0 0 0 13.99 2.5a9.25 9.25 0 0 0-9.25 9.25 9.25 9.25 0 0 0 9.25 9.25c5.11 0 9.19-3.67 9.19-9.25 0-.585-.05-1.155-.15-1.715z" />
              </svg>
              Google Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
