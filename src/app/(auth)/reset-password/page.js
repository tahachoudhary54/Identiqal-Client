'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService.js';
import { Input } from '@/components/ui/Input.jsx';
import { Button } from '@/components/ui/Button.jsx';
import { ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const otp = searchParams.get('otp');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!email || !otp) {
      router.push('/login');
    }
  }, [email, otp, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await authService.resetPassword(email, otp, newPassword);
      if (response.success) {
        setIsSuccess(true);
      } else {
        setErrorMsg(response.message || 'Failed to reset password');
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
          <h2 className="text-xl font-bold text-[#1F1F1F]">Create New Password</h2>
          <p className="text-xs text-[#6B6B6B] mt-2">
            Your identity has been verified. You can now set a new password.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2 animate-shake">
            <ShieldAlert size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1F1F1F]">Password Reset Complete</h3>
              <p className="text-xs text-[#6B6B6B] mt-2">You can now sign in with your new password.</p>
            </div>
            <Button className="w-full py-3.5" onClick={() => router.push('/login')}>
              <span>Go to Login</span>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <Input
              label="New Password"
              type="password"
              placeholder="Min 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button type="submit" className="w-full py-3.5" isLoading={isLoading}>
              <span>Reset Password</span>
              <ArrowRight size={14} className="ml-2" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
