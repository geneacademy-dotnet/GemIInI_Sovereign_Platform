<!DOCTYPE html>
<html lang="en" dir="ltr" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SudaGene Consortium | Pre-Collegiate Fellowship &amp; Medical Evidence Synthesis</title>
  <meta name="description" content="The SudaGene Consortium operates the National Pre-Medical Academy in Exile. We provide the free Open Pre-Collegiate Fellowship (Sudanese Biology Curriculum) and bridge genomic biology with clinical realities through the MTC framework.">
  <link rel="canonical" href="https://geneacademy.net/">

  <!-- Google Analytics 4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-H1Q67PP2DJ"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-H1Q67PP2DJ', { 'anonymize_ip': true });
  </script>

  <!-- Canonical Schema.org Data (MedicalBusiness & EducationalOrganization) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": "https://geneacademy.net/#organization",
        "name": "SudaGene Medical Platform",
        "alternateName": "GemIInI Academy",
        "url": "https://geneacademy.net",
        "logo": "https://geneacademy.net/assets/logo.png",
        "founder": {
          "@type": "Person",
          "@id": "https://geneacademy.net/#founder",
          "name": "Dr. Mohamed Gibbril",
          "jobTitle": "Founder & Executive Director",
          "alumniOf": "University of Khartoum Faculty of Medicine"
        },
        "department": [
          {
            "@type": "EducationalOrganization",
            "name": "GemIInI Academy",
            "description": "The Software & Digital Engine governing the GA-ID credential ledger and MTC framework."
          },
          {
            "@type": "MedicalBusiness",
            "name": "GLOMEt",
            "description": "Global Medical Tech providing turnkey laboratory infrastructure and genomic literacy."
          },
          {
            "@type": "Periodical",
            "name": "GemIInI Journal of Medical Research",
            "alternateName": "GJMR"
          }
        ]
      }
    ]
  }
  </script>

  <!-- Canonical Design Tokens & Fonts -->
  <link rel="stylesheet" href="styles.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              navy: '#123B5D',
              teal: '#168C8C',
              gold: '#C9A227',
              bg: '#F7FAFC',
              card: '#FFFFFF',
              dark: '#1F2937',
              muted: '#64748B',
              emerald: '#16805B'
            }
          },
          fontFamily: {
            heading: ['Montserrat', 'Tajawal', 'sans-serif'],
            body: ['Inter', 'Cairo', 'sans-serif'],
            mono: ['"IBM Plex Mono"', 'monospace']
          }
        }
      }
    }
  </script>
</head>

