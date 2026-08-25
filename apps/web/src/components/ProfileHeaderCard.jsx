/**
 * src/components/ProfileHeaderCard.jsx
 * Sovereign Profile Header Card
 */

import React, { useState } from 'react';
import { ShieldCheck, Award, Share2, Check, ExternalLink } from 'lucide-react';

export default function ProfileHeaderCard({ member }) {
  const [copied, setCopied] = useState(false);

  const gaId = member?.id || member?.gaId || 'GA-1000';
  const name = member?.name || 'Dr. Candidate';
  const role = member?.role || 'Clinical Vanguard';
  const track = member?.track || 'MTC Licensure';
  const univ = member?.univ || member?.university || 'University of Khartoum';
  const batch = member?.batch || "'21";
  const gp = Number(member?.gp) || 25;
  const cpdHours = (gp / 100).toFixed(1);
  const isVerified = Boolean(member?.verified);

  // Standardized 3-Part Title
  const standardizedTitle = `${role} | ${track} | ${univ} ${batch}`;

  const handleShareCv = () => {
    const verifyUrl = `https://members.geneacademy.net/verify/${gaId}`;
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full bg-[#04080F] border border-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#B48028]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        {/* Left: Identity Matrix */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <span className="px-3.5 py-1 bg-slate-900 border border-slate-700 text-[#00F2FE] font-mono text-sm font-bold rounded-lg tracking-wider">
              {gaId}
            </span>
            {isVerified ? (
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-semibold rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SudaPass Accredited</span>
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-semibold rounded-full">
                Provisional Explorer
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{name}</h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide">
            {standardizedTitle}
          </p>
        </div>

        {/* Right: GP Wallet Pill & Recruiter Share */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3">
          <div className="px-5 py-2.5 bg-gradient-to-r from-[#0A0F1D] to-slate-900 border border-[#B48028]/40 rounded-xl shadow-lg flex items-center space-x-3">
            <Award className="w-5 h-5 text-[#B48028]" />
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">CPD Wallet</p>
              <p className="text-base font-bold text-white font-mono">
                {gp} GP <span className="text-slate-400 font-normal">|</span> <span className="text-[#00F2FE]">{cpdHours} CPD Hrs</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleShareCv}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 font-semibold rounded-xl transition-colors shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Digital CV Link Copied' : 'Share Digital CV Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
