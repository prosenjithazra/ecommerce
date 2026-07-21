"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../components/AppContext';
import { getApiUrl } from '../../../components/ApiConfig';

export default function VerifyOtpPage() {
  const { showToast } = useApp();
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    setError("");
    // Focus next input
    if (element.value !== "" && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otp[index] === "" && e.currentTarget.previousSibling) {
      (e.currentTarget.previousSibling as HTMLInputElement).focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the full 6-digit OTP code.");
      return;
    }

    const email = sessionStorage.getItem('otp_email');
    if (!email) {
      setError("Session expired. Please request a new OTP.");
      router.push('/forgot-password');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/user/verify-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid OTP');

      // Store OTP for the reset-password page
      sessionStorage.setItem('otp_code', code);
      showToast("OTP Verified", "Your verification code was accepted.", "success");
      router.push('/reset-password');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const email = sessionStorage.getItem('otp_email');
    if (!email) { router.push('/forgot-password'); return; }

    setTimer(59);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    try {
      await fetch(getApiUrl('/user/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      showToast("Code Resent", "A new OTP code has been dispatched to your email.", "info");
    } catch {
      showToast("Error", "Failed to resend OTP.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFAF6] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block mb-3">
          <img src="/kliamologoNew.png" alt="Kliamo Fashion Logo" className="h-12 w-auto mx-auto object-contain" />
        </Link>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E] tracking-tight">
          Verify security code
        </h2>
        <p className="mt-1.5 text-xs text-[#A89B8A] hidden sm:block">
          Enter the 6-digit code sent to your inbox.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-[#E8E2D6] shadow-xl rounded-lg sm:rounded-lg py-5 sm:py-8 px-4 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  name="otp-input"
                  maxLength={1}
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => e.target.select()}
                  className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-bold border ${error ? 'border-red-400' : 'border-[#E8E2D6]'} bg-[#FDFAF6] rounded-lg outline-none focus:border-[#F9A37E] text-[#4A453E]`}
                />
              ))}
            </div>

            {error && (
              <p className="text-center text-xs text-red-500 font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F9A37E] hover:bg-[#e28e6c] text-white font-extrabold text-xs py-3.5 px-6 rounded-lg transition-all shadow-lg shadow-[#F9A37E]/25 active:scale-95 disabled:opacity-70"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="flex flex-col items-center gap-3 text-xs">
              {timer > 0 ? (
                <span className="text-[#7A736A]">Resend code in <span className="font-bold text-[#4A453E]">0:{timer < 10 ? `0${timer}` : timer}</span></span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-bold text-[#F9A37E] hover:text-[#E8855A]"
                >
                  Resend OTP Code
                </button>
              )}
            </div>
          </form>

          {/* Bottom Switcher buttons */}
          <div className="mt-6 pt-5 border-t border-[#E8E2D6] space-y-3">
            <span className="text-[10px] font-bold text-[#A89B8A] uppercase tracking-wider text-center block">
              Want to start over or authenticate?
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
