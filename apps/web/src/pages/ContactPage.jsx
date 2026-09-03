/**
 * src/pages/ContactPage.jsx
 * GemIInI Sovereign Coordination Desks & Direct Academic Inquiries
 * 2027 Apple / VisionOS Spatial Aesthetics
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Mail, MapPin, Phone, MessageSquare, CheckCircle2, ArrowRight, Zap, Building2, Globe2 } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { useLang } from '@/i18n/LanguageContext';
import { submitRegistration } from '@/lib/geneApi';

const inputClass = 'h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition-all placeholder:text-white/40 focus:border-[#00F2FE]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#00F2FE]/20';

export default function ContactPage() {
    const { lang, isRtl } = useLang();
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;

        setStatus('loading');

        try {
            await submitRegistration({
                fullName: form.name,
                email: form.email || `${form.phone.replace(/[^0-9]/g, '')}@geneacademy.temp`,
                phone: form.phone,
                subject: form.subject,
                interest: form.message,
                role: 'Institutional Contact'
            });
        } catch (err) {
            console.log('Background sync logging:', err);
        }

        setStatus('done');
    };

    const getDirectWhatsAppUrl = () => {
        const text = encodeURIComponent(
            `Hello GemIInI Coordination Desk! ðŸ‘‹\n\nâ€¢ Name: ${form.name || 'Doctor/Colleague'}\nâ€¢ Subject: ${form.subject}\nâ€¢ Message: ${form.message || 'I would like to inquire about courses and simulation wet-labs.'}`
        );
        return `https://wa.me/2+20 101 592 2628?text=${text}`;
    };

    const hubs = [
        {
            flag: 'ðŸ‡ªðŸ‡¬',
            city: { en: 'Cairo Dokki Hub', ar: 'ÙØ±Ø¹ Ø§Ù„Ù‚Ø§Ù‡Ø±Ø© (Ø§Ù„Ø¯Ù‚ÙŠ)' },
            address: { en: 'Dokki Hands-On Simulation Center, Giza, Egypt', ar: 'Ù…Ø±ÙƒØ² Ø§Ù„Ø¯Ù‚ÙŠ Ù„Ù„Ù…Ø­Ø§ÙƒØ§Ø© Ø§Ù„Ø¬Ø±Ø§Ø­ÙŠØ© ÙˆØ§Ù„Ø³Ø±ÙŠØ±ÙŠØ©ØŒ Ø§Ù„Ø¬ÙŠØ²Ø©ØŒ Ù…ØµØ±' },
            phone: '+20 101 592 2628',
            role: { en: 'Hands-On Wet Labs & Resuscitation Center', ar: 'Ù…Ø¹Ø§Ù…Ù„ Ø§Ù„Ù…Ø­Ø§ÙƒØ§Ø© ÙˆØ§Ù„Ù…Ù‡Ø§Ø±Ø§Øª Ø§Ù„Ø¬Ø±Ø§Ø­ÙŠØ© ÙˆØ§Ù„Ø¥Ù†Ø¹Ø§Ø´' }
        },
        {
            flag: 'ðŸ‡¸ðŸ‡¦',
            city: { en: 'Riyadh Strategic Desk', ar: 'Ù…ÙƒØªØ¨ Ø§Ù„Ø±ÙŠØ§Ø¶ Ø§Ù„Ø§Ø³ØªØ±Ø§ØªÙŠØ¬ÙŠ' },
            address: { en: 'Clinical Placement & Fellowship Desk, KSA', ar: 'Ù…ÙƒØªØ¨ Ø§Ù„ØªÙ†Ø³ÙŠÙ‚ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ ÙˆØ§Ù„Ø²Ù…Ø§Ù„Ø§Øª ÙˆØ§Ù„ØªÙˆØ¸ÙŠÙØŒ Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ©' },
            phone: '+966 55 047 6176',
            role: { en: 'Fellowship & Gulf Career Placement', ar: 'Ø§Ù„Ø²Ù…Ø§Ù„Ø§Øª Ø§Ù„Ù…Ù„ÙƒÙŠØ© ÙˆØ§Ù„ØªÙˆØ¸ÙŠÙ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ Ø¨Ø§Ù„Ø®Ù„ÙŠØ¬' }
        },
        {
            flag: 'ðŸ‡¸ðŸ‡©',
            city: { en: 'Sudan National Hub', ar: 'Ø§Ù„Ù…Ù‚Ø± Ø§Ù„ÙˆØ·Ù†ÙŠ Ø¨Ø§Ù„Ø³ÙˆØ¯Ø§Ù†' },
            address: { en: 'Faculty of Medicine Consortium, Port Sudan & Wad Medani', ar: 'ØªØ­Ø§Ù„Ù ÙƒÙ„ÙŠØ§Øª Ø§Ù„Ø·Ø¨ ÙˆØ§Ù„Ù…Ù‡Ø§Ø±Ø§Øª Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ©ØŒ Ø¨ÙˆØ±ØªØ³ÙˆØ¯Ø§Ù† ÙˆÙˆØ¯ Ù…Ø¯Ù†ÙŠ' },
            phone: 'direct@geneacademy.net',
            role: { en: 'Undergraduate & Licensure Vanguard', ar: 'Ø§Ù„Ø§Ù…ØªØ­Ø§Ù†Ø§Øª Ø§Ù„ÙˆØ·Ù†ÙŠØ© ÙˆØ§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ' }
        }
    ];

    return (
        <Layout>
            <Helmet>
                <title>{isRtl ? 'ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§ | Ù…ÙƒØ§ØªØ¨ Ø§Ù„ØªÙ†Ø³ÙŠÙ‚ Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠ ÙˆØ§Ù„Ø³Ø±ÙŠØ±ÙŠ | Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© Ø¬ÙŠÙ…ÙŠÙ†ÙŠ' : 'Contact Us | Sovereign Academic & Clinical Coordination Desks'}</title>
            </Helmet>

            <div className="bg-[#04080F] text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
                
                {/* Ambient Glow */}
                <div className="pointer-events-none absolute w-[40rem] h-[40rem] bg-gradient-to-tr from-[#00F2FE]/10 via-teal-500/5 to-purple-500/10 rounded-full blur-[140px] top-10 left-1/2 -translate-x-1/2" />

                <div className="max-w-6xl mx-auto relative z-10">
                    
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-4 text-xs font-mono font-bold text-[#00F2FE] uppercase tracking-widest">
                            <Globe2 className="w-4 h-4 text-[#00F2FE]" />
                            <span>{isRtl ? 'Ø§Ù„Ù…ÙƒØ§ØªØ¨ ÙˆØ§Ù„Ù…Ø±Ø§ÙƒØ² Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø©' : 'Regional Coordination Desks'}</span>
                        </div>
                        <h1 className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
                            {isRtl ? 'Ù…ÙƒØ§ØªØ¨ Ø§Ù„ØªÙ†Ø³ÙŠÙ‚ ÙˆØ§Ù„ØªÙˆØ§ØµÙ„ Ø§Ù„Ù…Ø¨Ø§Ø´Ø±' : 'Direct Academic & Clinical Desks'}
                        </h1>
                        <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-light">
                            {isRtl
                                ? 'ØªÙˆØ§ØµÙ„ Ù…Ø¨Ø§Ø´Ø±Ø© Ù…Ø¹ Ù…Ù†Ø³Ù‚ÙŠ Ø§Ù„Ù…Ø¹Ø§Ù…Ù„ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© Ø¨Ø§Ù„Ù‚Ø§Ù‡Ø±Ø©ØŒ Ù…ÙƒØªØ¨ Ø§Ù„ØªÙˆØ¸ÙŠÙ Ø¨Ø§Ù„Ø±ÙŠØ§Ø¶ØŒ Ø£Ùˆ Ø§Ù„Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© Ø¨Ø§Ù„Ø³ÙˆØ¯Ø§Ù†.'
                                : 'Connect with our simulation coordinators in Cairo, fellowship desk in Riyadh, or academic administration in Sudan.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* 1. Hubs Cards (5 Cols) */}
                        <div className="lg:col-span-5 space-y-4">
                            {hubs.map((h, i) => (
                                <div key={i} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl shadow-xl text-start hover:border-[#00F2FE]/30 transition-all">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-2xl">{h.flag}</span>
                                            <h3 className="font-display font-bold text-white text-base">
                                                {isRtl ? h.city.ar : h.city.en}
                                            </h3>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                                        {isRtl ? h.address.ar : h.address.en}
                                    </p>
                                    <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-mono text-[#00F2FE]">
                                        <span>{isRtl ? h.role.ar : h.role.en}</span>
                                        <span className="font-bold">{h.phone}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 2. Instant Dispatch Form (7 Cols) */}
                        <div className="lg:col-span-7 rounded-[2.5rem] border border-white/15 bg-white/5 backdrop-blur-3xl p-8 sm:p-10 shadow-2xl">
                            
                            {status === 'done' ? (
                                <div className="text-center py-10 space-y-6 animate-in fade-in zoom-in-95">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mx-auto border border-emerald-500/30">
                                        <CheckCircle2 className="h-8 w-8" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-display text-2xl font-bold text-white">
                                            {isRtl ? 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø±Ø³Ø§Ù„ØªÙƒ Ø¨Ù†Ø¬Ø§Ø­' : 'Message Received Successfully!'}
                                        </h3>
                                        <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                                            {isRtl
                                                ? 'ØªÙ… ØªØ³Ø¬ÙŠÙ„ Ø·Ù„Ø¨Ùƒ Ù„Ø¯Ù‰ Ù…ÙƒØªØ¨ Ø§Ù„ØªÙ†Ø³ÙŠÙ‚ Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠ. Ù„Ù„ØªÙˆØ§ØµÙ„ Ø§Ù„ÙÙˆØ±ÙŠ ÙˆØ§Ù„Ù…Ø¨Ø§Ø´Ø±ØŒ ÙŠÙ…ÙƒÙ†Ùƒ ÙØªØ­ Ø§Ù„Ù…Ø­Ø§Ø¯Ø«Ø© Ø¹Ø¨Ø± Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨:'
                                                : 'Your inquiry has been logged with our coordination team. For immediate live response, you can open WhatsApp directly:'}
                                        </p>
                                    </div>

                                    <div className="pt-2 max-w-sm mx-auto">
                                        <a
                                            href={getDirectWhatsAppUrl()}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl transition-all"
                                        >
                                            <Phone className="w-4 h-4" />
                                            <span>{isRtl ? 'Ø§Ù„Ù…Ø­Ø§Ø¯Ø«Ø© Ø§Ù„ÙÙˆØ±ÙŠØ© Ø¹Ø¨Ø± Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨' : 'Open WhatsApp Chat Now'}</span>
                                        </a>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="button"
                                            onClick={() => { setStatus('idle'); setForm({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' }); }}
                                            className="text-xs text-slate-400 hover:text-white underline font-mono"
                                        >
                                            {isRtl ? 'Ø¥Ø±Ø³Ø§Ù„ Ø§Ø³ØªÙØ³Ø§Ø± Ø¢Ø®Ø±' : 'Send another inquiry'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4 text-start">
                                    <h3 className="font-display text-xl font-bold text-white mb-2">
                                        {isRtl ? 'Ù†Ù…ÙˆØ°Ø¬ Ø§Ù„ØªÙˆØ§ØµÙ„ Ø§Ù„Ø³Ø±ÙŠØ¹ ÙˆØ§Ù„ØªÙ†Ø³ÙŠÙ‚ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ' : 'Quick Inquiry & Clinical Coordination'}
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                                {isRtl ? 'Ø§Ù„Ø§Ø³Ù… Ø§Ù„ÙƒØ§Ù…Ù„ *' : 'Full Name *'}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                placeholder={isRtl ? 'Ø¯. Ø£Ø­Ù…Ø¯ Ù…Ø­Ù…Ø¯' : 'Dr. Ahmed Mohamed'}
                                                className={inputClass}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                                {isRtl ? 'Ø±Ù‚Ù… Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨ Ø£Ùˆ Ø§Ù„Ù‡Ø§ØªÙ *' : 'WhatsApp / Phone *'}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={form.phone}
                                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                placeholder="+20 / +249 / +966"
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                                {isRtl ? 'Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ' : 'Email Address'}
                                            </label>
                                            <input
                                                type="email"
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                placeholder="doctor@example.com"
                                                className={inputClass}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                                {isRtl ? 'Ù…ÙˆØ¶ÙˆØ¹ Ø§Ù„Ø§Ø³ØªÙØ³Ø§Ø±' : 'Subject'}
                                            </label>
                                            <select
                                                value={form.subject}
                                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                                className={`${inputClass} appearance-none cursor-pointer`}
                                            >
                                                <option value="Cairo BLS Workshop">{isRtl ? 'Ø§Ù„Ø¨Ø±Ù†Ø§Ù…Ø¬ Ø§Ù„ØªØ¯Ø±ÙŠØ¨ÙŠ Ø§Ù„Ù…ØªÙ‚Ø¯Ù… Ù„Ù„Ø¥Ù†Ø¹Ø§Ø´ Ø§Ù„Ù‚Ù„Ø¨ÙŠ Ø§Ù„Ø±Ø¦ÙˆÙŠ Ø§Ù„Ø£Ø³Ø§Ø³ÙŠ (AHA BLS Provider) Ø¨Ø§Ù„Ù‚Ø§Ù‡Ø±Ø© (BLS)' : 'Cairo BLS Workshop (Aug 28)'}</option>
                                                <option value="Sudan BLS Workshop">{isRtl ? 'ÙˆØ±Ø´Ø© Ø§Ù„Ø¥Ù†Ø¹Ø§Ø´ Ø¨Ø§Ù„Ø³ÙˆØ¯Ø§Ù† (BLS)' : 'Sudan BLS Workshop (Sept 10)'}</option>
                                                <option value="Surgical BSS Training">{isRtl ? 'Ø§Ù„ØªØ¯Ø±ÙŠØ¨ Ø§Ù„Ø¬Ø±Ø§Ø­ÙŠ ÙˆÙ…Ø¹Ø§Ù…Ù„ Ø§Ù„Ù…Ù‡Ø§Ø±Ø§Øª (BSS)' : 'Surgical Skills Wet Labs (BSS)'}</option>
                                                <option value="Fast-Track Concierge Visa">{isRtl ? 'ØªØ£Ø´ÙŠØ±Ø§Øª ÙˆØªØ±ØªÙŠØ¨Ø§Øª Ø§Ù…ØªØ­Ø§Ù†Ø§Øª Ù…ØµØ± Ø§Ù„Ø³Ø±ÙŠØ¹Ø©' : 'Egypt Exam Travel & Fast-Track'}</option>
                                                <option value="Other Inquiries">{isRtl ? 'Ø§Ø³ØªÙØ³Ø§Ø±Ø§Øª Ø¹Ø§Ù…Ø© Ø£Ùˆ Ø´Ø±Ø§ÙƒØ§Øª' : 'General & Institutional Inquiries'}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                            {isRtl ? 'Ø§Ù„Ø±Ø³Ø§Ù„Ø© Ø£Ùˆ Ø§Ù„ØªÙØ§ØµÙŠÙ„' : 'Message Details'}
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            placeholder={isRtl ? 'Ø§ÙƒØªØ¨ Ø§Ø³ØªÙØ³Ø§Ø±Ùƒ Ù‡Ù†Ø§...' : 'How can our academic coordination team assist you?'}
                                            className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white outline-none transition-all placeholder:text-white/40 focus:border-[#00F2FE]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#00F2FE]/20"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#00F2FE] to-[#38BDF8] hover:brightness-110 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#00F2FE]/20 transition-all active:scale-95 disabled:opacity-70 mt-2"
                                    >
                                        {status === 'loading' ? (
                                            <Zap className="h-5 w-5 animate-pulse" />
                                        ) : (
                                            <>
                                                <span>{isRtl ? 'Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø§Ø³ØªÙØ³Ø§Ø±' : 'Send Message'}</span>
                                                {isRtl ? <ArrowRight className="h-4 w-4 rotate-180" /> : <ArrowRight className="h-4 w-4" />}
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}

                        </div>

                    </div>

                </div>
            </div>
        </Layout>
    );
}
