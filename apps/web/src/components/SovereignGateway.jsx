import React, { useState } from 'react';
import {
    HeartPulse,
    ShieldCheck,
    Award,
    Calendar,
    MapPin,
    Smartphone,
    CheckCircle2,
    Sparkles,
    Copy,
    Check,
    Gift,
    FileText,
    ArrowRight,
    Users,
    Stethoscope,
    AlertCircle,
    Coins,
    GraduationCap,
    Clock,
    Flame,
    Lock,
    ExternalLink,
    Zap,
    MessageSquare,
    Globe,
    Send
} from 'lucide-react';
import SovereignClient, { generateIdempotencyKey, normalizeGaId } from '@/services/sovereignService';

const UNIVERSITIES_WITH_COHORTS = [
    { name: 'Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ø®Ø±Ø·ÙˆÙ… | University of Khartoum', peers: '342+ Ø·Ø¨ÙŠØ¨ Ù…Ø³Ø¬Ù„' },
    { name: 'Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ø¬Ø²ÙŠØ±Ø© | University of Gezira', peers: '289+ Ø·Ø¨ÙŠØ¨ Ù…Ø³Ø¬Ù„' },
    { name: 'Ø¬Ø§Ù…Ø¹Ø© Ø£Ù… Ø¯Ø±Ù…Ø§Ù† Ø§Ù„Ø¥Ø³Ù„Ø§Ù…ÙŠØ© | Omdurman Islamic University', peers: '215+ Ø·Ø¨ÙŠØ¨ Ù…Ø³Ø¬Ù„' },
    { name: 'Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ø£Ø­ÙØ§Ø¯ Ù„Ù„Ø¨Ù†Ø§Øª | Ahfad University for Women', peers: '178+ Ø·Ø¨ÙŠØ¨Ø© Ù…Ø³Ø¬Ù„Ø©' },
    { name: 'Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ø²Ø¹ÙŠÙ… Ø§Ù„Ø£Ø²Ù‡Ø±ÙŠ | Alzaiem Alazhari University', peers: '164+ Ø·Ø¨ÙŠØ¨ Ù…Ø³Ø¬Ù„' },
    { name: 'Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ù†ÙŠÙ„ÙŠÙ† | Al-Neelain University', peers: '198+ Ø·Ø¨ÙŠØ¨ Ù…Ø³Ø¬Ù„' },
    { name: 'Ø¬Ø§Ù…Ø¹Ø© ÙƒØ±Ø±ÙŠ | Karary University', peers: '145+ Ø·Ø¨ÙŠØ¨ Ù…Ø³Ø¬Ù„' },
    { name: 'Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ø¹Ù„ÙˆÙ… Ø§Ù„Ø·Ø¨ÙŠØ© ÙˆØ§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ§ | UMST', peers: '182+ Ø·Ø¨ÙŠØ¨ Ù…Ø³Ø¬Ù„' },
    { name: 'Ø¬Ø§Ù…Ø¹Ø© Ø´Ù†Ø¯ÙŠ | University of Shendi', peers: '112+ Ø·Ø¨ÙŠØ¨ Ù…Ø³Ø¬Ù„' },
    { name: 'ÙƒÙ„ÙŠØ§Øª Ø§Ù„Ø·Ø¨ Ø§Ù„Ù…ØµØ±ÙŠØ© ÙˆØ§Ù„Ø¬Ø§Ù…Ø¹Ø§Øª Ø§Ù„Ø£Ø®Ø±Ù‰ (Egypt & Regional)', peers: '420+ Ø·Ø¨ÙŠØ¨ Ù…Ø³Ø¬Ù„' }
];

