/**
 * src/components/IdGateModal.jsx
 * Sovereign Identity Gate for GemIInI Academy
 */

import React, { useState } from 'react';
import { ShieldCheck, KeyRound, UserPlus, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SovereignClient, normalizeGaId } from '@/services/sovereignService';

const CANONICAL_UNIVERSITIES = [
  'University of Khartoum',
  'Omdurman Islamic University',
  'University of Gezira',
  'Al-Neelain University',
  'Ahfad University for Women',
  'National University (Sudan)',
  'University of Bahri',
  'Red Sea University',
  'International University of Africa',
  'Other Canonical Sudanese Faculty',
];

export default function IdGateModal({ isOpen, onClose, onHydrateProfile }) {
  const [activeTab, setActiveTab] = useState('lookup'); // 'lookup' | 'register'
  const [gaInput, setGaInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 60-Second Registration State
  const [regForm, setRegForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    university: CANONICAL_UNIVERSITIES[0],
    role: 'clinical_student',
    track: 'GemIInI',
  });

  if (!isOpen) return null;

  // Handle Existing ID Lookup
  const handleLookupSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const normalized = normalizeGaId(gaInput);

    if (!normalized) {
      setErrorMsg('Please enter a valid GemIInI ID (e.g., GA-1042).');
      return;
    }

    setIsLoading(true);
    try {
      const response = await SovereignClient.lookup(normalized);
      if (response && response.found && response.member) {
        onHydrateProfile(response.member);
        onClose();
      } else {
        setErrorMsg('GA-ID record not found. Please verify your ID or create a new one.');
      }
    } catch (err) {
      setErrorMsg('Verification service temporarily unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Quick Onboarding
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regForm.fullName.trim() || !regForm.email.trim() || !regForm.phone.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await SovereignClient.register({
        fullName: regForm.fullName,
        email: regForm.email,
        phone: regForm.phone,
        university: regForm.university,
        role: regForm.role,
        track: 'GemIInI',
        providerRef: 'PROVISIONAL_ONBOARDING',
      });

      if (res && res.status === 'success') {
        onHydrateProfile({
          id: res.gaId,
          name: regForm.fullName,
          role: regForm.role,
          univ: regForm.university,
          gp: res.gpBalance || 25,
          ccr: 0,
          verified: false,
        });
        onClose();
      } else {
        throw new Error(res?.message || 'Registration failed.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-[#04080F] border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 font-sans relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#00F2FE]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-slate-900 border border-slate-800 rounded-2xl mb-3 text-[#00F2FE]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">GemIInI Sovereign Access Gate</h2>
          <p className="text-xs text-slate-400 mt-1">Authenticate with your digital clinical credential or mint a new GA-ID.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => { setActiveTab('lookup'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-lg flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'lookup'
                ? 'bg-[#0A0F1D] text-[#00F2FE] border border-slate-700 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>I Have a GemIInI ID</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-lg flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'register'
                ? 'bg-[#0A0F1D] text-[#B48028] border border-slate-700 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Get a Sovereign ID</span>
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: Lookup Form */}
        {activeTab === 'lookup' && (
          <form onSubmit={handleLookupSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Enter Your GA-ID</label>
              <input
                type="text"
                placeholder="e.g. GA-1042"
                value={gaInput}
                onChange={(e) => setGaInput(e.target.value)}
                className="w-full px-4 py-3 bg-[#0A0F1D] border border-slate-700 rounded-xl text-base font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#00F2FE]"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#00F2FE] hover:bg-[#00D2DE] text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Authenticate & Hydrate Profile</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        )}

        {/* TAB 2: 60-Second Onboarding */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-left">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                placeholder="Dr. Firstname Lastname"
                value={regForm.fullName}
                onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                className="w-full px-3 py-2 bg-[#0A0F1D] border border-slate-700 rounded-lg text-sm text-white focus:border-[#B48028]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="doctor@hospital.org"
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0A0F1D] border border-slate-700 rounded-lg text-sm text-white focus:border-[#B48028]"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">WhatsApp Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+20 / +249..."
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0A0F1D] border border-slate-700 rounded-lg text-sm text-white focus:border-[#B48028]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Canonical University *</label>
              <select
                value={regForm.university}
                onChange={(e) => setRegForm({ ...regForm, university: e.target.value })}
                className="w-full px-3 py-2 bg-[#0A0F1D] border border-slate-700 rounded-lg text-xs text-white focus:border-[#B48028]"
              >
                {CANONICAL_UNIVERSITIES.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#B48028] hover:bg-[#96671E] text-white font-bold text-sm rounded-xl flex items-center justify-center space-x-2 transition-colors mt-4 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Mint GA-ID (+25 GP Explorer)</span><CheckCircle2 className="w-4 h-4" /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
