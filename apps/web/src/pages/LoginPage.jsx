/**
 * src/pages/LoginPage.jsx
 * Sovereign SudaPass & Academy Member Access Portal
 * 2027 Spatial Glass Design
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Fingerprint, Lock, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { useLang } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const inputClass = 'h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition-all placeholder:text-white/40 focus:border-[#00F2FE]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#00F2FE]/20';

export default function LoginPage() {
    const { lang, isRtl } = useLang();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!identifier.trim()) {
            setErrorMsg(isRtl ? 'ÙŠØ±Ø¬Ù‰ Ø¥Ø¯Ø®Ø§Ù„ Ø§Ù„Ø±Ù‚Ù… Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ GA-ID Ø£Ùˆ Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ' : 'Please enter your GA-ID or Email');
            return;
        }

        setStatus('loading');
        setErrorMsg('');

        try {
            const user = await login(identifier.trim(), password);
            setStatus('success');
            setTimeout(() => {
                navigate(`/profile?id=${encodeURIComponent(user.ga_id || identifier.trim())}`);
            }, 600);
        } catch (err) {
            setStatus('idle');
            setErrorMsg(isRtl ? 'ØªØ¹Ø°Ø± Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„Ø­Ø³Ø§Ø¨. ÙŠØ±Ø¬Ù‰ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© Ù…Ø±Ø© Ø£Ø®Ø±Ù‰.' : 'Could not authenticate. Please try again.');
        }
    };

    return (
        <Layout>
            <Helmet>
                <title>{isRtl ? 'ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø¥Ù„Ù‰ SudaPass | Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© Ø¬ÙŠÙ…ÙŠÙ†ÙŠ' : 'SudaPass Member Access | GemIInI Academy'}</title>
            </Helmet>

            <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#04080F] relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
                
                {/* Ambient Glow */}
                <div className="pointer-events-none absolute w-96 h-96 bg-[#00F2FE]/15 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

                <div className="w-full max-w-md relative z-10 rounded-[2.5rem] border border-white/15 bg-white/5 backdrop-blur-3xl p-8 sm:p-10 shadow-2xl">
                    
                    <div className="text-center mb-8">
                        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-[#00F2FE]/10 text-[#00F2FE] mb-4 shadow-xl">
                            <Fingerprint className="h-7 w-7" />
                        </div>
                        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            {isRtl ? 'Ù…Ù†ØµØ© Ø§Ù„Ø·Ø¨ÙŠØ¨ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ©' : 'SudaPass Member Access'}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-400 mt-2">
                            {isRtl ? 'Ø£Ø¯Ø®Ù„ Ù…Ø¹Ø±ÙÙƒ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ (Ù…Ø«Ù„ GA-001) Ø£Ùˆ Ø¨Ø±ÙŠØ¯Ùƒ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ Ù„Ù„ÙˆØµÙˆÙ„ Ø¥Ù„Ù‰ Ù…Ø­ÙØ¸ØªÙƒ ÙˆØ³Ø¬Ù„Ùƒ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ:' : 'Enter your GA-ID (e.g. GA-001) or Email to access your clinical cockpit:'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="text-start">
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                {isRtl ? 'Ø§Ù„Ù…Ø¹Ø±Ù Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ (GA-ID) Ø£Ùˆ Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ *' : 'Sovereign GA-ID or Email *'}
                            </label>
                            <input
                                type="text"
                                required
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder="GA-001 / doctor@geneacademy.net"
                                className={inputClass}
                            />
                        </div>

                        <div className="text-start">
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                {isRtl ? 'ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± (Ø§Ø®ØªÙŠØ§Ø±ÙŠ Ù„Ù„Ø£Ø¹Ø¶Ø§Ø¡ Ø§Ù„Ù…Ø³Ø¬Ù„ÙŠÙ†)' : 'Password (Optional for Registered Members)'}
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                                className={inputClass}
                            />
                        </div>

                        {errorMsg && (
                            <p className="text-xs text-rose-400 text-start">{errorMsg}</p>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full h-12 rounded-2xl bg-[#00F2FE] hover:bg-[#38BDF8] text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#00F2FE]/20 transition-all active:scale-95 disabled:opacity-70 mt-2"
                        >
                            {status === 'loading' ? (
                                <Zap className="h-5 w-5 animate-pulse" />
                            ) : (
                                <>
                                    <span>{isRtl ? 'Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø¥Ù„Ù‰ Ø§Ù„Ù…Ù†ØµØ©' : 'Enter SudaPass Cockpit'}</span>
                                    {isRtl ? <ArrowRight className="h-4 w-4 rotate-180" /> : <ArrowRight className="h-4 w-4" />}
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-slate-400">
                        <span>{isRtl ? 'Ù„ÙŠØ³ Ù„Ø¯ÙŠÙƒ Ù…Ø¹Ø±Ù Ø³ÙŠØ§Ø¯ÙŠ Ø¨Ø¹Ø¯ØŸ ' : 'Do not have a Sovereign ID yet? '}</span>
                        <Link to="/register" className="text-[#00F2FE] font-bold hover:underline">
                            {isRtl ? 'Ø³Ø¬Ù„ Ø§Ù„Ø¢Ù† (+25 GP)' : 'Mint Your GA-ID (+25 GP)'}
                        </Link>
                    </div>

                </div>

            </div>
        </Layout>
    );
}
