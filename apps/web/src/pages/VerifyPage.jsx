import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { Search, ShieldCheck, CheckCircle2, AlertCircle, ExternalLink, QrCode, Sparkles, Copy, Check, Clock } from 'lucide-react';
import Layout from '@/components/site/Layout';
import HolographicTiltCard from '@/components/HolographicTiltCard';
import { useLang } from '@/i18n/LanguageContext';
import SovereignClient, { normalizeGaId } from '@/services/sovereignService';
import { SOVEREIGN_ECOSYSTEM } from '@/data/sovereign-config';
import { gaRegistry } from '@/data/demo';

const VerifyPage = () => {
    const { lang } = useLang();
    const [searchParams, setSearchParams] = useSearchParams();
    const urlId = searchParams.get('id') || 'GA-0171';
    const [query, setQuery] = useState(urlId);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [copied, setCopied] = useState(false);

    const executeLookup = async (idToSearch) => {
        const cleanId = normalizeGaId(idToSearch || query);
        if (!cleanId) return;

        setLoading(true);
        setSearched(true);

        try {
            // 1. Check local / remote SovereignClient lookup
            const remoteRes = await SovereignClient.lookup(cleanId);
            if (remoteRes && remoteRes.found && remoteRes.member) {
                setResult({
                    id: remoteRes.member.id,
                    name: remoteRes.member.name,
                    university: remoteRes.member.univ || 'Sudanese Medical Faculty',
                    role: remoteRes.member.role || 'Member',
                    gp: remoteRes.member.gp || 25,
                    ects: 10.0,
                    status: remoteRes.member.verified ? 'ACCREDITED' : 'PENDING_AUDIT',
                    verified: Boolean(remoteRes.member.verified),
                    hash: 'SUDAPASS-' + cleanId.replace(/[^A-Z0-9]/g, '') + '-VERIFIED',
                    signatory: 'Dr. Mohamed Gibbril (CEO) & Dr. Alaa Mursi (COO)'
                });
                return;
            }

            // 2. Check local leadership & static registry fallback
            const staticFound = gaRegistry?.find(
                (r) => normalizeGaId(r.id) === cleanId || (r.name && r.name.toLowerCase().includes(cleanId.toLowerCase()))
            );

            if (staticFound) {
                setResult(staticFound);
                return;
            }

            // 3. Fallback for Executive Anchors
            const leader = SOVEREIGN_ECOSYSTEM.leadership.find((l) => normalizeGaId(l.id) === cleanId);
            if (leader) {
                setResult({
                    id: leader.id,
                    name: lang === 'ar' ? leader.name.ar : leader.name.en,
                    university: 'University of Khartoum / OIU / Irish Medical Council',
                    role: lang === 'ar' ? leader.role.ar : leader.role.en,
                    gp: 5000,
                    ects: 120.0,
                    status: 'ACCREDITED',
                    verified: true,
                    hash: 'SUDAPASS-FOUNDER-' + leader.id + '-PERMANENT',
                    signatory: 'Sovereign Consortium Executive Board'
                });
                return;
            }

            setResult(null);
        } catch (err) {
            console.error('Verification error:', err);
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (urlId) {
            setQuery(urlId);
            executeLookup(urlId);
        }
    }, [urlId]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchParams({ id: normalizeGaId(query) });
        executeLookup(query);
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Layout>
            <Helmet>
                <title>Verify GA-ID Credential | Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ</title>
                <meta name="description" content="Ù…Ù†Ø¸ÙˆÙ…Ø© Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø±Ù‚Ù…ÙŠ Ø§Ù„Ù„Ø§Ù…Ø±ÙƒØ²ÙŠ Ù„Ù„Ø´Ù‡Ø§Ø¯Ø§Øª ÙˆØ§Ù„Ø¹Ø¶ÙˆÙŠØ§Øª Ø§Ù„Ø·Ø¨ÙŠØ© ÙˆØ§Ù„Ø³Ø±ÙŠØ±ÙŠØ© Ø§Ù„ØµØ§Ø¯Ø±Ø© Ù…Ù† Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© Ø³ÙˆØ¯Ø§Ø¬ÙŠÙ†." />
            </Helmet>

            <section className="bg-[#04080F] text-white py-16 min-h-screen">
                <div className="mx-auto max-w-4xl px-5">
                    {/* HEADER */}
                    <div className="text-center mb-10">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-1 text-xs font-mono font-bold text-cyan-400 mb-3">
                            <ShieldCheck className="w-4 h-4" />
                            DECENTRALIZED MEDICAL REGISTRY VERIFIER
                        </span>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                            {lang === 'ar' ? 'Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„ÙÙˆØ±ÙŠ Ù…Ù† Ø§Ù„Ø¹Ø¶ÙˆÙŠØ© Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ©' : 'Instant Sovereign Credential Verification'}
                        </h1>
                        <p className="mt-3 text-sm text-gray-400 max-w-2xl mx-auto">
                            {lang === 'ar'
                                ? 'Ø£Ø¯Ø®Ù„ Ø§Ù„Ù…Ø¹Ø±Ù Ø§Ù„Ø±Ù‚Ù…ÙŠ (GA-ID) Ø£Ùˆ Ø§Ù„Ø§Ø³Ù… Ù„Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ ÙˆØ§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠ Ø§Ù„ØµØ§Ø¯Ø± ÙˆØ§Ù„Ù…ÙˆØ«Ù‚.'
                                : 'Enter a GA-ID or member name to verify forensic accreditation status across the master ledger.'}
                        </p>
                    </div>

                    {/* SEARCH INPUT */}
                    <form onSubmit={handleSearchSubmit} className="mb-12">
                        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="e.g. GA-0171, GA-000, GA-001, GA-004..."
                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900 border border-white/15 text-white font-mono text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? 'Checking...' : (lang === 'ar' ? 'ØªØ­Ù‚Ù‚ Ø§Ù„Ø¢Ù†' : 'Verify GA-ID')}
                            </button>
                        </div>
                    </form>

                    {/* RESULT PRESENTATION */}
                    {searched && (
                        <div>
                            {result ? (
                                <div className="space-y-8 animate-in fade-in zoom-in duration-300">
                                    {/* 3D HOLOGRAPHIC CARD */}
                                    <div className="flex justify-center">
                                        <HolographicTiltCard member={result} />
                                    </div>

                                    {/* DETAILED VERIFICATION PANEL */}
                                    <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                                    <span className="font-mono text-xs font-bold text-emerald-400 tracking-wider uppercase">
                                                        OFFICIAL FORENSIC RECORD
                                                    </span>
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-black text-white">
                                                    {result.name}
                                                </h3>
                                                <p className="text-xs text-cyan-300 font-mono mt-0.5">
                                                    {result.university}
                                                </p>
                                            </div>

                                            <div className="text-left sm:text-right">
                                                <span className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-400 font-mono text-sm font-black block sm:inline-block">
                                                    {result.id}
                                                </span>
                                                <span className="text-[11px] font-mono text-gray-400 block mt-1">
                                                    STATUS: <strong className="text-emerald-300">{result.status || 'VERIFIED'}</strong>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 text-xs font-mono">
                                            <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                                                <span className="text-gray-400 block mb-1">Assigned Role</span>
                                                <strong className="text-white text-sm">{result.role}</strong>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                                                <span className="text-gray-400 block mb-1">Living GP Balance</span>
                                                <strong className="text-cyan-400 text-sm">{result.gp} GP</strong>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                                                <span className="text-gray-400 block mb-1">Accredited ECTS</span>
                                                <strong className="text-teal-300 text-sm">{result.ects || '10.0'} ECTS</strong>
                                            </div>
                                        </div>

                                        {/* CRYPTOGRAPHIC AUDIT HASH */}
                                        <div className="p-4 rounded-2xl bg-black/70 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                                            <div>
                                                <span className="text-gray-400 block text-[10px]">CRYPTOGRAPHIC VERIFICATION SEAL</span>
                                                <code className="text-cyan-300 text-xs break-all">{result.hash || 'SUDAPASS-VERIFIED-SEAL'}</code>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(result.hash || result.id)}
                                                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                                            >
                                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                                <span>{copied ? 'Copied' : 'Copy Seal'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 rounded-3xl bg-slate-900/60 border border-red-500/20 text-center max-w-xl mx-auto">
                                    <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                                    <h3 className="text-lg font-bold text-white mb-1">
                                        {lang === 'ar' ? 'Ù„Ù… ÙŠØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ Ø³Ø¬Ù„ Ù…Ø·Ø§Ø¨Ù‚' : 'No Matching Sovereign Record Found'}
                                    </h3>
                                    <p className="text-xs text-gray-400 mb-4">
                                        {lang === 'ar'
                                            ? 'ØªØ£ÙƒØ¯ Ù…Ù† ÙƒØªØ§Ø¨Ø© Ø§Ù„Ø±Ù‚Ù… Ø§Ù„ØªØ¹Ø±ÙŠÙÙŠ Ø¨Ø´ÙƒÙ„ ØµØ­ÙŠØ­ (Ù…Ø«Ø§Ù„: GA-0171 Ø£Ùˆ GA-000) Ø£Ùˆ Ù‚Ù… Ø¨Ø§Ù„ØªØ³Ø¬ÙŠÙ„ ÙÙŠ Ø§Ù„Ù…Ù†Ø¸ÙˆÙ…Ø©.'
                                            : 'Please verify the ID format (e.g. GA-0171, GA-000, GA-001) or register a new credential.'}
                                    </p>
                                    <a
                                        href="/register"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-all"
                                    >
                                        <span>{lang === 'ar' ? 'ØªØ³Ø¬ÙŠÙ„ Ø¹Ø¶ÙˆÙŠØ© Ø¬Ø¯ÙŠØ¯Ø© âž”' : 'Register New GA-ID âž”'}</span>
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
};

export default VerifyPage;
