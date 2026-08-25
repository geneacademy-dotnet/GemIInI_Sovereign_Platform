/**
 * GemIInI Sovereign Platform - Master Backend Engine (Code.gs)
 * Incorporating: Sequential ID Minting, Fail-Closed Locks, S_rank Scoring, and Multi-View Leaderboard
 */

/**
 * Calculates Composite Leaderboard Score (S_rank)
 * S_rank = GP + (CCR * 10) + (Accuracy * 5) + (Streak * 20) + MentorshipBonus
 */
function calculateSovereignScore(gp, ccr, accuracy, streak, mentorshipBonus) {
  var safeGp = Number(gp) || 0;
  var safeCcr = Number(ccr) || 0; // 0 to 100
  var safeAcc = Number(accuracy) || 0; // 0 to 100
  var safeStreak = Number(streak) || 0; // Days
  var safeBonus = Number(mentorshipBonus) || 0;

  return Math.round(
    safeGp + 
    (safeCcr * 10) + 
    (safeAcc * 5) + 
    (safeStreak * 20) + 
    safeBonus
  );
}

/**
 * Helper to build standard JSON response with CORS headers
 */
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

    // 1. LEADERBOARD HANDLER
    if (action === "leaderboard") {
      var scope = (e && e.parameter && e.parameter.scope) ? e.parameter.scope.toLowerCase() : "national"; // 'national' | 'regional' | 'university' | 'track'
      var filterVal = (e && e.parameter && e.parameter.filter) ? e.parameter.filter.toLowerCase().trim() : "";
      
      var sheet = ss.getSheetByName("GEMIINI_CLINICAL_TELEMETRY") || ss.getSheetByName("GA_MASTER_REGISTRY") || ss.getSheetByName("Registrations") || ss.getSheets()[0];
      var lastRow = sheet.getLastRow();
      
      if (lastRow <= 1) {
        return createJsonResponse({ status: "success", scope: scope, totalIndexed: 0, items: [] });
      }

      // Read columns: [GA_ID, FULL_NAME, ROLE, UNIV, HUB, GP, CCR, ACCURACY, STREAK, MENTORSHIP_BONUS, VERIFIED]
      var maxCols = Math.min(sheet.getLastColumn(), 11);
      var data = sheet.getRange(2, 1, lastRow - 1, maxCols).getValues();
      var rankedList = [];

      for (var i = 0; i < data.length; i++) {
        var gaId = String(data[i][0] || ("GA-" + (1000 + i)));
        var name = String(data[i][1] || "Clinical Vanguard");
        var role = String(data[i][2] || "Medical Fellow");
        var univ = String(data[i][3] || "University of Khartoum");
        var hub = String(data[i][4] || "Cairo / Khartoum");
        var gp = Number(data[i][5]) || 25;
        var ccr = Number(data[i][6]) || 80;
        var accuracy = Number(data[i][7]) || 90;
        var streak = Number(data[i][8]) || 14;
        var bonus = Number(data[i][9]) || 0;
        var verified = String(data[i][10]).toUpperCase() === "ACCREDITED" || String(data[i][10]).toUpperCase() === "TRUE";

        // Filtering by scope
        if (scope === "regional" && filterVal && !hub.toLowerCase().includes(filterVal)) continue;
        if (scope === "university" && filterVal && !univ.toLowerCase().includes(filterVal)) continue;

        var sRank = calculateSovereignScore(gp, ccr, accuracy, streak, bonus);

        rankedList.push({
          gaId: gaId,
          name: name,
          role: role,
          univ: univ,
          hub: hub,
          gp: gp,
          ccr: ccr,
          accuracy: accuracy,
          streak: streak,
          sRank: sRank,
          verified: verified
        });
      }

      // Sort descending by Composite Score (S_rank)
      rankedList.sort(function(a, b) { return b.sRank - a.sRank; });

      // Attach rank position
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

      return createJsonResponse({
        status: "success",
        scope: scope,
        totalIndexed: rankedList.length,
        items: topRanked
      });
    }

    // 2. LOOKUP / VERIFY HANDLER
    if (action === "lookup" || action === "verify") {
      var searchId = (e && e.parameter && e.parameter.id) ? e.parameter.id.toUpperCase().trim() : "";
      var sheet = ss.getSheetByName("GA_MASTER_REGISTRY") || ss.getSheetByName("Registrations") || ss.getSheets()[0];
      var lastRow = sheet.getLastRow();
      
      if (!searchId || lastRow <= 1) {
        return createJsonResponse({ status: "error", found: false, message: "ID not provided or sheet empty" });
      }

      var data = sheet.getRange(2, 1, lastRow - 1, Math.min(sheet.getLastColumn(), 11)).getValues();
      for (var j = 0; j < data.length; j++) {
        var rowId = String(data[j][0]).replace(/[^A-Za-z0-9]/g, "").toUpperCase();
        var cleanSearch = searchId.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
        if (rowId === cleanSearch) {
          return createJsonResponse({
            status: "success",
            found: true,
            member: {
              id: String(data[j][0]),
              name: String(data[j][1]),
              role: String(data[j][2] || "Clinical Vanguard"),
              univ: String(data[j][3] || "University of Khartoum"),
              hub: String(data[j][4] || "Cairo / Khartoum"),
              gp: Number(data[j][5]) || 25,
              ccr: Number(data[j][6]) || 80,
              accuracy: Number(data[j][7]) || 90,
              streak: Number(data[j][8]) || 14,
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

/**
 * POST Request Handler: Registration and Sequential GA-ID Minting
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return jsonResponse({
      status: "error",
      message: "Server is busy processing transactions. Please retry in a few seconds."
    }, 503);
  }

  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }

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
      return jsonResponse({
        status: "error",
        message: "Missing required fields: full_name, phone, and email are required."
      }, 400);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Registrations") || ss.getSheetByName("GA_MASTER_REGISTRY");
    if (!sheet) {
      sheet = createRegistrationSheet(ss);
    }

    // Check for existing GA-ID
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
    var gpBalance = 25; // 25 GP Welcome Explorer Bounty

    sheet.appendRow([
      assignedId,
      fullName,
      role,
      university,
      attendanceMode === "online_kuwait" ? "Kuwait / Gulf" : "Cairo Hub",
      gpBalance,
      0, // CCR
      0, // Accuracy
      1, // Streak
      0, // Bonus
      isExisting ? "ACCREDITED" : "PROVISIONAL",
      phone,
      email,
      paymentMethod,
      paymentRef,
      timestamp.toISOString(),
      referralSource
    ]);

    // Send real-time telemetry alert
    dispatchSignupAlert({
      gaId: assignedId,
      fullName: fullName,
      phone: phone,
      email: email,
      workshop: workshop,
      paymentMethod: paymentMethod,
      attendanceMode: attendanceMode,
      isExisting: isExisting
    });

    return jsonResponse({
      status: "success",
      gaId: assignedId,
      fullName: fullName,
      gpBalance: gpBalance,
      message: isExisting 
        ? "Existing member identity attached successfully." 
        : "New GA-ID minted successfully with +25 GP Explorer Bounty."
    }, 200);

  } catch (err) {
    return jsonResponse({
      status: "error",
      message: "Internal execution failure: " + err.toString()
    }, 500);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Sequential GA-ID Generator (Uses Meta!A1)
 */
function getNextGaId(ss) {
  var metaSheet = ss.getSheetByName("Meta");
  if (!metaSheet) {
    metaSheet = ss.insertSheet("Meta");
    metaSheet.getRange("A1").setValue(1000);
  }
  
  var currentVal = Number(metaSheet.getRange("A1").getValue()) || 1000;
  var nextVal = currentVal + 1;
  metaSheet.getRange("A1").setValue(nextVal);
  return "GA-" + nextVal;
}

/**
 * Real-time Telemetry Dispatch
 */
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
      "Existing Member: " + (data.isExisting ? "YES" : "NO") + "\n\n" +
      "Timestamp: " + new Date().toISOString();
      
    MailApp.sendEmail(recipient, subject, body);
  } catch (e) {
    Logger.log("Email telemetry warning: " + e.toString());
  }
}

/**
 * Helper to initialize sheet schema if missing
 */
function createRegistrationSheet(ss) {
  var sheet = ss.insertSheet("Registrations");
  sheet.appendRow([
    "GA_ID", "FULL_NAME", "ROLE", "UNIV", "HUB", "GP", "CCR", "ACCURACY", "STREAK", "MENTORSHIP_BONUS", "STATUS", "PHONE", "EMAIL", "PAYMENT_METHOD", "PAYMENT_REF", "TIMESTAMP", "REFERRAL_SOURCE"
  ]);
  return sheet;
}
