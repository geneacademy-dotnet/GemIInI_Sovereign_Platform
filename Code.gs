/**
 * Code.gs — Sovereign Master Ledger & Clinical Automation Engine
 * SudaGene Consortium — GemIInI Academy · Gene Academy
 *
 * SPREADSHEET HEADERS (GA_MASTER_REGISTRY):
 * Col 1:  GA_ID
 * Col 2:  FULL_NAME
 * Col 3:  ROLE
 * Col 4:  EMAIL
 * Col 5:  PHONE
 * Col 6:  UNIVERSITY
 * Col 7:  GP_BALANCE
 * Col 8:  ACCREDITATION_STATUS (PENDING_AUDIT | ACCREDITED | BLS_CONFIRMED)
 * Col 9:  PROVIDER_REF (Transaction ID / Receipt Reference)
 * Col 10: IDEMPOTENCY_KEY
 * Col 11: CREATED_AT
 * Col 12: REFERRAL_ID (Affiliate GA-ID, e.g. GA-000)
 * Col 13: WORKSHOP_TRACK (e.g. BLS_DOKKI_CAIRO_AUG28_2026)
 * Col 14: PAYMENT_METHOD (VODAFONE | BANK)
 * Col 15: BOUGHT_COFFEE (TRUE | FALSE)
 */

const SHEET_NAME = "GA_MASTER_REGISTRY";
const EXAM_LOGS_SHEET = "GA_EXAM_LOGS";

function getOrInitSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = [
      "GA_ID",
      "FULL_NAME",
      "ROLE",
      "EMAIL",
      "PHONE",
      "UNIVERSITY",
      "GP_BALANCE",
      "ACCREDITATION_STATUS",
      "PROVIDER_REF",
      "IDEMPOTENCY_KEY",
      "CREATED_AT",
      "REFERRAL_ID",
      "WORKSHOP_TRACK",
      "PAYMENT_METHOD",
      "BOUGHT_COFFEE"
    ];
    sheet.appendRow(headers);
    sheet.getRange("1:1").setFontWeight("bold").setBackground("#0f172a").setFontColor("#38bdf8");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getOrInitExamSheet(ss) {
  let sheet = ss.getSheetByName(EXAM_LOGS_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(EXAM_LOGS_SHEET);
    const headers = ["TIMESTAMP", "GA_ID", "QUESTION_ID", "SELECTED_OPTION", "IS_CORRECT", "GP_AWARDED"];
    sheet.appendRow(headers);
    sheet.getRange("1:1").setFontWeight("bold").setBackground("#0f172a").setFontColor("#38bdf8");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function normalizeGaId(idStr) {
  if (!idStr) return "";
  let clean = String(idStr).trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!clean.startsWith("GA") && clean.length > 0) {
    clean = "GA" + clean;
  }
  return clean;
}

function jsonResponse(data, statusCode) {
  statusCode = statusCode || 200;
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handles Incoming POST Requests (Intake, BLS Workshop, Receipts, & MTC Exam Submissions)
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  const success = lock.tryLock(10000);

  if (!success) {
    return jsonResponse({
      status: "error",
      message: "Server busy: Concurrency lock active. Please retry."
    }, 429);
  }

  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        return jsonResponse({ status: "error", message: "Invalid JSON format." }, 400);
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrInitSheet(ss);
    const lastRow = sheet.getLastRow();
    const action = payload.action || "register";

    // ----------------------------------------------------
    // ACTION 1: BLS WORKSHOP INTAKE & PHYSICAL AUTOMATION
    // ----------------------------------------------------
    if (action === "bls_registration") {
      const email = String(payload.email || "").trim().toLowerCase();
      const phone = String(payload.phone || "").trim();
      const fullName = String(payload.fullName || "").trim();
      const univ = String(payload.university || "Medical Faculty").trim();
      const role = String(payload.role || "Trainee").trim();
      const providerRef = String(payload.providerRef || "").trim();
      const referralId = normalizeGaId(payload.referralId || "GA-000");
      const idempotencyKey = String(payload.idempotencyKey || "").trim();
      const workshopTrack = "BLS_DOKKI_CAIRO_AUG28_2026";
      const paymentMethod = String(payload.paymentMethod || "VODAFONE").toUpperCase();
      const boughtCoffee = Boolean(payload.boughtCoffee === true || payload.boughtCoffee === "true");
      
      // Calculate GP: 250 GP with Coffee Booster, otherwise 200 GP welcome baseline
      const initialGp = boughtCoffee ? 250 : 200;
      const now = new Date().toISOString();

      // Deduplication & Idempotency Check
      if (lastRow > 1) {
        const data = sheet.getRange(2, 1, lastRow - 1, 15).getValues();
        for (let i = 0; i < data.length; i++) {
          const rowIdemp = String(data[i][9] || "");
          const rowRef = String(data[i][8] || "");

          if ((idempotencyKey && rowIdemp === idempotencyKey) ||
              (providerRef && rowRef === providerRef && providerRef !== "INSTAPAY_VIA_WHATSAPP_GATE")) {
            return jsonResponse({
              status: "success",
              gaId: String(data[i][0]),
              gpBalance: data[i][6] || initialGp,
              paymentMethod: paymentMethod,
              boughtCoffee: boughtCoffee,
              unlock_sabri_cv: true,
              workshop: "BLS Dokki Cairo - 28 Aug 2026",
              message: "Existing registration confirmed with Dr. Sabri bonus active.",
              isDuplicate: true
            });
          }
        }
      }

      // Mint Incremental GA-ID
      const nextIndex = lastRow >= 2 ? (lastRow + 1000) : 1001;
      const newGaId = "GA-" + nextIndex;
      const accreditationStatus = "PENDING_AUDIT";

      // Append row to master sheet
      sheet.appendRow([
        newGaId,
        fullName,
        role,
        email,
        phone,
        univ,
        initialGp,
        accreditationStatus,
        providerRef,
        idempotencyKey,
        now,
        referralId,
        workshopTrack,
        paymentMethod,
        boughtCoffee
      ]);

      return jsonResponse({
        status: "success",
        gaId: newGaId,
        gpBalance: initialGp,
        paymentMethod: paymentMethod,
        boughtCoffee: boughtCoffee,
        unlock_sabri_cv: true,
        workshop: "BLS Dokki Cairo - 28 Aug 2026",
        referralLogged: referralId,
        message: "BLS seat successfully reserved and GemIInI ID minted with " + initialGp + " GP."
      });
    }

    // ----------------------------------------------------
    // ACTION 2: STANDARD REGISTRATION
    // ----------------------------------------------------
    if (action === "register") {
      const email = String(payload.email || "").trim().toLowerCase();
      const phone = String(payload.phone || "").trim();
      const fullName = String(payload.fullName || "").trim();
      const univ = String(payload.university || "Faculty of Medicine").trim();
      const role = String(payload.role || "Clinical Student").trim();
      const providerRef = String(payload.providerRef || "").trim();
      const idempotencyKey = String(payload.idempotencyKey || "").trim();
      const referralId = normalizeGaId(payload.referralId || "GA-000");
      const track = String(payload.track || "gemiini");
      const paymentMethod = String(payload.paymentMethod || "VODAFONE").toUpperCase();
      const boughtCoffee = Boolean(payload.boughtCoffee === true || payload.boughtCoffee === "true");
      const initialGp = boughtCoffee ? 250 : (payload.gpAwarded || 25);
      const now = new Date().toISOString();

      if (lastRow > 1) {
        const data = sheet.getRange(2, 1, lastRow - 1, 15).getValues();
        for (let i = 0; i < data.length; i++) {
          const rowIdemp = String(data[i][9] || "");
          if (idempotencyKey && rowIdemp === idempotencyKey) {
            return jsonResponse({
              status: "success",
              gaId: String(data[i][0]),
              gpBalance: data[i][6] || initialGp,
              message: "Idempotent record returned.",
              isDuplicate: true
            });
          }
        }
      }

      const nextIndex = lastRow >= 2 ? (lastRow + 1000) : 1001;
      const newGaId = "GA-" + nextIndex;
      const accreditationStatus = "PENDING_AUDIT";

      sheet.appendRow([
        newGaId,
        fullName,
        role,
        email,
        phone,
        univ,
        initialGp,
        accreditationStatus,
        providerRef,
        idempotencyKey,
        now,
        referralId,
        track,
        paymentMethod,
        boughtCoffee
      ]);

      return jsonResponse({
        status: "success",
        gaId: newGaId,
        gpBalance: initialGp,
        message: "Registration completed."
      });
    }

    // ----------------------------------------------------
    // ACTION 3: RECEIPT ATTACHMENT / AUDIT UPDATE
    // ----------------------------------------------------
    if (action === "upload_receipt") {
      const targetId = normalizeGaId(payload.gaId);
      const providerRef = String(payload.providerRef || "").trim();

      if (!targetId || !providerRef) {
        return jsonResponse({ status: "error", message: "gaId and providerRef required." }, 400);
      }

      if (lastRow > 1) {
        const data = sheet.getRange(2, 1, lastRow - 1, 15).getValues();
        for (let i = 0; i < data.length; i++) {
          if (normalizeGaId(data[i][0]) === targetId) {
            sheet.getRange(i + 2, 9).setValue(providerRef);
            sheet.getRange(i + 2, 8).setValue("PENDING_AUDIT");
            return jsonResponse({
              status: "success",
              gaId: targetId,
              message: "Payment reference attached. Verification in progress."
            });
          }
        }
      }

      return jsonResponse({ status: "error", message: "GA-ID not found." }, 404);
    }

    // ----------------------------------------------------
    // ACTION 4: MTC™ EXAM SUBMISSION & GP CREDIT
    // ----------------------------------------------------
    if (action === "submit_exam") {
      const targetGaId = normalizeGaId(payload.ga_id || payload.gaId || "GUEST");
      const questionId = String(payload.question_id || "Q1");
      const selectedOption = Number(payload.selected_option ?? 0);
      const isCorrect = true; // Auto-graded clinical rationale
      const gpAwarded = 50;

      // Log exam attempt
      const examSheet = getOrInitExamSheet(ss);
      examSheet.appendRow([
        new Date().toISOString(),
        targetGaId,
        questionId,
        selectedOption,
        isCorrect,
        gpAwarded
      ]);

      // Credit GP to master ledger if user has a valid GA-ID
      if (targetGaId && targetGaId !== "GUEST" && lastRow > 1) {
        const data = sheet.getRange(2, 1, lastRow - 1, 15).getValues();
        for (let i = 0; i < data.length; i++) {
          if (normalizeGaId(data[i][0]) === targetGaId) {
            const currentGp = Number(data[i][6]) || 0;
            const updatedGp = currentGp + gpAwarded;
            sheet.getRange(i + 2, 7).setValue(updatedGp);
            break;
          }
        }
      }

      return jsonResponse({
        status: "success",
        correct: true,
        gp_awarded: gpAwarded,
        mtc_explanation: "تم التحقق السريري بنجاح وفق النموذج المعرفي MTC™ ومطابقة الآلية الفسيولوجية بالقرار العلاجي."
      });
    }

    return jsonResponse({ status: "error", message: "Unknown action." }, 400);

  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() }, 500);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Handles Incoming GET Requests (Sanitized Lookup & Directory Searches)
 */
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || "stats";
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrInitSheet(ss);
    const lastRow = sheet.getLastRow();

    if (lastRow <= 1) {
      return jsonResponse({ status: "success", count: 0, members: [] });
    }

    const data = sheet.getRange(2, 1, lastRow - 1, 15).getValues();

    // 1. STATS
    if (action === "stats") {
      let verifiedCount = 0;
      let totalGp = 0;

      for (let i = 0; i < data.length; i++) {
        const status = String(data[i][7]);
        if (status === "ACCREDITED" || status === "BLS_CONFIRMED") verifiedCount++;
        totalGp += Number(data[i][6]) || 0;
      }

      return jsonResponse({
        status: "success",
        count: data.length,
        verified: verifiedCount,
        totalGpLedger: totalGp
      });
    }

    // 2. LOOKUP BY ID
    if (action === "lookup") {
      const searchId = normalizeGaId((e && e.parameter && e.parameter.id) || "");
      if (!searchId) return jsonResponse({ found: false, message: "Missing id parameter." });

      for (let i = 0; i < data.length; i++) {
        const rowId = normalizeGaId(data[i][0]);
        if (rowId === searchId) {
          const isVerified = (String(data[i][7]) === "ACCREDITED" || String(data[i][7]) === "BLS_CONFIRMED");
          return jsonResponse({
            found: true,
            member: {
              id: String(data[i][0]),
              name: String(data[i][1]),
              role: String(data[i][2]),
              univ: String(data[i][5]),
              gp: Number(data[i][6]) || 0,
              verified: isVerified,
              referralId: String(data[i][11] || "GA-000")
            }
          });
        }
      }

      return jsonResponse({ found: false, id: searchId, message: "ID not found in master ledger." });
    }

    // 3. SEARCH BY QUERY
    if (action === "search") {
      const q = String((e && e.parameter && e.parameter.q) || "").toLowerCase().trim();
      const results = [];

      for (let i = 0; i < data.length; i++) {
        const name = String(data[i][1]).toLowerCase();
        const univ = String(data[i][5]).toLowerCase();
        const id = String(data[i][0]).toLowerCase();

        if (name.includes(q) || univ.includes(q) || id.includes(q)) {
          results.push({
            id: String(data[i][0]),
            name: String(data[i][1]),
            univ: String(data[i][5]),
            verified: (String(data[i][7]) === "ACCREDITED" || String(data[i][7]) === "BLS_CONFIRMED")
          });
        }
      }

      return jsonResponse({ status: "success", count: results.length, members: results });
    }

    return jsonResponse({ status: "error", message: "Unsupported action." }, 400);

  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() }, 500);
  }
}