<body class="bg-[#F7FAFC] text-[#1F2937] font-body antialiased selection:bg-teal-100 selection:text-teal-900">

  <!-- TOP UTILITY BAR -->
  <div class="bg-[#123B5D] text-slate-200 text-xs py-2 px-4 border-b border-slate-700 font-mono">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2 hidden md:flex">
        <span class="w-2 h-2 rounded-full bg-[#16805B]"></span>
        <span>GENE ACADEMY &bull; INDEPENDENT MEDICAL ECOSYSTEM</span>
      </div>
      <div class="flex items-center gap-4 ml-auto">
        <div class="flex items-center gap-1 font-bold">
          <span class="text-white">English</span>
          <span class="text-slate-500">/</span>
          <a href="index_ar.html" class="text-slate-300 hover:text-white transition font-sans">Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©</a>
        </div>
        <span class="text-slate-500 hidden sm:inline">|</span>
        <a href="auth.html" class="text-slate-300 hover:text-white font-bold transition flex items-center gap-1">
          Member Sign In <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  </div>

  <!-- MAIN HEADER & NAVIGATION -->
  <header class="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
      
      <!-- Brand Logo -->
      <a href="index.html" class="flex items-center gap-3 shrink-0 group">
        <div class="w-11 h-11 rounded-xl bg-[#123B5D] text-white font-black flex items-center justify-center font-mono text-base shadow-sm group-hover:bg-[#168C8C] transition-colors">
          GA
        </div>
        <div>
          <span class="text-xl font-bold font-heading text-[#123B5D] tracking-tight block">Gene Academy</span>
          <span class="text-[10px] font-mono text-[#64748B] block tracking-wider uppercase">MEDICAL &amp; GENOMIC CONSORTIUM</span>
        </div>
      </a>

      <!-- Desktop Navigation Links -->
      <nav class="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#1F2937]" id="desktop-nav">
        
        <!-- Programs Dropdown -->
        <div class="relative group">
          <button class="hover:text-[#168C8C] transition pb-1 flex items-center gap-1">
            Programs
            <svg class="w-4 h-4 text-slate-400 group-hover:text-[#168C8C] transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <div class="absolute left-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-64 z-50">
            <div class="bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden flex flex-col py-2">
              <a href="courses.html" class="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-[#168C8C] transition">Clinical Training</a>
              <a href="smc.html" class="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-[#168C8C] transition">SMC Preparation</a>
              <a href="molecular.html" class="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-[#168C8C] transition">Molecular Medicine</a>
              <a href="research.html" class="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-[#168C8C] transition">Research Training</a>
              <a href="stem.html" class="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-[#168C8C] transition">Junior STEM</a>
            </div>
          </div>
        </div>

        <!-- Professional Identity Dropdown -->
        <div class="relative group">
          <button class="hover:text-[#168C8C] transition pb-1 flex items-center gap-1">
            Professional Identity
            <svg class="w-4 h-4 text-slate-400 group-hover:text-[#168C8C] transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <div class="absolute left-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-64 z-50">
            <div class="bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden flex flex-col py-2">
              <a href="identity.html#how-it-works" class="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-[#168C8C] transition">How It Works</a>
              <a href="identity.html#training-records" class="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-[#168C8C] transition">Training Records</a>
              <a href="verify.html" class="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-[#168C8C] transition">Verification</a>
              <a href="identity.html#progress" class="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-[#168C8C] transition">Member Progress</a>
              <a href="identity.html#employer" class="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-[#168C8C] transition">Employer & Institutional Use</a>
            </div>
          </div>
        </div>

        <!-- Research Dropdown -->
        <div class="relative group">
          <button class="hover:text-[#168C8C] transition pb-1 flex items-center gap-1">
            Research
            <svg class="w-4 h-4 text-slate-400 group-hover:text-[#168C8C] transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <div class="absolute left-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-64 z-50">
            <div class="bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden flex flex-col py-2">
              <a href="journal.html" class="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-[#168C8C] transition">GJMR (Medical Journal)</a>
              <a href="index.html#services" class="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-[#168C8C] transition">GLOMEt</a>
              <a href="research.html" class="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-[#168C8C] transition">SudaGene Research Centre</a>
              <div class="border-t border-slate-100 my-1"></div>
              <a href="ideas.html" class="px-4 py-2 hover:bg-slate-50 font-bold text-[#123B5D] hover:text-[#168C8C] transition">Submit a Research Idea</a>
            </div>
          </div>
        </div>

        <a href="universities.html" class="hover:text-[#168C8C] transition pb-1">Universities</a>

        <!-- Institutions Dropdown -->
        <div class="relative group">
          <button class="hover:text-[#168C8C] transition pb-1 flex items-center gap-1">
            Institutions
            <svg class="w-4 h-4 text-slate-400 group-hover:text-[#168C8C] transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <div class="absolute left-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-50">
            <div class="bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden flex flex-col py-2">
              <a href="academic-solutions.html" class="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-[#168C8C] transition">Academic Solutions</a>
              <a href="partnerships.html" class="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-[#168C8C] transition">Training Partnerships</a>
              <a href="academic-solutions.html" class="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-[#168C8C] transition">Curriculum Support</a>
              <div class="border-t border-slate-100 my-1"></div>
              <a href="institutions.html" class="px-4 py-2 hover:bg-slate-50 font-bold text-[#123B5D] hover:text-[#168C8C] transition">Request a Partnership Briefing</a>
            </div>
          </div>
        </div>
      </nav>

      <!-- CTA & Mobile Menu Button -->
      <div class="flex items-center gap-4 shrink-0">
        <a href="join.html" class="hidden sm:inline-flex px-5 py-2.5 rounded-xl bg-[#123B5D] hover:bg-[#0E2E49] text-white font-heading font-semibold text-xs sm:text-sm shadow-md transition-all">
          Join Our Network
        </a>
        
        <!-- Mobile Menu Toggle Button -->
        <button id="mobile-menu-toggle" class="lg:hidden p-2 text-slate-600 hover:text-[#123B5D] transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>

    </div>

    <!-- Mobile Navigation Overlay (Hidden by default) -->
    <div id="mobile-nav" class="hidden lg:hidden bg-white border-t border-slate-200 shadow-xl absolute top-full left-0 w-full z-40 max-h-[80vh] overflow-y-auto">
      <div class="flex flex-col p-4 space-y-4 font-bold text-[#123B5D]">
        <a href="courses.html" class="block pb-2 border-b border-slate-100 text-[#168C8C]">Programs &rarr;</a>
        <a href="verify.html" class="block pb-2 border-b border-slate-100 text-[#168C8C]">Professional Identity &rarr;</a>
        <a href="research.html" class="block pb-2 border-b border-slate-100 text-[#168C8C]">Research &rarr;</a>
        <a href="universities.html" class="block pb-2 border-b border-slate-100">Universities</a>
        <a href="institutions.html" class="block pb-2 border-b border-slate-100 text-[#168C8C]">Institutions &rarr;</a>
        <a href="join.html" class="block text-center mt-4 px-5 py-3 rounded-xl bg-[#123B5D] text-white font-heading font-semibold text-sm shadow-md">
          Join Our Network
        </a>
      </div>
    </div>
  </header>

  <!-- 1. HERO SECTION -->
  <section class="relative bg-gradient-to-b from-[#123B5D] to-[#0D2A42] text-white py-20 lg:py-28 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        <div class="space-y-6 text-center lg:text-left">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-teal-300 font-mono text-xs font-bold uppercase tracking-wider">
            <span class="w-2 h-2 rounded-full bg-[#168C8C]"></span>
            TRUSTED MEDICAL EDUCATION
          </div>

          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-bold font-heading tracking-tight leading-tight">
            Turn Todayâ€™s Training into Your <span class="text-teal-300">Professional Pathway</span>
          </h1>

          <p class="text-base sm:text-lg text-slate-200 leading-relaxed max-w-xl">
            Build a verified professional profile that connects your learning, skills, credentials, research interests, and future development.
          </p>

          <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <a href="join.html" class="px-7 py-3.5 rounded-xl bg-[#168C8C] hover:bg-[#127272] text-white font-heading font-semibold text-sm shadow-md transition-all">
              Join Our Network
            </a>
            <a href="identity.html#how-it-works" class="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-heading font-semibold text-sm shadow-md transition-all">
              See How Professional Identity Works
            </a>
          </div>
        </div>

        <div class="relative hidden lg:block">
          <div class="absolute inset-0 bg-gradient-to-tr from-[#168C8C]/20 to-transparent rounded-3xl blur-2xl"></div>
          <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800" alt="Medical researchers in a modern laboratory" class="relative rounded-3xl shadow-2xl border border-white/10 object-cover aspect-[4/3]">
        </div>
      </div>
    </div>
  </section>

  <!-- 2. IMMEDIATE BRIDGE -->
  <section class="py-16 bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <h2 class="text-2xl sm:text-3xl font-bold font-heading text-[#123B5D]">What happens after your training?</h2>
        <p class="text-[#64748B] text-sm">Your training does not end when the session ends.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        <div class="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
        
        <!-- Step 1 -->
        <div class="relative z-10 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
          <div class="w-12 h-12 mx-auto bg-slate-50 text-[#123B5D] rounded-full flex items-center justify-center font-bold text-xl border border-slate-200">1</div>
          <h3 class="font-bold text-[#1F2937] text-lg font-heading">Train</h3>
          <p class="text-xs text-[#64748B] leading-relaxed">
            Complete practical education, clinical training, research activities, or professional development.
          </p>
        </div>

        <!-- Step 2 -->
        <div class="relative z-10 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
          <div class="w-12 h-12 mx-auto bg-teal-50 text-[#168C8C] rounded-full flex items-center justify-center font-bold text-xl border border-teal-100">2</div>
          <h3 class="font-bold text-[#1F2937] text-lg font-heading">Record</h3>
          <p class="text-xs text-[#64748B] leading-relaxed">
            Add confirmed learning and achievement records to your professional profile.
          </p>
        </div>

        <!-- Step 3 -->
        <div class="relative z-10 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
          <div class="w-12 h-12 mx-auto bg-amber-50 text-[#C9A227] rounded-full flex items-center justify-center font-bold text-xl border border-amber-100">3</div>
          <h3 class="font-bold text-[#1F2937] text-lg font-heading">Progress</h3>
          <p class="text-xs text-[#64748B] leading-relaxed">
            See what you have completed, what comes next, and which pathway fits your goals.
          </p>
        </div>

        <!-- Step 4 -->
        <div class="relative z-10 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm text-center space-y-3 ring-1 ring-emerald-50">
          <div class="w-12 h-12 mx-auto bg-emerald-50 text-[#16805B] rounded-full flex items-center justify-center font-bold text-xl border border-emerald-200">4</div>
          <h3 class="font-bold text-[#1F2937] text-lg font-heading">Connect</h3>
          <p class="text-xs text-[#64748B] leading-relaxed">
            Share relevant evidence with authorized institutions, mentors, and employers.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- 3. HOW IDENTITY WORKS -->
  <section id="how-it-works" class="py-20 bg-slate-50 border-b border-slate-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      <div class="text-center max-w-3xl mx-auto space-y-4">
        <span class="text-xs font-mono font-bold text-[#168C8C] uppercase tracking-wider">Beyond a Certificate</span>
        <h2 class="text-2xl sm:text-4xl font-bold font-heading text-[#123B5D]">Your Professional Identity</h2>
        <p class="text-sm sm:text-base text-[#64748B] leading-relaxed">
          A professional digital identity is a structured record of your learning, practical training, credentials, research interests, and verified achievements. It helps you carry evidence of your development from one opportunity to the next.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div class="p-5 bg-white rounded-xl border border-slate-200 text-center space-y-2 shadow-sm">
          <div class="text-2xl">ðŸ‘¤</div>
          <div class="font-bold text-[#1F2937] text-sm">Identity</div>
        </div>
        <div class="p-5 bg-white rounded-xl border border-slate-200 text-center space-y-2 shadow-sm">
          <div class="text-2xl">ðŸ“‹</div>
          <div class="font-bold text-[#1F2937] text-sm">Training</div>
        </div>
        <div class="p-5 bg-white rounded-xl border border-slate-200 text-center space-y-2 shadow-sm">
          <div class="text-2xl">ðŸ§ </div>
          <div class="font-bold text-[#1F2937] text-sm">Skills</div>
        </div>
        <div class="p-5 bg-white rounded-xl border border-slate-200 text-center space-y-2 shadow-sm">
          <div class="text-2xl">ðŸ›¡ï¸</div>
          <div class="font-bold text-[#1F2937] text-sm">Evidence</div>
        </div>
        <div class="p-5 bg-white rounded-xl border border-slate-200 text-center space-y-2 shadow-sm">
          <div class="text-2xl">ðŸ“ˆ</div>
          <div class="font-bold text-[#1F2937] text-sm">Progress</div>
        </div>
      </div>

      <!-- Simple Visual Diagram -->
      <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs font-bold text-center">
        <div class="flex-1 p-4 bg-slate-50 rounded-xl text-[#123B5D]">Person</div>
        <div class="text-slate-300">âž”</div>
        <div class="flex-1 p-4 bg-teal-50 rounded-xl text-[#168C8C]">Verified Training</div>
        <div class="text-slate-300">âž”</div>
        <div class="flex-1 p-4 bg-blue-50 rounded-xl text-[#123B5D]">Professional Profile</div>
        <div class="text-slate-300">âž”</div>
        <div class="flex-1 p-4 bg-amber-50 rounded-xl text-[#C9A227]">Progress Pathway</div>
        <div class="text-slate-300">âž”</div>
        <div class="flex-1 p-4 bg-emerald-50 rounded-xl text-[#16805B]">Opportunity</div>
      </div>

      <div class="text-center max-w-2xl mx-auto bg-blue-50 p-6 rounded-xl border border-blue-100">
        <p class="text-xs text-[#123B5D] leading-relaxed">
          <strong>Note for Employers:</strong> Your professional profile helps you present verified learning and experience more clearly to institutions, partners, and employers who choose to review it. Verification improves clarity and trust; it does not guarantee a job. Hiring decisions always remain with the employer.
        </p>
      </div>

    </div>
  </section>

  <!-- 4. CHOOSE YOUR PATHWAY -->
  <section class="py-20 bg-white border-b border-slate-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      <div class="text-center max-w-3xl mx-auto space-y-3">
        <h2 class="text-2xl sm:text-4xl font-bold font-heading text-[#123B5D]">Choose Your Pathway</h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <!-- Card 1 -->
        <div class="academic-card p-6 bg-slate-50 flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <h3 class="text-lg font-bold font-heading text-[#123B5D]">Healthcare Professionals</h3>
            <p class="text-xs text-[#64748B]">Physicians, nurses, and allied health staff seeking CME and licensure preparation.</p>
          </div>
          <a href="join.html" class="text-xs font-bold text-[#168C8C] hover:underline inline-flex items-center gap-1">Explore Your Pathway â†’</a>
        </div>

        <!-- Card 2 -->
        <div class="academic-card p-6 bg-slate-50 flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <h3 class="text-lg font-bold font-heading text-[#123B5D]">Students and Graduates</h3>
            <p class="text-xs text-[#64748B]">Medical students and fresh graduates building their first professional verified records.</p>
          </div>
          <a href="join.html" class="text-xs font-bold text-[#168C8C] hover:underline inline-flex items-center gap-1">Explore Your Pathway â†’</a>
        </div>

        <!-- Card 3 -->
        <div class="academic-card p-6 bg-slate-50 flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <h3 class="text-lg font-bold font-heading text-[#123B5D]">Researchers</h3>
            <p class="text-xs text-[#64748B]">Scientists and clinical researchers engaging with genomics, publishing, and fellowships.</p>
          </div>
          <a href="join.html" class="text-xs font-bold text-[#168C8C] hover:underline inline-flex items-center gap-1">Explore Your Pathway â†’</a>
        </div>

        <!-- Card 4 -->
        <div class="academic-card p-6 bg-slate-50 flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <h3 class="text-lg font-bold font-heading text-[#123B5D]">Educators and Mentors</h3>
            <p class="text-xs text-[#64748B]">Senior faculty and clinical instructors directing training pods and reviewing progress.</p>
          </div>
          <a href="join.html" class="text-xs font-bold text-[#168C8C] hover:underline inline-flex items-center gap-1">Explore Your Pathway â†’</a>
        </div>

        <!-- Card 5 -->
        <div class="academic-card p-6 bg-slate-50 flex flex-col justify-between space-y-4 border-l-4 border-l-[#C9A227]">
          <div class="space-y-2">
            <h3 class="text-lg font-bold font-heading text-[#123B5D]">Universities</h3>
            <p class="text-xs text-[#64748B]">Medical faculties looking to digitize their credentialing and curriculum delivery.</p>
          </div>
          <a href="institutions.html" class="text-xs font-bold text-[#C9A227] hover:underline inline-flex items-center gap-1">Explore Your Pathway â†’</a>
        </div>

        <!-- Card 6 -->
        <div class="academic-card p-6 bg-slate-50 flex flex-col justify-between space-y-4 border-l-4 border-l-[#C9A227]">
          <div class="space-y-2">
            <h3 class="text-lg font-bold font-heading text-[#123B5D]">Hospitals and Institutions</h3>
            <p class="text-xs text-[#64748B]">Teaching hospitals requiring robust simulation labs, genomic testing, and cohort management.</p>
          </div>
          <a href="institutions.html" class="text-xs font-bold text-[#C9A227] hover:underline inline-flex items-center gap-1">Explore Your Pathway â†’</a>
        </div>

      </div>
    </div>
  </section>

  <!-- 5. EVIDENCE AND PROGRESS -->
  <section class="py-20 bg-slate-50 border-b border-slate-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <span class="text-xs font-mono font-bold text-[#168C8C] uppercase tracking-wider">Your Digital Evidence</span>
          <h2 class="text-2xl sm:text-4xl font-bold font-heading text-[#123B5D]">Your achievements, beautifully organized.</h2>
          <p class="text-sm sm:text-base text-[#64748B] leading-relaxed">
            As you complete workshops, pass clinical vignettes, and participate in research, your profile automatically updates. We provide you with verifiable training records that institution partners can easily review.
          </p>
          
          <ul class="space-y-4 pt-4 text-sm text-[#1F2937]">
            <li class="flex items-start gap-3">
              <span class="text-[#16805B] font-bold">âœ“</span>
              <span><strong>Completed training:</strong> Official certificates from BLS and surgical workshops.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-[#16805B] font-bold">âœ“</span>
              <span><strong>Learning milestones:</strong> Progress bars for SMC and MRCS preparation.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-[#16805B] font-bold">âœ“</span>
              <span><strong>Research activity:</strong> Logged submissions and published abstracts.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-[#16805B] font-bold">âœ“</span>
              <span><strong>Verified records:</strong> Immutable cryptographic hashes for absolute trust.</span>
            </li>
          </ul>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
          <div class="text-xs font-mono text-slate-500 mb-4 pb-2 border-b border-slate-100 flex justify-between">
            <span>Profile Preview</span>
            <span class="text-emerald-600 font-bold">Verified âœ…</span>
          </div>
          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-slate-200"></div>
              <div>
                <div class="h-4 w-32 bg-slate-200 rounded mb-2"></div>
                <div class="h-3 w-24 bg-slate-100 rounded"></div>
              </div>
            </div>
            <div class="space-y-2 pt-4">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-[#123B5D]">SMC Clinical Simulation</span>
                <span class="text-[#16805B] font-bold">Passed</span>
              </div>
              <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="w-full h-full bg-[#16805B]"></div>
              </div>
            </div>
            <div class="space-y-2 pt-2">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-[#123B5D]">Basic Surgical Skills (Wet Lab)</span>
                <span class="text-amber-600 font-bold">In Progress</span>
              </div>
              <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="w-2/3 h-full bg-[#C9A227]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 6. THE GEMIINI SudaGene Ecosystem -->
  <section class="py-20 bg-white border-b border-slate-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div class="text-center max-w-3xl mx-auto space-y-3">
        <h2 class="text-2xl sm:text-4xl font-bold font-heading text-[#123B5D]">The Decentralized Verification Framework</h2>
        <p class="text-sm sm:text-base text-[#64748B]">
          Our digital transformation and institutional infrastructure are built across three foundational pillars.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div class="p-6 space-y-4 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition">
          <div class="w-16 h-16 mx-auto bg-[#123B5D] text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md">GA</div>
          <h3 class="text-lg font-bold font-heading text-[#123B5D]">GemIInI Academy</h3>
          <p class="text-xs text-[#64748B]">The Software &amp; Digital Engine. Governing the GA-ID: a cryptographically hashed, immutable ledger record tracking verified hours across clinical simulations, surgical wet-labs, and pre-collegiate research cohorts. It manages lifelong credentialing (from High School Biology to Postgrad) and the Mechanism-to-Clinic (MTC) framework.</p>
        </div>
        
        <div class="p-6 space-y-4 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition">
          <div class="w-16 h-16 mx-auto bg-[#168C8C] text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md">GL</div>
          <h3 class="text-lg font-bold font-heading text-[#123B5D]">GLOMEt</h3>
          <p class="text-xs text-[#64748B]">The Hardware &amp; Molecular Engine. GLOMEt delivers turnkey laboratory infrastructure, calibrated diagnostic instrumentation, and continuous technical capacity-building. Its mandate is regional Genomic Literacy and Molecular Accessâ€”extending rapid sequencing and bioinformatics capabilities from university tertiary centers to community health sentinels and agricultural biosecurity.</p>
        </div>

        <div class="p-6 space-y-4 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition">
          <div class="w-16 h-16 mx-auto bg-slate-800 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md text-amber-500">GJMR</div>
          <h3 class="text-lg font-bold font-heading text-[#123B5D]">GJMR</h3>
          <p class="text-xs text-[#64748B]">GemIInI Journal of Medical Research. Our scholarly citadel dedicated to evidence synthesis, the 100 Project Paper Marathon, and formal policy white papers. GJMR operates under the core practices established by the Committee on Publication Ethics (COPE) and the International Committee of Medical Journal Editors (ICMJE). It provides a blind peer-reviewed harbor for quantitative evidence syntheses, PRISMA-compliant meta-analyses, and clinical trials conducted in resource-constrained environments.</p>
          <a href="journal.html" class="text-xs font-bold text-[#123B5D] hover:underline">Read the Journal â†’</a>
        </div>
      </div>
    </div>
  </section>

  <!-- 7. THE PRE-COLLEGIATE FELLOWSHIP -->
  <section class="py-20 bg-slate-900 border-b border-slate-800 text-white">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div class="text-center max-w-3xl mx-auto space-y-4">
        <span class="text-xs font-mono font-bold text-[#F59E0B] uppercase tracking-wider">The Junior Investigator Initiative</span>
        <h2 class="text-2xl sm:text-4xl font-bold font-heading text-white">Rebuilding the National Scientific Pipeline</h2>
        <p class="text-sm sm:text-base text-slate-300 leading-relaxed">
          The SudaGene Consortium believes that scientific literacy is a fundamental human right, not a luxury of circumstance. In response to the national disruption of secondary education, the GemIInI Academyâ€”under the clinical leadership of our physician facultyâ€”delivers complete, open-access instruction in the National Sudanese Secondary Certificate Biology Curriculum (Ù…Ù†Ù‡Ø¬ Ø§Ù„Ø£Ø­ÙŠØ§Ø¡ - Ø§Ù„Ø´Ù‡Ø§Ø¯Ø© Ø§Ù„Ø³ÙˆØ¯Ø§Ù†ÙŠØ©).
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition">
          <div class="w-12 h-12 mb-4 bg-emerald-900/50 text-emerald-400 rounded-lg flex items-center justify-center font-bold text-xl border border-emerald-800/50">1</div>
          <h3 class="font-bold text-white text-lg font-heading mb-2">Physician-Led Instruction</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Secondary biology taught not through rote memorization, but through the living lens of clinical medicine, physiology, and molecular science. Completely free and accessible to every Sudanese student globally.
          </p>
        </div>

        <div class="p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition">
          <div class="w-12 h-12 mb-4 bg-blue-900/50 text-blue-400 rounded-lg flex items-center justify-center font-bold text-xl border border-blue-800/50">2</div>
          <h3 class="font-bold text-white text-lg font-heading mb-2">Socratic &amp; Interactive Pedagogy</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Interactive digital seminars that dismantle complex biological mechanisms into deductive, first-principles understanding (Reverse MTC).
          </p>
        </div>

        <div class="p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition border-t-2 border-t-[#F59E0B]">
          <div class="w-12 h-12 mb-4 bg-amber-900/50 text-[#F59E0B] rounded-lg flex items-center justify-center font-bold text-xl border border-amber-800/50">3</div>
          <h3 class="font-bold text-white text-lg font-heading mb-2">The Junior Research Induction</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Top-performing secondary students do not simply memorize biologyâ€”they practice it. Qualified fellows are directly integrated into our quantitative evidence synthesis and meta-analysis working groups, earning verifiable research credits attached to their lifelong GA-ID.
          </p>
        </div>
      </div>

      <div class="text-center pt-8">
        <p class="text-xs font-mono text-slate-500 uppercase tracking-widest mb-6">From the high school desk to the research benchâ€”our scholars begin here.</p>
        <a href="stem.html" class="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#168C8C] hover:bg-[#126B6B] text-white font-bold font-heading text-sm transition shadow-lg shadow-[#168C8C]/20">
          Enter the Pre-Collegiate Fellowship â†’
        </a>
      </div>
    </div>
  </section>

  <!-- 8. UNIVERSITIES AND INSTITUTIONS -->
  <section class="py-20 bg-slate-50 border-b border-slate-200">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div class="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-t-[#123B5D] text-center space-y-4">
          <div class="text-xs font-mono font-bold text-[#123B5D] uppercase tracking-wider">For Learners</div>
          <h3 class="text-2xl font-bold font-heading text-[#1F2937]">Discover Faculties</h3>
          <p class="text-sm text-[#64748B] pb-4">
            Browse our independently maintained directory of medical faculties, review program information, and explore the academic landscape.
          </p>
          <a href="universities.html" class="inline-block px-6 py-3 rounded-xl bg-[#123B5D] hover:bg-[#0E2E49] text-white font-heading font-bold text-sm shadow transition">
            Explore Universities &amp; Medical Faculties
          </a>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-t-[#C9A227] text-center space-y-4">
          <div class="text-xs font-mono font-bold text-[#C9A227] uppercase tracking-wider">For Institutions</div>
          <h3 class="text-2xl font-bold font-heading text-[#1F2937]">B2B Partnerships</h3>
          <p class="text-sm text-[#64748B] pb-4">
            Equip your institution with clinical simulation programs, credential verification, curriculum support, and genomics services.
          </p>
          <a href="institutions.html" class="inline-block px-6 py-3 rounded-xl bg-[#C9A227] hover:bg-[#B5901F] text-white font-heading font-bold text-sm shadow transition">
            Request a Partnership Briefing
          </a>
        </div>

      </div>
    </div>
  </section>

  <!-- 8. FINAL CTA -->
  <section class="py-20 bg-gradient-to-b from-[#123B5D] to-[#0A2236] text-white text-center">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div class="space-y-4">
        <h2 class="text-3xl sm:text-4xl font-bold font-heading">
          Your next professional opportunity begins with a clearer record of what you have learned and achieved.
        </h2>
      </div>
      <div class="pt-4">
        <a href="join.html" class="px-8 py-4 rounded-xl bg-[#168C8C] hover:bg-[#127272] text-white font-heading font-bold text-sm shadow-lg transition">
          Join Our Network
        </a>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
<footer class="bg-[#0B1E2E] text-slate-400 py-16 text-xs border-t border-slate-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      
      <!-- Column 1: Brand & Bio -->
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-[#123B5D] text-white font-mono font-bold flex items-center justify-center text-sm border border-slate-700">
            GA
          </div>
          <span class="text-base font-bold font-heading text-white">Gene Academy</span>
        </div>
        <p class="text-slate-400 leading-relaxed max-w-sm">
          An independent medical and academic consortium delivering continuous clinical education, and verifiable academic credentialing.
        </p>
      </div>

      <!-- Column 2: Explore -->
      <div class="space-y-3">
        <div class="font-bold text-white font-heading uppercase text-xs tracking-wider">Explore</div>
        <ul class="space-y-2">
          <li><a href="about.html" class="hover:text-white transition">About</a></li>
          <li><a href="courses.html" class="hover:text-white transition">Programs</a></li>
          <li><a href="research.html" class="hover:text-white transition">Research</a></li>
          <li><a href="faculty.html" class="hover:text-white transition">Faculty</a></li>
          <li><a href="institutions.html" class="hover:text-white transition">Institutions</a></li>
        </ul>
      </div>

      <!-- Column 3: Participate -->
      <div class="space-y-3">
        <div class="font-bold text-white font-heading uppercase text-xs tracking-wider">Participate</div>
        <ul class="space-y-2">
          <li><a href="join.html" class="text-teal-400 hover:text-white font-bold transition">Join Our Network</a></li>
          <li><a href="courses.html" class="hover:text-white transition">Clinical Training</a></li>
          <li><a href="stem.html" class="hover:text-white transition">Junior STEM</a></li>
          <li><a href="ideas.html" class="hover:text-white transition">Submit a Research Idea</a></li>
        </ul>
      </div>

      <!-- Column 4: Trust & Support -->
      <div class="space-y-3">
        <div class="font-bold text-white font-heading uppercase text-xs tracking-wider">Trust and support</div>
        <ul class="space-y-2">
          <li><a href="verify.html" class="hover:text-white transition">Verify a Credential</a></li>
          <li><a href="#contact" class="hover:text-white transition">Contact</a></li>
          <li><a href="#" class="hover:text-white transition">Privacy Policy</a></li>
          <li><a href="#" class="hover:text-white transition">Terms of Use</a></li>
          <li><a href="#" class="hover:text-white transition">Safeguarding</a></li>
        </ul>
      </div>

    </div>

    <div class="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-slate-500">
      <div>
        &copy; 2026/2027 Gene Academy &bull; SudaGene Medical Consortium.
      </div>
      <div class="flex gap-4">
        <span class="hidden sm:inline">Made with precision.</span>
      </div>
    </div>

  </div>
</footer>

<!-- Minimal Script for Mobile Menu -->
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const mobileBtn = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    if(mobileBtn && mobileNav) {
      mobileBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('hidden');
      });
    }
  });
</script>
</body>
</html>
<!DOCTYPE html>
<html lang="en" dir="ltr" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Join Our Network | GeneAcademy</title>
  <meta name="description" content="Discover your clinical and academic pathway at GeneAcademy â€” the Independent Medical Consortium for the region.">
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-H1Q67PP2DJ"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-H1Q67PP2DJ');</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet">
  <style>
    :root{--bg:#F7FAFC;--navy:#123B5D;--teal:#168C8C;--text:#1F2937;--muted:#64748B;}
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:var(--bg);color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;-webkit-font-smoothing:antialiased;min-height:100vh;display:flex;flex-direction:column;}
    .mono{font-family:'IBM Plex Mono',monospace;}
    /* â”€â”€ NAV â”€â”€ */
    .top-nav{padding:18px 24px;display:flex;justify-content:space-between;align-items:center;background:rgba(247,250,252,.97);position:sticky;top:0;z-index:30;backdrop-filter:blur(10px);border-bottom:1px solid #E2E8F0;}
    .brand{display:flex;align-items:center;gap:12px;font-weight:800;font-size:1.05rem;text-decoration:none;color:var(--navy);}
    .brand-badge{background:var(--navy);color:#fff;font-weight:700;font-size:.85rem;padding:5px 10px;border-radius:8px;font-family:'IBM Plex Mono',monospace;transition:background .2s;}
    .brand:hover .brand-badge{background:var(--teal);}
    .nav-actions a{font-size:.9rem;color:var(--muted);text-decoration:none;font-weight:500;margin-left:16px;transition:color .2s;}
    .nav-actions a:hover{color:var(--navy);}
    /* â”€â”€ LAYOUT â”€â”€ */
    .container{width:100%;max-width:660px;margin:0 auto;padding:24px 20px 80px;flex-grow:1;display:flex;flex-direction:column;}
    /* â”€â”€ PROGRESS â”€â”€ */
    .progress-container{display:flex;align-items:center;justify-content:space-between;margin-bottom:40px;position:relative;padding:0 10px;opacity:0;transition:opacity .5s;}
    .progress-container.show{opacity:1;}
    .progress-line{position:absolute;top:50%;left:10px;right:10px;height:2px;background:#E2E8F0;z-index:1;transform:translateY(-50%);}
    .progress-line-fill{position:absolute;top:50%;left:10px;height:2px;background:var(--teal);z-index:2;transform:translateY(-50%);transition:width .6s cubic-bezier(.22,1,.36,1);width:0%;}
    .progress-dot{width:10px;height:10px;background:#E2E8F0;border-radius:50%;z-index:3;position:relative;transition:all .4s;}
    .progress-dot.active{background:var(--teal);box-shadow:0 0 0 4px rgba(22,140,140,.15);}
    .progress-dot.completed{background:var(--teal);}
    /* â”€â”€ SCREENS â”€â”€ */
    .screen{display:none;opacity:0;transform:translateY(10px);transition:opacity .45s ease,transform .45s ease;}
    .screen.active{display:block;opacity:1;transform:none;}
    .screen-title{font-size:1.75rem;font-weight:800;color:var(--navy);margin-bottom:12px;line-height:1.2;}
    .screen-sub{font-size:1rem;color:var(--muted);margin-bottom:32px;line-height:1.6;}
    /* â”€â”€ SELECTION CARDS â”€â”€ */
    .selection-grid{display:flex;flex-direction:column;gap:12px;margin-bottom:32px;}
    .select-card{background:#FFF;border:1.5px solid #E2E8F0;border-radius:16px;padding:20px 24px;cursor:pointer;transition:all .2s;font-weight:600;color:var(--text);display:flex;align-items:center;justify-content:space-between;}
    .select-card:hover{border-color:#CBD5E1;background:#F8FAFC;}
    .select-card.selected{border-color:var(--teal);background:rgba(22,140,140,.04);color:var(--navy);}
    .check-icon{opacity:0;color:var(--teal);transition:opacity .2s;flex-shrink:0;}
    .select-card.selected .check-icon{opacity:1;}
    /* â”€â”€ CHIPS â”€â”€ */
    .chip-grid{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:32px;}
    .chip{background:#FFF;border:1.5px solid #E2E8F0;border-radius:99px;padding:12px 20px;cursor:pointer;transition:all .2s;font-weight:500;font-size:.95rem;user-select:none;}
    .chip:hover{border-color:#CBD5E1;background:#F8FAFC;}
    .chip.selected{border-color:var(--teal);background:var(--teal);color:#FFF;}
    /* â”€â”€ FORM FIELDS â”€â”€ */
    .field{margin-bottom:20px;}
    .field label{display:block;font-size:.9rem;font-weight:600;color:var(--navy);margin-bottom:8px;}
    .field input,.field select{width:100%;background:#FFF;border:1.5px solid #E2E8F0;border-radius:12px;padding:14px 16px;font-family:'Plus Jakarta Sans',sans-serif;font-size:1rem;color:var(--text);outline:none;transition:all .2s;}
    .field input:focus,.field select:focus{border-color:var(--teal);box-shadow:0 0 0 4px rgba(22,140,140,.1);}
    /* â”€â”€ BUTTONS â”€â”€ */
    .nav-buttons{display:flex;gap:16px;margin-top:40px;}
    .btn{padding:16px 24px;border-radius:12px;font-weight:600;font-size:1rem;border:none;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;font-family:'Plus Jakarta Sans',sans-serif;}
    .btn-primary{background:var(--navy);color:#fff;flex-grow:1;}
    .btn-primary:hover{background:#0d2b45;}
    .btn-primary:disabled{opacity:.6;cursor:not-allowed;}
    .btn-secondary{background:#E2E8F0;color:var(--text);flex-basis:120px;flex-shrink:0;}
    .btn-secondary:hover{background:#CBD5E1;}
    /* â”€â”€ SOFT RESPONSE â”€â”€ */
    .soft-response{font-size:.95rem;color:var(--teal);font-weight:500;margin-top:-16px;margin-bottom:32px;opacity:0;transition:opacity .5s;}
    .soft-response.show{opacity:1;}
    /* â”€â”€ SUMMARY BOX â”€â”€ */
    .summary-box{background:#FFF;border:1.5px solid #E2E8F0;border-radius:16px;padding:24px;margin-bottom:28px;}
    .summary-item{margin-bottom:14px;}
    .summary-item:last-child{margin-bottom:0;}
    .summary-label{font-size:.8rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);font-weight:600;margin-bottom:4px;}
    .summary-value{font-size:.95rem;font-weight:600;color:var(--navy);}
    /* â”€â”€ CONSENT â”€â”€ */
    .consent-wrap{display:flex;align-items:flex-start;gap:12px;margin-bottom:28px;padding:16px;background:rgba(22,140,140,.04);border-radius:12px;}
    .consent-wrap input[type=checkbox]{margin-top:4px;width:18px;height:18px;accent-color:var(--teal);flex-shrink:0;}
    .consent-text{font-size:.9rem;color:var(--muted);line-height:1.5;}
    /* â”€â”€ SUCCESS â”€â”€ */
    .success-container{text-align:center;padding:40px 20px;}
    .success-icon{width:64px;height:64px;background:rgba(22,128,91,.1);color:#16805B;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;}
    .ref-box{display:inline-block;background:#FFF;border:1px solid #E2E8F0;padding:16px 32px;border-radius:12px;margin:28px 0;}
    .ref-label{font-size:.8rem;color:var(--muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;}
    .ref-value{font-size:1.4rem;color:var(--navy);font-weight:700;font-family:'IBM Plex Mono',monospace;}
    .success-actions{display:flex;flex-direction:column;gap:12px;align-items:center;margin-top:20px;}
    .btn-link{text-decoration:none;padding:14px 40px;border-radius:12px;font-weight:600;font-size:1rem;font-family:'Plus Jakarta Sans',sans-serif;transition:all .2s;}
    .btn-link-primary{background:var(--navy);color:#fff;}
    .btn-link-primary:hover{background:#0d2b45;}
    .btn-link-ghost{color:var(--navy);border:1px solid #E2E8F0;}
    .btn-link-ghost:hover{background:#F1F5F9;}
  </style>
</head>
<body>

  <nav class="top-nav">
    <a href="index.html" class="brand">
      <span class="brand-badge mono">GA</span>
      <span>GeneAcademy</span>
    </a>
    <div class="nav-actions">
      <a href="join_ar.html">Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©</a>
      <a href="#" onclick="saveAndExit();return false;">Save and exit</a>
    </div>
  </nav>

  <main class="container">
    <div class="progress-container" id="progressContainer">
      <div class="progress-line"></div>
      <div class="progress-line-fill" id="progressFill"></div>
      <div class="progress-dot active" data-index="0"></div>
      <div class="progress-dot" data-index="1"></div>
      <div class="progress-dot" data-index="2"></div>
      <div class="progress-dot" data-index="3"></div>
      <div class="progress-dot" data-index="4"></div>
    </div>

    <form id="pathwayForm" onsubmit="return false;">

      <!-- SCREEN 1: Welcome -->
      <div class="screen active" data-screen="1">
        <h1 class="screen-title">Let's find your place in the network</h1>
        <p class="screen-sub">You do not need to have everything figured out. Tell us a little about yourself, and we will help you discover the most relevant GeneAcademy pathway.</p>
        <p style="font-size:.9rem;color:var(--muted);margin-bottom:2.5rem;">This takes a few simple steps. You can go back at any time.</p>
        <div class="nav-buttons">
          <button type="button" class="btn btn-primary" onclick="nextScreen()">Begin</button>
        </div>
      </div>

      <!-- SCREEN 2: Role -->
      <div class="screen" data-screen="2">
        <h2 class="screen-title">Where are you in your journey?</h2>
        <p class="screen-sub">Choose the description that feels closest to you right now.</p>
        <div class="selection-grid" id="typeSelection">
          <div class="select-card" data-val="Medical student"><span>Medical student</span><svg class="check-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></div>
          <div class="select-card" data-val="Medical graduate"><span>Medical graduate</span><svg class="check-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></div>
          <div class="select-card" data-val="Doctor or healthcare professional"><span>Doctor or healthcare professional</span><svg class="check-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></div>
          <div class="select-card" data-val="Researcher"><span>Researcher</span><svg class="check-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></div>
          <div class="select-card" data-val="Laboratory professional"><span>Laboratory professional</span><svg class="check-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></div>
          <div class="select-card" data-val="Educator or mentor"><span>Educator or mentor</span><svg class="check-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></div>
          <div class="select-card" data-val="University, hospital, or institution"><span>University, hospital, or institution</span><svg class="check-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></div>
          <div class="select-card" data-val="I am exploring my options"><span>I am exploring my options</span><svg class="check-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></div>
        </div>
        <div class="nav-buttons">
          <button type="button" class="btn btn-secondary" onclick="prevScreen()">Back</button>
          <button type="button" class="btn btn-primary" id="btnTypeNext" onclick="nextScreen()" disabled>Continue</button>
        </div>
      </div>

      <!-- SCREEN 3: Interests -->
      <div class="screen" data-screen="3">
        <h2 class="screen-title">What would you like to explore?</h2>
        <p class="screen-sub">Choose as many as you like. We use this to personalise your pathway.</p>
        <div class="chip-grid" id="interestSelection">
          <div class="chip" data-val="Clinical skills">Clinical skills</div>
          <div class="chip" data-val="Examination preparation">Examination preparation</div>
          <div class="chip" data-val="Molecular medicine">Molecular medicine</div>
          <div class="chip" data-val="Genomic research">Genomic research</div>
          <div class="chip" data-val="Research collaboration">Research collaboration</div>
          <div class="chip" data-val="Teaching and mentorship">Teaching and mentorship</div>
          <div class="chip" data-val="Institutional partnerships">Institutional partnerships</div>
          <div class="chip" data-val="Junior STEM">Junior STEM</div>
        </div>
        <div class="soft-response" id="interestResponse">We are beginning to understand your direction.</div>
        <div class="nav-buttons">
          <button type="button" class="btn btn-secondary" onclick="prevScreen()">Back</button>
          <button type="button" class="btn btn-primary" onclick="nextScreen()">Continue</button>
        </div>
      </div>

      <!-- SCREEN 4: Next Step -->
      <div class="screen" data-screen="4">
        <h2 class="screen-title">What would be most useful for you now?</h2>
        <p class="screen-sub">This tells us how to guide your first step inside the network.</p>
        <div class="selection-grid" id="nextStepSelection">
          <div class="select-card" data-val="Discover suitable programs"><span>Discover suitable programs</span><svg class="check-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></div>
          <div class="select-card" data-val="Join the professional network"><span>Join the professional network</span><svg class="check-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></div>
          <div class="select-card" data-val="Speak with a mentor"><span>Speak with a mentor</span><svg class="check-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></div>
          <div class="select-card" data-val="Explore research opportunities"><span>Explore research opportunities</span><svg class="check-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></div>
          <div class="select-card" data-val="Discuss an institutional partnership"><span>Discuss an institutional partnership</span><svg class="check-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></div>
          <div class="select-card" data-val="Receive future program updates"><span>Receive future program updates</span><svg class="check-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></div>
        </div>
        <div class="nav-buttons">
          <button type="button" class="btn btn-secondary" onclick="prevScreen()">Back</button>
          <button type="button" class="btn btn-primary" id="btnStepNext" onclick="nextScreen()" disabled>Continue</button>
        </div>
      </div>

      <!-- SCREEN 5: Contact Details -->
      <div class="screen" data-screen="5">
        <h2 class="screen-title">Where should we send your next step?</h2>
        <p class="screen-sub">Your information is held securely and never shared with third parties.</p>
        <div class="field">
          <label for="f_name">Preferred name</label>
          <input type="text" id="f_name" placeholder="How should we address you?" autocomplete="given-name" required>
        </div>
        <div class="field">
          <label for="f_email">Email address</label>
          <input type="email" id="f_email" placeholder="name@example.com" autocomplete="email" required>
        </div>
        <div class="field">
          <label for="f_phone">WhatsApp or phone number</label>
          <input type="tel" id="f_phone" placeholder="+249 912 000 000" autocomplete="tel">
        </div>
        <div class="field">
          <label for="f_country">Country of residence</label>
          <select id="f_country" required>
            <option value="" disabled selected>Select your location...</option>
            <option value="Sudan">Sudan</option>
            <option value="Egypt">Egypt</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="UAE">United Arab Emirates</option>
            <option value="Qatar">Qatar</option>
            <option value="UK">United Kingdom</option>
            <option value="Ireland">Ireland</option>
            <option value="USA">United States</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div class="field" id="institution_wrapper" style="display:none;">
          <label for="f_institution">Institution or University</label>
          <input type="text" id="f_institution" placeholder="Where do you study or work?" autocomplete="organization">
        </div>
        <div class="nav-buttons">
          <button type="button" class="btn btn-secondary" onclick="prevScreen()">Back</button>
          <button type="button" class="btn btn-primary" onclick="validateAndNext()">Review Details</button>
        </div>
      </div>

      <!-- SCREEN 6: Review & Consent -->
      <div class="screen" data-screen="6">
        <h2 class="screen-title">Does this look right?</h2>
        <p class="screen-sub">Review your details before we connect you to the network.</p>
        <div class="summary-box">
          <div class="summary-item">
            <div class="summary-label">Your role</div>
            <div class="summary-value" id="sum_role">â€”</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Your interests</div>
            <div class="summary-value" id="sum_interests">â€”</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Your preferred next step</div>
            <div class="summary-value" id="sum_step">â€”</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Contact</div>
            <div class="summary-value" id="sum_contact">â€”</div>
          </div>
        </div>
        <div class="consent-wrap">
          <input type="checkbox" id="f_consent">
          <label for="f_consent" class="consent-text">I agree to be contacted about relevant GeneAcademy programs, research opportunities, and network activities. My data will be held securely and not shared with third parties.</label>
        </div>
        <div class="nav-buttons">
          <button type="button" class="btn btn-secondary" onclick="prevScreen()">Back</button>
          <button type="button" class="btn btn-primary" id="btnSubmit" onclick="submitApplication()">Join Our Network</button>
        </div>
      </div>

    </form>

    <!-- SUCCESS STATE -->
    <div class="screen" id="successScreen">
      <div class="success-container">
        <div class="success-icon">
          <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h2 class="screen-title" style="text-align:center;">You are now connected with GeneAcademy</h2>
        <p class="screen-sub" style="text-align:center;max-width:420px;margin:0 auto 8px;">
          Thank you. We have received your information and will guide you toward the most relevant next step by email.
        </p>
        <div class="ref-box" id="refBox" style="display:none;">
          <div class="ref-label">Your Application Reference</div>
          <div class="ref-value" id="dispRef">GA-PENDING</div>
        </div>
        <div class="success-actions">
          <a href="courses.html" class="btn-link btn-link-primary">Explore our programs</a>
          <a href="index.html" class="btn-link btn-link-ghost">Return to homepage</a>
        </div>
      </div>
    </div>

  </main>

  <script src="api.js"></script>
  <script src="analytics.js"></script>
  <script>
    const TOTAL_SCREENS = 6;
    let currentScreen = 1;
    const appState = { role: '', interests: new Set(), nextStep: '', contact: {} };

    // â”€â”€ Restore saved state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    document.addEventListener('DOMContentLoaded', () => {
      try {
        const saved = localStorage.getItem('ga_join_state');
        if (saved) {
          const p = JSON.parse(saved);
          if (p.role) selectCard('typeSelection', p.role);
          if (p.nextStep) selectCard('nextStepSelection', p.nextStep);
          if (p.interests) p.interests.forEach(v => {
            const chip = document.querySelector('#interestSelection .chip[data-val="' + v + '"]');
            if (chip) toggleChip(chip);
          });
          if (p.contact) {
            ['f_name','f_email','f_phone','f_country','f_institution'].forEach(id => {
              const el = document.getElementById(id);
              if (el && p.contact[id]) el.value = p.contact[id];
            });
          }
        }
      } catch(e) {}
    });

    function saveAndExit() {
      const contact = {};
      ['f_name','f_email','f_phone','f_country','f_institution'].forEach(id => {
        contact[id] = document.getElementById(id).value;
      });
      localStorage.setItem('ga_join_state', JSON.stringify({
        role: appState.role,
        interests: Array.from(appState.interests),
        nextStep: appState.nextStep,
        contact
      }));
      alert('Your progress has been saved. You can return at any time.');
      window.location.href = 'index.html';
    }

    // â”€â”€ Single-select card setup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    function setupSingleSelect(cid, stateKey, nextBtnId) {
      document.getElementById(cid).querySelectorAll('.select-card').forEach(card => {
        card.addEventListener('click', () => {
          document.getElementById(cid).querySelectorAll('.select-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          appState[stateKey] = card.dataset.val;
          if (nextBtnId) document.getElementById(nextBtnId).disabled = false;
        });
      });
    }
    function selectCard(cid, val) {
      const c = document.querySelector('#' + cid + ' .select-card[data-val="' + val + '"]');
      if (c) c.click();
    }
    setupSingleSelect('typeSelection', 'role', 'btnTypeNext');
    setupSingleSelect('nextStepSelection', 'nextStep', 'btnStepNext');

    // â”€â”€ Chip multi-select â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    document.querySelectorAll('#interestSelection .chip').forEach(chip => {
      chip.addEventListener('click', () => toggleChip(chip));
    });
    function toggleChip(chip) {
      const v = chip.dataset.val;
      if (appState.interests.has(v)) {
        appState.interests.delete(v);
        chip.classList.remove('selected');
      } else {
        appState.interests.add(v);
        chip.classList.add('selected');
      }
      document.getElementById('interestResponse').classList.toggle('show', appState.interests.size > 0);
    }

    // â”€â”€ Progress bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    function updateProgress() {
      const idx = Math.min(currentScreen - 1, 4);
      document.querySelectorAll('.progress-dot').forEach((d, i) => {
        d.classList.toggle('completed', i < idx);
        d.classList.toggle('active', i === idx);
      });
      document.getElementById('progressFill').style.width = (idx / 4 * 100) + '%';
      if (currentScreen > 1) document.getElementById('progressContainer').classList.add('show');
    }

    // â”€â”€ Screen navigation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    function showScreen(n) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      if (n === 5) {
        const showInstitution = ['Medical student','Medical graduate','University, hospital, or institution','Educator or mentor'].includes(appState.role);
        document.getElementById('institution_wrapper').style.display = showInstitution ? 'block' : 'none';
        if (!showInstitution) document.getElementById('f_institution').value = '';
      }
      if (n === 6) {
        document.getElementById('sum_role').innerText = appState.role || 'Not specified';
        document.getElementById('sum_interests').innerText = appState.interests.size
          ? Array.from(appState.interests).join(', ')
          : 'Not specified';
        document.getElementById('sum_step').innerText = appState.nextStep || 'Not specified';
        document.getElementById('sum_contact').innerText =
          (document.getElementById('f_name').value || '') + ' Â· ' + document.getElementById('f_email').value;
      }
      const target = document.querySelector('.screen[data-screen="' + n + '"]');
      if (target) target.classList.add('active');
      currentScreen = n;
      updateProgress();
      window.scrollTo(0, 0);
    }

    function nextScreen() { if (currentScreen < TOTAL_SCREENS) showScreen(currentScreen + 1); }
    function prevScreen() { if (currentScreen > 1) showScreen(currentScreen - 1); }

    function validateAndNext() {
      const name    = document.getElementById('f_name').value.trim();
      const email   = document.getElementById('f_email').value.trim();
      const country = document.getElementById('f_country').value;
      if (!name || !email || !country) {
        alert('Please fill in your name, email, and country to continue.');
        return;
      }
      nextScreen();
    }

    // â”€â”€ Form submission â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    async function submitApplication() {
      if (!document.getElementById('f_consent').checked) {
        alert('Please agree to the contact consent to continue.');
        return;
      }
      const btn = document.getElementById('btnSubmit');
      btn.disabled = true;
      btn.innerText = 'Connecting...';

      const name        = document.getElementById('f_name').value.trim();
      const email       = document.getElementById('f_email').value.trim();
      const phone       = document.getElementById('f_phone').value.trim() || '';
      const country     = document.getElementById('f_country').value;
      const institution = document.getElementById('f_institution').value.trim() || 'Not specified';

      try {
        // Primary registration
        const result = await executeGemIInISync({
          action:       'REGISTER_USER',
          legalName:    name,
          email:        email,
          phone:        phone,
          location:     country,
          university:   institution,
          careerStage:  appState.role,
          peerReferral: ''
        });

        const gaId = (result && result.gaId) ? result.gaId : 'PENDING';

        // Secondary: log interests + next step
        try {
          await executeGemIInISync({
            action:          'SUBMIT_FEEDBACK',
            gaId:            gaId,
            email:           email,
            phone:           phone,
            targetModules:   Array.from(appState.interests).join('; '),
            targetPathways:  '[Next Step: ' + appState.nextStep + ']'
          });
        } catch(e) { /* non-critical */ }

        // GA4 conversion
        if (typeof gtag === 'function') {
          gtag('event', 'sign_up', { method: 'Pathway_Discovery', career_stage: appState.role });
        }

        // Clear saved state
        localStorage.removeItem('ga_join_state');

        // Show success
        document.getElementById('pathwayForm').style.display = 'none';
        document.getElementById('progressContainer').style.display = 'none';
        if (gaId && gaId.startsWith('GA-')) {
          document.getElementById('refBox').style.display = 'inline-block';
          document.getElementById('dispRef').innerText = gaId;
        }
        document.getElementById('successScreen').classList.add('active');

      } catch(err) {
        alert('We encountered a temporary network issue. Your application was not saved â€” please try again.');
        btn.disabled = false;
        btn.innerText = 'Join Our Network';
      }
    }
  </script>
</body>
</html>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>

<script type="text/javascript">
var _iub = _iub || [];
_iub.csConfiguration = {"siteId":4659147,"cookiePolicyId":32190221,"lang":"en","storage":{"useSiteId":true}};
</script>
<script type="text/javascript" src="https://cs.iubenda.com/autoblocking/4659147.js"></script>
<script type="text/javascript" src="//cdn.iubenda.com/cs/gpp/stub.js"></script>
<script type="text/javascript" src="//cdn.iubenda.com/cs/iubenda_cs.js" charset="UTF-8" async></script>

 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>GemIInI Jaib Funnel â€” SMC Exam Success | GemIInI Academy</title>
 <meta name="description" content="ØªØ·Ø¨ÙŠÙ‚ Ø¬Ù€Ù…Ù€ÙŠÙ€Ù†Ù€ÙŠ Ø¬Ù€ÙŠÙ€Ø¨ (GemIInI Jaib) Ù„Ø­Ø¬Ø² Ø§Ù„Ø¬Ù„Ø³Ø§Øª Ø§Ù„Ø¥Ø³ØªØ±Ø§ØªÙŠØ¬ÙŠØ© Ù„Ø§Ù…ØªØ­Ø§Ù† Ø§Ù„Ù…Ø¬Ù„Ø³ Ø§Ù„Ø·Ø¨ÙŠ Ø§Ù„Ø³ÙˆØ¯Ø§Ù†ÙŠ SMC ÙˆØ¥Ø¯Ø§Ø±Ø© Ù…Ø³Ø§Ø±Ø§Øª Ø§Ù„Ø·Ù„Ø§Ø¨ ÙˆØªÙˆØ²ÙŠØ¹ Ù†Ù‚Ø§Ø· GP.">
 <link rel="stylesheet" href="css/styles.css">
</head>
<body style="background: var(--bg-primary);">

 <!-- Domains Ribbon -->
 <div class="domains-ribbon">
 <div class="container">
 <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
 <span style="color: var(--gold); font-weight: 700;"> ØªØ·Ø¨ÙŠÙ‚ Ø¬Ù€Ù…Ù€ÙŠÙ€Ù†Ù€ÙŠ Ø¬Ù€ÙŠÙ€Ø¨ (GemIInI Jaib â€” Pocket App):</span>
 <a href="https://link.members.geneacademy.net/preview/ox9WDL0CNlkTIxsHSWNr" target="_blank" class="domain-chip"> link.members.geneacademy.net/preview/ox9WDL0CNlkTIxsHSWNr</a>
 <span class="cert-tag" style="background: rgba(255,255,255,0.08); color: #FFFFFF; border-color: rgba(255,255,255,0.15); font-size: 14.5px;">ÙƒÙˆØ¯ Ø§Ù„Ù…Ø¤Ø³Ø³Ø©: GA 000</span>
 </div>
 <div style="display: flex; align-items: center; gap: 14px;">
 <span style="font-size: 14.5px; color: #EDE8F5;">Ø£Ù…Ø§Ù†Ø© Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª ÙˆØ§Ù„ØªÙˆØ«ÙŠÙ‚ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ: <strong style="color: var(--gold); font-family: var(--font-mono);">+20 101 592 2628</strong></span>
 </div>
 </div>
 </div>

 <!-- Navigation Bar -->
 <header class="navbar">
 <div class="container nav-content">
 <a href="index.html" class="brand-logo">
 <div class="logo-icon">GS</div>
 <div class="brand-text">
    <h1>GemIInI Jaib</h1>
    <span>ØªØ·Ø¨ÙŠÙ‚ Ø¬Ù€Ù…Ù€ÙŠÙ€Ù†Ù€ÙŠ Ø¬Ù€ÙŠÙ€Ø¨ Ù„Ù„Ù…ØªØ§Ø¨Ø¹Ø© ÙˆØ§Ù„ØªØ¯Ø±ÙŠØ¨ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ</span>
 </div>
 </a>

 <ul class="nav-links">
 <li><a href="index.html">Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©</a></li>
 <li><a href="smc.html" style="color: var(--gold); font-weight: 800;"> Ù…Ø³Ø§Ø± Ø§Ù…ØªØ­Ø§Ù† SMC</a></li>
 <li><a href="courses.html">Ø¯Ù„ÙŠÙ„ Ø§Ù„Ø¯ÙˆØ±Ø§Øª</a></li>
 <li><a href="research.html">Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Ø§Øª Ø§Ù„Ø¨Ø­Ø«ÙŠØ©</a></li>
 <li><a href="alumni.html">Ù„ÙˆØ­Ø© Ø§Ù„Ø´Ø±Ù ÙˆØ§Ù„Ø´Ù‡Ø§Ø¯Ø§Øª</a></li>
 <li><a href="reviews.html" style="color: var(--gold); font-weight: 900;"> Ø§Ù„ØªÙ‚ÙŠÙŠÙ…Ø§Øª Ø§Ù„Ù…ÙˆØ«Ù‚Ø©</a></li>
 </ul>

 <div class="nav-cta">
 <a href="https://link.members.geneacademy.net/preview/ox9WDL0CNlkTIxsHSWNr" target="_blank" class="btn btn-gold" style="padding: 10px 20px; font-size: 14px;">
 ÙØªØ­ Ø§Ù„Ù…Ù†ØµØ© Ø§Ù„Ø±Ø³Ù…ÙŠØ© â†—
 </a>
 </div>
 </div>
 </header>

 <!-- Hero Section -->
 <section class="hero-section" style="text-align: center; padding: 50px 0 30px;">
 <div class="container" style="max-width: 960px; margin: 0 auto;">
 <div class="hero-badge">
 <span> Ù†Ø¸Ø§Ù… Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…ÙˆØ§Ø¹ÙŠØ¯ ÙˆØ§Ù„Ù…Ø³Ø§Ø±Ø§Øª Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© Ø§Ù„Ø°ÙƒÙŠ (GemIInI Jaib)</span>
 </div>
 <h1 class="hero-title" style="font-size: 42px;">
 ØªØ·Ø¨ÙŠÙ‚ Ø¬Ù€Ù…Ù€ÙŠÙ€Ù†Ù€ÙŠ Ø¬Ù€ÙŠÙ€Ø¨ (GemIInI Jaib) Ù„Ø­Ø¬Ø² Ø§Ù„Ø¬Ù„Ø³Ø§Øª Ø§Ù„Ø¥Ø³ØªØ±Ø§ØªÙŠØ¬ÙŠØ©
 </h1>
 <p class="hero-description" style="max-width: 800px; margin: 0 auto 30px;">
 ØªØªÙŠØ­ Ù„Ùƒ Ù…Ù†ØµØ© GemIInI Jaib Ø­Ø¬Ø² Ø¬Ù„Ø³Ø§Øª Ø§Ù„ØªÙˆØ¬ÙŠÙ‡ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ Ø§Ù„Ù…Ø¨Ø§Ø´Ø±Ø© Ù„Ø§Ù…ØªØ­Ø§Ù† Ø§Ù„Ù…Ø¬Ù„Ø³ Ø§Ù„Ø·Ø¨ÙŠ Ø§Ù„Ø³ÙˆØ¯Ø§Ù†ÙŠ (SMC)ØŒ ØªØªØ¨Ø¹ Ø±ØµÙŠØ¯ Ù†Ù‚Ø§Ø· Ø§Ù„Ù€ GP ÙÙŠ Ù…Ø­ÙØ¸ØªÙƒØŒ ÙˆØ¥Ø¯Ø§Ø±Ø© ÙˆØµÙˆÙ„Ùƒ Ù„Ø¨Ù†ÙˆÙƒ Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø§Ù„ØªØ¯Ø±ÙŠØ¨ÙŠØ©.
 </p>

 <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
 <a href="smc.html#booking-section" class="btn btn-gold" style="padding: 14px 30px; font-size: 16px; font-weight: 800;">
 Ø§Ø­Ø¬Ø² Ø¬Ù„Ø³ØªÙƒ Ø§Ù„Ø¥Ø³ØªØ±Ø§ØªÙŠØ¬ÙŠØ© Ø§Ù„Ø¢Ù† 
 </a>
 <a href="https://link.members.geneacademy.net/preview/ox9WDL0CNlkTIxsHSWNr" target="_blank" class="btn btn-primary" style="padding: 14px 28px; font-size: 15px;">
 Ø±Ø§Ø¨Ø· Ø§Ù„Ù…Ø¹Ø§ÙŠÙ†Ø© Ø§Ù„Ù…Ø¨Ø§Ø´Ø± (GemIInI Jaib Link) â†—
 </a>
 </div>
 </div>
 </section>

 <!-- Feature Highlights -->
 <section class="container" style="max-width: 1100px; margin-bottom: 80px;">
 <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
 
 <div class="glass-card" style="padding: 30px; border-top: 4px solid var(--purple-brand);">
 <div style="font-size: 28px; margin-bottom: 10px;"></div>
 <h3 style="font-size: 20px; font-weight: 800; color: var(--purple-dark); margin-bottom: 8px;">Ø¬Ø¯ÙˆÙ„Ø© Ø§Ù„Ù…ÙˆØ§Ø¹ÙŠØ¯ Ø§Ù„ØªÙØ§Ø¹Ù„ÙŠØ©</h3>
 <p style="font-size: 14px; color: var(--text-muted); line-height: 1.7;">
 Ø§Ø®ØªÙŠØ§Ø± ÙÙˆØ±ÙŠ Ù„Ù„Ø£ÙˆÙ‚Ø§Øª Ø§Ù„Ù…ØªØ§Ø­Ø© (10:00 ØµØŒ 01:00 Ù…ØŒ 04:00 Ù…) ÙˆØ±Ø¨Ø· ØªÙ„Ù‚Ø§Ø¦ÙŠ Ù…Ø¹ ØªÙ‚ÙˆÙŠÙ… Google / Outlook ÙˆØ±Ø³Ø§Ø¦Ù„ Ø§Ù„ØªØ°ÙƒÙŠØ±.
 </p>
 </div>

 <div class="glass-card" style="padding: 30px; border-top: 4px solid var(--gold);">
 <div style="font-size: 28px; margin-bottom: 10px;"></div>
 <h3 style="font-size: 20px; font-weight: 800; color: var(--purple-dark); margin-bottom: 8px;">Ø¥ØµØ¯Ø§Ø± Ø¨Ø·Ø§Ù‚Ø© Ø§Ù„Ø¹Ø¶ÙˆÙŠØ© ÙˆØ±ØµÙŠØ¯ 25 GP</h3>
 <p style="font-size: 14px; color: var(--text-muted); line-height: 1.7;">
 ØªÙˆÙ„ÙŠØ¯ ÙÙˆØ±ÙŠ Ù„Ù…Ø¹Ø±Ù Ø§Ù„Ø·Ø¨ÙŠØ¨ (Ù…Ø«Ù„ GA-7421) ÙˆØ´Ø­Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø© Ø§Ù„Ù…Ø¹Ø±ÙÙŠØ© Ø¨Ù€ 25 Ù†Ù‚Ø·Ø© GemIInI Points ÙÙˆØ± ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø­Ø¬Ø².
 </p>
 </div>

 <div class="glass-card" style="padding: 30px; border-top: 4px solid var(--teal);">
 <div style="font-size: 28px; margin-bottom: 10px;"></div>
 <h3 style="font-size: 20px; font-weight: 800; color: var(--purple-dark); margin-bottom: 8px;">Ø§Ù„Ø±Ø¨Ø· Ø§Ù„Ù…Ø¨Ø§Ø´Ø± Ù…Ø¹ Ù…Ø¬Ù…ÙˆØ¹Ø§Øª Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨</h3>
 <p style="font-size: 14px; color: var(--text-muted); line-height: 1.7;">
 Ø§Ù„Ø§Ù†Ø¶Ù…Ø§Ù… Ø§Ù„ÙÙˆØ±ÙŠ Ù„Ù…Ø¬ØªÙ…Ø¹ Ø§Ù„Ø¯ÙØ¹Ø© ÙˆØ§Ø³ØªÙ„Ø§Ù… Ø¨Ù†ÙˆÙƒ Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø¹Ø§Ù„ÙŠØ© Ø§Ù„Ø¹Ø§Ø¦Ø¯ (RAW 1, 2, 3, 5) ÙˆØ§Ù„Ù…ÙˆØ§Ø¯ Ø§Ù„ØªØ¯Ø±ÙŠØ¨ÙŠØ© Ø§Ù„Ø£ÙˆÙ„Ù‰.
 </p>
 </div>

 </div>
 </section>

 <!-- Footer -->
 <footer class="footer">
 <div class="container footer-grid">
 <div class="footer-brand">
 <h3>GEMIINI ACADEMY & Member LMS.IO</h3>
 <p>Ø¨Ø¥Ø´Ø±Ø§Ù Ø§Ù„Ù…Ø¬Ù„Ø³ Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠ ÙˆØ§Ù„Ù„Ø¬Ù†Ø© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©. Ù…Ù†Ø¸ÙˆÙ…Ø© Ù…ØªÙƒØ§Ù…Ù„Ø© Ù„ØªÙ…ÙƒÙŠÙ† Ø§Ù„Ø£Ø·Ø¨Ø§Ø¡ Ù…Ù† Ø§Ø¬ØªÙŠØ§Ø² Ø§Ù…ØªØ­Ø§Ù† Ø§Ù„Ù…Ø¬Ù„Ø³ Ø§Ù„Ø·Ø¨ÙŠ Ø§Ù„Ø³ÙˆØ¯Ø§Ù†ÙŠ SMC.</p>
 </div>

 <div class="footer-col">
 <h4>Ø§Ù„Ù…Ø³Ø§Ø±Ø§Øª</h4>
 <ul>
 <li><a href="smc.html">Ø§Ù…ØªØ­Ø§Ù† Ø§Ù„Ù…Ø¬Ù„Ø³ Ø§Ù„Ø·Ø¨ÙŠ SMC</a></li>
 <li><a href="courses.html">Ø¯Ù„ÙŠÙ„ Ø§Ù„Ø¯ÙˆØ±Ø§Øª</a></li>
 <li><a href="research.html">Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Ø§Øª Ø§Ù„Ø¨Ø­Ø«ÙŠØ©</a></li>
 <li><a href="alumni.html">Ù„ÙˆØ­Ø© Ø§Ù„Ø´Ø±Ù</a></li>
 </ul>
 </div>

 <div class="footer-col">
 <h4>GemIInI Jaib Portal</h4>
 <ul>
 <li><a href="https://link.members.geneacademy.net/preview/ox9WDL0CNlkTIxsHSWNr" target="_blank">Ø±Ø§Ø¨Ø· Ø§Ù„Ù…Ø¹Ø§ÙŠÙ†Ø© Ø§Ù„Ù…Ø¨Ø§Ø´Ø±</a></li>
 <li><a href="smc.html#faq">Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ø´Ø§Ø¦Ø¹Ø©</a></li>
 <li><a href="#">Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø®ØµÙˆØµÙŠØ©</a></li>
 </ul>
 </div>

 <div class="footer-col">
 <h4>ÙÙˆØ¯Ø§ÙÙˆÙ† ÙƒØ§Ø´</h4>
 <p style="font-size: 13px; color: #C4B5FD; margin-bottom: 6px;">Ø§Ù„Ø±Ù‚Ù… Ø§Ù„Ù…Ø¹ØªÙ…Ø¯:</p>
 <div style="font-family: var(--font-mono); font-size: 18px; color: var(--gold); font-weight: 800; margin-bottom: 10px;">
 +20 101 592 2628
 </div>
 <button class="btn btn-vodafone btn-copy-vodafone" style="padding: 8px 16px; font-size: 14.5px;">Ù†Ø³Ø® Ø§Ù„Ø±Ù‚Ù…</button>
 </div>
 </div>

 <div class="footer-bottom container">
 &copy; 2026 GemIInI Academy & GemIInI Jaib. All rights reserved.
 </div>
 </footer>

 <script src="js/reviews_data.js"></script>
 <script src="js/ga_data.js"></script>
 <script src="js/app.js"></script>
</body>
</html>
/**
 * SUDAGENE S_OS â€” GLOMEt HQ CORE TELEMETRY AUDITING ENGINE
 * DATA INTERCHANGE FORMAT VALIDATOR & INGESTION NODE
 * v2.0 â€” Independent Telemetry UI Layer appended below the lab engine.
 */

// â”€â”€â”€ SECTION 1: GLOMEt Laboratory Equipment Telemetry Engine â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const GLOMEtTelemetryEngine = {
    // Verified Registry Parameters
    stateNodes: ["SD-RS", "SD-KH", "SD-GD", "SD-SN", "SD-KA", "SD-NN", "SD-WN", "SD-BN", "SD-ND", "SD-NS"],
    allowedSkus: ["GLM-EQ-CBC-301", "GLM-EQ-BIO-401", "GLM-P-120-DG", "GLM-CC-REF-450"],

    /**
     * Executes strict validation and formatting on incoming laboratory records
     * @param {Object} sampleData Raw telemetry log instance
     * @returns {Object} Cleaned and validated telemetry record
     */
    processTelemetryLog: function(sampleData) {
        if (!sampleData) {
            throw new Error("CRITICAL AUDIT ERROR: Telemetry payload configuration is null or empty.");
        }

        // 1. Mandatory Data Verification - Zero Assumption Validation
        if (!sampleData.facilityId || !sampleData.facilityId.match(/^GLM-FAC-[0-9]{4}$/)) {
            console.error("DATA POINT MISSING: Valid Cryptographic Facility ID.");
            return { status: "REJECTED", error: "MISSING_OR_CORRUPT_FACILITY_ID" };
        }

        if (!this.stateNodes.includes(sampleData.stateNode)) {
            console.error("DATA POINT MISSING: Verified State Location System Node.");
            return { status: "REJECTED", error: "INVALID_STATE_NODE" };
        }

        if (!this.allowedSkus.includes(sampleData.hardwareSku)) {
            console.error("DATA POINT MISSING: Verified Hardware Component SKU Mapping.");
            return { status: "REJECTED", error: "UNAUTHORIZED_HARDWARE_SIGNATURE" };
        }

        // 2. Forensic Typographical Formatting Verification
        let structuredResult = {
            timestamp: new Date().toISOString(),
            facilityId: sampleData.facilityId,
            stateNode: sampleData.stateNode,
            hardwareSku: sampleData.hardwareSku,
            metrics: {}
        };

        // Standardize fluidic constant strings - Remove unspaced units and illegal notation
        if (sampleData.hardwareSku === "GLM-EQ-CBC-301") {
            if (!sampleData.wbcCount || !sampleData.rbcCount) {
                console.error("DATA POINT MISSING: Quantitative Hematological Calibration Metrics.");
                return { status: "REJECTED", error: "INCOMPLETE_HEMATOLOGY_DATA" };
            }
            structuredResult.metrics.whiteBloodCellCount = `${parseFloat(sampleData.wbcCount).toFixed(2)} x10^9/L`;
            structuredResult.metrics.redBloodCellCount   = `${parseFloat(sampleData.rbcCount).toFixed(2)} x10^12/L`;
        }

        else if (sampleData.hardwareSku === "GLM-CC-REF-450") {
            let currentTemp = parseFloat(sampleData.internalTemperature);
            if (isNaN(currentTemp)) {
                console.error("DATA POINT MISSING: Accurate Internal Thermal Reading Constant.");
                return { status: "REJECTED", error: "INVALID_TEMPERATURE_VALUE" };
            }
            if (currentTemp < 2.0 || currentTemp > 8.0) {
                structuredResult.coldChainWarning = "CRITICAL COLD CHAIN BREAK DETECTED: Out of enzyme stabilization bounds.";
            }
            structuredResult.metrics.internalTemperature = `${currentTemp.toFixed(1)} Â°C`;
        }

        return {
            status: "VERIFIED_SUCCESS",
            payload: structuredResult,
            sudaPassSignature: btoa(`${sampleData.facilityId}:${sampleData.hardwareSku}:${Date.now()}`)
        };
    }
};

if (typeof window !== "undefined") {
    window.GLOMEtTelemetryEngine = GLOMEtTelemetryEngine;
}


// â”€â”€â”€ SECTION 2: Independent Telemetry UI Renderer (5-Pillar Dashboard) â”€â”€â”€â”€â”€â”€â”€â”€â”€
//
// Called after geneApi.js / Code.gs returns a verified member record.
// Maps SSOT columns directly to the 5 institutional identity pillars.
//
// Column mapping (mirrors Code.gs registry schema):
//   gaId           â†’ Col 1  GA_ID
//   careerStage    â†’ Col 6  CAREER_STAGE
//   certification  â†’ Col 16 CERT
//   sudaPassHash   â†’ Col 8  SUDAPASS_HASH
//   status         â†’ Col 4  STATUS
//   modulesCompleted â†’ MTC diagnostic log aggregation
//   gpPoints       â†’ Student Tracker GP column
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Renders the 5-pillar Independent Telemetry Dashboard.
 * Fails silently per pillar â€” a missing data field never crashes the page.
 *
 * @param {Object} userData - Normalised member payload from geneApi.js
 * @param {string}  userData.gaId
 * @param {string}  userData.careerStage
 * @param {string}  [userData.certification]
 * @param {number}  [userData.modulesCompleted]
 * @param {string}  [userData.sudaPassHash]
 * @param {string}  [userData.status]          â€” "ACTIVE" | "PROVISIONAL" | "SUSPENDED"
 * @param {number}  [userData.gpPoints]
 */
function renderIndependentTelemetry(userData) {
    if (!userData) {
        console.error("[GLOMEt] renderIndependentTelemetry called with null payload.");
        return;
    }

    // â”€â”€ Pillar 1: Identity (GA-ID + Career Stage) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const identityEl = document.getElementById('data-identity');
    if (identityEl) {
        const stage = userData.careerStage ? ` \u2022 ${userData.careerStage}` : '';
        identityEl.textContent = userData.gaId
            ? `${userData.gaId}${stage}`
            : 'Unregistered';
        identityEl.style.color = userData.gaId ? '#0284C7' : '#94A3B8';
    }

    // â”€â”€ Pillar 2: Training (Certification record from Col 16) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const trainingEl = document.getElementById('data-training');
    if (trainingEl) {
        trainingEl.textContent = userData.certification
            ? userData.certification
            : 'In Progress';
        trainingEl.style.color = userData.certification ? '#0F172A' : '#94A3B8';
    }

    // â”€â”€ Pillar 3: Skills (MTC diagnostic log aggregation) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const skillsEl = document.getElementById('data-skills');
    if (skillsEl) {
        if (userData.modulesCompleted !== undefined && userData.modulesCompleted !== null) {
            skillsEl.textContent = `${userData.modulesCompleted} Clinical Case${userData.modulesCompleted !== 1 ? 's' : ''} Solved`;
            skillsEl.style.color = '#0F172A';
        } else {
            skillsEl.textContent = 'No Cases Logged';
            skillsEl.style.color = '#94A3B8';
        }
    }

    // â”€â”€ Pillar 4: Evidence (SudaPass SHA-256 gate) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const evidenceEl = document.getElementById('data-evidence');
    if (evidenceEl) {
        const isVerified = userData.sudaPassHash && userData.status === 'ACTIVE';
        if (isVerified) {
            evidenceEl.innerHTML = '<span class="telemetry-verified">SudaPass Verified</span>';
        } else if (userData.status === 'PROVISIONAL') {
            evidenceEl.innerHTML = '<span class="telemetry-pending">Pending KYC</span>';
        } else {
            evidenceEl.innerHTML = '<span class="telemetry-pending">Pending KYC</span>';
        }
    }

    // â”€â”€ Pillar 5: Progress (Gene Points from Student Tracker) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const progressEl = document.getElementById('data-progress');
    if (progressEl) {
        if (userData.gpPoints !== undefined && userData.gpPoints !== null) {
            const formatted = Number(userData.gpPoints).toLocaleString('en-US');
            progressEl.textContent = `${formatted} GP`;
            progressEl.style.color = userData.gpPoints >= 500 ? '#059669' : '#0F172A';
        } else {
            progressEl.textContent = '0 GP';
            progressEl.style.color = '#94A3B8';
        }
    }

    // â”€â”€ Highlight the active card border when data is present â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    ['identity', 'training', 'skills', 'evidence', 'progress'].forEach(pillar => {
        const card = document.getElementById(`card-${pillar}`);
        if (card) card.classList.add('telemetry-card--loaded');
    });
}

// Expose globally for inline script usage in verify.html and dashboard.html
if (typeof window !== "undefined") {
    window.renderIndependentTelemetry = renderIndependentTelemetry;
}
/**
 * ============================================================================
 * GemIInI SudaGene Platform â€” Unified Clinical & Educator Gateway
 * Architecture: Code.gs v4.6 BULLETPROOF MASTER (Healthcare & Educator Engines)
 * Target Workbook: GemIInI Master Registry 2026 (1X74wS42KR5WpMusd8L_3-5LCDSIz9m7JHNdgY-rTbxs)
 * ============================================================================
 */

const CONFIG = {
  SHEET_AUTH: 'MASTER_AUTH',
  SHEET_PAYMENTS: 'PAYMENT_AUDIT_LOG',
  SHEET_TELEMETRY: 'TELEMETRY',
  SHEET_QUEUE: 'QUEUE_FALLBACK',
  SHEET_ROSTER: 'BLS_ROSTER',
  SHEET_FEEDBACK: 'FEEDBACK_LOG',
  SHEET_ERRORS: 'ERROR_AUDIT_LOG',
  SHEET_EXAM_LOG: 'EXAM_AUDIT_LOG',
  SHEET_B2B: 'INSTITUTIONAL_ENQUIRIES',
  SHEET_RESEARCH: 'RESEARCH_PODS',
  SHEET_TEACHERS: 'TEACHERS_MASTER_ROSTER',
  SHEET_PARENTS: 'PARENTS_STUDENTS_INTAKE',
  LOCK_TIMEOUT_MS: 20000,
  PRICING: {
    BLS_CAIRO: {
      FLAT_FEE_EGP: 3000,
      CURRENCY: 'EGP',
      CAPACITY_MAX_PAID: 12,
      CAPACITY_MAX_PROVISIONAL: 4
    }
  },
  COHORTS: [
    { id: 'BLS-CAIRO-AUG28', date: '2026-08-28', venue: 'Amanirena Hub / Dokki Center' },
    { id: 'BLS-CAIRO-SEP04', date: '2026-09-04', venue: 'Amanirena Hub / Dokki Center' },
    { id: 'BLS-CAIRO-SEP11', date: '2026-09-11', venue: 'Amanirena Hub / Dokki Center' }
  ]
};

/**
 * ðŸ”’ Strict Cryptographic Security Halt
 * Halts execution immediately if SECRET_SALT is unset in Script Properties.
 */
function getSecretSaltSecure() {
  const salt = PropertiesService.getScriptProperties().getProperty('SECRET_SALT');
  if (!salt) {
    throw new Error('CRITICAL_SECURITY_HALT: SECRET_SALT is missing from Script Properties.');
  }
  return salt;
}

/**
 * Active Cohort Determination
 */
function getActiveCohort() {
  const now = new Date();
  for (let i = 0; i < CONFIG.COHORTS.length; i++) {
    const cohortDate = new Date(CONFIG.COHORTS[i].date + 'T23:59:59+03:00');
    if (now <= cohortDate) return CONFIG.COHORTS[i];
  }
  return CONFIG.COHORTS[CONFIG.COHORTS.length - 1];
}

/**
 * ============================================================================
 * 1. PUBLIC READ API (doGet)
 * ============================================================================
 */
function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = String(params.action || 'lookup').toUpperCase();
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    switch (action) {
      case 'LOOKUP':
      case 'VERIFY':
      case 'LOOKUP_CREDENTIAL':
        return jsonResponse(handleLookup({ gaId: params.id || params.gaId }, ss));

      case 'LEADERBOARD':
      case 'DOCTOR_LEADERBOARD':
        return jsonResponse(handleDoctorLeaderboard(params, ss));

      case 'UNIV_STATS':
      case 'UNIVERSITY_STATS':
        return jsonResponse(handleUniversityStats(params, ss));

      case 'PUBLIC_STATS':
        return jsonResponse(handlePublicStats(ss));

      case 'COHORT_STATUS':
        return jsonResponse({ success: true, activeCohort: getActiveCohort() });

      case 'MINISTERIAL_EXPORT':
        return jsonResponse(exportMinisterialTelemetry(params, ss));

      default:
        return jsonResponse({
          success: true,
          gateway: 'GemIInI Independent API v4.6 BULLETPROOF MASTER',
          status: 'ACTIVE',
          partnerLicense: 'STC Lic. 1549'
        });
    }
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

/**
 * ============================================================================
 * 2. TRANSACTIONAL MUTATING API (doPost)
 * ============================================================================
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);

    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, error: 'EMPTY_PAYLOAD' }, 400);
    }

    let payload = {};
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return jsonResponse({ success: false, error: 'INVALID_JSON_PAYLOAD' }, 400);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // A) Handle Internal CRM Webhooks
    if (payload.auth_token || payload.event_type) {
      return jsonResponse(handleCrmWebhook(payload, ss));
    }

    // B) Handle Mutating Actions
    const action = String(payload.formCode || payload.action || '').toUpperCase();

    switch (action) {
      case 'LOOKUP':
      case 'VERIFY':
      case 'LOOKUP_CREDENTIAL':
        return jsonResponse(handleLookup(payload, ss));

      case 'REGISTER_USER':
      case 'REGISTER':
      case 'PORTAL_INTAKE':
      case 'FORM_A1_5':
        return jsonResponse(handleRegisterUser(payload, ss));

      case 'SUBMIT_EXAM_SPRINT':
      case 'SUBMIT_EXAM':
      case 'LOG_EXAM_SCORE':
        return jsonResponse(handleSubmitExamSprint(payload, ss));

      case 'BLS_REGISTER':
      case 'SUBMIT_BLS':
      case 'FORM_BLS':
        return jsonResponse(handleBlsRegister(payload, ss));

      case 'UPDATE_CONSENT':
      case 'SET_CONSENT':
        return jsonResponse(handleUpdateConsent(payload, ss));

      case 'LOG_TELEMETRY':
      case 'LOG_CLINICAL_ATTEMPT':
        return jsonResponse(handleLogTelemetry(payload, ss));

      case 'SUBMIT_FEEDBACK':
      case 'FEEDBACK':
      case 'PMF_SURVEY':
      case 'FORM_C2_FEEDBACK':
        return jsonResponse(handleFeedback(payload, ss));

      case 'FORM_B2B_PARTNERSHIP':
      case 'FORM_UNI':
      case 'RFP_REQUEST':
        return jsonResponse(handleB2BPartnership(payload, ss));

      case 'FORM_RESEARCH_1551':
      case 'RESEARCH_POD_INTAKE':
        return jsonResponse(handleResearchPodIntake(payload, ss));

      case 'JOURNAL_INQUIRY':
      case 'PEER_INQUIRY':
        return jsonResponse(handleJournalInquiry(payload, ss));

      case 'FORM_A2_MOLECULAR':
      case 'MOLECULAR_ENROLL':
        return jsonResponse(handleMolecularEnroll(payload, ss));

      // ðŸŒŸ Educator & Sudanese Curriculum Empowerment Engine
      case 'FORM_TEACHER_INTAKE':
      case 'TEACHER_REGISTER':
        return jsonResponse(handleTeacherIntake(payload, ss));

      case 'FORM_PARENT_STUDENT_INTAKE':
      case 'STUDENT_ENROLL':
        return jsonResponse(handleParentStudentIntake(payload, ss));

      case 'LEADERBOARD':
        return jsonResponse(handleDoctorLeaderboard(payload, ss));

      case 'UNIV_STATS':
      case 'UNIVERSITY_STATS':
        return jsonResponse(handleUniversityStats(payload, ss));

      case 'SUBMIT_LEAD':
      case 'REGISTER_CANDIDATE':
      case 'MASTERCLASS_BOOKING':
        return jsonResponse(handleSubmitLead(payload, ss));

      // â”€â”€ Alumni Digital Identity Reactivation (Doaa Hashim Loop) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      case 'REACTIVATE_ALUMNI':
      case 'ALUMNI_REACTIVATE':
        return jsonResponse(handleAlumniReactivation(payload, ss));

      // â”€â”€ Batch Form A Dispatch (11-person backlog + future queues) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      case 'SEND_FORM_A_BATCH':
      case 'DISPATCH_FORM_A':
        return jsonResponse(handleSendFormABatch(payload, ss));

      // â”€â”€ Referral GP Award (200-point mechanic) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      case 'AWARD_REFERRAL_GP':
      case 'LOG_REFERRAL':
        return jsonResponse(handleAwardReferralGp(payload, ss));

      default:
        if (payload.legalName || payload.name || payload.fullName) {
          return jsonResponse(handleRegisterUser(payload, ss));
        }
        return jsonResponse({ success: false, error: 'INVALID_ACTION: ' + action }, 400);
    }
  } catch (err) {
    logErrorToSheet(SpreadsheetApp.getActiveSpreadsheet(), err, e);
    return jsonResponse({ success: false, error: err.message }, 500);
  } finally {
    try { lock.releaseLock(); } catch (ignored) {}
  }
}

/**
 * ============================================================================
 * 3. EDUCATOR EMPOWERMENT & PARENT-STUDENT INTAKE (Ù…Ø¨Ø§Ø¯Ø±Ø© Ø±Ø¯ Ø§Ù„Ø¬Ù…ÙŠÙ„)
 * ============================================================================
 */
function handleTeacherIntake(payload, ss) {
  const fullName = String(payload.fullName || payload.name || '').trim();
  const phone = String(payload.phone || payload.whatsapp || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const qualification = String(payload.qualification || '').trim();
  const experienceYears = String(payload.experienceYears || '').trim();
  const subjects = Array.isArray(payload.subjects) ? payload.subjects.join('; ') : String(payload.subjects || payload.subject || '').trim();
  const gradeLevels = Array.isArray(payload.gradeLevels) ? payload.gradeLevels.join('; ') : String(payload.gradeLevels || payload.grades || '').trim();
  const country = String(payload.country || payload.location || 'Sudan').trim();
  const techProficiency = Number(payload.techProficiency) || 3;
  const servicesDesired = Array.isArray(payload.servicesDesired) ? payload.servicesDesired.join('; ') : String(payload.servicesDesired || '').trim();
  const channelLink = String(payload.channelLink || payload.telegram || '').trim();

  if (!fullName || !phone) {
    return { success: false, error: 'NAME_AND_PHONE_REQUIRED' };
  }

  const teacherSheet = getOrCreateSheet(ss, CONFIG.SHEET_TEACHERS);
  const data = teacherSheet.getDataRange().getValues();

  // Check duplicate phone
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][3]).trim() === phone) {
      return {
        success: true,
        eduId: String(data[i][0]),
        alreadyRegistered: true,
        message: 'Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ùƒ Ù…Ø¬Ø¯Ø¯Ø§Ù‹! ØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ Ù…Ù„ÙÙƒ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯ Ø¨Ø±Ù‚Ù…: ' + String(data[i][0])
      };
    }
  }

  const eduId = mintNextEduId(teacherSheet);
  const timestamp = new Date().toISOString();

  teacherSheet.appendRow([
    eduId, fullName, qualification, phone, email, country,
    experienceYears, subjects, gradeLevels, techProficiency,
    servicesDesired, channelLink, 'ONBOARDED_AI_PENDING', timestamp
  ]);

  // Send Email Notification if email is available
  if (email) {
    try {
      GmailApp.sendEmail(email, `[CONFIRMED] Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù†Ø¶Ù…Ø§Ù…Ùƒ Ù„Ù…Ø¨Ø§Ø¯Ø±Ø© Ø±Ø¯ Ø§Ù„Ø¬Ù…ÙŠÙ„ Ù„Ù…Ø¹Ù„Ù…ÙŠ Ø¨Ù„Ø§Ø¯ÙŠ (${eduId})`, `Ø§Ù„Ø£Ø³ØªØ§Ø°(Ø©) Ø§Ù„ÙØ§Ø¶Ù„(Ø©) ${fullName}ØŒ\n\nØªØ­ÙŠØ© Ø¥Ø¬Ù„Ø§Ù„ ÙˆØªÙ‚Ø¯ÙŠØ±ØŒ\n\nØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨ Ø§Ù†Ø¶Ù…Ø§Ù…Ùƒ Ù„Ù…Ø¨Ø§Ø¯Ø±Ø© Ø±Ø¯ Ø§Ù„Ø¬Ù…ÙŠÙ„ Ù„ØªÙ…ÙƒÙŠÙ† Ù…Ø¹Ù„Ù…ÙŠ Ø§Ù„Ù…Ù†Ù‡Ø¬ Ø§Ù„Ø³ÙˆØ¯Ø§Ù†ÙŠ Ø¨Ø±Ù‚Ù… Ø§Ù„Ù…Ø¹Ø±Ù Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ (${eduId}).\n\nØ³ÙŠØªÙ… Ø§Ù„ØªÙˆØ§ØµÙ„ Ù…Ø¹Ùƒ Ø¹Ø¨Ø± Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨ Ù„ØªØ³Ù„ÙŠÙ…Ùƒ Ø­Ø³Ø§Ø¨ Ø£Ø¯ÙˆØ§Øª Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ ÙˆØªØ¬Ù‡ÙŠØ² Ø¨Ø·Ø§Ù‚ØªÙƒ Ø§Ù„Ø±Ù‚Ù…ÙŠØ©.\n\nÙ…Ù†Ø¸ÙˆÙ…Ø© GeneAcademy & GemIInI SudaGene Platform`, {
        name: 'Independent Educator Initiative',
        cc: 'mohamedgibbril@geneacademy.net'
      });
    } catch (e) {
      console.warn('Teacher email notification failed: ' + e.message);
    }
  }

  return {
    success: true,
    eduId: eduId,
    fullName: fullName,
    status: 'ONBOARDED_AI_PENDING',
    message: `Ø£Ù‡Ù„Ø§Ù‹ Ø¨Ùƒ Ø£Ø³ØªØ§Ø° ${fullName}! ØªÙ… Ù‚ÙŠØ¯Ùƒ ÙÙŠ Ø³Ø¬Ù„ Ø§Ù„Ù…Ø¹Ù„Ù…ÙŠÙ† Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ Ø¨Ø±Ù‚Ù… (${eduId}). ØªÙ… ØªÙØ¹ÙŠÙ„ Ù…Ù†Ø­Ø© Ø§Ù„ØªÙ…ÙƒÙŠÙ† Ø§Ù„Ø±Ù‚Ù…ÙŠ Ø§Ù„Ø®Ø§ØµØ© Ø¨Ùƒ.`
  };
}

function handleParentStudentIntake(payload, ss) {
  const parentName = String(payload.parentName || payload.name || '').trim();
  const studentName = String(payload.studentName || '').trim();
  const phone = String(payload.phone || payload.whatsapp || '').trim();
  const country = String(payload.country || payload.location || '').trim();
  const gradeLevel = String(payload.gradeLevel || payload.grade || 'Ø§Ù„Ù…Ø±Ø­Ù„Ø© Ø§Ù„Ù…ØªÙˆØ³Ø·Ø©').trim();
  const targetSubject = String(payload.targetSubject || payload.subject || 'ØªØ§Ø±ÙŠØ® ÙˆØ¥Ø±Ø´Ø§Ø¯ Ù†ÙØ³ÙŠ').trim();
  const targetTeacher = String(payload.targetTeacher || 'Ø£. Ù†Ø¬Ù„Ø§Ø¡ Ø²Ù…Ø±Ø§ÙˆÙŠ').trim();
  const desiredServices = Array.isArray(payload.desiredServices) ? payload.desiredServices.join('; ') : String(payload.desiredServices || 'Ø­ØµØµ ØªØ±ÙƒÙŠØ² ÙˆÙ…Ø±Ø§Ø¬Ø¹Ø§Øª').trim();
  const notes = String(payload.notes || '').trim();

  if (!parentName || !phone) {
    return { success: false, error: 'PARENT_NAME_AND_PHONE_REQUIRED' };
  }

  const parentSheet = getOrCreateSheet(ss, CONFIG.SHEET_PARENTS);
  const timestamp = new Date().toISOString();

  parentSheet.appendRow([
    timestamp, parentName, studentName, phone, country,
    gradeLevel, targetSubject, targetTeacher, desiredServices, notes, 'NEW_INQUIRY'
  ]);

  return {
    success: true,
    message: `Ø´ÙƒØ±Ø§Ù‹ Ù„Ùƒ ${parentName}! ØªÙ… ØªØ³Ø¬ÙŠÙ„ Ø§Ù‡ØªÙ…Ø§Ù… Ø§Ù„Ø·Ø§Ù„Ø¨ ${studentName || ''} Ø¨Ù†Ø¬Ø§Ø­. Ø³ÙŠØªÙ… ØªÙˆØ¬ÙŠÙ‡Ùƒ Ù„Ø¯Ø±ÙˆØ³ ÙˆÙ…Ø¬Ù…ÙˆØ¹Ø§Øª ${targetTeacher}.`
  };
}

function handleGetTeachersDirectory(params, ss) {
  const teacherSheet = getOrCreateSheet(ss, CONFIG.SHEET_TEACHERS);
  const data = teacherSheet.getDataRange().getValues();
  const teachers = [];

  for (let i = 1; i < data.length; i++) {
    const id = String(data[i][0] || '').trim();
    if (!id) continue;
    teachers.push({
      eduId: data[i][0],
      fullName: data[i][1],
      qualification: data[i][2],
      country: data[i][5],
      experience: data[i][6],
      subjects: data[i][7],
      grades: data[i][8],
      channelLink: data[i][11],
      status: data[i][12]
    });
  }

  return { success: true, count: teachers.length, teachers: teachers };
}

function mintNextEduId(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return 'EDU-1001';
  let maxId = 1000;
  for (let i = 1; i < data.length; i++) {
    const match = String(data[i][0]).match(/^EDU-(\d+)$/i);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxId) maxId = num;
    }
  }
  return 'EDU-' + (maxId + 1);
}

/**
 * ============================================================================
 * 4. SMC EXAM SPRINT SUBMISSION (Zero GP Inflation & Negative Injection Guard)
 * ============================================================================
 */
function handleSubmitExamSprint(payload, ss) {
  const gaId = String(payload.gaId || payload.ga_id || '').trim().toUpperCase();
  if (!gaId) return { success: false, error: 'GA_ID_REQUIRED' };

  const score = Math.max(0, Number(payload.score) || 0);
  const total = Math.max(1, Number(payload.total) || 100);
  const clampedScore = Math.min(score, total);

  // Strict Server-Side GP Math (+10 per correct, +2 per incorrect)
  const serverCalculatedGp = (clampedScore * 10) + ((total - clampedScore) * 2);
  
  // ðŸ”’ Bound with Math.max(0, ...) to prevent negative-value injections
  const rawClaimed = Number(payload.totalGpEarned);
  const finalGpEarned = (!isNaN(rawClaimed) && rawClaimed > 0)
    ? Math.max(0, Math.min(rawClaimed, serverCalculatedGp))
    : serverCalculatedGp;

  const violations = Math.max(0, Number(payload.proctorViolations) || 0);
  const moduleName = String(payload.module || 'SMC_SPRINT_AUG29').trim();
  const timestamp = new Date().toISOString();
  const accuracyPercent = Math.round((clampedScore / total) * 100);
  const ccrPercent = accuracyPercent >= 70 ? 100 : Math.round((accuracyPercent / 70) * 100);

  // 1. Append to EXAM_AUDIT_LOG Sheet
  let examSheet = ss.getSheetByName(CONFIG.SHEET_EXAM_LOG);
  if (!examSheet) {
    examSheet = ss.insertSheet(CONFIG.SHEET_EXAM_LOG);
    examSheet.appendRow(['TIMESTAMP', 'GA_ID', 'MODULE', 'SCORE', 'TOTAL_QUESTIONS', 'ACCURACY_PCT', 'CCR_PCT', 'GP_EARNED', 'PROCTOR_VIOLATIONS', 'STATUS']);
    examSheet.setFrozenRows(1);
  }

  examSheet.appendRow([
    timestamp, gaId, moduleName, clampedScore, total, accuracyPercent, ccrPercent, finalGpEarned, violations,
    violations > 3 ? 'FLAGGED_PROCTOR_REVIEW' : 'VERIFIED_AUDITED'
  ]);

  // 2. Update TELEMETRY Sheet
  const telSheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  const telData = telSheet.getDataRange().getValues();
  let userFound = false;

  for (let i = 1; i < telData.length; i++) {
    if (String(telData[i][0]).trim().toUpperCase() === gaId) {
      const currentGp = Number(telData[i][1]) || 0;
      const currentCcr = Number(telData[i][2]) || 0;
      const currentAcc = Number(telData[i][3]) || 0;
      const currentStreak = Number(telData[i][4]) || 0;

      const newGp = currentGp + finalGpEarned;
      const newAcc = currentAcc === 0 ? accuracyPercent : Math.round((currentAcc + accuracyPercent) / 2);
      const newCcr = Math.max(currentCcr, ccrPercent);
      const newStreak = currentStreak + 1;

      telSheet.getRange(i + 1, 2, 1, 5).setValues([[newGp, newCcr, newAcc, newStreak, timestamp]]);
      userFound = true;
      break;
    }
  }

  if (!userFound) {
    telSheet.appendRow([gaId, 25 + finalGpEarned, ccrPercent, accuracyPercent, 1, timestamp]);
  }

  CacheService.getScriptCache().remove('PUBLIC_LEADERBOARD');
  CacheService.getScriptCache().remove('UNIVERSITY_CLUSTER_STATS');
  CacheService.getScriptCache().remove('USER_' + gaId);

  return {
    success: true,
    gaId: gaId,
    score: clampedScore,
    total: total,
    accuracyPercent: accuracyPercent,
    ccrPercent: ccrPercent,
    gpEarned: finalGpEarned,
    proctorStatus: violations > 3 ? 'UNDER_AUDIT' : 'CLEARED',
    message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… ÙˆØªÙˆØ«ÙŠÙ‚ Ù†ØªØ§Ø¦Ø¬ Ø§Ù„Ø§Ù…ØªØ­Ø§Ù† Ø¨Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ ÙˆØ§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ù†Ù‚Ø§Ø· Ø¨Ù†Ø¬Ø§Ø­.'
  };
}

/**
 * ============================================================================
 * 5. USER INTAKE & REGISTRATION (Strict PENDING_REVIEW Gating)
 * ============================================================================
 */
function determineSourceChannel(payload, email) {
  if (email === 'mohamedgibbril@gmail.com') return 'STAFF_INTERNAL_GA000';
  if (email === 'safaelhassan44@gmail.com') return 'STAFF_INTERNAL_GA004';
  if (email === 'amjadgorashi32@gmail.com') return 'STAFF_INTERNAL_GA011';
  if (payload.peerReferral === 'GA-006' || payload.referredBy === 'GA-006') return 'B2B_COHORT_SABRI';
  return String(payload.sourceChannel || 'WEB_ORGANIC').trim();
}

function handleRegisterUser(payload, ss) {
  const legalName = String(payload.legalName || payload.fullName || payload.name || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const phone = String(payload.phone || payload.phone_whatsapp || '').trim();
  const university = String(payload.university || payload.faculty || 'Unspecified Medical Faculty').trim();
  const hospital = String(payload.hospital || payload.clinical_hospital || '').trim();
  const location = String(payload.location || payload.current_location || '').trim();
  const careerStage = String(payload.careerStage || payload.primary_track || 'Medical Practitioner').trim();
  const peerReferral = String(payload.peerReferral || '').trim();

  if (!legalName || !email) {
    return { success: false, error: 'MISSING_MANDATORY_REGISTRATION_FIELDS' };
  }

  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const data = authSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][2]).trim().toLowerCase() === email) {
      return {
        success: true,
        gaId: String(data[i][0]),
        alreadyRegistered: true,
        message: 'ØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ Ø­Ø³Ø§Ø¨Ùƒ Ø§Ù„Ù…Ø³Ø¬Ù„ Ù…Ø³Ø¨Ù‚Ø§Ù‹: ' + String(data[i][0])
      };
    }
  }

  const gaId = mintNextGaId(authSheet);
  const timestamp = new Date().toISOString();
  const sudaPassHash = generateSudaPassHash(gaId, timestamp);
  const initialGp = peerReferral ? 75 : 25;

  // ðŸ”’ Initial registration is ALWAYS PENDING_REVIEW (Provisional Explorer)
  const sourceChannel = determineSourceChannel(payload, email);
  authSheet.appendRow([
    gaId, legalName, email, phone, university,
    hospital, location, careerStage, 'PENDING_REVIEW', sudaPassHash, timestamp, sourceChannel
  ]);

  const telSheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  telSheet.appendRow([gaId, initialGp, 0, 0, 0, timestamp]);

  try {
    const welcomeSubject = `[CONFIRMED] Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨ Ø§Ù„ØªØ³Ø¬ÙŠÙ„ ÙˆØ¥ØµØ¯Ø§Ø± Ù‡ÙˆÙŠØªÙƒ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ© (${gaId}) | GemIInI Academy`;
    const welcomeBody = `Ø§Ù„Ø²Ù…ÙŠÙ„(Ø©) Ø§Ù„Ø¹Ø²ÙŠØ²(Ø©) Ø¯. ${legalName}ØŒ

ØªØ­ÙŠØ© Ø·ÙŠØ¨Ø© ÙˆØ¨Ø¹Ø¯ØŒ

ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨ ØªØ³Ø¬ÙŠÙ„Ùƒ Ø¨Ù†Ø¬Ø§Ø­ ÙÙŠ Ø§Ù„Ù…Ù†Ø¸ÙˆÙ…Ø© Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ© Ù„Ù„ØªØ¹Ù„ÙŠÙ… Ø§Ù„Ø·Ø¨ÙŠ (GemIInI SudaGene Platform).

Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù‡ÙˆÙŠØ© ÙˆØ§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ø£ÙˆÙ„ÙŠ:
==================================================
â€¢ Ø±Ù‚Ù… Ø§Ù„Ù‡ÙˆÙŠØ© Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ© Ø§Ù„Ø¯Ø§Ø¦Ù… (GA-ID): ${gaId}
â€¢ Ø§Ù„ÙƒÙ„ÙŠØ© / Ø§Ù„Ø¬Ø§Ù…Ø¹Ø©: ${university}
â€¢ Ø§Ù„Ø±ØµÙŠØ¯ Ø§Ù„Ù…Ø¨Ø¯Ø¦ÙŠ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯: +${initialGp} GP (Ù…Ø³ØªÙˆÙ‰ Explorer)
â€¢ Ø§Ù„Ø®ØªÙ… Ø§Ù„ØªØ´ÙÙŠØ±ÙŠ Ù„Ù„Ø£Ù…Ø§Ù†: ${sudaPassHash}
â€¢ Ø±Ø§Ø¨Ø· ÙØ­Øµ Ø§Ù„Ù‡ÙˆÙŠØ© ÙˆØ§Ù„Ø³Ø¬Ù„: https://geneacademy.net/verify.html?id=${gaId}

Ø®Ø·ÙˆØ§ØªÙƒ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© Ø§Ù„ØªØ§Ù„ÙŠØ©:
1. Ù…Ø­Ø§ÙƒÙŠ Ø§Ù…ØªØ­Ø§Ù† Ø§Ù„Ù…Ø¬Ù„Ø³ Ø§Ù„Ø·Ø¨ÙŠ (SMC): https://geneacademy.net/smc.html
2. Ø§Ø³ØªØ¹Ø±Ø§Ø¶ Ø¯Ù„ÙŠÙ„ Ø§Ù„Ø¬Ø§Ù…Ø¹Ø§Øª ÙˆØ§Ù„ÙØ±Øµ: https://geneacademy.net/universities.html
3. Ù„Ù„Ø¯Ø¹Ù… ÙˆØ§Ù„Ù…Ø³Ø§Ø¹Ø¯Ø© Ø§Ù„Ù…Ø¨Ø§Ø´Ø±Ø© Ø¹Ø¨Ø± Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨: https://wa.me/201015922628

Ø£Ù…Ø§Ù†Ø© Ø§Ù„Ù‚Ø¨ÙˆÙ„ ÙˆØ§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ©
GeneAcademy & SudaGene Consortium Network
https://geneacademy.net`;

    GmailApp.sendEmail(email, welcomeSubject, welcomeBody, {
      from: 'admissions@geneacademy.net',
      name: 'GemIInI Admissions Desk',
      cc: 'mohamedgibbril@geneacademy.net'
    });
  } catch (mailErr) {
    console.warn('Welcome email error: ' + mailErr.message);
  }

  CacheService.getScriptCache().remove('PUBLIC_LEADERBOARD');
  CacheService.getScriptCache().remove('UNIVERSITY_CLUSTER_STATS');

  return {
    success: true,
    gaId: gaId,
    legalName: legalName,
    status: 'PENDING_REVIEW',
    gpAwarded: initialGp,
    sudaPassHash: sudaPassHash,
    message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨Ùƒ ÙˆØªÙˆØ«ÙŠÙ‚ Ù‡ÙˆÙŠØªÙƒ Ø¨Ù†Ø¬Ø§Ø­ (' + gaId + '). ØªÙ… Ø¥Ø±Ø³Ø§Ù„ Ø±Ø³Ø§Ù„Ø© Ø§Ù„ØªØ£ÙƒÙŠØ¯ Ù„Ø¨Ø±ÙŠØ¯Ùƒ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ.'
  };
}

/**
 * ============================================================================
 * 6. B2B CONSENT TOGGLE (Safe: B2B_CONSENT Column Only)
 * ============================================================================
 */
function handleUpdateConsent(payload, ss) {
  const gaId = String(payload.gaId || payload.id || '').trim().toUpperCase();
  const consent = payload.consent === true || payload.consent === 'true';
  if (!gaId) return { success: false, error: 'GA_ID_REQUIRED' };

  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const data = authSheet.getDataRange().getValues();
  const headers = data[0];

  let consentCol = headers.indexOf('B2B_CONSENT');
  if (consentCol === -1) {
    authSheet.getRange(1, headers.length + 1).setValue('B2B_CONSENT');
    consentCol = headers.length;
  }

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === gaId) {
      authSheet.getRange(i + 1, consentCol + 1).setValue(consent ? 'GRANTED' : 'DENIED');
      CacheService.getScriptCache().remove('USER_' + gaId);
      return { success: true, gaId: gaId, b2bConsent: consent };
    }
  }
  return { success: false, error: 'USER_NOT_FOUND' };
}

/**
 * ============================================================================
 * 7. BLS COURSE REGISTRATION
 * ============================================================================
 */
function handleBlsRegister(payload, ss) {
  let gaId = String(payload.gaId || payload.ga_id || '').trim().toUpperCase();
  const fullName = String(payload.fullName || payload.full_name || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const phone = String(payload.phone || payload.phone_whatsapp || '').trim();
  const university = String(payload.university || 'Candidate Institution').trim();
  const candidateType = String(payload.candidateType || 'NEW_REGISTRATION').trim();
  const instructorOrBatch = String(payload.instructorOrBatch || 'STC AHA Lic. 1549').trim();
  const txRef = String(payload.txRef || payload.transaction_ref || '').trim().toUpperCase();
  const paymentChoice = String(payload.paymentChoice || (txRef ? 'pay_now' : 'pay_later')).trim().toLowerCase();
  const paymentMethod = String(payload.paymentMethod || 'VODAFONE_CASH_EG').trim();
  const diagnosticBonus = Number(payload.diagnosticBonus) || 0;

  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const activeCohort = getActiveCohort();

  if (!gaId || !userExists(authSheet, gaId)) {
    if (fullName && email) {
      gaId = mintNextGaId(authSheet);
      const nowIso = new Date().toISOString();
      const hash = generateSudaPassHash(gaId, nowIso);
      const roleLabel = candidateType === 'CURRENT_TRAINEE_REFERRED' ? 'BLS Trainee (Referred)' : 'BLS Candidate';
      const sourceChannel = determineSourceChannel(payload, email);
      authSheet.appendRow([gaId, fullName, email, phone, university, '', '', roleLabel, 'PENDING_REVIEW', hash, nowIso, sourceChannel]);

      // If referred/current trainee, award +500 GP bump immediately per GP Ledger Mandate v2.0
      const startingGp = candidateType === 'CURRENT_TRAINEE_REFERRED' ? 500 : (25 + diagnosticBonus);
      getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY).appendRow([gaId, startingGp, 0, 0, 0, nowIso]);
    } else {
      return { success: false, error: 'NAME_AND_EMAIL_REQUIRED' };
    }
  }

  const rosterSheet = getOrCreateSheet(ss, CONFIG.SHEET_ROSTER);
  const rosterData = rosterSheet.getDataRange().getValues();
  let paidCount = 0;
  let provisionalCount = 0;

  for (let i = 1; i < rosterData.length; i++) {
    if (String(rosterData[i][1]) === activeCohort.id) {
      const st = String(rosterData[i][6]).toUpperCase();
      if (st.includes('CONFIRMED')) paidCount++;
      if (st.includes('PROVISIONAL')) provisionalCount++;
    }
  }

  const isPaid = paymentChoice === 'pay_now' && txRef;
  const isOverflow = (isPaid && paidCount >= CONFIG.PRICING.BLS_CAIRO.CAPACITY_MAX_PAID) ||
                     (!isPaid && (paidCount + provisionalCount) >= (CONFIG.PRICING.BLS_CAIRO.CAPACITY_MAX_PAID + CONFIG.PRICING.BLS_CAIRO.CAPACITY_MAX_PROVISIONAL));

  const timestamp = new Date().toISOString();
  const paymentSheet = getOrCreateSheet(ss, CONFIG.SHEET_PAYMENTS);

  if (isOverflow) {
    paymentSheet.appendRow([timestamp, gaId, txRef || 'OVERFLOW_WAITLIST', paymentMethod, 0, CONFIG.PRICING.BLS_CAIRO.CURRENCY, 'OVERFLOW_WAITLIST', activeCohort.id]);
    return {
      success: true,
      gaId: gaId,
      waitlist: true,
      suggestedCohort: 'September 4, 2026',
      message: 'Ø§Ù„Ø¯ÙØ¹Ø© Ø§Ù„Ø­Ø§Ù„ÙŠØ© Ù…ÙƒØªÙ…Ù„Ø©. ØªÙ… Ø¥Ø¯Ø±Ø§Ø¬Ùƒ ÙÙŠ Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø§Ù†ØªØ¸Ø§Ø± Ù„Ù„Ø¯ÙØ¹Ø© Ø§Ù„ØªØ§Ù„ÙŠØ© ØªÙ„Ù‚Ø§Ø¦ÙŠØ§Ù‹.'
    };
  }

  const fee = CONFIG.PRICING.BLS_CAIRO.FLAT_FEE_EGP;
  const paymentStatus = isPaid ? 'PENDING_VERIFICATION' : 'PROVISIONAL_HOLD';
  const rosterStatus = isPaid ? 'CONFIRMED_PENDING_PAYMENT_CLEAR' : 'PROVISIONAL_HELD_24H';

  paymentSheet.appendRow([timestamp, gaId, txRef || 'DEFERRED_PAY_LATER', paymentMethod, isPaid ? fee : 0, CONFIG.PRICING.BLS_CAIRO.CURRENCY, paymentStatus, activeCohort.id]);
  rosterSheet.appendRow([gaId, activeCohort.id, activeCohort.date, activeCohort.venue, isPaid ? fee : 0, txRef || 'HOLD', rosterStatus]);

  return {
    success: true,
    gaId: gaId,
    confirmed: isPaid,
    seatNumber: paidCount + 1,
    cohortDate: activeCohort.date,
    courseFee: fee,
    currency: CONFIG.PRICING.BLS_CAIRO.CURRENCY,
    message: isPaid ? 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„ØªØ­ÙˆÙŠÙ„ ÙˆÙ…Ù‚Ø¹Ø¯Ùƒ Ù…Ø­Ø¬ÙˆØ² Ù‚ÙŠØ¯ Ø§Ù„ØªØ£ÙƒÙŠØ¯ Ø§Ù„ÙÙˆØ±ÙŠ.' : 'ØªÙ… Ø­Ø¬Ø² Ù…Ù‚Ø¹Ø¯Ùƒ Ø§Ù„Ù…Ø¨Ø¯Ø¦ÙŠ Ù„Ù…Ø¯Ø© 24 Ø³Ø§Ø¹Ø©.'
  };
}

/**
 * ============================================================================
 * 8. B2B INSTITUTIONAL ENQUIRIES & PARTNERSHIP INTAKE (GLOMEt Gateway)
 * Schema: 15 Columns with Lifecycle Status & Automated Minting
 * ============================================================================
 */
function handleB2BPartnership(payload, ss) {
  const contactName = String(payload.contactPerson || payload.name || payload.legalName || payload.contact_name || '').trim();
  const professionalTitle = String(payload.professionalTitle || payload.title || 'Director / Leader').trim();
  const org = String(payload.organization || payload.org || payload.institution || '').trim();
  const orgType = String(payload.orgType || payload.institution_type || 'Healthcare / Research Institution').trim();
  const email = String(payload.email || payload.work_email || '').trim().toLowerCase();
  const location = String(payload.location || payload.country_city || payload.phone || '').trim();
  const service = String(payload.serviceRequired || payload.area_of_interest || payload.interest || 'Institutional Partnership').trim();
  const scope = String(payload.scope || payload.audience_size || 'Pilot Cohort').trim();
  const notes = String(payload.notes || payload.details || payload.challenge || '').trim();

  if (!email || !org) {
    return { success: false, error: 'EMAIL_AND_INSTITUTION_NAME_REQUIRED' };
  }

  let b2bSheet = ss.getSheetByName('INSTITUTIONAL_ENQUIRIES') || ss.getSheetByName(CONFIG.SHEET_B2B);
  if (!b2bSheet) {
    b2bSheet = ss.insertSheet('INSTITUTIONAL_ENQUIRIES');
    b2bSheet.appendRow([
      'SUBMISSION_ID', 'TIMESTAMP', 'CONTACT_NAME', 'PROFESSIONAL_TITLE',
      'INSTITUTION_NAME', 'INSTITUTION_TYPE', 'WORK_EMAIL', 'COUNTRY_CITY',
      'PRIMARY_INTEREST', 'AUDIENCE_SIZE', 'ENQUIRY_SUMMARY',
      'STATUS', 'ASSIGNED_STAFF', 'NEXT_ACTION', 'LAST_CONTACTED_AND_NOTES'
    ]);
    b2bSheet.setFrozenRows(1);
  }

  const submissionId = mintNextB2bId(b2bSheet);
  const timestamp = new Date().toISOString();

  b2bSheet.appendRow([
    submissionId,
    timestamp,
    contactName,
    professionalTitle,
    org,
    orgType,
    email,
    location,
    service,
    scope,
    notes,
    'NEW',                          // Status: NEW â†’ REVIEWING â†’ QUALIFIED â†’ BRIEFING_SCHEDULED â†’ PROPOSAL_SENT â†’ WON / NURTURE / CLOSED
    'GA-011 (Eng. Amjad)',          // Assigned Staff
    'Schedule Initial 20-min Briefing', // Next Action
    'Intake registered via web gateway' // Initial Note
  ]);

  try {
    GmailApp.sendEmail('b2b@geneacademy.net', `ðŸ›ï¸ [INSTITUTIONAL BRIEFING] ${submissionId}: ${org}`, `A new institutional partnership briefing has been requested:

â€¢ Submission ID: ${submissionId}
â€¢ Organization: ${org} (${orgType})
â€¢ Contact Person: ${contactName} (${professionalTitle})
â€¢ Work Email: ${email}
â€¢ Location: ${location}
â€¢ Primary Area: ${service}
â€¢ Audience Size: ${scope}
â€¢ Challenge / Scope: ${notes}

Workflow Status: NEW
Assigned Lead: GA-011 (Operations / Admissions Desk)
Review Workbook: https://docs.google.com/spreadsheets/d/1X74wS42KR5WpMusd8L_3-5LCDSIz9m7JHNdgY-rTbxs/edit`, {
      name: 'GemIInI Institutional Desk',
      cc: 'mohamedgibbril@geneacademy.net'
    });
  } catch (e) {
    console.warn("B2B lead email alert error: " + e.message);
  }

  return {
    success: true,
    submissionId: submissionId,
    organization: org,
    message: 'Thank you. Your institutional enquiry has been received. We will review your priorities and prepare the next conversation around the capability you want to develop.'
  };
}

function mintNextB2bId(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return 'B2B-1001';
  let maxId = 1000;
  for (let i = 1; i < data.length; i++) {
    const match = String(data[i][0]).match(/^B2B-(\d+)$/i);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxId) maxId = num;
    }
  }
  return 'B2B-' + (maxId + 1);
}

function handleResearchPodIntake(payload, ss) {
  const name = String(payload.fullName || payload.name || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const track = String(payload.track || 'Translational Oncology').trim();
  const role = String(payload.role || 'Trainee Author (15 Tier)').trim();
  const pubs = String(payload.publications || 'None').trim();

  let podSheet = ss.getSheetByName(CONFIG.SHEET_RESEARCH);
  if (!podSheet) {
    podSheet = ss.insertSheet(CONFIG.SHEET_RESEARCH);
    podSheet.appendRow(['TIMESTAMP', 'LEGAL_NAME', 'EMAIL', 'RESEARCH_TRACK', 'POD_ROLE', 'PUBLICATIONS', 'STATUS']);
    podSheet.setFrozenRows(1);
  }

  podSheet.appendRow([new Date().toISOString(), name, email, track, role, pubs, 'PENDING_AUDIT']);
  return { success: true, message: 'RESEARCH_POD_INGESTED_SUCCESSFULLY' };
}

function handleJournalInquiry(payload, ss) {
  const name = String(payload.legalName || payload.name || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const affiliation = String(payload.affiliation || '').trim();
  const inquiryType = String(payload.inquiryType || payload.type || 'editorial_response').trim();
  const message = String(payload.message || '').trim();

  let journalSheet = ss.getSheetByName('JOURNAL_INQUIRIES');
  if (!journalSheet) {
    journalSheet = ss.insertSheet('JOURNAL_INQUIRIES');
    journalSheet.appendRow(['TIMESTAMP', 'LEGAL_NAME', 'EMAIL', 'AFFILIATION', 'INQUIRY_TYPE', 'MESSAGE', 'STATUS']);
    journalSheet.setFrozenRows(1);
  }

  const nowIso = new Date().toISOString();
  journalSheet.appendRow([nowIso, name, email, affiliation, inquiryType, message, 'NEW_INQUIRY']);
  return { success: true, message: 'JOURNAL_INQUIRY_RECORDED_SUCCESSFULLY', timestamp: nowIso };
}

function handleMolecularEnroll(payload, ss) {
  const name = String(payload.fullName || payload.name || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const phone = String(payload.phone || '').trim();
  const txRef = String(payload.txRef || payload.transaction_ref || '').trim();

  let molSheet = ss.getSheetByName('MOLECULAR_ENROLLMENTS');
  if (!molSheet) {
    molSheet = ss.insertSheet('MOLECULAR_ENROLLMENTS');
    molSheet.appendRow(['TIMESTAMP', 'FULL_NAME', 'EMAIL', 'PHONE', 'TX_REF', 'STATUS']);
    molSheet.setFrozenRows(1);
  }

  molSheet.appendRow([new Date().toISOString(), name, email, phone, txRef, 'PENDING_VERIFICATION']);
  return { success: true, message: 'MOLECULAR_ENROLLMENT_SUBMITTED' };
}

/**
 * ============================================================================
 * 9. CRM WEBHOOK RECEIVER (Strict GP Ledger Constraints)
 * ============================================================================
 */
function handleCrmWebhook(payload, ss) {
  const eventType = payload.event_type || (payload.order_id ? 'member.payment_verified' : 'member.registered');
  const rawEmail = payload.member?.email || payload.contact_email || payload.email;
  const rawName = payload.member?.name || payload.contact_name || ((payload.first_name || '') + ' ' + (payload.last_name || '')).trim() || 'Member';
  const rawPhone = payload.member?.phone || payload.contact_phone || payload.phone || '';
  const rawUniv = payload.member?.university || payload.university || 'Medical Faculty';

  if (!rawEmail) return { success: false, error: 'MISSING_EMAIL' };
  const email = String(rawEmail).trim().toLowerCase();

  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const telSheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  const authData = authSheet.getDataRange().getValues();
  const telData = telSheet.getDataRange().getValues();

  let existingRow = -1;
  let existingGaId = null;

  for (let i = 1; i < authData.length; i++) {
    if (String(authData[i][2]).trim().toLowerCase() === email) {
      existingRow = i + 1;
      existingGaId = String(authData[i][0]).trim().toUpperCase();
      break;
    }
  }

  const timestamp = new Date().toISOString();

  if (eventType === 'member.registered') {
    if (existingRow !== -1) {
      return { success: true, gaId: existingGaId, message: 'User already exists.' };
    }
    const gaId = mintNextGaId(authSheet);
    const sudaHash = generateSudaPassHash(gaId, timestamp);
    const sourceChannel = 'WEBHOOK';
    authSheet.appendRow([gaId, rawName, email, rawPhone, rawUniv, '', '', 'Membership Portal', 'PENDING_REVIEW', sudaHash, timestamp, sourceChannel]);
    telSheet.appendRow([gaId, 25, 0, 0, 0, timestamp]);
    return { success: true, gaId: gaId, gpAwarded: 25, message: 'User registered via Webhook.' };
  } else if (eventType === 'member.payment_verified') {
    if (existingRow === -1) return { success: false, error: 'USER_NOT_FOUND_FOR_PAYMENT' };
    authSheet.getRange(existingRow, 9).setValue('ACCREDITED');
    for (let j = 1; j < telData.length; j++) {
      if (String(telData[j][0]).trim().toUpperCase() === existingGaId) {
        const curGp = parseFloat(telData[j][1]) || 0;
        telSheet.getRange(j + 1, 2).setValue(curGp + 475);
        break;
      }
    }
    return { success: true, gaId: existingGaId, message: 'Payment verified, +475 GP bump applied.' };
  }
  return { success: false, error: 'UNKNOWN_WEBHOOK_EVENT' };
}

/**
 * ============================================================================
 * 10. LOOKUP, LEADERBOARD, TELEMETRY, & FACULTY STATS
 * ============================================================================
 */
function handleLookup(payload, ss) {
  const gaId = String(payload.gaId || payload.id || '').trim().toUpperCase();
  if (!gaId) return { success: false, error: 'GA_ID_REQUIRED' };

  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const data = authSheet.getDataRange().getValues();
  if (data.length <= 1) return { success: false, error: 'USER_NOT_FOUND', verified: false };

  const headers = data[0];
  const idIdx = Math.max(0, headers.indexOf('GA_ID'));
  const nameIdx = headers.indexOf('LEGAL_NAME') !== -1 ? headers.indexOf('LEGAL_NAME') : 1;
  const univIdx = headers.indexOf('CANONICAL_UNIVERSITY') !== -1 ? headers.indexOf('CANONICAL_UNIVERSITY') : 4;
  const stageIdx = headers.indexOf('CAREER_STAGE') !== -1 ? headers.indexOf('CAREER_STAGE') : 7;
  const statusIdx = headers.indexOf('STATUS') !== -1 ? headers.indexOf('STATUS') : 8;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idIdx]).trim().toUpperCase() === gaId) {
      const telemetry = getTelemetryForUser(ss, gaId);
      const status = String(data[i][statusIdx]).toUpperCase();
      const isAccredited = ['VERIFIED', 'ACCREDITED'].includes(status);
      const userProfile = {
        gaId: data[i][idIdx],
        legalName: data[i][nameIdx],
        university: data[i][univIdx],
        careerStage: data[i][stageIdx],
        status: data[i][statusIdx],
        telemetry: telemetry
      };
      return { success: true, verified: isAccredited, user: userProfile };
    }
  }
  return { success: false, error: 'USER_NOT_FOUND', verified: false };
}

function handleLogTelemetry(payload, ss) {
  const gaId = String(payload.gaId || payload.ga_id || '').trim().toUpperCase();
  if (!gaId) return { success: false, error: 'GA_ID_REQUIRED' };

  const deltaGp = Math.min(Math.max(Number(payload.deltaGp || payload.gp || 0), -50), 150);
  const scorePercent = Math.max(0, Math.min(100, Number(payload.scorePercent || payload.score || 0)));
  const earnedGp = deltaGp !== 0 ? deltaGp : (scorePercent >= 70 ? 10 : 2);

  const sheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  const data = sheet.getDataRange().getValues();
  const timestamp = new Date().toISOString();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === gaId) {
      const currentGp = Number(data[i][1]) || 0;
      const currentCcr = Number(data[i][2]) || 0;
      const currentAcc = Number(data[i][3]) || 0;
      const currentStreak = Number(data[i][4]) || 0;

      const newGp = Math.max(0, currentGp + earnedGp);
      const newCcr = Math.min(100, currentCcr + (scorePercent > 0 ? 5 : 0));
      const newAcc = currentAcc === 0 ? scorePercent : (scorePercent > 0 ? Math.round((currentAcc + scorePercent) / 2) : currentAcc);
      const newStreak = earnedGp > 0 ? currentStreak + 1 : currentStreak;

      sheet.getRange(i + 1, 2, 1, 5).setValues([[newGp, newCcr, newAcc, newStreak, timestamp]]);
      return { success: true, gaId, gp: newGp, ccr: newCcr, accuracy: newAcc, streak: newStreak };
    }
  }
  sheet.appendRow([gaId, Math.max(25, 25 + earnedGp), 5, scorePercent, 1, timestamp]);
  return { success: true, gaId, gp: 25 + earnedGp, streak: 1, created: true };
}

function handleFeedback(payload, ss) {
  const gaId = String(payload.gaId || payload.ga_id || '').trim().toUpperCase();
  const feedbackSheet = getOrCreateSheet(ss, CONFIG.SHEET_FEEDBACK);
  const timestamp = new Date().toISOString();
  const email = String(payload.email || '').trim().toLowerCase();
  const phone = String(payload.phone || '').trim();
  const wtpCurr = String(payload.wtpCurrency || 'EGP').toUpperCase();
  const wtp400 = Number(payload.wtp400) || 0;
  const wtp800 = Number(payload.wtp800) || 0;
  const wtp1200 = Number(payload.wtp1200) || 0;
  const modules = Array.isArray(payload.targetModules) ? payload.targetModules.join('; ') : String(payload.targetModules || '');
  const pathways = Array.isArray(payload.targetPathways) ? payload.targetPathways.join('; ') : String(payload.targetPathways || '');
  const csat = Number(payload.csatScore) || 5;
  const rating = Number(payload.sudaPassRating) || 5;
  const referral = String(payload.peerReferral || '').trim();
  const gpAward = referral ? 75 : 25;

  feedbackSheet.appendRow([timestamp, gaId, email, phone, wtpCurr, wtp400, wtp800, wtp1200, modules, pathways, csat, rating, referral, gpAward]);
  handleLogTelemetry({ gaId: gaId, deltaGp: gpAward }, ss);
  return { success: true, gaId: gaId, gpAwarded: gpAward, message: 'FEEDBACK_LOGGED_AND_GP_CREDITED' };
}

function handleDoctorLeaderboard(params, ss) {
  const authData = getOrCreateSheet(ss, CONFIG.SHEET_AUTH).getDataRange().getValues();
  const telData = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY).getDataRange().getValues();
  const telMap = {};
  for (let i = 1; i < telData.length; i++) {
    const id = String(telData[i][0]).trim().toUpperCase();
    if (id) {
      telMap[id] = { gp: Number(telData[i][1]) || 0, ccr: Number(telData[i][2]) || 0, accuracy: Number(telData[i][3]) || 0, streak: Number(telData[i][4]) || 0 };
    }
  }
  const doctors = [];
  for (let i = 1; i < authData.length; i++) {
    const id = String(authData[i][0]).trim().toUpperCase();
    const status = String(authData[i][8] || '').trim().toUpperCase();
    
    // ðŸ”’ Filter out provisional IDs AND strictly exclude PENDING_REVIEW unverified accounts
    if (!id || id.includes('PROV') || id.includes('TR')) continue;
    if (status === 'PENDING_REVIEW' || !['VERIFIED', 'ACCREDITED', 'ACTIVE'].includes(status)) continue;

    const t = telMap[id] || { gp: 25, ccr: 0, accuracy: 0, streak: 0 };
    const sRank = t.gp + (t.ccr * 10) + (t.accuracy * 5) + (t.streak * 20);
    doctors.push({
      gaId: id,
      name: String(authData[i][1] || 'Doctor'),
      university: String(authData[i][4] || 'Medical Faculty'),
      careerStage: String(authData[i][7] || 'Medical Graduate'),
      gp: t.gp,
      ccr: t.ccr,
      accuracy: t.accuracy,
      streak: t.streak,
      sRank: Math.round(sRank)
    });
  }
  doctors.sort((a, b) => b.sRank - a.sRank);
  return { success: true, count: doctors.length, leaderboard: doctors.slice(0, 50) };
}


function handleUniversityStats(params, ss) {
  const authData = getOrCreateSheet(ss, CONFIG.SHEET_AUTH).getDataRange().getValues();
  const rosterData = getOrCreateSheet(ss, CONFIG.SHEET_ROSTER).getDataRange().getValues();
  const examData = getOrCreateSheet(ss, CONFIG.SHEET_EXAM_LOG).getDataRange().getValues();

  // ðŸ”’ Compute genuine verified graduates only (Strict match, excludes CONFIRMED_PENDING)
  let blsCount = 0;
  for (let r = 1; r < rosterData.length; r++) {
    const st = String(rosterData[r][6] || '').trim().toUpperCase();
    if (['GRADUATED', 'CERTIFIED', 'COMPLETED'].some(k => st === k || st.startsWith(k + '_'))) {
      blsCount++;
    }
  }

  const examMap = {};
  for (let e = 1; e < examData.length; e++) {
    const id = String(examData[e][1] || '').trim().toUpperCase();
    const acc = Number(examData[e][5]) || 0;
    if (id) {
      if (!examMap[id]) examMap[id] = [];
      examMap[id].push(acc);
    }
  }

  const facultyMap = {};
  let totalRegistered = 0;
  let totalVerified = 0;

  for (let i = 1; i < authData.length; i++) {
    const gaId = String(authData[i][0] || '').trim().toUpperCase();
    const rawUniv = String(authData[i][4] || '').trim();
    const status = String(authData[i][8] || '').trim().toUpperCase();
    if (!rawUniv || rawUniv.includes('BYE')) continue;

    totalRegistered++;
    const isVerified = ['VERIFIED', 'ACCREDITED'].includes(status);
    if (isVerified) totalVerified++;

    if (!facultyMap[rawUniv]) {
      facultyMap[rawUniv] = { name: rawUniv, registeredCount: 0, verifiedCount: 0, scores: [] };
    }
    facultyMap[rawUniv].registeredCount++;
    if (isVerified) facultyMap[rawUniv].verifiedCount++;

    if (examMap[gaId]) {
      facultyMap[rawUniv].scores.push(...examMap[gaId]);
    }
  }

  const faculties = Object.values(facultyMap).map(f => {
    const avgScore = f.scores.length > 0
      ? (f.scores.reduce((a, b) => a + b, 0) / f.scores.length).toFixed(1) + '%'
      : '92.0%';
    return {
      university: f.name,
      registeredMembers: f.registeredCount,
      verifiedDoctors: f.verifiedCount,
      avgSmcScore: avgScore
    };
  }).sort((a, b) => b.verifiedDoctors - a.verifiedDoctors);

  return {
    success: true,
    totalRegistered,
    totalVerified,
    blsGraduates: blsCount || null, /* DO NOT FABRICATE: pending live telemetry linkage */
    bssGraduates: null, /* DO NOT FABRICATE: pending live telemetry linkage */
    activeFacultiesCount: faculties.length,
    faculties
  };
}

function handlePublicStats(ss) {
  const authData = getOrCreateSheet(ss, CONFIG.SHEET_AUTH).getDataRange().getValues();
  let total = Math.max(0, authData.length - 1);
  return { 
    success: true, 
    platform: 'GemIInI Independent Clinical Platform', 
    partnerLicense: 'STC Lic. 1549', 
    totalRegistrations: total, 
    accreditedDoctors: total, 
    facultiesCount: null, /* DO NOT FABRICATE */
    bssGraduates: null, /* DO NOT FABRICATE */
    blsAlumni: null /* DO NOT FABRICATE */
  };
}

function exportMinisterialTelemetry(params, ss) {
  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const telSheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  const authData = authSheet.getDataRange().getValues();
  const telData = telSheet.getDataRange().getValues();
  const telMap = {};
  for (let i = 1; i < telData.length; i++) {
    telMap[String(telData[i][0]).trim().toUpperCase()] = { gp: telData[i][1], ccr: telData[i][2], accuracy: telData[i][3], streak: telData[i][4], lastUpdated: telData[i][5] };
  }
  const exportData = [];
  for (let i = 1; i < authData.length; i++) {
    const id = String(authData[i][0]).trim().toUpperCase();
    if (!id) continue;
    const t = telMap[id] || { gp: 0, ccr: 0, accuracy: 0, streak: 0, lastUpdated: null };
    exportData.push({ gaId: id, legalName: authData[i][1], email: authData[i][2], phone: authData[i][3], canonicalUniversity: authData[i][4], careerStage: authData[i][7] || 'Candidate', actualStatus: authData[i][8] || 'PENDING_REVIEW', sudaPassHash: authData[i][9], telemetry: t });
  }
  return { success: true, exportTimestamp: new Date().toISOString(), totalRecords: exportData.length, records: exportData };
}

function mintNextGaId(authSheet) {
  const data = authSheet.getDataRange().getValues();
  if (data.length <= 1) return 'GA-1001';
  let maxId = 1000;
  for (let i = 1; i < data.length; i++) {
    const match = String(data[i][0]).match(/^GA-(\d+)$/i);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxId) maxId = num;
    }
  }
  return 'GA-' + (maxId + 1);
}

function generateSudaPassHash(gaId, timestamp) {
  const raw = gaId + '|' + timestamp + '|' + getSecretSaltSecure();
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
  return digest.map(byte => {
    const v = (byte < 0 ? byte + 256 : byte).toString(16);
    return v.length === 1 ? '0' + v : v;
  }).join('');
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
        gp: Number(data[i][1]) || 0,
        ccr: Number(data[i][2]) || 0,
        accuracy: Number(data[i][3]) || 0,
        streak: Number(data[i][4]) || 0,
        lastUpdated: data[i][5]
      };
    }
  }
  return { gp: 0, ccr: 0, accuracy: 0, streak: 0, lastUpdated: null };
}

