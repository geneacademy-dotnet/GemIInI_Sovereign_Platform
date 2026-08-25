/**
 * GemIInI Sovereign Platform - Master Backend Engine (Code.gs)
 * Full-Stack Telemetry Ingestion, Sequential ID Minting, and Verified Real-World SSOT
 */

/**
 * Verified Real-World Seed Registry Baseline
 * Sourced directly from Assessment Results July, Sheet B1.5 SSOT, and Sheet C2 Master Sheet
 */
var VERIFIED_INITIAL_BASELINE = [
  { gaId: "GA-3521", name: "الشريف عمر عثمان", role: "Medical Fellow", univ: "University of Khartoum '21", hub: "Khartoum", gp: 750, ccr: 75, accuracy: 92.5, streak: 12, bonus: 50, verified: true },
  { gaId: "GA-305", name: "Ehssan Isam", role: "BSS Surgical Fellow", univ: "National University (NUSU)", hub: "Khartoum", gp: 750, ccr: 65, accuracy: 88.0, streak: 10, bonus: 50, verified: true },
  { gaId: "GA-3479", name: "Hala Sid Ahmed", role: "USMLE Research Fellow", univ: "University of Khartoum '22", hub: "Khartoum", gp: 500, ccr: 70, accuracy: 86.5, streak: 8, bonus: 0, verified: true },
  { gaId: "GA-2491", name: "تنزيل محمد موسى", role: "Clinical Vanguard", univ: "National University '23", hub: "Khartoum", gp: 500, ccr: 70, accuracy: 84.0, streak: 7, bonus: 0, verified: true },
  { gaId: "GA-3463", name: "Mawada Hatim Awad", role: "Surgical Candidate", univ: "University of Khartoum '23", hub: "Khartoum", gp: 500, ccr: 60, accuracy: 82.0, streak: 6, bonus: 0, verified: true },
  { gaId: "GA-3466", name: "Mohamed Loai Saad", role: "MRCS Trainee", univ: "University of Khartoum '23", hub: "Khartoum", gp: 500, ccr: 60, accuracy: 81.5, streak: 6, bonus: 0, verified: true },
  { gaId: "GA-2980", name: "Rabah Daffalla", role: "BLS & MRCPCH Trainee", univ: "University of Khartoum '22", hub: "Khartoum", gp: 500, ccr: 60, accuracy: 80.0, streak: 5, bonus: 0, verified: true },
  { gaId: "GA-3400", name: "Nusaiba Alnuman", role: "Clinical Candidate", univ: "University of Khartoum '21", hub: "Khartoum", gp: 500, ccr: 60, accuracy: 78.0, streak: 4, bonus: 0, verified: true }
];

/**
 * Calculates Composite Leaderboard Score (S_rank)
 * S_rank = GP + (CCR * 10) + (Accuracy * 5) + (Streak * 20) + MentorshipBonus
 */
