'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore.js';
import {
  Check,
  Zap,
  ShieldCheck,
  Sparkles,
  Crown,
  Building2,
  ArrowUpRight,
  Star,
} from 'lucide-react';

export default function BillingPage() {
  const { user } = useAuthStore();
  const [loadingTier, setLoadingTier] = useState('');

  const handleUpgrade = async (tier) => {
    setLoadingTier(tier);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/billing/checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
          },
          body: JSON.stringify({ tier }),
        }
      );
      const resData = await response.json();
      if (resData.success && resData.data?.checkoutUrl) {
        window.open(resData.data.checkoutUrl, '_blank');
      } else {
        alert(resData.message || 'Checkout failed');
      }
    } catch (e) {
      alert('Checkout failed: ' + e.message);
    } finally {
      setLoadingTier('');
    }
  };

  const currentTier = user?.subscriptionTier || 'free';

  const plans = [
    {
      id: 'free',
      name: 'Starter',
      price: '$0',
      tagline: 'Get started for free',
      icon: Zap,
      iconColor: '#8A7A6A',
      iconBg: '#F5EFE9',
      borderColor: '#E9E2DC',
      features: [
        '1 active digital card',
        'Standard styling palette',
        'View & click tracking',
        'Basic QR code',
      ],
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '$9',
      period: '/mo',
      tagline: 'For serious networkers',
      icon: Sparkles,
      iconColor: '#C89B5B',
      iconBg: 'rgba(200,155,91,0.12)',
      borderColor: '#C89B5B',
      highlight: true,
      features: [
        'Unlimited digital cards',
        'Full custom design controls',
        'CSV lead export downloads',
        'Priority QR generation',
        'Advanced analytics',
      ],
    },
    {
      id: 'business',
      name: 'Business',
      price: '$29',
      period: '/mo',
      tagline: 'For teams & organizations',
      icon: Building2,
      iconColor: '#5A3342',
      iconBg: 'rgba(90,51,66,0.08)',
      borderColor: '#5A3342',
      features: [
        '10 team member seats',
        'Centralized theme locking',
        'Invite & role controls',
        'Aggregated team analytics',
        'Priority support',
      ],
    },
  ];

  return (
    <div className="space-y-10 w-full">

      {/* ── Page Header ───────────────────────────── */}
      <div className="pb-6 border-b border-[#E9E2DC]">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#C89B5B]">
          Account
        </span>
        <h1 className="text-2xl font-black text-inherit mt-1">
          Billing &amp; Subscriptions
        </h1>
        <p className="text-xs text-[#8A7A6A] mt-1">
          Upgrade to unlock premium branding tools, team seats, and CSV exports.
        </p>
      </div>

      {/* ── Active Plan Banner ────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3D1F2B] via-[#5A3342] to-[#7A4555] p-8 shadow-xl shadow-[#5A3342]/25">
        {/* glow orbs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#C89B5B]/15 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-16 left-10 w-48 h-48 rounded-full bg-white/5 blur-[60px] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          {/* left */}
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Crown size={28} className="text-[#C89B5B]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50">
                Your Current Plan
              </p>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-2xl font-black text-white capitalize">
                  {currentTier === 'free' ? 'Free Starter' : currentTier === 'pro' ? 'Professional' : 'Business'}
                </span>
                <span className="inline-flex items-center space-x-1 text-[9px] bg-green-400/20 border border-green-400/30 text-green-300 px-2.5 py-1 rounded-full font-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span>Active</span>
                </span>
              </div>
              <p className="text-[11px] text-white/50 mt-1">
                {currentTier === 'free'
                  ? 'Upgrade to unlock unlimited cards and full branding controls.'
                  : 'Your plan is active and all features are unlocked.'}
              </p>
            </div>
          </div>

          {/* right CTA */}
          {currentTier === 'free' && (
            <button
              onClick={() => handleUpgrade('pro')}
              className="shrink-0 inline-flex items-center space-x-2 bg-[#C89B5B] hover:bg-[#b88a4a] text-white font-bold text-sm px-6 py-3 rounded-2xl transition-all cursor-pointer shadow-md shadow-[#C89B5B]/30"
            >
              <Sparkles size={15} />
              <span>Upgrade to Pro</span>
              <ArrowUpRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── Plans ─────────────────────────────────── */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#8A7A6A] mb-5">
          Available Plans
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((p) => {
            const isActive = currentTier === p.id;
            const Icon = p.icon;

            return (
              <div
                key={p.id}
                className={`relative flex flex-col rounded-3xl border p-6 transition-all duration-300 ${
                  p.highlight
                    ? 'border-[#C89B5B]/50 shadow-lg shadow-[#C89B5B]/10 bg-gradient-to-b from-white to-[#FDF8EF]'
                    : isActive
                    ? 'border-[#5A3342]/30 shadow-md shadow-[#5A3342]/8 bg-white'
                    : 'border-[#E9E2DC] bg-white hover:border-[#5A3342]/20 hover:shadow-md hover:shadow-[#5A3342]/5'
                }`}
              >
                {/* Most popular badge */}
                {p.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center space-x-1 bg-gradient-to-r from-[#5A3342] to-[#7A4555] text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                      <Star size={8} fill="currentColor" />
                      <span>Most Popular</span>
                    </span>
                  </div>
                )}

                {/* Plan icon + name */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: p.iconBg }}
                  >
                    <Icon size={20} style={{ color: p.iconColor }} />
                  </div>
                  {isActive && (
                    <span className="text-[9px] bg-[#5A3342]/8 border border-[#5A3342]/20 text-[#5A3342] px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
                      Current
                    </span>
                  )}
                </div>

                <h3 className="text-base font-black text-inherit">{p.name}</h3>
                <p className="text-[10px] text-[#8A7A6A] mt-0.5 mb-4">{p.tagline}</p>

                {/* Price */}
                <div className="flex items-baseline space-x-1 mb-5">
                  <span className="text-4xl font-black text-inherit">{p.price}</span>
                  {p.period && (
                    <span className="text-xs text-[#8A7A6A] font-semibold">{p.period}</span>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-2.5 pb-6 border-b border-[#F0E8E0] flex-1">
                  {p.features.map((f, idx) => (
                    <div key={idx} className="flex items-center space-x-2.5 text-[11px] text-[#4A3A2E]">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: p.iconBg }}
                      >
                        <Check size={9} style={{ color: p.iconColor }} />
                      </div>
                      <span className="font-medium">{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="pt-5">
                  {isActive ? (
                    <div className="w-full py-2.5 rounded-xl text-xs font-bold text-center bg-[#FAF8F6] border border-[#E9E2DC] text-[#8A7A6A]">
                      ✓ Your Current Plan
                    </div>
                  ) : p.id === 'free' ? (
                    <div className="w-full py-2.5 rounded-xl text-xs font-bold text-center bg-[#FAF8F6] border border-[#E9E2DC] text-[#8A7A6A]">
                      Free Forever
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(p.id)}
                      disabled={loadingTier === p.id}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                        p.highlight
                          ? 'bg-[#5A3342] hover:bg-[#6A3B4B] text-white shadow-md shadow-[#5A3342]/20'
                          : 'bg-[#FAF8F6] border border-[#5A3342]/20 hover:bg-[#5A3342] hover:text-white text-[#5A3342] transition-colors'
                      }`}
                    >
                      {loadingTier === p.id ? (
                        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Upgrade to {p.name}</span>
                          <ArrowUpRight size={12} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Trust strip ───────────────────────────── */}
      <div className="flex flex-wrap items-center justify-center gap-6 py-6 border-t border-[#E9E2DC]">
        {[
          { icon: ShieldCheck, label: 'Secure Payments', sub: 'SSL encrypted checkout' },
          { icon: Zap, label: 'Instant Activation', sub: 'Upgrade goes live immediately' },
          { icon: Crown, label: 'Cancel Anytime', sub: 'No long-term commitments' },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center space-x-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-[#5A3342]/5 flex items-center justify-center shrink-0">
              <Icon size={15} className="text-[#5A3342]" />
            </div>
            <div>
              <p className="text-xs font-bold text-inherit">{label}</p>
              <p className="text-[9px] text-[#8A7A6A]">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