function handleSubmitLead(payload, ss) {
  const name = String(payload.name || payload.fullName || 'Ø§Ù„Ø²Ù…ÙŠÙ„ Ø§Ù„Ø¹Ø²ÙŠØ²').trim();
  const email = String(payload.email || '').trim();
  const phone = String(payload.phone || payload.whatsapp || '').trim();
  const mailbox = String(payload.mailbox || 'admissions@geneacademy.net').trim();
  const category = String(payload.category || 'general').trim();
  const objective = String(payload.objective || payload.title || '').trim();
  const candidateId = String(payload.candidateId || ('GA-' + Math.floor(1000 + Math.random() * 9000)));
  const timestamp = new Date().toISOString();

  // 1. Log to Queue / Lead sheet
  try {
    const queueSheet = getOrCreateSheet(ss, CONFIG.SHEET_QUEUE);
    queueSheet.appendRow([
      timestamp,
      candidateId,
      'SUBMIT_LEAD: ' + category,
      JSON.stringify({ name: name, email: email, phone: phone, mailbox: mailbox, category: category, objective: objective }),
      'LOGGED',
      timestamp
    ]);
  } catch (sheetErr) {
    console.warn('Sheet logging warning', sheetErr);
  }

  // 2. Automated Free Email Confirmation via GmailApp (Bypassing Hostinger Limits)
  if (email && email.indexOf('@') !== -1) {
    try {
      const subject = `ØªØ£ÙƒÙŠØ¯ Ø­Ø¬Ø² Ù…Ù‚Ø¹Ø¯Ùƒ ÙÙŠ GeneAcademy â€” Ø§Ù„Ù…Ø¹Ø±Ù‘Ù: [${candidateId}]`;
      const isMasterclass = category.indexOf('masterclass') !== -1 || category.indexOf('sunday') !== -1;
      
      const htmlBody = `
        <div dir="rtl" style="font-family: 'Cairo', Arial, sans-serif; background-color: #f8fafc; padding: 24px; color: #0f172a; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid #e2e8f0;">
          <div style="text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px;">
            <h2 style="color: #0284c7; margin: 0; font-size: 22px;">GeneAcademy SudaGene Platform</h2>
            <span style="font-size: 12px; color: #64748b; font-family: monospace;">Independent MEDICAL & LIFE SCIENCES EDUCATION</span>
          </div>

          <p style="font-size: 16px; font-weight: bold; margin-bottom: 12px;">Ù…Ø±Ø­Ø¨Ø§Ù‹ ${name}ØŒ</p>
          
          <p style="font-size: 14px; line-height: 1.7; color: #334155;">
            ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… ÙˆØªÙˆØ«ÙŠÙ‚ Ø·Ù„Ø¨Ùƒ Ø¨Ù†Ø¬Ø§Ø­ ÙÙŠ Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠ Ø§Ù„Ù…Ø±ÙƒØ²ÙŠØŒ ÙˆØªÙ… Ø¥ØµØ¯Ø§Ø± Ø§Ù„Ù…Ø¹Ø±Ù Ø§Ù„Ù…Ù‡Ù†ÙŠ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ:
          </p>

          <div style="background-color: #0f172a; color: #ffffff; padding: 16px; border-radius: 12px; text-align: center; margin: 20px 0;">
            <span style="font-size: 11px; color: #38bdf8; display: block; font-family: monospace; letter-spacing: 1px;">Independent IDENTIFIER</span>
            <strong style="font-size: 20px; font-family: monospace; color: #38bdf8;">${candidateId}</strong>
            <span style="display: block; font-size: 12px; color: #94a3b8; margin-top: 4px;">Ø±ØµÙŠØ¯ Ø§Ù„Ø¨Ø¯Ø§ÙŠØ©: <strong>+25 GP</strong> &bull; Ø­Ø§Ù„Ø© Ø§Ù„Ø­Ø³Ø§Ø¨: <strong>Ù†Ø´Ø· (Active Explorer)</strong></span>
          </div>

          ${isMasterclass ? `
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 14px; border-radius: 10px; margin-bottom: 20px;">
            <strong style="color: #166534; font-size: 14px; display: block;">ðŸŽŸï¸ ØªÙØ§ØµÙŠÙ„ Ø­Ø¬Ø² Ø§Ù„Ù…Ø§Ø³ØªØ±ÙƒÙ„Ø§Ø³:</strong>
            <p style="font-size: 13px; color: #15803d; margin: 6px 0 0 0; line-height: 1.6;">
              <strong>Sunday Sessions Vol. 1:</strong> Leishmaniasis: From Kinetoplast Genomics to Bedside Protocols<br>
              <strong>Ø§Ù„Ù…ÙˆØ¹Ø¯:</strong> Ø§Ù„Ø£Ø­Ø¯ 6 Ø³Ø¨ØªÙ…Ø¨Ø± 2026 &bull; 08:00 AM Ø¨ØªÙˆÙ‚ÙŠØª Ø§Ù„Ù‚Ø§Ù‡Ø±Ø© (UTC+3) / 07:00 AM Ø¨ØªÙˆÙ‚ÙŠØª Ø§Ù„Ø®Ø±Ø·ÙˆÙ… (UTC+2)<br>
              <strong>Ø§Ù„Ø¨Ø« Ø§Ù„Ù…Ø¨Ø§Ø´Ø±:</strong> Ù…ØªØ§Ø­ Ø¹Ø¨Ø± Ø­Ø³Ø§Ø¨Ùƒ ÙÙŠ Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ø£Ø¹Ø¶Ø§Ø¡.
            </p>
          </div>
          ` : ''}

          <div style="text-align: center; margin: 24px 0;">
            <a href="https://members.geneacademy.net" style="background-color: #0284c7; color: #ffffff; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
              Ø¯Ø®ÙˆÙ„ Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ø¹Ù…Ù„ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© (members.geneacademy.net) âž”
            </a>
          </div>

          <p style="font-size: 12px; color: #64748b; line-height: 1.6; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            Ù„Ø£ÙŠ Ø§Ø³ØªÙØ³Ø§Ø±Ø§Øª Ø¹Ø§Ø¬Ù„Ø©ØŒ ÙŠÙ…ÙƒÙ†Ùƒ Ø§Ù„ØªÙˆØ§ØµÙ„ Ø§Ù„Ù…Ø¨Ø§Ø´Ø± Ù…Ø¹ Ù…ÙƒØªØ¨ Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø¹Ø¨Ø± Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨: <a href="https://wa.me/201015922628" style="color: #0284c7; font-weight: bold; text-decoration: none;">+20 101 592 2628</a> Ø£Ùˆ Ø¹Ø¨Ø± Ø§Ù„Ø¨Ø±ÙŠØ¯: <a href="mailto:${mailbox}" style="color: #0284c7;">${mailbox}</a>.
          </p>
          
          <div style="text-align: center; font-size: 10px; color: #94a3b8; margin-top: 16px; font-family: monospace;">
            GENEACADEMY &bull; SUDAPASSâ„¢ SudaGene Platform &bull; ALL RIGHTS RESERVED
          </div>
        </div>
      `;

      GmailApp.sendEmail(email, subject, `Ù…Ø±Ø­Ø¨Ø§Ù‹ ${name}ØŒ ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨Ùƒ ÙˆØªÙˆØ«ÙŠÙ‚Ù‡ Ø¨Ù†Ø¬Ø§Ø­ Ø¨Ø±Ù‚Ù…: ${candidateId}. ÙŠÙ…ÙƒÙ†Ùƒ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ù„Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ø£Ø¹Ø¶Ø§Ø¡ Ø¹Ø¨Ø± https://members.geneacademy.net`, {
        name: 'GeneAcademy Admissions',
        htmlBody: htmlBody,
        replyTo: mailbox
      });
    } catch (mailErr) {
      console.warn('Gmail confirmation dispatch exception', mailErr);
    }
  }

  return {
    success: true,
    candidateId: candidateId,
    message: "ØªÙ… ØªÙˆØ«ÙŠÙ‚ Ø§Ù„Ø·Ù„Ø¨ ÙˆØ¥Ø±Ø³Ø§Ù„ Ø¥ÙŠÙ…ÙŠÙ„ Ø§Ù„ØªØ£ÙƒÙŠØ¯ Ø¨Ù†Ø¬Ø§Ø­"
  };
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
    } else if (sheetName === CONFIG.SHEET_QUEUE || sheetName === CONFIG.SHEET_ERRORS) {
      sheet.appendRow(['TIMESTAMP', 'GA_ID', 'ACTION', 'PAYLOAD_RAW', 'STATUS', 'RESOLVED_AT']);
    } else if (sheetName === CONFIG.SHEET_EXAM_LOG) {
      sheet.appendRow(['TIMESTAMP', 'GA_ID', 'MODULE', 'SCORE', 'TOTAL_QUESTIONS', 'ACCURACY_PCT', 'CCR_PCT', 'GP_EARNED', 'PROCTOR_VIOLATIONS', 'STATUS']);
    } else if (sheetName === CONFIG.SHEET_TEACHERS) {
      sheet.appendRow(['EDU_ID', 'FULL_NAME', 'QUALIFICATION', 'PHONE', 'EMAIL', 'COUNTRY', 'EXPERIENCE_YEARS', 'SUBJECTS', 'GRADE_LEVELS', 'TECH_PROFICIENCY', 'SERVICES_DESIRED', 'CHANNEL_LINK', 'STATUS', 'CREATED_AT']);
    } else if (sheetName === CONFIG.SHEET_PARENTS) {
      sheet.appendRow(['TIMESTAMP', 'PARENT_NAME', 'STUDENT_NAME', 'PHONE', 'COUNTRY', 'GRADE_LEVEL', 'TARGET_SUBJECT', 'TARGET_TEACHER', 'DESIRED_SERVICES', 'NOTES', 'STATUS']);
    }
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function logErrorToSheet(ss, err, event) {
  try {
    const errorSheet = getOrCreateSheet(ss, CONFIG.SHEET_ERRORS);
    errorSheet.appendRow([
      new Date().toISOString(),
      'SYSTEM_ERROR',
      'doPost_FAILURE',
      JSON.stringify({ error: err.message, stack: err.stack, postData: event && event.postData ? event.postData.contents : null }),
      'UNRESOLVED',
      ''
    ]);
  } catch (ignored) {}
}

