/**
 * GemIInI SudaGene Platform â€” Master Application Logic & Secure Engines
 * Includes: Independent Credential Verifier, Universal Member Search,
 * Verified Review Explorer & Deep Audit Modal, Gated Diploma Engine, and MTC Simulator.
 */

document.addEventListener("DOMContentLoaded", function () {
  initIndependentStatusVerifier();
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
   1. Independent REGISTRY CREDENTIAL VERIFIER (members.geneacademy.net gateway)
   ========================================================================= */
function initIndependentStatusVerifier() {
  const savedId = localStorage.getItem("gemiini_presence_id");
  if (savedId) {
    applyIndependentStatusView(savedId);
  }
}

function executeIndependentLookup() {
  const input = document.getElementById("sso-quick-id");
  if (!input) return;
  const val = input.value.trim().toUpperCase();
  if (!val) {
    alert("ÙŠØ±Ø¬Ù‰ Ø¥Ø¯Ø®Ø§Ù„ Ø±Ù‚Ù… Ø±Ù‚Ù… Ø§Ù„Ù‡ÙˆÙŠØ© Ø§Ù„Ù…Ù‡Ù†ÙŠØ© Ø§Ù„Ø±Ù‚Ù…ÙŠØ© (GA#) Ù„Ù„ØªØ­Ù‚Ù‚ (Ù…Ø«Ø§Ù„: GA001 Ø£Ùˆ GA171 Ø£Ùˆ GA3454)");
    return;
  }
  applyIndependentStatusView(val);
}
window.executeGemIInISync = executeIndependentLookup; // Backward compatibility with templates

function applyIndependentStatusView(gaId) {
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
    if (univEl) univEl.textContent = (member.univ || "") + (member.role ? " â€¢ " + member.role : "");
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

    if (nameEl) nameEl.textContent = "Ù…Ø¹Ø±Ù Ù‚ÙŠØ¯ Ø§Ù„ØªØ³Ø¬ÙŠÙ„ (" + escapeHtml(cleanId) + ")";
    if (idEl) idEl.textContent = escapeHtml(cleanId);
    if (gpEl) gpEl.textContent = "Ù‚ÙŠØ¯ Ø§Ù„ØªØ¯Ù‚ÙŠÙ‚ Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠ";
    if (univEl) univEl.textContent = "Ù„Ù… ÙŠÙƒØªÙ…Ù„ Ø§Ù„ØªÙˆØ«ÙŠÙ‚ Ø§Ù„Ù†Ù‡Ø§Ø¦ÙŠ Ø¹Ø¨Ø± SudaPass";
    if (avatarEl) avatarEl.textContent = "GA";

    if (unauthView) unauthView.style.display = "none";
    authView.style.display = "flex";
  }
}

function resetIndependentStatusView() {
  localStorage.removeItem("gemiini_presence_id");
  const unauthView = document.getElementById("sso-unauth-view");
  const authView = document.getElementById("sso-authenticated-view");
  if (authView) authView.style.display = "none";
  if (unauthView) unauthView.style.display = "flex";
}
window.logoutGemIInISession = resetIndependentStatusView;

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
          Ù„Ù… ÙŠØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ Ø³Ø¬Ù„ Ù…Ø¹ØªÙ…Ø¯ Ù…Ø·Ø§Ø¨Ù‚ Ù„Ù€ "<strong>${escapeHtml(query)}</strong>".<br>
          <span style="font-size: 12px;">ÙŠÙ…ÙƒÙ†Ùƒ ØªÙ‚Ø¯ÙŠÙ… Ø·Ù„Ø¨ Ø§Ù„ØªØ³Ø¬ÙŠÙ„ ÙˆØ§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ Ø¹Ø¨Ø± <a href="join.html" style="color: var(--purple-brand); font-weight: 700;">Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø±Ø³Ù…ÙŠØ©</a>.</span>
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
              ${m.hasReview ? `<span class="cert-tag" style="background: var(--gold-light); color: var(--gold-dark); font-size: 10px;">â˜… Ù…Ù‚ÙŠÙ‘Ù… Ù…Ø¹ØªÙ…Ø¯</span>` : ""}
            </div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${escapeHtml(m.univ)} â€¢ ${escapeHtml(m.role)}</div>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span style="font-family: var(--font-mono); font-weight: 800; color: var(--gold); font-size: 13.5px;">${m.gp.toLocaleString()} GP</span>
            <a href="alumni.html?cert=${encodeURIComponent(m.id)}" class="btn btn-secondary" style="padding: 5px 12px; font-size: 12px;">Ø§Ù„Ø´Ù‡Ø§Ø¯Ø© ðŸ“œ</a>
            ${m.hasReview ? `<a href="reviews.html?id=${encodeURIComponent(m.id)}" class="btn btn-gold" style="padding: 5px 10px; font-size: 12px;">Ø§Ù„ØªÙ‚ÙŠÙŠÙ… â˜…</a>` : ""}
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
    countBadge.textContent = `${filtered.length} ØªÙ‚ÙŠÙŠÙ… Ø³Ø±ÙŠØ±ÙŠ Ù…ÙˆØ«Ù‚`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; background: #FFFFFF; border: 1.5px dashed var(--line); border-radius: var(--radius-md); padding: 40px; text-align: center; color: var(--text-muted);">
        <span style="font-size: 32px; display: block; margin-bottom: 8px;">ðŸ”</span>
        <h4 style="font-size: 18px; color: var(--purple-dark); margin-bottom: 6px;">Ù„Ø§ ØªÙˆØ¬Ø¯ ØªÙ‚ÙŠÙŠÙ…Ø§Øª Ù…Ø·Ø§Ø¨Ù‚Ø© Ù„Ø®ÙŠØ§Ø±Ø§Øª Ø§Ù„ÙÙ„ØªØ±Ø© Ø§Ù„Ø­Ø§Ù„ÙŠØ©</h4>
        <p style="font-size: 13.5px;">Ø¬Ø±Ø¨ ØªØºÙŠÙŠØ± Ø§Ù„ØªØ®ØµØµØŒ Ø£Ùˆ Ø¥Ø¹Ø§Ø¯Ø© Ø¶Ø¨Ø· Ø®Ø§Ù†Ø© Ø§Ù„Ø¨Ø­Ø«.</p>
        <button onclick="resetReviewsFilters()" class="btn btn-secondary" style="margin-top: 14px; padding: 6px 16px;">Ø¥Ø¹Ø§Ø¯Ø© Ø¶Ø¨Ø· Ø§Ù„ÙÙ„Ø§ØªØ± â†º</button>
      </div>
    `;
    return;
  }

  let html = "";
  filtered.forEach(rev => {
    const starString = "â˜…".repeat(Math.round(rev.ratings.questionQuality)) + "â˜†".repeat(5 - Math.round(rev.ratings.questionQuality));
    
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
                <span style="color: var(--teal); font-size: 11px; font-weight: 800;">â— Ù…ÙˆØ«Ù‚ Ø±Ø³Ù…ÙŠØ§Ù‹</span>
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
            ðŸ§ª <span style="color: var(--purple-brand);">${escapeHtml(rev.unitTested)}</span>
          </div>

          <!-- Highlight Quote -->
          <p style="font-size: 13.5px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px; font-style: italic;">
            "${escapeHtml(rev.keyHighlightQuote)}"
          </p>

          <!-- 5-Metric Pill Indicators -->
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-bottom: 18px; font-size: 11.5px;">
            <div style="background: #FDFBF7; padding: 5px 8px; border-radius: 4px; border: 1px solid var(--line);">
              <span style="color: var(--text-sub);">Ø¬ÙˆØ¯Ø© Ø§Ù„Ø£Ø³Ø¦Ù„Ø©:</span> <strong>${rev.ratings.questionQuality}/5 â­</strong>
            </div>
            <div style="background: #FDFBF7; padding: 5px 8px; border-radius: 4px; border: 1px solid var(--line);">
              <span style="color: var(--text-sub);">Ø³Ø±Ø¹Ø© Ø§Ù„Ø¯Ø¹Ù…:</span> <strong>${rev.ratings.opsSupportSpeed}/5 â­</strong>
            </div>
            <div style="background: #FDFBF7; padding: 5px 8px; border-radius: 4px; border: 1px solid var(--line);">
              <span style="color: var(--text-sub);">Ø³Ù„Ø§Ø³Ø© Ø§Ù„Ù†Ø¸Ø§Ù…:</span> <strong>${rev.ratings.registrationEase1}/5 â­</strong>
            </div>
            <div style="background: #FDFBF7; padding: 5px 8px; border-radius: 4px; border: 1px solid var(--line);">
              <span style="color: var(--text-sub);">Ø§Ù„Ù…Ø¬ØªÙ…Ø¹ Ø§Ù„Ø·Ø¨ÙŠ:</span> <strong>${rev.ratings.communityInteraction}/5 â­</strong>
            </div>
          </div>
        </div>

        <!-- Card Footer CTA: Inspect Full 10-Section Audit -->
        <div style="border-top: 1px solid var(--line); padding-top: 14px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 12px; color: var(--teal); font-weight: 700;">
            ${rev.challengePassed ? "âœ“ Ø§Ø¬ØªØ§Ø² Ø§Ù„ØªØ­Ø¯ÙŠ Ø¨Ù†Ø¬Ø§Ø­" : "âŒ› Ù‚ÙŠØ¯ Ø®ÙˆØ¶ Ø§Ù„ØªØ­Ø¯ÙŠ"}
          </span>
          <button onclick="openReviewAuditModal('${escapeHtml(rev.id)}')" class="btn btn-secondary" style="padding: 6px 14px; font-size: 12.5px; border-color: var(--purple-border); color: var(--purple-brand);">
            Ø¹Ø±Ø¶ ØªÙ‚Ø±ÙŠØ± Ø§Ù„Ø§Ø³ØªØ¨ÙŠØ§Ù† ÙˆØ§Ù„ØªØ¯Ù‚ÙŠÙ‚ ðŸ“‹
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

  const currentGroupsList = rev.currentGroups.map(g => `<li style="margin-bottom: 4px;">â€¢ ${escapeHtml(g)}</li>`).join("");
  const targetTracksList = rev.nextTargetTrack.map(t => `<li style="margin-bottom: 4px;">â€¢ ${escapeHtml(t)}</li>`).join("");
  const futureUnitsList = rev.requestedFutureUnits.map(u => `<li style="margin-bottom: 4px;">â€¢ ${escapeHtml(u)}</li>`).join("");
  const futureProjectsList = rev.futureGemIInIProjects.map(p => `<li style="margin-bottom: 4px;">â€¢ ${escapeHtml(p)}</li>`).join("");
  const barriersList = rev.sudanPracticeBarriers.map(b => `<li style="margin-bottom: 4px; color: var(--red);">âš ï¸ ${escapeHtml(b)}</li>`).join("");

  modalContent.innerHTML = `
    <div style="padding: 30px;">
      <!-- Modal Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid var(--line); padding-bottom: 18px; margin-bottom: 24px;">
        <div>
          <span class="cert-tag" style="background: var(--teal-light); color: var(--teal); font-family: var(--font-mono); font-weight: 800; font-size: 11px;">
            VERIFIED RESPONSE â€¢ ${escapeHtml(rev.id)}
          </span>
          <h2 style="font-size: 24px; font-weight: 900; color: var(--purple-dark); margin-top: 6px;">
            ØªÙ‚Ø±ÙŠØ± Ø§Ù„ØªØ¯Ù‚ÙŠÙ‚ Ø§Ù„ØªØ´ØºÙŠÙ„ÙŠ Ø§Ù„ÙƒØ§Ù…Ù„: ${escapeHtml(rev.doctorName)}
          </h2>
          <div style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">
            ØªØ§Ø±ÙŠØ® Ø§Ù„ØªÙ‚Ø¯ÙŠÙ…: <span style="font-family: var(--font-mono); font-weight: 700;">${escapeHtml(rev.timestamp)}</span> â€¢ 
            Ø§Ù„Ù…Ø¹Ø±Ù: <span style="font-family: var(--font-mono); color: var(--purple-brand); font-weight: 800;">${escapeHtml(rev.gemiiniId)}</span> â€¢ 
            Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ù…Ø´ÙØ±: <span style="font-family: var(--font-mono);">${escapeHtml(rev.emailMasked)}</span>
          </div>
        </div>
        <button onclick="closeReviewAuditModal()" class="btn btn-secondary" style="padding: 6px 14px; font-size: 16px; border-radius: var(--radius-full);">âœ•</button>
      </div>

      <!-- 10 Sections Audit Grid -->
      <div style="display: flex; flex-direction: column; gap: 20px; font-size: 13.5px; line-height: 1.7;">
        
        <!-- Section 1 -->
        <div style="background: #FAF7F0; border: 1px solid var(--line); border-radius: var(--radius-md); padding: 18px;">
          <h4 style="color: var(--purple-dark); font-weight: 800; font-size: 15px; margin-bottom: 8px;">1ï¸âƒ£ Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„Ù‡ÙˆÙŠØ© Ø§Ù„Ø±Ù‚Ù…ÙŠØ© ÙˆØ§Ù„Ø±Ø¨Ø· Ø§Ù„Ù…Ø¤Ø³Ø³ÙŠ</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px;">
            <div><strong>ØªØ­Ø¯ÙŠ Ø§Ù„Ù€ 20 Ø³Ø¤Ø§Ù„Ø§Ù‹:</strong> <span style="color: var(--teal); font-weight: 700;">${escapeHtml(rev.challengeCompleted)}</span></div>
            <div><strong>ØªÙˆØ«ÙŠÙ‚ Ø³ÙˆØ¯Ø§Ø¨Ø§Ø³ (SudaPass):</strong> <span>${escapeHtml(rev.sudaPassStatus)}</span></div>
            <div><strong>Ù…Ø³ØªÙˆÙ‰ Ø§Ù„Ø­Ø³Ø§Ø¨:</strong> <span style="color: var(--purple-brand); font-weight: 700;">${escapeHtml(rev.levelReached)}</span></div>
            <div><strong>Ù…Ø¬Ù…ÙˆØ¹Ø© Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨ Ø§Ù„Ø±Ø³Ù…ÙŠØ©:</strong> <span>${rev.whatsappGroupActive ? "âœ“ ØªÙ… Ø§Ù„ØªÙØ¹ÙŠÙ„ ÙˆØ§Ù„Ø¥Ø¶Ø§ÙØ©" : "Ù‚ÙŠØ¯ Ø§Ù„Ù…ØªØ§Ø¨Ø¹Ø©"}</span></div>
          </div>
        </div>

        <!-- Section 2 -->
        <div style="background: #FAF7F0; border: 1px solid var(--line); border-radius: var(--radius-md); padding: 18px;">
          <h4 style="color: var(--purple-dark); font-weight: 800; font-size: 15px; margin-bottom: 8px;">2ï¸âƒ£ Ø®Ø§Ø±Ø·Ø© Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Ø§Øª ÙˆØ§Ù„Ù…Ø³Ø§Ø±Ø§Øª Ø§Ù„ØªØ¯Ø±ÙŠØ¨ÙŠØ©</h4>
          <p><strong>Ø§Ù„ÙˆØ­Ø¯Ø© Ø§Ù„ØªÙŠ ØªÙ… Ø§Ø®ØªØ¨Ø§Ø±Ù‡Ø§:</strong> <span style="color: var(--purple-brand); font-weight: 800;">${escapeHtml(rev.unitTested)}</span></p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; margin-top: 10px;">
            <div>
              <strong>Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Ø§Øª Ø§Ù„Ù…Ø´ØªØ±Ùƒ Ø¨Ù‡Ø§ Ø­Ø§Ù„ÙŠØ§Ù‹:</strong>
              <ul style="list-style: none; padding-right: 0; margin-top: 4px; font-size: 12.5px; color: var(--text-muted);">${currentGroupsList}</ul>
            </div>
            <div>
              <strong>Ø§Ù„Ù…Ø³Ø§Ø± Ø§Ù„Ù…Ø³ØªÙ‡Ø¯Ù Ø§Ù„Ù‚Ø§Ø¯Ù…:</strong>
              <ul style="list-style: none; padding-right: 0; margin-top: 4px; font-size: 12.5px; color: var(--text-muted);">${targetTracksList}</ul>
            </div>
          </div>
        </div>

        <!-- Section 3: Detailed Ratings -->
        <div style="background: #FAF7F0; border: 1px solid var(--line); border-radius: var(--radius-md); padding: 18px;">
          <h4 style="color: var(--purple-dark); font-weight: 800; font-size: 15px; margin-bottom: 8px;">3ï¸âƒ£ Ø¯Ø±Ø¬Ø§Øª Ø§Ù„ØªÙ‚ÙŠÙŠÙ… ÙˆØªØ¬Ø±Ø¨Ø© Ø§Ù„Ù†Ø¸Ø§Ù… (1 - 5 Ù†Ø¬ÙˆÙ…)</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-top: 8px;">
            <div style="background: #FFFFFF; padding: 10px; border-radius: 6px; border: 1px solid var(--line);">
              <span style="color: var(--text-sub); display: block; font-size: 11.5px;">Ø¬ÙˆØ¯Ø© ØµÙŠØ§ØºØ© Ø§Ù„Ø£Ø³Ø¦Ù„Ø©</span>
              <strong style="color: var(--gold); font-size: 16px;">${rev.ratings.questionQuality} / 5 â­</strong>
            </div>
            <div style="background: #FFFFFF; padding: 10px; border-radius: 6px; border: 1px solid var(--line);">
              <span style="color: var(--text-sub); display: block; font-size: 11.5px;">Ø³Ø±Ø¹Ø© Ø¯Ø¹Ù… Ø§Ù„ÙØ±ÙŠÙ‚</span>
              <strong style="color: var(--gold); font-size: 16px;">${rev.ratings.opsSupportSpeed} / 5 â­</strong>
            </div>
            <div style="background: #FFFFFF; padding: 10px; border-radius: 6px; border: 1px solid var(--line);">
              <span style="color: var(--text-sub); display: block; font-size: 11.5px;">Ø³Ù„Ø§Ø³Ø© Ø§Ù„ØªØ³Ø¬ÙŠÙ„</span>
              <strong style="color: var(--gold); font-size: 16px;">${rev.ratings.registrationEase1} / 5 â­</strong>
            </div>
            <div style="background: #FFFFFF; padding: 10px; border-radius: 6px; border: 1px solid var(--line);">
              <span style="color: var(--text-sub); display: block; font-size: 11.5px;">ØªÙØ§Ø¹Ù„ Ø§Ù„Ù…Ø¬ØªÙ…Ø¹ Ø§Ù„Ø·Ø¨ÙŠ</span>
              <strong style="color: var(--gold); font-size: 16px;">${rev.ratings.communityInteraction} / 5 â­</strong>
            </div>
          </div>
        </div>

        <!-- Section 5: Strategic UX & Exclusivity -->
        <div style="background: #FAF7F0; border: 1px solid var(--line); border-radius: var(--radius-md); padding: 18px;">
          <h4 style="color: var(--purple-dark); font-weight: 800; font-size: 15px; margin-bottom: 8px;">5ï¸âƒ£ ØªÙ‚ÙŠÙŠÙ… Ø¨ÙŠØ¦Ø© Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… ÙˆØ§Ù„ØªØ£Ø«ÙŠØ± Ø§Ù„Ø§Ø³ØªØ±Ø§ØªÙŠØ¬ÙŠ</h4>
          <p><strong>ÙˆØ¶ÙˆØ­ ÙˆØ³Ù„Ø§Ø³Ø© Ø§Ù„Ù†Ø¸Ø§Ù…:</strong> ${escapeHtml(rev.uxClarity)}</p>
          <p style="margin-top: 6px;"><strong>Ø­ØµØ±ÙŠØ© Ø§Ù„Ù…Ù†ØµØ© ÙˆØ£Ø³Ø¨Ù‚ÙŠØªÙ‡Ø§ ÙÙŠ Ø§Ù„Ø³ÙˆÙ‚:</strong> <span style="color: var(--teal); font-weight: 700;">${escapeHtml(rev.marketExclusivity)}</span></p>
          <p style="margin-top: 6px;"><strong>Ø§Ù„Ø§Ø³ØªØ¹Ø¯Ø§Ø¯ Ù„Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„ÙƒÙ„ÙŠ ÙƒÙ…Ø±Ø¬Ø¹ Ø£Ø³Ø§Ø³ÙŠ:</strong> <span style="color: var(--purple-brand); font-weight: 700;">${escapeHtml(rev.fullAdoptionReadiness)}</span></p>
        </div>

        <!-- Section 6 & 8: Pricing Willingness & SMSB Reality -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
          <div style="background: #FAF7F0; border: 1px solid var(--line); border-radius: var(--radius-md); padding: 18px;">
            <h4 style="color: var(--purple-dark); font-weight: 800; font-size: 15px; margin-bottom: 8px;">6ï¸âƒ£ Ø¨Ø§Ù‚Ø§Øª Ø§Ù„Ø§Ø³ØªØ«Ù…Ø§Ø± ÙˆØ§Ù„Ø§Ø³ØªØ¹Ø¯Ø§Ø¯ Ø§Ù„Ù…Ø§Ù„ÙŠ</h4>
            <p><strong>Ø§Ù„Ø¹Ù…Ù„Ø© Ø§Ù„Ù…ÙØ¶Ù„Ø©:</strong> ${escapeHtml(rev.preferredCurrency)}</p>
            <p><strong>Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„ØªØ­ÙˆÙŠÙ„:</strong> ${escapeHtml(rev.preferredPaymentMethod)}</p>
            <div style="margin-top: 8px; font-size: 12.5px; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid var(--line);">
              <div>Ø¨Ø§Ù‚Ø© 400 Ø³Ø¤Ø§Ù„: <strong>${escapeHtml(rev.pricingWillingness.pack400Q)}</strong></div>
              <div>Ø¨Ø§Ù‚Ø© 800 Ø³Ø¤Ø§Ù„: <strong>${escapeHtml(rev.pricingWillingness.pack800Q)}</strong></div>
              <div>Ø¨Ø§Ù‚Ø© 1200 Ø³Ø¤Ø§Ù„: <strong>${escapeHtml(rev.pricingWillingness.pack1200Q)}</strong></div>
            </div>
          </div>

          <div style="background: #FAF7F0; border: 1px solid var(--line); border-radius: var(--radius-md); padding: 18px;">
            <h4 style="color: var(--purple-dark); font-weight: 800; font-size: 15px; margin-bottom: 8px;">8ï¸âƒ£ ØªÙ‚ÙŠÙŠÙ… Ø¹ÙˆØ§Ø¦Ù‚ Ø§Ù„Ù…Ù…Ø§Ø±Ø³Ø© ÙˆØ§Ù„ÙˆØ§Ù‚Ø¹ Ø§Ù„Ø·Ø¨ÙŠ Ø¨Ø§Ù„Ø³ÙˆØ¯Ø§Ù†</h4>
            <p><strong>Ø§Ù„ØªØ®ØµØµØ§Øª Ø§Ù„Ù…Ø³ØªÙ‡Ø¯ÙØ©:</strong> ${escapeHtml(rev.smsbSpecialtyTarget.join("ØŒ "))}</p>
            <strong style="display: block; margin-top: 8px; color: var(--purple-dark);">Ø£Ø¨Ø±Ø² Ø§Ù„Ø¹ÙˆØ§Ø¦Ù‚ Ø§Ù„ØªÙŠ ØªÙˆØ§Ø¬Ù‡ Ø§Ù„Ø·Ø¨ÙŠØ¨ ÙÙŠ Ø§Ù„Ø³ÙˆØ¯Ø§Ù†:</strong>
            <ul style="list-style: none; padding-right: 0; margin-top: 4px; font-size: 12px;">${barriersList}</ul>
          </div>
        </div>

      </div>

      <!-- Footer Actions -->
      <div style="margin-top: 24px; padding-top: 16px; border-top: 1.5px solid var(--line); display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 12px; color: var(--text-sub);">
          Ø³Ø¬Ù„ ØªØ¯Ù‚ÙŠÙ‚ Ø±Ù‚Ù…ÙŠ Ù…Ø¹ØªÙ…Ø¯ Ù„Ø¯Ù‰ Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© ÙˆØ§Ù„ØªÙˆØ«ÙŠÙ‚ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ
        </span>
        <button onclick="closeReviewAuditModal()" class="btn btn-primary" style="padding: 8px 24px;">Ø¥ØºÙ„Ø§Ù‚ Ø§Ù„ØªÙ‚Ø±ÙŠØ± âœ“</button>
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
      countDisplay.textContent = `ØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ ${filtered.length} Ø·Ø¨ÙŠØ¨ ÙˆØ¨Ø§Ø­Ø« Ù…Ø³Ø¬Ù„`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; background: #FFFFFF; border: 1px dashed var(--line); border-radius: var(--radius-md); padding: 40px; text-align: center; color: var(--text-muted);">
          Ù„Ù… ÙŠØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ Ù†ØªØ§Ø¦Ø¬ Ù…Ø·Ø§Ø¨Ù‚Ø© Ù„Ù€ "${escapeHtml(currentSearch)}".
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
              ${m.isBlsCertified ? `<span class="cert-tag" style="background: #FEE2E2; color: #991B1B; font-size: 10.5px; font-weight: 800; border-color: #FCA5A5;">ðŸ«€ Ø£Ø®ØµØ§Ø¦ÙŠ BLS Ù…Ø¹ØªÙ…Ø¯</span>` : ""}
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
              ðŸ›ï¸ ${escapeHtml(m.univ)}
            </p>
          </div>
          
          <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 11px; color: var(--text-sub);">
              ${m.isBlsCertified ? "âœ“ Ø®Ø±ÙŠØ¬ ÙˆØ£Ø®ØµØ§Ø¦ÙŠ BLS" : (m.sudaPass ? "âœ“ SudaPass" : "Ø³Ø¬Ù„ Ù†Ø´Ø·")}
            </span>
            <div style="display: flex; gap: 6px;">
              <a href="alumni.html?cert=${encodeURIComponent(m.id)}" class="btn btn-secondary" style="padding: 3px 8px; font-size: 11px;">Ø§Ù„Ø´Ù‡Ø§Ø¯Ø© ðŸ“œ</a>
              ${m.hasReview ? `<a href="reviews.html?id=${encodeURIComponent(m.id)}" class="btn btn-gold" style="padding: 3px 6px; font-size: 11px;">Ø§Ù„ØªÙ‚ÙŠÙŠÙ… â˜…</a>` : ""}
            </div>
          </div>
        </div>
      `;
    });

    if (filtered.length > displayLimit) {
      html += `
        <div style="grid-column: 1 / -1; text-align: center; margin-top: 20px; padding: 20px;">
          <button id="load-more-ga-btn" class="btn btn-secondary" style="padding: 12px 32px; font-size: 14px; border-color: var(--purple-brand); color: var(--purple-brand); font-weight: 800;">
            Ø¹Ø±Ø¶ Ø§Ù„Ù…Ø²ÙŠØ¯ (+48 Ø·Ø¨ÙŠØ¨ Ù…Ù† Ø£ØµÙ„ ${filtered.length}) âž”
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
    alert("ÙŠØ±Ø¬Ù‰ Ø¥Ø¯Ø®Ø§Ù„ Ø§Ø³Ù… Ø§Ù„Ø®Ø±ÙŠØ¬ Ø£Ùˆ Ø±Ù‚Ù… Ø±Ù‚Ù… Ø§Ù„Ù‡ÙˆÙŠØ© Ø§Ù„Ù…Ù‡Ù†ÙŠØ© Ø§Ù„Ø±Ù‚Ù…ÙŠØ© (GA#) Ù„Ù„ØªØ­Ù‚Ù‚ (Ù…Ø«Ø§Ù„: GA171 Ø£Ùˆ GA997 Ø£Ùˆ GA130)");
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
      if (idDisplay) idDisplay.textContent = "PROFESSIONAL DIGITAL IDENTITY GA NUMBER: " + foundMember.id + " â€¢ CERTIFIED BLS PROVIDER â€¢ GEMIINI ALUMNI";
      if (courseDisplay) courseDisplay.textContent = "Ø¨Ø±Ù†Ø§Ù…Ø¬ Ø¯Ø¹Ù… Ø§Ù„Ø­ÙŠØ§Ø© Ø§Ù„Ø£Ø³Ø§Ø³ÙŠ Ø§Ù„Ù…ØªÙ‚Ø¯Ù… ÙˆØ§Ù„Ø¥Ù†Ø¹Ø§Ø´ Ø§Ù„Ù‚Ù„Ø¨ÙŠ Ø§Ù„Ø±Ø¦ÙˆÙŠ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ (Adult & Pediatric BLS Simulation & Resuscitation Certification)";
      if (gpDisplay) gpDisplay.textContent = "ACADEMIC LEDGER: " + foundMember.gp.toLocaleString() + " GP â€¢ BLS Certified & GemIInI Alumni";
    } else {
      if (idDisplay) idDisplay.textContent = "PROFESSIONAL DIGITAL IDENTITY GA NUMBER: " + foundMember.id;
      if (gpDisplay) gpDisplay.textContent = "ACADEMIC LEDGER: " + foundMember.gp.toLocaleString() + " GP â€¢ " + (foundMember.cert || "SudaPass Verified");
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
        <strong>âš ï¸ ØªÙ†Ø¨ÙŠÙ‡ Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠ:</strong><br>
        Ù„Ù… ÙŠØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ Ø³Ø¬Ù„ ØªØ®Ø±Ø¬ Ø£Ùˆ Ø§Ø¹ØªÙ…Ø§Ø¯ Ù…Ø³Ø¬Ù„ Ø±Ø³Ù…ÙŠØ§Ù‹ Ø¨Ø§Ù„Ø§Ø³Ù… Ø£Ùˆ Ø§Ù„Ù…Ø¹Ø±Ù "<strong>${escapeHtml(val)}</strong>".<br>
        <span style="font-size: 12.5px; color: #B91C1C;">ÙŠØ±Ø¬Ù‰ Ù…Ø±Ø§Ø¬Ø¹Ø© Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù‚ÙŠØ¯ ÙˆØ§Ù„ØªØ³Ø¬ÙŠÙ„ Ø£Ùˆ ØªÙ‚Ø¯ÙŠÙ… Ø§Ø³ØªÙ…Ø§Ø±Ø© Ø§Ù„ØªÙˆØ«ÙŠÙ‚ Ø¹Ø¨Ø± <a href="join.html" style="color: #7F1D1D; text-decoration: underline; font-weight: 700;">Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„ØªØ³Ø¬ÙŠÙ„</a>.</span>
      `;
      input.parentElement.appendChild(createdError);
    } else {
      errorBox.innerHTML = `
        <strong>âš ï¸ ØªÙ†Ø¨ÙŠÙ‡ Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠ:</strong><br>
        Ù„Ù… ÙŠØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ Ø³Ø¬Ù„ ØªØ®Ø±Ø¬ Ø£Ùˆ Ø§Ø¹ØªÙ…Ø§Ø¯ Ù…Ø³Ø¬Ù„ Ø±Ø³Ù…ÙŠØ§Ù‹ Ø¨Ø§Ù„Ø§Ø³Ù… Ø£Ùˆ Ø§Ù„Ù…Ø¹Ø±Ù "<strong>${escapeHtml(val)}</strong>".<br>
        <span style="font-size: 12.5px; color: #B91C1C;">ÙŠØ±Ø¬Ù‰ Ù…Ø±Ø§Ø¬Ø¹Ø© Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù‚ÙŠØ¯ ÙˆØ§Ù„ØªØ³Ø¬ÙŠÙ„ Ø£Ùˆ ØªÙ‚Ø¯ÙŠÙ… Ø§Ø³ØªÙ…Ø§Ø±Ø© Ø§Ù„ØªÙˆØ«ÙŠÙ‚ Ø¹Ø¨Ø± <a href="join.html" style="color: #7F1D1D; text-decoration: underline; font-weight: 700;">Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„ØªØ³Ø¬ÙŠÙ„</a>.</span>
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
    meta: "SMC INDEX: #RAW-01-MED-442 â€¢ ØªÙƒØ±Ø§Ø± Ø§Ù„Ø§Ù…ØªØ­Ø§Ù†: 92%",
    specialty: "Ø§Ù„Ø·Ø¨ Ø§Ù„Ø¨Ø§Ø·Ù†ÙŠ â€¢ Ø·ÙˆØ§Ø±Ø¦ Ø§Ù„Ù‚Ù„Ø¨ ÙˆØ§Ù„Ø£ÙˆØ¹ÙŠØ©",
    prompt: `Ù…Ø±ÙŠØ¶ ÙŠØ¨Ù„Øº Ù…Ù† Ø§Ù„Ø¹Ù…Ø± 58 Ø¹Ø§Ù…Ø§Ù‹ØŒ Ø­Ø¶Ø± Ø¥Ù„Ù‰ Ù‚Ø³Ù… Ø§Ù„Ø­ÙˆØ§Ø¯Ø« ÙŠØ´ÙƒÙˆ Ù…Ù† Ø£Ù„Ù… Ø­Ø§Ø¯ Ø®Ù„Ù Ø§Ù„Ù‚Øµ ÙŠÙ…ØªØ¯ Ø¥Ù„Ù‰ Ø§Ù„Ø°Ø±Ø§Ø¹ Ø§Ù„Ø£ÙŠØ³Ø± Ù…Ù†Ø° 3 Ø³Ø§Ø¹Ø§Øª. Ø£Ø¸Ù‡Ø± ØªØ®Ø·ÙŠØ· Ø§Ù„Ù‚Ù„Ø¨ (ECG) Ø§Ø±ØªÙØ§Ø¹Ø§Ù‹ ÙÙŠ Ø§Ù„Ù‚Ø·Ø¹Ø© ST ÙÙŠ Ø§Ù„Ø§ØªØ¬Ø§Ù‡Ø§Øª II, III, aVF (Ø§Ø­ØªØ´Ø§Ø¡ Ø³ÙÙ„ÙŠ Inferior MI). Ø¨Ø¹Ø¯ Ø¥Ø¹Ø·Ø§Ø¦Ù‡ Ù‚Ø±Øµ Ù†ØªØ±ÙˆØ¬Ù„ÙŠØ³Ø±ÙŠÙ† ØªØ­Øª Ø§Ù„Ù„Ø³Ø§Ù†ØŒ Ù‡Ø¨Ø· Ø¶ØºØ· Ø¯Ù…Ù‡ ÙØ¬Ø£Ø© Ø¥Ù„Ù‰ 75/45 mmHg Ù…Ø¹ ÙˆØ°Ù…Ø© ÙˆØ±ÙŠØ¯ÙŠØ© ÙˆØ¯Ø§Ø¬ÙŠØ© (Elevated JVP) ÙˆØ±Ø¦ØªÙŠÙ† ØµØ§ÙÙŠØªÙŠÙ† ØªÙ…Ø§Ù…Ø§Ù‹ Ø¹Ù†Ø¯ Ø§Ù„ØªØ³Ù…Ø¹.<br><br><strong>Ù…Ø§ Ù‡ÙŠ Ø§Ù„Ø®Ø·ÙˆØ© Ø§Ù„Ø¹Ù„Ø§Ø¬ÙŠØ© Ø§Ù„ÙÙˆØ±ÙŠØ© Ø§Ù„Ø£ÙƒØ«Ø± Ø£Ù‡Ù…ÙŠØ© ÙˆØ§Ù„Ø£ÙˆÙ„Ù‰ ÙÙŠ Ù‡Ø°Ø§ Ø§Ù„Ø³ÙŠÙ†Ø§Ø±ÙŠÙˆ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØŸ</strong>`,
    options: [
      { text: "Ø£) Ø¥Ø¹Ø·Ø§Ø¡ Ø¬Ø±Ø¹Ø© ÙÙˆØ±ÙŠØ© Ù…Ù† Ù…Ø­Ø§Ù„ÙŠÙ„ Ø§Ù„Ù…Ù„Ø­ Ø§Ù„ÙˆØ±ÙŠØ¯ÙŠØ© Ø§Ù„Ø¹Ø§Ø¯ÙŠØ© (0.9% Normal Saline Bolus)", correct: true },
      { text: "Ø¨) Ø¥Ø¹Ø·Ø§Ø¡ Ø¬Ø±Ø¹Ø© Ø¥Ø¶Ø§ÙÙŠØ© Ù…Ù† Ø§Ù„Ù†ØªØ±ÙˆØ¬Ù„ÙŠØ³Ø±ÙŠÙ† Ø¨Ø§Ù„ÙˆØ±ÙŠØ¯ Ù„Ø®ÙØ¶ Ø§Ù„Ø£Ù„Ù…", correct: false },
      { text: "Ø¬) Ø¥Ø¹Ø·Ø§Ø¡ Ø¬Ø±Ø¹Ø© Ø¹Ø§Ù„ÙŠØ© Ù…Ù† Ù…Ø¯Ø± Ø§Ù„Ø¨ÙˆÙ„ ÙÙˆØ±ÙˆØ³ÙŠÙ…ÙŠØ¯ (Lasix) Ø¨Ø§Ù„ÙˆØ±ÙŠØ¯", correct: false },
      { text: "Ø¯) Ø¥Ø¹Ø·Ø§Ø¡ Ø­Ø§ØµØ±Ø§Øª Ø¨ÙŠØªØ§ (Beta-blockers) Ù„Ù„Ø³ÙŠØ·Ø±Ø© Ø¹Ù„Ù‰ Ù…Ø¹Ø¯Ù„ Ø§Ù„Ù†Ø¨Ø¶", correct: false }
    ],
    explanation: "ÙÙŠ Ø­Ø§Ù„Ø§Øª Ø§Ø­ØªØ´Ø§Ø¡ Ø§Ù„Ø¬Ø¯Ø§Ø± Ø§Ù„Ø³ÙÙ„ÙŠØŒ ÙŠØªØ±Ø§ÙÙ‚ Ù…Ø§ ÙŠÙ‚Ø§Ø±Ø¨ 30-50% Ù…Ù† Ø§Ù„Ø­Ø§Ù„Ø§Øª Ù…Ø¹ Ø§Ø­ØªØ´Ø§Ø¡ Ø§Ù„Ø¨Ø·ÙŠÙ† Ø§Ù„Ø£ÙŠÙ…Ù† (Right Ventricular Infarction). ÙŠØ¹ØªÙ…Ø¯ Ø§Ù„Ù†ØªØ§Ø¬ Ø§Ù„Ù‚Ù„Ø¨ÙŠ Ù„Ù„Ø¨Ø·ÙŠÙ† Ø§Ù„Ø£ÙŠÙ…Ù† Ø¨Ø´ÙƒÙ„ Ø­Ø±Ø¬ Ø¹Ù„Ù‰ Ø­Ø¬Ù… Ø§Ù„Ø§Ù…ØªÙ„Ø§Ø¡ Ø§Ù„ÙˆØ±ÙŠØ¯ÙŠ (Preload-dependent). Ø¥Ø¹Ø·Ø§Ø¡ Ø§Ù„Ù†ØªØ±Ø§Øª ÙŠØ³Ø¨Ø¨ ØªÙˆØ³Ø¹Ø§Ù‹ ÙˆØ±ÙŠØ¯ÙŠØ§Ù‹ Ø³Ø±ÙŠØ¹Ø§Ù‹ ÙˆÙ‡Ø¨ÙˆØ·Ø§Ù‹ Ø­Ø§Ø¯Ø§Ù‹ ÙÙŠ Ø§Ù„Ø¶ØºØ·. Ø§Ù„Ø¹Ù„Ø§Ø¬ Ø§Ù„ÙÙˆØ±ÙŠ Ù‡Ùˆ ØªØ¹ÙˆÙŠØ¶ Ø§Ù„Ø³ÙˆØ§Ø¦Ù„ Ø§Ù„ÙˆØ±ÙŠØ¯ÙŠØ© Ù„Ø±ÙØ¹ Ø§Ù„Ù€ PreloadØŒ ÙˆØªØ¬Ù†Ø¨ Ø§Ù„Ù†ØªØ±Ø§Øª ÙˆÙ…Ø¯Ø±Ø§Øª Ø§Ù„Ø¨ÙˆÙ„ ØªÙ…Ø§Ù…Ø§Ù‹.",
    formula: "Ø§Ù„Ù‚Ø§Ø¹Ø¯Ø© Ø§Ù„ÙØ³ÙŠÙˆÙ„ÙˆØ¬ÙŠØ©: CO = HR Ã— SV (Ø­Ø¬Ù… Ø§Ù„Ù†Ø¨Ø¶Ø© ÙŠØ¹ØªÙ…Ø¯ ÙƒÙ„ÙŠØ§Ù‹ Ø¹Ù„Ù‰ Ø§Ù„Ù€ Preload ÙÙŠ Ø§Ø¹ØªÙ„Ø§Ù„ Ø§Ù„Ø¨Ø·ÙŠÙ† Ø§Ù„Ø£ÙŠÙ…Ù†)."
  },
  raw2: {
    meta: "SMC INDEX: #RAW-02-SURG-118 â€¢ ØªÙƒØ±Ø§Ø± Ø§Ù„Ø§Ù…ØªØ­Ø§Ù†: 88%",
    specialty: "Ø§Ù„Ø¬Ø±Ø§Ø­Ø© Ø§Ù„Ø¹Ø§Ù…Ø© â€¢ Ø¥ØµØ§Ø¨Ø§Øª Ø§Ù„Ø¨Ø·Ù† ÙˆØ§Ù„Ø­ÙˆØ§Ø¯Ø« Ø§Ù„Ø­Ø§Ø¯Ø©",
    prompt: `Ø´Ø§Ø¨ ÙŠØ¨Ù„Øº Ù…Ù† Ø§Ù„Ø¹Ù…Ø± 24 Ø¹Ø§Ù…Ø§Ù‹ ØªØ¹Ø±Ø¶ Ù„Ø­Ø§Ø¯Ø« Ø¯Ø±Ø§Ø¬Ø© Ù†Ø§Ø±ÙŠØ© ÙˆÙ†Ù‚Ù„ Ù„Ù„Ø·ÙˆØ§Ø±Ø¦. Ø§Ù„Ø¹Ù„Ø§Ù…Ø§Øª Ø§Ù„Ø­ÙŠÙˆÙŠØ©: Ø§Ù„Ø¶ØºØ· 85/50ØŒ Ø§Ù„Ù†Ø¨Ø¶ 125/Ø¯Ù‚ÙŠÙ‚Ø©ØŒ Ø§Ù„Ø¨Ø·Ù† Ù…ØªÙŠØ¨Ø³ Ù…Ø¹ Ø¥ÙŠÙ„Ø§Ù… Ø¹Ù†Ø¯ Ø§Ù„Ø¬Ø³. Ø£Ø¸Ù‡Ø± ÙØ­Øµ Ø§Ù„Ø³ÙˆÙ†Ø§Ø± Ø§Ù„Ø·Ø§Ø±Ø¦ (FAST) ÙˆØ¬ÙˆØ¯ ÙƒÙ…ÙŠØ© Ù…Ø¹ØªØ¨Ø±Ø© Ù…Ù† Ø§Ù„Ø³ÙˆØ§Ø¦Ù„ Ø§Ù„Ø­Ø±Ø© ÙÙŠ Ø§Ù„Ø­ÙˆØ¶ ÙˆØ§Ù„Ù…Ø³Ø§ÙØ© Ø§Ù„ÙƒØ¨Ø¯ÙŠØ© Ø§Ù„ÙƒÙ„ÙˆÙŠØ© (Morison's Pouch).<br><br><strong>Ù…Ø§ Ù‡Ùˆ Ø§Ù„ØªØ¯Ø¨ÙŠØ± Ø§Ù„Ø¬Ø±Ø§Ø­ÙŠ Ø§Ù„Ø£Ù†Ø³Ø¨ ÙˆØ§Ù„Ø£Ø³Ø±Ø¹ Ù„Ø¥Ù†Ù‚Ø§Ø° Ø­ÙŠØ§Ø© Ø§Ù„Ù…Ø±ÙŠØ¶ØŸ</strong>`,
    options: [
      { text: "Ø£) ÙØªØ­ Ø¨Ø·Ù† Ø§Ø³ØªÙƒØ´Ø§ÙÙŠ ÙÙˆØ±ÙŠ ÙÙŠ ØºØ±ÙØ© Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª (Exploratory Laparotomy)", correct: true },
      { text: "Ø¨) Ø¥Ø¬Ø±Ø§Ø¡ Ø£Ø´Ø¹Ø© Ù…Ù‚Ø·Ø¹ÙŠØ© Ø¨Ø§Ù„ØµØ¨ØºØ© Ù„Ù„Ø¨Ø·Ù† ÙˆØ§Ù„Ø­ÙˆØ¶ (CT Scan)", correct: false },
      { text: "Ø¬) Ø§Ù„Ù…Ù„Ø§Ø­Ø¸Ø© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© ÙÙŠ Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø§Ù„Ù…ÙƒØ«ÙØ© Ù…Ø¹ Ù†Ù‚Ù„ ÙˆØ­Ø¯ØªÙŠ Ø¯Ù…", correct: false },
      { text: "Ø¯) Ø³Ø­Ø¨ Ø§Ù„Ø³Ø§Ø¦Ù„ Ø¨Ø§Ù„Ø¥Ø¨Ø±Ø© ØªØ­Øª ØªÙˆØ¬ÙŠÙ‡ Ø§Ù„Ø³ÙˆÙ†Ø§Ø±", correct: false }
    ],
    explanation: "Ù…Ø±ÙŠØ¶ Ø§Ù„ØµØ¯Ù…Ø© ØºÙŠØ± Ø§Ù„Ù…Ø³ØªÙ‚Ø± Ø¯ÙŠÙ†Ø§Ù…ÙŠÙƒÙŠØ§Ù‹ (Hemodynamically Unstable) Ù…Ø¹ FAST Ø¥ÙŠØ¬Ø§Ø¨ÙŠ ÙŠÙØ¹ØªØ¨Ø± Ù†Ø²ÙŠÙØ§Ù‹ Ø¯Ø§Ø®Ù„ÙŠØ§Ù‹ Ø¨Ø·Ù†ÙŠØ§Ù‹ Ù†Ø´Ø·Ø§Ù‹ ÙŠØ³ØªØ¯Ø¹ÙŠ ÙØªØ­ Ø§Ù„Ø¨Ø·Ù† Ø§Ù„Ø§Ø³ØªÙƒØ´Ø§ÙÙŠ Ø§Ù„ÙÙˆØ±ÙŠ Ù„Ø¥ÙŠÙ‚Ø§Ù Ø§Ù„Ù†Ø²ÙŠÙ ÙˆÙÙ‚ Ù…Ø¨Ø§Ø¯Ø¦ Damage Control SurgeryØŒ ÙˆÙŠÙÙ…Ù†Ø¹ Ù†Ù‚Ù„Ù‡ Ù„Ø¥Ø¬Ø±Ø§Ø¡ Ø§Ù„Ø£Ø´Ø¹Ø© Ø§Ù„Ù…Ù‚Ø·Ø¹ÙŠØ© Ù„Ø®Ø·ÙˆØ±Ø© Ø§Ù„ØªØ¯Ù‡ÙˆØ± Ø®Ø§Ø±Ø¬ ØºØ±ÙØ© Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª.",
    formula: "Ø§Ù„Ù‚Ø§Ø¹Ø¯Ø© Ø§Ù„Ø¬Ø±Ø§Ø­ÙŠØ©: FAST (+) + Hemodynamic Instability = Immediate Laparotomy."
  },
  raw3: {
    meta: "SMC INDEX: #RAW-03-PEDS-204 â€¢ ØªÙƒØ±Ø§Ø± Ø§Ù„Ø§Ù…ØªØ­Ø§Ù†: 95%",
    specialty: "Ø·Ø¨ Ø§Ù„Ø£Ø·ÙØ§Ù„ â€¢ Ø·ÙˆØ§Ø±Ø¦ Ø§Ù„Ø¬Ù‡Ø§Ø² Ø§Ù„ØªÙ†ÙØ³ÙŠ",
    prompt: `Ø·ÙÙ„ ÙŠØ¨Ù„Øº Ù…Ù† Ø§Ù„Ø¹Ù…Ø± Ø³Ù†ØªÙŠÙ† ÙŠØ¹Ø§Ù†ÙŠ Ù…Ù† Ø³Ø¹Ø§Ù„ Ù†Ø¨Ø§Ø­ÙŠ (Barking cough) ÙˆØ¨Ø­Ø© ÙÙŠ Ø§Ù„ØµÙˆØª ÙˆØµØ±ÙŠØ± ØªÙ†ÙØ³ÙŠ (Stridor) Ø£Ø«Ù†Ø§Ø¡ Ø§Ù„Ø±Ø§Ø­Ø© Ù…Ø¹ Ø§Ù†Ø³Ø­Ø§Ø¨ Ø§Ù„Ø£Ø¶Ù„Ø§Ø¹ Ø¯ÙˆÙ† Ø²Ø±Ù‚Ø©.<br><br><strong>Ù…Ø§ Ù‡Ùˆ Ø§Ù„Ø¹Ù„Ø§Ø¬ Ø§Ù„Ø¯ÙˆØ§Ø¦ÙŠ Ø§Ù„ÙÙˆØ±ÙŠ Ø¹Ø§Ù„ÙŠ Ø§Ù„ÙØ§Ø¹Ù„ÙŠØ© Ø§Ù„Ù…Ø¹ØªÙ…Ø¯ Ø¨Ø§Ù„Ø£Ø¯Ù„Ø© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ©ØŸ</strong>`,
    options: [
      { text: "Ø£) Ø¥Ø¹Ø·Ø§Ø¡ Ø¬Ø±Ø¹Ø© ÙÙ…ÙˆÙŠØ© Ø£Ùˆ Ø­Ù‚Ù† Ù…Ù† Ø§Ù„Ø¯ÙŠÙƒØ³Ø§Ù…ÙŠØ«Ø§Ø²ÙˆÙ† (Dexamethasone) ÙˆØ§Ø³ØªÙ†Ø´Ø§Ù‚ Ø§Ù„Ø£Ø¯Ø±ÙŠÙ†Ø§Ù„ÙŠÙ†", correct: true },
      { text: "Ø¨) Ø¥Ø¹Ø·Ø§Ø¡ Ù…Ø¶Ø§Ø¯ Ø­ÙŠÙˆÙŠ ÙˆØ§Ø³Ø¹ Ø§Ù„Ø·ÙŠÙ ÙÙˆØ±Ø§Ù‹", correct: false },
      { text: "Ø¬) Ø§Ø³ØªÙ†Ø´Ø§Ù‚ Ø¨Ø®Ø§Ø± Ø§Ù„Ù…Ø§Ø¡ Ø§Ù„Ø³Ø§Ø®Ù† ÙÙ‚Ø·", correct: false },
      { text: "Ø¯) Ø¥Ø¹Ø·Ø§Ø¡ Ù…ÙˆØ³Ø¹ Ø´Ø¹Ø¨ Ù‡ÙˆØ§Ø¦ÙŠØ© Ø³Ø§Ù„Ø¨ÙˆØªØ§Ù…ÙˆÙ„ ÙÙ‚Ø·", correct: false }
    ],
    explanation: "Ø§Ù„Ø­Ø§Ù„Ø© ØªÙ…Ø«Ù„ Ø®Ù†Ø§Ù‚Ø§Ù‹ Ø­Ù†Ø¬Ø±ÙŠØ§Ù‹ Ù…ØªÙˆØ³Ø·Ø§Ù‹ Ø¥Ù„Ù‰ Ø´Ø¯ÙŠØ¯ (Moderate to Severe Croup). Ø§Ù„Ø¯ÙŠÙƒØ³Ø§Ù…ÙŠØ«Ø§Ø²ÙˆÙ† (0.6 mg/kg) ÙŠÙ‚Ù„Ù„ ÙˆØ°Ù…Ø© Ø§Ù„ØºØ´Ø§Ø¡ Ø§Ù„Ù…Ø®Ø§Ø·ÙŠ ØªØ­Øª Ø§Ù„Ø­Ø¨Ø§Ù„ Ø§Ù„ØµÙˆØªÙŠØ©ØŒ ÙˆÙŠÙØ¶Ø§Ù Ø§Ù„Ø£Ø¯Ø±ÙŠÙ†Ø§Ù„ÙŠÙ† Ø§Ù„Ù…Ø³ØªÙ†Ø´Ù‚ Ù„ØªÙ‚Ù„ÙŠØµ Ø§Ù„Ø£ÙˆØ¹ÙŠØ© Ø³Ø±ÙŠØ¹Ø§Ù‹ ÙˆØªØ®ÙÙŠÙ Ø§Ù„Ø¶Ø§Ø¦Ù‚Ø© Ø§Ù„ØªÙ†ÙØ³ÙŠØ© Ø§Ù„ÙÙˆØ±ÙŠØ©.",
    formula: "Ø§Ù„Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ: Stridor at Rest = Oral Dexamethasone + Nebulized Epinephrine."
  },
  raw5: {
    meta: "SMC INDEX: #RAW-05-OBS-312 â€¢ ØªÙƒØ±Ø§Ø± Ø§Ù„Ø§Ù…ØªØ­Ø§Ù†: 90%",
    specialty: "Ø§Ù„Ù†Ø³Ø§Ø¡ ÙˆØ§Ù„ØªÙˆÙ„ÙŠØ¯ â€¢ Ø·ÙˆØ§Ø±Ø¦ Ù…Ø§ Ø¨Ø¹Ø¯ Ø§Ù„ÙˆÙ„Ø§Ø¯Ø©",
    prompt: `Ø³ÙŠØ¯Ø© ØªØ¨Ù„Øº Ù…Ù† Ø§Ù„Ø¹Ù…Ø± 30 Ø¹Ø§Ù…Ø§Ù‹ ÙˆØ¶Ø¹Øª Ø·ÙÙ„Ù‡Ø§ Ø§Ù„Ø±Ø§Ø¨Ø¹ Ù‚Ø¨Ù„ 20 Ø¯Ù‚ÙŠÙ‚Ø©. Ø¨Ø¯Ø£Øª ØªÙ†Ø²Ù Ø¯Ù…Ø§Ù‹ ØºØ²ÙŠØ±Ø§Ù‹ Ù…Ù† Ø§Ù„Ù…Ù‡Ø¨Ù„ØŒ ÙˆØ¹Ù†Ø¯ ÙØ­Øµ Ø§Ù„Ø¨Ø·Ù† ÙˆÙØ¬Ø¯ Ø§Ù„Ø±Ø­Ù… Ø±Ø®ÙˆØ§Ù‹ ÙˆØºÙŠØ± Ù…Ù†Ù‚Ø¨Ø¶ (BOGGY UTERUS) ÙÙˆÙ‚ Ù…Ø³ØªÙˆÙ‰ Ø§Ù„Ø³Ø±Ø©.<br><br><strong>Ù…Ø§ Ù‡Ùˆ Ø§Ù„Ø³Ø¨Ø¨ Ø§Ù„Ø£ÙƒØ«Ø± Ø´ÙŠÙˆØ¹Ø§Ù‹ ÙˆØ§Ù„Ø®Ø·ÙˆØ© Ø§Ù„ØªØ¯Ø¨ÙŠØ±ÙŠØ© Ø§Ù„Ø£ÙˆÙ„Ù‰ØŸ</strong>`,
    options: [
      { text: "Ø£) Ø®Ù…ÙˆÙ„ Ø§Ù„Ø±Ø­Ù… (Uterine Atony) â€¢ Ù…Ø³Ø§Ø¬ ÙŠØ¯ÙˆÙŠ Ù„Ù„Ø±Ø­Ù… ÙˆØ¥Ø¹Ø·Ø§Ø¡ Ø§Ù„Ø£ÙˆÙƒØ³ÙŠØªÙˆØ³ÙŠÙ† (Oxytocin)", correct: true },
      { text: "Ø¨) ØªÙ…Ø²Ù‚ Ø¹Ù†Ù‚ Ø§Ù„Ø±Ø­Ù… â€¢ Ø®ÙŠØ§Ø·Ø© Ø¬Ø±Ø§Ø­ÙŠØ© ÙÙˆØ±ÙŠØ©", correct: false },
      { text: "Ø¬) Ø§Ø­ØªØ¨Ø§Ø³ Ø§Ù„Ù…Ø´ÙŠÙ…Ø© â€¢ Ø§Ø³ØªØ¦ØµØ§Ù„ Ø§Ù„Ø±Ø­Ù… ÙÙˆØ±Ø§Ù‹", correct: false },
      { text: "Ø¯) ØªØ¬Ù„Ø· Ø§Ù„Ø¯Ù… Ø§Ù„Ù…Ù†ØªØ´Ø± (DIC) â€¢ Ù†Ù‚Ù„ Ø¨Ù„Ø§Ø²Ù…Ø§ Ù…Ø¬Ù…Ø¯Ø©", correct: false }
    ],
    explanation: "Ø®Ù…ÙˆÙ„ Ø§Ù„Ø±Ø­Ù… (Uterine Atony) Ù‡Ùˆ Ø§Ù„Ø³Ø¨Ø¨ ÙÙŠ Ø£ÙƒØ«Ø± Ù…Ù† 70-80% Ù…Ù† Ù†Ø²ÙŠÙ Ù…Ø§ Ø¨Ø¹Ø¯ Ø§Ù„ÙˆÙ„Ø§Ø¯Ø© Ø§Ù„Ø£ÙˆÙ„ÙŠ (PPH). Ø§Ù„Ø®Ø· Ø§Ù„Ø£ÙˆÙ„ Ø§Ù„ÙÙˆØ±ÙŠ Ù‡Ùˆ ØªØ¯Ù„ÙŠÙƒ Ù‚Ø§Ø¹ Ø§Ù„Ø±Ø­Ù… ÙŠØ¯ÙˆÙŠØ§Ù‹ Ù„ØªØ­ÙÙŠØ² Ø§Ù„Ø§Ù†Ù‚Ø¨Ø§Ø¶ Ù…Ø¹ Ø¥Ø¹Ø·Ø§Ø¡ Ù…Ø­ÙØ²Ø§Øª ØªÙ‚Ù„Øµ Ø§Ù„Ø±Ø­Ù… (Uterotonics Ù…Ø«Ù„ Oxytocin/Misoprostol) ÙˆÙ…Ø±Ø§Ù‚Ø¨Ø© Ø§Ù„Ø¹Ù„Ø§Ù…Ø§Øª Ø§Ù„Ø­ÙŠÙˆÙŠØ©.",
    formula: "Ø§Ù„Ù‚Ø§Ø¹Ø¯Ø© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ©: Boggy Uterus + PPH = Bimanual Compression + Uterotonic Infusion."
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
      const number = "+2+20 101 592 2628";
      navigator.clipboard.writeText(number).then(() => {
        const originalText = this.textContent;
        this.textContent = "ØªÙ… Ù†Ø³Ø® Ø±Ù‚Ù… Ø£Ù…Ø§Ù†Ø© Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª ÙˆØ§Ù„ØªÙˆØ«ÙŠÙ‚ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ âœ“";
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
    bonusText = `\nðŸŽ ØªÙ… ØªØ³Ø¬ÙŠÙ„ ØªØ±Ø´ÙŠØ­ Ø§Ù„Ø²Ù…ÙŠÙ„ (${escapeHtml(refPhone)}) Ø¨Ù†Ø¬Ø§Ø­ (+100 GP Ø¥Ø¶Ø§ÙÙŠØ©).`;
  }

  alert(`âœ… ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… ÙˆØªÙˆØ«ÙŠÙ‚ ØªÙ‚ÙŠÙŠÙ…Ùƒ Ø§Ù„ØªØ´ØºÙŠÙ„ÙŠ Ø¨Ù†Ø¬Ø§Ø­!\n\nØ±Ù‚Ù… Ø§Ù„Ù‡ÙˆÙŠØ©: ${escapeHtml(gaId)}\nØ§Ù„Ø¨Ø±ÙŠØ¯: ${escapeHtml(email)}\n\nØªÙ…Øª Ø¥Ø¶Ø§ÙØ© +100 GP Ù„Ø±ØµÙŠØ¯Ùƒ Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠ.${bonusText}\n\nØ´ÙƒØ±Ø§Ù‹ Ù„Ù…Ø³Ø§Ù‡Ù…ØªÙƒ Ø§Ù„ÙØ¹Ø§Ù„Ø© ÙÙŠ Ø¨Ù†Ø§Ø¡ ÙˆØªØ·ÙˆÙŠØ± Ø§Ù„Ù…Ù†Ø¸ÙˆÙ…Ø© Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ©.`);
  
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
  const board = document.getElementById("Independent-board");
  if (!board) return;

  const rows = [
    { name: "gemiiniXsmc PERMANENT LICENSURE", status: "OPEN", statusClass: "open", cohort: "ROLLING", mods: "MODULES 1-8" },
    { name: "JUNIOR STEM & 57357 DISCOVERY", status: "OPEN", statusClass: "open", cohort: "MONTHLY", mods: "LAB & TOURS" },
    { name: "MOLECULAR MEDICINE (MM 1.0 - 8.0)", status: "OPEN", statusClass: "open", cohort: "ROLLING", mods: "8 DIPLOMAS" },
    { name: "GLOMET HOSPITAL TURNKEY LABS", status: "LIVE", statusClass: "live", cohort: "ACTIVE", mods: "10 STATES" },
    { name: "GENOMICS & ONCOLOGY RESEARCH", status: "OPEN", statusClass: "open", cohort: "ANNUAL", mods: "4 GROUPS" }
  ];

  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 â€”";

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
    <span>LIVE REGISTRY FEED â€¢ PROFESSIONAL DIGITAL IDENTITY (GA#)</span>
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
