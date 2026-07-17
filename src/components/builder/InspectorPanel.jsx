'use client';

import React, { useState } from 'react';
import { useCardBuilderStore } from '@/store/cardBuilderStore';
import { Settings, AlignLeft, AlignCenter, AlignRight, Trash2, Plus, ChevronLeft, GripVertical, Eye, EyeOff, Layers, Palette, User, Link as LinkIcon, MessageSquare, FormInput, Image as ImageIcon, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const ICONS = {
  about: User,
  links: LinkIcon,
  gallery: ImageIcon,
  testimonials: MessageSquare,
  form: FormInput,
};

export const InspectorPanel = () => {
  const { activeSectionId, sections, setActiveSection, setBlockPickerOpen } = useCardBuilderStore();
  const activeSection = sections.find((s) => s.sectionId === activeSectionId);

  return (
    <div className="flex flex-col h-full bg-white dark:!bg-[#181518] relative z-10 w-full overflow-hidden">
      
      {/* Dynamic Header */}
      <div className="p-4 border-b border-gray-100 dark:!border-white/10 bg-white/90 dark:!bg-[#181518]/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
        {activeSection ? (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveSection(null)}
              className="p-1.5 hover:bg-gray-100 dark:hover:!bg-white/10 rounded-full transition-colors text-gray-500 dark:!text-gray-300 hover:text-gray-900 dark:hover:!text-white -ml-2"
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className="font-semibold text-gray-900 dark:!text-white capitalize flex items-center gap-2 text-[15px]">
              {activeSection.type} Settings
            </h3>
          </div>
        ) : (
          <h3 className="font-bold text-gray-900 dark:!text-white text-lg">Card Settings</h3>
        )}

        {!activeSection && (
          <button 
            onClick={() => setBlockPickerOpen(true)}
            className="w-8 h-8 flex items-center justify-center bg-gray-900 text-white hover:bg-gray-800 dark:!bg-white dark:!text-black dark:hover:!bg-gray-200 rounded-full transition-colors shadow-sm"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar">
        <AnimatePresence mode="wait">
          {activeSection ? (
            <motion.div
              key="contextual-editor"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <ContextualEditor section={activeSection} />
            </motion.div>
          ) : (
            <motion.div
              key="hierarchy-view"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Hierarchy List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <Layers size={14} /> Blocks
                </h4>
                <SectionHierarchyList />
                
                {sections.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-2xl">
                    <p className="text-sm text-gray-400 mb-3">Your card is empty.</p>
                    <button 
                      onClick={() => setBlockPickerOpen(true)}
                      className="px-4 py-2 bg-primary/10 text-primary dark:!bg-white/10 dark:!text-white hover:bg-primary/20 dark:hover:!bg-white/20 rounded-full text-sm font-semibold transition-colors inline-flex items-center gap-2"
                    >
                      <Plus size={16} /> Add First Block
                    </button>
                  </div>
                )}
              </div>

              {/* Theme Customizer Preview (Placeholder for V2) */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <Palette size={14} /> Theme Options
                </h4>
                <ThemeCustomizer />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* CONTEXTUAL EDITOR                                                          */
/* -------------------------------------------------------------------------- */

const ContextualEditor = ({ section }) => {
  const { updateSectionRealTime } = useCardBuilderStore();

  const handleUpdate = (field, value) => {
    updateSectionRealTime(section.sectionId, { [field]: value });
  };

  return (
    <>
      {section.type === 'about' && (
        <AboutSettings data={section.data} onUpdate={handleUpdate} />
      )}
      {section.type === 'links' && (
        <LinksSettings data={section.data} onUpdate={handleUpdate} />
      )}
      {section.type === 'gallery' && (
        <GallerySettings data={section.data} onUpdate={handleUpdate} />
      )}
      {['testimonials', 'form'].includes(section.type) && (
        <div className="text-sm text-gray-400 text-center py-12 border border-gray-100 rounded-2xl bg-gray-50/50">
          Settings for {section.type} coming soon.
        </div>
      )}
    </>
  );
};

/* -------------------------------------------------------------------------- */
/* SECTION HIERARCHY (DRAG & DROP)                                            */
/* -------------------------------------------------------------------------- */

const SortableHierarchyItem = ({ section, setActiveSection, removeSection, toggleSectionVisibility }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.sectionId });
  const Icon = ICONS[section.type] || Layers;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group bg-white border ${isDragging ? 'border-primary shadow-xl shadow-primary/10' : 'border-gray-200 hover:border-gray-300'} rounded-2xl p-3 flex items-center gap-3 transition-colors`}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-900 p-1"
      >
        <GripVertical size={16} />
      </div>
      
      <div 
        className="flex-1 flex items-center gap-3 cursor-pointer"
        onClick={() => setActiveSection(section.sectionId)}
      >
        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-primary">
          <Icon size={16} />
        </div>
        <div>
          <h5 className="text-sm font-semibold text-gray-900 capitalize">{section.type}</h5>
          <p className="text-[11px] text-gray-500">
            {section.data?.headline || section.data?.title || `${section.data?.links?.length || 0} items`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(section.sectionId); }}
          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors tooltip-trigger" 
          title={section.isVisible ? 'Hide' : 'Show'}
        >
          {section.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); removeSection(section.sectionId); }}
          className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors tooltip-trigger" 
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

const SectionHierarchyList = () => {
  const { sections, setSections, setActiveSection, removeSection, toggleSectionVisibility } = useCardBuilderStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = sections.findIndex((sec) => sec.sectionId === active.id);
      const newIndex = sections.findIndex((sec) => sec.sectionId === over.id);
      const reordered = arrayMove(sections, oldIndex, newIndex);
      reordered.forEach((sec, idx) => { sec.order = idx + 1; });
      setSections(reordered);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sections.map(s => s.sectionId)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {sections.map((section) => (
            <SortableHierarchyItem 
              key={section.sectionId} 
              section={section}
              setActiveSection={setActiveSection}
              removeSection={removeSection}
              toggleSectionVisibility={toggleSectionVisibility}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

/* -------------------------------------------------------------------------- */
/* THEME CUSTOMIZER (UI ONLY)                                                 */
/* -------------------------------------------------------------------------- */

const ThemeCustomizer = () => {
  const { themeConfig, updateThemeConfig } = useCardBuilderStore();

  const colors = ['#8a2be2', '#000000', '#2563eb', '#ea580c', '#16a34a'];
  const fonts = ['Inter', 'Outfit', 'Roboto', 'Playfair Display'];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-[11px] font-semibold text-gray-500 block">Accent Color</label>
        <div className="flex gap-2">
          {colors.map(c => (
            <button 
              key={c}
              onClick={() => updateThemeConfig({ primaryColor: c })}
              className={`w-8 h-8 rounded-full border-2 transition-all ${themeConfig.primaryColor === c ? 'border-gray-900 dark:!border-white scale-110 shadow-md' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <label className="text-[11px] font-semibold text-gray-500 block">Typography</label>
        <div className="grid grid-cols-2 gap-2">
          {fonts.map(f => (
            <button 
              key={f}
              onClick={() => updateThemeConfig({ fontFamily: f })}
              className={`py-2 px-3 text-sm rounded-xl border transition-all ${themeConfig.fontFamily === f ? 'border-primary dark:!border-white bg-primary/5 dark:!bg-white/10 text-primary dark:!text-white font-semibold' : 'border-gray-200 dark:!border-white/20 text-gray-600 dark:!text-gray-300 hover:bg-gray-50 dark:hover:!bg-white/5'}`}
              style={{ fontFamily: f }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};


/* -------------------------------------------------------------------------- */
/* SETTINGS COMPONENTS                                                        */
/* -------------------------------------------------------------------------- */

const SettingGroup = ({ title, children }) => (
  <div className="space-y-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
    <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{title}</h4>
    <div className="space-y-5">{children}</div>
  </div>
);

const RealtimeInput = ({ label, value, onChange, placeholder, as = 'input', rows = 3 }) => (
  <div className="space-y-1.5">
    <label className="text-[12px] font-medium text-gray-700 block">{label}</label>
    {as === 'textarea' ? (
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 resize-none shadow-sm"
      />
    ) : (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 shadow-sm"
      />
    )}
  </div>
);

const AboutSettings = ({ data, onUpdate }) => (
  <>
    <SettingGroup title="Content">
      <RealtimeInput label="Name / Headline" value={data.headline} onChange={(val) => onUpdate('headline', val)} />
      <RealtimeInput label="Bio / Description" value={data.bio} onChange={(val) => onUpdate('bio', val)} as="textarea" />
      <RealtimeInput label="Avatar URL" value={data.avatarUrl} onChange={(val) => onUpdate('avatarUrl', val)} />
    </SettingGroup>
    
    <SettingGroup title="Design">
      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-gray-700 block">Text Alignment</label>
        <div className="flex bg-gray-50/80 rounded-xl p-1 border border-gray-200 shadow-sm">
          {['left', 'center', 'right'].map((align) => (
            <button
              key={align}
              onClick={() => onUpdate('alignment', align)}
              className={`flex-1 flex justify-center py-2 rounded-lg text-gray-500 transition-all ${
                (data.alignment || 'center') === align ? 'bg-white shadow text-gray-900 font-medium' : 'hover:bg-gray-100/50'
              }`}
            >
              {align === 'left' && <AlignLeft size={16} />}
              {align === 'center' && <AlignCenter size={16} />}
              {align === 'right' && <AlignRight size={16} />}
            </button>
          ))}
        </div>
      </div>
    </SettingGroup>
  </>
);

const LinksSettings = ({ data, onUpdate }) => {
  const links = data.links || [];

  const updateLink = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onUpdate('links', newLinks);
  };

  const addLink = () => onUpdate('links', [...links, { label: 'New Link', url: 'https://' }]);
  
  const removeLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    onUpdate('links', newLinks);
  };

  return (
    <SettingGroup title="Social & Custom Links">
      <AnimatePresence>
        {links.map((link, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-4 bg-white border border-gray-200 shadow-sm rounded-2xl space-y-4 relative group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 tracking-wider">LINK {index + 1}</span>
              <button 
                onClick={() => removeLink(index)}
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-50 p-1.5 rounded-lg"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <RealtimeInput label="Label" value={link.label} onChange={(val) => updateLink(index, 'label', val)} />
            <RealtimeInput label="URL" value={link.url} onChange={(val) => updateLink(index, 'url', val)} />
          </motion.div>
        ))}
      </AnimatePresence>

      <button 
        onClick={addLink}
        className="w-full py-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-600 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
      >
        <Plus size={16} /> Add Another Link
      </button>
    </SettingGroup>
  );
};

/* -------------------------------------------------------------------------- */
/* GALLERY SETTINGS                                                           */
/* -------------------------------------------------------------------------- */

const GallerySettings = ({ data, onUpdate }) => {
  const images = data.images || [];

  const updateImage = (index, field, value) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    onUpdate('images', newImages);
  };

  const addImage = () => onUpdate('images', [...images, { url: '', caption: '' }]);
  
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onUpdate('images', newImages);
  };

  return (
    <SettingGroup title="Gallery Configuration">
      <RealtimeInput label="Gallery Title" value={data.title || ''} onChange={(val) => onUpdate('title', val)} />
      
      <div className="pt-6 mt-4 border-t border-gray-100 dark:border-white/10 space-y-4">
        <h4 className="text-[11px] font-bold text-gray-500 tracking-wider">IMAGES</h4>
        
        <AnimatePresence>
          {images.map((img, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-2xl space-y-4 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-400 tracking-wider">IMAGE {index + 1}</span>
                <button 
                  onClick={() => removeImage(index)}
                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-50 dark:bg-white/10 p-1.5 rounded-lg"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <RealtimeInput label="Image URL" value={img.url} onChange={(val) => updateImage(index, 'url', val)} />
              <RealtimeInput label="Caption (Optional)" value={img.caption || ''} onChange={(val) => updateImage(index, 'caption', val)} />
            </motion.div>
          ))}
        </AnimatePresence>

        <button 
          onClick={addImage}
          className="w-full py-3 bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/20 rounded-2xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Image
        </button>
      </div>
    </SettingGroup>
  );
};

