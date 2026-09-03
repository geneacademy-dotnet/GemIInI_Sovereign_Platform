import re

NEW_BODY = """
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
            Turn Today’s Training into Your <span class="text-teal-300">Professional Pathway</span>
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
          <div class="text-2xl">👤</div>
          <div class="font-bold text-[#1F2937] text-sm">Identity</div>
        </div>
        <div class="p-5 bg-white rounded-xl border border-slate-200 text-center space-y-2 shadow-sm">
          <div class="text-2xl">📋</div>
          <div class="font-bold text-[#1F2937] text-sm">Training</div>
        </div>
        <div class="p-5 bg-white rounded-xl border border-slate-200 text-center space-y-2 shadow-sm">
          <div class="text-2xl">🧠</div>
          <div class="font-bold text-[#1F2937] text-sm">Skills</div>
        </div>
        <div class="p-5 bg-white rounded-xl border border-slate-200 text-center space-y-2 shadow-sm">
          <div class="text-2xl">🛡️</div>
          <div class="font-bold text-[#1F2937] text-sm">Evidence</div>
        </div>
        <div class="p-5 bg-white rounded-xl border border-slate-200 text-center space-y-2 shadow-sm">
          <div class="text-2xl">📈</div>
          <div class="font-bold text-[#1F2937] text-sm">Progress</div>
        </div>
      </div>

      <!-- Simple Visual Diagram -->
      <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs font-bold text-center">
        <div class="flex-1 p-4 bg-slate-50 rounded-xl text-[#123B5D]">Person</div>
        <div class="text-slate-300">➔</div>
        <div class="flex-1 p-4 bg-teal-50 rounded-xl text-[#168C8C]">Verified Training</div>
        <div class="text-slate-300">➔</div>
        <div class="flex-1 p-4 bg-blue-50 rounded-xl text-[#123B5D]">Professional Profile</div>
        <div class="text-slate-300">➔</div>
        <div class="flex-1 p-4 bg-amber-50 rounded-xl text-[#C9A227]">Progress Pathway</div>
        <div class="text-slate-300">➔</div>
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
          <a href="join.html" class="text-xs font-bold text-[#168C8C] hover:underline inline-flex items-center gap-1">Explore Your Pathway →</a>
        </div>

        <!-- Card 2 -->
        <div class="academic-card p-6 bg-slate-50 flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <h3 class="text-lg font-bold font-heading text-[#123B5D]">Students and Graduates</h3>
            <p class="text-xs text-[#64748B]">Medical students and fresh graduates building their first professional verified records.</p>
          </div>
          <a href="join.html" class="text-xs font-bold text-[#168C8C] hover:underline inline-flex items-center gap-1">Explore Your Pathway →</a>
        </div>

        <!-- Card 3 -->
        <div class="academic-card p-6 bg-slate-50 flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <h3 class="text-lg font-bold font-heading text-[#123B5D]">Researchers</h3>
            <p class="text-xs text-[#64748B]">Scientists and clinical researchers engaging with genomics, publishing, and fellowships.</p>
          </div>
          <a href="join.html" class="text-xs font-bold text-[#168C8C] hover:underline inline-flex items-center gap-1">Explore Your Pathway →</a>
        </div>

        <!-- Card 4 -->
        <div class="academic-card p-6 bg-slate-50 flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <h3 class="text-lg font-bold font-heading text-[#123B5D]">Educators and Mentors</h3>
            <p class="text-xs text-[#64748B]">Senior faculty and clinical instructors directing training pods and reviewing progress.</p>
          </div>
          <a href="join.html" class="text-xs font-bold text-[#168C8C] hover:underline inline-flex items-center gap-1">Explore Your Pathway →</a>
        </div>

        <!-- Card 5 -->
        <div class="academic-card p-6 bg-slate-50 flex flex-col justify-between space-y-4 border-l-4 border-l-[#C9A227]">
          <div class="space-y-2">
            <h3 class="text-lg font-bold font-heading text-[#123B5D]">Universities</h3>
            <p class="text-xs text-[#64748B]">Medical faculties looking to digitize their credentialing and curriculum delivery.</p>
          </div>
          <a href="institutions.html" class="text-xs font-bold text-[#C9A227] hover:underline inline-flex items-center gap-1">Explore Your Pathway →</a>
        </div>

        <!-- Card 6 -->
        <div class="academic-card p-6 bg-slate-50 flex flex-col justify-between space-y-4 border-l-4 border-l-[#C9A227]">
          <div class="space-y-2">
            <h3 class="text-lg font-bold font-heading text-[#123B5D]">Hospitals and Institutions</h3>
            <p class="text-xs text-[#64748B]">Teaching hospitals requiring robust simulation labs, genomic testing, and cohort management.</p>
          </div>
          <a href="institutions.html" class="text-xs font-bold text-[#C9A227] hover:underline inline-flex items-center gap-1">Explore Your Pathway →</a>
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
              <span class="text-[#16805B] font-bold">✓</span>
              <span><strong>Completed training:</strong> Official certificates from BLS and surgical workshops.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-[#16805B] font-bold">✓</span>
              <span><strong>Learning milestones:</strong> Progress bars for SMC and MRCS preparation.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-[#16805B] font-bold">✓</span>
              <span><strong>Research activity:</strong> Logged submissions and published abstracts.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-[#16805B] font-bold">✓</span>
              <span><strong>Verified records:</strong> Immutable cryptographic hashes for absolute trust.</span>
            </li>
          </ul>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
          <div class="text-xs font-mono text-slate-500 mb-4 pb-2 border-b border-slate-100 flex justify-between">
            <span>Profile Preview</span>
            <span class="text-emerald-600 font-bold">Verified ✅</span>
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

  <!-- 6. RESEARCH ECOSYSTEM -->
  <section class="py-20 bg-white border-b border-slate-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div class="text-center max-w-3xl mx-auto space-y-3">
        <h2 class="text-2xl sm:text-4xl font-bold font-heading text-[#123B5D]">The Gene Academy Research Ecosystem</h2>
        <p class="text-sm sm:text-base text-[#64748B]">
          Connecting specialized destinations within our ecosystem to foster scientific advancement and scholarly publication.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div class="p-6 space-y-4">
          <div class="w-16 h-16 mx-auto bg-[#123B5D] text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md">GA</div>
          <h3 class="text-lg font-bold font-heading text-[#123B5D]">GeneAcademy</h3>
          <p class="text-xs text-[#64748B]">Learning, professional identity, and progress pathways.</p>
        </div>
        
        <div class="p-6 space-y-4">
          <div class="w-16 h-16 mx-auto bg-[#168C8C] text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md">GL</div>
          <h3 class="text-lg font-bold font-heading text-[#123B5D]">GLOMEt</h3>
          <p class="text-xs text-[#64748B]">Molecular medicine, genomics, and scientific innovation.</p>
          <a href="glomet.html" class="text-xs font-bold text-[#168C8C] hover:underline">Explore GLOMEt →</a>
        </div>

        <div class="p-6 space-y-4">
          <div class="w-16 h-16 mx-auto bg-slate-800 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md">RJ</div>
          <h3 class="text-lg font-bold font-heading text-[#123B5D]">Reach Journal</h3>
          <p class="text-xs text-[#64748B]">Research communication and scholarly publication.</p>
          <a href="journal.html" class="text-xs font-bold text-[#123B5D] hover:underline">Explore the Journal →</a>
        </div>
      </div>
    </div>
  </section>

  <!-- 7. UNIVERSITIES AND INSTITUTIONS -->
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
"""

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

pattern = r'<!-- 2\. HERO SECTION -->.*<!-- FOOTER -->'
new_html = re.sub(pattern, NEW_BODY.strip() + '\n\n  <!-- FOOTER -->', html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("Updated index.html")