function calculateSovereignScore(gp, ccr, accuracy, streak, mentorshipBonus) {
  var safeGp = Math.max(0, Number(gp) || 0);
  var safeCcr = Math.max(0, Math.min(100, Number(ccr) || 0)); // 0 to 100%
  var safeAcc = Math.max(0, Math.min(100, Number(accuracy) || 0)); // 0 to 100%
  var safeStreak = Math.max(0, Number(streak) || 0); // Days
  var safeBonus = Math.max(0, Number(mentorshipBonus) || 0);

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

/**
 * GET Request Handler: Lookup, Verification, and Leaderboard
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action.toLowerCase() : "leaderboard";

    // 1. LEADERBOARD API
    if (action === "leaderboard") {
      var scope = (e && e.parameter && e.parameter.scope) ? e.parameter.scope.toLowerCase() : "national";
      var filterVal = (e && e.parameter && e.parameter.filter) ? e.parameter.filter.toLowerCase().trim() : "";
      
      var sheet = ss.getSheetByName("GEMIINI_CLINICAL_TELEMETRY") || ss.getSheetByName("GA_MASTER_REGISTRY") || ss.getSheetByName("Registrations");
      var rankedList = [];

      if (sheet && sheet.getLastRow() > 1) {
        var lastRow = sheet.getLastRow();
        var maxCols = Math.min(sheet.getLastColumn(), 11);
        var data = sheet.getRange(2, 1, lastRow - 1, maxCols).getValues();

        for (var i = 0; i < data.length; i++) {
          var gaId = String(data[i][0] || "").trim();
          var name = String(data[i][1] || "").trim();
          if (!gaId || !name) continue;

          var role = String(data[i][2] || "Candidate");
          var univ = String(data[i][3] || "University of Khartoum");
          var hub = String(data[i][4] || "Cairo / Khartoum");
          var gp = Number(data[i][5]) || 0;
          var ccr = Number(data[i][6]) || 0;
          var accuracy = Number(data[i][7]) || 0;
          var streak = Number(data[i][8]) || 0;
          var bonus = Number(data[i][9]) || 0;
          var verified = String(data[i][10]).toUpperCase() === "ACCREDITED" || String(data[i][10]).toUpperCase() === "TRUE";

          if (scope === "regional" && filterVal && !hub.toLowerCase().includes(filterVal)) continue;
          if (scope === "university" && filterVal && !univ.toLowerCase().includes(filterVal)) continue;

          var sRank = calculateSovereignScore(gp, ccr, accuracy, streak, bonus);

          rankedList.push({ gaId: gaId, name: name, role: role, univ: univ, hub: hub, gp: gp, ccr: ccr, accuracy: accuracy, streak: streak, sRank: sRank, verified: verified });
        }
      }

      // If sheet is empty or has fewer records, merge with verified real-world baseline
      if (rankedList.length === 0) {
        for (var k = 0; k < VERIFIED_INITIAL_BASELINE.length; k++) {
          var base = VERIFIED_INITIAL_BASELINE[k];
          var baseRank = calculateSovereignScore(base.gp, base.ccr, base.accuracy, base.streak, base.bonus);
          rankedList.push({
            gaId: base.gaId,
            name: base.name,
            role: base.role,
            univ: base.univ,
            hub: base.hub,
            gp: base.gp,
            ccr: base.ccr,
            accuracy: base.accuracy,
            streak: base.streak,
            sRank: baseRank,
            verified: base.verified
          });
        }
      }

      rankedList.sort(function(a, b) { return b.sRank - a.sRank; });

      var topRanked = rankedList.slice(0, 100).map(function(member, index) {
        return {
          rank: index + 1,
          gaId: member.gaId,
          name: member.name,
          role: member.role,
          univ: member.univ,
          hub: member.hub,
          gp: member.gp,
          ccr: member.ccr,
          accuracy: member.accuracy,
          streak: member.streak,
          sRank: member.sRank,
          verified: member.verified
        };
      });

      return createJsonResponse({ status: "success", scope: scope, totalIndexed: rankedList.length, items: topRanked });
    }

    // 2. LOOKUP / VERIFY API
    if (action === "lookup" || action === "verify") {
      var searchId = (e && e.parameter && e.parameter.id) ? e.parameter.id.toUpperCase().trim() : "";
      var cleanSearch = searchId.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

      // Check verified real baseline first for instant response
      for (var b = 0; b < VERIFIED_INITIAL_BASELINE.length; b++) {
        var baseItem = VERIFIED_INITIAL_BASELINE[b];
        if (baseItem.gaId.replace(/[^A-Za-z0-9]/g, "").toUpperCase() === cleanSearch) {
          return createJsonResponse({
            status: "success",
            found: true,
            member: {
              id: baseItem.gaId,
              name: baseItem.name,
              role: baseItem.role,
              univ: baseItem.univ,
              hub: baseItem.hub,
              gp: baseItem.gp,
              ccr: baseItem.ccr,
              accuracy: baseItem.accuracy,
              streak: baseItem.streak,
              verified: baseItem.verified,
              level2Unlocked: true
            }
          });
        }
      }

      var sheet = ss.getSheetByName("GA_MASTER_REGISTRY") || ss.getSheetByName("Registrations");
      if (sheet && sheet.getLastRow() > 1) {
        var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, Math.min(sheet.getLastColumn(), 11)).getValues();
        for (var j = 0; j < data.length; j++) {
          var rowId = String(data[j][0]).replace(/[^A-Za-z0-9]/g, "").toUpperCase();
          if (rowId === cleanSearch) {
            return createJsonResponse({
              status: "success",
              found: true,
              member: {
                id: String(data[j][0]),
                name: String(data[j][1]),
                role: String(data[j][2] || "Candidate"),
                univ: String(data[j][3] || "University of Khartoum"),
                hub: String(data[j][4] || "Cairo / Khartoum"),
                gp: Number(data[j][5]) || 0,
                ccr: Number(data[j][6]) || 0,
                accuracy: Number(data[j][7]) || 0,
                streak: Number(data[j][8]) || 0,
                verified: String(data[j][10]).toUpperCase() === "ACCREDITED" || String(data[j][10]).toUpperCase() === "TRUE",
                level2Unlocked: (Number(data[j][7]) || 0) >= 70
              }
            });
          }
        }
      }

      return createJsonResponse({ status: "success", found: false, message: "Member record not found" });
    }

    return createJsonResponse({ status: "success", message: "GemIInI Sovereign Telemetry Ready" });
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * POST Request Handler: Registration and Live Telemetry Ingestion
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return jsonResponse({ status: "error", message: "Server busy. Please retry in a few seconds." }, 503);
  }

  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }

    var action = (body.action || "").toLowerCase();

    // 1. LIVE TELEMETRY LOGGING (MTC Simulation Attempt)
    if (action === "log_telemetry" || action === "log_clinical_attempt") {
      var candidateGaId = String(body.ga_id || body.gaId || "").trim().toUpperCase();
      var moduleId = String(body.module_id || body.moduleId || "MTC-101");
      var score = Number(body.score) || 0; // 0 to 100
      var passed = Boolean(body.passed || score >= 70);
      var awardedGp = passed ? 10 : 2; // +10 GP for pass, +2 GP effort bonus

      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var telSheet = ss.getSheetByName("GEMIINI_CLINICAL_TELEMETRY");
      if (!telSheet) {
        telSheet = ss.insertSheet("GEMIINI_CLINICAL_TELEMETRY");
        telSheet.appendRow(["GA_ID", "FULL_NAME", "ROLE", "UNIV", "HUB", "GP", "CCR", "ACCURACY", "STREAK", "BONUS", "STATUS", "LAST_MODULE", "TIMESTAMP"]);
      }

      var now = new Date().toISOString();
      telSheet.appendRow([
        candidateGaId,
        body.full_name || body.fullName || "Candidate",
        "Clinical Vanguard",
        body.university || "University of Khartoum",
        "Cairo / Khartoum",
        awardedGp,
        passed ? 75 : 50,
        score,
        1,
        0,
        passed ? "ACCREDITED" : "IN_TRAINING",
        moduleId,
        now
      ]);

      return jsonResponse({
        status: "success",
        gaId: candidateGaId,
        moduleId: moduleId,
        score: score,
        passed: passed,
        awardedGp: awardedGp,
        level2Unlocked: passed,
        message: "Clinical telemetry ingested successfully under LockService."
      }, 200);
    }

    // 2. STANDARD REGISTRATION & SEQUENTIAL ID MINTING
    var fullName = body.full_name || body.fullName || "";
    var phone = body.phone || "";
    var email = body.email || "";
    var workshop = body.workshop || "BLS & CPR Certification";
    var university = body.university || "University of Khartoum";
    var role = body.role || "Clinical Vanguard";
    var paymentMethod = body.payment_method || body.paymentMethod || "vodafone_cash";
    var paymentRef = body.payment_ref || body.paymentRef || "PROVISIONAL_ONBOARDING";
    var attendanceMode = body.attendance_mode || body.attendanceMode || "on_site_cairo";
    var referralSource = body.referral_source || body.referralSource || "DIRECT";

    if (!fullName || !phone || !email) {
      return jsonResponse({ status: "error", message: "Missing required fields." }, 400);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Registrations") || ss.getSheetByName("GA_MASTER_REGISTRY");
    if (!sheet) {
      sheet = createRegistrationSheet(ss);
    }

    var existingGaId = body.existing_ga_id || body.ga_id || body.existingGaId;
    var assignedId = "";
    var isExisting = false;

    if (existingGaId && /^GA-?\d{1,6}$/i.test(existingGaId.trim())) {
      assignedId = existingGaId.trim().toUpperCase();
      if (!assignedId.startsWith("GA-") && assignedId.startsWith("GA")) {
        assignedId = "GA-" + assignedId.substring(2);
      }
      isExisting = true;
    } else {
      assignedId = getNextGaId(ss);
    }

    var timestamp = new Date();
    var gpBalance = 25; // +25 GP Welcome Explorer Bounty

    sheet.appendRow([
      assignedId, fullName, role, university,
      attendanceMode === "online_kuwait" ? "Kuwait / Gulf" : "Cairo Hub",
      gpBalance, 0, 0, 0, 0,
      isExisting ? "ACCREDITED" : "PROVISIONAL",
      phone, email, paymentMethod, paymentRef, timestamp.toISOString(), referralSource
    ]);

    dispatchSignupAlert({
      gaId: assignedId, fullName: fullName, phone: phone, email: email, workshop: workshop, paymentMethod: paymentMethod, attendanceMode: attendanceMode, isExisting: isExisting
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
  var metaSheet = ss.getSheetByName("Meta");
  if (!metaSheet) {
    metaSheet = ss.insertSheet("Meta");
    metaSheet.getRange("A1").setValue(3550);
  }
  var currentVal = Number(metaSheet.getRange("A1").getValue()) || 3550;
  var nextVal = currentVal + 1;
  metaSheet.getRange("A1").setValue(nextVal);
  return "GA-" + nextVal;
}

function dispatchSignupAlert(data) {
  try {
    var recipient = "amjadgorashi32@gmail.com";
    var subject = "🚨 GemIInI Registration: " + data.gaId + " - " + data.fullName;
    var body = "New Sovereign Candidate Registered:\n\n" +
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
  var sheet = ss.insertSheet("Registrations");
  sheet.appendRow([
    "GA_ID", "FULL_NAME", "ROLE", "UNIV", "HUB", "GP", "CCR", "ACCURACY", "STREAK", "MENTORSHIP_BONUS", "STATUS", "PHONE", "EMAIL", "PAYMENT_METHOD", "PAYMENT_REF", "TIMESTAMP", "REFERRAL_SOURCE"
  ]);
  return sheet;
}
