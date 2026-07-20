"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleAuthButton } from '../../../components/GoogleAuthButton';
import { useApp } from '../../../components/AppContext';
import { signUpSchema, SignUpFormData } from '../../../lib/validations/auth';
import { getApiUrl } from '../../../components/ApiConfig';

export default function SignUpPage() {
  const { registerUser, showToast } = useApp();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP step state
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [pendingData, setPendingData] = useState<SignUpFormData | null>(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  // Resend countdown
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  // Step 1: validate form → send OTP
  const onSubmit = async (data: SignUpFormData) => {
    setSendingOtp(true);
    try {
      const res = await fetch(getApiUrl('/user/send-signup-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email.trim().toLowerCase() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to send OTP');
      setPendingData(data);
      setStep('otp');
      setResendCountdown(60);
      showToast('OTP Sent', `A 6-digit code was sent to ${data.email}`, 'success');
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to send OTP.', 'error');
    } finally {
      setSendingOtp(false);
    }
  };

  // OTP input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setOtpError('');
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split('')); otpRefs.current[5]?.focus(); }
  };

  // Step 2: verify OTP → register
  const handleVerifyAndRegister = async () => {
    const code = otp.join('');
    if (code.length !== 6) { setOtpError('Please enter the complete 6-digit code.'); return; }
    if (!pendingData) return;

    setOtpLoading(true);
    setOtpError('');
    try {
      // Verify OTP
      const res = await fetch(getApiUrl('/user/verify-signup-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingData.email.trim().toLowerCase(), otp: code }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Invalid OTP');

      // Register the account
      const success = await registerUser(pendingData.fullName, pendingData.email, pendingData.password, pendingData.phone);
      if (success) router.push('/');
    } catch (err: any) {
      setOtpError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!pendingData || resendCountdown > 0) return;
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    try {
      await fetch(getApiUrl('/user/send-signup-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingData.email.trim().toLowerCase() }),
      });
      setResendCountdown(60);
      showToast('OTP Resent', 'A new code has been sent to your email.', 'success');
    } catch {
      showToast('Error', 'Failed to resend OTP.', 'error');
    }
  };

  const getInputClass = (hasError?: boolean) =>
    `mt-1.5 w-full bg-[#FDFAF6] border ${hasError ? 'border-red-500' : 'border-[#E8E2D6]'} rounded-lg py-3 px-4 text-sm outline-none focus:border-[#F9A37E] text-[#4A453E] placeholder-[#A89B8A]`;

  return (
    <div className="min-h-screen bg-[#FDFAF6] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block mb-3">
          <img src="/kliamologoNew.png" alt="Kliamo Fashion Logo" className="h-12 w-auto mx-auto object-contain" />
        </Link>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E] tracking-tight">
          Create your creator account
        </h2>
        <p className="mt-1.5 text-sm text-[#A89B8A] hidden sm:block">
          Join to browse and order premium printed apparel.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-[#E8E2D6] shadow-xl rounded-lg sm:rounded-lg py-5 sm:py-8 px-4 sm:px-10">
          {step === 'form' && (
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="fullName" className="block text-sm font-bold text-[#4A453E]">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  {...register("fullName")}
                  placeholder="Jane Doe"
                  className={getInputClass(!!errors.fullName)}
                />
                {errors.fullName && (
                  <p className="mt-1.5 flex items-start gap-1.5 text-xs text-red-500 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-[#4A453E]">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="jane.doe@example.com"
                  className={getInputClass(!!errors.email)}
                />
                {errors.email && (
                  <p className="mt-1.5 flex items-start gap-1.5 text-xs text-red-500 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-[#4A453E]">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  placeholder="+91 9876543210"
                  className={getInputClass(!!errors.phone)}
                />
                {errors.phone && (
                  <p className="mt-1.5 flex items-start gap-1.5 text-xs text-red-500 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-[#4A453E]">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Minimum 8 characters"
                    className={`w-full bg-[#FDFAF6] border ${errors.password ? 'border-red-500' : 'border-[#E8E2D6]'} rounded-lg py-3 px-4 pr-10 text-sm outline-none focus:border-[#F9A37E] text-[#4A453E] placeholder-[#A89B8A]`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89B8A] hover:text-[#4A453E] transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 flex items-start gap-1.5 text-xs text-red-500 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-[#4A453E]">
                  Confirm Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    placeholder="Confirm password"
                    className={`w-full bg-[#FDFAF6] border ${errors.confirmPassword ? 'border-red-500' : 'border-[#E8E2D6]'} rounded-lg py-3 px-4 pr-10 text-sm outline-none focus:border-[#F9A37E] text-[#4A453E] placeholder-[#A89B8A]`}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89B8A] hover:text-[#4A453E] transition-colors">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 flex items-start gap-1.5 text-xs text-red-500 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col pt-2">
                <label className="flex gap-2.5 cursor-pointer select-none items-start">
                  <input
                    type="checkbox"
                    {...register("acceptTerms")}
                    className="w-4 h-4 rounded border-[#E8E2D6] accent-[#F9A37E]"
                  />
                  <span className="text-[10px] text-[#7A736A] font-medium leading-[15px]">
                    I accept the{' '}
                    <Link href="/terms" className="font-bold hover:underline text-[#F9A37E]">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="font-bold hover:underline text-[#F9A37E]">Privacy Policy</Link>.
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1.5 flex items-start gap-1.5 text-xs text-red-500 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    {errors.acceptTerms.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || sendingOtp}
                className="w-full bg-[#F9A37E] hover:bg-[#e28e6c] text-white font-extrabold text-sm py-3.5 px-6 rounded-lg transition-all shadow-lg shadow-[#F9A37E]/25 active:scale-95 disabled:opacity-70 mt-2"
              >
                {sendingOtp ? 'Sending OTP...' : isSubmitting ? 'Registering...' : 'Register Account'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <div className="space-y-5">
              <div className="text-center">
                <p className="text-sm font-bold text-[#4A453E]">Verify your email</p>
                <p className="text-xs text-[#A89B8A] mt-1 leading-snug">
                  We sent a 6-digit code to<br />
                  <strong className="text-[#4A453E]">{pendingData?.email}</strong>
                </p>
              </div>

              <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-bold border-2 rounded-lg outline-none transition-all
                      ${digit ? 'border-[#F9A37E] bg-[#FFF4EE]' : 'border-[#E8E2D6] bg-[#FDFAF6]'}
                      focus:border-[#F9A37E] focus:bg-[#FFF4EE] text-[#4A453E]`}
                  />
                ))}
              </div>

              {otpError && (
                <p className="flex items-start gap-1.5 text-xs text-red-500 font-medium justify-center">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  {otpError}
                </p>
              )}

              <button
                onClick={handleVerifyAndRegister}
                disabled={otpLoading || otp.join('').length !== 6}
                className="w-full bg-[#F9A37E] hover:bg-[#e28e6c] text-white font-extrabold text-xs py-3.5 px-6 rounded-lg transition-all shadow-lg shadow-[#F9A37E]/25 active:scale-95 disabled:opacity-70"
              >
                {otpLoading ? 'Verifying...' : 'Verify & Create Account'}
              </button>

              <div className="flex flex-col items-center gap-2 text-xs">
                {resendCountdown > 0 ? (
                  <span className="text-[#7A736A]">Resend code in <span className="font-bold text-[#4A453E]">0:{resendCountdown < 10 ? `0${resendCountdown}` : resendCountdown}</span></span>
                ) : (
                  <button type="button" onClick={handleResendOtp} className="font-bold text-[#F9A37E] hover:text-[#E8855A]">
                    Resend OTP Code
                  </button>
                )}
                <button type="button" onClick={() => { setStep('form'); setOtp(['','','','','','']); setOtpError(''); }}
                  className="text-[#A89B8A] hover:text-[#4A453E] transition-colors">
                  ← Change details
                </button>
              </div>
            </div>
          )}

          {step === 'form' && (
            <div className="mt-6">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E8E2D6]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-[#A89B8A]">Or sign up with</span>
                </div>
              </div>

              <GoogleAuthButton text="signup_with" />
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-[#E8E2D6] space-y-3">
            <span className="text-[10px] font-bold text-[#A89B8A] uppercase tracking-wider text-center block">
              Already have an account?
            </span>
            <Link
              href="/login"
              className="w-full bg-[#A8C69F] hover:bg-[#92b089] text-white font-extrabold text-sm py-3 px-4 rounded-lg transition-all shadow-md shadow-[#A8C69F]/20 flex items-center justify-center text-center animate-fade-in-up"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
