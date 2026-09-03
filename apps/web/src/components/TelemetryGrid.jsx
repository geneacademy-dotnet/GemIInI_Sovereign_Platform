/**
 * src/components/TelemetryGrid.jsx
 * Clinical Telemetry & Diagnostic Quantitative Standing Grid
 */

import React from 'react';
import { Flame, Target, BookOpen } from 'lucide-react';
import { useLang } from '@/i18n/LanguageContext';

export default function TelemetryGrid({ ccr = 0, accuracy = 0, streak = 0 }) {
  const { isRtl } = useLang();
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (ccr / 100) * circumference;

  return (
    <div className="my-6 grid w-full grid-cols-1 gap-4 md:grid-cols-3 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Card 1: Course Completion Rate */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#04080F] p-5 shadow-lg">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-slate-400">
            <BookOpen className="h-4 w-4 text-[#00F2FE]" strokeWidth={1.8} />
            <span>{isRtl ? 'Ù†Ø³Ø¨Ø© Ø¥ÙƒÙ…Ø§Ù„ Ø§Ù„Ù…Ù†Ù‡Ø¬ (CCR)' : 'Course Completion Rate'}</span>
          </div>
          <p className="font-mono text-2xl font-bold text-white">{ccr}% <span className="font-sans text-xs text-slate-500">CCR</span></p>
          <p className="mt-1 text-[11px] text-slate-500">{isRtl ? 'ØªÙ‚Ø¯Ù… Ø§Ù„ÙˆØ­Ø¯Ø§Øª Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø©' : 'Weighted module progress'}</p>
        </div>
        <div className="relative flex h-20 w-20 items-center justify-center">
          <svg className="h-full w-full -rotate-90 transform">
            <circle cx="40" cy="40" r={radius} stroke="#1E293B" strokeWidth="6" fill="transparent" />
            <circle
              cx="40" cy="40" r={radius} stroke="#00F2FE" strokeWidth="6"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" fill="transparent"
            />
          </svg>
          <span className="absolute font-mono text-xs font-bold text-white">{ccr}%</span>
        </div>
      </div>

      {/* Card 2: Diagnostic Accuracy */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#04080F] p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Target className="h-4 w-4 text-emerald-400" strokeWidth={1.8} />
            <span>{isRtl ? 'Ø¯Ù‚Ø© Ø§Ù„ØªØ´Ø®ÙŠØµ Ø§Ù„Ø£ÙˆÙ„Ù‰' : 'First-Pass Accuracy'}</span>
          </div>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
            MTCâ„¢ 3-Step
          </span>
        </div>
        <div className="my-2">
          <p className="font-mono text-3xl font-extrabold text-white">{accuracy}%</p>
          <p className="text-[11px] text-slate-500">{isRtl ? 'Ù…ØªÙˆØ³Ø· Ø¯Ù‚Ø© Ø§Ù„ØªÙ‚ÙŠÙŠÙ…Ø§Øª Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ©' : 'Simulation block initial score average'}</p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${accuracy}%` }} />
        </div>
      </div>

      {/* Card 3: Study Streak */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#04080F] p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Flame className="h-4 w-4 text-amber-400" strokeWidth={1.8} />
            <span>{isRtl ? 'Ø£ÙŠØ§Ù… Ø§Ù„Ø§Ø³ØªÙ…Ø±Ø§Ø±ÙŠØ© ÙˆØ§Ù„Ù†Ø´Ø§Ø·' : 'Study Streak'}</span>
          </div>
          <span className="text-[10px] font-mono text-amber-400 font-semibold">+15% Multiplier</span>
        </div>
        <div className="my-2">
          <p className="flex items-center gap-1.5 font-mono text-3xl font-extrabold text-white">
            <span>{streak}</span>
            <span className="font-sans text-sm font-semibold text-slate-400">{isRtl ? 'ÙŠÙˆÙ… Ù…ØªÙˆØ§ØµÙ„' : 'Days Active'}</span>
          </p>
          <p className="text-[11px] text-slate-500">{isRtl ? 'Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø§Øª Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© ÙˆØ®Ù„Ø§ÙŠØ§ Ø§Ù„Ù†Ø´Ø±' : 'Daily case audits & pod reviews'}</p>
        </div>
      </div>
    </div>
  );
}
