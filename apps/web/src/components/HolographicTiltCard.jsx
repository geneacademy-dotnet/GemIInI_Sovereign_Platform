import React, { useState, useRef } from 'react';
import { ShieldCheck, QrCode, Award, Dna, Share2, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang } from '@/i18n/LanguageContext';

export const HolographicTiltCard = ({ member, className }) => {
    const { lang } = useLang();
    const cardRef = useRef(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
    const [copied, setCopied] = useState(false);

    const m = member || {
        id: 'GA0171',
        name: 'Dr. Mohamed Ahmed Abdel Fattah Gibbril',
        name_ar: 'Ø¯. Ù…Ø­Ù…Ø¯ Ø£Ø­Ù…Ø¯ Ø¹Ø¨Ø¯ Ø§Ù„ÙØªØ§Ø­ Ø¬Ø¨Ø±ÙŠÙ„',
        role: 'Senior Clinical Vanguard',
        role_ar: 'Ù‚Ø§Ø¦Ø¯ Ø³Ø±ÙŠØ±ÙŠ Ù…ØªÙ‚Ø¯Ù…',
        university: 'University of Khartoum - Faculty of Medicine',
        university_ar: 'Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ø®Ø±Ø·ÙˆÙ… - ÙƒÙ„ÙŠØ© Ø§Ù„Ø·Ø¨',
        gp: 1250,
        ects: 58.5,
        smcScore: '96.4%',
        tier: 'Sovereign Vanguard',
        hash: 'SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
    };

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rX = ((y - centerY) / centerY) * -12;
        const rY = ((x - centerX) / centerX) * 12;

        setRotateX(rX);
        setRotateY(rY);
        setGlare({
            x: (x / rect.width) * 100,
            y: (y / rect.height) * 100,
            opacity: 0.65
        });
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
        setGlare((prev) => ({ ...prev, opacity: 0 }));
    };

    const copyVerifyLink = () => {
        const url = `${window.location.origin}/verify?id=${m.id}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className={cn("flex flex-col items-center gap-4", className)}>
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                    transition: 'transform 0.15s ease-out',
                }}
                className="relative w-full max-w-[440px] rounded-2xl p-[2px] bg-gradient-to-br from-teal-400 via-purple-500 to-amber-400 shadow-2xl overflow-hidden cursor-pointer select-none"
            >
                {/* Holographic Sheen Overlay */}
                <div
                    className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 65%)`,
                        opacity: glare.opacity,
                        mixBlendMode: 'overlay',
                    }}
                />

                {/* Card Body */}
                <div className="relative z-10 rounded-[14px] bg-[#0A0D16] text-[#E8ECF1] p-6 flex flex-col justify-between min-h-[260px] border border-white/10 backdrop-blur-md text-right" dir="rtl">
                    
                    {/* Header Strip */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                            <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30 font-bold text-xs font-mono">
                                SG
                            </span>
                            <div>
                                <span className="text-[11px] font-mono tracking-widest text-teal-400 uppercase font-bold block">
                                    SudaGene Sovereign OS
                                </span>
                                <span className="text-[10px] text-gray-400">
                                    Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯ SudaPass
                                </span>
                            </div>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-mono text-emerald-300 font-bold">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            VERIFIED âœ“
                        </span>
                    </div>

                    {/* Member Core Info */}
                    <div className="my-4">
                        <span className="text-xs font-mono font-bold text-amber-400 tracking-wider block">
                            {m.id} â€¢ {m.tier || 'Sovereign Vanguard'}
                        </span>
                        <h3 className="text-xl font-bold text-white mt-1 leading-tight">
                            {lang === 'ar' ? (m.name_ar || m.name) : m.name}
                        </h3>
                        <p className="text-xs text-gray-300 mt-1 flex items-center gap-1.5">
                            <span>ðŸ›ï¸</span> {lang === 'ar' ? (m.university_ar || m.university) : m.university}
                        </p>
                    </div>

                    {/* Stats Matrix */}
                    <div className="grid grid-cols-3 gap-2 bg-white/5 rounded-xl p-3 border border-white/5 text-center my-1">
                        <div>
                            <span className="text-[10px] uppercase text-gray-400 block font-mono">Ø§Ù„Ø±ØµÙŠØ¯</span>
                            <span className="text-sm font-extrabold text-amber-400 font-mono">+{m.gp || 500} GP</span>
                        </div>
                        <div className="border-x border-white/10">
                            <span className="text-[10px] uppercase text-gray-400 block font-mono">Ø§Ù„Ø³Ø§Ø¹Ø§Øª Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø©</span>
                            <span className="text-sm font-extrabold text-teal-300 font-mono">{m.ects || 4.5} ECTS</span>
                        </div>
                        <div>
                            <span className="text-[10px] uppercase text-gray-400 block font-mono">Ù†Ø³Ø¨Ø© Ø§Ø¬ØªÙŠØ§Ø² SMC</span>
                            <span className="text-sm font-extrabold text-emerald-400 font-mono">{m.smcScore || '96.4%'}</span>
                        </div>
                    </div>

                    {/* Footer Hash Strip */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[9px] font-mono text-gray-500">
                        <span className="truncate max-w-[260px]">{m.hash || 'SUDAPASS-ED25519-SOVEREIGN-VERIFIED'}</span>
                        <span>v2026.1</span>
                    </div>

                </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3">
                <button
                    onClick={copyVerifyLink}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 text-xs font-semibold border border-slate-700 transition-colors shadow-sm cursor-pointer"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>ØªÙ… Ù†Ø³Ø® Ø±Ø§Ø¨Ø· Ø§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5 text-gray-300" />
                            <span>Ù†Ø³Ø® Ø±Ø§Ø¨Ø· Ø§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ø¹Ø§Ù… ðŸªª</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default HolographicTiltCard;
