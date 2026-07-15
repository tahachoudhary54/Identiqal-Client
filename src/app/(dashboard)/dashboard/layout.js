'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore.js';
import { Button } from '@/components/ui/Button.jsx';
import { authService } from '@/services/authService.js';
import {
  CreditCard,
  LayoutDashboard,
  Sparkles,
  Layers,
  Inbox,
  BarChart3,
  Users,
  Wallet,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      clearAuth();
      router.push('/login');
    } catch (e) {
      clearAuth();
      router.push('/login');
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex h-screen bg-[#FAF7F3] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#5A3045]" />
      </div>
    );
  }

  const isOwner = user.role === 'owner' || !user.organizationId; // Individual/Owner see all tabs

  const menuItems = [
    { label: 'Overview', href: '/dashboard', icon: <LayoutDashboard size={16} /> },
    { label: 'My Cards', href: '/dashboard/cards', icon: <Layers size={16} /> },
    { label: 'Captured Leads', href: '/dashboard/leads', icon: <Inbox size={16} /> },
    { label: 'Analytics', href: '/dashboard/analytics', icon: <BarChart3 size={16} /> },
  ];

  // Owner/Individual-only workspace tabs
  const ownerItems = [
    { label: 'Team Workspace', href: '/dashboard/team', icon: <Users size={16} /> },
    { label: 'Billing & Plan', href: '/dashboard/billing', icon: <Wallet size={16} /> },
  ];

  const activeClass = 'bg-[#5A3045] text-white font-semibold shadow-sm border-r-4 border-r-[#D4A45B] rounded-2xl';
  const inactiveClass = 'text-[#7A7A7A] hover:bg-[#5A3045]/5 hover:text-[#5A3045] border-r-4 border-r-transparent rounded-2xl';

  return (
    <div className="flex min-h-screen bg-[#FAF7F3] text-[#1F1F1F] font-sans relative overflow-x-hidden">
      {/* Background ambient glow mesh */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#D4A45B]/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#5A3045]/2 blur-[100px] pointer-events-none" />

      {/* Mobile Sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-4 bottom-4 w-64 bg-white/95 border border-[rgba(90,48,69,0.08)] rounded-[24px] flex flex-col p-4 shadow-sm z-50 transition-all duration-300 lg:left-4 ${
          sidebarOpen ? 'left-4' : '-left-80 lg:left-4'
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-[rgba(90,48,69,0.08)] mb-4">
          <Link href="/" className="flex items-center space-x-2 text-lg font-black tracking-tight text-[#5A3045]">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5A3045] to-[#D4A45B] flex items-center justify-center text-white shadow-sm shadow-[#5A3045]/20">
              <CreditCard size={16} />
            </div>
            <span className="font-sans">Identiqal</span>
          </Link>
          <button className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg" onClick={() => setSidebarOpen(false)}>
            <X size={16} className="text-[#7A7A7A]" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-1 py-2 space-y-1.5 overflow-y-auto">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2 font-sans">Main Menu</p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3.5 py-2.5 transition-all text-xs duration-200 group ${
                  isActive ? activeClass : inactiveClass
                }`}
              >
                <span className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-[#D4A45B]' : 'text-[#7A7A7A] group-hover:text-[#5A3045]'}`}>
                  {item.icon}
                </span>
                <span className="font-sans font-medium">{item.label}</span>
              </Link>
            );
          })}

          {isOwner && (
            <>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-3 mt-6 mb-2 font-sans">Organization</p>
              {ownerItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-3.5 py-2.5 transition-all text-xs duration-200 group ${
                      isActive ? activeClass : inactiveClass
                    }`}
                  >
                    <span className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-[#D4A45B]' : 'text-[#7A7A7A] group-hover:text-[#5A3045]'}`}>
                      {item.icon}
                    </span>
                    <span className="font-sans font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* User Card & Action Area */}
        <div className="pt-4 border-t border-[rgba(90,48,69,0.08)] space-y-2">
          {/* User Profile Card */}
          <div className="flex items-center space-x-2.5 p-2 rounded-2xl bg-[#FAF7F3] border border-[rgba(90,48,69,0.06)] relative overflow-hidden group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5A3045] to-[#D4A45B] flex items-center justify-center font-bold text-white text-xs shadow-md">
              {user.name[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-[#1F1F1F] truncate font-sans">{user.name}</h4>
              <p className="text-[9px] text-[#7A7A7A] flex items-center space-x-1 font-sans">
                <Sparkles size={8} className="text-[#D4A45B] shrink-0" />
                <span className="capitalize font-semibold">{user.subscriptionTier || 'free'}</span>
              </p>
            </div>
            <Link
              href="/dashboard/billing"
              className="p-1 hover:bg-white/80 rounded-lg border border-transparent hover:border-[rgba(90,48,69,0.08)] text-[#7A7A7A] hover:text-[#5A3045] transition-all"
              title="Settings"
            >
              <Settings size={14} />
            </Link>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-center text-xs font-semibold text-[#7A7A7A] hover:text-[#5A3045] hover:bg-[#5A3045]/5 rounded-xl py-2"
          >
            <LogOut size={12} className="mr-1.5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pl-4 lg:pl-[296px] pr-4 py-4 flex flex-col flex-1 min-w-0 relative z-10">
        {/* Floating Header */}
        <header className="w-full h-16 border border-[rgba(90,48,69,0.08)] bg-white/85 backdrop-blur-md rounded-[20px] flex items-center justify-between px-6 sticky top-4 z-30 shadow-xs">
          {/* Left: Breadcrumbs & Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl text-[#1F1F1F] transition-colors"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center space-x-1 text-xs font-bold text-[#7A7A7A] font-sans">
              <span className="hover:text-[#5A3045] transition-colors cursor-pointer">Dashboard</span>
              {pathname.split('/').filter(Boolean).slice(1).map((segment, index) => (
                <React.Fragment key={index}>
                  <ChevronRight size={10} className="text-[#7A7A7A]/60 shrink-0" />
                  <span className="text-[#1F1F1F] capitalize font-extrabold">
                    {segment.replace(/-/g, ' ')}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right: Actions and Status switcher */}
          <div className="flex items-center space-x-3">
            {/* Search Pill */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]" size={14} />
              <input
                type="text"
                placeholder="Search card..."
                className="w-40 xl:w-48 pl-9 pr-4 py-1.5 bg-[#FAF7F3] border border-[rgba(90,48,69,0.08)] rounded-xl text-xs focus:outline-none focus:border-[#D4A45B] focus:bg-white transition-all font-medium placeholder-[#7A7A7A]"
              />
            </div>

            {/* Notification Bell */}
            <button className="p-2 hover:bg-[#FAF7F3] rounded-xl text-[#7A7A7A] hover:text-[#5A3045] transition-colors relative border border-transparent hover:border-[rgba(90,48,69,0.06)]">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D4A45B] animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D4A45B]" />
            </button>

            <span className="hidden sm:inline-block text-[9px] bg-[#5A3045]/5 text-[#5A3045] border border-[rgba(90,48,69,0.08)] px-2.5 py-1 rounded-full capitalize font-black tracking-wider font-sans">
              {user.role} workspace
            </span>

            {/* Micro User Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5A3045] to-[#D4A45B] flex items-center justify-center font-bold text-white text-[10px] shadow-sm">
              {user.name[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page children wrapped in framer motion for page loading fade-in */}
        <main className="flex-1 pt-6 overflow-y-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
