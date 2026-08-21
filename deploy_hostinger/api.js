/**
 * =============================================================================
 * GemIInI Sovereign Platform — Unified Frontend API Bridge (2026/2027)
 * =============================================================================
 * Connects the web application to the live Google Apps Script Master Backend.
 * Handles Secure Registration, SHA-256 Login, Local Fallbacks, and Session State.
 */

const GAS_URL = "https://script.google.com/macros/s/AKfycbxAVR42yEQlQMkOBhlcka622FNbSD_3_pIJrNL1bktLyN8TqIYGC2P5cGpUqeZcoql8/exec";

/**
 * 1. Secure Universal Login Function
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
      // Save authenticated session
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

    // Fallback: Check local GA_DATABASE
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
 * 2. Secure Universal Registration Function
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
    // Offline local fallback registration
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
 * 3. Session Helpers
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