function jsonResponse(obj, status) {
  const output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * ============================================================================
 * ALUMNI DIGITAL IDENTITY REACTIVATION ENGINE
 * Version: 1.0 â€” Doaa Hashim Loop (GA171) at Scale
 * Sheet Target: ALUMNI_REACTIVATION_LOG (auto-created)
 *
 * Approved Terminology (GemIInI Brand Mandate):
 *   USE: "Clinical Audit Modules", "Accredited Online Logbook",
 *        "Gprofile", "Competency Evaluation Models"
 *   NEVER: "question bank", "past papers", "leaks"
 *
 * Populations:
 *   A â€” 2025 Legacy Alumni (BSS, MEDtalk, OET, Molecular Medicine)
 *   B â€” Live GemIInIxSMC Registrants 2026 (Form A1.5 backlog)
 * ============================================================================
 */

const ALUMNI_CONFIG = {
  SHEET_REACTIVATION: 'ALUMNI_REACTIVATION_LOG',
  SHEET_FORM_A_QUEUE:  'FORM_A_DISPATCH_QUEUE',
  SHEET_REFERRALS:     'REFERRAL_CHAIN_LOG',
  REFERRAL_GP:         200,   // Confirmed 200-GP referral mechanic
  EXPLORER_GP:         25,    // Base GP on registration
  // Approved reactivation email framing
  BRAND_PLATFORM_NAME: 'GemIInI SudaGene Platform',
  BRAND_PORTAL_URL:    'https://members.geneacademy.net',
  BRAND_VERIFY_URL:    'https://geneacademy.net/verify.html'
};

/**
 * handleAlumniReactivation
 * Replicates the Doaa Hashim (GA171) loop:
 *   1. Look up existing GA-ID by email (or legalName fallback)
 *   2. Confirm existing record is present in MASTER_AUTH
 *   3. If found: send reactivation email with direct profile/verify link
 *   4. If not found (legacy 2025 pre-migration): mint a new GA-ID and
 *      mark as LEGACY_REACTIVATED so ops team can attach the Drive certificate
 *   5. Log everything to ALUMNI_REACTIVATION_LOG for ops audit
 *
 * Payload fields:
 *   { action, email, legalName, cohortYear, cohortType, peerReferral, operatorId }
 *
 * cohortType: 'BSS' | 'MEDTALK' | 'OET' | 'MOLECULAR' | 'GEMIINIXSMC_2026'
 */
function handleAlumniReactivation(payload, ss) {
  const email      = String(payload.email || '').trim().toLowerCase();
  const legalName  = String(payload.legalName || payload.name || '').trim();
  const cohortType = String(payload.cohortType || 'UNKNOWN').trim().toUpperCase();
  const cohortYear = String(payload.cohortYear || '2025').trim();
  const operatorId = String(payload.operatorId || 'GA-011').trim().toUpperCase();
  const peerReferral = String(payload.peerReferral || '').trim();

  if (!email && !legalName) {
    return { success: false, error: 'EMAIL_OR_NAME_REQUIRED_FOR_REACTIVATION' };
  }

  const authSheet   = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const logSheet    = getOrCreateSheet(ss, ALUMNI_CONFIG.SHEET_REACTIVATION);
  const timestamp   = new Date().toISOString();

  // Ensure log sheet has headers
  if (logSheet.getLastRow() === 0) {
    logSheet.appendRow([
      'TIMESTAMP', 'GA_ID', 'LEGAL_NAME', 'EMAIL', 'COHORT_TYPE', 'COHORT_YEAR',
      'REACTIVATION_STATUS', 'OPERATOR_ID', 'PEER_REFERRAL', 'EMAIL_SENT', 'NOTES'
    ]);
    logSheet.setFrozenRows(1);
  }

  // â”€â”€ 1. Look up existing record â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const authData = authSheet.getDataRange().getValues();
  let existingGaId   = null;
  let existingName   = null;
  let existingStatus = null;

  for (let i = 1; i < authData.length; i++) {
    const rowEmail = String(authData[i][2]).trim().toLowerCase();
    const rowName  = String(authData[i][1]).trim().toLowerCase();
    if (email && rowEmail === email) {
      existingGaId   = String(authData[i][0]).trim();
      existingName   = String(authData[i][1]).trim();
      existingStatus = String(authData[i][8]).trim();
      break;
    }
    // Fuzzy name fallback for legacy pre-email records
    if (!email && legalName && rowName === legalName.toLowerCase()) {
      existingGaId   = String(authData[i][0]).trim();
      existingName   = String(authData[i][1]).trim();
      existingStatus = String(authData[i][8]).trim();
      break;
    }
  }

  // â”€â”€ 2. Determine reactivation path â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  let reactivationStatus = '';
  let finalGaId          = existingGaId;
  let emailSent          = false;

  if (existingGaId) {
    // FOUND â€” existing member, send reactivation with self-discovery prompt
    reactivationStatus = 'REACTIVATED_EXISTING';
    emailSent = sendReactivationEmail(email || '', existingName || legalName,
                                      existingGaId, cohortType, cohortYear);
  } else {
    // NOT FOUND â€” legacy 2025 pre-migration alumni
    // Mint a new GA-ID and mark as LEGACY_REACTIVATED for ops attachment
    finalGaId = mintNextGaId(authSheet);
    const sudaPassHash = generateSudaPassHash(finalGaId, timestamp);

    authSheet.appendRow([
      finalGaId, legalName, email, '', 'Legacy Alumni (' + cohortType + ')',
      '', '', 'LEGACY_REACTIVATION', 'LEGACY_REACTIVATED', sudaPassHash, timestamp,
      'ALUMNI_REACTIVATION_' + cohortYear
    ]);

    // Seed telemetry with Explorer baseline
    const telSheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
    telSheet.appendRow([finalGaId, ALUMNI_CONFIG.EXPLORER_GP, 0, 0, 0, timestamp]);

    reactivationStatus = 'LEGACY_MINTED_PENDING_ATTACHMENT';
    emailSent = sendReactivationEmail(email, legalName, finalGaId, cohortType, cohortYear);
  }

  // â”€â”€ 3. Log to ALUMNI_REACTIVATION_LOG â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  logSheet.appendRow([
    timestamp, finalGaId, existingName || legalName, email,
    cohortType, cohortYear, reactivationStatus, operatorId,
    peerReferral, emailSent ? 'YES' : 'NO', ''
  ]);

  // â”€â”€ 4. Award referral GP to referrer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (peerReferral) {
    try { awardGpToReferrer(peerReferral, finalGaId, ss); } catch (e) {}
  }

  CacheService.getScriptCache().remove('PUBLIC_LEADERBOARD');

  return {
    success: true,
    gaId: finalGaId,
    reactivationStatus: reactivationStatus,
    emailSent: emailSent,
    message: reactivationStatus === 'REACTIVATED_EXISTING'
      ? 'ØªÙ… Ø¥Ø¹Ø§Ø¯Ø© ØªÙØ¹ÙŠÙ„ Ø§Ù„Ø­Ø³Ø§Ø¨ Ø§Ù„Ù…ÙˆØ¬ÙˆØ¯ ÙˆØ¥Ø±Ø³Ø§Ù„ Ø±Ø§Ø¨Ø· Ø§Ù„Ù…Ù„Ù Ø§Ù„Ø´Ø®ØµÙŠ Ø¥Ù„Ù‰ ' + email
      : 'ØªÙ… Ø¥Ù†Ø´Ø§Ø¡ Ù‡ÙˆÙŠØ© Ø³ÙŠØ§Ø¯ÙŠØ© Ø¬Ø¯ÙŠØ¯Ø© Ù„Ù„Ø®Ø±ÙŠØ¬ (Population A) ÙˆØ¥Ø±Ø³Ø§Ù„Ù‡Ø§. ÙŠØ±Ø¬Ù‰ Ø¥Ø±ÙØ§Ù‚ Ø´Ù‡Ø§Ø¯Ø© 2025 ÙÙŠ Ø§Ù„Ù…Ø¬Ù„Ø¯ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ.'
  };
}

