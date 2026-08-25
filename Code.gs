/**
 * Code.gs — GemIInI Academy Master Backend (Google Apps Script)
 * SudaGene Consortium · GemIInI Academy
 *
 * Provides concurrency-locked auto-minting for GA-ID sequential credentials,
 * public verification lookup, and exam/registry integration.
 */

const SPREADSHEET_ID = "1g8V2fJqgZ0Uj0x9s9Z3j5k7l8m9n0p1q2r3s4t5u6v"; // Default active active spreadsheet or active sheet
const MASTER_SHEET_NAME = "GA_MASTER_REGISTRY";
const EXAM_SHEET_NAME = "GA_EXAM_SUBMISSIONS";

function getMasterSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(MASTER_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(MASTER_SHEET_NAME);
    // Ensure standard 15-column schema header
    sheet.appendRow([
      "TIMESTAMP",
      "GA_ID",
      "FULL_NAME",
      "EMAIL",
      "PHONE",
      "UNIVERSITY",
      "ROLE",
      "TRACK",
      "PAYMENT_METHOD",
      "PROVIDER_REF",
      "BOUGHT_COFFEE",
      "GP_BALANCE",
      "STATUS",
      "REFERRAL_ID",
      "IDEMPOTENCY_KEY"
    ]);
  }
  return sheet;
}

function normalizeGaId(rawId) {
  if (!rawId) return "GA-000";
  const str = String(rawId).trim().toUpperCase();
  if (str.startsWith("GA-")) return str;
  if (str.startsWith("GA")) return "GA-" + str.substring(2);
  return "GA-" + str;
}

/**
 * Handles HTTP GET: Public ID Verification Lookup
 * Usage: https://script.google.com/.../exec?action=lookup&id=GA-1001
 */
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "lookup";
  const searchId = (e && e.parameter && e.parameter.id) ? normalizeGaId(e.parameter.id) : "";

  if (action === "lookup" && searchId) {
    const sheet = getMasterSheet();
    const data = sheet.getDataRange().getValues();
    
    // Search GA_ID column (index 1)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rowGaId = normalizeGaId(row[1]);
      if (rowGaId === searchId) {
        const result = {
          found: true,
          member: {
            id: rowGaId,
            gaId: rowGaId,
            fullName: row[2],
            name: row[2],
            email: row[3],
            phone: row[4],
            university: row[5],
            role: row[6],
            track: row[7],
            gpBalance: row[11],
            gp: row[11],
            status: row[12],
            verified: true
          }
        };
        return ContentService.createTextOutput(JSON.stringify(result))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ found: false, message: "ID not found in master ledger" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ status: "alive", system: "GemIInI Master Ledger API" }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handles HTTP POST: Registration Intake & Exam Grading
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // 10-second concurrency lock to guarantee sequential GA-ID minting

    let payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    }

    const action = String(payload.action || "bls_registration").toLowerCase();

    // =========================================================================
    // 1. BLS WORKSHOP INTAKE & GA-ID MINTING
    // =========================================================================
    if (action === "bls_registration" || action === "bls_register") {
      const sheet = getMasterSheet();
      const data = sheet.getDataRange().getValues();

      const email = String(payload.email || "").trim().toLowerCase();
      const phone = String(payload.phone || "").trim();
      const fullName = String(payload.fullName || payload.full_name || "").trim();
      const univ = String(payload.university || payload.univ || "Medical Faculty").trim();
      const role = String(payload.role || "Trainee").trim();
      const providerRef = String(payload.providerRef || payload.provider_ref || "").trim();
      const referralId = normalizeGaId(payload.referralId || payload.referral_id || payload.ref || "GA-000");
      const idempotencyKey = String(payload.idempotencyKey || payload.idempotency_key || "").trim();
      const workshopTrack = "BLS_DOKKI_CAIRO_AUG28_2026";
      const paymentMethod = String(payload.paymentMethod || payload.payment_method || "VODAFONE").toUpperCase();
      const boughtCoffee = Boolean(
        payload.boughtCoffee === true || payload.boughtCoffee === "true" ||
        payload.bought_coffee === true || payload.bought_coffee === "true" ||
        payload.coffee === true || payload.coffee === "true"
      );

      if (!fullName || !email || !phone) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "error",
          message: "Missing required fields: fullName, email, or phone"
        })).setMimeType(ContentService.MimeType.JSON);
      }

      // Check Idempotency & Duplicate Provider Ref
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (idempotencyKey && row[14] === idempotencyKey) {
          return ContentService.createTextOutput(JSON.stringify({
            status: "success",
            gaId: row[1],
            gpBalance: row[11],
            message: "Idempotent record returned",
            isDuplicate: true
          })).setMimeType(ContentService.MimeType.JSON);
        }
        if (providerRef && row[9] === providerRef && providerRef !== "CASH") {
          return ContentService.createTextOutput(JSON.stringify({
            status: "success",
            gaId: row[1],
            gpBalance: row[11],
            message: "Transaction ref already verified",
            isDuplicate: true
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }

      // Sequential GA-ID minting (GA-1000 + rowCount)
      const rowCount = data.length; // e.g. if 1 header row, next is row 2 -> GA-1001
      const sequentialNumber = 1000 + rowCount;
      const mintedGaId = "GA-" + sequentialNumber;
      const initialGp = boughtCoffee ? 250 : 200;

      // Append row to GA_MASTER_REGISTRY
      sheet.appendRow([
        new Date().toISOString(),
        mintedGaId,
        fullName,
        email,
        phone,
        univ,
        role,
        workshopTrack,
        paymentMethod,
        providerRef,
        boughtCoffee ? "YES" : "NO",
        initialGp,
        "VERIFIED_INTAKE",
        referralId,
        idempotencyKey
      ]);

      const responsePayload = {
        status: "success",
        gaId: mintedGaId,
        fullName: fullName,
        email: email,
        gpBalance: initialGp,
        sabriBonusUnlocked: true,
        workshopDate: "Friday, August 28, 2026",
        location: "Dr. Sabri Training Center (Lic. 1549) — Dokki, Cairo",
        message: "Registration recorded successfully in Master Ledger"
      };

      return ContentService.createTextOutput(JSON.stringify(responsePayload))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Unrecognized Action
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Unrecognized action: " + action
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
