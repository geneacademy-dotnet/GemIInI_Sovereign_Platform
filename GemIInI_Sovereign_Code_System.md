# GemIInI SudaGene Platform & SudaGene Consortium
**Full System Architecture & Source Code Export**
**Release:** v2.0 (August 2026) | **Status:** DEPLOYMENT READY ðŸš€

> [!IMPORTANT]
> **Strategic Capability**
> We are one of the premier Independent entities in Sudan offering advanced clinical evaluation in **Infectious Diseases, Cellular Immunology, Microbiology, and Genomics**. This platform is a Independent Global Talent engine, translating basic science into the absolute standard of care.

---

This document encapsulates the core frontend and operational code system of the GemIInI SudaGene Platform. It includes the full, un-omitted source code for the Master Landing Page, the SudaPass Ledger verification interface, the Horizons React/JS Exam Cockpit (SMC Sprint), and the underlying Telemetry Backend API.

````carousel
## 1. The Corporate Umbrella: Master Landing Page (`index.html`)
```html
<!DOCTYPE html>
<html lang="ar" dir="rtl" class="scroll-smooth bg-[#04080F] text-white">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GemIInI Academy & SudaGene Consortium | Ø§Ù„Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© ÙˆØ§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø©</title>
    <meta name="description" content="Ø§Ù„Ù…Ù†Ø¸ÙˆÙ…Ø© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© Ø§Ù„Ø±Ù‚Ù…ÙŠØ© Ø§Ù„Ø±Ø§Ø¦Ø¯Ø© Ù„Ù„Ø£Ø·Ø¨Ø§Ø¡ ÙˆØ§Ù„Ø¨Ø§Ø­Ø«ÙŠÙ†: Ø§Ù„Ø¨Ø±Ù†Ø§Ù…Ø¬ Ø§Ù„ØªØ¯Ø±ÙŠØ¨ÙŠ Ø§Ù„Ù…ØªÙ‚Ø¯Ù… Ù„Ù„Ø¥Ù†Ø¹Ø§Ø´ Ø§Ù„Ù‚Ù„Ø¨ÙŠ Ø§Ù„Ø±Ø¦ÙˆÙŠ Ø§Ù„Ø£Ø³Ø§Ø³ÙŠ (AHA BLS Provider) Ø¨Ø§Ù„Ù‚Ø§Ù‡Ø±Ø©ØŒ Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„ÙˆØ·Ù†ÙŠ Ù„ÙƒÙ„ÙŠØ§Øª Ø§Ù„Ø·Ø¨ Ø§Ù„Ù€ 63+ØŒ Ù…Ø­Ø§ÙƒÙŠ Ø§Ù„Ù‚Ø±Ø§Ø±Ø§Øª Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© MTCâ„¢ØŒ ÙˆØ§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„ÙÙˆØ±ÙŠ SudaPass.">
 
    <meta property="og:title" content="GemIInI Academy | Ø§Ù„Ù…Ù†Ø¸ÙˆÙ…Ø© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø© Ù„Ù„Ø£Ø·Ø¨Ø§Ø¡">
    <meta property="og:description" content="Ø³Ø¬Ù„ ÙÙŠ Ø§Ù„Ø¨Ø±Ù†Ø§Ù…Ø¬ Ø§Ù„ØªØ¯Ø±ÙŠØ¨ÙŠ Ø§Ù„Ù…ØªÙ‚Ø¯Ù… Ù„Ù„Ø¥Ù†Ø¹Ø§Ø´ Ø§Ù„Ù‚Ù„Ø¨ÙŠ Ø§Ù„Ø±Ø¦ÙˆÙŠ Ø§Ù„Ø£Ø³Ø§Ø³ÙŠ (AHA BLS Provider) Ø¨Ø§Ù„Ù‚Ø§Ù‡Ø±Ø©ØŒ ÙˆØªØµÙØ­ Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„ÙˆØ·Ù†ÙŠ Ù„ÙƒÙ„ÙŠØ§Øª Ø§Ù„Ø·Ø¨ Ø§Ù„Ø³ÙˆØ¯Ø§Ù†ÙŠØ© Ø§Ù„Ù€ 63+ ÙˆØªØ¯Ù‚ÙŠÙ‚ Ø§Ù„Ø´Ù‡Ø§Ø¯Ø§Øª.">
    <meta property="og:type" content="website">
 
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-H1Q67PP2DJ"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-H1Q67PP2DJ');
    </script>
 
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
 
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        obsidian: '#04080F', surface: '#090F1D', card: '#0D1629',
                        cyan: { DEFAULT: '#00F2FE', glow: 'rgba(0, 242, 254, 0.15)' },
                        gold: { DEFAULT: '#F59E0B', glow: 'rgba(245, 158, 11, 0.15)' }
                    },
                    fontFamily: {
                        cairo: ['"Cairo"', 'sans-serif'],
                        sans: ['"Plus Jakarta Sans"', '"Cairo"', 'sans-serif'],
                        mono: ['"IBM Plex Mono"', 'monospace']
                    }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Cairo', sans-serif; background-color: #04080F; color: #F1F5F9; }
        .glass-panel { background: rgba(13, 22, 41, 0.7); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(0, 242, 254, 0.1); }
        .glass-panel:hover { border-color: rgba(0, 242, 254, 0.3); box-shadow: 0 15px 35px -10px rgba(0, 242, 254, 0.15); }
        .glow-btn { box-shadow: 0 0 25px rgba(0, 242, 254, 0.35); transition: all 0.3s ease; }
        .glow-btn:hover { box-shadow: 0 0 35px rgba(0, 242, 254, 0.55); transform: translateY(-2px); }
    </style>
</head>
<body class="min-h-screen flex flex-col antialiased selection:bg-cyan selection:text-obsidian">
 
    <aside class="sticky top-0 z-50 bg-[#060D1A]/95 border-b border-cyan/20 backdrop-blur-xl">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 text-xs sm:text-sm">
            <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span class="font-bold text-white">Ø§Ù„Ø¨Ø±Ù†Ø§Ù…Ø¬ Ø§Ù„ØªØ¯Ø±ÙŠØ¨ÙŠ Ø§Ù„Ù…ØªÙ‚Ø¯Ù… Ù„Ù„Ø¥Ù†Ø¹Ø§Ø´ Ø§Ù„Ù‚Ù„Ø¨ÙŠ Ø§Ù„Ø±Ø¦ÙˆÙŠ Ø§Ù„Ø£Ø³Ø§Ø³ÙŠ (AHA BLS Provider) Ø¨Ø§Ù„Ù‚Ø§Ù‡Ø±Ø©:</span>
                <span class="text-gray-400 hidden sm:inline">Ø§Ù„Ø¬Ù…Ø¹Ø© 4 Ø³Ø¨ØªÙ…Ø¨Ø± 2026 â€¢ ØªØ¯Ø±ÙŠØ¨ Ø³Ø±ÙŠØ±ÙŠ Ø¹Ø§Ù„ÙŠ Ø§Ù„Ø¯Ù‚Ø© Ø¨Ù†Ø¸Ø§Ù… Ø§Ù„Ù…Ø­Ø·Ø© Ø§Ù„ÙØ±Ø¯ÙŠØ© Ø¨Ù…Ø±ÙƒØ² Ø¯. ØµØ¨Ø±ÙŠ (ØªØ±Ø®ÙŠØµ 1549) Ø¨Ø§Ù„Ø¯Ù‚ÙŠ</span>
            </div>
            <a href="bls.html" class="px-3.5 py-1 rounded-full bg-cyan/10 text-cyan border border-cyan/30 hover:bg-cyan hover:text-obsidian transition-all font-bold text-xs font-mono">
                ØªØ«Ø¨ÙŠØª Ø§Ù„ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ ÙÙˆØ±ÙŠ âž”
            </a>
        </div>
    </aside>
 
    <header class="sticky top-[41px] z-40 bg-obsidian/85 backdrop-blur-2xl border-b border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
            <a href="index.html" class="flex items-center gap-3 group">
                <div class="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/30 flex items-center justify-center font-bold text-cyan font-mono text-base group-hover:bg-cyan group-hover:text-obsidian transition-all">GA</div>
                <div>
                    <span class="text-lg font-black text-white tracking-tight block">GemIInI<span class="text-cyan">.Academy</span></span>
                    <span class="text-[11px] text-gray-400 font-mono tracking-wider block">SudaGene Consortium</span>
                </div>
            </a>
            <nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-300">
                <a href="index.html" class="text-cyan font-bold">Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©</a>
                <a href="courses.html" class="hover:text-cyan transition-colors">Ø§Ù„Ù…Ø³Ø§Ø±Ø§Øª Ø§Ù„ØªØ®ØµØµÙŠØ© ÙˆØ§Ù„ÙˆØ­Ø¯Ø§Øª Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© (MTCâ„¢)</a>
                <a href="bls.html" class="hover:text-cyan transition-colors">Ø¨Ø±Ù†Ø§Ù…Ø¬ Ø§Ù„Ø¥Ù†Ø¹Ø§Ø´ Ø§Ù„Ù…ØªÙ‚Ø¯Ù… (AHA BLS Provider) - Ø§Ù„Ù‚Ø§Ù‡Ø±Ø©</a>
                <a href="universities.html" class="hover:text-cyan transition-colors">Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„ÙˆØ·Ù†ÙŠ Ù„Ù„Ø¬Ø§Ù…Ø¹Ø§Øª ÙˆÙƒÙ„ÙŠØ§Øª Ø§Ù„Ø·Ø¨ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø© (63+)</a>
                <a href="verify.html" class="hover:text-cyan transition-colors font-mono">SudaPassâ„¢</a>
            </nav>
            <div class="flex items-center gap-3">
                <a href="https://wa.me/2+20 101 592 2628" target="_blank" class="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-200 transition-all font-mono">
                    <span>Ø£Ù…Ø§Ù†Ø© Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª ÙˆØ§Ù„ØªÙˆØ«ÙŠÙ‚ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ:</span><span class="text-cyan">+20 101 592 2628</span>
                </a>
                <a href="bls.html" class="px-5 py-2.5 rounded-xl bg-cyan text-obsidian font-bold text-xs sm:text-sm glow-btn">ØªØ«Ø¨ÙŠØª Ø§Ù„ØªØ³Ø¬ÙŠÙ„ ÙˆØ§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ âž”</a>
            </div>
        </div>
    </header>
 
    <main class="flex-grow space-y-24 py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <section class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div class="lg:col-span-7 space-y-6 text-right">
                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan/10 border border-cyan/30 text-xs font-mono text-cyan">
                    <span class="w-2 h-2 rounded-full bg-cyan animate-pulse"></span>
                    THE Independent CLINICAL PLATFORM Â· ECTS ACCREDITED
                </div>
                <h1 class="text-4xl sm:text-6xl font-black text-white leading-[1.15]">
                    Ø§Ù„ØªØ¹Ù„ÙŠÙ… Ø§Ù„Ø·Ø¨ÙŠ Ø§Ù„Ù…ØªÙ‚Ø¯Ù…ØŒ<br>
                    <span class="text-transparent bg-clip-text bg-gradient-to-l from-cyan via-blue-400 to-white">Ø¨Ø§Ù„Ù…Ø­Ø§ÙƒØ§Ø© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© ÙˆØ§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ù…ÙˆØ«Ù‚.</span>
                </h1>
                <p class="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                    Ø§Ù„Ù…Ø¸Ù„Ø© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© ÙˆØ§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø© Ù„Ù„Ø£Ø·Ø¨Ø§Ø¡ ÙˆØ§Ù„Ø¨Ø§Ø­Ø«ÙŠÙ† ÙÙŠ Ù…Ø³Ø§Ø±Ø§Øª Ø§Ù„ØªØ±Ø®ÙŠØµ (SMC / MRCS / OET) ÙˆØ§Ù„ØªØ¯Ø±ÙŠØ¨ Ø§Ù„Ù…ÙŠØ¯Ø§Ù†ÙŠ Ø§Ù„Ù…ØªÙ‚Ø¯Ù…. ØªØ¯Ø±ÙŠØ¨ Ø¹Ù…Ù„ÙŠ 1:1ØŒ Ù…Ø­Ø§ÙƒØ§Ø© Ø§Ù„Ù‚Ø±Ø§Ø±Ø§Øª MTCâ„¢ØŒ ÙˆØªÙˆØ«ÙŠÙ‚ Ø§Ù„Ø³Ø§Ø¹Ø§Øª Ø¨Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø¹Ø§Ù….
                </p>
                <div class="flex flex-wrap gap-4 pt-4">
                    <a href="bls.html" class="px-7 py-4 rounded-2xl bg-cyan text-obsidian font-bold text-sm sm:text-base glow-btn flex items-center gap-3">
                        <span>Ø­Ø¬Ø² Ø¨Ø±Ù†Ø§Ù…Ø¬ Ø§Ù„Ø¥Ù†Ø¹Ø§Ø´ Ø§Ù„Ù…ØªÙ‚Ø¯Ù… (AHA BLS Provider) - Ø§Ù„Ù‚Ø§Ù‡Ø±Ø© (28 Ø£ØºØ³Ø·Ø³)</span> <span>âž”</span>
                    </a>
                    <a href="universities.html" class="px-7 py-4 rounded-2xl bg-surface hover:bg-card text-white font-bold text-sm sm:text-base border border-white/10 hover:border-cyan/40 transition-all flex items-center gap-2">
                        <span>Ø¯Ù„ÙŠÙ„ ÙƒÙ„ÙŠØ§Øª Ø§Ù„Ø·Ø¨ Ø§Ù„Ù€ 63+</span> <span class="text-gold">ðŸŽ“</span>
                    </a>
                </div>
            </div>
 
            <div class="lg:col-span-5">
                <div class="glass-panel p-8 rounded-3xl space-y-6 border-cyan/30">
                    <div class="flex items-center justify-between pb-4 border-b border-white/10">
                        <div>
                            <span class="text-[11px] font-mono text-cyan uppercase tracking-wider block">CLINICAL HARDWARE RATIO</span>
                            <span class="text-2xl font-black text-white">Ù†Ø³Ø¨Ø© Ø§Ù„ØªØ¯Ø±ÙŠØ¨: 1:1</span>
                        </div>
                        <span class="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">100% HANDS-ON</span>
                    </div>
                    <div class="p-4 rounded-2xl bg-obsidian/60 border border-white/5 space-y-2 text-xs">
                        <div class="flex items-center justify-between">
                            <span class="font-bold text-white text-sm">Ø¯Ù…Ù‰ Ø§Ù„Ø¥Ù†Ø¹Ø§Ø´ Ø§Ù„Ø°ÙƒÙŠØ© (Smart Manikins)</span>
                            <span class="text-gold font-mono font-bold">+200 GP</span>
                        </div>
                        <p class="text-gray-400 leading-relaxed">ØªØ¯Ø±ÙŠØ¨ Ù…Ø¨Ø§Ø´Ø± Ù„ÙƒÙ„ Ø·Ø¨ÙŠØ¨ Ø¹Ù„Ù‰ Ø¯Ù…ÙŠØ© Ù…Ø³ØªÙ‚Ù„Ø© Ù…Ø¹ Ù‚ÙŠØ§Ø³ ÙÙˆØ±ÙŠ Ù„Ø¹Ù…Ù‚ Ø§Ù„Ø¶ØºØ·Ø§Øª ÙˆØ§Ù„ØªØ±Ø¯Ø¯ Ø§Ù„Ø­Ø±ÙƒÙŠ ÙˆØ§Ù„Ø§Ø±ØªØ¯Ø§Ø¯ Ø§Ù„ØµØ¯Ø±ÙŠ Ø¨Ù…Ø±ÙƒØ² Ø¯. ØµØ¨Ø±ÙŠ (ØªØ±Ø®ÙŠØµ 1549).</p>
                    </div>
                    <div class="space-y-2 pt-2">
                        <div class="flex justify-between text-xs font-mono">
                            <span class="text-gray-400">Ø³Ø¹Ø± Ø§Ù„ØªØ³Ø¬ÙŠÙ„:</span>
                            <span class="text-white font-bold text-sm">3,000 Ø¬.Ù…</span>
                        </div>
                        <a href="bls.html" class="block w-full text-center py-3.5 rounded-xl bg-cyan text-obsidian font-bold text-xs sm:text-sm glow-btn">
                            ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ù…Ù‚Ø¹Ø¯ Ø¨Ø§Ù„Ø¯Ù‚ÙŠ âž”
                        </a>
                    </div>
                </div>
            </div>
        </section>
 
        <section class="space-y-12">
            <div class="text-center space-y-4 max-w-3xl mx-auto">
                <h2 class="text-3xl sm:text-4xl font-black text-white">Ø§Ù„Ù…Ù†Ø¸ÙˆÙ…Ø© Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ© Ù„ØªØ·ÙˆÙŠØ± Ø§Ù„ÙƒÙˆØ§Ø¯Ø± Ø§Ù„Ø·Ø¨ÙŠØ©</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- 1 -->
                <div class="glass-panel p-6 rounded-2xl space-y-3">
                    <span class="text-2xl block">ðŸŒ</span>
                    <h3 class="text-lg font-bold text-cyan">Ø¹Ù† ØªØ­Ø§Ù„Ù Ø³ÙˆØ¯Ø§Ø¬ÙŠÙ† (SudaGene Consortium)</h3>
                    <p class="text-sm text-gray-300 leading-relaxed">Ø§Ù„Ù…Ù†Ø¸ÙˆÙ…Ø© Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ© Ù„ØªØ·ÙˆÙŠØ± Ø§Ù„ÙƒÙˆØ§Ø¯Ø± Ø§Ù„Ø·Ø¨ÙŠØ© ÙˆØ§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ. Ø¨Ù†ÙŠØ© ØªØ­ØªÙŠØ© Ø±Ù‚Ù…ÙŠØ© ØµÙ„Ø¨Ø© Ù…ÙØµÙ…Ù…Ø© Ù„ØªÙ…ÙƒÙŠÙ† Ø§Ù„Ø£Ø·Ø¨Ø§Ø¡ ÙˆØ§Ù„Ø¹Ù„Ù…Ø§Ø¡ Ø§Ù„Ø³ÙˆØ¯Ø§Ù†ÙŠÙŠÙ†ØŒ Ù…Ø¯Ø¹ÙˆÙ…Ø© Ø¨Ù…Ø­Ø±ÙƒØ§Øª ØªÙ‚ÙŠÙŠÙ… Ù‚ÙŠØ§Ø³ÙŠØ©ØŒ ÙˆÙ…ÙˆØ«Ù‚Ø© Ø±Ù‚Ù…ÙŠØ§Ù‹ Ø¨ØªØ´ÙÙŠØ± (SHA-256) Ù„Ø¶Ù…Ø§Ù† Ø§Ù„Ù†Ø²Ø§Ù‡Ø© ÙˆØ§Ù„Ù…ÙˆØ«ÙˆÙ‚ÙŠØ© Ø§Ù„Ù…Ø·Ù„Ù‚Ø©.</p>
                </div>
                <!-- 2 -->
                <div class="glass-panel p-6 rounded-2xl space-y-3">
                    <span class="text-2xl block">âœˆï¸</span>
                    <h3 class="text-lg font-bold text-cyan">Ø§Ù„Ø­Ø±Ø§Ùƒ Ø§Ù„Ù…Ù‡Ù†ÙŠ Ø§Ù„Ø¹Ø§Ø¨Ø± Ù„Ù„Ø­Ø¯ÙˆØ¯ (Independent Global Mobility)</h3>
                    <p class="text-sm text-gray-300 leading-relaxed">Ù…Ù†Ø¸ÙˆÙ…Ø© Ø§Ø¹ØªÙ…Ø§Ø¯ ØªØªØ¬Ø§ÙˆØ² Ø§Ù„Ù‚ÙŠÙˆØ¯ Ø§Ù„Ø¬ØºØ±Ø§ÙÙŠØ© ÙˆØªØ­Ø¯ÙŠØ§Øª Ø§Ù„Ø§Ù†Ù‚Ø·Ø§Ø¹ Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠ. Ø³Ø¬Ù„ Ù…Ù‡Ù†ÙŠ Ø±Ù‚Ù…ÙŠ Ù„Ø§ Ù…Ø±ÙƒØ²ÙŠ (E-Logbook) ÙŠØ±Ø§ÙÙ‚ Ø§Ù„Ø·Ø¨ÙŠØ¨ ÙÙŠ ÙƒÙ„ Ù…ÙƒØ§Ù†ØŒ Ù„ÙŠØ¶Ù…Ù† Ø§Ø³ØªÙ…Ø±Ø§Ø±ÙŠØ© Ø§Ù„Ø§Ø¹ØªØ±Ø§Ù Ø¨ÙƒÙØ§Ø¡ØªÙ‡ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© Ø£Ù…Ø§Ù… Ø¬Ù‡Ø§Øª Ø§Ù„ØªØ±Ø®ÙŠØµ ÙˆØ§Ù„ØªÙˆØ¸ÙŠÙ Ø§Ù„Ø¯ÙˆÙ„ÙŠØ© (NHS, SCFHS, ECFMG).</p>
                </div>
                <!-- 3 -->
                <div class="glass-panel p-6 rounded-2xl space-y-3">
                    <span class="text-2xl block">ðŸ§¬</span>
                    <h3 class="text-lg font-bold text-cyan">Ø§Ù„Ø±ÙŠØ§Ø¯Ø© ÙÙŠ Ø§Ù„Ø·Ø¨ Ø§Ù„Ø¬Ø²ÙŠØ¦ÙŠ (Genomic Literacy & Precision Medicine)</h3>
                    <p class="text-sm text-gray-300 leading-relaxed">Ø§Ù„Ø§Ø±ØªÙ‚Ø§Ø¡ Ø¨Ø§Ù„Ù…Ù…Ø§Ø±Ø³Ø© Ø§Ù„Ø·Ø¨ÙŠØ© Ù…Ù† Ø§Ù„ØªØ´Ø®ÙŠØµ Ø§Ù„ØªÙ‚Ù„ÙŠØ¯ÙŠ Ø¥Ù„Ù‰ Ø§Ù„Ø·Ø¨ Ø§Ù„Ø¯Ù‚ÙŠÙ‚. Ù†Ø±Ø³Ø® Ø§Ù„Ø«Ù‚Ø§ÙØ© Ø§Ù„Ø¬ÙŠÙ†ÙˆÙ…ÙŠØ© ÙˆØ§Ù„Ø·Ø¨ Ø§Ù„Ø¬Ø²ÙŠØ¦ÙŠ (Ø¨Ù…Ø¹Ø§ÙŠÙŠØ± Illumina) ÙƒÙ‚Ø¯Ø±Ø© ÙˆØ·Ù†ÙŠØ© Ø³ÙŠØ§Ø¯ÙŠØ©ØŒ Ù„ØªØ£Ù‡ÙŠÙ„ Ø§Ù„ÙƒÙˆØ§Ø¯Ø± Ø§Ù„Ø³ÙˆØ¯Ø§Ù†ÙŠØ© Ù„Ù‚ÙŠØ§Ø¯Ø© Ù‚Ø·Ø§Ø¹Ø§Øª Ø§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ§ Ø§Ù„Ø­ÙŠÙˆÙŠØ© ÙˆØ§Ù„Ø£Ø¨Ø­Ø§Ø« Ø§Ù„Ù…ØªÙ‚Ø¯Ù…Ø©.</p>
                </div>
                <!-- 4 -->
                <div class="glass-panel p-6 rounded-2xl space-y-3 lg:col-span-2">
                    <span class="text-2xl block">âš™ï¸</span>
                    <h3 class="text-lg font-bold text-cyan">Ù…Ø­Ø±Ùƒ Ø¬Ù„ÙˆÙ…ÙŠØª Ø§Ù„Ø§Ø³ØªØ«Ù…Ø§Ø±ÙŠ ÙˆØ§Ù„ØªÙ‚Ù†ÙŠ (GLOMEt Infrastructure Engine)</h3>
                    <p class="text-sm text-gray-300 leading-relaxed">Ø§Ù‚ØªØµØ§Ø¯ Ø·Ø¨ÙŠ Ù…Ø³ØªØ¯Ø§Ù… Ù…Ø¨Ù†ÙŠ Ø¹Ù„Ù‰ ØªÙƒØ§Ù…Ù„ Ù‚Ø·Ø§Ø¹ Ø§Ù„Ø£Ø¹Ù…Ø§Ù„ (B2B) Ù…Ø¹ Ø§Ù„ØªØ¹Ù„ÙŠÙ…. Ù†ÙˆØ¬Ù‡ Ø¹ÙˆØ§Ø¦Ø¯ Ø§Ù„Ø´Ø±Ø§ÙƒØ§Øª Ø§Ù„Ù…Ø¤Ø³Ø³ÙŠØ© ÙˆØªØ¬Ù‡ÙŠØ²Ø§Øª Ø§Ù„ØªØ­ÙˆÙ„ Ø§Ù„Ø±Ù‚Ù…ÙŠ Ø§Ù„Ø·Ø¨ÙŠ Ù„ØªÙ…ÙˆÙŠÙ„ Ø§Ù„Ù…Ù†Ø­ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© ÙˆØªØ·ÙˆÙŠØ± Ø§Ù„Ø¬ÙŠÙ„ Ø§Ù„Ù‚Ø§Ø¯Ù… Ù…Ù† Ø¹Ù„Ù…Ø§Ø¡ Ø§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ§ Ø§Ù„Ø­ÙŠÙˆÙŠØ©.</p>
                </div>
                <!-- 5 -->
                <div class="glass-panel p-6 rounded-2xl space-y-3">
                    <span class="text-2xl block">ðŸ“Š</span>
                    <h3 class="text-lg font-bold text-cyan">Ø§Ù„Ù…Ø¹ÙŠØ§Ø± Ø§Ù„ÙˆØ·Ù†ÙŠ Ù„Ù„ØªÙ‚ÙŠÙŠÙ… Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ (The National Clinical Benchmark)</h3>
                    <p class="text-sm text-gray-300 leading-relaxed">Ø§Ù„Ù…Ø±Ø¬Ø¹ Ø§Ù„Ø£ÙˆÙ„ Ù„Ù‚ÙŠØ§Ø³ Ø§Ù„ÙƒÙØ§Ø¡Ø© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© Ø¹Ø¨Ø± Ù†Ù…ÙˆØ°Ø¬ (MTCâ„¢). ØªÙ‚ÙŠÙŠÙ…Ø§Øª Ù…Ø¨Ù†ÙŠØ© Ø¹Ù„Ù‰ Ù‚ÙŠØ§Ø³ Ø§Ù„Ø§Ø³ØªØ¬Ø§Ø¨Ø© Ø§Ù„ÙØ³ÙŠÙˆÙ„ÙˆØ¬ÙŠØ© ÙˆØ§ØªØ®Ø§Ø° Ø§Ù„Ù‚Ø±Ø§Ø± Ø§Ù„ØªØ´Ø®ÙŠØµÙŠØŒ ØªÙÙˆØ«Ù‘Ù‚ ÙÙŠ Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ (SudaPass) ÙƒØ¯Ù„ÙŠÙ„ Ù‚Ø§Ø·Ø¹ Ù„Ù„Ù…Ø³ØªØ´ÙÙŠØ§Øª ÙˆØ¬Ù‡Ø§Øª Ø§Ù„ØªÙˆØ¸ÙŠÙ.</p>
                </div>
            </div>
        </section>
    </main>
 
    <footer class="bg-[#02050B] border-t border-white/10 py-12 text-xs text-gray-400 mt-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div class="space-y-3 md:col-span-2">
                <span class="text-base font-black text-white block">GemIInI Academy Â· SudaGene Consortium</span>
                <p class="text-gray-400 text-xs leading-relaxed max-w-md">Ø§Ù„Ù…Ø¸Ù„Ø© Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© ÙˆØ§Ù„Ø³Ø±ÙŠØ±ÙŠØ© Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø© Ù„ØªØ£Ù‡ÙŠÙ„ Ø§Ù„Ø£Ø·Ø¨Ø§Ø¡ ÙˆØ§Ù„Ø¨Ø§Ø­Ø«ÙŠÙ†.</p>
            </div>
            <div>
                <span class="font-bold text-white block mb-3 text-sm">Ø§Ù„Ø±ÙˆØ§Ø¨Ø· Ø§Ù„Ø±Ø³Ù…ÙŠØ©</span>
                <ul class="space-y-2">
                    <li><a href="bls.html" class="hover:text-cyan transition-colors">Ø¨Ø±Ù†Ø§Ù…Ø¬ Ø§Ù„Ø¥Ù†Ø¹Ø§Ø´ Ø§Ù„Ù…ØªÙ‚Ø¯Ù… (AHA BLS Provider) - Ø§Ù„Ù‚Ø§Ù‡Ø±Ø©</a></li>
                    <li><a href="universities.html" class="hover:text-cyan transition-colors">Ø¯Ù„ÙŠÙ„ ÙƒÙ„ÙŠØ§Øª Ø§Ù„Ø·Ø¨ 63+</a></li>
                    <li><a href="verify.html" class="hover:text-cyan transition-colors font-mono">Ø§Ù„ØªØ­Ù‚Ù‚ SudaPassâ„¢</a></li>
                </ul>
            </div>
            <div>
                <span class="font-bold text-white block mb-3 text-sm">Ø£Ù…Ø§Ù†Ø© Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª ÙˆØ§Ù„ØªÙˆØ«ÙŠÙ‚ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ</span>
                <ul class="space-y-2 font-mono">
                    <li>ÙÙˆØ¯Ø§ÙÙˆÙ† ÙƒØ§Ø´ / Ø¥Ù†Ø³ØªØ§Ø¨Ø§ÙŠ:</li>
                    <li class="text-cyan font-bold text-sm">+20 101 592 2628</li>
                    <li>ÙˆØ§ØªØ³Ø§Ø¨: +20 101 592 2628</li>
                    <li class="text-gray-500">Ù…Ø±ÙƒØ² Ø¯. ØµØ¨Ø±ÙŠ (ØªØ±Ø®ÙŠØµ 1549) - Ø§Ù„Ø¯Ù‚ÙŠ</li>
                </ul>
    <!-- ADMINISTRATOR CONSOLE: DSII REAL-TIME TRACKING -->
    <section id="admin-dsii-console" class="max-w-7xl mx-auto px-4 sm:px-6 pb-20 hidden">
        <div class="glass-panel p-8 rounded-3xl border border-cyan/30">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h2 class="text-2xl font-black text-white flex items-center gap-3">
                        <span class="w-3 h-3 rounded-full bg-cyan animate-pulse"></span>
                        ÙˆØ­Ø¯Ø© ØªØ­ÙƒÙ… Ø§Ù„Ù…Ø±Ø§Ù‚Ø¨ (DSII Telemetry)
                    </h2>
                    <p class="text-gray-400 font-mono text-sm mt-1">LIVE: EXAM_AUDIT_LOG_STREAM</p>
                </div>
                <div class="px-4 py-2 bg-obsidian rounded-xl border border-white/10 font-mono text-cyan font-bold text-sm">
                    SYSTEM STATUS: SECURE
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- DSII Status Ring -->
                <div class="bg-obsidian/50 p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                    <div class="relative w-32 h-32 flex items-center justify-center mb-4">
                        <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle class="text-gray-800 stroke-current" stroke-width="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                            <circle class="text-cyan stroke-current" stroke-width="8" stroke-linecap="round" cx="50" cy="50" r="40" fill="transparent" stroke-dasharray="251.2" stroke-dashoffset="0" style="transition: stroke-dashoffset 1s ease-in-out;"></circle>
                        </svg>
                        <div class="absolute inset-0 flex flex-col items-center justify-center">
                            <span class="text-3xl font-black text-white font-mono" id="dsii-score">100%</span>
                        </div>
                    </div>
                    <h3 class="font-bold text-gray-300">Ù…Ø¤Ø´Ø± Ø§Ù„Ù†Ø²Ø§Ù‡Ø© Ø§Ù„Ø±Ù‚Ù…ÙŠØ©</h3>
                    <p class="text-xs text-cyan font-mono mt-1" id="dsii-status">SECURE_UNASSISTED</p>
                </div>

                <!-- Live Logs -->
                <div class="md:col-span-2 bg-obsidian/50 p-6 rounded-2xl border border-white/5 flex flex-col">
                    <h3 class="font-bold text-white mb-4 flex items-center gap-2">
                        <svg class="w-4 h-4 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        Ø³Ø¬Ù„ Ø§Ù„Ø§Ù†ØªÙ‡Ø§ÙƒØ§Øª Ø§Ù„Ù…Ø¨Ø§Ø´Ø±
                    </h3>
                    <div class="flex-grow bg-[#020408] rounded-xl border border-white/5 p-4 font-mono text-xs overflow-y-auto max-h-48" id="proctor-live-feed">
                        <div class="text-gray-500 mb-2">> Listening to EXAM_AUDIT_LOG stream...</div>
                        <div class="text-cyan mb-2">> Initialization complete. No anomalies detected.</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- To activate admin view via JS: document.getElementById('admin-dsii-console').classList.remove('hidden'); -->

    <footer class="border-t border-white/10 bg-[#020408] py-8 text-center text-gray-500 text-sm font-mono">
        <p>Â© 2026 GemIInI Academy. All Rights Reserved. SudaGene Consortium Network.</p>
    </footer>
</body>
</html>

```
<!-- slide -->
## 2. The Independent Identity Vault (`verify.html`)
```html
<!DOCTYPE html>
<html lang="ar" dir="rtl" class="scroll-smooth bg-[#04080F] text-white">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ù…Ù†Ø¸ÙˆÙ…Ø© Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ù…Ù‡Ù†ÙŠ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯ (SudaPassâ„¢) | GemIInI Academy</title>
    
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-H1Q67PP2DJ"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-H1Q67PP2DJ');
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700&family=IBM+Plex+Mono:wght@500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = { theme: { extend: { colors: { obsidian: '#04080F', surface: '#090F1D', cyan: { DEFAULT: '#00F2FE' } }, fontFamily: { cairo: ['"Cairo"', 'sans-serif'], mono: ['"IBM Plex Mono"', 'monospace'] } } } }
    </script>
    <style>
        body { font-family: 'Cairo', sans-serif; background-color: #04080F; color: #F1F5F9; }
        .glass-panel { background: rgba(13, 22, 41, 0.75); backdrop-filter: blur(16px); border: 1px solid rgba(0, 242, 254, 0.12); border-radius: 24px; }
        .input-obsidian { width: 100%; background: #090F1D; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0.875rem; padding: 0.875rem 1.25rem; font-size: 15px; color: #FFFFFF; }
        .input-obsidian:focus { outline: none; border-color: #00F2FE; box-shadow: 0 0 15px rgba(0, 242, 254, 0.25); }
    </style>
</head>
<body class="min-h-screen flex flex-col antialiased">

    <header class="sticky top-0 z-40 bg-obsidian/85 backdrop-blur-2xl border-b border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
            <a href="index.html" class="flex items-center gap-3">
                <span class="text-lg font-black text-white">GemIInI<span class="text-cyan">.Verify</span></span>
            </a>
            <a href="index.html" class="text-cyan hover:text-white font-bold text-xs font-mono">Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ© âž”</a>
        </div>
    </header>

    <main class="flex-grow py-16 px-4 sm:px-6 max-w-4xl mx-auto space-y-12">
        <div class="text-center space-y-4">
            <h1 class="text-3xl sm:text-5xl font-black text-white">Ù…Ù†Ø¸ÙˆÙ…Ø© ÙØ­Øµ ÙˆØªÙˆØ«ÙŠÙ‚ Ø§Ù„Ù‚ÙŠØ¯ Ø§Ù„Ù…Ù‡Ù†ÙŠ</h1>
            <p class="text-gray-400 text-sm">ØªØ­Ù‚Ù‚ ÙÙˆØ±ÙŠ Ù…Ù† Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø·Ø¨ÙŠØ¨ØŒ Ø§Ù„Ø³Ø§Ø¹Ø§Øª Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© Ø§Ù„Ù…ÙƒØªØ³Ø¨Ø©ØŒ ÙˆØ§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠ.</p>
        </div>

        <div class="glass-panel p-8 sm:p-12 space-y-8">
            <form onsubmit="handleVerification(event)" class="space-y-4 max-w-lg mx-auto">
                <label class="block text-xs sm:text-sm font-bold text-gray-300 text-right">Ø£Ø¯Ø®Ù„ Ø±Ù‚Ù… Ø§Ù„ØªØ¹Ø±ÙŠÙ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯ (Standardized GA-ID):</label>
                <div class="flex flex-col sm:flex-row gap-3">
                    <input type="text" id="gaIdInput" placeholder="GA-1001" required class="input-obsidian font-mono uppercase text-center sm:text-right" dir="ltr">
                    <button type="submit" id="btnVerify" class="px-8 py-3.5 rounded-xl bg-cyan text-obsidian font-bold text-sm">ÙØ­Øµ Ø§Ù„Ù‚ÙŠØ¯ âž”</button>
                </div>
            </form>

            <div id="verifyResult" class="hidden max-w-lg mx-auto p-6 rounded-2xl transition-all space-y-4"></div>
        </div>
    </main>

    <script src="js/geneApi.js"></script>
    <script>
        // HERE IS WHERE YOU LINK THE APPS SCRIPT URL!
        const APPS_SCRIPT_API_URL = "https://script.google.com/macros/s/AKfycbyh4YIQQofYFpnGV-zImXsXIdBQhdCnYcOF5ZrITDG9-_WuQaPrqibuAibIcdAuKuTH/exec";

        async function handleVerification(e) {
            e.preventDefault();
            const input = document.getElementById('gaIdInput').value.trim().toUpperCase();
            const btn = document.getElementById('btnVerify');
            const resBox = document.getElementById('verifyResult');

            btn.disabled = true;
            btn.innerText = "Ø¬Ø§Ø±Ù Ø§Ù„ÙØ­Øµ...";
            resBox.classList.remove('hidden');
            resBox.className = "max-w-lg mx-auto p-6 rounded-2xl bg-surface border border-white/10 text-gray-300 text-center font-mono text-xs";
            resBox.innerText = "Ø¬Ø§Ø±Ù Ø§Ù„Ø§ØªØµØ§Ù„ Ø¨Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯...";

            try {
                const data = await GeneAPI.get("LOOKUP", { id: input });

                if (data && data.success && data.user) {
                    const u = data.user;
                    resBox.className = "max-w-lg mx-auto p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-right space-y-4";
                    resBox.innerHTML = `
                        <div class="flex justify-between border-b border-emerald-500/30 pb-3">
                            <span class="font-bold text-emerald-400 text-sm">Ù‚ÙŠØ¯ Ù…Ø¹ØªÙ…Ø¯ ÙˆÙ…ÙˆØ«Ù‚ Ø¨Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø¹Ø§Ù…</span>
                            <span class="font-mono text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">${u.gaId}</span>
                        </div>
                        <div class="space-y-2 text-xs text-gray-200">
                            <div class="flex justify-between"><span class="text-gray-400">Ø§Ù„Ø§Ø³Ù…:</span><span class="font-bold text-white">${u.legalName}</span></div>
                            <div class="flex justify-between"><span class="text-gray-400">Ø§Ù„Ø¬Ø§Ù…Ø¹Ø©:</span><span class="font-bold text-white">${u.university}</span></div>
                        </div>
                        <div class="pt-4 border-t border-white/10 mt-4">
                            <div class="flex items-center justify-between">
                                <span class="text-xs text-gray-400 font-bold">Ù…Ø´Ø§Ø±ÙƒØ© Ø§Ù„Ø³Ø¬Ù„ Ù…Ø¹ Ø¬Ù‡Ø§Øª Ø§Ù„ØªÙˆØ¸ÙŠÙ B2B (GDPR):</span>
                                <label class="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" id="consentToggle" class="sr-only peer" onchange="toggleConsent('${u.gaId}', this.checked)">
                                  <div class="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>
                            <p id="consentStatus" class="text-[10px] text-gray-500 mt-2 font-mono hidden">Ø¬Ø§Ø±Ù ØªØ­Ø¯ÙŠØ« Ø§Ù„ØªÙØ¶ÙŠÙ„Ø§Øª...</p>
                        </div>
                    `;
                } else {
                    resBox.className = "max-w-lg mx-auto p-6 rounded-2xl bg-red-950/40 border border-red-500/50 text-right space-y-2";
                    resBox.innerHTML = `<div class="font-bold text-red-400 text-sm">âœ— Ù„Ù… ÙŠØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ Ù‚ÙŠØ¯ Ù…Ø·Ø§Ø¨Ù‚</div>`;
                }
            } catch (err) {
                resBox.className = "max-w-lg mx-auto p-6 rounded-2xl bg-surface border border-white/10 text-gray-400 text-xs";
                resBox.innerText = "ØªØ¹Ø°Ø± Ø§Ù„Ø§ØªØµØ§Ù„ Ø¨Ø§Ù„Ø³Ø¬Ù„ Ø­Ø§Ù„ÙŠØ§Ù‹.";
            } finally {
                btn.disabled = false;
                btn.innerText = "ÙØ­Øµ Ø§Ù„Ù‚ÙŠØ¯ âž”";
            }
        }

        async function toggleConsent(gaId, isChecked) {
            const statusEl = document.getElementById('consentStatus');
            statusEl.classList.remove('hidden');
            statusEl.className = "text-[10px] text-cyan mt-2 font-mono";
            statusEl.innerText = "Ø¬Ø§Ø±Ù ØªØ´ÙÙŠØ± ÙˆØªÙˆØ«ÙŠÙ‚ Ø§Ù„Ù…ÙˆØ§ÙÙ‚Ø©...";

            try {
                const res = await GeneAPI.post('UPDATE_CONSENT', { gaId: gaId, consent: isChecked });
                if (res && res.success) {
                    statusEl.className = "text-[10px] text-emerald-400 mt-2 font-mono";
                    statusEl.innerText = isChecked ? "ØªÙ… ØªÙØ¹ÙŠÙ„ Ø§Ù„Ù…Ø´Ø§Ø±ÙƒØ© Ø¨Ù†Ø¬Ø§Ø­." : "ØªÙ… Ø¥ÙŠÙ‚Ø§Ù Ø§Ù„Ù…Ø´Ø§Ø±ÙƒØ© Ø¨Ù†Ø¬Ø§Ø­.";
                } else {
                    throw new Error("API failed");
                }
            } catch (err) {
                statusEl.className = "text-[10px] text-red-400 mt-2 font-mono";
                statusEl.innerText = "ØªØ¹Ø°Ø± ØªØ­Ø¯ÙŠØ« Ø§Ù„Ø®ÙŠØ§Ø±Ø§Øª. Ø³ÙŠØªÙ… Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© Ù„Ø§Ø­Ù‚Ø§Ù‹ (Offline Mode).";
            }
        }
    </script>
</body>
</html>

```
<!-- slide -->
## 3. The Active Exam Cockpit (`smc.html`)
```html
<!DOCTYPE html>
<html lang="ar" dir="rtl" class="scroll-smooth bg-[#04080F] text-[#F5F5F7]">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SMC Licensing Sprint | MTCâ„¢ Assessment Engine</title>
    
    <!-- STRICT TYPOGRAPHY: Plus Jakarta Sans, Cairo, IBM Plex Mono -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        obsidian: '#04080F',
                        surface: '#090F1D',
                        cyan: { DEFAULT: '#00F2FE' },
                        gold: { DEFAULT: '#B48028' }, /* STRICT Independent Gold */
                        danger: '#EF4444'
                    },
                    fontFamily: {
                        cairo: ['"Cairo"', 'sans-serif'],
                        mono: ['"IBM Plex Mono"', 'monospace'],
                        sans: ['"Plus Jakarta Sans"', 'sans-serif']
                    }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Cairo', sans-serif; background-color: #04080F; }
        .glass-panel { background: rgba(9, 15, 29, 0.85); backdrop-filter: blur(20px); border: 1px solid rgba(0, 242, 254, 0.15); }
        .input-obsidian { width: 100%; background: #04080F; border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 0.875rem 1rem; color: #FFFFFF; font-family: 'IBM Plex Mono', monospace; text-transform: uppercase; text-align: center; font-size: 1.25rem; letter-spacing: 0.1em; transition: all 0.3s ease; }
        .input-obsidian:focus { outline: none; border-color: #00F2FE; box-shadow: 0 0 20px rgba(0, 242, 254, 0.2); }
        .unselectable { -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }
    </style>

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-H1Q67PP2DJ"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-H1Q67PP2DJ');
    </script>

    <!-- EXTERNAL DEPENDENCIES (Proctoring & API logic handled gracefully inline if missing) -->
</head>
<body class="min-h-screen flex flex-col antialiased unselectable">

    <!-- SECURE EXAM HEADER -->
    <header class="sticky top-0 z-50 glass-panel border-t-0 border-x-0">
        <div class="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <span class="w-3 h-3 rounded-full bg-danger animate-pulse" id="recording-indicator"></span>
                <div>
                    <h1 class="text-sm font-bold text-white tracking-widest font-sans uppercase">MTCâ„¢ Exam Engine</h1>
                    <p class="text-[10px] text-gray-400 font-mono">SMC SPRINT â€¢ SESSION ID: <span id="session-id">PENDING</span></p>
                </div>
            </div>
            <div class="text-left font-mono">
                <span class="text-[10px] text-gray-500 uppercase block">Time Remaining</span>
                <span id="timer" class="text-cyan font-bold text-lg">03:00:00</span>
            </div>
        </div>
    </header>

    <main class="flex-grow flex items-center justify-center p-6 w-full max-w-4xl mx-auto">
        
        <!-- STEP 1: IDENTITY GATE -->
        <div id="gate-screen" class="w-full max-w-md glass-panel p-8 rounded-3xl space-y-6 text-center transform transition-all">
            <div class="w-16 h-16 mx-auto rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            
            <h2 class="text-2xl font-bold text-white">Ù…ØµØ§Ø¯Ù‚Ø© Ø§Ù„Ù‡ÙˆÙŠØ© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ©</h2>
            <p class="text-xs text-gray-400 font-sans leading-relaxed">
                Ø³ÙŠØªÙ… ØªØ­Ù…ÙŠÙ„ Ø¨Ù†Ùƒ Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ù…Ø´ÙØ± (242 Ø³Ø¤Ø§Ù„). Ø£Ù†Øª Ø¹Ù„Ù‰ ÙˆØ´Ùƒ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø¥Ù„Ù‰ Ø¨ÙŠØ¦Ø© Ø§Ø®ØªØ¨Ø§Ø± Ø®Ø§Ø¶Ø¹Ø© Ù„Ù„Ø±Ù‚Ø§Ø¨Ø© Ø§Ù„Ø±Ù‚Ù…ÙŠØ© Ø§Ù„ØµØ§Ø±Ù…Ø©. Ø³ÙŠØªÙ… ØªØ³Ø¬ÙŠÙ„ Ø£ÙŠ Ø®Ø±ÙˆØ¬ Ø¹Ù† Ù†Ø§ÙØ°Ø© Ø§Ù„Ø§Ø®ØªØ¨Ø§Ø± (DSII Protocol).
            </p>

            <form onsubmit="startExam(event)" class="space-y-4 pt-4">
                <input type="text" id="gaId" required placeholder="GA-XXXX" class="input-obsidian" dir="ltr">
                <button type="submit" id="btnStart" class="w-full py-4 rounded-xl bg-cyan text-obsidian font-bold font-sans text-sm hover:bg-white transition-all shadow-[0_0_20px_rgba(0,242,254,0.3)]">
                    ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ù‡ÙˆÙŠØ© ÙˆØ¨Ø¯Ø¡ Ø§Ù„Ø¬Ù„Ø³Ø© âž”
                </button>
            </form>
            <p id="loading-bank-msg" class="text-xs font-mono text-cyan hidden">Ø¬Ø§Ø±Ù Ø§Ù„Ø§ØªØµØ§Ù„ Ø¨Ø¨Ù†Ùƒ Ø§Ù„Ø£Ø³Ø¦Ù„Ø©...</p>
        </div>

        <!-- STEP 2: ACTIVE EXAM TERMINAL -->
        <div id="exam-screen" class="hidden w-full glass-panel p-6 sm:p-10 rounded-3xl space-y-8">
            <!-- Progress Bar -->
            <div class="w-full bg-[#04080F] rounded-full h-1.5 mb-6 overflow-hidden relative">
                <div id="progress-bar" class="bg-cyan h-1.5 rounded-full transition-all duration-300" style="width: 0%"></div>
            </div>

            <!-- Question Block -->
            <div class="space-y-4">
                <div class="flex items-center justify-between text-xs font-mono font-bold text-gray-400 border-b border-white/10 pb-3">
                    <span class="text-gold" id="module-tag">[LOADING]</span>
                    <span>Q <span class="text-white" id="current-q-num">1</span> / <span id="total-q-num">--</span></span>
                </div>
                
                <p class="text-lg sm:text-xl text-white leading-relaxed font-semibold py-4" id="question-text">
                    Ø¬Ø§Ø±ÙŠ ÙÙƒ Ø§Ù„ØªØ´ÙÙŠØ±...
                </p>

                <div class="grid grid-cols-1 gap-3 pt-2" id="options-container">
                    <!-- Dynamic Options Injected Here -->
                </div>
            </div>
        </div>

        <!-- STEP 3: SUBMISSION COMPLETED -->
        <div id="complete-screen" class="hidden w-full max-w-md glass-panel p-8 rounded-3xl space-y-6 text-center">
            <div class="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 class="text-2xl font-bold text-white">Ø§ÙƒØªÙ…Ù„ Ø§Ù„ØªÙ‚ÙŠÙŠÙ… Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ</h2>
            <p class="text-xs text-gray-400 leading-relaxed font-sans">
                ØªÙ… ØªØ´ÙÙŠØ± Ø¨ÙŠØ§Ù†Ø§ØªÙƒ ÙˆØ¥Ø±Ø³Ø§Ù„Ù‡Ø§ Ø¨Ø£Ù…Ø§Ù† Ø¥Ù„Ù‰ Ø³Ø¬Ù„ Ø§Ù„ØªØ¯Ù‚ÙŠÙ‚ Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ (EXAM_AUDIT_LOG). ØªÙ…Øª Ù…Ø²Ø§Ù…Ù†Ø© Ø±ØµÙŠØ¯ GP ÙˆØ§Ù„Ø§Ù†ØªÙ‡Ø§ÙƒØ§Øª (DSII).
            </p>
            <div class="bg-[#04080F] p-4 rounded-xl border border-white/5 space-y-2 mt-4 text-xs font-mono text-left" dir="ltr">
                <div class="flex justify-between"><span class="text-gray-500">Candidate:</span><span class="text-cyan font-bold" id="res-ga">GA-XXXX</span></div>
                <div class="flex justify-between"><span class="text-gray-500">Status:</span><span class="text-gold font-bold">LOCKED & AUDITED</span></div>
                <div class="flex justify-between"><span class="text-gray-500">DSII Alert:</span><span class="text-white" id="res-dsii">0</span></div>
            </div>
        </div>
    </main>

    <footer class="py-6 text-center text-[10px] text-gray-600 font-mono tracking-widest border-t border-white/5">
        Â© 2026 GEMIINI ACADEMY. ALL RIGHTS RESERVED. SUDAGENE CONSORTIUM NETWORK.
    </footer>

    <!-- TRUE ENGINE LOGIC (NO MOCKUPS) -->
    <script>
        const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxAVR42yEQlQMkOBhlcka622FNbSD_3_pIJrNL1bktLyN8TqIYGC2P5cGpUqeZcoql8/exec";
        
        let candidateGaId = "";
        let examBank = [];
        let currentQuestionIndex = 0;
        let correctAnswers = 0; // The True ADA Variable
        let isExamActive = false;
        let dsiiViolations = 0; // Digital Supervision & Integrity Index

        // 1. PROCTOR ENGINE (Inline fail-safe if external script drops)
        window.addEventListener('blur', () => {
            if(isExamActive) {
                dsiiViolations++;
                console.warn(`[DSII] Tab focus lost. Total Violations: ${dsiiViolations}`);
                document.body.style.backgroundColor = '#450a0a';
                setTimeout(() => document.body.style.backgroundColor = '#04080F', 500);
            }
        });

        // 2. FETCH THE GENUINE QUESTION BANK
        async function loadQuizBank() {
            const btnStart = document.getElementById('btnStart');
            const msg = document.getElementById('loading-bank-msg');
            
            try {
                msg.classList.remove('hidden');
                btnStart.disabled = true;
                
                const response = await fetch('data/smc_mock_bank.json');
                if (!response.ok) throw new Error("JSON fetch failed");
                examBank = await response.json();
                
                document.getElementById('total-q-num').innerText = examBank.length;
                msg.classList.add('hidden');
                btnStart.disabled = false;
            } catch (error) {
                console.error("Bank load error:", error);
                msg.innerText = "Ø®Ø·Ø£ ÙÙŠ ØªØ­Ù…ÙŠÙ„ Ø¨Ù†Ùƒ Ø§Ù„Ø£Ø³Ø¦Ù„Ø©. ØªØ£ÙƒØ¯ Ù…Ù† ÙˆØ¬ÙˆØ¯ Ù…Ù„Ù data/smc_mock_bank.json.";
                msg.classList.replace('text-cyan', 'text-danger');
            }
        }

        // Init on load
        document.addEventListener('DOMContentLoaded', loadQuizBank);

        // 3. EXAM FLOW
        function startExam(e) {
            e.preventDefault();
            if(examBank.length === 0) {
                alert("Ø¨Ù†Ùƒ Ø§Ù„Ø£Ø³Ø¦Ù„Ø© ØºÙŠØ± Ù…ØªØ§Ø­ Ø£Ùˆ Ø¬Ø§Ø±ÙŠ ØªØ­Ù…ÙŠÙ„Ù‡.");
                return;
            }

            const input = document.getElementById('gaId').value.trim().toUpperCase();
            if(!input.startsWith('GA-')) {
                alert("ÙŠØ¬Ø¨ Ø£Ù† ÙŠØ¨Ø¯Ø£ Ø§Ù„Ù…Ø¹Ø±Ù Ø¨Ù€ GA- (Ù…Ø«Ø§Ù„: GA-1001)");
                return;
            }
            
            candidateGaId = input;
            document.getElementById('session-id').innerText = `${candidateGaId}-${Date.now().toString().slice(-6)}`;
            
            document.getElementById('gate-screen').classList.add('hidden');
            document.getElementById('exam-screen').classList.remove('hidden');
            isExamActive = true;
            
            startTimer();
            renderQuestion(0);
        }

        function renderQuestion(index) {
            const q = examBank[index];
            if (!q) return;

            document.getElementById('current-q-num').innerText = index + 1;
            document.getElementById('progress-bar').style.width = `${(index / examBank.length) * 100}%`;
            document.getElementById('module-tag').innerText = q.module || `[Q${String(index+1).padStart(3,'0')}] SMC BANK`;
            document.getElementById('question-text').innerText = q.text;

            const optsContainer = document.getElementById('options-container');
            optsContainer.innerHTML = '';
            
            q.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = "text-right p-4 rounded-xl bg-[#04080F] border border-white/10 hover:border-cyan text-sm text-gray-300 hover:text-white transition-all w-full";
                btn.innerText = opt;
                // Passes both the selected index AND the real correct index from the JSON
                btn.onclick = () => recordAnswer(idx, q.correct);
                optsContainer.appendChild(btn);
            });
        }

        function recordAnswer(selectedIndex, correctIndex) {
            // REAL EVALUATION
            if(selectedIndex === correctIndex) {
                correctAnswers++;
            }
            
            currentQuestionIndex++;
            
            if(currentQuestionIndex >= examBank.length) {
                submitExamPayload();
            } else {
                renderQuestion(currentQuestionIndex);
            }
        }

        // 4. THE PAYLOAD DISPATCHER (Strict Contract with Code.gs v3.7)
        async function submitExamPayload() {
            isExamActive = false; // Halt DSII tracking
            
            const totalQs = examBank.length;
            // V2.0 GP Ledger Math: +10 per correct, +2 per incorrect
            const calculatedGp = (correctAnswers * 10) + ((totalQs - correctAnswers) * 2);

            document.getElementById('exam-screen').classList.add('hidden');
            document.getElementById('gate-screen').classList.remove('hidden');
            const btnStart = document.getElementById('btnStart');
            btnStart.innerText = "Ø¬Ø§Ø±Ù ØªØ´ÙÙŠØ± Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª ÙˆØ¥Ø±Ø³Ø§Ù„Ù‡Ø§ Ø¥Ù„Ù‰ Ø³Ø¬Ù„ Ø§Ù„ØªØ¯Ù‚ÙŠÙ‚ Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯...";
            btnStart.disabled = true;

            // THE EXACT PAYLOAD CODE.GS V3.7 REQUIRES
            const payload = {
                action: "SUBMIT_EXAM_SPRINT",
                gaId: candidateGaId,
                score: correctAnswers,
                total: totalQs,
                totalGpEarned: calculatedGp,
                proctorViolations: dsiiViolations,
                module: "SMC_SPRINT_AUG29",
                timestamp: new Date().toISOString()
            };

            try {
                const res = await fetch(APPS_SCRIPT_URL, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                    body: JSON.stringify(payload)
                });
                
                if(!res.ok) throw new Error("HTTP Dispatch Failed");
                const data = await res.json();
                
                // Show completion
                document.getElementById('gate-screen').classList.add('hidden');
                document.getElementById('complete-screen').classList.remove('hidden');
                document.getElementById('res-ga').innerText = candidateGaId;
                document.getElementById('res-dsii').innerText = dsiiViolations;
                document.getElementById('recording-indicator').classList.replace('bg-danger', 'bg-gray-600');

            } catch (err) {
                console.error("Payload delivery failed:", err);
                // ACTUALLY SAVE LOCALLY
                const offlineBackupKey = `OFFLINE_EXAM_${candidateGaId}_${Date.now()}`;
                localStorage.setItem(offlineBackupKey, JSON.stringify(payload));
                alert("Ø§Ù†Ù‚Ø·Ø¹ Ø§Ù„Ø§ØªØµØ§Ù„ Ø¨Ø§Ù„Ø®Ø§Ø¯Ù…. ØªÙ… Ø­ÙØ¸ Ø¥Ø¬Ø§Ø¨Ø§ØªÙƒ ÙˆÙ†ØªÙŠØ¬ØªÙƒ Ù…Ø­Ù„ÙŠØ§Ù‹ ÙÙŠ Ø°Ø§ÙƒØ±Ø© Ø¬Ù‡Ø§Ø²Ùƒ. ÙŠÙØ±Ø¬Ù‰ Ø§Ù„ØªÙ‚Ø§Ø· ØµÙˆØ±Ø© Ù„Ù‡Ø°Ù‡ Ø§Ù„Ø´Ø§Ø´Ø© ÙˆØ§Ù„ØªÙˆØ§ØµÙ„ Ù…Ø¹ Ø§Ù„Ø¯Ø¹Ù… Ø§Ù„ÙÙ†ÙŠ: " + offlineBackupKey);
            }
        }

        // Timer Logic (3 Hours = 10800 Seconds)
        function startTimer() {
            let duration = 3 * 60 * 60; 
            const display = document.getElementById('timer');
            const timer = setInterval(() => {
                let h = Math.floor(duration / 3600);
                let m = Math.floor((duration % 3600) / 60);
                let s = Math.floor(duration % 60);
                display.innerText = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
                
                if (--duration < 0) {
                    clearInterval(timer);
                    submitExamPayload();
                }
            }, 1000);
        }
    </script>
</body>
</html>

```
<!-- slide -->
## 4. Independent Telemetry & SudaPass Engine (`google_apps_script\Code.gs`)
```javascript
/**
 * ============================================================================
 * GemIInI Independent Backend & Clinical Certification Gateway
 * Code.gs v3.7 FINAL (Cross-Desk Unified)
 * 
 * CHANGES FROM v3.6:
 *   - FIX: Registration returns PENDING_REVIEW (not ACTIVE)
 *   - FIX: BLS registration 'university' undefined variable bug
 *   - CONFIRMED: 3,000 EGP flat BLS fee (no member/non-member split)
 *   - Arabic response messages for pending review flow
 * 
 * TARGET: GemIInI Master Registry 2026
 * TABS:   MASTER_AUTH, PAYMENT_AUDIT_LOG, TELEMETRY, BLS_ROSTER,
 *         FEEDBACK_LOG, QUEUE_FALLBACK
 * ============================================================================
 */

const CONFIG = {
  SHEET_AUTH: 'MASTER_AUTH',
  SHEET_PAYMENTS: 'PAYMENT_AUDIT_LOG',
  SHEET_TELEMETRY: 'TELEMETRY',
  SHEET_ROSTER: 'BLS_ROSTER',
  SHEET_FEEDBACK: 'FEEDBACK_LOG',
  SHEET_QUEUE: 'QUEUE_FALLBACK',
  SHEET_CONSENT: 'B2B_CONSENT',
  SHEET_EXAM: 'EXAM_AUDIT_LOG',
  LOCK_TIMEOUT_MS: 20000,
  COHORTS: [
    { id: 'BLS-CAIRO-AUG28', date: '2026-08-28', maxPaid: 12, maxProvisional: 4, fee: 3000, currency: 'EGP' },
    { id: 'BLS-CAIRO-SEP04', date: '2026-09-04', maxPaid: 12, maxProvisional: 4, fee: 3000, currency: 'EGP' },
    { id: 'BLS-CAIRO-SEP11', date: '2026-09-11', maxPaid: 12, maxProvisional: 4, fee: 3000, currency: 'EGP' }
  ]
};

function getSecretSalt() {
  const salt = PropertiesService.getScriptProperties().getProperty('SECRET_SALT');
  if (!salt) {
    throw new Error('CRITICAL_SECURITY_HALT: SECRET_SALT Script Property is not configured. SudaPass generation aborted to prevent forgery.');
  }
  return salt;
}

function getActiveCohort() {
  const now = new Date();
  for (let i = 0; i < CONFIG.COHORTS.length; i++) {
    const cohortDate = new Date(CONFIG.COHORTS[i].date + 'T23:59:59+03:00');
    if (now <= cohortDate) return CONFIG.COHORTS[i];
  }
  return CONFIG.COHORTS[CONFIG.COHORTS.length - 1];
}

// ============================================================================
// PUBLIC READ API (doGet)
// ============================================================================

function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = String(params.action || 'lookup').toUpperCase();
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'LOOKUP' || action === 'VERIFY') {
      return jsonResponse(handleLookup({ gaId: params.id || params.gaId }, ss));
    }
    if (action === 'LEADERBOARD') {
      return jsonResponse(handleCachedLeaderboard(ss));
    }
    if (action === 'COHORT_STATUS') {
      return jsonResponse({ success: true, activeCohort: getActiveCohort() });
    }
    if (action === 'UNIV_STATS') {
      return jsonResponse(handleUniversityStats(ss));
    }
    return jsonResponse({ success: true, message: 'GemIInI Independent Gateway v3.7 Active' });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

// ============================================================================
// TRANSACTIONAL MUTATING API (doPost)
// ============================================================================

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, error: 'EMPTY_PAYLOAD' }, 400);
    }
    const payload = JSON.parse(e.postData.contents);
    const action = String(payload.action || '').toUpperCase();
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    switch (action) {
      case 'LOOKUP':
      case 'VERIFY':
        return jsonResponse(handleLookup(payload, ss));
      case 'REGISTER_USER':
      case 'REGISTER':
      case 'PORTAL_INTAKE':
        return jsonResponse(handleRegisterUser(payload, ss));
      case 'BLS_REGISTER':
      case 'SUBMIT_BLS':
        return jsonResponse(handleBlsRegister(payload, ss));
      case 'LOG_TELEMETRY':
      case 'LOG_CLINICAL_ATTEMPT':
        return jsonResponse(handleLogTelemetry(payload, ss));
      case 'SUBMIT_FEEDBACK':
      case 'FEEDBACK':
        return jsonResponse(handleFeedback(payload, ss));
      case 'UPDATE_CONSENT':
        return jsonResponse(handleUpdateConsent(payload, ss));
      case 'SUBMIT_EXAM_SPRINT':
        return jsonResponse(handleSubmitExamSprint(payload, ss));
      default:
        return jsonResponse({ success: false, error: 'INVALID_ACTION: ' + action }, 400);
    }
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

// ============================================================================
// 1. LOOKUP / VERIFY (Zero hardcoded overrides, cached)
// ============================================================================

function handleLookup(payload, ss) {
  const gaId = String(payload.gaId || payload.id || '').trim().toUpperCase();
  if (!gaId) return { success: false, error: 'GA_ID_REQUIRED' };

  const cache = CacheService.getScriptCache();
  const cachedUser = cache.get('USER_' + gaId);
  if (cachedUser) {
    const parsed = JSON.parse(cachedUser);
    return { success: true, verified: parsed.status !== 'PENDING_REVIEW', user: parsed, cached: true };
  }

  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const data = authSheet.getDataRange().getValues();
  const headers = data[0];
  const idIdx = Math.max(0, headers.indexOf('GA_ID'));
  const nameIdx = headers.indexOf('LEGAL_NAME') !== -1 ? headers.indexOf('LEGAL_NAME') : 1;
  const univIdx = headers.indexOf('CANONICAL_UNIVERSITY') !== -1 ? headers.indexOf('CANONICAL_UNIVERSITY') : (headers.indexOf('UNIVERSITY') !== -1 ? headers.indexOf('UNIVERSITY') : 4);
  const stageIdx = headers.indexOf('CAREER_STAGE') !== -1 ? headers.indexOf('CAREER_STAGE') : 7;
  const statusIdx = headers.indexOf('STATUS') !== -1 ? headers.indexOf('STATUS') : 8;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idIdx]).trim().toUpperCase() === gaId) {
      const telemetry = getTelemetryForUser(ss, gaId);
      const status = String(data[i][statusIdx]).toUpperCase();
      const isAccredited = ['ACTIVE', 'VERIFIED', 'ACCREDITED'].includes(status);
      const userProfile = {
        gaId: data[i][idIdx], legalName: data[i][nameIdx], university: data[i][univIdx],
        careerStage: data[i][stageIdx], status: data[i][statusIdx], telemetry: telemetry
      };
      cache.put('USER_' + gaId, JSON.stringify(userProfile), 600);
      return { success: true, verified: isAccredited, user: userProfile };
    }
  }
  return { success: false, error: 'USER_NOT_FOUND', verified: false };
}

// ============================================================================
// 2. REGISTER USER (PENDING_REVIEW â€” admin must approve)
// ============================================================================

function handleRegisterUser(payload, ss) {
  const fullName = String(payload.fullName || payload.name || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const phone = String(payload.phone || payload.whatsapp || '').trim();
  const university = String(payload.university || payload.faculty || 'Unspecified').trim();
  const careerStage = String(payload.careerStage || payload.stage || 'Medical Graduate').trim();

  if (!fullName || !email) return { success: false, error: 'FULL_NAME_AND_EMAIL_REQUIRED' };

  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const authData = authSheet.getDataRange().getValues();

  // Check for existing user by email (prevent duplicates)
  for (let i = 1; i < authData.length; i++) {
    if (String(authData[i][2]).trim().toLowerCase() === email) {
      return {
        success: true,
        alreadyRegistered: true,
        gaId: authData[i][0],
        message: 'ØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ Ø­Ø³Ø§Ø¨Ùƒ. Ø±Ù‚Ù… Ø§Ù„ØªØ¹Ø±ÙŠÙ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ: ' + authData[i][0]
      };
    }
  }

  const gaId = mintNextGaId(authSheet);
  const nowIso = new Date().toISOString();
  const sudaPassHash = generateSudaPassHash(gaId, nowIso);

  // STATUS = PENDING_REVIEW (not ACTIVE)
  // Admin (GA-000 or GA-011) must change to VERIFIED/ACCREDITED after review
  authSheet.appendRow([
    gaId, fullName, email, phone, university,
    '', '', careerStage, 'PENDING_REVIEW', sudaPassHash, nowIso
  ]);

  // Initialize telemetry with 25 GP Explorer baseline
  getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY).appendRow([
    gaId, 25, 0, 0, 0, nowIso
  ]);

  CacheService.getScriptCache().remove('PUBLIC_LEADERBOARD');

  return {
    success: true,
    gaId: gaId,
    legalName: fullName,
    sudaPassHash: sudaPassHash,
    gpAwarded: 25,
    status: 'PENDING_REVIEW',
    message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨Ùƒ Ø¨Ù†Ø¬Ø§Ø­. Ø±Ù‚Ù… Ø§Ù„ØªØ¹Ø±ÙŠÙ Ø§Ù„Ù…Ø¨Ø¯Ø¦ÙŠ: ' + gaId + '. Ø³ÙŠØªÙ… Ù…Ø±Ø§Ø¬Ø¹Ø© Ø¨ÙŠØ§Ù†Ø§ØªÙƒ Ø®Ù„Ø§Ù„ 24 Ø³Ø§Ø¹Ø© ÙˆØ¥Ø´Ø¹Ø§Ø±Ùƒ Ø¹Ø¨Ø± Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨.'
  };
}

// ============================================================================
// 3. BLS WORKSHOP REGISTRATION (3,000 EGP flat, multi-cohort)
// ============================================================================

function handleBlsRegister(payload, ss) {
  let gaId = String(payload.gaId || payload.ga_id || '').trim().toUpperCase();
  const fullName = String(payload.fullName || payload.full_name || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const phone = String(payload.phone || payload.phone_whatsapp || '').trim();
  const txRef = String(payload.txRef || payload.transaction_ref || '').trim().toUpperCase();
  const paymentChoice = String(payload.paymentChoice || (txRef ? 'pay_now' : 'pay_later')).trim().toLowerCase();
  const paymentMethod = String(payload.paymentMethod || 'VODAFONE_CASH_EG').trim();
  const diagnosticBonus = Number(payload.diagnosticBonus) || 0;

  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const activeCohort = getActiveCohort();

  // If user doesn't exist, register them first
  if (!gaId || !userExists(authSheet, gaId)) {
    if (fullName && email) {
      gaId = mintNextGaId(authSheet);
      const nowIso = new Date().toISOString();
      const hash = generateSudaPassHash(gaId, nowIso);

      // FIX: 'university' variable was undefined â€” using literal string
      authSheet.appendRow([
        gaId, fullName, email, phone, 'Candidate Institution',
        '', '', 'BLS Candidate', 'PENDING_REVIEW', hash, nowIso
      ]);

      const startingGp = 25 + diagnosticBonus;
      getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY).appendRow([
        gaId, startingGp, 0, 0, 0, nowIso
      ]);
    } else {
      return { success: false, error: 'NAME_AND_EMAIL_REQUIRED' };
    }
  }

  // Check seat capacity for active cohort
  const rosterSheet = getOrCreateSheet(ss, CONFIG.SHEET_ROSTER);
  const rosterData = rosterSheet.getDataRange().getValues();
  let paidCount = 0;
  let provisionalCount = 0;
  for (let i = 1; i < rosterData.length; i++) {
    if (String(rosterData[i][1]) === activeCohort.id) {
      const st = String(rosterData[i][6]);
      if (st.includes('CONFIRMED')) paidCount++;
      if (st.includes('PROVISIONAL')) provisionalCount++;
    }
  }

  const isPaid = paymentChoice === 'pay_now' && txRef;
  const totalSeats = activeCohort.maxPaid + activeCohort.maxProvisional;
  const isOverflow = (isPaid && paidCount >= activeCohort.maxPaid) ||
                     (!isPaid && (paidCount + provisionalCount) >= totalSeats);

  const timestamp = new Date().toISOString();
  const paymentSheet = getOrCreateSheet(ss, CONFIG.SHEET_PAYMENTS);

  // Overflow â†’ Waitlist
  if (isOverflow) {
    paymentSheet.appendRow([
      timestamp, gaId, txRef || 'OVERFLOW_WAITLIST', paymentMethod,
      0, activeCohort.currency, 'WAITLIST', activeCohort.id
    ]);
    return {
      success: true, gaId: gaId, waitlist: true, cohortDate: activeCohort.date,
      message: 'Ø§Ù„Ø¯ÙØ¹Ø© Ø§Ù„Ø­Ø§Ù„ÙŠØ© Ù…ÙƒØªÙ…Ù„Ø©. ØªÙ… ØªØ³Ø¬ÙŠÙ„Ùƒ ÙÙŠ Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø§Ù†ØªØ¸Ø§Ø± Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø© Ù„Ù„Ø¯ÙØ¹Ø© Ø§Ù„ØªØ§Ù„ÙŠØ© ØªÙ„Ù‚Ø§Ø¦ÙŠØ§Ù‹.'
    };
  }

  // Duplicate transaction check
  if (txRef && isDuplicateTransaction(paymentSheet, txRef)) {
    return { success: false, error: 'DUPLICATE_TRANSACTION_REFERENCE' };
  }

  // 3,000 EGP flat fee (confirmed â€” no member/non-member split)
  const fee = activeCohort.fee;
  const paymentStatus = isPaid ? 'PENDING_VERIFICATION' : 'PROVISIONAL_HOLD';
  const rosterStatus = isPaid ? 'CONFIRMED_PENDING_PAYMENT_CLEAR' : 'PROVISIONAL_HELD_24H';

  paymentSheet.appendRow([
    timestamp, gaId, txRef || 'DEFERRED_PAY_LATER', paymentMethod,
    isPaid ? fee : 0, activeCohort.currency, paymentStatus, activeCohort.id
  ]);

  rosterSheet.appendRow([
    gaId, activeCohort.id, activeCohort.date,
    'Cairo Simulation Center (Amanirena Hub)',
    isPaid ? fee : 0, txRef || 'HOLD', rosterStatus
  ]);

  return {
    success: true, gaId: gaId, confirmed: isPaid,
    seatNumber: paidCount + 1,
    cohortDate: activeCohort.date,
    courseFee: fee, currency: activeCohort.currency,
    earnedBonus: diagnosticBonus,
    message: isPaid
      ? 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„ØªØ­ÙˆÙŠÙ„. Ù…Ù‚Ø¹Ø¯Ùƒ Ù…Ø­Ø¬ÙˆØ² Ù‚ÙŠØ¯ Ø§Ù„ØªØ¯Ù‚ÙŠÙ‚ Ø§Ù„ÙÙˆØ±ÙŠ.'
      : 'ØªÙ… ØªØ«Ø¨ÙŠØª Ø§Ù„ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠÙƒ Ø§Ù„Ù…Ø¨Ø¯Ø¦ÙŠ Ù„Ù…Ø¯Ø© 24 Ø³Ø§Ø¹Ø©. ÙŠØ±Ø¬Ù‰ Ø¥ØªÙ…Ø§Ù… Ø§Ù„ØªØ­ÙˆÙŠÙ„ Ø¹Ø¨Ø± ÙÙˆØ¯Ø§ÙÙˆÙ† ÙƒØ§Ø´ Ø£Ùˆ Ø¥Ù†Ø³ØªØ§Ø¨Ø§ÙŠ Ù„ØªØ«Ø¨ÙŠØª Ø§Ù„Ù…Ù‚Ø¹Ø¯.'
  };
}

// ============================================================================
// 4. TELEMETRY LOGGER (GP, CCR, Accuracy, Streak)
// ============================================================================

function handleLogTelemetry(payload, ss) {
  const gaId = String(payload.gaId || '').trim().toUpperCase();
  if (!gaId) return { success: false, error: 'GA_ID_REQUIRED' };

  const deltaGp = Math.min(Math.max(Number(payload.deltaGp || payload.gp || 0), -50), 100);
  const ccr = Math.min(Math.max(Number(payload.ccr || 0), 0), 100);
  const accuracy = Math.min(Math.max(Number(payload.accuracy || 0), 0), 100);

  const sheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  const data = sheet.getDataRange().getValues();
  const timestamp = new Date().toISOString();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === gaId) {
      const currentGp = Number(data[i][1]) || 0;
      const newGp = Math.max(0, currentGp + deltaGp);
      const currentStreak = Number(data[i][4]) || 0;
      const newStreak = deltaGp > 0 ? currentStreak + 1 : currentStreak;
      sheet.getRange(i + 1, 2).setValue(newGp);
      if (ccr > 0) sheet.getRange(i + 1, 3).setValue(ccr);
      if (accuracy > 0) sheet.getRange(i + 1, 4).setValue(accuracy);
      sheet.getRange(i + 1, 5).setValue(newStreak);
      sheet.getRange(i + 1, 6).setValue(timestamp);
      CacheService.getScriptCache().remove('USER_' + gaId);
      CacheService.getScriptCache().remove('PUBLIC_LEADERBOARD');
      return { success: true, gaId: gaId, gp: newGp, streak: newStreak, updated: true };
    }
  }

  sheet.appendRow([gaId, Math.max(25, 25 + deltaGp), ccr, accuracy, 1, timestamp]);
  return { success: true, gaId: gaId, gp: 25 + deltaGp, streak: 1, created: true };
}

// ============================================================================
// 5. FEEDBACK COLLECTION (GP reward: 25 base, 75 with referral)
// ============================================================================

function handleFeedback(payload, ss) {
  const gaId = String(payload.gaId || '').trim().toUpperCase();
  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  if (!gaId || !userExists(authSheet, gaId)) {
    return { success: false, error: 'UNAUTHORIZED_GA_ID' };
  }

  const feedbackSheet = getOrCreateSheet(ss, CONFIG.SHEET_FEEDBACK);
  const fbData = feedbackSheet.getDataRange().getValues();
  for (let i = 1; i < fbData.length; i++) {
    if (String(fbData[i][1]).trim().toUpperCase() === gaId) {
      return { success: false, error: 'SURVEY_ALREADY_SUBMITTED' };
    }
  }

  const timestamp = new Date().toISOString();
  const email = String(payload.email || '').trim().toLowerCase();
  const phone = String(payload.phone || '').trim();
  const wtpCurr = String(payload.wtpCurrency || 'SDG').toUpperCase();
  const wtp400 = Number(payload.wtp400) || 0;
  const wtp800 = Number(payload.wtp800) || 0;
  const wtp1200 = Number(payload.wtp1200) || 0;
  const modules = Array.isArray(payload.targetModules) ? payload.targetModules.join('; ') : String(payload.targetModules || '');
  const pathways = Array.isArray(payload.targetPathways) ? payload.targetPathways.join('; ') : String(payload.targetPathways || '');
  const csat = Number(payload.csatScore) || 5;
  const rating = Number(payload.sudaPassRating) || 5;
  const referral = String(payload.peerReferral || '').trim();
  const gpAward = referral ? 75 : 25;

  feedbackSheet.appendRow([
    timestamp, gaId, email, phone, wtpCurr, wtp400, wtp800, wtp1200,
    modules, pathways, csat, rating, referral, gpAward
  ]);

  handleLogTelemetry({ gaId: gaId, deltaGp: gpAward }, ss);

  return { success: true, gaId: gaId, gpAwarded: gpAward, message: 'Feedback archived and GP points credited.' };
}

// ============================================================================
// 6. B2B CONSENT & PRIVACY SHIELD
// ============================================================================

function handleUpdateConsent(payload, ss) {
  const gaId = String(payload.gaId || '').trim().toUpperCase();
  if (!gaId) return { success: false, error: 'GA_ID_REQUIRED' };
  
  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  if (!userExists(authSheet, gaId)) {
    return { success: false, error: 'UNAUTHORIZED_GA_ID' };
  }

  const consentSheet = getOrCreateSheet(ss, CONFIG.SHEET_CONSENT);
  const data = consentSheet.getDataRange().getValues();
  const timestamp = new Date().toISOString();
  const consentGiven = payload.consent === true || payload.consent === 'true';
  const cryptoHash = generateSudaPassHash(gaId, timestamp + (consentGiven ? "GRANTED" : "REVOKED"));
  
  // Update if exists
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim().toUpperCase() === gaId) {
      consentSheet.getRange(i + 1, 3).setValue(consentGiven ? 'GRANTED' : 'REVOKED');
      consentSheet.getRange(i + 1, 4).setValue(timestamp);
      consentSheet.getRange(i + 1, 5).setValue(cryptoHash);
      return { success: true, gaId: gaId, consentStatus: consentGiven ? 'GRANTED' : 'REVOKED' };
    }
  }

  // Insert if not exists
  consentSheet.appendRow([timestamp, gaId, consentGiven ? 'GRANTED' : 'REVOKED', timestamp, cryptoHash]);
  return { success: true, gaId: gaId, consentStatus: consentGiven ? 'GRANTED' : 'REVOKED' };
}

// ============================================================================
// 7. EXAM SPRINT AUDIT LOGGING
// ============================================================================

function handleSubmitExamSprint(payload, ss) {
  const gaId = String(payload.gaId || '').trim().toUpperCase();
  if (!gaId) return { success: false, error: 'GA_ID_REQUIRED' };

  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  if (!userExists(authSheet, gaId)) {
    return { success: false, error: 'UNAUTHORIZED_GA_ID' };
  }

  const score = Number(payload.score) || 0;
  const total = Number(payload.total) || 242;
  const claimedGp = Number(payload.totalGpEarned) || 0;
  const violations = Number(payload.proctorViolations) || 0;
  const timestamp = new Date().toISOString();

  // Validate GP mathematically (10 per correct, 2 per incorrect attempt)
  const maxPossibleGp = total * 10;
  const computedGp = (score * 10) + ((total - score) * 2);
  
  // Safe bounded GP assignment (protect against forgery)
  const safeGpAward = Math.min(claimedGp, computedGp, maxPossibleGp);

  const examSheet = getOrCreateSheet(ss, CONFIG.SHEET_EXAM);
  examSheet.appendRow([timestamp, gaId, score, total, safeGpAward, violations]);

  // Credit telemetry
  handleLogTelemetry({
    gaId: gaId, 
    deltaGp: safeGpAward,
    accuracy: Math.round((score / total) * 100),
    ccr: 100 // completed the sprint
  }, ss);

  return { 
    success: true, 
    gaId: gaId, 
    validatedGp: safeGpAward, 
    proctorViolations: violations 
  };
}

// ============================================================================
// 8. LEADERBOARD (Cached, excludes PROV/TR junk IDs)
// ============================================================================

function handleCachedLeaderboard(ss) {
  const cache = CacheService.getScriptCache();
  const cached = cache.get('PUBLIC_LEADERBOARD');
  if (cached) return JSON.parse(cached);

  const authData = getOrCreateSheet(ss, CONFIG.SHEET_AUTH).getDataRange().getValues();
  const telData = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY).getDataRange().getValues();

  const telMap = {};
  for (let i = 1; i < telData.length; i++) {
    telMap[String(telData[i][0]).toUpperCase()] = {
      gp: Number(telData[i][1]) || 0, ccr: Number(telData[i][2]) || 0,
      accuracy: Number(telData[i][3]) || 0, streak: Number(telData[i][4]) || 0
    };
  }

  const list = [];
  for (let i = 1; i < authData.length; i++) {
    const id = String(authData[i][0]).toUpperCase();
    if (!id) continue;
    if (id.includes('PROV') || id.includes('TR')) continue;

    const t = telMap[id] || { gp: 0, ccr: 0, accuracy: 0, streak: 0 };
    const sRank = t.gp + (t.ccr * 10) + (t.accuracy * 5) + (t.streak * 20);
    list.push({
      id: id, name: String(authData[i][1]),
      university: String(authData[i][4]),
      careerStage: String(authData[i][7] || authData[i][5]),
      gp: t.gp, ccr: t.ccr, accuracy: t.accuracy,
      streak: t.streak, sRank: Math.round(sRank)
    });
  }

  list.sort((a, b) => b.sRank - a.sRank);
  const result = { success: true, count: list.length, items: list.slice(0, 50) };
  cache.put('PUBLIC_LEADERBOARD', JSON.stringify(result), 300);
  return result;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function mintNextGaId(authSheet) {
  const data = authSheet.getDataRange().getValues();
  let maxId = 1000;
  for (let i = 1; i < data.length; i++) {
    const raw = String(data[i][0] || '').trim();
    const match = raw.match(/^GA-(\d+)$/i);
    if (match && match[1]) {
      const n = parseInt(match[1], 10);
      if (n > maxId) maxId = n;
    }
  }
  return 'GA-' + (maxId + 1);
}

function generateSudaPassHash(gaId, timestamp) {
  const raw = gaId + '|' + timestamp + '|' + getSecretSalt();
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
  return digest.map(b => (b < 0 ? b + 256 : b).toString(16).padStart(2, '0')).join('');
}

function isDuplicateTransaction(paymentSheet, txRef) {
  if (!txRef) return false;
  const data = paymentSheet.getDataRange().getValues();
  const norm = String(txRef).trim().toUpperCase();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][2]).trim().toUpperCase() === norm) return true;
  }
  return false;
}

function userExists(authSheet, gaId) {
  const data = authSheet.getDataRange().getValues();
  const norm = String(gaId).trim().toUpperCase();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === norm) return true;
  }
  return false;
}

function getTelemetryForUser(ss, gaId) {
  const sheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  const data = sheet.getDataRange().getValues();
  const norm = String(gaId).trim().toUpperCase();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === norm) {
      return {
        gp: Number(data[i][1]) || 0, ccr: Number(data[i][2]) || 0,
        accuracy: Number(data[i][3]) || 0, streak: Number(data[i][4]) || 0,
        lastUpdated: data[i][5] || null
      };
    }
  }
  return { gp: 0, ccr: 0, accuracy: 0, streak: 0, lastUpdated: null };
}

function getOrCreateSheet(ss, sheetName) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (sheetName === CONFIG.SHEET_AUTH) {
      sheet.appendRow(['GA_ID', 'LEGAL_NAME', 'EMAIL', 'PHONE', 'CANONICAL_UNIVERSITY', 'HOSPITAL_AFFILIATION', 'LOCATION', 'CAREER_STAGE', 'STATUS', 'SUDAPASS_HASH', 'CREATED_AT']);
    } else if (sheetName === CONFIG.SHEET_PAYMENTS) {
      sheet.appendRow(['TIMESTAMP', 'GA_ID', 'TX_REF', 'PAYMENT_METHOD', 'AMOUNT', 'CURRENCY', 'STATUS', 'COURSE_CODE']);
    } else if (sheetName === CONFIG.SHEET_TELEMETRY) {
      sheet.appendRow(['GA_ID', 'GP', 'CCR_PERCENT', 'ACCURACY_PERCENT', 'STREAK_DAYS', 'LAST_UPDATED']);
    } else if (sheetName === CONFIG.SHEET_ROSTER) {
      sheet.appendRow(['GA_ID', 'COURSE_NAME', 'DATE', 'VENUE', 'FEE_PAID', 'TX_REF', 'STATUS']);
    } else if (sheetName === CONFIG.SHEET_FEEDBACK) {
      sheet.appendRow(['TIMESTAMP', 'GA_ID', 'EMAIL', 'PHONE', 'WTP_CURRENCY', 'WTP_400', 'WTP_800', 'WTP_1200', 'TARGET_MODULES', 'TARGET_PATHWAYS', 'ONBOARDING_CSAT', 'SUDAPASS_RATING', 'PEER_REFERRAL', 'GP_AWARDED']);
    } else if (sheetName === CONFIG.SHEET_QUEUE) {
      sheet.appendRow(['TIMESTAMP', 'GA_ID', 'ACTION', 'PAYLOAD_RAW', 'STATUS', 'RESOLVED_AT']);
    } else if (sheetName === CONFIG.SHEET_CONSENT) {
      sheet.appendRow(['INITIAL_TIMESTAMP', 'GA_ID', 'STATUS', 'LAST_UPDATED', 'CRYPTOGRAPHIC_SIGNATURE']);
    } else if (sheetName === CONFIG.SHEET_EXAM) {
      sheet.appendRow(['TIMESTAMP', 'GA_ID', 'SCORE', 'TOTAL_QUESTIONS', 'GP_AWARDED', 'PROCTOR_VIOLATIONS']);
    }
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse(obj, status) {
  const output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * ============================================================================
 * STRATEGIC PRESENTATION LAYER: NATIONAL WORKFORCE TELEMETRY EXPORTER
 * ============================================================================
 * 
 * PURPOSE: Extracts raw exam sprint logs, maps them to canonical faculty metadata,
 *          and structures a clean report for Ministry review.
 * ACCESS: Restricted to Systems Office (GA-000 / GA-011).
 */

function exportMinisterialTelemetry() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const examSheet = ss.getSheetByName('EXAM_AUDIT_LOG');
  const authSheet = ss.getSheetByName('MASTER_AUTH');
  
  if (!examSheet || !authSheet) {
    return { success: false, error: 'CRITICAL_LEDGER_MISSING' };
  }
  
  const examData = examSheet.getDataRange().getValues();
  const authData = authSheet.getDataRange().getValues();
  
  // Create quick-lookup index for user profiles
  const profileMap = {};
  for (let i = 1; i < authData.length; i++) {
    const gaId = String(authData[i][0]).trim().toUpperCase();
    profileMap[gaId] = {
      name: authData[i][1],
      institution: authData[i][4],
      status: authData[i][8]
    };
  }
  
  const reportRecords = [];
  
  // Parse exam logs (Timestamp, GA_ID, Score, Total, GP, Proctor_Violations)
  for (let j = 1; j < examData.length; j++) {
    const gaId = String(examData[j][1]).trim().toUpperCase();
    const score = Number(examData[j][2]) || 0;
    const total = Number(examData[j][3]) || 242;
    const violations = Number(examData[j][5]) || 0;
    
    const profile = profileMap[gaId] || { name: 'Unknown Practitioner', institution: 'Unspecified', status: 'PENDING_REVIEW' };
    
    // Core Reporting Metrics Definitions
    const audDiagnosticAccuracy = ((score / total) * 100).toFixed(1) + '%';
    const digitalIntegrityIndex = violations === 0 ? 'VERIFIED_UNASSISTED' : 'VIOLATIONS_LOGGED: ' + violations;
    
    reportRecords.push({
      practitionerCode: gaId,
      institution: profile.institution,
      diagnosticAccuracy: audDiagnosticAccuracy,
      integrityIndex: digitalIntegrityIndex,
      verificationState: profile.status
    });
  }
  
  return {
    success: true,
    generationTimestamp: new Date().toISOString(),
    totalActiveAudited: reportRecords.length,
    dataset: reportRecords
  };
}

/**
 * Generates live, audited University Telemetry
 * Endpoint: ?action=UNIV_STATS
 */
function handleUniversityStats(ss) {
  const authData = getOrCreateSheet(ss, CONFIG.SHEET_AUTH).getDataRange().getValues();
  const telData = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY).getDataRange().getValues();
  
  // Map Telemetry
  const telMap = {};
  for (let i = 1; i < telData.length; i++) {
    telMap[String(telData[i][0]).toUpperCase()] = {
      ccr: Number(telData[i][2]) || 0,
      accuracy: Number(telData[i][3]) || 0
    };
  }

  const univStats = {};

  // Aggregate Data
  for (let i = 1; i < authData.length; i++) {
    const status = String(authData[i][8]).toUpperCase(); // Index 8 is Status
    // Only count truly verified or active doctors
    if (status !== 'VERIFIED' && status !== 'ACTIVE' && status !== 'ACCREDITED') continue;

    let univ = String(authData[i][4]).trim(); // Index 4 is Canonical University
    if (!univ) continue;
    
    // Normalize basic variations
    if (univ.includes('Khartoum')) univ = 'University of Khartoum';
    if (univ.includes('Gezira')) univ = 'University of Gezira';

    if (!univStats[univ]) {
      univStats[univ] = { verifiedDoctors: 0, totalAccuracy: 0, examsTaken: 0 };
    }

    const gaId = String(authData[i][0]).toUpperCase();
    univStats[univ].verifiedDoctors += 1;
    
    if (telMap[gaId] && telMap[gaId].accuracy > 0) {
      univStats[univ].totalAccuracy += telMap[gaId].accuracy;
      univStats[univ].examsTaken += 1;
    }
  }

  // Format Output
  const results = [];
  for (const [univName, data] of Object.entries(univStats)) {
    const avgScore = data.examsTaken > 0 ? (data.totalAccuracy / data.examsTaken).toFixed(1) + '%' : 'Pending Data';
    results.push({
      university: univName,
      verifiedDoctors: data.verifiedDoctors,
      avgSmcScore: avgScore
    });
  }

  return { success: true, timestamp: new Date().toISOString(), data: results };
}

```
````