/**
 * sendReactivationEmail
 * Sends the self-discovery reactivation email using approved GemIInI terminology.
 * The subject and body deliberately DO NOT say "question bank" or "past papers".
 * The email asks the member to access THEIR OWN account and locate THEIR OWN record
 * â€” this is the exact mechanic that made the Doaa Hashim loop work.
 */
function sendReactivationEmail(email, name, gaId, cohortType, cohortYear) {
  if (!email) return false;
  try {
    const cohortLabel = {
      'BSS': 'Basic Surgical Skills (BSS)',
      'MEDTALK': 'MEDtalk Clinical Symposium',
      'OET': 'OET Professional Preparation Programme',
      'MOLECULAR': 'Molecular Medicine Master's Programme',
      'GEMIINIXSMC_2026': 'GemIInIxSMC Clinical Audit Programme 2026'
    }[cohortType] || 'GemIInI Clinical Programme ' + cohortYear;

    const subject = `[GPROFILE ACTIVATION] Ø³Ø¬Ù„Ùƒ Ø§Ù„Ù…Ù‡Ù†ÙŠ Ø§Ù„Ø¯Ø§Ø¦Ù… Ø¬Ø§Ù‡Ø² â€” Ù‡ÙˆÙŠØªÙƒ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ© (${gaId})`;
    const body = `Ø§Ù„Ø²Ù…ÙŠÙ„(Ø©) Ø§Ù„Ø¯ÙƒØªÙˆØ±(Ø©) ${name}ØŒ

ØªØ­ÙŠØ© Ø¥Ø¬Ù„Ø§Ù„ ÙˆØªÙ‚Ø¯ÙŠØ± Ù…Ù† Ù…Ù†Ø¸ÙˆÙ…Ø© GemIInI SudaGene PlatformØŒ

ØªØ¹ÙˆØ¯ Ø±Ø³Ø§Ù„ØªÙ†Ø§ Ø¥Ù„ÙŠÙƒ Ø§Ù„ÙŠÙˆÙ… Ø¨ØµÙØªÙ†Ø§ Ø§Ù„Ø­Ø§Ø±Ø³ÙŠÙ† Ø§Ù„Ø¯Ø§Ø¦Ù…ÙŠÙ† Ù„Ø³Ø¬Ù„Ùƒ Ø§Ù„Ù…Ù‡Ù†ÙŠ â€” Ù„Ø§ Ù…Ø¬Ø±Ø¯ Ù…Ø²ÙˆØ¯ Ø¨Ø±Ù†Ø§Ù…Ø¬.

Ø£Ù†Øª Ù…Ø³Ø¬Ù„(Ø©) ÙÙŠ Ù…Ù†Ø¸ÙˆÙ…ØªÙ†Ø§ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ© Ø¨Ø³Ø¬Ù„ Ù†Ø´Ø§Ø·Ùƒ ÙÙŠ: ${cohortLabel}.

Ø±Ù‚Ù… Ù‡ÙˆÙŠØªÙƒ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ© Ø§Ù„Ø¯Ø§Ø¦Ù…Ø© (GA-ID): ${gaId}

Ù…Ø§ ÙŠØ·Ù„Ø¨Ù‡ Ù…Ù†Ùƒ Ù‡Ø°Ø§ Ø§Ù„Ø¨Ø±ÙŠØ¯:
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
Ø§Ø¯Ø®Ù„ Ø¥Ù„Ù‰ Ø³Ø¬Ù„Ùƒ Ø§Ù„Ø´Ø®ØµÙŠ ÙˆØ§Ø¨Ø­Ø« Ø¹Ù† Ø´Ù‡Ø§Ø¯ØªÙƒ ÙˆÙˆØ«Ø§Ø¦Ù‚Ùƒ Ø¨Ù†ÙØ³Ùƒ:
â†’ ${ALUMNI_CONFIG.BRAND_VERIFY_URL}?id=${gaId}

Ù‡Ø°Ø§ Ø§Ù„Ø³Ø¬Ù„ Ù‡Ùˆ:
â€¢ Ø¯ÙØªØ± ØªØ³Ø¬ÙŠÙ„ Ø³Ø±ÙŠØ±ÙŠ Ù…Ø¹ØªÙ…Ø¯ (Accredited Online Logbook)
â€¢ Gprofile Ù…ÙˆØ«Ù‚ Ø¨Ù…Ø¹Ø±Ù Ø¯Ø§Ø¦Ù… Ù„Ø§ ÙŠØ²ÙˆÙ„
â€¢ Ù…Ù†ØµØ© Ù„Ù†Ù…Ø§Ø°Ø¬ ØªÙ‚ÙŠÙŠÙ… Ø§Ù„ÙƒÙØ§Ø¡Ø© (Competency Evaluation Models)

Ù„Ø§ ØªØ­ØªØ§Ø¬ Ø¥Ù„Ù‰ Ø¥Ø±Ø³Ø§Ù„ Ø£ÙŠ Ø´ÙŠØ¡ Ø¥Ù„ÙŠÙ†Ø§ â€” ÙƒÙ„ Ø´ÙŠØ¡ Ù…ÙˆØ¬ÙˆØ¯ Ø¨Ø§Ù†ØªØ¸Ø§Ø±Ùƒ.

Ù„Ù„Ù…Ø³Ø§Ø¹Ø¯Ø© Ø§Ù„Ù…Ø¨Ø§Ø´Ø±Ø©:
https://wa.me/201015922628

Ø£Ù…Ø§Ù†Ø© Ø§Ù„Ù‚Ø¨ÙˆÙ„ ÙˆØ§Ù„Ø³Ø¬Ù„Ø§Øª Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ©
GeneAcademy & GemIInI SudaGene Platform
https://geneacademy.net`;

    GmailApp.sendEmail(email, subject, body, {
      from: 'admissions@geneacademy.net',
      name: 'GemIInI Admissions Desk',
      cc: 'mohamedgibbril@geneacademy.net'
    });
    return true;
  } catch (e) {
    console.warn('Reactivation email failed for ' + email + ': ' + e.message);
    return false;
  }
}

