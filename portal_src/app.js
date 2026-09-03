/**
 * GemIInI SudaGene Platform — UI & Animations Engine
 * Handles Universal Search, UI Modals, Animations, and Simulator Rendering.
 */

document.addEventListener("DOMContentLoaded", function () {
  // Check if user is already logged in on page load
  const savedId = localStorage.getItem("gemiini_presence_id");
  if (savedId) {
    // If they have an ID saved, we just show the authenticated view
    document.getElementById("sso-unauth-view").style.display = "none";
    document.getElementById("sso-authenticated-view").style.display = "flex";
    document.getElementById("sso-doctor-id").textContent = savedId;
  }

  initUniversalLookup();
  initMovingCounters();

  if (document.getElementById("ga-cards-grid")) initRegistryCards();
  if (document.getElementById("reviews-feed-container")) initReviewsExplorer();
  if (document.getElementById("raw-question-container")) initRawSimulator();
});

// Logout Helper
function logoutGemIInISession() {
  localStorage.removeItem("gemiini_presence_id");
  document.getElementById("sso-authenticated-view").style.display = "none";
  document.getElementById("sso-unauth-view").style.display = "flex";
  document.getElementById("sso-quick-id").value = "";
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
      resultBox.innerHTML = `<div style="padding: 16px; text-align: center;">لم يتم العثور على نتائج. تأكد من الرقم.</div>`;
      resultBox.style.display = "block";
      return;
    }

    let html = `<div style="display: flex; flex-direction: column; gap: 8px;">`;
    matches.forEach(m => {
      html += `
        <div style="background: #FFF; padding: 12px; border: 1px solid var(--line); border-radius: 6px; display: flex; justify-content: space-between;">
          <div><strong style="color: var(--purple-dark);">${m.id}</strong> - ${m.name}</div>
          <strong style="color: var(--gold);">${m.gp.toLocaleString()} GP</strong>
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
        <span style="font-weight: 800; color: var(--purple-brand);">${m.id}</span>
        <h4 style="margin: 8px 0;">${m.name}</h4>
        <p style="font-size:12px; color:gray;">${m.univ}</p>
        <div style="margin-top:10px; border-top:1px solid #eee; padding-top:10px; color:var(--gold); font-weight:bold;">
          ${m.gp.toLocaleString()} GP
        </div>
      </div>`;
  });
  grid.innerHTML = html;
  if(countDisplay) countDisplay.textContent = `${GA_DATABASE.length} عضواً مسجلاً`;
}

/* =========================================================================
   SIMULATOR DATA & UI (smc.html)
   ========================================================================= */
const RAW_BANK_DATA = {
  raw1: {
    meta: "SMC INDEX: #RAW-01-MED-442", specialty: "الطب الباطني",
    prompt: "مريض يبلغ من العمر 58 عاماً، ألم حاد خلف القص... هبط ضغط دمه فجأة إلى 75/45 mmHg. الخطوة الأولى؟",
    options: [
      { text: "أ) إعطاء محاليل وريدية (Normal Saline)", correct: true },
      { text: "ب) نتروجليسرين إضافي", correct: false }
    ],
    explanation: "احتشاء البطين الأيمن يعتمد على Preload. النترات تسبب هبوطاً حاداً. يجب إعطاء سوائل."
  }
};

function switchRawBank(bankKey, btnElement) {
  const bank = RAW_BANK_DATA[bankKey];
  if (!bank) return;
  document.getElementById("raw-case-prompt").innerHTML = bank.prompt;
  const optionsGrid = document.getElementById("raw-options-grid");
  let html = "";
  bank.options.forEach((opt, idx) => {
    html += `<button class="raw-opt-btn btn-secondary" style="width:100%; margin-bottom:10px; padding:15px; text-align:right;" onclick="checkRawAnswer(${idx}, this, '${bankKey}')">${opt.text}</button>`;
  });
  optionsGrid.innerHTML = html;
  document.getElementById("raw-mtc-explanation").style.display = "none";
}

function initRawSimulator() {
  switchRawBank("raw1");
}

/* =========================================================================
   ANIMATIONS & MODALS
   ========================================================================= */
function initMovingCounters() {
  document.querySelectorAll(".moving-counter").forEach(counter => {
    const target = parseFloat(counter.dataset.target);
    counter.textContent = target + (counter.dataset.suffix || "");
  });
}
function initReviewsExplorer() { /* Handled in reviews.html */ }