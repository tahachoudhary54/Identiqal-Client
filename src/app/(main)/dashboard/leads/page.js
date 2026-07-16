'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCards } from '@/hooks/useCards.js';
import { useLeads } from '@/hooks/useLeads.js';
import { useAuthStore } from '@/store/authStore.js';
import { Modal } from '@/components/ui/Modal.jsx';
import {
  Inbox,
  Download,
  AlertTriangle,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
  Mail,
  Phone,
  ExternalLink,
} from 'lucide-react';

export default function LeadsDashboardPage() {
  const { user } = useAuthStore();
  const { cards, isLoading: loadingCards } = useCards();
  const [selectedCardId, setSelectedCardId] = useState('');
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const { leads, isLoading: loadingLeads, refetch } = useLeads(selectedCardId);

  useEffect(() => {
    if (cards.length > 0 && !selectedCardId) {
      setSelectedCardId(cards[0]._id);
    }
  }, [cards, selectedCardId]);

  const handleDownloadCsv = () => {
    if (user?.subscriptionTier === 'free') {
      setUpgradeModalOpen(true);
      return;
    }
    if (leads.length === 0) {
      alert('No leads to download');
      return;
    }
    const headers = ['Name', 'Email', 'Phone', 'Message', 'Source', 'Date'];
    const rows = leads.map((l) => [
      l.name,
      l.email,
      l.phone || '',
      l.message.replace(/\n/g, ' '),
      l.source,
      new Date(l.createdAt).toLocaleDateString(),
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_card_${selectedCardId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E9E2DC]">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#C89B5B]">Capture Center</span>
          <h1 className="text-2xl font-black text-inherit mt-1">Leads Hub</h1>
          <p className="text-xs text-[#8A7A6A] mt-1">View contact inquiries and reverse-save capture data.</p>
        </div>

        {cards.length > 0 && (
          <button
            onClick={handleDownloadCsv}
            className="inline-flex items-center space-x-2 bg-[#5A3342] hover:bg-[#6A3B4B] text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-[#5A3342]/20 cursor-pointer"
          >
            <Download size={13} />
            <span>Download CSV</span>
            {user?.subscriptionTier === 'free' && (
              <span className="text-[8px] bg-[#C89B5B] text-white px-1.5 py-0.5 rounded-md uppercase font-black ml-1">Pro</span>
            )}
          </button>
        )}
      </div>

      {loadingCards ? (
        <div className="h-20 bg-[#F5EFE9] rounded-2xl animate-pulse" />
      ) : cards.length === 0 ? (
        <div className="text-center py-24 bg-white border border-[#E9E2DC] rounded-3xl space-y-5 shadow-sm shadow-[#5A3342]/3">
          <div className="w-16 h-16 bg-[#5A3342]/5 rounded-2xl flex items-center justify-center mx-auto">
            <Inbox size={28} className="text-[#5A3342]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-inherit">No captured leads yet</h3>
            <p className="text-xs text-[#8A7A6A] max-w-xs mx-auto">Create and publish a card with an inquiry form to start capturing visitor leads.</p>
          </div>
          <Link href="/dashboard/cards" className="inline-block">
            <span className="inline-flex items-center bg-[#5A3342] hover:bg-[#6A3B4B] text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer">
              Go to My Cards
            </span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Card filter */}
          <div className="flex items-center space-x-3 bg-white border border-[#E9E2DC] p-4 rounded-2xl shadow-sm shadow-[#5A3342]/3">
            <div className="w-8 h-8 rounded-xl bg-[#5A3342]/5 flex items-center justify-center">
              <Layers size={15} className="text-[#5A3342]" />
            </div>
            <span className="text-[10px] text-[#8A7A6A] font-black uppercase tracking-widest">Active Card:</span>
            <select
              value={selectedCardId}
              onChange={(e) => setSelectedCardId(e.target.value)}
              className="bg-[#FAF8F6] border border-[#E9E2DC] rounded-xl text-xs p-2 text-inherit focus:outline-none focus:border-[#5A3342]/40 transition-colors font-semibold flex-1"
            >
              {cards.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title} (/{c.slug})
                </option>
              ))}
            </select>
          </div>

          {/* Leads List */}
          {loadingLeads ? (
            <div className="space-y-3">
              <div className="h-20 bg-[#F5EFE9] rounded-2xl animate-pulse" />
              <div className="h-20 bg-[#F5EFE9] rounded-2xl animate-pulse" />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-16 bg-[#FAF8F6] border border-[#E9E2DC] rounded-2xl">
              <Inbox size={32} className="mx-auto text-[#C89B5B]/50 mb-3" />
              <p className="text-xs text-[#8A7A6A] font-semibold">No lead captures registered for this card yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leads.map((lead) => (
                <div
                  key={lead._id}
                  className="p-5 bg-white border border-[#E9E2DC] hover:border-[#5A3342]/20 rounded-2xl space-y-4 transition-all duration-200 shadow-sm shadow-[#5A3342]/3 hover:shadow-md hover:shadow-[#5A3342]/5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5A3342] to-[#7A4A5E] flex items-center justify-center text-white font-black text-sm shrink-0">
                        {lead.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-inherit">{lead.name}</h4>
                        <div className="flex items-center space-x-3 mt-0.5">
                          <span className="text-[10px] text-[#8A7A6A] flex items-center space-x-1">
                            <Mail size={9} />
                            <span>{lead.email}</span>
                          </span>
                          {lead.phone && (
                            <span className="text-[10px] text-[#8A7A6A] flex items-center space-x-1">
                              <Phone size={9} />
                              <span>{lead.phone}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-[9px] bg-[#5A3342]/5 border border-[#5A3342]/10 text-[#5A3342] px-2.5 py-1 rounded-full capitalize font-bold">
                        via {lead.source}
                      </span>
                      <span className="text-[9px] text-[#8A7A6A] flex items-center space-x-1 bg-[#FAF8F6] border border-[#E9E2DC] px-2.5 py-1 rounded-full">
                        <Calendar size={9} />
                        <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                  {lead.message && (
                    <div className="p-3.5 bg-[#FAF8F6] border border-[#E9E2DC] rounded-xl text-xs text-[#4A3A2E] leading-relaxed whitespace-pre-wrap font-medium">
                      {lead.message}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upgrade Modal */}
      <Modal isOpen={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} title="Upgrade to Pro Plan">
        <div className="flex flex-col items-center space-y-4 py-4 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-[#5A3342] to-[#7A4A5E] rounded-2xl flex items-center justify-center text-[#C89B5B]">
            <Sparkles size={24} />
          </div>
          <h3 className="font-black text-inherit text-base">Unlock CSV Export Logs</h3>
          <p className="text-xs text-[#8A7A6A] max-w-xs leading-relaxed">
            CSV logs and export downloads are exclusive to Pro and Business plan members. Upgrade your tier to activate immediately.
          </p>
          <div className="flex space-x-3 pt-4 border-t border-[#E9E2DC] w-full justify-end">
            <button
              onClick={() => setUpgradeModalOpen(false)}
              className="text-xs font-semibold text-[#8A7A6A] px-4 py-2 rounded-xl border border-[#E9E2DC] hover:bg-[#FAF8F6] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <Link href="/dashboard/billing">
              <span
                onClick={() => setUpgradeModalOpen(false)}
                className="inline-flex items-center space-x-1.5 bg-[#5A3342] hover:bg-[#6A3B4B] text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                <span>View Billing</span>
                <ArrowUpRight size={12} />
              </span>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
