/**
 * src/components/LeaderboardWidget.jsx
 * Sovereign Leaderboard Widget with Composite Score (S_rank)
 * STRICT INTEGRITY: Zero fabricated fallback data. Displays only verified remote records.
 */

import React, { useState, useEffect } from 'react';
import { Trophy, Medal, MapPin, Building2, Globe, ShieldCheck, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { getLeaderboard } from '@/lib/geneApi';
import { useLang } from '@/i18n/LanguageContext';

export default function LeaderboardWidget({ currentMemberGaId }) {
  const { isRtl } = useLang();
  const [scope, setScope] = useState('national'); // 'national' | 'regional' | 'university'
  const [filterVal, setFilterVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, filterVal]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getLeaderboard({ scope, filter: filterVal });
      if (res && res.status === 'success' && Array.isArray(res.items)) {
        setLeaderboardData(res.items);
      } else {
        setLeaderboardData([]);
      }
    } catch (err) {
      console.warn('[Leaderboard] Remote fetch offline:', err);
      setError(isRtl ? 'تعذر جلب بيانات المتصدرين المباشرة. يرجى التحقق من الاتصال.' : 'Unable to sync live leaderboard standings. Please check connection or retry.');
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  const topThree = leaderboardData.slice(0, 3);
  const restRankings = leaderboardData.slice(3);

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-[#04080F] p-6 sm:p-8 shadow-2xl relative overflow-hidden font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/3 w-96 h-40 bg-[#00F2FE]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Filter Controls */}
      <div className="mb-6 flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between relative z-10">
        <div>
          <h2 className="flex items-center gap-2 font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
            <Trophy className="h-5 w-5 text-[#B48028]" strokeWidth={2} />
            <span>{isRtl ? 'لوحة الشرف والتميز السيادي' : 'Sovereign Merit Leaderboard'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isRtl ? 'الترتيب مبني بدقة على معادلة التيليميتري السريري المعتمدة (S_rank)' : 'Ranked strictly by verified clinical telemetry (S_rank)'}
          </p>
        </div>

        <div className="flex rounded-xl border border-slate-800 bg-slate-900/80 p-1 text-xs">
          <button
            type="button"
            onClick={() => { setScope('national'); setFilterVal(''); }}
            className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
              scope === 'national' ? 'bg-[#00F2FE] text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isRtl ? 'قومي (السودان)' : 'National'}
          </button>
          <button
            type="button"
            onClick={() => { setScope('regional'); setFilterVal('Khartoum'); }}
            className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
              scope === 'regional' ? 'bg-[#00F2FE] text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isRtl ? 'المراكز الإقليمية' : 'Regional Hubs'}
          </button>
          <button
            type="button"
            onClick={() => { setScope('university'); setFilterVal('Khartoum'); }}
            className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
              scope === 'university' ? 'bg-[#00F2FE] text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isRtl ? 'الجامعات والكليات' : 'Universities'}
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin text-[#00F2FE]" />
          <span className="text-xs font-medium">{isRtl ? 'جاري الاستعلام من السجل السيادي الموثق...' : 'Querying verified clinical registry...'}</span>
        </div>
      ) : error ? (
        <div className="space-y-3 py-10 text-center">
          <div className="inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 p-3 text-amber-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <p className="text-xs text-slate-400">{error}</p>
          <button
            type="button"
            onClick={fetchLeaderboard}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-800"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{isRtl ? 'إعادة المحاولة' : 'Retry Sync'}</span>
          </button>
        </div>
      ) : leaderboardData.length === 0 ? (
        <div className="space-y-2 rounded-2xl border border-dashed border-slate-800 p-8 py-14 text-center">
          <Trophy className="mx-auto mb-2 h-8 w-8 text-slate-600" />
          <p className="text-sm font-bold text-slate-300">{isRtl ? 'لا يوجد مرشحون موثقون في هذا النطاق حالياً' : 'No Verified Candidates in this Scope Yet'}</p>
          <p className="mx-auto max-w-md text-xs text-slate-500">
            {isRtl
              ? 'يتم تحديث الترتيب تلقائياً فور توثيق معرف GA-ID وإكمال محاكاة الحالات السريرية MTC™.'
              : 'Standings populate automatically as physicians authenticate their GA-ID and complete clinical simulation audits.'}
          </p>
        </div>
      ) : (
        <>
          {/* Podium Top 3 */}
          {topThree.length > 0 && (
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {topThree.map((member, idx) => {
                const isGold = idx === 0;
                const isSilver = idx === 1;
                const isBronze = idx === 2;
                return (
                  <div
                    key={member.gaId}
                    className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 transition-all shadow-xl ${
                      isGold
                        ? 'border-[#B48028]/60 bg-gradient-to-b from-[#0A0F1D] to-[#121B2A] shadow-[0_0_20px_rgba(180,128,40,0.15)]'
                        : isSilver
                        ? 'border-slate-700 bg-[#0A0F1D]'
                        : 'border-slate-800 bg-[#0A0F1D]'
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <span className={`font-mono text-xl font-black ${
                        isGold ? 'text-[#B48028]' : isSilver ? 'text-slate-300' : 'text-amber-700'
                      }`}>
                        #{member.rank}
                      </span>
                      <span className="rounded-md border border-slate-700 bg-slate-900 px-2 py-0.5 font-mono text-[11px] font-bold text-[#00F2FE]">
                        {member.gaId}
                      </span>
                    </div>
                    <div>
                      <p className="truncate text-sm font-bold text-white">{member.name}</p>
                      <p className="truncate text-[11px] text-slate-400 mt-0.5">{member.univ}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
                      <span className="text-slate-400 font-medium">{member.gp} GP</span>
                      <span className="font-mono font-bold text-[#00F2FE]">{member.sRank} pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Table for remaining */}
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="px-3.5 py-3 text-start">{isRtl ? 'الترتيب' : 'Rank'}</th>
                  <th className="px-3.5 py-3 text-start">{isRtl ? 'الطبيب / المرشح' : 'Candidate'}</th>
                  <th className="px-3.5 py-3 text-start">{isRtl ? 'الجامعة والمؤسسة' : 'University'}</th>
                  <th className="px-3.5 py-3 text-center">{isRtl ? 'الإكمال (CCR)' : 'CCR %'}</th>
                  <th className="px-3.5 py-3 text-end">{isRtl ? 'النقاط (S_rank)' : 'Composite (S_rank)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {restRankings.map((row) => {
                  const isCurrent = row.gaId === currentMemberGaId;
                  return (
                    <tr
                      key={row.gaId}
                      className={`transition-colors hover:bg-slate-900/60 ${
                        isCurrent ? 'bg-[#00F2FE]/10 font-bold' : ''
                      }`}
                    >
                      <td className="px-3.5 py-3.5 font-mono text-slate-500">#{row.rank}</td>
                      <td className="px-3.5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{row.name}</span>
                          <span className="font-mono text-[10px] text-slate-500">({row.gaId})</span>
                        </div>
                      </td>
                      <td className="max-w-[180px] truncate px-3.5 py-3.5 text-slate-400">{row.univ}</td>
                      <td className="px-3.5 py-3.5 text-center font-mono text-[#00F2FE]">{row.ccr}%</td>
                      <td className="px-3.5 py-3.5 text-end font-mono font-bold text-[#B48028]">{row.sRank}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
