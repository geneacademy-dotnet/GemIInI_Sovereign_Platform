/**
 * GemIInI Sovereign Platform — UI & Animations Engine (Portal Layout)
 * Handles Universal Search, UI Modals, Animations, and Simulator Rendering.
 */

document.addEventListener("DOMContentLoaded", function () {
  // Check if user is already logged in on page load
  const savedId = localStorage.getItem("gemiini_sovereign_ga_id");
  if (savedId && document.getElementById("sso-authenticated-view")) {
    document.getElementById("sso-unauth-view").style.display = "none";
    document.getElementById("sso-authenticated-view").style.display = "flex";
    if(document.getElementById("sso-doctor-id")) document.getElementById("sso-doctor-id").textContent = savedId;
  }

  initUniversalLookup();
  initMovingCounters();

  if (document.getElementById("ga-cards-grid")) initRegistryCards();
  if (document.getElementById("reviews-feed-container")) initReviewsExplorer();
  if (document.getElementById("raw-question-container")) initRawSimulator();
});

// Logout Helper
function logoutSovereignSession() {
  localStorage.removeItem("gemiini_sovereign_ga_id");
  localStorage.removeItem("gemiini_sovereign_session");
  const authView = document.getElementById("sso-authenticated-view");
  const unauthView = document.getElementById("sso-unauth-view");
  if(authView) authView.style.display = "none";
  if(unauthView) unauthView.style.display = "flex";
  const input = document.getElementById("sso-quick-id");
  if(input) input.value = "";
}

/* =========================================================================
   UNIVERSAL MEMBER LOOKUP (index.html)
   ========================================================================= */
function initUniversalLookup() {
  const input = document.getElementById("quick-id-search-input");
  const btn = document.getElementById("quick-id-search-btn");
  const resultBox = document.getElementById("quick-id-result");

  if (!input || !resultBox || typeof GA_DATABASE === "undefined") return;

  function performSearch() {
    const query = input.value.trim().toLowerCase();
    if (!query) { resultBox.style.display = "none"; return; }

    const matches = GA_DATABASE.filter(m =>
      m.id.toLowerCase().includes(query) || m.name.toLowerCase().includes(query)
    ).slice(0, 5);

    if (matches.length === 0) {
      resultBox.innerHTML = `<div style="padding: 16px; text-align: center; color: gray;">لم يتم العثور على نتائج. تأكد من الرقم.</div>`;
      resultBox.style.display = "block";
      return;
    }

    let html = `<div style="display: flex; flex-direction: column; gap: 8px;">`;
    matches.forEach(m => {
      html += `
        <div style="background: #FFF; padding: 12px; border: 1px solid var(--line); border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
          <div><strong style="color: var(--purple-dark);">${m.id}</strong> - ${m.name}</div>
          <strong style="color: var(--gold);">${(m.gp || 500).toLocaleString()} GP</strong>
        </div>`;
    });
    resultBox.innerHTML = html + `</div>`;
    resultBox.style.display = "block";
  }

  if (btn) btn.addEventListener("click", performSearch);
  input.addEventListener("keydown", e => { if (e.key === "Enter") performSearch(); });
}

/* =========================================================================
   REGISTRY CARDS (registry.html)
   ========================================================================= */
function initRegistryCards() {
  const grid = document.getElementById("ga-cards-grid");
  const countDisplay = document.getElementById("ga-results-count");
  if (!grid || typeof GA_DATABASE === "undefined") return;

  let html = "";
  GA_DATABASE.forEach(m => {
    html += `
      <div class="glass-card" style="padding: 20px; text-align:right;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight: 800; color: var(--purple-brand); font-family: var(--font-mono); font-size:16px;">${m.id}</span>
          <span style="font-size:11px; background:#EDE9FE; color:#4C1D95; padding:2px 8px; border-radius:10px; font-weight:bold;">${m.tier || 'Active'}</span>
        </div>
        <h4 style="margin: 10px 0 4px; color: var(--purple-dark); font-size:16px;">${m.name}</h4>
        <p style="font-size:12px; color:gray;">${m.univ || 'Medical Faculty'}</p>
        <div style="margin-top:12px; border-top:1px solid #eee; padding-top:10px; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:12px; color:gray;">الرصيد المعرفي:</span>
          <span style="color:var(--gold); font-weight:bold; font-family:var(--font-mono); font-size:15px;">${(m.gp || 500).toLocaleString()} GP</span>
        </div>
      </div>`;
  });
  grid.innerHTML = html;
  if(countDisplay) countDisplay.textContent = `${GA_DATABASE.length} عضواً مسجلاً وموثقاً`;
}

