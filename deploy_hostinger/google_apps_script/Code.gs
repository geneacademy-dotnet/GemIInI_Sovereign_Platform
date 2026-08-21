/**
 * =============================================================================
 * GemIInI Sovereign Platform — Google Apps Script Master Backend Bridge (2026)
 * =============================================================================
 * Connects Google Sheets / Google Forms to the GemIInI Web Application.
 * Audited against: GemIInI_Smart_Contacts-4.xlsx & Sheet B (Student Tracker).
 * 
 * Columns in GA_MASTER_REGISTRY:
 *   A: id (GA#)
 *   B: name (Full Name - Real As-Is)
 *   C: status_role (Current Status / Role)
 *   D: institution (University / Entity)
 *   E: grad_year (Entry / Graduation Year)
 *   F: priority_track (Target Track / Fellowship)
 *   G: advised_modules (Recommended Modules)
 *   H: gp_balance (GemIInI Points)
 *   I: skill_rank (Pathfinder / Pioneer / Vanguard)
 *   J: high_value (YES / NO)
 *   K: tags (Pipeline Tags)
 *   L: source_workbook (Origin Source)
 *   M: notes (Real Operational Notes)
 *   N: verified (TRUE / FALSE)
 */

const SHEET_NAME = "GA_MASTER_REGISTRY";

/**
 * Handle GET Requests:
 * Examples:
 *   - Lookup by GA#:  https://script.google.com/.../exec?action=lookup&id=GA3459
 *   - Search by Name: https://script.google.com/.../exec?action=search&q=Noura
 *   - Get All Stats:  https://script.google.com/.../exec?action=stats
 */
function doGet(e) {
  const action = (e.parameter && e.parameter.action) || "stats";
  const sheet = getOrCreateSheet();
  const data = getSheetData(sheet);

  let responseData = {};

  if (action === "lookup") {
    const targetId = (e.parameter.id || "").trim().toUpperCase();
    const cleanId = targetId.startsWith("GA") ? targetId : "GA" + targetId;
    const member = data.find(m => m.id && (m.id.toUpperCase() === cleanId || m.id.toUpperCase() === cleanId.replace("-", "")));

    if (member) {
      responseData = { status: "success", found: true, member: sanitizeMember(member) };
    } else {
      responseData = { status: "not_found", found: false, message: `ID ${cleanId} not found in verified registry.` };
    }

  } else if (action === "search") {
    const query = (e.parameter.q || "").trim().toLowerCase();
    const matches = data.filter(m => 
      (m.id && m.id.toLowerCase().includes(query)) ||
      (m.name && m.name.toLowerCase().includes(query)) ||
      (m.institution && m.institution.toLowerCase().includes(query)) ||
      (m.status_role && m.status_role.toLowerCase().includes(query))
    ).slice(0, 20);

    responseData = { status: "success", count: matches.length, results: matches.map(sanitizeMember) };

  } else if (action === "stats") {
    const totalMembers = data.length;
    const totalVerified = data.filter(m => m.verified === true || m.verified === "TRUE").length;
    const totalGp = data.reduce((acc, m) => acc + (parseInt(m.gp_balance, 10) || 0), 0);

    responseData = {
      status: "success",
      totalMembers: totalMembers,
      totalVerified: totalVerified,
      totalGpLedger: totalGp,
      lastAudited: "2026-08-20",
      source: "GemIInI_Smart_Contacts-4.xlsx"
    };

  } else if (action === "all") {
    responseData = { status: "success", total: data.length, records: data.map(sanitizeMember) };
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST Requests:
 * Appends new inquiries/registrations to the Google Sheet.
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();
    const data = getSheetData(sheet);

    const nextNum = data.length + 1;
    const newId = payload.id || `GA${String(nextNum).padStart(4, "0")}`;

    const newRow = [
      newId,
      payload.name || "Anonymous Applicant",
      payload.status_role || payload.role || "Registered Candidate",
      payload.institution || payload.univ || "Medical / Health Institution",
      payload.grad_year || "2026",
      payload.priority_track || payload.track || "gemiiniXsmc Licensure",
      payload.advised_modules || payload.modules || "gemiiniXsmc Modules",
      parseInt(payload.gp_balance || payload.gp, 10) || 500,
      payload.skill_rank || "Pathfinder",
      payload.high_value || "NO",
      payload.tags || "_NEW_PORTAL_REGISTRATION",
      "Web_Portal_Join_Now",
      payload.notes || "Live Submission from join.html",
      true // verified
    ];

    sheet.appendRow(newRow);

    const result = {
      status: "success",
      message: "Member recorded in master registry.",
      id: newId,
      gp_balance: parseInt(payload.gp_balance || payload.gp, 10) || 500
    };

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Helper: Get or Create the Master Registry Sheet Tab
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = [
      "id", "name", "status_role", "institution", "grad_year", 
      "priority_track", "advised_modules", "gp_balance", "skill_rank", 
      "high_value", "tags", "source_workbook", "notes", "verified"
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#1E0A38").setFontColor("#FDE68A");
  }
  return sheet;
}

/**
 * Helper: Read Sheet Data into Objects
 */
function getSheetData(sheet) {
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  const headers = rows[0];
  const data = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    data.push(obj);
  }
  return data;
}

/**
 * Helper: Sanitize member output
 */
function sanitizeMember(m) {
  return {
    id: m.id,
    name: m.name,
    role: m.status_role,
    univ: m.institution,
    gradYear: m.grad_year,
    track: m.priority_track,
    modules: m.advised_modules,
    gp: parseInt(m.gp_balance, 10) || 0,
    skillRank: m.skill_rank,
    highValue: m.high_value,
    source: m.source_workbook,
    verified: m.verified === true || m.verified === "TRUE"
  };
}
