import React, { useState } from 'react';
import { Banknote, QrCode, ShieldCheck, Smartphone, CheckCircle2 } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { useLang } from '@/i18n/LanguageContext';
import { SOVEREIGN_ECOSYSTEM } from '@/data/sovereign-config';

const PaymentChannels = ({ compact = false }) => {
    const { lang } = useLang();
    const L = (obj) => (obj && (obj[lang] || obj.en)) || '';
    const { paymentMethods, tiers } = SOVEREIGN_ECOSYSTEM.pricing;
    const [active, setActive] = useState(paymentMethods[0].key);
    const activeMethod = paymentMethods.find((m) => m.key === active) || paymentMethods[0];

    const copy = {
        title: { en: 'Payment Channels', ar: 'قنوات الدفع' },
        sub: {
            en: 'Two equal channels. Pay in SDG via Vodafone Cash or Bankak, then email your receipt to activate your tier.',
            ar: 'قناتان متساويتان. ادفع بالجنيه عبر Vodafone Cash أو بنكك، ثم أرسل الإيصال لتفعيل باقتك.',
        },
        howTo: { en: 'How to pay', ar: 'كيف تدفع' },
        security: {
            en: 'Every transaction is logged against your GA-ID. We never store card numbers — only the confirmation reference you email us.',
            ar: 'تُسجَّل كل عملية مقابل رقم عضويتك. لا نخزّن أرقام بطاقات — فقط رقم المرجع الذي ترسله بالبريد.',
        },
        account: { en: 'Account', ar: 'الحساب' },
        holder: { en: 'Holder', ar: 'المستفيد' },
        scan: { en: 'Scan to pay', ar: 'امسح للدفع' },
        qrNote: { en: 'QR placeholder — replace with live Vodafone Cash QR', ar: 'مكان رمز QR — يُستبدل برمز Vodafone Cash الفعلي' },
        step: { en: 'Step', ar: 'خطوة' },
    };

    return (
        <div>
            {!compact && (
                <div className="mb-10">
                    <span className="font-tech text-xs uppercase tracking-[0.28em] text-[hsl(var(--accent))]">
                        {L({ en: 'Sovereign Treasury', ar: 'الخزينة السيادية' })}
                    </span>
                    <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{L(copy.title)}</h2>
                    <p className="mt-2 max-w-2xl text-muted-foreground">{L(copy.sub)}</p>
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
                {/* Method selector + detail */}
                <Reveal>
                    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6">
                        <div className="grid grid-cols-2 gap-3">
                            {paymentMethods.map((m) => {
                                const isActive = m.key === active;
                                const Icon = m.key === 'vodafone' ? Smartphone : Banknote;
                                return (
                                    <button
                                        key={m.key}
                                        type="button"
                                        onClick={() => setActive(m.key)}
                                        className={`flex min-h-[64px] flex-col items-start gap-1 rounded-xl border p-4 text-start transition-colors ${
                                            isActive
                                                ? 'border-[hsl(var(--accent))]/60 bg-[hsl(var(--accent))]/10'
                                                : 'border-border bg-secondary/40 hover:bg-secondary'
                                        }`}
                                    >
                                        <Icon className="h-5 w-5 text-[hsl(var(--teal))]" strokeWidth={1.8} />
                                        <span className="font-display text-sm font-semibold">{m.name}</span>
                                        <span className="font-tech text-[11px] text-muted-foreground">{m.number}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <dl className="mt-2 space-y-3 border-t border-border pt-4 text-sm">
                            <div className="flex justify-between gap-3">
                                <dt className="text-muted-foreground">{L(copy.holder)}</dt>
                                <dd className="text-end font-medium">{L(activeMethod.holder)}</dd>
                            </div>
                            <div className="flex justify-between gap-3">
                                <dt className="text-muted-foreground">{lang === 'ar' ? 'الرقم' : 'Number'}</dt>
                                <dd className="font-tech text-sm font-medium">{activeMethod.number}</dd>
                            </div>
                            {activeMethod.account && (
                                <div className="flex justify-between gap-3">
                                    <dt className="text-muted-foreground">{L(copy.account)}</dt>
                                    <dd className="font-tech text-sm font-medium">{activeMethod.account}</dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </Reveal>

                {/* How to pay + QR */}
                <Reveal delay={0.08}>
                    <div className="flex h-full flex-col gap-5 rounded-2xl border border-border bg-card p-6">
                        <div className="flex items-center gap-2">
                            <h3 className="font-display text-lg font-semibold">{L(copy.howTo)}</h3>
                            <span className="rounded-full bg-secondary px-2.5 py-0.5 font-tech text-[11px] uppercase tracking-wider text-muted-foreground">
                                {activeMethod.name}
                            </span>
                        </div>

                        <ol className="space-y-3">
                            {(activeMethod.steps[lang] || activeMethod.steps.en).map((step, i) => (
                                <li key={i} className="flex gap-3 text-sm">
                                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[hsl(var(--teal))]/15 font-tech text-xs font-semibold text-[hsl(var(--teal))]">
                                        {i + 1}
                                    </span>
                                    <span className="pt-0.5 leading-relaxed text-muted-foreground">{step}</span>
                                </li>
                            ))}
                        </ol>

                        {activeMethod.qr && (
                            <div className="mt-auto flex items-center gap-4 rounded-xl border border-dashed border-border bg-secondary/30 p-4">
                                <div className="grid h-24 w-24 shrink-0 place-items-center rounded-lg border border-border bg-background">
                                    <QrCode className="h-16 w-16 text-muted-foreground/70" strokeWidth={1.2} />
                                </div>
                                <div>
                                    <p className="font-display text-sm font-semibold">{L(copy.scan)}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{L(copy.qrNote)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </Reveal>
            </div>

            {/* Tier reference + security */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {tiers.map((tier) => (
                    <div key={tier.name} className="rounded-xl border border-border bg-card p-4 text-sm">
                        <p className="font-display font-semibold">{tier.name}</p>
                        <p className="mt-1 font-tech text-[hsl(var(--teal))]">{tier.sdg.toLocaleString('en-US')} SDG</p>
                        <p className="text-xs text-muted-foreground">{tier.sar} SAR · ${tier.usd} USD</p>
                    </div>
                ))}
            </div>

            <p className="mt-5 flex items-start gap-2 rounded-xl border border-border bg-secondary/30 p-4 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--teal))]" strokeWidth={1.8} />
                {L(copy.security)}
            </p>
        </div>
    );
};

export default PaymentChannels;
export { PaymentChannels };
