'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCardBuilderStore } from '@/store/cardBuilderStore.js';
import { useThemeBuilderStore } from '@/store/themeBuilderStore.js';
import { CardBuilderCanvas } from '@/components/builder/CardBuilderCanvas.jsx';
import { SectionEditorPanel } from '@/components/builder/SectionEditorPanel.jsx';
import { ThemeControls } from '@/components/builder/ThemeControls.jsx';
import { SectionRenderer } from '@/components/builder/SectionRenderer.jsx';
import { cardService } from '@/services/cardService.js';
import { Button } from '@/components/ui/Button.jsx';
import {
  ArrowLeft,
  Save,
  Globe,
  Lock,
  Sparkles,
  Layers,
  Palette,
  Eye,
} from 'lucide-react';

export default function CardEditBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const cardId = params.cardId;

  const {
    title,
    sections,
    seo,
    isDirty,
    setCard,
  } = useCardBuilderStore();

  const themeStore = useThemeBuilderStore();

  const [isLoading, setIsLoading] = useState(true);
  const [activeInspectorTab, setActiveInspectorTab] = useState('editor'); // editor | theme
  const [isSavingCard, setIsSavingCard] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load card and theme details from API
  useEffect(() => {
    const fetchCardData = async () => {
      setIsLoading(true);
      try {
        const cardResponse = await cardService.getCards();
        const activeCard = cardResponse.data.find(c => c._id === cardId);
        if (!activeCard) {
          alert('Card not found');
          router.push('/dashboard/cards');
          return;
        }

        // Set card in builder store
        setCard(activeCard);

        // Fetch user theme (will check organization locks in service)
        const themeResponse = await cardService.getTheme();
        if (themeResponse.success) {
          themeStore.setTheme(themeResponse.data);
        }
      } catch (err) {
        console.error('Failed to load card builder workspace', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (cardId) fetchCardData();
  }, [cardId, setCard]);

  const handleSaveCard = async () => {
    setIsSavingCard(true);
    setSaveSuccess(false);
    try {
      const response = await cardService.updateCard(cardId, {
        title,
        sections,
        seo,
      });
      if (response.success) {
        setCard(response.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      alert('Failed to save layout configuration: ' + e.message);
    } finally {
      setIsSavingCard(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header controls bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-5 gap-4">
        <div className="flex items-center space-x-3">
          <Link href="/dashboard/cards">
            <button className="p-2 border border-slate-250 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-colors">
              <ArrowLeft size={16} />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 flex items-center space-x-1.5">
              <span>Builder Workspace</span>
              <span className="text-[10px] bg-slate-100 text-slate-650 border border-slate-200 px-2 py-0.5 rounded-lg capitalize">
                /{title}
              </span>
            </h1>
            <p className="text-xs text-slate-500">Design your layout and brand styling templates.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {saveSuccess && (
            <span className="text-xs text-green-600 font-semibold animate-pulse">
              Layout saved!
            </span>
          )}
          <Button
            onClick={handleSaveCard}
            isLoading={isSavingCard}
            className="space-x-1.5 py-2.5 shadow-indigo-650/10 shadow-lg"
          >
            <Save size={16} />
            <span>Save Card Layout</span>
          </Button>
        </div>
      </div>

      {/* Workspace Area Layout */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: CardBuilderCanvas */}
        <div className="lg:col-span-4 space-y-6">
          <CardBuilderCanvas />
        </div>

        {/* Center: Live Mobile Preview Card */}
        <div className="lg:col-span-4 space-y-3 flex flex-col items-center">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-550 flex items-center space-x-1">
            <Eye size={12} className="text-slate-400" />
            <span>Visual Preview Device</span>
          </h4>

          {/* Smartphone device Mock frame */}
          <div 
            className="w-full max-w-[340px] border-8 border-slate-850 rounded-[36px] bg-slate-950 overflow-hidden shadow-2xl relative"
            style={{ 
              minHeight: '520px',
              fontFamily: themeStore.font.body || 'sans-serif'
            }}
          >
            {/* Top Speaker notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-850 rounded-full z-20" />
            
            {/* Live rendered scrollable viewport */}
            <div 
              className="p-6 pt-10 space-y-6 overflow-y-auto max-h-[500px]"
              style={{ backgroundColor: themeStore.colors.background || '#ffffff' }}
            >
              {sections.length === 0 ? (
                <div className="text-center py-20 text-slate-500 text-xs">
                  Add layout block components to preview styling.
                </div>
              ) : (
                sections.map((sec) => (
                  <SectionRenderer
                    key={sec.sectionId}
                    section={sec}
                    theme={themeStore}
                    previewMode={true}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Tabbed Configuration Panels */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tab Selector bar */}
          <div className="flex border-b border-slate-200 pb-px">
            <button
              onClick={() => setActiveInspectorTab('editor')}
              className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all flex items-center justify-center space-x-1.5 ${
                activeInspectorTab === 'editor'
                  ? 'border-indigo-500 text-indigo-650 bg-indigo-50/10'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Layers size={14} />
              <span>Configure Component</span>
            </button>
            <button
              onClick={() => setActiveInspectorTab('theme')}
              className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all flex items-center justify-center space-x-1.5 ${
                activeInspectorTab === 'theme'
                  ? 'border-indigo-500 text-indigo-650 bg-indigo-50/10'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Palette size={14} />
              <span>Card Theme</span>
            </button>
          </div>

          <div>
            {activeInspectorTab === 'editor' ? (
              <SectionEditorPanel />
            ) : (
              <ThemeControls />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
