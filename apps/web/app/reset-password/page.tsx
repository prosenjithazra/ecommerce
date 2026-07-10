"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../components/AppContext';

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
    <div className="min-h-screen bg-[#FDFAF6] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block font-extrabold text-3xl tracking-tight text-[#4A453E] mb-3">
          PRINT<span className="text-[#F9A37E]">HUB</span>
        </Link>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E] tracking-tight">
          Create new password
        </h2>
        <p className="mt-1.5 text-xs text-[#A89B8A]">
          Ensure your password contains at least 8 characters.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 border border-[#E8E2D6] shadow-sm rounded-3xl sm:px-10">
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
        </div>
      </div>
    </div>
  );
}
