/**
 * GemIInI Sovereign Platform — Master Application Logic & Secure Engines
 * Includes: Sovereign Credential Verifier, Universal Member Search,
 * Verified Review Explorer & Deep Audit Modal, Gated Diploma Engine, and MTC Simulator.
 */

document.addEventListener("DOMContentLoaded", function () {
  initSovereignStatusVerifier();
  initUniversalLookup();
  initMovingCounters();
  initFaqAccordions();
  initFinanceCopyButtons();

  // Page Specific Inits
  if (document.getElementById("ga-cards-grid")) {
    initRegistryCards();
  }
  if (document.getElementById("reviews-feed-container")) {
    initReviewsExplorer();
  }
  if (document.getElementById("raw-question-container")) {
    initRawSimulator();
  }
});

/* =========================================================================
   1. SOVEREIGN REGISTRY CREDENTIAL VERIFIER (members.geneacademy.net gateway)
   ========================================================================= */
function initSovereignStatusVerifier() {
  const savedId = localStorage.getItem("gemiini_presence_id");
  if (savedId) {
    applySovereignStatusView(savedId);
  }
}

function executeSovereignLookup() {
  const input = document.getElementById("sso-quick-id");
  if (!input) return;
  const val = input.value.trim().toUpperCase();
  if (!val) {
    alert("يرجى إدخال رقم رقم الهوية المهنية الرقمية (GA#) للتحقق (مثال: GA001 أو GA171 أو GA3454)");
    return;
  }
  applySovereignStatusView(val);
}
window.executeGemIInISync = executeSovereignLookup; // Backward compatibility with templates

function applySovereignStatusView(gaId) {
  let cleanId = gaId.toUpperCase();
  if (!cleanId.startsWith("GA")) {
    cleanId = "GA" + cleanId;
  }

  let member = null;
  if (typeof GA_DATABASE !== "undefined") {
    member = GA_DATABASE.find(m => m.id === cleanId || m.id === cleanId.replace("-", ""));
  }

  const unauthView = document.getElementById("sso-unauth-view");
  const authView = document.getElementById("sso-authenticated-view");

  if (!authView) return;

  if (member) {
    localStorage.setItem("gemiini_presence_id", member.id);
    const nameEl = document.getElementById("sso-doctor-name");
    const idEl = document.getElementById("sso-doctor-id");
    const gpEl = document.getElementById("sso-doctor-gp");
    const univEl = document.getElementById("sso-doctor-univ");
    const avatarEl = document.getElementById("sso-avatar");

    if (nameEl) nameEl.textContent = member.name;
    if (idEl) idEl.textContent = member.id;
    if (gpEl) gpEl.textContent = (member.gp || 500).toLocaleString() + " GP";
    if (univEl) univEl.textContent = (member.univ || "") + (member.role ? " • " + member.role : "");
    if (avatarEl) avatarEl.textContent = member.id.substring(0, 4);

    if (unauthView) unauthView.style.display = "none";
    authView.style.display = "flex";
  } else {
    // Unverified Candidate Record
    localStorage.setItem("gemiini_presence_id", cleanId);
    const nameEl = document.getElementById("sso-doctor-name");
    const idEl = document.getElementById("sso-doctor-id");
    const gpEl = document.getElementById("sso-doctor-gp");
    const univEl = document.getElementById("sso-doctor-univ");
    const avatarEl = document.getElementById("sso-avatar");

    if (nameEl) nameEl.textContent = "معرف قيد التسجيل (" + escapeHtml(cleanId) + ")";
    if (idEl) idEl.textContent = escapeHtml(cleanId);
    if (gpEl) gpEl.textContent = "قيد التدقيق الأكاديمي";
    if (univEl) univEl.textContent = "لم يكتمل التوثيق النهائي عبر SudaPass";
    if (avatarEl) avatarEl.textContent = "GA";

    if (unauthView) unauthView.style.display = "none";
    authView.style.display = "flex";
  }
}

function resetSovereignStatusView() {
  localStorage.removeItem("gemiini_presence_id");
  const unauthView = document.getElementById("sso-unauth-view");
  const authView = document.getElementById("sso-authenticated-view");
  if (authView) authView.style.display = "none";
  if (unauthView) unauthView.style.display = "flex";
}
window.logoutGemIInISession = resetSovereignStatusView;

/* =========================================================================
   2. UNIVERSAL MEMBER LOOKUP (Index / Quick Search)
   ========================================================================= */
function initUniversalLookup() {
  const input = document.getElementById("quick-id-search-input");
  const btn = document.getElementById("quick-id-search-btn");
  const resultBox = document.getElementById("quick-id-result");

  if (!input || !resultBox) return;

  function performSearch() {
    const query = input.value.trim().toLowerCase();
    if (!query) {
      resultBox.style.display = "none";
      return;
    }

    if (typeof GA_DATABASE === "undefined") return;

    const matches = GA_DATABASE.filter(m =>
      m.id.toLowerCase().includes(query) ||
      m.name.toLowerCase().includes(query) ||
      m.univ.toLowerCase().includes(query) ||
      m.role.toLowerCase().includes(query)
    ).slice(0, 6);

    if (matches.length === 0) {
      resultBox.innerHTML = `
        <div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 14px;">
          لم يتم العثور على سجل معتمد مطابق لـ "<strong>${escapeHtml(query)}</strong>".<br>
          <span style="font-size: 12px;">يمكنك تقديم طلب التسجيل والاعتماد عبر <a href="join.html" style="color: var(--purple-brand); font-weight: 700;">بوابة التسجيل الرسمية</a>.</span>
        </div>
      `;
      resultBox.style.display = "block";
      return;
    }

    let html = `<div style="display: flex; flex-direction: column; gap: 8px;">`;
    matches.forEach(m => {
      html += `
        <div style="display: flex; justify-content: space-between; align-items: center; background: #FFFFFF; border: 1px solid var(--line); border-radius: var(--radius-sm); padding: 12px 16px; transition: all 0.2s ease;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <strong style="font-family: var(--font-mono); color: var(--purple-dark); font-size: 15px;">${escapeHtml(m.id)}</strong>
              <span style="font-size: 14px; font-weight: 800; color: var(--text-main);">${escapeHtml(m.name)}</span>
              ${m.hasReview ? `<span class="cert-tag" style="background: var(--gold-light); color: var(--gold-dark); font-size: 10px;">★ مقيّم معتمد</span>` : ""}
            </div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${escapeHtml(m.univ)} • ${escapeHtml(m.role)}</div>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span style="font-family: var(--font-mono); font-weight: 800; color: var(--gold); font-size: 13.5px;">${m.gp.toLocaleString()} GP</span>
            <a href="alumni.html?cert=${encodeURIComponent(m.id)}" class="btn btn-secondary" style="padding: 5px 12px; font-size: 12px;">الشهادة 📜</a>
            ${m.hasReview ? `<a href="reviews.html?id=${encodeURIComponent(m.id)}" class="btn btn-gold" style="padding: 5px 10px; font-size: 12px;">التقييم ★</a>` : ""}
          </div>
        </div>
      `;
    });
    html += `</div>`;
    resultBox.innerHTML = html;
    resultBox.style.display = "block";
  }

  if (btn) btn.addEventListener("click", performSearch);
  input.addEventListener("input", performSearch);
  input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") performSearch();
  });
}

