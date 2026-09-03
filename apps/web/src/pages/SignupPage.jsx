/**
 * src/pages/SignupPage.jsx
 * Sovereign ID Minting & Onboarding Suite
 * 2027 Spatial Glass Design
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Sparkles, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { useLang } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const inputClass = 'h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition-all placeholder:text-white/40 focus:border-[#00F2FE]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#00F2FE]/20';

export default function SignupPage() {
    const { lang, isRtl } = useLang();
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', university: 'University of Khartoum', password: '' });
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const newMember = await signup(form.email, form.password, { name: form.name, university: form.university });
            setStatus('done');
            setTimeout(() => {
                navigate(`/profile?id=${encodeURIComponent(newMember.ga_id || newMember.id)}`);
            }, 800);
        } catch (err) {
            setStatus('done');
            navigate('/profile');
        }
    };

    return (
        <Layout>
            <Helmet>
                <title>{isRtl ? 'Ø¥Ù†Ø´Ø§Ø¡ Ø­Ø³Ø§Ø¨ Ø³ÙŠØ§Ø¯ÙŠ Ø¬Ø¯ÙŠØ¯ (+25 GP) | Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© Ø¬ÙŠÙ…ÙŠÙ†ÙŠ' : 'Mint Sovereign SudaPass ID (+25 GP) | GemIInI Academy'}</title>
            </Helmet>

            <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#04080F] relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
                
                <div className="pointer-events-none absolute w-96 h-96 bg-[#00F2FE]/15 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

                <div className="w-full max-w-md relative z-10 rounded-[2.5rem] border border-white/15 bg-white/5 backdrop-blur-3xl p-8 sm:p-10 shadow-2xl">
                    
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold mb-3">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>+25 GP Welcome Grant</span>
                        </div>
                        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            {isRtl ? 'Ø§Ù†Ø¶Ù… Ø¥Ù„Ù‰ Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø·Ø¨ÙŠ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ' : 'Mint Your SudaPass GA-ID'}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-400 mt-2">
                            {isRtl ? 'Ø£Ù†Ø´Ø¦ Ù‡ÙˆÙŠØªÙƒ Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© ÙˆØ§Ù„Ø³Ø±ÙŠØ±ÙŠØ© Ø§Ù„Ù…Ø­Ù…ÙŠØ© ÙÙŠ Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ù…ÙˆØ­Ø¯:' : 'Create your decentralized clinical and academic profile in seconds:'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="text-start">
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                {isRtl ? 'Ø§Ù„Ø§Ø³Ù… Ø§Ù„ÙƒØ§Ù…Ù„ (ÙƒÙ…Ø§ ÙŠØ¸Ù‡Ø± ÙÙŠ Ø§Ù„Ø´Ù‡Ø§Ø¯Ø§Øª) *' : 'Full Legal Name *'}
                            </label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder={isRtl ? 'Ø¯. Ø³Ø§Ø±Ø© Ø£Ø­Ù…Ø¯' : 'Dr. Sara Ahmed'}
                                className={inputClass}
                            />
                        </div>

                        <div className="text-start">
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                {isRtl ? 'Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ *' : 'Email Address *'}
                            </label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="doctor@example.com"
                                className={inputClass}
                            />
                        </div>

                        <div className="text-start">
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                {isRtl ? 'Ø§Ù„ÙƒÙ„ÙŠØ© Ø£Ùˆ Ø§Ù„Ù…Ø¤Ø³Ø³Ø© Ø§Ù„Ø·Ø¨ÙŠØ© *' : 'Medical Faculty / University *'}
                            </label>
                            <input
                                type="text"
                                required
                                value={form.university}
                                onChange={(e) => setForm({ ...form, university: e.target.value })}
                                placeholder="University of Khartoum"
                                className={inputClass}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full h-12 rounded-2xl bg-white hover:bg-[#00F2FE] text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 disabled:opacity-70 mt-2"
                        >
                            {status === 'loading' ? (
                                <Zap className="h-5 w-5 animate-pulse" />
                            ) : (
                                <>
                                    <span>{isRtl ? 'ØªÙØ¹ÙŠÙ„ Ø§Ù„Ø­Ø³Ø§Ø¨ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ (+25 GP)' : 'Mint Profile & Enter (+25 GP)'}</span>
                                    {isRtl ? <ArrowRight className="h-4 w-4 rotate-180" /> : <ArrowRight className="h-4 w-4" />}
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-slate-400">
                        <span>{isRtl ? 'Ù„Ø¯ÙŠÙƒ Ø­Ø³Ø§Ø¨ Ø¨Ø§Ù„ÙØ¹Ù„ØŸ ' : 'Already have a GA-ID? '}</span>
                        <Link to="/login" className="text-[#00F2FE] font-bold hover:underline">
                            {isRtl ? 'ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„' : 'Sign in here'}
                        </Link>
                    </div>

                </div>

            </div>
        </Layout>
    );
}
