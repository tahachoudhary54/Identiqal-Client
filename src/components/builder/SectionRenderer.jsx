'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { buildLeadFormSchema } from '@/validators/leadForm.validator.js';
import { leadService } from '@/services/leadService.js';
import { Button } from '@/components/ui/Button.jsx';
import { Input } from '@/components/ui/Input.jsx';
import { CheckSquare } from 'lucide-react';

export const SectionRenderer = ({ section, theme = {}, previewMode = false }) => {
  const { type, data, isVisible } = section;
  const { colors = {}, font = {}, buttonStyle = 'rounded' } = theme;

  if (!isVisible && !previewMode) return null;

  // Apply button styling
  const buttonRadiusClass = {
    rounded: 'rounded-xl',
    square: 'rounded-none',
    outline: 'rounded-xl border border-current bg-transparent hover:bg-slate-100/10',
  }[buttonStyle] || 'rounded-xl';

  switch (type) {
    case 'about':
      return (
        <div 
          className="p-6 border border-slate-900 rounded-2xl shadow-sm text-center space-y-4"
          style={{ 
            backgroundColor: colors.background || '#ffffff', 
            borderColor: colors.secondary || '#6c757d',
            color: colors.text || '#212529' 
          }}
        >
          {data.avatarUrl && (
            <img 
              src={data.avatarUrl} 
              alt={data.headline} 
              className="w-20 h-20 rounded-full mx-auto object-cover border-2 shadow-md"
              style={{ borderColor: colors.primary || '#000000' }}
            />
          )}
          <div className="space-y-1">
            <h3 
              className="text-lg font-black tracking-tight"
              style={{ fontFamily: font.heading || 'inherit', color: colors.primary || '#000000' }}
            >
              {data.headline || 'Profile Headline'}
            </h3>
            <p className="text-xs opacity-80" style={{ fontFamily: font.body || 'inherit' }}>
              {data.bio || 'Provide a short biography detailing your role and networking background.'}
            </p>
          </div>
        </div>
      );

    case 'links':
      const links = data.links || [];
      return (
        <div className="space-y-3 w-full">
          {links.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No links added yet.</p>
          ) : (
            links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block p-4 border text-center text-xs font-semibold tracking-wide transition-all shadow-sm flex items-center justify-between ${buttonRadiusClass}`}
                style={{ 
                  backgroundColor: colors.background || '#ffffff', 
                  borderColor: colors.secondary || '#6c757d',
                  color: colors.primary || '#000000' 
                }}
              >
                <span className="text-lg">🔗</span>
                <span className="flex-1 text-center font-bold">{link.label}</span>
                <span className="text-xs opacity-60">→</span>
              </a>
            ))
          )}
        </div>
      );

    case 'testimonials':
      return (
        <div 
          className="p-6 border border-slate-900 rounded-2xl shadow-sm space-y-4"
          style={{ 
            backgroundColor: colors.background || '#ffffff', 
            borderColor: colors.secondary || '#6c757d',
            color: colors.text || '#212529' 
          }}
        >
          <div className="text-2xl" style={{ color: colors.accent || '#0d6efd' }}>“</div>
          <p className="text-xs italic leading-relaxed -mt-2">
            {data.quote || 'No testimonial text provided yet.'}
          </p>
          <div className="flex items-center space-x-3 border-t pt-3" style={{ borderColor: `${colors.secondary}20` }}>
            {data.authorAvatarUrl && (
              <img 
                src={data.authorAvatarUrl} 
                alt={data.authorName} 
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <div>
              <h5 className="text-xs font-bold" style={{ color: colors.primary || '#000000' }}>
                {data.authorName || 'Author Name'}
              </h5>
              <p className="text-[10px] opacity-60">{data.authorTitle || 'Title / Organization'}</p>
            </div>
          </div>
        </div>
      );

    case 'form':
      return (
        <FormSectionRenderer 
          section={section} 
          theme={theme} 
          buttonRadiusClass={buttonRadiusClass} 
          previewMode={previewMode}
        />
      );

    case 'gallery':
      const images = data.images || [];
      return (
        <div 
          className="p-6 border border-slate-900 rounded-2xl shadow-sm space-y-4 w-full"
          style={{ 
            backgroundColor: colors.background || '#ffffff', 
            borderColor: colors.secondary || '#6c757d',
            color: colors.text || '#212529' 
          }}
        >
          {data.title && (
            <h4 
              className="text-xs font-bold uppercase tracking-wider text-center"
              style={{ color: colors.primary || '#000000' }}
            >
              {data.title}
            </h4>
          )}
          {images.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No images added yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="space-y-1.5">
                  {img.url ? (
                    <img 
                      src={img.url} 
                      alt={img.caption || 'Gallery Image'} 
                      className="w-full aspect-square object-cover rounded-xl border"
                      style={{ borderColor: colors.secondary || '#6c757d' }}
                    />
                  ) : (
                    <div 
                      className="w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl border flex items-center justify-center text-gray-300"
                      style={{ borderColor: colors.secondary || '#6c757d' }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    </div>
                  )}
                  {img.caption && (
                    <p className="text-[10px] text-center opacity-80" style={{ color: colors.text }}>
                      {img.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
};

// Sub-component to manage form state and dynamic yup validation
const FormSectionRenderer = ({ section, theme, buttonRadiusClass, previewMode }) => {
  const { data, sectionId } = section;
  const { colors = {}, font = {} } = theme;
  const fields = data.fields || [];
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Dynamic Yup schema
  const schema = React.useMemo(() => buildLeadFormSchema(fields), [fields]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData) => {
    if (previewMode) {
      alert('Form submission simulated successfully!');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccess(false);

    try {
      // Find card ID
      const response = await leadService.submitLead(section.cardId || sectionId, {
        name: formData.name || formData.FullName || 'Lead Contact',
        email: formData.email || formData.EmailAddress || 'email@example.com',
        phone: formData.phone || formData.PhoneNumber || '',
        message: Object.entries(formData)
          .filter(([key]) => !['name', 'email', 'phone', 'consentGiven'].includes(key))
          .map(([key, val]) => `${key}: ${val}`)
          .join('\n'),
        consentGiven: formData.consentGiven,
        source: 'form',
      });

      if (response.success) {
        setSuccess(true);
        reset();
      } else {
        setErrorMsg(response.message || 'Failed to submit form');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit inquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="p-6 border border-slate-900 rounded-2xl shadow-sm space-y-4"
      style={{ 
        backgroundColor: colors.background || '#ffffff', 
        borderColor: colors.secondary || '#6c757d',
        color: colors.text || '#212529' 
      }}
    >
      <h4 
        className="text-sm font-bold"
        style={{ fontFamily: font.heading || 'inherit', color: colors.primary || '#000000' }}
      >
        {data.title || 'Contact Me'}
      </h4>

      {success && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-600 rounded-xl text-xs flex items-center space-x-1.5">
          <CheckSquare size={14} />
          <span>Inquiry submitted successfully!</span>
        </div>
      )}

      {errorMsg && (
        <p className="text-xs text-red-500">{errorMsg}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {fields.map((field) => (
          <div key={field.fieldId} className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold uppercase opacity-80" style={{ color: colors.text }}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                className="w-full px-3 py-2 bg-transparent border rounded-lg text-xs focus:outline-none focus:ring-1"
                rows={3}
                style={{ 
                  borderColor: colors.secondary || '#6c757d',
                  color: colors.primary || '#000000',
                  fontFamily: font.body || 'inherit'
                }}
                {...register(field.fieldId)}
              />
            ) : (
              <input
                type={field.type}
                className="w-full px-3 py-2 bg-transparent border rounded-lg text-xs focus:outline-none focus:ring-1"
                style={{ 
                  borderColor: colors.secondary || '#6c757d',
                  color: colors.primary || '#000000',
                  fontFamily: font.body || 'inherit'
                }}
                {...register(field.fieldId)}
              />
            )}
            {errors[field.fieldId] && (
              <span className="text-[10px] text-red-500">{errors[field.fieldId]?.message}</span>
            )}
          </div>
        ))}

        {/* Consent Checkbox */}
        <div className="flex items-start space-x-2 pt-2">
          <input
            type="checkbox"
            id={`consent-${sectionId}`}
            className="mt-1"
            {...register('consentGiven')}
          />
          <label htmlFor={`consent-${sectionId}`} className="text-[9px] opacity-80 leading-snug">
            I consent to sharing my submitted details for follow-up communications.
          </label>
        </div>
        {errors.consentGiven && (
          <p className="text-[10px] text-red-500">{errors.consentGiven?.message}</p>
        )}

        <Button 
          type="submit" 
          className={`w-full py-2.5 text-xs font-semibold ${buttonRadiusClass}`}
          isLoading={isSubmitting}
          style={{ 
            background: `linear-gradient(to right, ${colors.accent || '#0d6efd'}, ${colors.primary || '#000000'})`,
            color: '#ffffff'
          }}
        >
          {data.submitButtonText || 'Send Message'}
        </Button>
      </form>
    </div>
  );
};
