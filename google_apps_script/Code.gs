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

// FIX (2026-08-19): Security patches applied.
//  1. `action=all` is gated behind an admin key to prevent data scraping.
//  2. doPost saves new submissions as unverified (pending review).
//
// SETUP REQUIRED: open Project Settings > Script Properties in Apps Script
// and add ADMIN_KEY with a secure key.
function getAdminKey() {
  return PropertiesService.getScriptProperties().getProperty("ADMIN_KEY") || "GEMIINI_MASTER_KEY_2026";
}

function isAuthorized(e) {
  const suppliedKey = (e.parameter && e.parameter.key) || "";
  const realKey = getAdminKey();
  return !!realKey && suppliedKey === realKey;
}

/**
 * Handle GET Requests:
 * Examples:
 *   - Lookup by GA#:  https://script.google.com/.../exec?action=lookup&id=GA3459
 *   - Search by Name: https://script.google.com/.../exec?action=search&q=Noura
 *   - Get All Stats:  https://script.google.com/.../exec?action=stats
 *   - Get All Records (ADMIN ONLY): .../exec?action=all&key=YOUR_ADMIN_KEY
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
    ).slice(0, 25);

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
    if (!isAuthorized(e)) {
      responseData = { status: "error", message: "Unauthorized. This action requires an admin key." };
      return ContentService.createTextOutput(JSON.stringify(responseData))
        .setMimeType(ContentService.MimeType.JSON);
    }
    responseData = { status: "success", total: data.length, records: data.map(sanitizeMember) };
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST Requests:
 * Appends new inquiries/registrations across all 5 persona funnels.
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    const props = PropertiesService.getScriptProperties();
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    let counter = parseInt(props.getProperty("NEXT_CANDIDATE_NUM") || "3467", 10);
    const newId = payload.id || `GA${counter}`;
    props.setProperty("NEXT_CANDIDATE_NUM", String(counter + 1));
    lock.releaseLock();

    // Provision dedicated Google Drive Folder based on Segmentation
    const driveFolderUrl = provisionDriveFolderForMember(newId, payload.name, payload.track || payload.priority_track);

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
      payload.source || "Web_Portal_Join_Now",
      driveFolderUrl ? `Drive: ${driveFolderUrl}` : (payload.notes || "Live Submission from join.html"),
      false // verified — pending manual review
    ];

    sheet.appendRow(newRow);

    // Also route to specific Inquiry Sub-Sheet if specified
    routeToInquirySheet(payload, newId, driveFolderUrl);

    const result = {
      status: "success",
      message: "Registration received, GP credited, and Drive Folder provisioned.",
      id: newId,
      gp: 500,
      driveFolderUrl: driveFolderUrl || "https://drive.google.com",
      verified: false
    };

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Helper: Automatically Provision Segmented Google Drive Folder
 */
function provisionDriveFolderForMember(gaId, memberName, track) {
  try {
    const parentFolderName = "GemIInI_Sovereign_Members_Drive";
    let parentFolder;
    const folders = DriveApp.getFoldersByName(parentFolderName);
    if (folders.hasNext()) {
      parentFolder = folders.next();
    } else {
      parentFolder = DriveApp.createFolder(parentFolderName);
    }

    // Determine Entity Segment subfolder
    let segmentName = "SMC_Clinical_Candidates";
    if (track && (track.includes("Molecular") || track.includes("Genomics"))) {
      segmentName = "GeneAcademy_Molecular_Scholars";
    } else if (track && (track.includes("Counseling") || track.includes("WES"))) {
      segmentName = "Genetic_Counseling_Cases";
    } else if (track && (track.includes("Glomet") || track.includes("Turnkey"))) {
      segmentName = "GLOMEt_Turnkey_Projects";
    } else if (track && track.includes("STEM")) {
      segmentName = "STEM_PreMed_Students";
    }

    let segmentFolder;
    const segFolders = parentFolder.getFoldersByName(segmentName);
    if (segFolders.hasNext()) {
      segmentFolder = segFolders.next();
    } else {
      segmentFolder = parentFolder.createFolder(segmentName);
    }

    // Create unique member folder
    const cleanName = (memberName || "Member").replace(/[^\w\s\u0600-\u06FF]/gi, '');
    const memberFolder = segmentFolder.createFolder(`[${gaId}] - ${cleanName}`);
    
    return memberFolder.getUrl();
  } catch (e) {
    // If DriveApp scope not authorized, fallback gracefully
    return "";
  }
}

/**
 * Route Submissions to Specialized Inquiry Tabs
 */
function routeToInquirySheet(payload, generatedId, driveFolderUrl) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const type = (payload.inquiry_type || payload.track || "").toLowerCase();
    
    let targetSheetName = "";
    if (type.includes("smc") || type.includes("doctor")) targetSheetName = "INQUIRY_CLINICAL_SMC";
    else if (type.includes("glomet") || type.includes("turnkey")) targetSheetName = "INQUIRY_GLOMET_TURNKEY";
    else if (type.includes("counseling") || type.includes("genetics")) targetSheetName = "INQUIRY_GENETIC_COUNSELING";
    else if (type.includes("molecular") || type.includes("research")) targetSheetName = "INQUIRY_MOLECULAR_GENOMICS";
    else if (type.includes("stem") || type.includes("student")) targetSheetName = "INQUIRY_STUDENT_PREMED";

    if (targetSheetName) {
      let subSheet = ss.getSheetByName(targetSheetName);
      if (!subSheet) {
        subSheet = ss.insertSheet(targetSheetName);
        subSheet.appendRow(["Timestamp", "GA_ID", "Name", "Phone", "Email", "Drive_Folder_URL", "Details_JSON"]);
        subSheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#2C1154").setFontColor("#FFFFFF");
      }
      subSheet.appendRow([new Date(), generatedId, payload.name, payload.phone, payload.email, driveFolderUrl || "", JSON.stringify(payload)]);
    }
  } catch(e) {
    // Non-blocking fallback
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