/* =========================================================================
   3. VERIFIED REVIEWS & CLINICAL AUDIT EXPLORER (reviews.html)
   ========================================================================= */
let currentReviewsFilter = {
  specialty: "ALL",
  track: "ALL",
  rating: "ALL",
  query: ""
};

function initReviewsExplorer() {
  renderReviewsList();

  const searchInput = document.getElementById("review-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      currentReviewsFilter.query = e.target.value.trim().toLowerCase();
      renderReviewsList();
    });
  }

  document.querySelectorAll(".review-filter-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      const type = this.dataset.filterType;
      const value = this.dataset.filterValue;

      this.parentElement.querySelectorAll(".review-filter-btn").forEach(b => b.classList.remove("active"));
      this.classList.add("active");

      if (type === "specialty") currentReviewsFilter.specialty = value;
      if (type === "track") currentReviewsFilter.track = value;
      if (type === "rating") currentReviewsFilter.rating = value;

      renderReviewsList();
    });
  });

  const urlParams = new URLSearchParams(window.location.search);
  const targetId = urlParams.get("id");
  if (targetId && typeof GEMIINI_VERIFIED_REVIEWS !== "undefined") {
    const rev = GEMIINI_VERIFIED_REVIEWS.find(r => r.gemiiniId.toLowerCase() === targetId.toLowerCase());
    if (rev) {
      setTimeout(() => openReviewAuditModal(rev.id), 300);
    }
  }
}