/* =========================================================================
   SIMULATOR DATA & UI (smc.html)
   ========================================================================= */
const RAW_BANK_DATA = {
  raw1: {
    meta: "SMC INDEX: #RAW-01 • INTERNAL MEDICINE & CARDIOLOGY",
    prompt: "مريض يبلغ من العمر 58 عاماً، يعاني من ألم حاد خلف عظم القص مع تعرق وغثيان. أظهر تخطيط القلب ST-elevation في المساري II, III, aVF و V4R. بعد إعطاء حبة نتروجليسرين تحت اللسان، هبط ضغط دمه فجأة من 130/85 إلى 75/45 mmHg. ما هو الإجراء السريري الفوري المنقذ للحياة؟",
    options: [
      { text: "أ) إيقاف النترات فوراً والبدء بتسريب محاليل ملحية وريدية (IV Normal Saline Bolus)", correct: true },
      { text: "ب) إعطاء جرعة إضافية من النتروجليسرين لتقليل الحمل القبلي", correct: false },
      { text: "ج) إعطاء مدرات البول وريدياً (IV Furosemide) لتخفيف الاحتقان", correct: false },
      { text: "د) إعطاء حاصرات بيتا (Beta-blockers) لتهدئة نبضات القلب", correct: false }
    ],
    explanation: "التفسير السريري المزدوج: احتشاء البطين الأيمن السفلي (RV Infarction) يعتمد بشكل أساسي على حجم الامتلاء القلبي (Preload-dependent). إعطاء النترات يسبب توسعاً وريدياً حاداً يؤدي لانهيار الضغط والتروية القلبية. الإجراء الصحيح هو الإنعاش السريع بالسوائل الوريدية لدعم الضغط."
  },
  raw2: {
    meta: "SMC INDEX: #RAW-02 • GENERAL SURGERY & TRAUMA",
    prompt: "شاب يبلغ من العمر 24 عاماً تعرض لحادث سير، وصل لقسم الطوارئ بضيق تنفس حاد وتشتت ذهني. الفحص السريري: ضغط الدم 80/50 mmHg، النبض 135 bpm، غياب أصوات التنفس في الجهة اليمنى مع انتفاخ أوردة الرقبة وانحراف القصبة الهوائية لليسار. ما هي الخطوة الأولى الإلزامية؟",
    options: [
      { text: "أ) إجراء صورة أشعة سينية للصدر (Chest X-Ray) لتأكيد التشخيص", correct: false },
      { text: "ب) تصريف الصدر بإبرة عريضة فوراً (Needle Thoracostomy) في المسافة الوربية الثانية", correct: true },
      { text: "ج) إعطاء دم كامل O-negative فوراً", correct: false },
      { text: "د) تركيب أنبوب حنجري والتنفس الصناعي بالضغط الإيجابي", correct: false }
    ],
    explanation: "التفسير السريري: استرواح الصدر الضاغط (Tension Pneumothorax) هو حالة طوارئ سريرية تشخص بالفحص السريري فقط ويحظر إضاعة الوقت في طلب الأشعة. تفريغ الهواء بالإبرة يزيل الضغط عن القلب والأوعية الدموية ويعيد النتاج القلبي فوراً."
  },
  raw3: {
    meta: "SMC INDEX: #RAW-03 • PEDIATRICS & RESUSCITATION",
    prompt: "رضيع عمره 8 أشهر يعاني من إسهال مائي حاد لـ 3 أيام. وصل في حالة خمول مع برودة الأطراف، وزمن عودة امتلاء الشعيرات الدموية 5 ثوانٍ، وضغط دم غير مقاس. ما هي كمية السوائل الوريدية الواجب إعطاؤها كدفعة أولى (Fluid Bolus)؟",
    options: [
      { text: "أ) 10 ml/kg من محلول Dextrose 5%", correct: false },
      { text: "ب) 20 ml/kg من محلول رينجر لاكتات أو نورمال سلاين خلال 15 دقيقة", correct: true },
      { text: "ج) 50 ml/kg من المحلول الملحي خلال ساعتين", correct: false },
      { text: "د) البدء مباشرة بمضادات حيوية واسعة الطيف", correct: false }
    ],
    explanation: "التفسير السريري: بروتوكول إنعاش صدمة نقص الحجم للأطفال يقتضي إعطاء 20 ml/kg من المحاليل متساوية التوتر (Isotonic Crystalloids) سريعاً وإعادة تقييم الدورة الدموية."
  }
};

