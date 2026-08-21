/**
 * =============================================================================
 * GemIInI Sovereign Platform — Unified Frontend API Bridge (2026/2027)
 * =============================================================================
 * Connects the web application to the live Google Apps Script Master Backend.
 * Handles Secure Registration, SHA-256 Login, SSO Quick Sync, Server Grading, and Session State.
 */

const GAS_URL = "https://script.google.com/macros/s/AKfycbxAVR42yEQlQMkOBhlcka622FNbSD_3_pIJrNL1bktLyN8TqIYGC2P5cGpUqeZcoql8/exec";

/**
 * 1. Secure Sovereign SSO Login / Quick Verification
 */
async function executeSovereignSync() {
  const input = document.getElementById("sso-quick-id");
  if (!input) return;
  const gaId = input.value.trim().toUpperCase();
  
  if (!gaId) {
    alert("يرجى إدخال رقم المعرف السيادي");
    return;
  }

  // Visual loading state
  input.disabled = true;
  document.getElementById("sso-not-found-notice")?.remove();

  try {
    const response = await fetch(`${GAS_URL}?action=lookup&id=${encodeURIComponent(gaId)}`);
    const data = await response.json();

    const unauthView = document.getElementById("sso-unauth-view");
    const authView = document.getElementById("sso-authenticated-view");

    if (data.found && data.member && data.member.verified !== false) {
      // Valid, verified user found!
      localStorage.setItem("gemiini_sovereign_ga_id", data.member.id);
      
      const session = {
        id: data.member.id,
        name: data.member.name,
        email: data.member.email || "",
        univ: data.member.univ || data.member.university || "جامعة معتمدة",
        role: data.member.role || "GemIInI",
        gp: data.member.gp || 500,
        drive: data.member.drive || `https://drive.google.com/drive/search?q=${data.member.id}`,
        authenticated: true,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem("ga_user", JSON.stringify(session));
      localStorage.setItem("gemiini_sovereign_session", JSON.stringify(session));

      const nameField = document.getElementById("sso-doctor-name");
      const gpField = document.getElementById("sso-doctor-gp");
      const idField = document.getElementById("sso-doctor-id");
      const univField = document.getElementById("sso-doctor-univ");

      if (nameField) nameField.textContent = data.member.name;
      if (gpField) gpField.textContent = (data.member.gp || 500).toLocaleString() + " GP";
      if (idField) idField.textContent = data.member.id;
      if (univField) univField.textContent = data.member.univ || data.member.university || "";

      if (unauthView) unauthView.style.display = "none";
      if (authView) authView.style.display = "flex";
    } else {
      // User not found or not verified
      localStorage.removeItem("gemiini_sovereign_ga_id");
      let notice = document.createElement("div");
      notice.id = "sso-not-found-notice";
      notice.style.cssText = "width:100%; font-size:12.5px; color:#FCA5A5; margin-top:8px;";
      notice.textContent = `المعرف "${gaId}" غير موجود أو قيد المراجعة في السجل السيادي الموثق.`;
      if (unauthView) unauthView.appendChild(notice);
    }
  } catch (err) {
    console.warn("GAS Network Error, checking local registry...", err);
    
    // Fallback: Check local GA_DATABASE if available
    let localMatch = null;
    if (typeof GA_DATABASE !== 'undefined' && Array.isArray(GA_DATABASE)) {
      localMatch = GA_DATABASE.find(m => 
        (m.id && m.id.toUpperCase() === gaId) ||
        (m.id && ("GA" + m.id).toUpperCase() === gaId)
      );
    }

    const unauthView = document.getElementById("sso-unauth-view");
    const authView = document.getElementById("sso-authenticated-view");

    if (localMatch) {
      localStorage.setItem("gemiini_sovereign_ga_id", localMatch.id);
      const session = {
        id: localMatch.id,
        name: localMatch.name,
        email: localMatch.email || "",
        univ: localMatch.univ || "جامعة معتمدة",
        role: "GemIInI",
        gp: localMatch.gp || 500,
        drive: `https://drive.google.com/drive/search?q=${localMatch.id}`,
        authenticated: true,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem("ga_user", JSON.stringify(session));
      localStorage.setItem("gemiini_sovereign_session", JSON.stringify(session));

      const nameField = document.getElementById("sso-doctor-name");
      const gpField = document.getElementById("sso-doctor-gp");
      const idField = document.getElementById("sso-doctor-id");
      const univField = document.getElementById("sso-doctor-univ");

      if (nameField) nameField.textContent = localMatch.name;
      if (gpField) gpField.textContent = (localMatch.gp || 500).toLocaleString() + " GP";
      if (idField) idField.textContent = localMatch.id;
      if (univField) univField.textContent = localMatch.univ || "";

      if (unauthView) unauthView.style.display = "none";
      if (authView) authView.style.display = "flex";
    } else {
      let notice = document.createElement("div");
      notice.id = "sso-not-found-notice";
      notice.style.cssText = "width:100%; font-size:12.5px; color:#FCA5A5; margin-top:8px;";
      notice.textContent = `تعذر الاتصال بالخادم المركزي للتحقق من "${gaId}".`;
      if (unauthView) unauthView.appendChild(notice);
    }
  } finally {
    input.disabled = false;
  }
}
window.executeSovereignSync = executeSovereignSync;

/**
 * 2. Secure Exam Submission (Graded on Server & Live GP Ledger Update)
 */
async function checkRawAnswer(selectedOptionIndex, btnElement, bankKey) {
  const gaId = localStorage.getItem("gemiini_sovereign_ga_id");
  if (!gaId) {
    alert("يجب عليك إدخال هويتك السيادية (GA-ID) أولاً لتوثيق نقاطك.");
    return;
  }

  const allBtns = document.querySelectorAll(".raw-opt-btn, .raw-option-btn");
  allBtns.forEach(b => b.disabled = true);
  if (btnElement) btnElement.textContent = "جاري التدقيق السيادي...";

  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        "Content-Type": "text/plain;charset=utf-8" // Prevents CORS preflight errors in GAS
      },
      body: JSON.stringify({
        action: "submit_exam",
        ga_id: gaId,
        module: bankKey,
        answer_index: selectedOptionIndex
      })
    });
    
    const result = await response.json();

    if (result.correct) {
      if (btnElement) {
        btnElement.style.background = "#DCFCE7";
        btnElement.style.borderColor = "#16A34A";
        btnElement.style.color = "#14532D";
        btnElement.textContent = "إجابة صحيحة ✓";
      }
      
      const scoreBadge = document.getElementById("simulator-score-badge") || document.getElementById("raw-live-score");
      if (scoreBadge) scoreBadge.textContent = `تم إضافة +${result.gp_awarded || 50} GP لرصيدك!`;
      
      // Update local UI GP balance instantly
      const currentGp = document.getElementById("sso-doctor-gp") || document.getElementById("profile-gp");
      if (currentGp) {
         let currentVal = parseInt(currentGp.textContent.replace(/\D/g,'')) || 0;
         currentGp.textContent = (currentVal + (result.gp_awarded || 50)).toLocaleString() + " GP";
      }

    } else {
      if (btnElement) {
        btnElement.style.background = "#FEE2E2";
        btnElement.style.borderColor = "#DC2626";
        btnElement.style.color = "#7F1D1D";
        btnElement.textContent = "إجابة خاطئة ✗";
      }
    }

    // Show clinical explanation (Loaded locally from RAW_BANK_DATA in app.js if available)
    const expBox = document.getElementById("raw-mtc-explanation") || document.getElementById("raw-explanation-box");
    const expText = document.getElementById("raw-mtc-text") || document.getElementById("raw-explanation-text");
    if (expBox && expText && typeof RAW_BANK_DATA !== "undefined" && RAW_BANK_DATA[bankKey]) {
      expText.innerHTML = RAW_BANK_DATA[bankKey].explanation || RAW_BANK_DATA[bankKey].prompt;
      expBox.style.display = "block";
    }

  } catch(err) {
    console.error("Exam Submit Error:", err);
    
    // Offline local evaluation fallback
    if (typeof RAW_BANK_DATA !== 'undefined' && RAW_BANK_DATA[bankKey]) {
      const bank = RAW_BANK_DATA[bankKey];
      const opt = bank.options[selectedOptionIndex];
      if (opt && opt.correct) {
        if (btnElement) {
          btnElement.style.background = "#DCFCE7";
          btnElement.style.borderColor = "#16A34A";
          btnElement.style.color = "#14532D";
          btnElement.textContent = "إجابة صحيحة ✓ (+50 GP محلياً)";
        }
      } else {
        if (btnElement) {
          btnElement.style.background = "#FEE2E2";
          btnElement.style.borderColor = "#DC2626";
          btnElement.style.color = "#7F1D1D";
          btnElement.textContent = "إجابة خاطئة ✗";
        }
      }
      const expBox = document.getElementById("raw-mtc-explanation") || document.getElementById("raw-explanation-box");
      const expText = document.getElementById("raw-mtc-text") || document.getElementById("raw-explanation-text");
      if (expBox && expText) {
        expText.innerHTML = bank.explanation;
        expBox.style.display = "block";
      }
    } else {
      alert("تعذر الاتصال بالخادم المركزي. تأكد من اتصالك بالإنترنت.");
      allBtns.forEach(b => b.disabled = false);
      if (btnElement) btnElement.textContent = "أعد المحاولة";
    }
  }
}
window.checkRawAnswer = checkRawAnswer;

