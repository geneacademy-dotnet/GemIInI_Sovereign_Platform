/**
 * GemIInI Sovereign Platform - Master Backend Engine (Code.gs)
 * Strictly Honest Telemetry: Zero Mock Data, Fail-Closed Locks, Authentic S_rank Calculation
 */

/**
 * Calculates Composite Leaderboard Score (S_rank)
 * S_rank = GP + (CCR * 10) + (Accuracy * 5) + (Streak * 20) + MentorshipBonus
 * Note: Missing or undefined metrics strictly default to 0.
 */
function calculateSovereignScore(gp, ccr, accuracy, streak, mentorshipBonus) {
  const safeGp = Math.max(0, Number(gp) || 0);
  const safeCcr = Math.max(0, Math.min(100, Number(ccr) || 0)); // 0 to 100%
  const safeAcc = Math.max(0, Math.min(100, Number(accuracy) || 0)); // 0 to 100%
  const safeStreak = Math.max(0, Number(streak) || 0); // Days
  const safeBonus = Math.max(0, Number(mentorshipBonus) || 0);

  return Math.round(
    safeGp + 
    (safeCcr * 10) + 
    (safeAcc * 5) + 
    (safeStreak * 20) + 
    safeBonus
  );
}

function jsonResponse(obj, code) {
  code = code || 200;
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function createJsonResponse(obj) {
  return jsonResponse(obj, 200);
}

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action.toLowerCase() : "leaderboard";

    // 1. LEADERBOARD API - Pure Verified Data Only
    if (action === "leaderboard") {
      const scope = (e && e.parameter && e.parameter.scope) ? e.parameter.scope.toLowerCase() : "national";
      const filterVal = (e && e.parameter && e.parameter.filter) ? e.parameter.filter.toLowerCase().trim() : "";
      
      const sheet = ss.getSheetByName("GEMIINI_CLINICAL_TELEMETRY") || ss.getSheetByName("GA_MASTER_REGISTRY") || ss.getSheetByName("Registrations");
      if (!sheet) {
        return createJsonResponse({ status: "success", scope: scope, totalIndexed: 0, items: [] });
      }

      const lastRow = sheet.getLastRow();
      if (lastRow <= 1) {
        return createJsonResponse({ status: "success", scope: scope, totalIndexed: 0, items: [] });
      }

      const maxCols = Math.min(sheet.getLastColumn(), 11);
      const data = sheet.getRange(2, 1, lastRow - 1, maxCols).getValues();
      let rankedList = [];

      for (let i = 0; i < data.length; i++) {
        const gaId = String(data[i][0] || "").trim();
        const name = String(data[i][1] || "").trim();
        
        // Skip completely blank rows
        if (!gaId || !name) continue;

        const role = String(data[i][2] || "Candidate");
        const univ = String(data[i][3] || "Unspecified Faculty");
        const hub = String(data[i][4] || "General");
        const gp = Number(data[i][5]) || 0; // Strict default 0
        const ccr = Number(data[i][6]) || 0; // Strict default 0
        const accuracy = Number(data[i][7]) || 0; // Strict default 0
        const streak = Number(data[i][8]) || 0; // Strict default 0
        const bonus = Number(data[i][9]) || 0; // Strict default 0
        const verified = String(data[i][10]).toUpperCase() === "ACCREDITED" || String(data[i][10]).toUpperCase() === "TRUE";

        if (scope === "regional" && filterVal && !hub.toLowerCase().includes(filterVal)) continue;
        if (scope === "university" && filterVal && !univ.toLowerCase().includes(filterVal)) continue;

        const sRank = calculateSovereignScore(gp, ccr, accuracy, streak, bonus);

        rankedList.push({ gaId, name, role, univ, hub, gp, ccr, accuracy, streak, sRank, verified });
      }

      // Sort descending by Composite Score
      rankedList.sort((a, b) => b.sRank - a.sRank);

      const topRanked = rankedList.slice(0, 100).map((member, index) => ({
        rank: index + 1,
        ...member
      }));

      return createJsonResponse({ status: "success", scope: scope, totalIndexed: rankedList.length, items: topRanked });
    }

    // 2. LOOKUP / VERIFY API
    if (action === "lookup" || action === "verify") {
      const searchId = (e && e.parameter && e.parameter.id) ? e.parameter.id.toUpperCase().trim() : "";
      const sheet = ss.getSheetByName("GA_MASTER_REGISTRY") || ss.getSheetByName("Registrations");
      
      if (!sheet || !searchId) {
        return createJsonResponse({ status: "error", found: false, message: "ID not provided or registry inaccessible" });
      }

      const lastRow = sheet.getLastRow();
      if (lastRow <= 1) {
        return createJsonResponse({ status: "success", found: false, message: "No records in registry" });
      }

      const data = sheet.getRange(2, 1, lastRow - 1, Math.min(sheet.getLastColumn(), 11)).getValues();
      for (let j = 0; j < data.length; j++) {
        const rowId = String(data[j][0]).replace(/[^A-Za-z0-9]/g, "").toUpperCase();
        const cleanSearch = searchId.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
        if (rowId === cleanSearch) {
          return createJsonResponse({
            status: "success",
            found: true,
            member: {
              id: String(data[j][0]),
              name: String(data[j][1]),
              role: String(data[j][2] || "Candidate"),
              univ: String(data[j][3] || "Unspecified Faculty"),
              hub: String(data[j][4] || "General"),
              gp: Number(data[j][5]) || 0,
              ccr: Number(data[j][6]) || 0,
              accuracy: Number(data[j][7]) || 0,
              streak: Number(data[j][8]) || 0,
              verified: String(data[j][10]).toUpperCase() === "ACCREDITED" || String(data[j][10]).toUpperCase() === "TRUE"
            }
          });
        }
      }

      return createJsonResponse({ status: "success", found: false, message: "Member record not found" });
    }

    return createJsonResponse({ status: "success", message: "GemIInI Sovereign Telemetry Ready" });
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return jsonResponse({ status: "error", message: "Server busy. Please retry in a few seconds." }, 503);
  }

  try {
    let body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }

    const fullName = body.full_name || body.fullName || "";
    const phone = body.phone || "";
    const email = body.email || "";
    const workshop = body.workshop || "BLS & CPR Certification";
    const university = body.university || "University of Khartoum";
    const role = body.role || "Clinical Vanguard";
    const paymentMethod = body.payment_method || body.paymentMethod || "vodafone_cash";
    const paymentRef = body.payment_ref || body.paymentRef || "PROVISIONAL_ONBOARDING";
    const attendanceMode = body.attendance_mode || body.attendanceMode || "on_site_cairo";
    const referralSource = body.referral_source || body.referralSource || "DIRECT";

    if (!fullName || !phone || !email) {
      return jsonResponse({ status: "error", message: "Missing required fields." }, 400);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Registrations") || ss.getSheetByName("GA_MASTER_REGISTRY");
    if (!sheet) {
      sheet = createRegistrationSheet(ss);
    }

    const existingGaId = body.existing_ga_id || body.ga_id || body.existingGaId;
    let assignedId = "";
    let isExisting = false;

    if (existingGaId && /^GA-?\d{1,6}$/i.test(existingGaId.trim())) {
      assignedId = existingGaId.trim().toUpperCase();
      if (!assignedId.startsWith("GA-") && assignedId.startsWith("GA")) {
        assignedId = "GA-" + assignedId.substring(2);
      }
      isExisting = true;
    } else {
      assignedId = getNextGaId(ss);
    }

    const timestamp = new Date();
    const gpBalance = 25; // +25 GP Explorer Welcome Bounty

    sheet.appendRow([
      assignedId, fullName, role, university,
      attendanceMode === "online_kuwait" ? "Kuwait / Gulf" : "Cairo Hub",
      gpBalance, 0, 0, 0, 0,
      isExisting ? "ACCREDITED" : "PROVISIONAL",
      phone, email, paymentMethod, paymentRef, timestamp.toISOString(), referralSource
    ]);

    dispatchSignupAlert({
      gaId: assignedId, fullName, phone, email, workshop, paymentMethod, attendanceMode, isExisting
    });

    return jsonResponse({
      status: "success",
      gaId: assignedId,
      fullName: fullName,
      gpBalance: gpBalance,
      message: isExisting ? "Existing member identity attached." : "New GA-ID minted with +25 GP Bounty."
    }, 200);

  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() }, 500);
  } finally {
    lock.releaseLock();
  }
}

