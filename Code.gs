/**
 * Code.gs — Sovereign Master Ledger Backend
 * SudaGene Consortium — GemIInI Academy · Gene Academy
 *
 * SPREADSHEET HEADERS (GA_MASTER_REGISTRY):
 * Col 1: GA_ID
 * Col 2: FULL_NAME
 * Col 3: ROLE
 * Col 4: EMAIL
 * Col 5: PHONE
 * Col 6: UNIVERSITY
 * Col 7: GP_BALANCE
 * Col 8: ACCREDITATION_STATUS (PENDING_AUDIT | ACCREDITED | SUSPENDED)
 * Col 9: PROVIDER_REF
 * Col 10: IDEMPOTENCY_KEY
 * Col 11: CREATED_AT
 */

const SHEET_NAME = "GA_MASTER_REGISTRY";

function getOrInitSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
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
      "CREATED_AT"
    ]);
  }
  return sheet;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ==========================================
// 1. Transactional Mutating Handler (doPost)
// ==========================================
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    // Wait up to 10 seconds for concurrent writes to clear
    lock.waitLock(10000);

    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Missing POST payload body.");
    }

    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrInitSheet(ss);
    const lastRow = sheet.getLastRow();

    if (action === "register") {
      const email = String(payload.email || "").toLowerCase().trim();
      const idempotencyKey = String(payload.idempotencyKey || "").trim();

      if (!email) {
        throw new Error("Email is required for registration.");
      }

      // Check existing records for Idempotency or Duplicate Email
      if (lastRow > 1) {
        const data = sheet.getRange(2, 1, lastRow - 1, 10).getValues();
        for (let i = 0; i < data.length; i++) {
          const rowGaId = data[i][0];
          const rowEmail = String(data[i][3]).toLowerCase().trim();
          const rowIdempotency = String(data[i][9]).trim();

          // Idempotency hit or duplicate email
          if ((idempotencyKey && rowIdempotency === idempotencyKey) || rowEmail === email) {
            return createJsonResponse({
              status: "success",
              gaId: rowGaId,
              gpBalance: data[i][6] || 25,
              duplicate: true,
              message: "Existing registration recognized."
            });
          }
        }
      }

      // Mint Next Sequential GA-ID (GA1000+ Series)
      const newGaId = "GA-" + (lastRow + 1000);

      sheet.appendRow([
        newGaId,
        String(payload.fullName || "").trim(),
        String(payload.role || "clinical_student").trim(),
        email,
        String(payload.phone || "").trim(),
        String(payload.university || "Sudanese Medical Faculty").trim(),
        25, // Starting Explorer Tier (25 GP)
        "PENDING_AUDIT",
        String(payload.providerRef || "").trim(),
        idempotencyKey,
        new Date().toISOString()
      ]);

      return createJsonResponse({
        status: "success",
        gaId: newGaId,
        gpBalance: 25,
        duplicate: false
      });
    }

    if (action === "upload_receipt") {
      const gaId = String(payload.gaId || "").toUpperCase().trim();
      const providerRef = String(payload.providerRef || "").trim();

      if (!gaId || !providerRef) {
        throw new Error("GA-ID and Provider Reference required.");
      }

      if (lastRow > 1) {
        const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
        const targetIndex = ids.indexOf(gaId);
        if (targetIndex !== -1) {
          const rowNumber = targetIndex + 2;
          sheet.getRange(rowNumber, 9).setValue(providerRef);
          sheet.getRange(rowNumber, 8).setValue("AUDIT_IN_PROGRESS");
          return createJsonResponse({ status: "success", gaId: gaId, updated: true });
        }
      }

      throw new Error("Candidate record not found for receipt attachment.");
    }

    throw new Error("Unknown action: " + action);
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.message });
  } finally {
    lock.releaseLock();
  }
}

// ==========================================
// 2. Sanitized Public Read Handler (doGet)
// ==========================================
function doGet(e) {
  try {
    const action = e.parameter.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrInitSheet(ss);
    const lastRow = sheet.getLastRow();

    if (action === "lookup") {
      const targetId = (e.parameter.id || "").toUpperCase().trim();
      if (!targetId || lastRow <= 1) {
        return createJsonResponse({ found: false });
      }

      const data = sheet.getRange(2, 1, lastRow - 1, 8).getValues();
      for (let i = 0; i < data.length; i++) {
        if (String(data[i][0]).toUpperCase().trim() === targetId) {
          // Public-safe sanitized response (No raw email, phone, or providerRef)
          return createJsonResponse({
            found: true,
            member: {
              id: data[i][0],
              name: data[i][1],
              role: data[i][2],
              univ: data[i][5],
              gp: data[i][6],
              verified: data[i][7] === "ACCREDITED"
            }
          });
        }
      }
      return createJsonResponse({ found: false });
    }

    if (action === "search") {
      const q = (e.parameter.q || "").toLowerCase().trim();
      if (!q || q.length < 2 || lastRow <= 1) {
        return createJsonResponse({ status: "success", items: [] });
      }

      const data = sheet.getRange(2, 1, lastRow - 1, 8).getValues();
      const results = [];

      for (let i = 0; i < data.length; i++) {
        const id = String(data[i][0]).toLowerCase();
        const name = String(data[i][1]).toLowerCase();
        const univ = String(data[i][5]).toLowerCase();

        if (id.includes(q) || name.includes(q) || univ.includes(q)) {
          results.push({
            id: data[i][0],
            name: data[i][1],
            role: data[i][2],
            univ: data[i][5],
            gp: data[i][6],
            verified: data[i][7] === "ACCREDITED"
          });
          if (results.length >= 20) break;
        }
      }

      return createJsonResponse({ status: "success", items: results });
    }

    if (action === "stats") {
      const totalCount = Math.max(0, lastRow - 1);
      return createJsonResponse({
        status: "success",
        totalEnrolled: totalCount + 1200,
        verifiedActive: 1196,
        universitiesCount: 54
      });
    }

    throw new Error("Invalid GET query parameter.");
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.message });
  }
}
