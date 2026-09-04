/**
 * GemIInI Sovereign Platform — Dedicated Per-Page AI Assistant & Concierge
 * Release: v3.0 (September 2026)
 * Governed by GA Leadership & Functional Desks
 */

(function () {
  const PAGE_ASSISTANT_CONFIG = {
    'index.html': {
      officerAr: 'د. محمد جبريل',
      officerEn: 'Dr. Mohamed Gibbril',
      roleAr: 'المؤسس والرئيس التنفيذي (GA-000)',
      roleEn: 'Founder & Executive Director (GA-000)',
      email: 'mohamedgibbril@geneacademy.net',
      phone: '+201015922628',
      whatsapp: '201015922628',
      avatar: '👨‍⚕️',
      greetingAr: 'مرحباً بك في المنظومة! أنا مساعد المكتب التنفيذي. كيف يمكنني مساعدتك اليوم في استكشاف برامجنا السريرية والأكاديمية؟',
      greetingEn: 'Welcome! I am the Executive Office Assistant. How can I help you explore our clinical & academic programs today?',
      quickQuestions: [
        { ar: 'ما هي منظومة GemIInI SudaGene؟', en: 'What is GemIInI SudaGene Consortium?' },
        { ar: 'كيف يمكنني الانضمام للأكاديمية؟', en: 'How do I join the Academy?' },
        { ar: 'التواصل المباشر مع الرئيس التنفيذي', en: 'Contact Executive Office directly' }
      ]
    },
    'join.html': {
      officerAr: 'م. أمجد قرشي',
      officerEn: 'Eng. Amjad Gorashi',
      roleAr: 'رئيس العمليات ومكتب القبول (GA-011)',
      roleEn: 'Head of Operations & Admissions (GA-011)',
      email: 'admissions@geneacademy.net',
      phone: '+249969121358',
      whatsapp: '249969121358',
      avatar: '📋',
      greetingAr: 'أهلاً بك في مكتب القبول الموحد! أنا معك لإرشادات التسجيل وتوجيه المسار الأكاديمي المناسب.',
      greetingEn: 'Welcome to Admissions! I am here to guide your application and help choose your clinical pathway.',
      quickQuestions: [
        { ar: 'ما هي الأوراق المطلوبة للتسجيل؟', en: 'What documents are required for registration?' },
        { ar: 'كيف يتم تأكيد دفع الرسوم عبر فودافون كاش؟', en: 'How to confirm Vodafone Cash payment?' },
        { ar: 'متابعة حالة استمارة القبول', en: 'Track my admission status' }
      ]
    },
    'bls.html': {
      officerAr: 'د. محمد صبري',
      officerEn: 'Dr. Mohammed Sabri',
      roleAr: 'مدير التدريب السريري ومحاكاة AHA (GA-5405)',
      roleEn: 'Clinical Simulation Director (AHA Lic. 1549)',
      email: 'mohamed.sabri@geneacademy.net',
      phone: '+20117099150',
      whatsapp: '20117099150',
      avatar: '🩺',
      greetingAr: 'مرحباً بك في قسم ورش الإنعاش القلبي (BLS)! أنا هنا لمساعدتك في حجز مقعدك بمركز د. صبري بالقاهرة (الدقي).',
      greetingEn: 'Welcome to BLS Resuscitation! I am here to help secure your hands-on seat at STC Center in Dokki, Cairo.',
      quickQuestions: [
        { ar: 'ما هو ميعاد الورشة القادمة بالقاهرة؟', en: 'When is the next Dokki workshop date?' },
        { ar: 'هل الشهادة معتمدة من AHA؟', en: 'Is the certificate AHA-accredited?' },
        { ar: 'حجز مقعد فوراً عبر واتساب', en: 'Book seat directly via WhatsApp' }
      ]
    },
    'smc.html': {
      officerAr: 'د. آلاء عبد الحفيظ مرسي',
      officerEn: 'Dr. Alaa Abdelhafiz Mursi',
      roleAr: 'المدير الطبي ومسؤول امتحانات المجلس الطبي (GA-001)',
      roleEn: 'Medical Director & Council Exams Lead (GA-001)',
      email: 'alaa.mursi@geneacademy.net',
      phone: '+353874923507',
      whatsapp: '353874923507',
      avatar: '🔬',
      greetingAr: 'أهلاً بك في مضمار امتحانات المجلس الطبي SMC! أساعدك في خوض الـ 2,500 سيناريو سريري وحساب نقاط GP.',
      greetingEn: 'Welcome to the SMC Licensing Marathon! I can assist with clinical vignettes and GP score telemetry.',
      quickQuestions: [
        { ar: 'كيف يتم احتساب نقاط الـ GP في الامتحانات؟', en: 'How are GP points calculated for clinical cases?' },
        { ar: 'ما هي نسبة النجاح المطلوبة لتوثيق MTC؟', en: 'What is the required pass mark for MTC certification?' },
        { ar: 'طلب استشارة أكاديمية في أسئلة المجلس', en: 'Request clinical case consultation' }
      ]
    },
    'universities.html': {
      officerAr: 'د. صفاء عبد القادر',
      officerEn: 'Dr. Safaa Elhassan',
      roleAr: 'عميد الشؤون الأكاديمية والمناهج (GA-004)',
      roleEn: 'Academic Dean & Curriculum Lead (GA-004)',
      email: 'safaa.elhassan@geneacademy.net',
      phone: '+96550872572',
      whatsapp: '96550872572',
      avatar: '🏛️',
      greetingAr: 'مرحباً بك في دليل الكليات الطبية الوطنية! أنا معك لمراجعة وتحديث بيانات المؤسسات والتحقق من الاعتماد.',
      greetingEn: 'Welcome to the National Medical Faculties Directory! I handle institutional reviews & university telemetry.',
      quickQuestions: [
        { ar: 'كيف يتم ربط الكلية بتتبع MASTER_AUTH؟', en: 'How is a university linked to telemetry?' },
        { ar: 'اقترأح تصحيح بيانات كلية طبية', en: 'Suggest a faculty directory correction' },
        { ar: 'التواصل مع الشؤون الأكاديمية', en: 'Contact Academic Dean Desk' }
      ]
    },
    'verify.html': {
      officerAr: 'مكتب التدقيق الرقمي SudaPass™',
      officerEn: 'SudaPass Verification Desk',
      roleAr: 'وحدة التشفير والتحقق السحابي',
      roleEn: 'Cryptographic Credential Verification Unit',
      email: 'sudapass@geneacademy.net',
      phone: '+201015922628',
      whatsapp: '201015922628',
      avatar: '🔐',
      greetingAr: 'مرحباً بك في بوابة SudaPass™! يمكنك التحقق اللحظي من أي شهادة أو معرف أكاديمي عبر التشفير الرقمي.',
      greetingEn: 'Welcome to SudaPass™ Verification! You can perform instant SHA-256 checks on any candidate certificate.',
      quickQuestions: [
        { ar: 'كيف أتحقق من صحة كود GA-ID؟', en: 'How do I verify a GA-ID code?' },
        { ar: 'ماذا تعني حالة ACCREDITED؟', en: 'What does ACCREDITED status mean?' },
        { ar: 'طلب تدقيق شهادة جهة رسمية', en: 'Request official certificate audit' }
      ]
    },
    'partnerships.html': {
      officerAr: 'مكتب الشراكات المؤسسية B2B',
      officerEn: 'B2B Institutional Partnerships Desk',
      roleAr: 'قطاع الترخيص وتجهيزات المحاكاة GLOMEt',
      roleEn: 'Simulation Center Licensing & GLOMEt Equipment',
      email: 'b2b@geneacademy.net',
      phone: '+201015922628',
      whatsapp: '201015922628',
      avatar: '🤝',
      greetingAr: 'أهلاً بك في قطاع الشراكات! نساعد الكليات والمستشفيات في ترخيص مراكز المحاكاة السريرية والسجل الإلكتروني.',
      greetingEn: 'Welcome to B2B Partnerships! We assist faculties & hospitals with simulation licensing & e-logbook integration.',
      quickQuestions: [
        { ar: 'كيف يتم ترخيص مركز محاكاة سريرية؟', en: 'How to license a simulation center?' },
        { ar: 'طلب عرض أسعار تجهيزات GLOMEt', en: 'Request GLOMEt equipment quotation' },
        { ar: 'تحديد موعد اجتماع شراكة', en: 'Schedule a partnership meeting' }
      ]
    }
  };

  function getCurrentPageKey() {
    const path = window.location.pathname.split('/').pop().toLowerCase();
    return PAGE_ASSISTANT_CONFIG[path] ? path : 'index.html';
  }

  function initAssistantWidget() {
    const pageKey = getCurrentPageKey();
    const config = PAGE_ASSISTANT_CONFIG[pageKey];
    const isAr = (document.documentElement.lang || 'ar') === 'ar';

    // Inject CSS styles
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      #gemiini-assistant-btn {
        position: fixed;
        bottom: 24px;
        left: 24px;
        z-index: 9990;
        background: linear-[#0B1426];
        background-color: #0B1426;
        color: #00F2FE;
        border: 1px solid rgba(0, 242, 254, 0.3);
        border-radius: 9999px;
        padding: 12px 20px;
        font-family: 'Cairo', 'Plus Jakarta Sans', sans-serif;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 10px 25px -5px rgba(0, 242, 254, 0.25);
        display: flex;
        items-center;
        gap: 10px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      html[dir="ltr"] #gemiini-assistant-btn {
        left: auto;
        right: 24px;
      }
      #gemiini-assistant-btn:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 15px 30px -5px rgba(0, 242, 254, 0.4);
        border-color: #00F2FE;
      }
      #gemiini-assistant-panel {
        position: fixed;
        bottom: 90px;
        left: 24px;
        z-index: 9995;
        width: 360px;
        max-width: calc(100vw - 48px);
        background: rgba(11, 20, 38, 0.95);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(0, 242, 254, 0.2);
        border-radius: 20px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        color: #F8FAFC;
        font-family: 'Cairo', 'Plus Jakarta Sans', sans-serif;
        overflow: hidden;
        display: none;
        flex-direction: column;
        animation: assistantSlideUp 0.3s ease-out forwards;
      }
      html[dir="ltr"] #gemiini-assistant-panel {
        left: auto;
        right: 24px;
      }
      @keyframes assistantSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .gemiini-asst-header {
        background: linear-gradient(135deg, #123B5D 0%, #060D1A 100%);
        padding: 16px;
        border-b: 1px solid rgba(0, 242, 254, 0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .gemiini-asst-body {
        padding: 16px;
        space-y: 12px;
        max-height: 420px;
        overflow-y: auto;
      }
      .gemiini-asst-chip {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 10px 14px;
        font-size: 12px;
        font-weight: 600;
        color: #E2E8F0;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: right;
        margin-bottom: 8px;
      }
      html[dir="ltr"] .gemiini-asst-chip { text-align: left; }
      .gemiini-asst-chip:hover {
        background: rgba(0, 242, 254, 0.1);
        border-color: rgba(0, 242, 254, 0.4);
        color: #00F2FE;
      }
      .gemiini-btn-wa {
        background: #25D366;
        color: #FFFFFF;
        font-weight: 700;
        text-align: center;
        padding: 12px;
        border-radius: 12px;
        display: block;
        text-decoration: none;
        font-size: 13px;
        margin-top: 12px;
        transition: background 0.2s ease;
      }
      .gemiini-btn-wa:hover { background: #1EBE5D; }
    `;
    document.head.appendChild(styleEl);

    // Create trigger button
    const btn = document.createElement('button');
    btn.id = 'gemiini-assistant-btn';
    btn.innerHTML = `
      <span style="font-size:18px">${config.avatar}</span>
      <span>${isAr ? `مساعد الصفحة (${config.officerAr.split(' ')[0]})` : `Page AI (${config.officerEn.split(' ')[0]})`}</span>
      <span style="width:8px; height:8px; border-radius:50%; background:#00F2FE; display:inline-block; animation: pulse 2s infinite;"></span>
    `;
    document.body.appendChild(btn);

    // Create panel
    const panel = document.createElement('div');
    panel.id = 'gemiini-assistant-panel';
    panel.innerHTML = `
      <div class="gemiini-asst-header">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:24px;">${config.avatar}</span>
          <div>
            <div style="font-weight:800; font-size:14px; color:#FFFFFF;">${isAr ? config.officerAr : config.officerEn}</div>
            <div style="font-size:10px; color:#00F2FE; font-family:monospace;">${isAr ? config.roleAr : config.roleEn}</div>
          </div>
        </div>
        <button id="gemiini-asst-close" style="background:none; border:none; color:#94A3B8; font-size:18px; cursor:pointer;">&times;</button>
      </div>

      <div class="gemiini-asst-body">
        <div style="background:rgba(0,242,254,0.06); border:1px solid rgba(0,242,254,0.15); border-radius:12px; padding:12px; font-size:12px; line-height:1.6; color:#E2E8F0; margin-bottom:12px;">
          ${isAr ? config.greetingAr : config.greetingEn}
        </div>

        <div style="font-size:11px; font-weight:700; color:#94A3B8; margin-bottom:8px; text-transform:uppercase; tracking-wider;">
          ${isAr ? 'الاستفسارات الشائعة المباشرة:' : 'Common Quick Queries:'}
        </div>

        <div id="gemiini-asst-chips">
          ${config.quickQuestions.map(q => `
            <div class="gemiini-asst-chip" data-query="${isAr ? q.ar : q.en}">
              📌 ${isAr ? q.ar : q.en}
            </div>
          `).join('')}
        </div>

        <a href="https://wa.me/${config.whatsapp}?text=${encodeURIComponent(isAr ? `مرحباً، أود التواصل مع ${config.officerAr} بشأن استفسار عبر الموقع.` : `Hello, I would like to contact ${config.officerEn} regarding an inquiry.`)}" target="_blank" class="gemiini-btn-wa">
          💬 ${isAr ? `تواصل مباشر عبر الواتساب (${config.phone})` : `Direct WhatsApp Contact (${config.phone})`}
        </a>
        <a href="mailto:${config.email}" style="display:block; text-align:center; font-size:11px; color:#94A3B8; margin-top:8px; text-decoration:none;">
          ✉️ ${config.email}
        </a>
      </div>
    `;
    document.body.appendChild(panel);

    // Event handlers
    btn.addEventListener('click', () => {
      const isHidden = panel.style.display === 'none' || !panel.style.display;
      panel.style.display = isHidden ? 'flex' : 'none';
    });

    document.getElementById('gemiini-asst-close').addEventListener('click', () => {
      panel.style.display = 'none';
    });

    document.querySelectorAll('.gemiini-asst-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const queryText = e.currentTarget.getAttribute('data-query');
        const waUrl = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent((isAr ? `استفسار حول: ` : `Inquiry about: `) + queryText)}`;
        window.open(waUrl, '_blank');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAssistantWidget);
  } else {
    initAssistantWidget();
  }
})();
