// Connected to your Live Secure Backend
const GAS_URL = "https://script.google.com/macros/s/AKfycbxAVR42yEQlQMkOBhlcka622FNbSD_3_pIJrNL1bktLyN8TqIYGC2P5cGpUqeZcoql8/exec";

/**
 * 1. Secure Sovereign SSO Login
 */
async function executeSovereignSync() {
  const input = document.getElementById("sso-quick-id");
  if (!input) return;
  const gaId = input.value.trim().toUpperCase();
  
  if (!gaId) {
    alert("يرجى إدخال رقم المعرف المهني");
    return;
  }

  // Visual loading state
  input.disabled = true;
  document.getElementById("sso-not-found-notice")?.remove();

  try {
    const response = await fetch(`${GAS_URL}?action=lookup&id=${gaId}`);
    const data = await response.json();

    const unauthView = document.getElementById("sso-unauth-view");
    const authView = document.getElementById("sso-authenticated-view");

    if (data.found && data.member.verified) {
      // Valid, verified user found!
      localStorage.setItem("gemiini_sovereign_ga_id", data.member.id);
      
      const session = {
        id: data.member.id,
        name: data.member.name,
        univ: data.member.univ,
        gp: data.member.gp,
        role: data.member.role,
        authenticated: true
      };
      localStorage.setItem("gemiini_sovereign_session", JSON.stringify(session));

      if(document.getElementById("sso-doctor-name")) document.getElementById("sso-doctor-name").textContent = data.member.name;
      if(document.getElementById("sso-doctor-id")) document.getElementById("sso-doctor-id").textContent = data.member.id;
      if(document.getElementById("sso-doctor-gp")) document.getElementById("sso-doctor-gp").textContent = (data.member.gp || 0).toLocaleString() + " GP";
      if(document.getElementById("sso-doctor-univ")) document.getElementById("sso-doctor-univ").textContent = data.member.univ;
      
      if (unauthView) unauthView.style.display = "none";
      if (authView) authView.style.display = "flex";
    } else {
      // Fallback check against local database
      const localDoc = (typeof GA_DATABASE !== 'undefined') ? GA_DATABASE.find(m => m.id.toUpperCase() === gaId) : null;
      if (localDoc) {
        localStorage.setItem("gemiini_sovereign_ga_id", localDoc.id);
        const session = {
          id: localDoc.id,
          name: localDoc.name,
          univ: localDoc.univ,
          gp: localDoc.gp,
          role: localDoc.role,
          authenticated: true
        };
        localStorage.setItem("gemiini_sovereign_session", JSON.stringify(session));

        if(document.getElementById("sso-doctor-name")) document.getElementById("sso-doctor-name").textContent = localDoc.name;
        if(document.getElementById("sso-doctor-id")) document.getElementById("sso-doctor-id").textContent = localDoc.id;
        if(document.getElementById("sso-doctor-gp")) document.getElementById("sso-doctor-gp").textContent = (localDoc.gp || 0).toLocaleString() + " GP";
        if(document.getElementById("sso-doctor-univ")) document.getElementById("sso-doctor-univ").textContent = localDoc.univ;
        
        if (unauthView) unauthView.style.display = "none";
        if (authView) authView.style.display = "flex";
      } else {
        localStorage.removeItem("gemiini_sovereign_ga_id");
        let notice = document.createElement("div");
        notice.id = "sso-not-found-notice";
        notice.style.cssText = "width:100%; font-size:13px; color:#FCA5A5; margin-top:8px;";
        notice.textContent = `المعرف "${gaId}" غير موجود أو قيد المراجعة في السجل الموثق.`;
        if (unauthView) unauthView.appendChild(notice);
      }
    }
  } catch (err) {
    console.error("SSO Error:", err);
    // Offline local fallback
    const localDoc = (typeof GA_DATABASE !== 'undefined') ? GA_DATABASE.find(m => m.id.toUpperCase() === gaId) : null;
    if (localDoc) {
      if(document.getElementById("sso-doctor-name")) document.getElementById("sso-doctor-name").textContent = localDoc.name;
      if(document.getElementById("sso-doctor-gp")) document.getElementById("sso-doctor-gp").textContent = (localDoc.gp || 0).toLocaleString() + " GP";
      const unauthView = document.getElementById("sso-unauth-view");
      const authView = document.getElementById("sso-authenticated-view");
      if (unauthView) unauthView.style.display = "none";
      if (authView) authView.style.display = "flex";
    } else {
      alert("تعذر الاتصال بالسجل المركزي. يرجى التحقق من اتصال الإنترنت.");
    }
  } finally {
    input.disabled = false;
  }
}

function logoutSovereignSession() {
  localStorage.removeItem("gemiini_sovereign_ga_id");
  localStorage.removeItem("gemiini_sovereign_session");
  const unauthView = document.getElementById("sso-unauth-view");
  const authView = document.getElementById("sso-authenticated-view");
  if (unauthView) unauthView.style.display = "block";
  if (authView) authView.style.display = "none";
  const input = document.getElementById("sso-quick-id");
  if(input) input.value = "";
}
