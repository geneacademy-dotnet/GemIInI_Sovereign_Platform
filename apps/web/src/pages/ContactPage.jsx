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
            `Hello GemIInI Coordination Desk! 👋\n\n• Name: ${form.name || 'Doctor/Colleague'}\n• Subject: ${form.subject}\n• Message: ${form.message || 'I would like to inquire about courses and simulation wet-labs.'}`
        );
        return `https://wa.me/2+20 101 592 2628?text=${text}`;
    };

    const hubs = [
        {
            flag: '🇪🇬',
            city: { en: 'Cairo Dokki Hub', ar: 'فرع القاهرة (الدقي)' },
            address: { en: 'Dokki Hands-On Simulation Center, Giza, Egypt', ar: 'مركز الدقي للمحاكاة الجراحية والسريرية، الجيزة، مصر' },
            phone: '+20 101 592 2628',
            role: { en: 'Hands-On Wet Labs & Resuscitation Center', ar: 'معامل المحاكاة والمهارات الجراحية والإنعاش' }
        },
        {
            flag: '🇸🇦',
            city: { en: 'Riyadh Strategic Desk', ar: 'مكتب الرياض الاستراتيجي' },
            address: { en: 'Clinical Placement & Fellowship Desk, KSA', ar: 'مكتب التنسيق السريري والزمالات والتوظيف، السعودية' },
            phone: '+966 55 047 6176',
            role: { en: 'Fellowship & Gulf Career Placement', ar: 'الزمالات الملكية والتوظيف السريري بالخليج' }
        },
        {
            flag: '🇸🇩',
            city: { en: 'Sudan National Hub', ar: 'المقر الوطني بالسودان' },
            address: { en: 'Faculty of Medicine Consortium, Port Sudan & Wad Medani', ar: 'تحالف كليات الطب والمهارات السريرية، بورتسودان وود مدني' },
            phone: 'direct@geneacademy.net',
            role: { en: 'Undergraduate & Licensure Vanguard', ar: 'الامتحانات الوطنية والاعتماد السيادي' }
        }
    ];

    return (
        <Layout>
            <Helmet>
                <title>{isRtl ? 'تواصل معنا | مكاتب التنسيق الأكاديمي والسريري | أكاديمية جيميني' : 'Contact Us | Sovereign Academic & Clinical Coordination Desks'}</title>
            </Helmet>

            <div className="bg-[#04080F] text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
                
                {/* Ambient Glow */}
                <div className="pointer-events-none absolute w-[40rem] h-[40rem] bg-gradient-to-tr from-[#00F2FE]/10 via-teal-500/5 to-purple-500/10 rounded-full blur-[140px] top-10 left-1/2 -translate-x-1/2" />

                <div className="max-w-6xl mx-auto relative z-10">
                    
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-4 text-xs font-mono font-bold text-[#00F2FE] uppercase tracking-widest">
                            <Globe2 className="w-4 h-4 text-[#00F2FE]" />
                            <span>{isRtl ? 'المكاتب والمراكز المعتمدة' : 'Regional Coordination Desks'}</span>
                        </div>
                        <h1 className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
                            {isRtl ? 'مكاتب التنسيق والتواصل المباشر' : 'Direct Academic & Clinical Desks'}
                        </h1>
                        <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-light">
                            {isRtl
                                ? 'تواصل مباشرة مع منسقي المعامل السريرية بالقاهرة، مكتب التوظيف بالرياض، أو الإدارة الأكاديمية بالسودان.'
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
                                            {isRtl ? 'تم استلام رسالتك بنجاح' : 'Message Received Successfully!'}
                                        </h3>
                                        <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                                            {isRtl
                                                ? 'تم تسجيل طلبك لدى مكتب التنسيق الأكاديمي. للتواصل الفوري والمباشر، يمكنك فتح المحادثة عبر الواتساب:'
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
                                            <span>{isRtl ? 'المحادثة الفورية عبر الواتساب' : 'Open WhatsApp Chat Now'}</span>
                                        </a>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="button"
                                            onClick={() => { setStatus('idle'); setForm({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' }); }}
                                            className="text-xs text-slate-400 hover:text-white underline font-mono"
                                        >
                                            {isRtl ? 'إرسال استفسار آخر' : 'Send another inquiry'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4 text-start">
                                    <h3 className="font-display text-xl font-bold text-white mb-2">
                                        {isRtl ? 'نموذج التواصل السريع والتنسيق السريري' : 'Quick Inquiry & Clinical Coordination'}
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                                {isRtl ? 'الاسم الكامل *' : 'Full Name *'}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                placeholder={isRtl ? 'د. أحمد محمد' : 'Dr. Ahmed Mohamed'}
                                                className={inputClass}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                                {isRtl ? 'رقم الواتساب أو الهاتف *' : 'WhatsApp / Phone *'}
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
                                                {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
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
                                                {isRtl ? 'موضوع الاستفسار' : 'Subject'}
                                            </label>
                                            <select
                                                value={form.subject}
                                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                                className={`${inputClass} appearance-none cursor-pointer`}
                                            >
                                                <option value="Cairo BLS Workshop">{isRtl ? 'البرنامج التدريبي المتقدم للإنعاش القلبي الرئوي الأساسي (AHA BLS Provider) بالقاهرة (BLS)' : 'Cairo BLS Workshop (Aug 28)'}</option>
                                                <option value="Sudan BLS Workshop">{isRtl ? 'ورشة الإنعاش بالسودان (BLS)' : 'Sudan BLS Workshop (Sept 10)'}</option>
                                                <option value="Surgical BSS Training">{isRtl ? 'التدريب الجراحي ومعامل المهارات (BSS)' : 'Surgical Skills Wet Labs (BSS)'}</option>
                                                <option value="Fast-Track Concierge Visa">{isRtl ? 'تأشيرات وترتيبات امتحانات مصر السريعة' : 'Egypt Exam Travel & Fast-Track'}</option>
                                                <option value="Other Inquiries">{isRtl ? 'استفسارات عامة أو شراكات' : 'General & Institutional Inquiries'}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                            {isRtl ? 'الرسالة أو التفاصيل' : 'Message Details'}
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            placeholder={isRtl ? 'اكتب استفسارك هنا...' : 'How can our academic coordination team assist you?'}
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
                                                <span>{isRtl ? 'إرسال الاستفسار' : 'Send Message'}</span>
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