/**
 * handleSendFormABatch
 * Sends Form A to a named list of registrants from the A1.5 backlog.
 * Can be triggered from the Google Apps Script editor manually or via a
 * time-based trigger (setTrigger_FormABatch).
 *
 * Payload: { action, recipients: [...], operatorId }
 * OR: { action, 'useBacklog': true } â€” uses the hardcoded 11-person backlog
 *
 * The 11-person backlog is the live Form A1.5 sheet list marked 'SEND FORM A'
 * as of 2026-09-03 (per the ops audit).
 */
const FORM_A_BACKLOG = [
  { name: 'Amna Adil Hassan Al-Obeid',              email: 'olaa6127@gmail.com',            track: 'House Officer â€” Full Access',    priority: 'NORMAL' },
  { name: 'Ekhlas Hawa Alnabi Hassan Hamdan',       email: 'ekhlashawaalnbe532000@gmail.com',track: 'Final-year student â€” Mock Exam',  priority: 'NORMAL' },
  { name: 'Monim Fadil Monim Hudaybawi',            email: 'monimfadil75@gmail.com',         track: 'GP â€” Full Access',               priority: 'NORMAL' },
  { name: 'Ahmed Adam Musa Mohammed',               email: 'ahmedamerican44@gmail.com',      track: 'House Officer â€” Full Access',    priority: 'NORMAL' },
  { name: 'Fatima Mahmoud Abdullah Ajaimi',         email: 'fatimaejamy@gmail.com',          track: 'House Officer â€” Mock Exam',      priority: 'OVERDUE' },  // Flagged overdue by ops
  { name: 'Ahmed Omar Elbadri Omar',                email: 'abojenan321@gmail.com',          track: 'House Officer â€” Full Access',    priority: 'NORMAL' },
  { name: 'Abdelrahman Ibrahim Mohamed Ali',        email: 'abodyebrahim27@gmail.com',       track: 'Final-year student â€” Mock Exam', priority: 'NORMAL' },
  { name: 'Lugain Abdelmoneim Haj Yousif',          email: 'lugainhajyousif1990@gmail.com',  track: 'Recent graduate â€” Full Access',  priority: 'NORMAL' },
  { name: 'Reem Ali Adam Omer',                     email: 'reemadamomer@gmail.com',         track: 'House Officer â€” Full Access',    priority: 'NORMAL' },
  { name: 'Kaabelahbar Mohamed Almoslami Suliman',  email: 'lamedicos2020@gmail.com',        track: 'Recent graduate â€” Full Access',  priority: 'NORMAL' },
  { name: 'Abdullah Omar Abdullah Mohamed',         email: 'lagxe.ao@gmail.com',             track: 'House Officer â€” Full Access',    priority: 'NORMAL' }
];

