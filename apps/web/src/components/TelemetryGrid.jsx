/**
 * src/components/TelemetryGrid.jsx
 * Clinical Telemetry & Quantitative Standing Grid
 */

import React from 'react';
import { Flame, Target, BookOpen } from 'lucide-react';

export default function TelemetryGrid({ ccr = 84, accuracy = 91.4, streak = 18 }) {
  // SVG Radial Math for CCR Meter
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (ccr / 100) * circumference;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full my-6">
      {/* Card A: Course Completion Rate (CCR) */}
      <div className="bg-[#04080F] border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-lg">
        <div>
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold mb-1">
            <BookOpen className="w-4 h-4 text-[#00F2FE]" />
            <span>Course Completion Rate</span>
          </div>
          <p className="text-2xl font-bold text-white font-mono">{ccr}% <span className="text-xs text-slate-400 font-sans">CCR</span></p>
          <p className="text-[11px] text-slate-400 mt-1">Weighted module progress</p>
        </div>

        {/* Radial SVG Meter */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="40" cy="40" r={radius} stroke="#1E293B" strokeWidth="6" fill="transparent" />
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#00F2FE"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <span className="absolute text-xs font-bold text-white font-mono">{ccr}%</span>
        </div>
      </div>

      {/* Card B: Diagnostic First-Pass Accuracy */}
      <div className="bg-[#04080F] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>First-Pass Accuracy</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-300 font-semibold rounded-full border border-emerald-500/30">
            MTC™ 3-Step
          </span>
        </div>
        <div className="my-2">
          <p className="text-3xl font-extrabold text-white font-mono">{accuracy}%</p>
          <p className="text-[11px] text-slate-400">Simulation block initial score average</p>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${accuracy}%` }} />
        </div>
      </div>

      {/* Card C: Active Study Streak */}
      <div className="bg-[#04080F] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Study Streak</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-300 font-semibold rounded-full border border-amber-500/30 font-mono">
            +15% GP Multiplier
          </span>
        </div>
        <div className="my-2">
          <p className="text-3xl font-extrabold text-white font-mono flex items-center space-x-1.5">
            <span>{streak}</span>
            <span className="text-sm font-sans text-slate-300 font-semibold">Days Active</span>
            <span className="text-lg">🔥</span>
          </p>
          <p className="text-[11px] text-slate-400">Daily case audits & pod reviews</p>
        </div>
        <div className="text-[10px] text-slate-400 font-mono">Next milestone: 21 Days (+20% Acceleration)</div>
      </div>
    </div>
  );
}
