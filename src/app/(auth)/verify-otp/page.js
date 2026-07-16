'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService.js';
import { useAuthStore } from '@/store/authStore.js';
import { Input } from '@/components/ui/Input.jsx';
import { Button } from '@/components/ui/Button.jsx';
import { ShieldAlert, ArrowRight } from 'lucide-react';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const type = searchParams.get('type') || 'signup';
  
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push('/login');
    }
  }, [email, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      setErrorMsg('Please enter a valid 6-digit code');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      if (type === 'signup') {
        const response = await authService.verifyOtp(email, otp);
        if (response.success) {
          setAuth(response.data.token, response.data.user);
          router.push('/dashboard');
        } else {
          setErrorMsg(response.message || 'Verification failed');
        }
      } else if (type === 'reset') {
        // Just verify visually if we want, or proceed to reset password passing otp
        // In our backend, verifyOtp actually logs the user in if successful.
        // Wait, for password reset, we shouldn't log them in yet, they need to set a new password.
        // But our verifyOtp endpoint currently sets isVerified and returns token. 
        // If type === reset, we should just redirect to reset-password page with email & otp.
        router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid or expired OTP');
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
          <h2 className="text-xl font-bold text-[#1F1F1F]">Verify Your Email</h2>
          <p className="text-xs text-[#6B6B6B] mt-2">
            We sent a 6-digit code to <span className="font-bold text-[#5A3342]">{email}</span>
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
            label="Verification Code"
            type="text"
            maxLength={6}
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <Button type="submit" className="w-full py-3.5" isLoading={isLoading}>
            <span>{type === 'signup' ? 'Verify & Login' : 'Continue'}</span>
            <ArrowRight size={14} className="ml-2" />
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
