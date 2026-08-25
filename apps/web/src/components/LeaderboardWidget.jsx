/**
 * src/components/LeaderboardWidget.jsx
 * Sovereign Leaderboard Widget with Composite Score (S_rank)
 * STRICT INTEGRITY: Zero fabricated fallback data. Displays only verified remote records.
 */

import React, { useState, useEffect } from 'react';
import { Trophy, Medal, MapPin, Building2, Globe, ShieldCheck, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { callRemote } from '@/services/sovereignService';

export default function LeaderboardWidget({ currentMemberGaId }) {
  const [scope, setScope] = useState('national'); // 'national' | 'regional' | 'university'
  const [filterVal, setFilterVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, [scope, filterVal]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await callRemote('leaderboard', { scope, filter: filterVal }, 'GET');
      if (res && res.status === 'success' && Array.isArray(res.items)) {
        setLeaderboardData(res.items);
      } else {
        setLeaderboardData([]);
      }
    } catch (err) {
      console.warn('[Leaderboard] Remote fetch offline:', err);
      setError('Unable to sync live leaderboard standings. Please check connection or retry.');
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  const topThree = leaderboardData.slice(0, 3);
  const restRankings = leaderboardData.slice(3);

  return (
    <div className="w-full bg-[#04080F] border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-[#B48028]" />
            <span>Sovereign Merit Leaderboard</span>
          </h2>
          <p className="text-xs text-slate-400">Ranked strictly by verified clinical telemetry (S_rank)</p>
        </div>

        <div className="flex bg-[#0A0F1D] p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => { setScope('national'); setFilterVal(''); }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${scope === 'national' ? 'bg-slate-800 text-[#00F2FE] shadow' : 'text-slate-400'}`}
          >
            National
          </button>
          <button
            type="button"
            onClick={() => { setScope('regional'); setFilterVal('Khartoum'); }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${scope === 'regional' ? 'bg-slate-800 text-[#00F2FE] shadow' : 'text-slate-400'}`}
          >
            Regional Hubs
          </button>
          <button
            type="button"
            onClick={() => { setScope('university'); setFilterVal('Khartoum'); }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${scope === 'university' ? 'bg-slate-800 text-[#00F2FE] shadow' : 'text-slate-400'}`}
          >
            University
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex flex-col justify-center items-center text-slate-400 space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#00F2FE]" />
          <span className="text-xs font-medium">Querying verified clinical registry...</span>
        </div>
      ) : error ? (
        <div className="py-10 text-center space-y-3">
          <div className="inline-flex p-3 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="text-xs text-slate-300">{error}</p>
          <button
            type="button"
            onClick={fetchLeaderboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Sync</span>
          </button>
        </div>
      ) : leaderboardData.length === 0 ? (
        <div className="py-12 text-center space-y-2 border border-dashed border-slate-800 rounded-xl p-6">
          <Trophy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">No Verified Candidates in this Scope Yet</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Standings populate automatically as physicians authenticate their GA-ID and complete clinical simulation audits.
          </p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium Cards */}
          {topThree.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {topThree.map((member, idx) => {
                const isGold = idx === 0;
                const isSilver = idx === 1;
                return (
                  <div
                    key={member.gaId}
                    className={`p-4 rounded-xl border relative overflow-hidden flex flex-col justify-between ${
                      isGold
                        ? 'bg-gradient-to-b from-[#B48028]/20 to-[#0A0F1D] border-[#B48028]/50 shadow-lg'
                        : 'bg-[#0A0F1D] border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-lg font-extrabold font-mono ${isGold ? 'text-[#B48028]' : isSilver ? 'text-slate-300' : 'text-amber-700'}`}>
                        #{member.rank}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-[11px] font-mono text-[#00F2FE] rounded">
                        {member.gaId}
                      </span>
                    </div>

                    <div>
                      <p className="font-bold text-sm text-white truncate">{member.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{member.univ}</p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
                      <span className="text-slate-400">{member.gp} GP</span>
                      <span className="font-bold font-mono text-[#00F2FE]">{member.sRank} pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Detailed Rank Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Candidate</th>
                  <th className="py-2.5 px-3">University</th>
                  <th className="py-2.5 px-3 text-center">CCR %</th>
                  <th className="py-2.5 px-3 text-right">Composite (S_rank)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {restRankings.map((row) => {
                  const isCurrent = row.gaId === currentMemberGaId;
                  return (
                    <tr key={row.gaId} className={`hover:bg-slate-900/60 transition-colors ${isCurrent ? 'bg-slate-800/40 font-semibold' : ''}`}>
                      <td className="py-3 px-3 font-mono text-slate-400">#{row.rank}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-white">{row.name}</span>
                          <span className="text-[10px] font-mono text-slate-500">({row.gaId})</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-400 truncate max-w-[150px]">{row.univ}</td>
                      <td className="py-3 px-3 text-center font-mono text-[#00F2FE]">{row.ccr}%</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-amber-400">{row.sRank}</td>
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