export const SovereignGateway = ({ onRegistered }) => {
    const [gradYear, setGradYear] = useState('2024');
    const [location, setLocation] = useState('Egypt');
    const [track, setTrack] = useState('SMC');
    const [selectedUni, setSelectedUni] = useState(UNIVERSITIES_WITH_COHORTS[0].name);
    
    const [paymentMethod, setPaymentMethod] = useState('VODAFONE');

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        providerRef: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [minted, setMinted] = useState(null);

    // KSA Post-Submission Intercept Modal State
    const [showKsaModal, setShowKsaModal] = useState(false);
    const [ksaQuestion, setKsaQuestion] = useState('');

    const isDisruptedCohort = parseInt(gradYear) >= 2022 && parseInt(gradYear) <= 2026 && location === 'Egypt';
    const isSmcUrgent = track === 'SMC';
    const matchedUni = UNIVERSITIES_WITH_COHORTS.find(u => u.name === selectedUni);

    const feeAmount = 3000;
    const calculatedGp = 200;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim() || !form.providerRef.trim()) {
            setError('ÙŠØ±Ø¬Ù‰ Ø¥ÙƒÙ…Ø§Ù„ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø­Ù‚ÙˆÙ„ Ø§Ù„Ø¥Ù„Ø²Ø§Ù…ÙŠØ© ÙˆØ±Ù‚Ù… Ø§Ù„Ø¥Ø´Ø¹Ø§Ø± Ø§Ù„Ù…Ø§Ù„ÙŠ.');
            return;
        }

        setLoading(true);

        try {
            const idempotencyKey = generateIdempotencyKey({
                email: form.email,
                phone: form.phone,
                ref: form.providerRef
            });

            const payload = {
                action: 'bls_register',
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                university: selectedUni,
                gradYear: gradYear,
                location: location,
                track: track,
                paymentMethod: paymentMethod,
                feeAmount: feeAmount,
                providerRef: form.providerRef.trim(),
                referralId: localStorage.getItem('gemiini_affiliate_ref') || 'GA-000',
                gpAwarded: calculatedGp,
                idempotencyKey
            };

            const res = await SovereignClient.register(payload);

            if (res && (res.status === 'success' || res.gaId)) {
                const gaId = normalizeGaId(res.gaId || 'GA-1001');
                const finalData = {
                    gaId,
                    name: form.fullName,
                    gpBalance: res.gpBalance || calculatedGp,
                    digitalBonusUnlocked: true,
                    track: track
                };

                localStorage.setItem('gemiini_presence_id', gaId);
                localStorage.setItem('gemiini_member_profile', JSON.stringify(finalData));

                setMinted(finalData);
                setShowKsaModal(true); // TRIGGER POST-SUBMISSION INTERCEPT MODAL
                if (onRegistered) onRegistered(finalData);
            } else {
                setError(res.message || 'ØªØ¹Ø°Ø± ØªØ£ÙƒÙŠØ¯ Ø§Ù„ØªØ³Ø¬ÙŠÙ„ ÙÙŠ Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ.');
            }
        } catch (err) {
            setError(err.message || 'Ø®Ø·Ø£ ÙÙŠ Ø§Ù„Ø§ØªØµØ§Ù„ Ø¨Ø§Ù„Ø®Ø§Ø¯Ù… Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ.');
        } finally {
            setLoading(false);
        }
    };

    const handleKsaSubmit = (e) => {
        e.preventDefault();
        const baseMsg = `Ù…Ø±Ø­Ø¨Ø§Ù‹ Ù…ÙƒØªØ¨ Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø¨Ø§Ù„Ù…Ù…Ù„ÙƒØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ© (KSA Node):\n\nØ£Ù†Ø§ Ø§Ù„Ø·Ø¨ÙŠØ¨: ${minted?.name || form.fullName}\nØ§Ù„Ù…Ø¹Ø±Ù Ø§Ù„Ø±Ù‚Ù…ÙŠ: ${minted?.gaId || 'GA-PENDING'}\nØ§Ù„Ù…Ø³Ø§Ø± Ø§Ù„Ù…Ø³ØªÙ‡Ø¯Ù: ${track}\n\nØ§Ø³ØªÙØ³Ø§Ø±ÙŠ Ø¨Ø®ØµÙˆØµ Ø§Ù„ØªØµÙ†ÙŠÙ / Ø§Ù„ØªÙˆØ¸ÙŠÙ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ:\n${ksaQuestion || 'Ø£Ø±ØºØ¨ ÙÙŠ Ø§Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ Ø§Ø³ØªØ´Ø§Ø±Ø© ÙÙˆØ±ÙŠØ© Ù„ØªØ±Ø®ÙŠØµ Ø§Ù„Ù‡ÙŠØ¦Ø© Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ© ÙˆØ§Ù„ØªÙ†Ø³ÙŠÙ‚ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ.'}`;
        const url = `https://wa.me/966550476176?text=${encodeURIComponent(baseMsg)}`;
        window.open(url, '_blank');
        setShowKsaModal(false);
    };

    return (
        <div id="sovereign-intake" className="p-6 sm:p-10 rounded-3xl bg-[#080C14] border border-cyan-500/20 shadow-2xl space-y-8 max-w-3xl mx-auto relative">
            
            {/* KSA OPERATIONS DESK FLOATING BADGE */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 text-xs">
                <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <div>
                        <strong className="text-white block font-mono text-[11px]">KSA OPERATIONS DESK / Ù…ÙƒØªØ¨ Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø¨Ø§Ù„Ù…Ù…Ù„ÙƒØ©</strong>
                        <span className="text-[10px] text-gray-400">ØªÙ†Ø³ÙŠÙ‚ Ø§Ù„ØªØ±Ø§Ø®ÙŠØµ (SCFHS) ÙˆØ§Ù„ØªÙˆØ²ÙŠØ¹ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ ÙÙŠ Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ©</span>
                    </div>
                </div>
                <a
                    href="https://wa.me/966550476176?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%85%D9%83%D8%AA%D8%A8%20%D8%B9%D9%85%D9%84%D9%8A%D8%A7%D8%AA%20%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9%20(KSA%20Node)%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D8%AA%D8%B1%D8%A7%D8%AE%D9%8A%D8%B5%20%D8%A7%D9%84%D9%85%D9%87%D9%86%D9%8A%D8%A9."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>+966 55 047 6176 âž”</span>
                </a>
            </div>

            {/* 1. HEADER */}
            <div className="text-center space-y-2">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
                    ADAPTIVE CLINICAL INTAKE & SETTLEMENT
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Ø§Ø³ØªÙ…Ø§Ø±Ø© Ø§Ù„Ø­Ø¬Ø² ÙˆØ§Ù„ØªÙˆØ«ÙŠÙ‚ Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯
                </h3>
                <p className="text-xs text-gray-400">
                    Ø§Ù„Ù†Ø¸Ø§Ù… ÙŠØªÙƒÙŠÙ ØªÙ„Ù‚Ø§Ø¦ÙŠØ§Ù‹ Ù…Ø¹ Ø¯ÙØ¹ØªÙƒ ÙˆØ¬Ø§Ù…Ø¹ØªÙƒ Ù„Ø±Ø¨Ø·Ùƒ Ø¨Ù…Ø³Ø§Ø± Ø§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ø¯ÙˆÙ„ÙŠ.
                </p>
            </div>

            {/* 2. ADAPTIVE CONVERSATIONAL BANNERS */}
            <div className="space-y-3">
                {isDisruptedCohort && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3 animate-fadeIn">
                        <GraduationCap className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <strong className="block text-amber-300 font-bold mb-0.5">Ù…Ø³Ø§Ø± Ø§Ù„Ø¯ÙØ¹Ø§Øª Ø§Ù„Ø§Ø³ØªØ«Ù†Ø§Ø¦ÙŠØ© (2022â€“2026 â€” Ø§Ù„Ø¥Ù‚Ù„ÙŠÙ… Ø§Ù„Ù…ØµØ±ÙŠ):</strong>
                            <span>Ù†Ø­Ù† Ù†Ø¯Ø±Ùƒ Ø­Ø¬Ù… Ø§Ù„ØªØ­Ø¯ÙŠØ§Øª ÙˆØ§Ù„Ø§Ù†Ù‚Ø·Ø§Ø¹ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ Ø§Ù„Ø°ÙŠ ÙˆØ§Ø¬Ù‡ØªÙ‡ Ø¯ÙØ¹ØªÙƒ. Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© Ø¬ÙŠÙ…ÙŠÙ†ÙŠ Ù‡ÙŠ Ø¬Ø³Ø±Ùƒ Ø§Ù„Ù…Ø¨Ø§Ø´Ø± Ù„Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ ÙˆØ§Ù„ØªÙˆØ¸ÙŠÙ Ø§Ù„Ø¯ÙˆÙ„ÙŠ.</span>
                        </div>
                    </div>
                )}

                {isSmcUrgent && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-start gap-3 animate-fadeIn">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <strong className="block text-red-300 font-bold mb-0.5">ðŸš¨ Ù…Ø³Ø§Ø± Ø§Ù…ØªØ­Ø§Ù† Ø§Ù„ÙƒÙØ§Ø¡Ø© Ø§Ù„Ø¯Ø§Ø¦Ù…Ø© Ù„Ù„Ù…Ø¬Ù„Ø³ Ø§Ù„Ø·Ø¨ÙŠ (SMC):</strong>
                            <span>Ù…ÙˆØ¹Ø¯ Ø§Ù„Ø§Ù…ØªØ­Ø§Ù† ÙŠÙ‚ØªØ±Ø¨. ÙŠØ¶Ù…Ù† Ù„Ùƒ Ù‡Ø°Ø§ Ø§Ù„ØªØ¯Ø±ÙŠØ¨ Ø§Ù„Ø¹Ù…Ù„ÙŠ Ø§Ø³ØªÙŠÙØ§Ø¡ Ø§Ù„Ø³Ø§Ø¹Ø§Øª Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© ÙˆÙ…Ù†Ù‡Ø§Ø¬ MTCâ„¢ Ø§Ù„Ø¯ÙˆÙ„ÙŠ.</span>
                        </div>
                    </div>
                )}

                {matchedUni && (
                    <div className="p-3.5 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-cyan-200 text-xs flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-cyan-400" />
                            <span>Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ùƒ! Ø§Ù†Ø¶Ù… Ø¥Ù„Ù‰ Ø²Ù…Ù„Ø§Ø¦Ùƒ Ø§Ù„Ù…ÙˆØ«Ù‚ÙŠÙ† ÙÙŠ Ø§Ù„Ø³Ø¬Ù„ Ù…Ù† <strong>{matchedUni.name.split('|')[0]}</strong></span>
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                            {matchedUni.peers}
                        </span>
                    </div>
                )}
            </div>

            {/* 3. CONFIRMED MINTED STATE */}
            {minted ? (
                <div className="p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 text-center space-y-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                        âœ“ ØªÙ… ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø­Ø¬Ø² ÙˆØ¥ØµØ¯Ø§Ø± Ø§Ù„Ù…Ø¹Ø±Ù Ø¨Ù†Ø¬Ø§Ø­
                    </span>
                    <h3 className="text-4xl font-mono font-black text-cyan-400">{minted.gaId}</h3>
                    <p className="text-sm text-gray-300">{minted.name}</p>
                    <div className="p-3 rounded-xl bg-black/40 text-amber-300 font-mono text-xs">
                        Ø§Ù„Ø±ØµÙŠØ¯ Ø§Ù„Ù…ÙˆØ¯Ø¹: +{minted.gpBalance} GP Â· Ø­Ù‚ÙŠØ¨Ø© Ø§Ù„ØªØ­ÙˆÙ„ Ø§Ù„Ø±Ù‚Ù…ÙŠ ÙˆØ§Ù„Ø³ÙŠØ±Ø© Ø§Ù„Ø°Ø§ØªÙŠØ© Ù…ÙØ¹Ù„Ø©
                    </div>
                    
                    <button
                        type="button"
                        onClick={() => setShowKsaModal(true)}
                        className="px-5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 text-xs font-bold transition-all inline-flex items-center gap-2"
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span>Ø·Ù„Ø¨ Ø§Ø³ØªØ´Ø§Ø±Ø© Ø§Ù„ØªØ±Ø®ÙŠØµ ÙˆØ§Ù„ØªØ³ÙƒÙŠÙ† ÙÙŠ Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ© (KSA Node) âž”</span>
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* ADAPTIVE SELECTORS */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                            <label className="block text-gray-300 mb-1">Ø³Ù†Ø© Ø§Ù„ØªØ®Ø±Ø¬ / Ø§Ù„Ø¯ÙØ¹Ø©</label>
                            <select value={gradYear} onChange={(e) => setGradYear(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white focus:border-cyan-400 focus:outline-none">
                                <option value="2026">2026 (Ø¯ÙØ¹Ø© Ø§Ù„Ø§Ù…ØªÙŠØ§Ø² Ø§Ù„Ø­Ø§Ù„ÙŠØ©)</option>
                                <option value="2025">2025 (Ø¯ÙØ¹Ø© Ø§Ù„Ø§Ù…ØªÙŠØ§Ø²)</option>
                                <option value="2024">2024 (Ø·Ø¨ÙŠØ¨ Ù…Ù‚ÙŠÙ… / Ø§Ù…ØªÙŠØ§Ø²)</option>
                                <option value="2023">2023 (Ø¯ÙØ¹Ø© Ø§Ù„Ø£Ø²Ù…Ø©)</option>
                                <option value="2022">2022 (Ø·Ø¨ÙŠØ¨ Ø¹Ø§Ù… / Ù†Ø§Ø¦Ø¨)</option>
                                <option value="2020">2021 ÙˆÙ…Ø§ Ù‚Ø¨Ù„Ù‡Ø§ (Ø£Ø®ØµØ§Ø¦ÙŠ / Ø§Ø³ØªØ´Ø§Ø±ÙŠ)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">Ø§Ù„Ù…ÙˆÙ‚Ø¹ Ø§Ù„Ø¬ØºØ±Ø§ÙÙŠ Ø§Ù„Ø­Ø§Ù„ÙŠ</label>
                            <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white focus:border-cyan-400 focus:outline-none">
                                <option value="Egypt">Ù…ØµØ± (Ø§Ù„Ù‚Ø§Ù‡Ø±Ø© / Ø§Ù„Ù…Ø­Ø§ÙØ¸Ø§Øª)</option>
                                <option value="Sudan">Ø§Ù„Ø³ÙˆØ¯Ø§Ù† (Ø¨ÙˆØ±ØªØ³ÙˆØ¯Ø§Ù† / Ø§Ù„ÙˆÙ„Ø§ÙŠØ§Øª)</option>
                                <option value="Gulf">Ø§Ù„Ø®Ù„ÙŠØ¬ Ø§Ù„Ø¹Ø±Ø¨ÙŠ (Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ© / Ø§Ù„Ø¥Ù…Ø§Ø±Ø§Øª / Ù‚Ø·Ø±)</option>
                                <option value="UK_EU">Ø§Ù„Ù…Ù…Ù„ÙƒØ© Ø§Ù„Ù…ØªØ­Ø¯Ø© / Ø£ÙˆØ±ÙˆØ¨Ø§ / Ø£Ø®Ø±Ù‰</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">Ø§Ù„Ù…Ø³Ø§Ø± Ø§Ù„Ù…Ù‡Ù†ÙŠ Ø§Ù„Ù…Ø³ØªÙ‡Ø¯Ù</label>
                            <select value={track} onChange={(e) => setTrack(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white focus:border-cyan-400 focus:outline-none">
                                <option value="SMC">Ø§Ù„Ù…Ø¬Ù„Ø³ Ø§Ù„Ø·Ø¨ÙŠ Ø§Ù„Ø³ÙˆØ¯Ø§Ù†ÙŠ (SMC)</option>
                                <option value="SCFHS">Ø§Ù„Ø¨ÙˆØ±Ø¯ ÙˆØ§Ù„ØªØ±Ø®ÙŠØµ Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠ (SCFHS / KSA)</option>
                                <option value="PLAB">Ø§Ù„Ø²Ù…Ø§Ù„Ø© Ø§Ù„Ø¨Ø±ÙŠØ·Ø§Ù†ÙŠØ© (PLAB / UK-GMC)</option>
                                <option value="USMLE">Ø§Ù„Ù…Ø¹Ø§Ø¯Ù„Ø© Ø§Ù„Ø£Ù…Ø±ÙŠÙƒÙŠØ© (USMLE)</option>
                            </select>
                        </div>
                    </div>

                    {/* CANDIDATE CONTACT INFO */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-300 mb-1">Ø§Ù„Ø§Ø³Ù… Ø§Ù„Ø±Ø¨Ø§Ø¹ÙŠ Ø§Ù„Ø±Ø³Ù…ÙŠ *</label>
                            <input type="text" required placeholder="Dr. Firstname Lastname" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-300 mb-1">Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ Ø§Ù„Ù…Ù‡Ù†ÙŠ *</label>
                            <input type="email" required placeholder="physician@hospital.edu" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-300 mb-1">Ø±Ù‚Ù… Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨ Ù„Ù„ØªØ£ÙƒÙŠØ¯ Ø§Ù„ÙÙˆØ±ÙŠ *</label>
                            <input type="tel" required placeholder="+20 100 000 0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-300 mb-1">Ø§Ù„Ø¬Ø§Ù…Ø¹Ø© / Ø§Ù„ÙƒÙ„ÙŠØ© Ø§Ù„Ø·Ø¨ÙŠØ© *</label>
                            <select value={selectedUni} onChange={(e) => setSelectedUni(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none">
                                {UNIVERSITIES_WITH_COHORTS.map((u, i) => (
                                    <option key={i} value={u.name}>{u.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 4. PROFESSIONAL ORDER SUMMARY RECEIPT BLOCK */}
                    <div className="p-5 rounded-2xl bg-black/60 border border-white/15 space-y-3">
                        <div className="flex items-center justify-between pb-2.5 border-b border-white/10 text-xs font-mono">
                            <span className="text-gray-400 uppercase tracking-wider">ORDER SUMMARY / Ù…Ù„Ø®Øµ Ø§Ù„Ø­Ø¬Ø²</span>
                            <span className="text-cyan-400 font-bold">COHORT: AUG 28, 2026</span>
                        </div>
                        <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between text-gray-300">
                                <span>1. Ø§Ù„ÙˆØ±Ø´Ø© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© Ù„Ù„Ø¥Ù†Ø¹Ø§Ø´ Ø§Ù„Ù‚Ù„Ø¨ÙŠ (BLS Provider) â€” Ù…Ø±ÙƒØ² Ø¯. ØµØ¨Ø±ÙŠ</span>
                                <span className="font-mono text-white">Ù…Ø´Ù…ÙˆÙ„</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>2. ØªÙˆØ«ÙŠÙ‚ Ø§Ù„Ù…Ø¹Ø±Ù Ø§Ù„Ø±Ù‚Ù…ÙŠ Ø§Ù„Ø¯Ø§Ø¦Ù… (GA-ID) ÙˆÙ…Ù†Ø­Ø© 200 GP â€” Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© Ø¬ÙŠÙ…ÙŠÙ†ÙŠ</span>
                                <span className="font-mono text-emerald-400">Ù…Ø´Ù…ÙˆÙ„ ($150 Ù…Ø¬Ø§Ù†Ø§Ù‹)</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>3. Ø­Ù‚ÙŠØ¨Ø© Ø§Ù„ØªØ­ÙˆÙ„ Ø§Ù„Ø±Ù‚Ù…ÙŠ ÙˆÙ‡Ù†Ø¯Ø³Ø© Ø§Ù„Ø³ÙŠØ±Ø© Ø§Ù„Ø°Ø§ØªÙŠØ© â€” Ø­ØµØ±ÙŠØ§Ù‹ Ù…Ù† Gene Academy</span>
                                <span className="font-mono text-purple-400">Ù…Ø´Ù…ÙˆÙ„ Ù…Ø¬Ø§Ù†Ø§Ù‹</span>
                            </div>
                        </div>
                        <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
                            <span className="text-xs text-gray-300 font-bold">Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø§Ø³ØªØ«Ù…Ø§Ø± Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ:</span>
                            <span className="text-lg font-mono font-black text-amber-400">3,000 EGP</span>
                        </div>
                    </div>

                    {/* 5. PAYMENT METHOD TOGGLE */}
                    <div className="pt-2 space-y-4">
                        <label className="block text-xs text-gray-300 font-bold">Ø§Ø®ØªØ± Ù‚Ù†Ø§Ø© Ø§Ù„Ø³Ø¯Ø§Ø¯ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø©:</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div onClick={() => setPaymentMethod('VODAFONE')} className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${paymentMethod === 'VODAFONE' ? 'border-red-500 bg-red-500/10 text-red-300 font-bold' : 'border-white/10 bg-white/5 text-gray-400'}`}>
                                <span>ÙÙˆØ¯Ø§ÙÙˆÙ† ÙƒØ§Ø´ (Vodafone Cash â€” 3,000 EGP)</span>
                                {paymentMethod === 'VODAFONE' && <span>âœ“</span>}
                            </div>
                            <div onClick={() => setPaymentMethod('BANK')} className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${paymentMethod === 'BANK' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold' : 'border-white/10 bg-white/5 text-gray-400'}`}>
                                <span>ØªØ­ÙˆÙŠÙ„ Ø¨Ù†ÙƒÙŠ / InstaPay / Ø¨Ù†ÙƒÙƒ (WhatsApp Gate)</span>
                                {paymentMethod === 'BANK' && <span>âœ“</span>}
                            </div>
                        </div>

                        {paymentMethod === 'VODAFONE' ? (
                            <div className="p-3.5 rounded-2xl bg-red-500/5 border border-red-500/20 text-xs flex items-center justify-between">
                                <div>
                                    <span className="text-gray-300 block">Ø±Ù‚Ù… Ø§Ù„Ù…Ø­ÙØ¸Ø© Ø§Ù„Ø±Ø³Ù…ÙŠ:</span>
                                    <strong className="text-white font-mono text-sm">+20 101 592 2628</strong>
                                </div>
                                <span className="font-mono text-cyan-300 bg-black/60 px-3 py-1.5 rounded-lg">*9*7*+20 101 592 2628*3000#</span>
                            </div>
                        ) : (
                            <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-2">
                                <span className="text-gray-300 block">Ø£Ø±Ø³Ù„ Ø¥Ø´Ø¹Ø§Ø± Ø§Ù„ØªØ­ÙˆÙŠÙ„ Ø§Ù„Ø¨Ù†ÙƒÙŠ Ø¥Ù„Ù‰ Ù…ÙƒØªØ¨ Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª:</span>
                                <a href="https://wa.me/2+20 101 592 2628" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs">
                                    <span>Ù…Ø±Ø§Ø³Ù„Ø© Ø§Ù„Ù…ÙƒØªØ¨ Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠ (+20 101 592 2628) âž”</span>
                                </a>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs text-gray-300 mb-1">Ø±Ù‚Ù… Ø§Ù„Ø¹Ù…Ù„ÙŠØ© / Ø§Ù„Ø¥Ø´Ø¹Ø§Ø± Ù…Ù† Ø§Ù„Ø±Ø³Ø§Ù„Ø© *</label>
                            <input type="text" required placeholder="TRX-XXXXXXXX Ø£Ùˆ Ø±Ù‚Ù… Ø§Ù„ØªØ­ÙˆÙŠÙ„" value={form.providerRef} onChange={(e) => setForm({ ...form, providerRef: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none" />
                        </div>

                        {/* PROFESSIONAL CANCELLATION & REFUND POLICY */}
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-[11px] text-gray-400 flex items-center gap-2 font-mono">
                            <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span>ðŸ”’ Ù…Ø¹Ø§Ù…Ù„Ø© Ø¢Ù…Ù†Ø©. Ù‚Ø§Ø¨Ù„Ø© Ù„Ù„Ø§Ø³ØªØ±Ø¯Ø§Ø¯ Ø¨Ù†Ø³Ø¨Ø© 100% Ø­ØªÙ‰ 48 Ø³Ø§Ø¹Ø© Ù‚Ø¨Ù„ Ù…ÙˆØ¹Ø¯ Ø§Ù„Ø¬Ù„Ø³Ø© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ©. Ù…Ø­Ù…ÙŠØ© Ø¨Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„Ø§Øª ÙƒÙˆÙ†Ø³ÙˆØ±ØªÙŠÙˆÙ… Ø³ÙˆØ¯Ø§Ø¬ÙŠÙ†.</span>
                        </div>
                    </div>

                    {/* 6. THE 10% - 30% MEMBERSHIP UPSELL (THE GOLDEN HOOK) */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-900/20 to-slate-900 border border-amber-500/40 shadow-lg space-y-2">
                        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono">
                            <Zap className="w-4 h-4" />
                            <span>ðŸ’¡ Ù‡Ù„ Ø£Ù†Øª Ø¹Ø¶Ùˆ Ù…Ø³Ø¬Ù„ ÙÙŠ Ù…Ù†Ø¸ÙˆÙ…Ø© GemIInIØŸ</span>
                        </div>
                        <p className="text-xs text-gray-200 leading-relaxed">
                            Ù‚Ù… Ø¨ØªÙØ¹ÙŠÙ„ Ù…Ù„ÙÙƒ Ø§Ù„Ø±Ù‚Ù…ÙŠ Ø¹Ø¨Ø± <a href="https://dev-members.geneacademy.net" target="_blank" rel="noopener noreferrer" className="text-amber-300 underline font-bold">members.geneacademy.net</a> Ù„Ù„Ø­ØµÙˆÙ„ ÙÙˆØ±Ø§Ù‹ Ø¹Ù„Ù‰ <strong>Ø®ØµÙ… 10%</strong> Ø¹Ù„Ù‰ ÙˆØ±Ø´Ø© Ø§Ù„ÙŠÙˆÙ…ØŒ ÙˆØ§Ù„ØªØ±Ù‚ÙŠ ÙÙŠ Ø§Ù„Ø±ØªØ¨ Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© Ù„ÙØªØ­ <strong>Ø®ØµÙˆÙ…Ø§Øª ØªØµÙ„ Ø¥Ù„Ù‰ 30%</strong> Ø¹Ù„Ù‰ ÙƒØ§ÙØ© Ø§Ù„Ø¯ÙˆØ±Ø§Øª ÙˆØ§Ù„Ø§Ù…ØªØ­Ø§Ù†Ø§Øª Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© Ø§Ù„Ù‚Ø§Ø¯Ù…Ø©.
                        </p>
                    </div>

                    {error && (
                        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 text-white font-black text-sm shadow-xl shadow-red-500/20 hover:opacity-95 transition-all">
                        {loading ? 'Ø¬Ø§Ø±Ù ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª ÙÙŠ Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ...' : 'ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø­Ø¬Ø² ÙˆØ¥ØµØ¯Ø§Ø± Ø§Ù„Ù…Ø¹Ø±Ù Ø¨Ø±ØµÙŠØ¯ 200 GP ÙˆØ¨ÙˆÙ†Øµ Ø§Ù„ØªØ­ÙˆÙ„ Ø§Ù„Ø±Ù‚Ù…ÙŠ âž”'}
                    </button>
                </form>
            )}

            {/* POST-SUBMISSION INTERCEPT MODAL (KSA COMMUNITY HUB) */}
            {showKsaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                    <div className="bg-[#0A0F1D] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 text-right relative">
                        <button
                            onClick={() => setShowKsaModal(false)}
                            className="absolute top-4 left-4 text-gray-400 hover:text-white text-sm font-mono"
                        >
                            âœ• Ø¥ØºÙ„Ø§Ù‚
                        </button>

                        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                <Globe className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">KSA LICENSING & RELOCATION INTERCEPT</span>
                                <h4 className="text-base font-bold text-white">ØªÙ†Ø³ÙŠÙ‚ Ø§Ù„ØªØ±Ø§Ø®ÙŠØµ ÙˆØ§Ù„ØªØ³ÙƒÙŠÙ† Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ Ø¨Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ©</h4>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs text-gray-300 space-y-2">
                            <p className="font-semibold text-white">
                                Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¯. {minted?.name || form.fullName} â€” ØªÙ… ØªØ«Ø¨ÙŠØª Ù…Ø¹Ø±ÙÙƒ Ø§Ù„Ø±Ù‚Ù…ÙŠ ({minted?.gaId || 'GA-CONFIRMED'}).
                            </p>
                            <p className="text-emerald-300">
                                Ù‡Ù„ ØªØ±ØºØ¨ ÙÙŠ Ø§Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ Ø§Ø³ØªØ´Ø§Ø±Ø© ÙÙˆØ±ÙŠØ© Ø£Ùˆ Ù…Ø³Ø§Ø¹Ø¯Ø© ÙÙŠ ØªØ±Ø§Ø®ÙŠØµ Ø§Ù„Ù‡ÙŠØ¦Ø© Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ© Ù„Ù„ØªØ®ØµØµØ§Øª Ø§Ù„ØµØ­ÙŠØ© (SCFHS) Ø£Ùˆ Ø§Ù„ØªØ³ÙƒÙŠÙ† ÙˆØ§Ù„ØªÙˆØ¸ÙŠÙ ÙÙŠ Ù…Ø³ØªØ´ÙÙŠØ§Øª Ø§Ù„Ù…Ù…Ù„ÙƒØ©ØŸ
                            </p>
                        </div>

                        <form onSubmit={handleKsaSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-300 mb-1">Ø§ÙƒØªØ¨ Ø§Ø³ØªÙØ³Ø§Ø±Ùƒ Ù„Ù…ÙƒØªØ¨ Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø¨Ø§Ù„Ù…Ù…Ù„ÙƒØ©:</label>
                                <textarea
                                    rows="3"
                                    placeholder="Ù…Ø«Ø§Ù„: Ø£Ø±ØºØ¨ ÙÙŠ Ù…Ø¹Ø±ÙØ© Ø´Ø±ÙˆØ· Ø§Ù…ØªØ­Ø§Ù† Ø§Ù„Ø¨Ø±ÙˆÙ…ØªØ±Ùƒ ÙˆÙ†Ù‚Ù„ Ø§Ù„ØªØ±Ø®ÙŠØµ Ø¥Ù„Ù‰ Ø§Ù„Ù…Ø³ØªØ´ÙÙŠØ§Øª Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ©..."
                                    value={ksaQuestion}
                                    onChange={(e) => setKsaQuestion(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:border-emerald-400 focus:outline-none"
                                ></textarea>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø§Ø³ØªÙØ³Ø§Ø± Ù„Ù…ÙƒØªØ¨ Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ© Ø¹Ø¨Ø± WhatsApp âž”</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowKsaModal(false)}
                                    className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs transition-all"
                                >
                                    Ù„Ø§Ø­Ù‚Ø§Ù‹
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SovereignGateway;
