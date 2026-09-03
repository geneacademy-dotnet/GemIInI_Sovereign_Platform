/**
 * src/components/ProfileHeaderCard.jsx
 * Sovereign Profile Header Card
 */

import React, { useState } from 'react';
import { ShieldCheck, Award, Share2, Check, ExternalLink } from 'lucide-react';
import { useLang } from '@/i18n/LanguageContext';

export default function ProfileHeaderCard({ member }) {
  const { isRtl } = useLang();
  const [copied, setCopied] = useState(false);

  const gaId = member?.id || member?.gaId || 'GA-UNVERIFIED';
  const name = member?.name || 'Candidate';
  const role = member?.role || 'Clinical Vanguard';
  const univ = member?.univ || member?.university || 'Canonical Faculty';
  const gp = Number(member?.gp) || 0;
  const cpdHours = (gp / 100).toFixed(1);
  const isVerified = Boolean(member?.verified);

  const handleShareCv = () => {
    const verifyUrl = `${window.location.origin}/verify?id=${encodeURIComponent(gaId)}`;
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#04080F] p-6 shadow-2xl sm:p-8 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Subtle Cyan Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#00F2FE]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-1 font-mono text-sm font-bold tracking-wider text-[#00F2FE]">
              {gaId}
            </span>
            {isVerified ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span>{isRtl ? 'Ø¹Ø¶Ùˆ Ø³ÙŠØ§Ø¯ÙŠ Ù…ÙˆØ«Ù‚' : 'Verified Sovereign'}</span>
              </span>
            ) : (
              <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
                {isRtl ? 'Ù‚ÙŠØ¯ Ø§Ù„ØªÙˆØ«ÙŠÙ‚ Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠ' : 'Unverified / In Training'}
              </span>
            )}
          </div>
          <h1 className="font-display text-2xl font-extrabold text-white tracking-tight sm:text-3xl">{name}</h1>
          <p className="text-xs font-medium tracking-wide text-slate-400 sm:text-sm">{role} Â· {univ}</p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row md:flex-col md:items-end">
          <div className="flex items-center gap-3 rounded-xl border border-[#B48028]/40 bg-[#0A0F1D] px-5 py-2.5 shadow-lg">
            <Award className="h-5 w-5 text-[#B48028]" strokeWidth={1.8} />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{isRtl ? 'Ø±ØµÙŠØ¯ Ø§Ù„Ù†Ù‚Ø§Ø· ÙˆØ§Ù„Ø³Ø§Ø¹Ø§Øª' : 'GP & CPD Balance'}</p>
              <p className="font-mono text-base font-bold text-white">
                {gp} GP <span className="font-normal text-slate-600">|</span> <span className="text-[#00F2FE]">{cpdHours} CPD Hrs</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleShareCv}
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 shadow-sm transition-colors hover:bg-slate-800"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5 text-slate-400" />}
            <span>{copied ? (isRtl ? 'ØªÙ… Ù†Ø³Ø® Ø±Ø§Ø¨Ø· Ø§Ù„ØªÙˆØ«ÙŠÙ‚' : 'Verify link copied') : (isRtl ? 'Ù…Ø´Ø§Ø±ÙƒØ© Ø±Ø§Ø¨Ø· Ø§Ù„ØªÙˆØ«ÙŠÙ‚' : 'Share verify link')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