let currentQuestionKey = "raw1";

function switchRawBank(bankKey) {
  currentQuestionKey = bankKey;
  const bank = RAW_BANK_DATA[bankKey];
  if (!bank) return;

  const metaBadge = document.getElementById("raw-meta-badge");
  if(metaBadge) metaBadge.textContent = bank.meta;

  const promptEl = document.getElementById("raw-case-prompt");
  if(promptEl) promptEl.textContent = bank.prompt;

  const optionsGrid = document.getElementById("raw-options-grid");
  let html = "";
  bank.options.forEach((opt, idx) => {
    html += `
      <button class="raw-opt-btn" onclick="checkLocalAnswer(${idx}, this, '${bankKey}')" style="background:#FFF; border:1.5px solid var(--line); border-radius:8px; padding:14px; text-align:right; font-family:inherit; font-size:14.5px; font-weight:600; cursor:pointer; transition:0.2s;">
        ${opt.text}
      </button>
    `;
  });
  optionsGrid.innerHTML = html;
  
  const expBox = document.getElementById("raw-mtc-explanation");
  if(expBox) expBox.style.display = "none";
}

function checkLocalAnswer(selectedIdx, btnElement, bankKey) {
  const bank = RAW_BANK_DATA[bankKey];
  if (!bank) return;

  const allBtns = document.querySelectorAll(".raw-opt-btn");
  allBtns.forEach(b => b.disabled = true);

  const isCorrect = bank.options[selectedIdx].correct;

  if (isCorrect) {
    btnElement.style.background = "#DCFCE7";
    btnElement.style.borderColor = "#16A34A";
    btnElement.style.color = "#14532D";
    btnElement.innerHTML += " <strong>(إجابة صحيحة ✓)</strong>";

    const scoreBadge = document.getElementById("simulator-score-badge");
    if(scoreBadge) {
      let cur = parseInt(scoreBadge.textContent.replace(/\D/g,'')) || 500;
      cur += 25;
      scoreBadge.textContent = `الرصيد: ${cur} GP (+25)`;
    }
  } else {
    btnElement.style.background = "#FEE2E2";
    btnElement.style.borderColor = "#DC2626";
    btnElement.style.color = "#991B1B";
    btnElement.innerHTML += " <strong>(إجابة غير صحيحة ✗)</strong>";

    // Highlight correct
    allBtns.forEach((b, i) => {
      if(bank.options[i].correct) {
        b.style.background = "#DCFCE7";
        b.style.borderColor = "#16A34A";
        b.style.color = "#14532D";
      }
    });
  }

  const expBox = document.getElementById("raw-mtc-explanation");
  const expText = document.getElementById("raw-mtc-text");
  if(expBox && expText) {
    expText.textContent = bank.explanation;
    expBox.style.display = "block";
  }
}

function nextRawQuestion() {
  const keys = Object.keys(RAW_BANK_DATA);
  let nextIdx = (keys.indexOf(currentQuestionKey) + 1) % keys.length;
  switchRawBank(keys[nextIdx]);
}

function initRawSimulator() {
  switchRawBank("raw1");
}

function initMovingCounters() {
  document.querySelectorAll(".moving-counter").forEach(counter => {
    const target = parseFloat(counter.dataset.target);
    counter.textContent = target + (counter.dataset.suffix || "");
  });
}
function initReviewsExplorer() { /* Handled in reviews.html */ }