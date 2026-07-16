'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCards } from '@/hooks/useCards.js';
import { useAuthStore } from '@/store/authStore.js';
import { Button } from '@/components/ui/Button.jsx';
import {
  Layers,
  Inbox,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Compass,
  Eye,
  Trash,
  Copy,
  Activity,
  Sparkles,
  QrCode,
  Download,
  Share2,
} from 'lucide-react';
import { motion } from 'framer-motion';

// Premium CountUp counter component
const CountUp = ({ value, duration = 1.2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end) || end === 0) {
      setCount(value);
      return;
    }
    const totalMiliseconds = duration * 1000;
    const incrementTime = 30;
    const steps = Math.ceil(totalMiliseconds / incrementTime);
    const stepValue = end / steps;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      start = Math.floor(stepValue * currentStep);
      if (currentStep >= steps) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
};

// Mini SVG Sparkline curve graph
const Sparkline = ({ stroke = '#D4A45B' }) => (
  <svg className="w-16 h-8 overflow-visible opacity-80" viewBox="0 0 50 20">
    <path
      d="M0,15 Q10,2 18,12 T35,5 T50,15"
      fill="none"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default function DashboardOverviewPage() {
  const { user } = useAuthStore();
  const { cards, isLoading } = useCards();

  const totalCards = cards.length;
  const publishedCardsCount = cards.filter(c => c.isPublished).length;

  return (
    <div className="space-y-8 w-full pb-12">
      {/* Welcome Banner: Premium Burgundy Gradient Card */}
      <div className="bg-gradient-to-br from-[#5A3045] via-[#4A2033] to-[#2E101E] border border-[rgba(90,48,69,0.15)] rounded-[24px] p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg shadow-[#5A3045]/5 group">
        {/* Decorative backdrop shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4A45B]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#5A3045]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-xl text-left">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[10px] font-black text-[#D4A45B] tracking-wider uppercase border border-white/5">
            <Sparkles size={10} />
            <span>Interactive Space</span>
          </div>
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Ready to design your visual identity? Manage your digital business cards, track captured leads, and sync templates instantly.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/dashboard/cards">
              <Button className="bg-[#D4A45B] hover:bg-[#c3934b] text-inherit font-bold text-xs shadow-md shadow-[#D4A45B]/10 rounded-xl px-5 py-2.5 flex items-center space-x-1.5 transition-all hover:scale-102">
                <Plus size={14} />
                <span>Create Card</span>
              </Button>
            </Link>
            <Link href="/templates">
              <Button variant="ghost" className="bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl px-5 py-2.5 border border-white/10">
                Explore Templates
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating CSS Business Card Preview Illustration */}
        <div className="relative shrink-0 hidden md:block z-10 w-44 h-28 select-none">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
            className="w-full h-full bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 shadow-lg flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4A45B] to-[#5A3045] flex items-center justify-center font-bold text-white text-[9px]">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-[7px] text-[#D4A45B] font-black uppercase tracking-widest border border-[#D4A45B]/20 px-1.5 py-0.5 rounded-full bg-[#D4A45B]/5">
                PRO
              </span>
            </div>
            <div>
              <p className="text-[9px] font-bold text-white leading-none truncate">{user?.name}</p>
              <p className="text-[6px] text-slate-300 font-medium">identiqal.com/{user?.name?.toLowerCase()?.replace(/\s+/g, '')}</p>
            </div>
          </motion.div>
          {/* Subtle gold shadow halo */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#D4A45B]/10 to-[#5A3045]/10 blur-md -z-10 opacity-70" />
        </div>
      </div>

      {/* Overview Stats Redesigned Grid */}
      <div className="grid sm:grid-cols-3 gap-6 text-left">
        {/* Stat 1: Cards */}
        <div className="bg-white border border-[rgba(90,48,69,0.08)] rounded-[24px] p-6 space-y-4 shadow-xs relative overflow-hidden group hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#7A7A7A] uppercase tracking-wider font-sans">Total Cards</span>
            <div className="w-8 h-8 rounded-xl bg-[#5A3045]/5 flex items-center justify-center text-[#5A3045] group-hover:scale-110 transition-transform">
              <Layers size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            {isLoading ? (
              <div className="h-9 w-16 bg-slate-100 rounded-lg animate-pulse" />
            ) : (
            <div className="space-y-1">
                <div className="text-3xl font-black tracking-tight" style={{ color: 'inherit' }}>
                  <CountUp value={totalCards} />
                </div>
                <div className="text-[10px] font-bold" style={{ color: 'inherit', opacity: 0.6 }}>
                  ({publishedCardsCount} published cards)
                </div>
              </div>
            )}
            <Sparkline stroke="#D4A45B" />
          </div>
          {/* Subtle status flag line */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-[#5A3045]/50 to-[#D4A45B]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Stat 2: Leads */}
        <div className="bg-white border border-[rgba(90,48,69,0.08)] rounded-[24px] p-6 space-y-4 shadow-xs relative overflow-hidden group hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#7A7A7A] uppercase tracking-wider font-sans">Captured Leads</span>
            <div className="w-8 h-8 rounded-xl bg-[#D4A45B]/5 flex items-center justify-center text-[#D4A45B] group-hover:scale-110 transition-transform">
              <Inbox size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <div className="text-3xl font-black tracking-tight flex items-baseline space-x-1" style={{ color: 'inherit' }}>
                <CountUp value={142} />
                <span className="text-xs text-green-500 font-extrabold flex items-center">
                  ▲ +18%
                </span>
              </div>
              <div className="text-[10px] font-bold" style={{ color: 'inherit', opacity: 0.6 }}>
                Leads Hub • active capture
              </div>
            </div>
            <Sparkline stroke="#5A3045" />
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-[#D4A45B]/50 to-[#5A3045]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Stat 3: Performance */}
        <div className="bg-white border border-[rgba(90,48,69,0.08)] rounded-[24px] p-6 space-y-4 shadow-xs relative overflow-hidden group hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#7A7A7A] uppercase tracking-wider font-sans">Performance</span>
            <div className="w-8 h-8 rounded-xl bg-[#5A3045]/5 flex items-center justify-center text-[#5A3045] group-hover:scale-110 transition-transform">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <div className="text-3xl font-black tracking-tight flex items-baseline space-x-1" style={{ color: 'inherit' }}>
                <CountUp value={2400} />
                <span className="text-xs text-green-500 font-extrabold flex items-center">
                  ▲ +24%
                </span>
              </div>
              <div className="text-[10px] font-bold" style={{ color: 'inherit', opacity: 0.6 }}>
                Analytics • live reporting
              </div>
            </div>
            <Sparkline stroke="#D4A45B" />
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-[#5A3045]/50 to-[#D4A45B]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Main split sections: Cards list & Quick tools */}
      <div className="grid lg:grid-cols-12 gap-8 text-left">
        {/* Left Column: Recent Digital Cards (col-span-8) */}
        <div className="lg:col-span-8 bg-white border border-[rgba(90,48,69,0.08)] rounded-[24px] p-6 space-y-6 shadow-xs relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-1 bg-[#5A3045] h-4 rounded-full" />
              <h3 className="text-sm font-black text-inherit font-sans">Recent Digital Cards</h3>
            </div>
            <Link href="/dashboard/cards" className="text-xs text-[#5A3045] hover:text-[#D4A45B] font-bold flex items-center space-x-1 transition-colors">
              <span>View All</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <div className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
              <div className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
            </div>
          ) : totalCards === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#5A3045]/15 rounded-[20px] space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-[rgba(90,48,69,0.08)] flex items-center justify-center mx-auto text-[#7A7A7A]">
                <Compass size={22} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-inherit">No Business Cards Built Yet</p>
                <p className="text-[10px] text-[#7A7A7A] max-w-xs mx-auto">Create your first responsive business profile card to share with potential clients.</p>
              </div>
              <Link href="/dashboard/cards" className="inline-block">
                <Button className="bg-[#5A3045] text-white hover:bg-[#5A3045]/90 text-xs font-bold py-2 px-4 rounded-xl">
                  Create Your First Card
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {cards.slice(0, 4).map((card) => (
                <div
                  key={card._id}
                  className="p-4 bg-slate-50 hover:bg-white border border-[rgba(90,48,69,0.06)] hover:border-[#D4A45B]/30 rounded-2xl flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      {/* Mini Thumbnail */}
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#5A3045] to-[#D4A45B] flex items-center justify-center font-bold text-white text-[8px] shadow-sm">
                        {card.title[0]?.toUpperCase()}
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        card.isPublished 
                          ? 'bg-green-50 border-green-200 text-green-700' 
                          : 'bg-zinc-150 border-zinc-200 text-zinc-600'
                      }`}>
                        {card.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <div className="text-left space-y-0.5 pt-1">
                      <h4 className="text-xs font-extrabold text-inherit truncate group-hover:text-[#5A3045] transition-colors">{card.title}</h4>
                      <p className="text-[9px] text-[#7A7A7A] font-medium truncate">slug: /{card.slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[rgba(90,48,69,0.04)] mt-3">
                    <div className="flex items-center space-x-2 text-[9px] text-[#7A7A7A] font-bold">
                      <span>Views: 142</span>
                      <span>•</span>
                      <span>Clicks: 42</span>
                    </div>
                    
                    <Link href={`/dashboard/cards/${card._id}/edit`}>
                      <span className="inline-flex items-center justify-center font-bold text-xs px-3 py-1.5 rounded-lg border border-[rgba(90,48,69,0.08)] bg-white text-[#5A3045] hover:bg-[#5A3045] hover:text-white hover:border-[#5A3045] transition-all duration-200 shadow-xs cursor-pointer space-x-1">
                        <span>Edit</span>
                        <ArrowUpRight size={10} />
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Quick Tools & Timeline Activity (col-span-4) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">


          {/* Activity Timeline */}
          <div className="bg-white border border-[rgba(90,48,69,0.08)] rounded-[24px] p-5 space-y-4 shadow-xs flex-1">
            <div className="flex items-center space-x-2">
              <div className="w-1 bg-[#5A3045] h-4 rounded-full" />
              <h3 className="text-sm font-black text-inherit font-sans">Recent Activity</h3>
            </div>

            <div className="space-y-4 relative pl-3 border-l border-[rgba(90,48,69,0.06)] ml-2 text-left pt-1">
              {/* Item 1 */}
              <div className="relative space-y-1">
                <span className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-[#D4A45B] border-2 border-white shadow-xs" />
                <p className="text-[10px] font-extrabold text-inherit">Someone viewed your profile</p>
                <p className="text-[8px] text-[#7A7A7A] font-medium">Acme Inc. visit • 2 mins ago</p>
              </div>

              {/* Item 2 */}
              <div className="relative space-y-1">
                <span className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-[#5A3045] border-2 border-white shadow-xs animate-pulse" />
                <p className="text-[10px] font-extrabold text-inherit">New lead captured: Sarah</p>
                <p className="text-[8px] text-[#7A7A7A] font-medium">sarah@acme.com • 1 hour ago</p>
              </div>

              {/* Item 3 */}
              <div className="relative space-y-1">
                <span className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white shadow-xs" />
                <p className="text-[10px] font-extrabold text-inherit">QR code scanned</p>
                <p className="text-[8px] text-[#7A7A7A] font-medium">San Francisco Conference • 3 hours ago</p>
              </div>

              {/* Item 4 */}
              <div className="relative space-y-1">
                <span className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white shadow-xs" />
                <p className="text-[10px] font-extrabold text-inherit">Card shared on LinkedIn</p>
                <p className="text-[8px] text-[#7A7A7A] font-medium">Sync complete • Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
