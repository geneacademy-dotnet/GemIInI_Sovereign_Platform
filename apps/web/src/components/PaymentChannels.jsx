import React, { useState } from 'react';
import { Banknote, QrCode, ShieldCheck, Smartphone, CheckCircle2, Copy, Check, Coffee } from 'lucide-react';
import { useLang } from '@/i18n/LanguageContext';
import { SOVEREIGN_ECOSYSTEM } from '@/data/sovereign-config';

const PaymentChannels = ({ selectedMethod, onSelectMethod, compact = false }) => {
    const { lang } = useLang();
    const [copied, setCopied] = useState(false);
    const { channels, pricing } = SOVEREIGN_ECOSYSTEM;

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const paymentMethods = [
        {
            key: 'vodafone',
            name: 'Vodafone Cash (ÙÙˆØ¯Ø§ÙÙˆÙ† ÙƒØ§Ø´)',
            nameEn: 'Vodafone Cash (Egypt & Diaspora)',
            desc: `~100 EGP / ~$2.50 USD (${pricing.concept})`,
            account: channels.vodafoneCash,
            code: '*9*7*+20 101 592 2628#',
            icon: Smartphone,
            color: 'border-red-500/40 bg-red-500/5 text-red-400'
        },

        {
            key: 'gulf',
            name: 'ØªØ­ÙˆÙŠÙ„ Ø§Ù„Ø®Ù„ÙŠØ¬ (Saudi / Gulf Direct)',
            nameEn: 'Gulf Direct Transfer (SAR / AED)',
            desc: '15 â€“ 20 SAR / AED (Local Parity)',
            account: 'Ø¹Ø¨Ø± ÙˆØ§ØªØ³Ø§Ø¨ Ø§Ù„Ø¥Ø¯Ø§Ø±Ø© / Concierge Desk',
            code: '+20 101 592 2628',
            icon: QrCode,
            color: 'border-amber-500/40 bg-amber-500/5 text-amber-400'
        }
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                <Coffee className="w-4 h-4 flex-shrink-0 text-amber-400" />
                <span>
                    {lang === 'ar'
                        ? 'Ù…Ø¤Ø´Ø± Ø§Ù„ØªÙƒØ§ÙØ¤ Ø§Ù„Ù…Ø­Ù„ÙŠ: Ø±Ø³ÙˆÙ… Ø§Ù„Ø¨ÙˆØ§Ø¨Ø© ØªØ¹Ø§Ø¯Ù„ Ù‚ÙŠÙ…Ø© ÙƒÙˆØ¨ÙŠÙ† Ù…Ù† Ø§Ù„Ù‚Ù‡ÙˆØ© Ù…Ø­Ù„ÙŠØ§Ù‹ Ù„Ø¶Ù…Ø§Ù† Ø§Ù„Ø¬Ø¯ÙŠØ© ÙˆØªÙØ¹ÙŠÙ„ Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ.'
                        : 'Localized Coffee-Parity Index: Gateway micro-fee equals the local cost of two cups of coffee.'}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {paymentMethods.map((m) => {
                    const Icon = m.icon;
                    const isSelected = selectedMethod === m.key;
                    return (
                        <div
                            key={m.key}
                            onClick={() => onSelectMethod && onSelectMethod(m.key)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                isSelected
                                    ? 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400 shadow-lg'
                                    : 'border-white/10 bg-white/5 hover:border-white/20'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Icon className="w-4 h-4 text-cyan-400" />
                                    <span className="text-xs font-bold text-white">
                                        {lang === 'ar' ? m.name : m.nameEn}
                                    </span>
                                </div>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                            </div>
                            <p className="text-[11px] text-gray-400 mb-2">{m.desc}</p>
                            <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                                <span className="font-mono text-xs text-cyan-300">{m.account}</span>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        copyToClipboard(m.account);
                                    }}
                                    className="text-gray-400 hover:text-white p-1"
                                    title="Copy Account"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PaymentChannels;
