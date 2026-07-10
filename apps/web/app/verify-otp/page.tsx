"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../components/AppContext';

export default function VerifyOtpPage() {
  const { showToast } = useApp();
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      alert("Please enter the full 6-digit OTP code.");
      return;
    }
    showToast("OTP Verified", "Your verification code was accepted.", "success");
    router.push('/reset-password');
  };

  const handleResend = () => {
    setTimer(59);
    setOtp(["", "", "", "", "", ""]);
    showToast("Code Resent", "A new OTP code has been dispatched to your email.", "info");
  };

  return (
    <div className="min-h-screen bg-[#FDFAF6] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block font-extrabold text-3xl tracking-tight text-[#4A453E] mb-3">
          PRINT<span className="text-[#F9A37E]">HUB</span>
        </Link>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E] tracking-tight">
          Verify security code
        </h2>
        <p className="mt-1.5 text-xs text-[#A89B8A]">
          Enter the 6-digit code sent to your inbox.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 border border-[#E8E2D6] shadow-sm rounded-3xl sm:px-10">
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
                  className="w-12 h-12 text-center text-lg font-bold border border-[#E8E2D6] bg-[#FDFAF6] rounded-xl outline-none focus:border-[#F9A37E] text-[#4A453E]"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-[#F9A37E] hover:bg-[#e28e6c] text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-[#F9A37E]/25 active:scale-95"
            >
              Verify OTP
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
              <Link href="/forgot-password" className="font-bold text-[#A89B8A] hover:text-[#4A453E] mt-2">
                Use different email
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
