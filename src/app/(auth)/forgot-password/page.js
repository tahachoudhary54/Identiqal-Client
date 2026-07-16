'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService.js';
import { Input } from '@/components/ui/Input.jsx';
import { Button } from '@/components/ui/Button.jsx';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      if (response.success) {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}&type=reset`);
      } else {
        setErrorMsg(response.message || 'Failed to request OTP');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F6] items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white border border-[#E9E2DC] rounded-3xl p-8 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#5A3342] to-[#C89B5B] rounded-t-3xl" />
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-black tracking-tight text-[#1F1F1F] mb-4">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#5A3342] to-[#C89B5B] flex items-center justify-center text-white font-bold text-base shadow-sm">I</span>
            <span className="font-sans">Identiqal</span>
          </Link>
          <h2 className="text-xl font-bold text-[#1F1F1F]">Reset Password</h2>
          <p className="text-xs text-[#6B6B6B] mt-2">
            Enter your email and we'll send you a code to reset your password.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2 animate-shake">
            <ShieldAlert size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="submit" className="w-full py-3.5" isLoading={isLoading}>
            <span>Send Code</span>
            <ArrowRight size={14} className="ml-2" />
          </Button>
        </form>

        <div className="mt-8 text-center text-xs text-[#6B6B6B] border-t border-[#E9E2DC] pt-6 font-semibold">
          Remembered your password?{' '}
          <Link href="/login" className="text-[#5A3342] font-extrabold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