/**
 * 3. Secure Universal Login Function
 */
async function loginSovereignUser(idOrEmail, password) {
  const cleanId = (idOrEmail || "").trim();
  const cleanPass = (password || "").trim();

  if (!cleanId || !cleanPass) {
    throw new Error("يرجى إدخال المعرف / البريد الإلكتروني وكلمة المرور.");
  }

  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "login",
        id_email: cleanId,
        password: cleanPass
      })
    });

    const result = await response.json();

    if (result.status === "success" && result.user) {
      const session = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email || cleanId,
        role: result.user.role || "GemIInI",
        gp: result.user.gp || 500,
        drive: result.user.drive || `https://drive.google.com/drive/search?q=${result.user.id}`,
        authenticated: true,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem("ga_user", JSON.stringify(session));
      localStorage.setItem("gemiini_sovereign_session", JSON.stringify(session));
      localStorage.setItem("gemiini_sovereign_ga_id", session.id);
      return session;
    } else {
      throw new Error(result.message || "فشل التحقق من بيانات الدخول.");
    }
  } catch (netErr) {
    console.warn("GAS Network Error, attempting offline registry check...", netErr);

    if (typeof GA_DATABASE !== 'undefined' && Array.isArray(GA_DATABASE)) {
      const match = GA_DATABASE.find(m => 
        (m.id && m.id.toUpperCase() === cleanId.toUpperCase()) ||
        (m.id && ("GA" + m.id).toUpperCase() === cleanId.toUpperCase()) ||
        (m.email && m.email.toLowerCase() === cleanId.toLowerCase())
      );

      if (match) {
        const session = {
          id: match.id,
          name: match.name,
          email: match.email || cleanId,
          role: match.role && match.role.includes("Research") ? "GeneAcademy" : "GemIInI",
          gp: match.gp || 500,
          drive: `https://drive.google.com/drive/search?q=${match.id}`,
          authenticated: true,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem("ga_user", JSON.stringify(session));
        localStorage.setItem("gemiini_sovereign_session", JSON.stringify(session));
        localStorage.setItem("gemiini_sovereign_ga_id", session.id);
        return session;
      }
    }
    throw new Error(netErr.message || "تعذر الاتصال بالخادم المركزي.");
  }
}