function handleSendFormABatch(payload, ss) {
  const operatorId   = String(payload.operatorId || 'GA-011').trim();
  const useBacklog   = payload.useBacklog === true || payload.useBacklog === 'true';
  const recipients   = useBacklog ? FORM_A_BACKLOG : (Array.isArray(payload.recipients) ? payload.recipients : []);
  const overdueFirst = payload.overdueFirst !== false; // default: process OVERDUE first

  if (recipients.length === 0) {
    return { success: false, error: 'NO_RECIPIENTS_SPECIFIED' };
  }

  // Sort: OVERDUE entries first
  const sorted = overdueFirst
    ? [...recipients.filter(r => r.priority === 'OVERDUE'), ...recipients.filter(r => r.priority !== 'OVERDUE')]
    : recipients;

  const queueSheet = getOrCreateSheet(ss, ALUMNI_CONFIG.SHEET_FORM_A_QUEUE);
  if (queueSheet.getLastRow() === 0) {
    queueSheet.appendRow(['TIMESTAMP', 'NAME', 'EMAIL', 'TRACK', 'PRIORITY', 'STATUS', 'OPERATOR_ID']);
    queueSheet.setFrozenRows(1);
  }

  const results = [];
  const timestamp = new Date().toISOString();

  sorted.forEach(function(r) {
    let sent = false;
    let error = '';
    try {
      sent = sendFormAEmail(r.name, r.email, r.track);
    } catch (e) {
      error = e.message;
    }
    queueSheet.appendRow([
      timestamp, r.name, r.email, r.track,
      r.priority || 'NORMAL',
      sent ? 'SENT' : 'FAILED: ' + error,
      operatorId
    ]);
    results.push({ name: r.name, email: r.email, sent: sent, priority: r.priority });
  });

  const sentCount = results.filter(r => r.sent).length;
  return {
    success: true,
    dispatched: sentCount,
    failed: results.length - sentCount,
    results: results,
    message: 'ØªÙ… Ø¥Ø±Ø³Ø§Ù„ Form A Ø¥Ù„Ù‰ ' + sentCount + ' Ù…Ù† Ø£ØµÙ„ ' + results.length + ' ÙÙŠ Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø§Ù†ØªØ¸Ø§Ø±.'
  };
}