function getNextGaId(ss) {
  let metaSheet = ss.getSheetByName("Meta");
  if (!metaSheet) {
    metaSheet = ss.insertSheet("Meta");
    metaSheet.getRange("A1").setValue(1000);
  }
  const currentVal = Number(metaSheet.getRange("A1").getValue()) || 1000;
  const nextVal = currentVal + 1;
  metaSheet.getRange("A1").setValue(nextVal);
  return "GA-" + nextVal;
}

function dispatchSignupAlert(data) {
  try {
    const recipient = "amjadgorashi32@gmail.com";
    const subject = "🚨 GemIInI Registration: " + data.gaId + " - " + data.fullName;
    const body = "New Sovereign Candidate Registered:\n\n" +
      "GA-ID: " + data.gaId + "\n" +
      "Name: " + data.fullName + "\n" +
      "Phone: " + data.phone + "\n" +
      "Email: " + data.email + "\n" +
      "Track: " + data.workshop + "\n" +
      "Payment: " + data.paymentMethod + "\n" +
      "Mode: " + data.attendanceMode + "\n" +
      "Existing: " + (data.isExisting ? "YES" : "NO") + "\n\n" +
      "Timestamp: " + new Date().toISOString();
    MailApp.sendEmail(recipient, subject, body);
  } catch (e) {
    Logger.log("Email telemetry warning: " + e.toString());
  }
}

function createRegistrationSheet(ss) {
  const sheet = ss.insertSheet("Registrations");
  sheet.appendRow([
    "GA_ID", "FULL_NAME", "ROLE", "UNIV", "HUB", "GP", "CCR", "ACCURACY", "STREAK", "MENTORSHIP_BONUS", "STATUS", "PHONE", "EMAIL", "PAYMENT_METHOD", "PAYMENT_REF", "TIMESTAMP", "REFERRAL_SOURCE"
  ]);
  return sheet;
}