function renderReviewsList() {
  const container = document.getElementById("reviews-feed-container");
  const countBadge = document.getElementById("reviews-count-badge");
  if (!container || typeof GEMIINI_VERIFIED_REVIEWS === "undefined") return;

  const filtered = GEMIINI_VERIFIED_REVIEWS.filter(rev => {
    if (currentReviewsFilter.specialty !== "ALL") {
      const matchSpecialty = rev.unitTested.includes(currentReviewsFilter.specialty) ||
        rev.smsbSpecialtyTarget.some(s => s.includes(currentReviewsFilter.specialty));
      if (!matchSpecialty) return false;
    }

    if (currentReviewsFilter.rating !== "ALL") {
      const minStars = parseInt(currentReviewsFilter.rating);
      if (rev.ratings.questionQuality < minStars) return false;
    }

    if (currentReviewsFilter.query) {
      const q = currentReviewsFilter.query;
      const matchQ = rev.doctorName.toLowerCase().includes(q) ||
        rev.gemiiniId.toLowerCase().includes(q) ||
        rev.unitTested.toLowerCase().includes(q) ||
        rev.keyHighlightQuote.toLowerCase().includes(q);
      if (!matchQ) return false;
    }

    return true;
  });

  if (countBadge) {
    countBadge.textContent = `${filtered.length} تقييم سريري موثق`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; background: #FFFFFF; border: 1.5px dashed var(--line); border-radius: var(--radius-md); padding: 40px; text-align: center; color: var(--text-muted);">
        <span style="font-size: 32px; display: block; margin-bottom: 8px;">🔍</span>
        <h4 style="font-size: 18px; color: var(--purple-dark); margin-bottom: 6px;">لا توجد تقييمات مطابقة لخيارات الفلترة الحالية</h4>
        <p style="font-size: 13.5px;">جرب تغيير التخصص، أو إعادة ضبط خانة البحث.</p>
        <button onclick="resetReviewsFilters()" class="btn btn-secondary" style="margin-top: 14px; padding: 6px 16px;">إعادة ضبط الفلاتر ↺</button>
      </div>
    `;
    return;
  }

  let html = "";
  filtered.forEach(rev => {
    const starString = "★".repeat(Math.round(rev.ratings.questionQuality)) + "☆".repeat(5 - Math.round(rev.ratings.questionQuality));
    
    html += `
      <div class="glass-card review-card" style="padding: 28px; display: flex; flex-direction: column; justify-content: space-between; border-top: 4px solid var(--purple-brand); background: #FFFFFF; position: relative;">
        <div>
          <!-- Header: Doctor ID & Stars -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="cert-tag" style="background: var(--purple-light); color: var(--purple-brand); font-family: var(--font-mono); font-weight: 800; font-size: 12px;">
                  ${escapeHtml(rev.gemiiniId)}
                </span>
                <span style="color: var(--teal); font-size: 11px; font-weight: 800;">● موثق رسمياً</span>
              </div>
              <h3 style="font-size: 18px; font-weight: 900; color: var(--purple-dark); margin-top: 4px;">
                ${escapeHtml(rev.doctorName)}
              </h3>
            </div>
            <div style="text-align: left;">
              <div style="color: var(--gold); font-size: 17px; letter-spacing: 1.5px;">${starString}</div>
              <span style="font-size: 11px; color: var(--text-sub); font-family: var(--font-mono);">${escapeHtml(rev.timestamp.split(" ")[0])}</span>
            </div>
          </div>

          <!-- Unit Tested Badge -->
          <div style="background: #FAF7F2; border: 1px solid var(--line); border-radius: var(--radius-sm); padding: 8px 12px; margin-bottom: 14px; font-size: 12.5px; color: var(--text-main); font-weight: 700;">
            🧪 <span style="color: var(--purple-brand);">${escapeHtml(rev.unitTested)}</span>
          </div>

          <!-- Highlight Quote -->
          <p style="font-size: 13.5px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px; font-style: italic;">
            "${escapeHtml(rev.keyHighlightQuote)}"
          </p>

          <!-- 5-Metric Pill Indicators -->
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-bottom: 18px; font-size: 11.5px;">
            <div style="background: #FDFBF7; padding: 5px 8px; border-radius: 4px; border: 1px solid var(--line);">
              <span style="color: var(--text-sub);">جودة الأسئلة:</span> <strong>${rev.ratings.questionQuality}/5 ⭐</strong>
            </div>
            <div style="background: #FDFBF7; padding: 5px 8px; border-radius: 4px; border: 1px solid var(--line);">
              <span style="color: var(--text-sub);">سرعة الدعم:</span> <strong>${rev.ratings.opsSupportSpeed}/5 ⭐</strong>
            </div>
            <div style="background: #FDFBF7; padding: 5px 8px; border-radius: 4px; border: 1px solid var(--line);">
              <span style="color: var(--text-sub);">سلاسة النظام:</span> <strong>${rev.ratings.registrationEase1}/5 ⭐</strong>
            </div>
            <div style="background: #FDFBF7; padding: 5px 8px; border-radius: 4px; border: 1px solid var(--line);">
              <span style="color: var(--text-sub);">المجتمع الطبي:</span> <strong>${rev.ratings.communityInteraction}/5 ⭐</strong>
            </div>
          </div>
        </div>

        <!-- Card Footer CTA: Inspect Full 10-Section Audit -->
        <div style="border-top: 1px solid var(--line); padding-top: 14px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 12px; color: var(--teal); font-weight: 700;">
            ${rev.challengePassed ? "✓ اجتاز التحدي بنجاح" : "⌛ قيد خوض التحدي"}
          </span>
          <button onclick="openReviewAuditModal('${escapeHtml(rev.id)}')" class="btn btn-secondary" style="padding: 6px 14px; font-size: 12.5px; border-color: var(--purple-border); color: var(--purple-brand);">
            عرض تقرير الاستبيان والتدقيق 📋
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function resetReviewsFilters() {
  currentReviewsFilter = { specialty: "ALL", track: "ALL", rating: "ALL", query: "" };
  const searchInput = document.getElementById("review-search-input");
  if (searchInput) searchInput.value = "";
  document.querySelectorAll(".review-filter-btn").forEach(b => {
    if (b.dataset.filterValue === "ALL") b.classList.add("active");
    else b.classList.remove("active");
  });
  renderReviewsList();
}

/* =========================================================================
   4. DEEP AUDIT SHEET MODAL RENDERER
   ========================================================================= */
function openReviewAuditModal(reviewId) {
  if (typeof GEMIINI_VERIFIED_REVIEWS === "undefined") return;
  const rev = GEMIINI_VERIFIED_REVIEWS.find(r => r.id === reviewId);
  if (!rev) return;

  const modalOverlay = document.getElementById("review-audit-modal");
  const modalContent = document.getElementById("review-audit-modal-content");
  if (!modalOverlay || !modalContent) return;

  const currentGroupsList = rev.currentGroups.map(g => `<li style="margin-bottom: 4px;">• ${escapeHtml(g)}</li>`).join("");
  const targetTracksList = rev.nextTargetTrack.map(t => `<li style="margin-bottom: 4px;">• ${escapeHtml(t)}</li>`).join("");
  const futureUnitsList = rev.requestedFutureUnits.map(u => `<li style="margin-bottom: 4px;">• ${escapeHtml(u)}</li>`).join("");
  const futureProjectsList = rev.futureGemIInIProjects.map(p => `<li style="margin-bottom: 4px;">• ${escapeHtml(p)}</li>`).join("");
  const barriersList = rev.sudanPracticeBarriers.map(b => `<li style="margin-bottom: 4px; color: var(--red);">⚠️ ${escapeHtml(b)}</li>`).join("");

  modalContent.innerHTML = `
    <div style="padding: 30px;">
      <!-- Modal Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid var(--line); padding-bottom: 18px; margin-bottom: 24px;">
        <div>
          <span class="cert-tag" style="background: var(--teal-light); color: var(--teal); font-family: var(--font-mono); font-weight: 800; font-size: 11px;">
            VERIFIED RESPONSE • ${escapeHtml(rev.id)}
          </span>
          <h2 style="font-size: 24px; font-weight: 900; color: var(--purple-dark); margin-top: 6px;">
            تقرير التدقيق التشغيلي الكامل: ${escapeHtml(rev.doctorName)}
          </h2>
          <div style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">
            تاريخ التقديم: <span style="font-family: var(--font-mono); font-weight: 700;">${escapeHtml(rev.timestamp)}</span> • 
            المعرف: <span style="font-family: var(--font-mono); color: var(--purple-brand); font-weight: 800;">${escapeHtml(rev.gemiiniId)}</span> • 
            البريد المشفر: <span style="font-family: var(--font-mono);">${escapeHtml(rev.emailMasked)}</span>
          </div>
        </div>
        <button onclick="closeReviewAuditModal()" class="btn btn-secondary" style="padding: 6px 14px; font-size: 16px; border-radius: var(--radius-full);">✕</button>
      </div>

      <!-- 10 Sections Audit Grid -->
      <div style="display: flex; flex-direction: column; gap: 20px; font-size: 13.5px; line-height: 1.7;">
        
        <!-- Section 1 -->
        <div style="background: #FAF7F0; border: 1px solid var(--line); border-radius: var(--radius-md); padding: 18px;">
          <h4 style="color: var(--purple-dark); font-weight: 800; font-size: 15px; margin-bottom: 8px;">1️⃣ التحقق من الهوية الرقمية والربط المؤسسي</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px;">
            <div><strong>تحدي الـ 20 سؤالاً:</strong> <span style="color: var(--teal); font-weight: 700;">${escapeHtml(rev.challengeCompleted)}</span></div>
            <div><strong>توثيق سوداباس (SudaPass):</strong> <span>${escapeHtml(rev.sudaPassStatus)}</span></div>
            <div><strong>مستوى الحساب:</strong> <span style="color: var(--purple-brand); font-weight: 700;">${escapeHtml(rev.levelReached)}</span></div>
            <div><strong>مجموعة الواتساب الرسمية:</strong> <span>${rev.whatsappGroupActive ? "✓ تم التفعيل والإضافة" : "قيد المتابعة"}</span></div>
          </div>
        </div>

        <!-- Section 2 -->
        <div style="background: #FAF7F0; border: 1px solid var(--line); border-radius: var(--radius-md); padding: 18px;">
          <h4 style="color: var(--purple-dark); font-weight: 800; font-size: 15px; margin-bottom: 8px;">2️⃣ خارطة المجموعات والمسارات التدريبية</h4>
          <p><strong>الوحدة التي تم اختبارها:</strong> <span style="color: var(--purple-brand); font-weight: 800;">${escapeHtml(rev.unitTested)}</span></p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; margin-top: 10px;">
            <div>
              <strong>المجموعات المشترك بها حالياً:</strong>
              <ul style="list-style: none; padding-right: 0; margin-top: 4px; font-size: 12.5px; color: var(--text-muted);">${currentGroupsList}</ul>
            </div>
            <div>
              <strong>المسار المستهدف القادم:</strong>
              <ul style="list-style: none; padding-right: 0; margin-top: 4px; font-size: 12.5px; color: var(--text-muted);">${targetTracksList}</ul>
            </div>
          </div>
        </div>

        <!-- Section 3: Detailed Ratings -->
        <div style="background: #FAF7F0; border: 1px solid var(--line); border-radius: var(--radius-md); padding: 18px;">
          <h4 style="color: var(--purple-dark); font-weight: 800; font-size: 15px; margin-bottom: 8px;">3️⃣ درجات التقييم وتجربة النظام (1 - 5 نجوم)</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-top: 8px;">
            <div style="background: #FFFFFF; padding: 10px; border-radius: 6px; border: 1px solid var(--line);">
              <span style="color: var(--text-sub); display: block; font-size: 11.5px;">جودة صياغة الأسئلة</span>
              <strong style="color: var(--gold); font-size: 16px;">${rev.ratings.questionQuality} / 5 ⭐</strong>
            </div>
            <div style="background: #FFFFFF; padding: 10px; border-radius: 6px; border: 1px solid var(--line);">
              <span style="color: var(--text-sub); display: block; font-size: 11.5px;">سرعة دعم الفريق</span>
              <strong style="color: var(--gold); font-size: 16px;">${rev.ratings.opsSupportSpeed} / 5 ⭐</strong>
            </div>
            <div style="background: #FFFFFF; padding: 10px; border-radius: 6px; border: 1px solid var(--line);">
              <span style="color: var(--text-sub); display: block; font-size: 11.5px;">سلاسة التسجيل</span>
              <strong style="color: var(--gold); font-size: 16px;">${rev.ratings.registrationEase1} / 5 ⭐</strong>
            </div>
            <div style="background: #FFFFFF; padding: 10px; border-radius: 6px; border: 1px solid var(--line);">
              <span style="color: var(--text-sub); display: block; font-size: 11.5px;">تفاعل المجتمع الطبي</span>
              <strong style="color: var(--gold); font-size: 16px;">${rev.ratings.communityInteraction} / 5 ⭐</strong>
            </div>
          </div>
        </div>

        <!-- Section 5: Strategic UX & Exclusivity -->
        <div style="background: #FAF7F0; border: 1px solid var(--line); border-radius: var(--radius-md); padding: 18px;">
          <h4 style="color: var(--purple-dark); font-weight: 800; font-size: 15px; margin-bottom: 8px;">5️⃣ تقييم بيئة المستخدم والتأثير الاستراتيجي</h4>
          <p><strong>وضوح وسلاسة النظام:</strong> ${escapeHtml(rev.uxClarity)}</p>
          <p style="margin-top: 6px;"><strong>حصرية المنصة وأسبقيتها في السوق:</strong> <span style="color: var(--teal); font-weight: 700;">${escapeHtml(rev.marketExclusivity)}</span></p>
          <p style="margin-top: 6px;"><strong>الاستعداد للاعتماد الكلي كمرجع أساسي:</strong> <span style="color: var(--purple-brand); font-weight: 700;">${escapeHtml(rev.fullAdoptionReadiness)}</span></p>
        </div>

        <!-- Section 6 & 8: Pricing Willingness & SMSB Reality -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
          <div style="background: #FAF7F0; border: 1px solid var(--line); border-radius: var(--radius-md); padding: 18px;">
            <h4 style="color: var(--purple-dark); font-weight: 800; font-size: 15px; margin-bottom: 8px;">6️⃣ باقات الاستثمار والاستعداد المالي</h4>
            <p><strong>العملة المفضلة:</strong> ${escapeHtml(rev.preferredCurrency)}</p>
            <p><strong>طريقة التحويل:</strong> ${escapeHtml(rev.preferredPaymentMethod)}</p>
            <div style="margin-top: 8px; font-size: 12.5px; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid var(--line);">
              <div>باقة 400 سؤال: <strong>${escapeHtml(rev.pricingWillingness.pack400Q)}</strong></div>
              <div>باقة 800 سؤال: <strong>${escapeHtml(rev.pricingWillingness.pack800Q)}</strong></div>
              <div>باقة 1200 سؤال: <strong>${escapeHtml(rev.pricingWillingness.pack1200Q)}</strong></div>
            </div>
          </div>

          <div style="background: #FAF7F0; border: 1px solid var(--line); border-radius: var(--radius-md); padding: 18px;">
            <h4 style="color: var(--purple-dark); font-weight: 800; font-size: 15px; margin-bottom: 8px;">8️⃣ تقييم عوائق الممارسة والواقع الطبي بالسودان</h4>
            <p><strong>التخصصات المستهدفة:</strong> ${escapeHtml(rev.smsbSpecialtyTarget.join("، "))}</p>
            <strong style="display: block; margin-top: 8px; color: var(--purple-dark);">أبرز العوائق التي تواجه الطبيب في السودان:</strong>
            <ul style="list-style: none; padding-right: 0; margin-top: 4px; font-size: 12px;">${barriersList}</ul>
          </div>
        </div>

      </div>

      <!-- Footer Actions -->
      <div style="margin-top: 24px; padding-top: 16px; border-top: 1.5px solid var(--line); display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 12px; color: var(--text-sub);">
          سجل تدقيق رقمي معتمد لدى إدارة المتابعة الأكاديمية والتوثيق السيادي
        </span>
        <button onclick="closeReviewAuditModal()" class="btn btn-primary" style="padding: 8px 24px;">إغلاق التقرير ✓</button>
      </div>
    </div>
  `;

  modalOverlay.style.display = "flex";
}

function closeReviewAuditModal() {
  const modalOverlay = document.getElementById("review-audit-modal");
  if (modalOverlay) modalOverlay.style.display = "none";
}

/* =========================================================================
   5. MASTER REGISTRY CARDS RENDERER (registry.html)
   ========================================================================= */
function initRegistryCards() {
  const grid = document.getElementById("ga-cards-grid");
  const tierPills = document.querySelectorAll(".tier-pill");
  const searchInput = document.getElementById("registry-search-input");
  const countDisplay = document.getElementById("registry-member-count");

  if (!grid || typeof GA_DATABASE === "undefined") return;

  let currentTier = "all";
  let currentSearch = "";
  let displayLimit = 48;

  function renderGrid() {
    let filtered = GA_DATABASE.filter(m => {
      if (currentTier !== "all") {
        if (currentTier.toLowerCase() === "bls") {
          if (!m.isBlsCertified) return false;
        } else if (m.tier.toLowerCase() !== currentTier.toLowerCase()) {
          return false;
        }
      }
      if (currentSearch) {
        const q = currentSearch.toLowerCase();
        const match = m.id.toLowerCase().includes(q) ||
          m.name.toLowerCase().includes(q) ||
          m.univ.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q) ||
          (m.tags && m.tags.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });

    if (countDisplay) {
      countDisplay.textContent = `تم العثور على ${filtered.length} طبيب وباحث مسجل`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; background: #FFFFFF; border: 1px dashed var(--line); border-radius: var(--radius-md); padding: 40px; text-align: center; color: var(--text-muted);">
          لم يتم العثور على نتائج مطابقة لـ "${escapeHtml(currentSearch)}".
        </div>
      `;
      return;
    }

    const visibleItems = filtered.slice(0, displayLimit);
    let html = "";
    visibleItems.forEach(m => {
      html += `
        <div class="glass-card member-card" style="padding: 20px; background: #FFFFFF; border-radius: var(--radius-md); border: 1px solid var(--line); display: flex; flex-direction: column; justify-content: space-between; transition: all 0.2s ease;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; flex-wrap: wrap; gap: 6px;">
              <span class="cert-tag" style="font-family: var(--font-mono); font-weight: 800; font-size: 11px; background: var(--purple-light); color: var(--purple-brand);">
                ${escapeHtml(m.id)}
              </span>
              ${m.isBlsCertified ? `<span class="cert-tag" style="background: #FEE2E2; color: #991B1B; font-size: 10.5px; font-weight: 800; border-color: #FCA5A5;">🫀 أخصائي BLS معتمد</span>` : ""}
              <span style="font-family: var(--font-mono); color: var(--gold); font-weight: 800; font-size: 12.5px;">
                ${m.gp.toLocaleString()} GP
              </span>
            </div>
            <h3 style="font-size: 15.5px; font-weight: 800; color: var(--purple-dark); margin-bottom: 4px;">
              ${escapeHtml(m.name)}
            </h3>
            <p style="font-size: 12px; color: var(--teal); font-weight: 600; margin-bottom: 6px;">
              ${escapeHtml(m.role)}
            </p>
            <p style="font-size: 11.5px; color: var(--text-muted);">
              🏛️ ${escapeHtml(m.univ)}
            </p>
          </div>
          
          <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 11px; color: var(--text-sub);">
              ${m.isBlsCertified ? "✓ خريج وأخصائي BLS" : (m.sudaPass ? "✓ SudaPass" : "سجل نشط")}
            </span>
            <div style="display: flex; gap: 6px;">
              <a href="alumni.html?cert=${encodeURIComponent(m.id)}" class="btn btn-secondary" style="padding: 3px 8px; font-size: 11px;">الشهادة 📜</a>
              ${m.hasReview ? `<a href="reviews.html?id=${encodeURIComponent(m.id)}" class="btn btn-gold" style="padding: 3px 6px; font-size: 11px;">التقييم ★</a>` : ""}
            </div>
          </div>
        </div>
      `;
    });

    if (filtered.length > displayLimit) {
      html += `
        <div style="grid-column: 1 / -1; text-align: center; margin-top: 20px; padding: 20px;">
          <button id="load-more-ga-btn" class="btn btn-secondary" style="padding: 12px 32px; font-size: 14px; border-color: var(--purple-brand); color: var(--purple-brand); font-weight: 800;">
            عرض المزيد (+48 طبيب من أصل ${filtered.length}) ➔
          </button>
        </div>
      `;
    }

    grid.innerHTML = html;

    const loadMoreBtn = document.getElementById("load-more-ga-btn");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", function() {
        displayLimit += 48;
        renderGrid();
      });
    }
  }

  tierPills.forEach(pill => {
    pill.addEventListener("click", function() {
      tierPills.forEach(p => p.classList.remove("active"));
      this.classList.add("active");
      currentTier = this.dataset.tier;
      displayLimit = 48;
      renderGrid();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", function(e) {
      currentSearch = e.target.value.trim();
      displayLimit = 48;
      renderGrid();
    });
  }

  renderGrid();
}

/* =========================================================================
   6. GATED DIPLOMA VERIFICATION & GENERATOR ENGINE (alumni.html)
   ========================================================================= */
function generateOrFindDiploma() {
  const input = document.getElementById("diploma-input");
  const preview = document.getElementById("diploma-live-preview");
  const nameDisplay = document.getElementById("diploma-preview-name");
  const idDisplay = document.getElementById("diploma-preview-id");
  const gpDisplay = document.getElementById("diploma-preview-gp");
  const courseDisplay = document.getElementById("diploma-preview-course");
  const errorBox = document.getElementById("diploma-error-box");

  if (!input || !preview) return;

  const val = input.value.trim();
  if (!val) {
    alert("يرجى إدخال اسم الخريج أو رقم رقم الهوية المهنية الرقمية (GA#) للتحقق (مثال: GA171 أو GA997 أو GA130)");
    return;
  }

  let foundMember = null;
  if (typeof GA_DATABASE !== "undefined") {
    foundMember = GA_DATABASE.find(m =>
      m.id.toLowerCase() === val.toLowerCase() ||
      m.name.toLowerCase().includes(val.toLowerCase())
    );
  }

  if (foundMember) {
    if (errorBox) errorBox.style.display = "none";
    if (nameDisplay) nameDisplay.textContent = foundMember.name;
    
    if (foundMember.isBlsCertified) {
      if (idDisplay) idDisplay.textContent = "PROFESSIONAL DIGITAL IDENTITY GA NUMBER: " + foundMember.id + " • CERTIFIED BLS PROVIDER • GEMIINI ALUMNI";
      if (courseDisplay) courseDisplay.textContent = "برنامج دعم الحياة الأساسي المتقدم والإنعاش القلبي الرئوي السريري (Adult & Pediatric BLS Simulation & Resuscitation Certification)";
      if (gpDisplay) gpDisplay.textContent = "ACADEMIC LEDGER: " + foundMember.gp.toLocaleString() + " GP • BLS Certified & GemIInI Alumni";
    } else {
      if (idDisplay) idDisplay.textContent = "PROFESSIONAL DIGITAL IDENTITY GA NUMBER: " + foundMember.id;
      if (gpDisplay) gpDisplay.textContent = "ACADEMIC LEDGER: " + foundMember.gp.toLocaleString() + " GP • " + (foundMember.cert || "SudaPass Verified");
    }

    preview.style.display = "block";
    preview.scrollIntoView({ behavior: "smooth" });
  } else {
    // Honest gated verification feedback
    preview.style.display = "none";
    if (!errorBox) {
      const createdError = document.createElement("div");
      createdError.id = "diploma-error-box";
      createdError.style.cssText = "background: #FEF2F2; border: 1.5px solid #F87171; border-radius: var(--radius-md); padding: 18px; text-align: center; color: #991B1B; margin-top: 20px; font-size: 14px;";
      createdError.innerHTML = `
        <strong>⚠️ تنبيه التحقق الأكاديمي:</strong><br>
        لم يتم العثور على سجل تخرج أو اعتماد مسجل رسمياً بالاسم أو المعرف "<strong>${escapeHtml(val)}</strong>".<br>
        <span style="font-size: 12.5px; color: #B91C1C;">يرجى مراجعة إدارة القيد والتسجيل أو تقديم استمارة التوثيق عبر <a href="join.html" style="color: #7F1D1D; text-decoration: underline; font-weight: 700;">بوابة التسجيل</a>.</span>
      `;
      input.parentElement.appendChild(createdError);
    } else {
      errorBox.innerHTML = `
        <strong>⚠️ تنبيه التحقق الأكاديمي:</strong><br>
        لم يتم العثور على سجل تخرج أو اعتماد مسجل رسمياً بالاسم أو المعرف "<strong>${escapeHtml(val)}</strong>".<br>
        <span style="font-size: 12.5px; color: #B91C1C;">يرجى مراجعة إدارة القيد والتسجيل أو تقديم استمارة التوثيق عبر <a href="join.html" style="color: #7F1D1D; text-decoration: underline; font-weight: 700;">بوابة التسجيل</a>.</span>
      `;
      errorBox.style.display = "block";
    }
  }
}
window.generateOrFindDiploma = generateOrFindDiploma;

/* =========================================================================
   7. RAW 1/2/3/5 INTERACTIVE CLINICAL SIMULATOR (smc.html)
   ========================================================================= */
const RAW_BANK_DATA = {
  raw1: {
    meta: "SMC INDEX: #RAW-01-MED-442 • تكرار الامتحان: 92%",
    specialty: "الطب الباطني • طوارئ القلب والأوعية",
    prompt: `مريض يبلغ من العمر 58 عاماً، حضر إلى قسم الحوادث يشكو من ألم حاد خلف القص يمتد إلى الذراع الأيسر منذ 3 ساعات. أظهر تخطيط القلب (ECG) ارتفاعاً في القطعة ST في الاتجاهات II, III, aVF (احتشاء سفلي Inferior MI). بعد إعطائه قرص نتروجليسرين تحت اللسان، هبط ضغط دمه فجأة إلى 75/45 mmHg مع وذمة وريدية وداجية (Elevated JVP) ورئتين صافيتين تماماً عند التسمع.<br><br><strong>ما هي الخطوة العلاجية الفورية الأكثر أهمية والأولى في هذا السيناريو السريري؟</strong>`,
    options: [
      { text: "أ) إعطاء جرعة فورية من محاليل الملح الوريدية العادية (0.9% Normal Saline Bolus)", correct: true },
      { text: "ب) إعطاء جرعة إضافية من النتروجليسرين بالوريد لخفض الألم", correct: false },
      { text: "ج) إعطاء جرعة عالية من مدر البول فوروسيميد (Lasix) بالوريد", correct: false },
      { text: "د) إعطاء حاصرات بيتا (Beta-blockers) للسيطرة على معدل النبض", correct: false }
    ],
    explanation: "في حالات احتشاء الجدار السفلي، يترافق ما يقارب 30-50% من الحالات مع احتشاء البطين الأيمن (Right Ventricular Infarction). يعتمد النتاج القلبي للبطين الأيمن بشكل حرج على حجم الامتلاء الوريدي (Preload-dependent). إعطاء النترات يسبب توسعاً وريدياً سريعاً وهبوطاً حاداً في الضغط. العلاج الفوري هو تعويض السوائل الوريدية لرفع الـ Preload، وتجنب النترات ومدرات البول تماماً.",
    formula: "القاعدة الفسيولوجية: CO = HR × SV (حجم النبضة يعتمد كلياً على الـ Preload في اعتلال البطين الأيمن)."
  },
  raw2: {
    meta: "SMC INDEX: #RAW-02-SURG-118 • تكرار الامتحان: 88%",
    specialty: "الجراحة العامة • إصابات البطن والحوادث الحادة",
    prompt: `شاب يبلغ من العمر 24 عاماً تعرض لحادث دراجة نارية ونقل للطوارئ. العلامات الحيوية: الضغط 85/50، النبض 125/دقيقة، البطن متيبس مع إيلام عند الجس. أظهر فحص السونار الطارئ (FAST) وجود كمية معتبرة من السوائل الحرة في الحوض والمسافة الكبدية الكلوية (Morison's Pouch).<br><br><strong>ما هو التدبير الجراحي الأنسب والأسرع لإنقاذ حياة المريض؟</strong>`,
    options: [
      { text: "أ) فتح بطن استكشافي فوري في غرفة العمليات (Exploratory Laparotomy)", correct: true },
      { text: "ب) إجراء أشعة مقطعية بالصبغة للبطن والحوض (CT Scan)", correct: false },
      { text: "ج) الملاحظة السريرية في العناية المكثفة مع نقل وحدتي دم", correct: false },
      { text: "د) سحب السائل بالإبرة تحت توجيه السونار", correct: false }
    ],
    explanation: "مريض الصدمة غير المستقر ديناميكياً (Hemodynamically Unstable) مع FAST إيجابي يُعتبر نزيفاً داخلياً بطنياً نشطاً يستدعي فتح البطن الاستكشافي الفوري لإيقاف النزيف وفق مبادئ Damage Control Surgery، ويُمنع نقله لإجراء الأشعة المقطعية لخطورة التدهور خارج غرفة العمليات.",
    formula: "القاعدة الجراحية: FAST (+) + Hemodynamic Instability = Immediate Laparotomy."
  },
  raw3: {
    meta: "SMC INDEX: #RAW-03-PEDS-204 • تكرار الامتحان: 95%",
    specialty: "طب الأطفال • طوارئ الجهاز التنفسي",
    prompt: `طفل يبلغ من العمر سنتين يعاني من سعال نباحي (Barking cough) وبحة في الصوت وصرير تنفسي (Stridor) أثناء الراحة مع انسحاب الأضلاع دون زرقة.<br><br><strong>ما هو العلاج الدوائي الفوري عالي الفاعلية المعتمد بالأدلة السريرية؟</strong>`,
    options: [
      { text: "أ) إعطاء جرعة فموية أو حقن من الديكساميثازون (Dexamethasone) واستنشاق الأدرينالين", correct: true },
      { text: "ب) إعطاء مضاد حيوي واسع الطيف فوراً", correct: false },
      { text: "ج) استنشاق بخار الماء الساخن فقط", correct: false },
      { text: "د) إعطاء موسع شعب هوائية سالبوتامول فقط", correct: false }
    ],
    explanation: "الحالة تمثل خناقاً حنجرياً متوسطاً إلى شديد (Moderate to Severe Croup). الديكساميثازون (0.6 mg/kg) يقلل وذمة الغشاء المخاطي تحت الحبال الصوتية، ويُضاف الأدرينالين المستنشق لتقليص الأوعية سريعاً وتخفيف الضائقة التنفسية الفورية.",
    formula: "البروتوكول السريري: Stridor at Rest = Oral Dexamethasone + Nebulized Epinephrine."
  },
  raw5: {
    meta: "SMC INDEX: #RAW-05-OBS-312 • تكرار الامتحان: 90%",
    specialty: "النساء والتوليد • طوارئ ما بعد الولادة",
    prompt: `سيدة تبلغ من العمر 30 عاماً وضعت طفلها الرابع قبل 20 دقيقة. بدأت تنزف دماً غزيراً من المهبل، وعند فحص البطن وُجد الرحم رخواً وغير منقبض (BOGGY UTERUS) فوق مستوى السرة.<br><br><strong>ما هو السبب الأكثر شيوعاً والخطوة التدبيرية الأولى؟</strong>`,
    options: [
      { text: "أ) خمول الرحم (Uterine Atony) • مساج يدوي للرحم وإعطاء الأوكسيتوسين (Oxytocin)", correct: true },
      { text: "ب) تمزق عنق الرحم • خياطة جراحية فورية", correct: false },
      { text: "ج) احتباس المشيمة • استئصال الرحم فوراً", correct: false },
      { text: "د) تجلط الدم المنتشر (DIC) • نقل بلازما مجمدة", correct: false }
    ],
    explanation: "خمول الرحم (Uterine Atony) هو السبب في أكثر من 70-80% من نزيف ما بعد الولادة الأولي (PPH). الخط الأول الفوري هو تدليك قاع الرحم يدوياً لتحفيز الانقباض مع إعطاء محفزات تقلص الرحم (Uterotonics مثل Oxytocin/Misoprostol) ومراقبة العلامات الحيوية.",
    formula: "القاعدة السريرية: Boggy Uterus + PPH = Bimanual Compression + Uterotonic Infusion."
  }
};

let rawScoreAccumulator = 0;

function switchRawBank(bankKey, btnElement) {
  const bank = RAW_BANK_DATA[bankKey];
  if (!bank) return;

  document.querySelectorAll(".raw-pill").forEach(p => p.classList.remove("active"));
  if (btnElement) btnElement.classList.add("active");

  const metaEl = document.getElementById("raw-meta-display");
  const specEl = document.getElementById("raw-specialty-display");
  const promptEl = document.getElementById("raw-prompt-display");
  const optionsContainer = document.getElementById("raw-options-container");
  const explanationBox = document.getElementById("raw-explanation-box");

  if (metaEl) metaEl.textContent = bank.meta;
  if (specEl) specEl.textContent = bank.specialty;
  if (promptEl) promptEl.innerHTML = bank.prompt;
  if (explanationBox) explanationBox.style.display = "none";

  if (optionsContainer) {
    let optHtml = "";
    bank.options.forEach((opt, idx) => {
      optHtml += `
        <button class="raw-option-btn" onclick="submitRawAnswer('${bankKey}', ${idx}, this)" style="display: block; width: 100%; text-align: right; background: #FFFFFF; border: 1.5px solid var(--line); border-radius: var(--radius-sm); padding: 14px 18px; margin-bottom: 10px; font-size: 14px; cursor: pointer; transition: all 0.2s ease;">
          ${escapeHtml(opt.text)}
        </button>
      `;
    });
    optionsContainer.innerHTML = optHtml;
  }
}
window.switchRawBank = switchRawBank;

function submitRawAnswer(bankKey, optionIndex, btnElement) {
  const bank = RAW_BANK_DATA[bankKey];
  if (!bank) return;

  const selectedOpt = bank.options[optionIndex];
  const explanationBox = document.getElementById("raw-explanation-box");
  const explanationText = document.getElementById("raw-explanation-text");
  const formulaText = document.getElementById("raw-formula-text");
  const scoreDisplay = document.getElementById("raw-live-score");

  const allBtns = document.querySelectorAll(".raw-option-btn");
  allBtns.forEach(b => b.disabled = true);

  if (selectedOpt.correct) {
    btnElement.style.borderColor = "var(--teal)";
    btnElement.style.background = "var(--teal-light)";
    btnElement.style.color = "var(--teal)";
    rawScoreAccumulator += 50;
  } else {
    btnElement.style.borderColor = "var(--red)";
    btnElement.style.background = "var(--red-light)";
    btnElement.style.color = "var(--red)";
  }

  if (scoreDisplay) {
    scoreDisplay.textContent = rawScoreAccumulator + " GP";
  }

  if (explanationBox && explanationText && formulaText) {
    explanationText.innerHTML = escapeHtml(bank.explanation);
    formulaText.innerHTML = escapeHtml(bank.formula);
    explanationBox.style.display = "block";
    explanationBox.scrollIntoView({ behavior: "smooth" });
  }
}
window.submitRawAnswer = submitRawAnswer;

function initRawSimulator() {
  switchRawBank("raw1", document.querySelector(".raw-pill"));
}

/* =========================================================================
   8. ANIMATED MOVING COUNTERS ENGINE
   ========================================================================= */
function initMovingCounters() {
  const counters = document.querySelectorAll(".moving-counter");
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseFloat(counter.dataset.target || counter.textContent);
        const duration = parseInt(counter.dataset.duration || "1500");
        const decimals = parseInt(counter.dataset.decimals || "0");
        const suffix = counter.dataset.suffix || "";

        let start = 0;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            clearInterval(timer);
            counter.textContent = target.toFixed(decimals) + suffix;
          } else {
            counter.textContent = start.toFixed(decimals) + suffix;
          }
        }, stepTime);

        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => observer.observe(c));
}

/* =========================================================================
   9. ACCORDIONS & UTILITIES
   ========================================================================= */
function initFaqAccordions() {
  window.toggleFaq = function (headerEl) {
    const card = headerEl.closest(".faq-card");
    if (card) {
      card.classList.toggle("open");
    }
  };
}

function initFinanceCopyButtons() {
  document.querySelectorAll(".btn-copy-finance").forEach(btn => {
    btn.addEventListener("click", function () {
      const number = "+201015922628";
      navigator.clipboard.writeText(number).then(() => {
        const originalText = this.textContent;
        this.textContent = "تم نسخ رقم أمانة التحصيل ✓";
        setTimeout(() => this.textContent = originalText, 2500);
      });
    });
  });
}

function submitOperationalAudit() {
  const gaIdInput = document.getElementById('rev-ga-id');
  const emailInput = document.getElementById('rev-email');
  const phoneInput = document.getElementById('rev-ref-phone');

  const gaId = gaIdInput ? gaIdInput.value.trim() : 'GA-NEW';
  const email = emailInput ? emailInput.value.trim() : '';
  const refPhone = phoneInput ? phoneInput.value.trim() : '';

  let bonusText = '';
  if (refPhone) {
    bonusText = `\n🎁 تم تسجيل ترشيح الزميل (${escapeHtml(refPhone)}) بنجاح (+100 GP إضافية).`;
  }

  alert(`✅ تم استلام وتوثيق تقييمك التشغيلي بنجاح!\n\nرقم الهوية: ${escapeHtml(gaId)}\nالبريد: ${escapeHtml(email)}\n\nتمت إضافة +100 GP لرصيدك الأكاديمي.${bonusText}\n\nشكراً لمساهمتك الفعالة في بناء وتطوير المنظومة السيادية.`);
  
  if (gaIdInput) gaIdInput.value = '';
  if (emailInput) emailInput.value = '';
  if (phoneInput) phoneInput.value = '';
}
window.submitOperationalAudit = submitOperationalAudit;

function escapeHtml(string) {
  if (string === null || string === undefined) return '';
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(string).replace(/[&<>"']/g, s => entityMap[s]);
}
window.escapeHtml = escapeHtml;


/* =========================================================================
   10. LIVE SPLIT-FLAP BOARD CONTROLLER (index.html)
   ========================================================================= */
function initSplitFlapBoard() {
  const board = document.getElementById("sovereign-board");
  if (!board) return;

  const rows = [
    { name: "gemiiniXsmc PERMANENT LICENSURE", status: "OPEN", statusClass: "open", cohort: "ROLLING", mods: "MODULES 1-8" },
    { name: "JUNIOR STEM & 57357 DISCOVERY", status: "OPEN", statusClass: "open", cohort: "MONTHLY", mods: "LAB & TOURS" },
    { name: "MOLECULAR MEDICINE (MM 1.0 - 8.0)", status: "OPEN", statusClass: "open", cohort: "ROLLING", mods: "8 DIPLOMAS" },
    { name: "GLOMET HOSPITAL TURNKEY LABS", status: "LIVE", statusClass: "live", cohort: "ACTIVE", mods: "10 STATES" },
    { name: "GENOMICS & ONCOLOGY RESEARCH", status: "OPEN", statusClass: "open", cohort: "ANNUAL", mods: "4 GROUPS" }
  ];

  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 —";

  function scrambleInto(el, finalText, duration, delay) {
    return new Promise(resolve => {
      setTimeout(() => {
        const start = performance.now();
        function frame(now) {
          const t = Math.min(1, (now - start) / duration);
          if (t < 1) {
            let out = "";
            for (let i = 0; i < finalText.length; i++) {
              const charReveal = t * finalText.length - i * 0.6;
              out += charReveal > 1 ? finalText[i] : CHARS[Math.floor(Math.random() * CHARS.length)];
            }
            el.textContent = out;
            requestAnimationFrame(frame);
          } else {
            el.textContent = finalText;
            resolve();
          }
        }
        requestAnimationFrame(frame);
      }, delay);
    });
  }

  // Clear existing rows (keep head)
  const head = board.querySelector(".board-head");
  board.innerHTML = "";
  if (head) board.appendChild(head);

  rows.forEach(r => {
    const row = document.createElement("div");
    row.className = "board-row";
    row.innerHTML = `
      <span class="flap" data-final="${r.name}"></span>
      <span><span class="board-status ${r.statusClass}">${r.status}</span></span>
      <span class="dim" data-final="${r.cohort}"></span>
      <span class="dim" data-final="${r.mods}"></span>
    `;
    board.appendChild(row);
  });

  const foot = document.createElement("div");
  foot.className = "board-foot";
  foot.innerHTML = `
    <span>LIVE REGISTRY FEED • PROFESSIONAL DIGITAL IDENTITY (GA#)</span>
    <span>TOTAL VERIFIED NODES: 2,136+</span>
  `;
  board.appendChild(foot);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  board.querySelectorAll(".flap, .board-row .dim").forEach((el, i) => {
    const final = el.getAttribute("data-final");
    if (reduced) {
      el.textContent = final;
    } else {
      scrambleInto(el, final, 650, i * 70);
    }
  });
}

/* =========================================================================
   CINEMATIC NEURAL MESH & 3D TILT ENGINE
   ========================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  initNeuralMesh();
  init3DTilt();
});

function initNeuralMesh() {
  const canvas = document.getElementById('neural-mesh');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = window.innerWidth < 768 ? 25 : 50;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.5
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#00F2FE';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00F2FE';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${1 - dist / 120})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

function init3DTilt() {
  const cards = document.querySelectorAll('.3d-tilt');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / (rect.height / 2)) * 8;
      const rotateY = (x / (rect.width / 2)) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}
