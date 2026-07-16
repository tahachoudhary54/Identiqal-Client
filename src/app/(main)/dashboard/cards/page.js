'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createCardSchema } from '@/validators/card.validator.js';
import { useCards } from '@/hooks/useCards.js';
import { Button } from '@/components/ui/Button.jsx';
import { Input } from '@/components/ui/Input.jsx';
import { Modal } from '@/components/ui/Modal.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { LiveCardPreview } from '@/components/dashboard/LiveCardPreview.jsx';
import { QRCodeSVG } from 'qrcode.react';
import {
  Plus,
  Trash2,
  Edit,
  Globe,
  Lock,
  ExternalLink,
  QrCode,
  Copy,
  BarChart3,
  Sparkles,
  Share2,
  Download,
  CopyPlus,
  Check
} from 'lucide-react';

const DashboardCard = ({ card, handleTogglePublish, handleDelete, handleDuplicate }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedQR, setCopiedQR] = useState(false);
  
  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${card.slug}`;

  const copyToClipboard = async (text, setter) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById(`qr-${card._id}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${card.slug}-qr.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  // Mock analytics
  const stats = [
    { label: 'Views', value: Math.floor(Math.random() * 500) + 50 },
    { label: 'Scans', value: Math.floor(Math.random() * 200) + 10 },
    { label: 'Saves', value: Math.floor(Math.random() * 100) + 5 },
    { label: 'Leads', value: Math.floor(Math.random() * 50) + 2 },
  ];

  const profileSection = card.sections?.find(s => s.type === 'profile');
  const name = profileSection?.data?.name || card.title;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } }
      }}
      className="bg-white border border-[rgba(90,48,69,0.08)] rounded-[32px] overflow-hidden group transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-[#5A3045]/10 flex flex-col relative"
    >
      {/* Top: Live Profile Preview */}
      <div className="relative border-b border-[rgba(90,48,69,0.06)]">
        <LiveCardPreview card={card} />
        
        {/* Status Badge */}
        <div className="absolute top-5 right-3 z-20">
          <button
            onClick={() => handleTogglePublish(card._id, card.isPublished)}
            className={`px-3 py-1.5 rounded-full border shadow-lg backdrop-blur-md transition-all flex items-center space-x-1.5 text-[9px] font-black uppercase tracking-widest hover:scale-105 ${
              card.isPublished
                ? 'bg-green-500/90 border-green-400 text-white shadow-green-500/20'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-800 shadow-black/5'
            }`}
          >
            {card.isPublished ? (
              <><Globe size={10} /><div>Published</div></>
            ) : (
              <><Lock size={10} /><div>Draft</div></>
            )}
          </button>
        </div>
      </div>

      {/* Middle: Identity & Public URL */}
      <div className="p-6 pb-4">
        <h3 className="font-black text-inherit text-xl truncate group-hover:text-[#5A3045] transition-colors">
          {name}
        </h3>
        
        <div className="mt-3 flex items-center space-x-2 bg-slate-50 border border-slate-100 rounded-xl p-2.5 transition-colors group-hover:bg-[#FAF7F3] group-hover:border-[rgba(90,48,69,0.08)]">
          <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
            <Globe size={14} className="text-[#D4A45B]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Public Link</p>
            <p className="text-xs font-semibold text-inherit truncate opacity-80 mt-0.5">
              identiqal.com/{card.slug}
            </p>
          </div>
          <button 
            onClick={() => copyToClipboard(publicUrl, setCopiedLink)}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm hover:bg-[#5A3045] hover:text-white text-slate-400 transition-all shrink-0"
            title="Copy Public Link"
          >
            {copiedLink ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Bottom: QR & Statistics */}
      <div className="px-6 flex items-center gap-6 mt-2">
        {/* QR Code Container */}
        <div className="w-[104px] h-[104px] rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center justify-center p-2 shrink-0 group-hover:border-[#D4A45B]/30 transition-colors relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#5A3045]/5 to-[#D4A45B]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <QRCodeSVG 
            id={`qr-${card._id}`}
            value={publicUrl}
            size={76}
            bgColor={"#ffffff"}
            fgColor={"#251E2A"}
            level={"Q"}
            className="relative z-10"
          />
        </div>
        
        {/* Stats Grid */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-3 border border-transparent group-hover:border-[rgba(90,48,69,0.05)] transition-colors">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
              <p className="text-base font-black text-inherit mt-0.5">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-6 pt-5 mt-6 border-t border-[rgba(90,48,69,0.06)] flex flex-col gap-5">
        <div className="flex items-center justify-center gap-4 px-1">
          {card.isPublished && (
            <a href={`/${card.slug}`} target="_blank" rel="noopener noreferrer" className="action-btn" title="Open Live Profile">
              <ExternalLink size={16} />
            </a>
          )}
          <button onClick={downloadQR} className="action-btn" title="Download QR">
            <Download size={16} />
          </button>
          <button onClick={() => copyToClipboard(publicUrl, setCopiedQR)} className="action-btn" title="Copy Link">
            {copiedQR ? <Check size={16} /> : <Share2 size={16} />}
          </button>
          <Link href={`/dashboard/analytics?card=${card._id}`}>
            <button className="action-btn" title="Analytics">
              <BarChart3 size={16} />
            </button>
          </Link>
          <button onClick={handleDuplicate} className="action-btn" title="Duplicate">
            <CopyPlus size={16} />
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <button onClick={() => handleDelete(card._id)} className="action-btn text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100" title="Delete Card">
            <Trash2 size={16} />
          </button>
        </div>

        <Link href={`/dashboard/cards/${card._id}/edit`} className="w-full">
          <Button className="w-full h-12 bg-[#5A3045] hover:bg-[#4A2C3A] text-white border-none shadow-md shadow-[#5A3045]/20 font-bold space-x-2 transition-transform hover:scale-[1.02] rounded-xl text-sm">
            <Edit size={16} />
            <span>Edit Card</span>
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default function CardsPage() {
  const { cards, isLoading, createCard, publishCard, deleteCard } = useCards();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(createCardSchema),
  });

  const onSubmit = async (data) => {
    setErrorMsg('');
    try {
      await createCard({ slug: data.slug, title: data.title });
      setIsModalOpen(false);
      reset();
    } catch (err) {
      setErrorMsg(err.message || 'Slug already exists or creation failed');
    }
  };

  const handleTogglePublish = async (cardId, isPublished) => {
    try {
      await publishCard({ cardId, isPublished: !isPublished });
    } catch (e) {
      alert('Failed to update publish state: ' + e.message);
    }
  };

  const handleDelete = async (cardId) => {
    if (confirm('Are you sure you want to permanently delete this card?')) {
      try {
        await deleteCard(cardId);
      } catch (e) {
        alert('Failed to delete card: ' + e.message);
      }
    }
  };

  const handleDuplicate = () => {
    alert('Duplication feature coming soon!');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="space-y-8 w-full pb-16">
      <style>{`
        .action-btn {
          @apply h-10 w-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-800 transition-all border border-transparent hover:border-slate-200 hover:shadow-sm shrink-0;
        }
      `}</style>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[rgba(90,48,69,0.08)] pb-6 relative">
        <div className="space-y-1 z-10">
          <h1 className="text-3xl font-black text-inherit tracking-tight flex items-center gap-3">
            My Digital Cards
            <span className="text-[10px] bg-[#D4A45B]/10 text-[#D4A45B] px-2.5 py-1 rounded-full font-black uppercase tracking-widest border border-[#D4A45B]/20 shadow-sm shadow-[#D4A45B]/5">
              {cards?.length || 0} active
            </span>
          </h1>
          <p className="text-sm font-bold text-slate-500 max-w-lg mt-2 leading-relaxed">
            Design, update, and manage your premium visual networking cards. Share them seamlessly across any platform.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-[#D4A45B] hover:bg-[#c3934b] text-[#1F1F1F] shadow-lg shadow-[#D4A45B]/20 hover:shadow-xl transition-all space-x-2 py-3 px-6 rounded-2xl font-black z-10">
          <Plus size={18} />
          <span>New Card</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[600px] bg-slate-50 rounded-[32px] border border-[rgba(90,48,69,0.06)] animate-pulse" />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          className="text-center py-32 bg-white border border-dashed border-[rgba(90,48,69,0.15)] rounded-[40px] space-y-6 relative overflow-hidden shadow-sm"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4A45B]/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#5A3045]/10 to-[#D4A45B]/10 border border-[#D4A45B]/20 flex items-center justify-center mx-auto text-[#5A3045] shadow-inner relative z-10">
            <Sparkles size={40} />
          </div>
          <div className="space-y-3 relative z-10">
            <h3 className="text-2xl font-black text-inherit">No cards built yet</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto font-semibold leading-relaxed">
              Create your first responsive digital business profile to start capturing leads, sharing your QR code, and tracking powerful analytics.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="bg-[#5A3045] hover:bg-[#4A2C3A] text-white shadow-xl shadow-[#5A3045]/20 font-bold py-3 px-8 rounded-2xl relative z-10 mt-4">
            Create Your First Card
          </Button>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {cards.map((card) => (
            <DashboardCard
              key={card._id}
              card={card}
              handleTogglePublish={handleTogglePublish}
              handleDelete={handleDelete}
              handleDuplicate={handleDuplicate}
            />
          ))}
        </motion.div>
      )}

      {/* Creation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Premium Digital Card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-2">
          {errorMsg && <p className="text-xs bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl font-bold">{errorMsg}</p>}
          <Input
            label="Card Title"
            placeholder="e.g. John Doe — Executive Profile"
            error={errors.title?.message}
            {...register('title')}
          />
          <Input
            label="Public URL Slug"
            placeholder="e.g. john-doe"
            description="Lowercase letters, numbers, hyphens, and underscores. This becomes your permanent public link."
            error={errors.slug?.message}
            {...register('slug')}
          />
          <div className="flex justify-end space-x-3 pt-6 border-t border-[rgba(90,48,69,0.08)] mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-6">
              Cancel
            </Button>
            <Button type="submit" className="bg-[#5A3045] hover:bg-[#4A2C3A] text-white font-bold px-8 shadow-lg shadow-[#5A3045]/20">
              Create Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
