"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleAuthButton } from '../../../components/GoogleAuthButton';
import { useApp } from '../../../components/AppContext';
import { loginSchema, LoginFormData } from '../../../lib/validations/auth';

export default function LoginPage() {
  const { loginUser } = useApp();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await loginUser(data.email, data.password);
    if (result.success) {
      router.push('/');
    } else {
      setError('root.serverError', {
        type: 'server',
        message: result.error || 'Invalid email or password. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFAF6] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block mb-3">
          <img src="/kliamologoNew.png" alt="Kliamo Fashion Logo" className="h-12 w-auto mx-auto object-contain" />
        </Link>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E] tracking-tight">
          Welcome back to the studio
        </h2>
        <p className="mt-1.5 text-xs text-[#A89B8A] hidden sm:block">
          Access your designs, orders, and preferences.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-[#E8E2D6] shadow-xl rounded-lg sm:rounded-lg py-5 sm:py-8 px-4 sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#4A453E]">Email address</label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="you@example.com"
                className={`mt-1.5 w-full bg-[#FDFAF6] border ${errors.email ? 'border-red-500' : 'border-[#E8E2D6]'} rounded-lg py-3 px-4 text-xs outline-none focus:border-[#F9A37E] text-[#4A453E]`}
              />
              {errors.email && (
                <p className="mt-1.5 flex items-start gap-1.5 text-xs text-red-500 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-[#4A453E]">Password</label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className={`w-full bg-[#FDFAF6] border ${errors.password ? 'border-red-500' : 'border-[#E8E2D6]'} rounded-lg py-3 px-4 pr-10 text-xs outline-none focus:border-[#F9A37E] text-[#4A453E]`}
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

              {/* Server-side error — wrong email or password */}
              {errors.root?.serverError && (
                <div className="mt-3 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-600 font-medium leading-snug">
                    {errors.root.serverError.message}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded border-[#E8E2D6] accent-[#F9A37E]" />
                <span className="text-[11px] text-[#7A736A] font-medium">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-[11px] font-bold text-[#F9A37E] hover:text-[#E8855A]">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#F9A37E] hover:bg-[#e28e6c] text-white font-extrabold text-xs py-3.5 px-6 rounded-lg transition-all shadow-lg shadow-[#F9A37E]/25 active:scale-95 disabled:opacity-70"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Social login partition */}
          <div className="mt-6">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E8E2D6]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-[#A89B8A]">Or continue with</span>
              </div>
            </div>

            <GoogleAuthButton text="continue_with" />
          </div>

          {/* Bottom Switcher buttons */}
          <div className="mt-6 pt-5 border-t border-[#E8E2D6] space-y-3">
            <span className="text-[10px] font-bold text-[#A89B8A] uppercase tracking-wider text-center block">
              New here?
            </span>
            <Link
              href="/signup"
              className="w-full bg-[#A8C69F] hover:bg-[#92b089] text-white font-extrabold text-xs py-3.5 px-4 rounded-lg transition-all shadow-md shadow-[#A8C69F]/20 flex items-center justify-center text-center animate-fade-in-up"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