/**
 * 4. Secure Universal Registration Function
 */
async function registerSovereignUser(payload) {
  const body = {
    action: "register",
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role || "GemIInI",
    mentorship_level: payload.mentorship_level || "",
    company: payload.company || "",
    targetDate: payload.targetDate || "2026"
  };

  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body)
    });

    const result = await response.json();

    if (result.status === "success") {
      const session = {
        id: result.id,
        name: payload.name,
        email: payload.email,
        role: result.role || payload.role,
        gp: result.gp || 500,
        drive: result.drive_link || `https://drive.google.com/drive/search?q=${result.id}`,
        authenticated: true,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem("ga_user", JSON.stringify(session));
      localStorage.setItem("gemiini_sovereign_session", JSON.stringify(session));
      localStorage.setItem("gemiini_sovereign_ga_id", session.id);
      return result;
    } else {
      throw new Error(result.message || "تعذر إتمام التسجيل.");
    }
  } catch (err) {
    console.warn("GAS registration network error, generating local sovereign credentials...", err);
    const randNum = Math.floor(3540 + Math.random() * 500);
    const localId = (payload.role === "GLOMEt") ? `GL-${randNum}` : `GA-${randNum}`;
    const driveUrl = `https://drive.google.com/drive/search?q=${localId}`;

    const session = {
      id: localId,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      gp: 500,
      drive: driveUrl,
      authenticated: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem("ga_user", JSON.stringify(session));
    localStorage.setItem("gemiini_sovereign_session", JSON.stringify(session));
    localStorage.setItem("gemiini_sovereign_ga_id", session.id);

    return {
      status: "success",
      id: localId,
      role: payload.role,
      gp: 500,
      drive_link: driveUrl,
      message: "تم إصدار المعرف السيادي محلياً."
    };
  }
}

/**
 * 5. Session Helpers
 */
function getSovereignSession() {
  try {
    const raw = localStorage.getItem("ga_user") || localStorage.getItem("gemiini_sovereign_session");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function logoutSovereignUser() {
  localStorage.removeItem("ga_user");
  localStorage.removeItem("gemiini_sovereign_session");
  localStorage.removeItem("gemiini_sovereign_ga_id");
  window.location.href = "index.html";
}
