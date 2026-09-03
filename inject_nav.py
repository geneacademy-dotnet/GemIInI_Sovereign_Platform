import os
import re
import glob

# NEW ENGLISH HEADER
ENGLISH_HEADER = """
  <!-- TOP UTILITY BAR -->
  <div class="bg-[#123B5D] text-slate-200 text-xs py-2 px-4 border-b border-slate-700 font-mono">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2 hidden md:flex">
        <span class="w-2 h-2 rounded-full bg-[#16805B]"></span>
        <span>GENE ACADEMY &bull; SOVEREIGN MEDICAL ECOSYSTEM</span>
      </div>
      <div class="flex items-center gap-4 ml-auto">
        <div class="flex items-center gap-1 font-bold">
          <span class="text-white">English</span>
          <span class="text-slate-500">/</span>
          <a href="index_ar.html" class="text-slate-300 hover:text-white transition font-sans">العربية</a>
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
              <a href="pedigree.html" class="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-[#168C8C] transition">Genomic Learning</a>
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
              <a href="journal.html" class="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-[#168C8C] transition">Reach Journal</a>
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
"""

# ARABIC HEADER
ARABIC_HEADER = ENGLISH_HEADER.replace(">English<", ">العربية<").replace("index_ar.html", "index.html").replace(">العربية<", ">English<").replace("Member Sign In", "تسجيل الدخول").replace("Programs", "البرامج").replace("Professional Identity", "الهوية المهنية").replace("Research", "الأبحاث").replace("Universities", "الجامعات").replace("Institutions", "المؤسسات").replace("Join Our Network", "انضم إلى شبكتنا")

def inject(html_content, header_block):
    # Regex to find everything from <!-- TOP UTILITY BAR --> to </header>
    pattern = r'<!-- TOP UTILITY BAR -->.*?</header>'
    return re.sub(pattern, header_block.strip(), html_content, flags=re.DOTALL)

for filepath in glob.glob("*.html"):
    if filepath in ['join.html', 'join_ar.html', 'login.html', 'login_ar.html', 'nav_prototype.html', 'nav_prototype_ar.html']:
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if '<!-- TOP UTILITY BAR -->' in content and '</header>' in content:
        if '_ar.html' in filepath:
            new_content = inject(content, ARABIC_HEADER)
        else:
            new_content = inject(content, ENGLISH_HEADER)
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
