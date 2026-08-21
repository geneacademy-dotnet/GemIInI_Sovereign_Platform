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
    alert("يرجى إدخال رقم المعرف السيادي");
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
      document.getElementById("sso-doctor-name").textContent = data.member.name;
      document.getElementById("sso-doctor-id").textContent = data.member.id;
      document.getElementById("sso-doctor-gp").textContent = data.member.gp.toLocaleString() + " GP";
      document.getElementById("sso-doctor-univ").textContent = data.member.univ;
      
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
    console.error("SSO Error:", err);
    alert("حدث خطأ في الاتصال بالسجل السيادي. تأكد من اتصالك بالإنترنت.");
  } finally {
    input.disabled = false;
  }
}

/**
 * 2. Secure Exam Submission (Graded on Server)
 */
async function checkRawAnswer(selectedOptionIndex, btnElement, bankKey) {
  const gaId = localStorage.getItem("gemiini_sovereign_ga_id");
  if (!gaId) {
    alert("يجب عليك إدخال هويتك السيادية (GA-ID) أولاً لتوثيق نقاطك.");
    return;
  }

  const allBtns = document.querySelectorAll(".raw-opt-btn");
  allBtns.forEach(b => b.disabled = true);
  btnElement.textContent = "جاري التدقيق السيادي...";

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
      btnElement.style.background = "#DCFCE7";
      btnElement.style.borderColor = "#16A34A";
      btnElement.style.color = "#14532D";
      btnElement.textContent = "إجابة صحيحة ✓";
      
      const scoreBadge = document.getElementById("simulator-score-badge");
      if (scoreBadge) scoreBadge.textContent = `تم إضافة +${result.gp_awarded} GP لرصيدك!`;
      
      // Update local UI GP balance instantly
      const currentGp = document.getElementById("sso-doctor-gp");
      if(currentGp) {
         let currentVal = parseInt(currentGp.textContent.replace(/\D/g,'')) || 0;
         currentGp.textContent = (currentVal + result.gp_awarded).toLocaleString() + " GP";
      }

    } else {
      btnElement.style.background = "#FEE2E2";
      btnElement.style.borderColor = "#DC2626";
      btnElement.style.color = "#7F1D1D";
      btnElement.textContent = "إجابة خاطئة ✗";
    }

    // Show clinical explanation (Loaded locally from RAW_BANK_DATA in app.js)
    const expBox = document.getElementById("raw-mtc-explanation");
    const expText = document.getElementById("raw-mtc-text");
    if (expBox && expText && typeof RAW_BANK_DATA !== "undefined") {
      expText.innerHTML = RAW_BANK_DATA[bankKey].explanation;
      expBox.style.display = "block";
    }

  } catch(err) {
    console.error("Exam Submit Error:", err);
    alert("تعذر الاتصال بالخادم المركزي. تأكد من اتصالك بالإنترنت.");
    allBtns.forEach(b => b.disabled = false);
    btnElement.textContent = "أعد المحاولة";
  }
}