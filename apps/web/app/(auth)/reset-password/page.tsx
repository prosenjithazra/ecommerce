"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../components/AppContext';

export default function ResetPasswordPage() {
  const { showToast } = useApp();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    showToast("Password Reset Success", "You can now sign in with your new credentials.", "success");
    router.push('/login');
  };

  const inputClass = "mt-1.5 w-full bg-[#FDFAF6] border border-[#E8E2D6] rounded-xl py-3 px-4 text-xs outline-none focus:border-[#F9A37E] text-[#4A453E] placeholder-[#A89B8A]";

  return (
    <div className="min-h-screen bg-[#FDFAF6] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block font-extrabold text-3xl tracking-tight text-[#4A453E] mb-3">
          PRINT<span className="text-[#F9A37E]">HUB</span>
        </Link>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E] tracking-tight">
          Create new password
        </h2>
        <p className="mt-1.5 text-xs text-[#A89B8A] hidden sm:block">
          Ensure your password contains at least 8 characters.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-[#E8E2D6] shadow-xl rounded-xl sm:rounded-3xl py-5 sm:py-8 px-4 sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-[#4A453E]">
                New Password
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

            <button
              type="submit"
              className="w-full bg-[#F9A37E] hover:bg-[#e28e6c] text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-[#F9A37E]/25 active:scale-95"
            >
              Reset Password
            </button>
          </form>

          {/* Bottom Switcher buttons */}
          <div className="mt-6 pt-5 border-t border-[#E8E2D6] space-y-3">
            <span className="text-[10px] font-bold text-[#A89B8A] uppercase tracking-wider text-center block">
              Want to cancel and sign in?
            </span>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/login"
                className="w-full bg-[#A8C69F] hover:bg-[#92b089] text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all shadow-md shadow-[#A8C69F]/20 flex items-center justify-center text-center"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="w-full border border-[#E8E2D6] hover:bg-[#FDFAF6] text-[#4A453E] font-extrabold text-xs py-3 px-4 rounded-xl transition-colors flex items-center justify-center text-center"
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
