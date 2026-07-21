"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../components/AppContext';
import { getApiUrl } from '../../../components/ApiConfig';

export default function ResetPasswordPage() {
  const { showToast } = useApp();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const inputClass = "mt-1.5 w-full bg-[#FDFAF6] border border-[#E8E2D6] rounded-lg py-3 px-4 text-xs outline-none focus:border-[#F9A37E] text-[#4A453E] placeholder-[#A89B8A]";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password || !confirmPassword) return;
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match!"); return; }

    const email = sessionStorage.getItem('otp_email');
    const otp = sessionStorage.getItem('otp_code');
    if (!email || !otp) {
      setError("Session expired. Please restart the process.");
      router.push('/forgot-password');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/user/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');

      // Clear session storage
      sessionStorage.removeItem('otp_email');
      sessionStorage.removeItem('otp_code');

      showToast("Password Reset Success", "You can now sign in with your new credentials.", "success");
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFAF6] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block mb-3">
          <img src="/kliamologoNew.png" alt="Kliamo Fashion Logo" className="h-12 w-auto mx-auto object-contain" />
        </Link>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E] tracking-tight">
          Create new password
        </h2>
        <p className="mt-1.5 text-xs text-[#A89B8A] hidden sm:block">
          Ensure your password contains at least 8 characters.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-[#E8E2D6] shadow-xl rounded-lg sm:rounded-lg py-5 sm:py-8 px-4 sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-[#4A453E]">
                New Password
              </label>
              <input
                id="password" type="password" required value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Minimum 8 characters"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-xs font-bold text-[#4A453E]">
                Confirm Password
              </label>
              <input
                id="confirm-password" type="password" required value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                placeholder="Confirm password"
                className={inputClass}
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F9A37E] hover:bg-[#e28e6c] text-white font-extrabold text-xs py-3.5 px-6 rounded-lg transition-all shadow-lg shadow-[#F9A37E]/25 active:scale-95 disabled:opacity-70"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
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