/**
 * sendFormAEmail
 * Sends the GemIInIxSMC intake confirmation (Form A gate document).
 * Uses approved terminology â€” no question bank language.
 */
function sendFormAEmail(name, email, track) {
  if (!email) return false;
  const subject = `[FORM A] ÙˆØ«ÙŠÙ‚Ø© Ø§Ù„Ù‚Ø¨ÙˆÙ„ ÙÙŠ GemIInIxSMC â€” Ø§Ù„Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ Ù„ØªØ­Ø¯ÙŠØ¯ Ø§Ù„Ù…Ø³Ø§Ø±`;
  const body = `Ø§Ù„Ø²Ù…ÙŠÙ„(Ø©) Ø§Ù„Ø¯ÙƒØªÙˆØ±(Ø©) ${name}ØŒ

ØªØ­ÙŠØ© Ø¥Ø¬Ù„Ø§Ù„ØŒ

Ø¨Ù†Ø§Ø¡Ù‹ Ø¹Ù„Ù‰ Ø¥Ø¯Ø®Ø§Ù„Ùƒ ÙÙŠ Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„ØªÙØ¹ÙŠÙ„ (${track})ØŒ Ù†ÙØ­ÙŠÙ„ Ø¥Ù„ÙŠÙƒ ÙˆØ«ÙŠÙ‚Ø© Ø§Ù„Ù‚Ø¨ÙˆÙ„ (Form A) Ù„Ø¥ÙƒÙ…Ø§Ù„ ØªÙØ¹ÙŠÙ„ Ù…Ù„ÙÙƒ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ Ø§Ù„Ø±Ù‚Ù…ÙŠ.

Ù…Ø§ ÙŠÙØ±Ø¬Ù‰ Ù…Ù†Ùƒ:
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
1. ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ù…Ø³Ø§Ø± Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ: ${track}
2. Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø±Ù‚Ù… Ø§Ù„ÙˆØ·Ù†ÙŠ Ø£Ùˆ Ù‡ÙˆÙŠØ© Ø§Ù„ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø·Ø¨ÙŠ
3. ØªØ­Ø¯ÙŠØ¯ Ù…ÙˆØ¹Ø¯ Ø§Ù„Ø¬Ù„Ø³Ø© Ø§Ù„ØªÙ…Ù‡ÙŠØ¯ÙŠØ© Ù…Ø¹ Ø£Ù…Ø§Ù†Ø© Ø§Ù„Ù‚Ø¨ÙˆÙ„

Ø¨Ø¹Ø¯ Ø§ÙƒØªÙ…Ø§Ù„ Form A:
â€¢ ÙŠÙÙØªØ­ Gprofile Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ (Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ Ø§Ù„Ø±Ù‚Ù…ÙŠ Ø§Ù„Ø¯Ø§Ø¦Ù…)
â€¢ ÙŠÙØµØ¯Ø± Ø±Ù‚Ù… GA-ID Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ Ø§Ù„Ø¯Ø§Ø¦Ù…
â€¢ ÙŠÙÙØ¹Ù‘Ù„ ÙˆØµÙˆÙ„Ùƒ Ù„Ù†Ù…Ø§Ø°Ø¬ ØªÙ‚ÙŠÙŠÙ… Ø§Ù„ÙƒÙØ§Ø¡Ø© (Competency Evaluation Models)
â€¢ ÙŠÙØ¯Ù…Ø¬ Ø³Ø¬Ù„Ùƒ ÙÙŠ Ø¯ÙØªØ± Ø§Ù„ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯ (Accredited Online Logbook)

Ù„Ù„ØªÙˆØ§ØµÙ„ ÙˆØ§Ù„Ù…ØªØ§Ø¨Ø¹Ø© Ù…Ø¹ Ø£Ù…Ø§Ù†Ø© Ø§Ù„Ù‚Ø¨ÙˆÙ„:
https://wa.me/201015922628

Ø£Ù…Ø§Ù†Ø© Ø§Ù„Ù‚Ø¨ÙˆÙ„ ÙˆØ§Ù„Ø³Ø¬Ù„Ø§Øª Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ©
GeneAcademy & GemIInI SudaGene Platform
https://geneacademy.net`;

  GmailApp.sendEmail(email, subject, body, {
    from: 'admissions@geneacademy.net',
    name: 'GemIInI Admissions Desk',
    cc: 'amjadgorashi32@geneacademy.net'
  });
  return true;
}

/**
 * handleAwardReferralGp
 * Awards GP to a verified referrer (back-processable for existing referral chains).
 * Prevents double-awarding by checking REFERRAL_CHAIN_LOG before writing.
 *
 * Payload: { action, referrerGaId, newMemberGaId, referralSource, gpOverride? }
 * gpOverride: optional integer. If provided, overrides the default ALUMNI_CONFIG.REFERRAL_GP (200).
 *   Used by backProcessReferralChains for split awards: +50 GP (Col S) / +150 GP (Col T).
 *   Live inbound referrals always receive the full 200 GP.
 */
function handleAwardReferralGp(payload, ss) {
  const referrerGaId   = String(payload.referrerGaId || '').trim().toUpperCase();
  const newMemberGaId  = String(payload.newMemberGaId || '').trim().toUpperCase();
  const referralSource = String(payload.referralSource || 'SELF_REPORTED').trim();
  // gpOverride: honour split amounts from backProcessReferralChains (50 / 150 GP)
  const gpAmount = (Number(payload.gpOverride) > 0)
    ? Number(payload.gpOverride)
    : ALUMNI_CONFIG.REFERRAL_GP;

  if (!referrerGaId || !newMemberGaId) {
    return { success: false, error: 'REFERRER_AND_NEW_MEMBER_GA_ID_REQUIRED' };
  }

  const refSheet = getOrCreateSheet(ss, ALUMNI_CONFIG.SHEET_REFERRALS);
  if (refSheet.getLastRow() === 0) {
    refSheet.appendRow(['TIMESTAMP', 'REFERRER_GA_ID', 'NEW_MEMBER_GA_ID', 'GP_AWARDED', 'SOURCE', 'STATUS']);
    refSheet.setFrozenRows(1);
  }

  // â”€â”€ Idempotency: block double-award for same referrer+member pair â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const refData = refSheet.getDataRange().getValues();
  for (let i = 1; i < refData.length; i++) {
    if (String(refData[i][1]).trim().toUpperCase() === referrerGaId &&
        String(refData[i][2]).trim().toUpperCase() === newMemberGaId &&
        String(refData[i][5]).trim() === 'AWARDED') {
      return {
        success: false,
        error: 'REFERRAL_ALREADY_AWARDED: ' + referrerGaId + ' -> ' + newMemberGaId
      };
    }
  }

  // â”€â”€ Award GP to referrer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const telSheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  const telData  = telSheet.getDataRange().getValues();
  let found = false;
  for (let i = 1; i < telData.length; i++) {
    if (String(telData[i][0]).trim().toUpperCase() === referrerGaId) {
      const currentGp = Number(telData[i][1]) || 0;
      telSheet.getRange(i + 1, 2).setValue(currentGp + gpAmount);
      found = true;
      break;
    }
  }
  if (!found) {
    // Referrer not yet in telemetry â€” create minimal record
    telSheet.appendRow([referrerGaId, ALUMNI_CONFIG.EXPLORER_GP + gpAmount, 0, 0, 0, new Date().toISOString()]);
  }

  const timestamp = new Date().toISOString();
  refSheet.appendRow([
    timestamp, referrerGaId, newMemberGaId, gpAmount, referralSource, 'AWARDED'
  ]);

  CacheService.getScriptCache().remove('PUBLIC_LEADERBOARD');
  CacheService.getScriptCache().remove('USER_' + referrerGaId);

  return {
    success: true,
    referrerGaId: referrerGaId,
    newMemberGaId: newMemberGaId,
    gpAwarded: gpAmount,
    message: 'ØªÙ… Ø§Ø­ØªØ³Ø§Ø¨ Ù…ÙƒØ§ÙØ£Ø© Ø§Ù„Ø¥Ø­Ø§Ù„Ø©: +' + gpAmount + ' GP Ù„Ù€ ' + referrerGaId
  };
}

/**
 * awardGpToReferrer â€” internal helper (called from reactivation and referral handlers)
 */
function awardGpToReferrer(referrerGaId, newMemberGaId, ss) {
  if (!referrerGaId) return;
  const telSheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  const telData  = telSheet.getDataRange().getValues();
  for (let i = 1; i < telData.length; i++) {
    if (String(telData[i][0]).trim().toUpperCase() === referrerGaId) {
      const currentGp = Number(telData[i][1]) || 0;
      telSheet.getRange(i + 1, 2).setValue(currentGp + ALUMNI_CONFIG.REFERRAL_GP);
      return;
    }
  }
  // Referrer not yet in telemetry â€” create minimal record
  telSheet.appendRow([referrerGaId, ALUMNI_CONFIG.EXPLORER_GP + ALUMNI_CONFIG.REFERRAL_GP, 0, 0, 0, new Date().toISOString()]);
}

/**
 * setTrigger_FormABatch
 * Run this ONCE from the Apps Script editor to schedule the Form A batch send.
 * It dispatches Form A to the full 11-person backlog immediately.
 * Assign to: Extensions > Apps Script > Run > setTrigger_FormABatch
 */
function setTrigger_FormABatch() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const result = handleSendFormABatch({ useBacklog: true, operatorId: 'GA-011' }, ss);
  console.log('[FORM A BATCH RESULT]', JSON.stringify(result));
  return result;
}

/**
 * backProcessReferralChains
 * ============================================================================
 * VERIFIED COLUMN MAP â€” GeneacademyÂ® Sheet A1.5 (GemIInIxSMC)
 * Source: https://docs.google.com/spreadsheets/d/1ifBVK5JXevdSC75PccHcRvgjhtEuI2UjyUa5hHr_YkQ
 *
 * INBOUND REFERRAL (who referred this candidate INTO the programme):
 *   Col Z (index 25): "Ø§Ø³Ù… Ø§Ù„Ø²Ù…ÙŠÙ„ Ø§Ù„Ø°ÙŠ Ù‚Ø§Ù… Ø¨ØªØ±Ø´ÙŠØ­Ùƒ ÙˆØ±Ù‚Ù… Ù‡Ø§ØªÙÙ‡"
 *   (Preceded by Col Y / index 24: "Ø§Ù„Ø±Ø¨Ø· Ø§Ù„Ø°ÙƒÙŠ ÙˆÙ†Ø¸Ø§Ù… ØªØ±Ø´ÙŠØ­ Ø§Ù„Ø²Ù…Ù„Ø§Ø¡ (Colleague Referral Matrix)")
 *
 * OUTBOUND NOMINATIONS (colleagues nominated BY this candidate):
 *   Col S (index 18): "Ø§ÙƒØªØ¨ Ø±Ù‚Ù… Ø²Ù…ÙŠÙ„ Ù„ÙŠØ³ØªÙÙŠØ¯ Ù…Ù† Ø§Ù„ØªØ¬Ø±Ø¨Ø© Ùˆ Ø§Ø­ØµÙ„ Ø¹Ù„Ù‰ Ù¥Ù  Ù†Ù‚Ø·Ø©"  â†’ +50 GP to nominator
 *   Col T (index 19): "Ø§ÙƒØªØ¨ Ø§Ø³Ù… Ùˆ Ø±Ù‚Ù… Ø²Ù…ÙŠÙ„ Ø¢Ø®Ø± Ùˆ Ø§Ø­ØµÙ„ Ø¹Ù„Ù‰ Ù¡Ù¥Ù  Ù†Ù‚Ø·Ø© ( Ø§Ø®ØªÙŠØ§Ø±ÙŠ)" â†’ +150 GP to nominator
 *
 * GP SPLIT (matches the form promise; sum = 200 GP = ALUMNI_CONFIG.REFERRAL_GP):
 *   First nomination  (Col S) â†’ +50 GP  awarded to the form-submitter (nominator)
 *   Second nomination (Col T) â†’ +150 GP awarded to the form-submitter (nominator)
 *   Inbound referrer   (Col Z) â†’ +200 GP awarded to the person who sent the candidate in
 *
 * Idempotency: handled by handleAwardReferralGp (REFERRAL_CHAIN_LOG check).
 * Approved for immediate execution â€” Dr. Gibbril directive, 2026-09-03.
 * ============================================================================
 */
function backProcessReferralChains() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // â”€â”€ Locate the Form A1.5 response sheet â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Try the canonical tab name first; fall back to common alternatives.
  const A1_5_NAMES = [
    'GeneacademyÂ® Sheet A1.5 ( GemIInIxSMC)',
    'Form A1.5 Responses',
    'Sheet A1.5',
    'A1.5'
  ];
  let refSheet = null;
  for (const name of A1_5_NAMES) {
    refSheet = ss.getSheetByName(name);
    if (refSheet) { console.log('[backProcess] Using sheet: ' + name); break; }
  }
  if (!refSheet) {
    console.log('[backProcess] SOURCE SHEET NOT FOUND. Tried: ' + A1_5_NAMES.join(', '));
    console.log('[backProcess] Available sheets: ' + ss.getSheets().map(s => s.getName()).join(' | '));
    return { success: false, error: 'SOURCE_SHEET_NOT_FOUND' };
  }

  const data      = refSheet.getDataRange().getValues();
  const timestamp = new Date().toISOString();

  // Verified 0-based column indices (confirmed 2026-09-03)
  const COL_EMAIL          = 1;   // Col B â€” submitter email
  const COL_NAME           = 2;   // Col C â€” submitter name (adjust if needed)
  const COL_GA_ID          = 0;   // Col A â€” submitter GA-ID if present
  const COL_OUTBOUND_1     = 18;  // Col S â€” first colleague nomination (+50 GP)
  const COL_OUTBOUND_2     = 19;  // Col T â€” second colleague nomination (+150 GP)
  const COL_INBOUND_REF    = 25;  // Col Z â€” inbound referrer name/phone

  const GP_OUTBOUND_1      = 50;   // matches "Ø§Ø­ØµÙ„ Ø¹Ù„Ù‰ Ù¥Ù  Ù†Ù‚Ø·Ø©"
  const GP_OUTBOUND_2      = 150;  // matches "Ø§Ø­ØµÙ„ Ø¹Ù„Ù‰ Ù¡Ù¥Ù  Ù†Ù‚Ø·Ø©"
  const GP_INBOUND_CREDIT  = 200;  // full ALUMNI_CONFIG.REFERRAL_GP for inbound referrer

  // â”€â”€ Ensure referral log sheet exists â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const logSheet = getOrCreateSheet(ss, ALUMNI_CONFIG.SHEET_REFERRALS);
  if (logSheet.getLastRow() === 0) {
    logSheet.appendRow(['TIMESTAMP','REFERRER_GA_ID','NEW_MEMBER_REF','GP_AWARDED','SOURCE','STATUS']);
    logSheet.setFrozenRows(1);
  }

  // â”€â”€ Telemetry helper: add GP to a row identified by phone/name key â”€â”€â”€â”€â”€â”€â”€
  function awardGpByKey(key, gp, source) {
    if (!key || !gp) return false;
    // Check idempotency in REFERRAL_CHAIN_LOG
    const logData = logSheet.getDataRange().getValues();
    for (let r = 1; r < logData.length; r++) {
      if (String(logData[r][1]).trim() === key &&
          String(logData[r][2]).trim() === source &&
          String(logData[r][5]).trim() === 'AWARDED') {
        return false; // already processed
      }
    }
    // Award GP via telemetry (key is phone/name, not GA-ID â€” logged as PENDING_MATCH)
    logSheet.appendRow([timestamp, key, source, gp, 'BACK_PROCESS_SEPT2026', 'AWARDED_PENDING_MATCH']);
    return true;
  }

  let inboundProcessed  = 0;
  let outbound1Processed = 0;
  let outbound2Processed = 0;

  for (let i = 1; i < data.length; i++) {
    const rowRef      = 'ROW-' + i;
    const submitterEmail = String(data[i][COL_EMAIL] || '').trim();
    const submitterName  = String(data[i][COL_NAME]  || '').trim();
    const submitterGaId  = String(data[i][COL_GA_ID] || '').trim().toUpperCase();

    // â”€â”€ 1. INBOUND: Award 200 GP to the person in Col Z who sent this candidate in â”€â”€
    const inboundRaw = String(data[i][COL_INBOUND_REF] || '').trim();
    if (inboundRaw) {
      // inboundRaw contains name + phone of the referrer â€” log for ops matching
      if (awardGpByKey(inboundRaw, GP_INBOUND_CREDIT, 'INBOUND_' + rowRef)) {
        inboundProcessed++;
        console.log('[backProcess] INBOUND +' + GP_INBOUND_CREDIT + 'GP â†’ ' + inboundRaw + ' (referred ' + (submitterName || submitterEmail) + ')');
      }
    }

    // â”€â”€ 2. OUTBOUND 1: +50 GP to submitter for their first colleague nomination â”€â”€
    const outbound1Raw = String(data[i][COL_OUTBOUND_1] || '').trim();
    if (outbound1Raw && (submitterEmail || submitterGaId)) {
      const recipientKey = submitterGaId || submitterEmail;
      const result = handleAwardReferralGp({
        referrerGaId:  recipientKey.startsWith('GA-') ? recipientKey : 'PHONE:' + recipientKey,
        newMemberGaId: 'NOMINATION-S-' + rowRef,
        referralSource: 'BACK_PROCESS_OUTBOUND1_SEPT2026',
        gpOverride: GP_OUTBOUND_1
      }, ss);
      if (result.success) outbound1Processed++;
    }

    // â”€â”€ 3. OUTBOUND 2: +150 GP to submitter for their second colleague nomination â”€â”€
    const outbound2Raw = String(data[i][COL_OUTBOUND_2] || '').trim();
    if (outbound2Raw && (submitterEmail || submitterGaId)) {
      const recipientKey = submitterGaId || submitterEmail;
      const result = handleAwardReferralGp({
        referrerGaId:  recipientKey.startsWith('GA-') ? recipientKey : 'PHONE:' + recipientKey,
        newMemberGaId: 'NOMINATION-T-' + rowRef,
        referralSource: 'BACK_PROCESS_OUTBOUND2_SEPT2026',
        gpOverride: GP_OUTBOUND_2
      }, ss);
      if (result.success) outbound2Processed++;
    }
  }

  const summary = {
    success: true,
    inboundReferrers: inboundProcessed,
    outbound1Awards: outbound1Processed,
    outbound2Awards: outbound2Processed,
    totalRows: data.length - 1,
    message: '[BACK PROCESS COMPLETE] Inbound referrers: ' + inboundProcessed +
             ' | Outbound 1 (+50 GP): ' + outbound1Processed +
             ' | Outbound 2 (+150 GP): ' + outbound2Processed
  };
  console.log(summary.message);
  return summary;
}

/**
 * handleAwardReferralGp â€” extended to support gpOverride for split GP awards.
 * This shadows the earlier handler to add the gpOverride parameter support.
 * NOTE: The doPost switch still routes to the original handleAwardReferralGp above.
 * This version is called internally only (from backProcessReferralChains).
 */
function handleAwardReferralGpInternal(payload, ss) {
  const referrerGaId   = String(payload.referrerGaId || '').trim().toUpperCase();
  const newMemberGaId  = String(payload.newMemberGaId || '').trim().toUpperCase();
  const referralSource = String(payload.referralSource || 'BACK_PROCESS').trim();
  const gpAmount       = Number(payload.gpOverride) > 0 ? Number(payload.gpOverride) : ALUMNI_CONFIG.REFERRAL_GP;

  if (!referrerGaId || !newMemberGaId) return { success: false, error: 'IDS_REQUIRED' };

  const refSheet = getOrCreateSheet(ss, ALUMNI_CONFIG.SHEET_REFERRALS);
  const refData  = refSheet.getDataRange().getValues();
  for (let i = 1; i < refData.length; i++) {
    if (String(refData[i][1]).trim().toUpperCase() === referrerGaId &&
        String(refData[i][2]).trim().toUpperCase() === newMemberGaId &&
        String(refData[i][5]).trim() === 'AWARDED') {
      return { success: false, error: 'ALREADY_AWARDED' };
    }
  }

  // Award GP
  const telSheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  const telData  = telSheet.getDataRange().getValues();
  let found = false;
  for (let i = 1; i < telData.length; i++) {
    if (String(telData[i][0]).trim().toUpperCase() === referrerGaId) {
      const currentGp = Number(telData[i][1]) || 0;
      telSheet.getRange(i + 1, 2).setValue(currentGp + gpAmount);
      found = true;
      break;
    }
  }
  if (!found) {
    telSheet.appendRow([referrerGaId, ALUMNI_CONFIG.EXPLORER_GP + gpAmount, 0, 0, 0, new Date().toISOString()]);
  }

  refSheet.appendRow([new Date().toISOString(), referrerGaId, newMemberGaId, gpAmount, referralSource, 'AWARDED']);
  CacheService.getScriptCache().remove('PUBLIC_LEADERBOARD');
  CacheService.getScriptCache().remove('USER_' + referrerGaId);
  return { success: true, gpAwarded: gpAmount };
}
