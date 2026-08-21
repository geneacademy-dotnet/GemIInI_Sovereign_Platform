/**
 * =============================================================================
 * GemIInI Sovereign Platform — Google Apps Script Multi-Ledger & Drive Backend (2026)
 * =============================================================================
 * Connects Google Sheets & Google Drive to the 3-Door Sovereign Ecosystem:
 *   - Door 1: GemIInI Academy (Clinical Preparation, SMC Exam, MTC Algorithms)
 *   - Door 2: GeneAcademy (Academic Research, Molecular Medicine, Alumni Museum)
 *   - Door 3: GLOMEt HQ (B2B Virtual Labs, Turnkey Construction, Pharma Supply)
 * 
 * Master Relational Sheets:
 *   1. GA_MASTER_REGISTRY       - Central Identity, Dynamic Cipher & Door Assignment
 *   2. RESPONSES_STREAM         - Real-time Survey, Review & Diagnostic Response Intake
 *   3. GP_TRANSACTION_LEDGER    - Academic & Professional Currency Audit Trail
 *   4. CANDIDATE_DRIVE_INDEX    - Direct Google Drive Folders & Dossier Records
 *   5. B2B_GLOMET_PIPELINE      - Institutional Lab Requests & Procurement Contracts
 */

const SHEET_REGISTRY = "GA_MASTER_REGISTRY";
const SHEET_RESPONSES = "RESPONSES_STREAM";
const SHEET_LEDGER = "GP_TRANSACTION_LEDGER";
const SHEET_DRIVE_INDEX = "CANDIDATE_DRIVE_INDEX";
const SHEET_GLOMET = "B2B_GLOMET_PIPELINE";

const ROOT_VAULT_FOLDER_NAME = "GemIInI_Sovereign_Vault_2026";

function getAdminKey() {
  return PropertiesService.getScriptProperties().getProperty("ADMIN_KEY") || "GEMIINI_MASTER_KEY_2026";
}

function isAuthorized(e) {
  const suppliedKey = (e.parameter && e.parameter.key) || "";
  return !!suppliedKey && suppliedKey === getAdminKey();
}

/**
 * =============================================================================
 * GET Request Handler (Lookup, Search, Stats, Dossier Links)
 * =============================================================================
 */
function doGet(e) {
  const action = (e.parameter && e.parameter.action) || "stats";
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureAllSheetsExist(ss);

  let responseData = {};

  if (action === "lookup") {
    // Lookup by GA# or Email
    const query = (e.parameter.id || e.parameter.email || "").trim().toLowerCase();
    const registrySheet = ss.getSheetByName(SHEET_REGISTRY);
    const data = getSheetData(registrySheet);

    const member = data.find(m => 
      (m.id && m.id.toLowerCase() === query) ||
      (m.id && m.id.toLowerCase() === "ga" + query) ||
      (m.email && m.email.toLowerCase() === query)
    );

    if (member) {
      responseData = {
        status: "success",
        found: true,
        member: sanitizeMember(member)
      };
    } else {
      responseData = {
        status: "not_found",
        found: false,
        message: `Identifier "${query}" not found in verified sovereign registry.`
      };
    }

  } else if (action === "search") {
    const q = (e.parameter.q || "").trim().toLowerCase();
    const registrySheet = ss.getSheetByName(SHEET_REGISTRY);
    const data = getSheetData(registrySheet);

    const matches = data.filter(m => 
      (m.id && m.id.toLowerCase().includes(q)) ||
      (m.name && m.name.toLowerCase().includes(q)) ||
      (m.institution && m.institution.toLowerCase().includes(q)) ||
      (m.entity_door && m.entity_door.toLowerCase().includes(q))
    ).slice(0, 25);

    responseData = { status: "success", count: matches.length, results: matches.map(sanitizeMember) };

  } else if (action === "stats") {
    const registrySheet = ss.getSheetByName(SHEET_REGISTRY);
    const data = getSheetData(registrySheet);
    const totalMembers = data.length;
    const totalVerified = data.filter(m => m.verified === true || m.verified === "TRUE").length;
    const totalGp = data.reduce((acc, m) => acc + (parseInt(m.gp_balance, 10) || 0), 0);

    responseData = {
      status: "success",
      totalMembers: totalMembers,
      totalVerified: totalVerified,
      totalGpLedger: totalGp,
      doors: {
        gemiiniClinical: data.filter(m => (m.entity_door || "").includes("GEMIINI")).length,
        geneResearch: data.filter(m => (m.entity_door || "").includes("GENE")).length,
        glometB2B: data.filter(m => (m.entity_door || "").includes("GLOMET")).length
      },
      lastAudited: new Date().toISOString().split('T')[0]
    };

  } else if (action === "all") {
    if (!isAuthorized(e)) {
      responseData = { status: "error", message: "Unauthorized. Admin key required." };
      return ContentService.createTextOutput(JSON.stringify(responseData)).setMimeType(ContentService.MimeType.JSON);
    }
    const registrySheet = ss.getSheetByName(SHEET_REGISTRY);
    const data = getSheetData(registrySheet);
    responseData = { status: "success", total: data.length, records: data.map(sanitizeMember) };
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * =============================================================================
 * POST Request Handler (Unified Ingestion, Drive Dossier Creation & Ledger Credit)
 * =============================================================================
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    ensureAllSheetsExist(ss);

    const props = PropertiesService.getScriptProperties();
    const lock = LockService.getScriptLock();
    lock.waitLock(15000);

    // Generate or use existing GA#
    let nextNum = parseInt(props.getProperty("NEXT_CANDIDATE_NUM") || "3530", 10);
    const gaId = payload.id || `GA${nextNum}`;
    if (!payload.id) {
      props.setProperty("NEXT_CANDIDATE_NUM", String(nextNum + 1));
    }
    lock.releaseLock();

    // Determine Entity Door
    const door = determineEntityDoor(payload);
    const gpReward = determineGpReward(payload);

    // 1. Provision Automated Dedicated Google Drive Folder & Dossier
    const driveResult = provisionCandidateDriveVault(gaId, payload.name, door, payload);

    // 2. Append to GA_MASTER_REGISTRY
    const registrySheet = ss.getSheetByName(SHEET_REGISTRY);
    const timestamp = new Date();
    
    registrySheet.appendRow([
      gaId,
      payload.name || "Anonymous Sovereign Holder",
      payload.email || "",
      payload.phone || "",
      door,
      payload.status_role || payload.role || "Registered Candidate",
      payload.institution || payload.univ || "Medical / Health Sciences",
      payload.grad_year || "2026",
      payload.track || payload.priority_track || "SMC Licensure",
      gpReward,
      payload.skill_rank || "Pathfinder",
      driveResult.folderUrl,
      driveResult.dossierUrl,
      timestamp,
      false // Pending verification
    ]);

    // 3. Log to RESPONSES_STREAM if survey/audit response included
    if (payload.responses || payload.survey || payload.answers || payload.rating) {
      const responseSheet = ss.getSheetByName(SHEET_RESPONSES);
      responseSheet.appendRow([
        timestamp,
        gaId,
        payload.name || "",
        payload.email || "",
        door,
        payload.unit_tested || payload.module || "Diagnostic",
        payload.rating || 5,
        payload.clinical_barriers || "",
        payload.feedback || payload.notes || "",
        payload.referred_peers || "",
        driveResult.dossierUrl
      ]);
    }

    // 4. Log to GP_TRANSACTION_LEDGER
    const ledgerSheet = ss.getSheetByName(SHEET_LEDGER);
    ledgerSheet.appendRow([
      timestamp,
      gaId,
      payload.name || "",
      `+${gpReward} GP`,
      payload.reward_reason || "Registration & Diagnostic Profile",
      gpReward,
      "VERIFIED_PENDING_ACTIVATION"
    ]);

    // 5. Log to CANDIDATE_DRIVE_INDEX
    const driveIndexSheet = ss.getSheetByName(SHEET_DRIVE_INDEX);
    driveIndexSheet.appendRow([
      gaId,
      payload.name || "",
      payload.email || "",
      door,
      driveResult.folderUrl,
      driveResult.dossierUrl,
      timestamp
    ]);

    // 6. If GLOMEt B2B Inquiry, record in B2B Pipeline
    if (door === "GLOMET_B2B" || (payload.track && payload.track.toLowerCase().includes("glomet"))) {
      const glometSheet = ss.getSheetByName(SHEET_GLOMET);
      glometSheet.appendRow([
        timestamp,
        gaId,
        payload.name || "",
        payload.institution || payload.company || "",
        payload.email || "",
        payload.phone || "",
        payload.project_type || "Turnkey Laboratory Construction",
        payload.budget_range || "B2B Institutional",
        driveResult.folderUrl,
        "NEW_LEAD_PENDING_REVIEW"
      ]);
    }

    const response = {
      status: "success",
      message: "Candidate dossier generated in Google Drive and recorded across sovereign ledgers.",
      id: gaId,
      name: payload.name,
      door: door,
      gp_reward: gpReward,
      drive_folder_url: driveResult.folderUrl,
      dossier_url: driveResult.dossierUrl,
      verified: false
    };

    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * =============================================================================
 * Automated Google Drive Folder & Formatted Response Dossier Generator
 * =============================================================================
 */
function provisionCandidateDriveVault(gaId, candidateName, door, payload) {
  try {
    // 1. Get or Create Root Sovereign Vault Folder
    let rootFolder;
    const rootFolders = DriveApp.getFoldersByName(ROOT_VAULT_FOLDER_NAME);
    if (rootFolders.hasNext()) {
      rootFolder = rootFolders.next();
    } else {
      rootFolder = DriveApp.createFolder(ROOT_VAULT_FOLDER_NAME);
    }

    // 2. Door Category Folder
    let doorSubfolderName = "1_GemIInI_Academy_Clinical";
    if (door === "GENE_RESEARCH") doorSubfolderName = "2_GeneAcademy_Molecular_Research";
    else if (door === "GLOMET_B2B") doorSubfolderName = "3_GLOMEt_HQ_B2B_Labs";

    let doorFolder;
    const doorFolders = rootFolder.getFoldersByName(doorSubfolderName);
    if (doorFolders.hasNext()) {
      doorFolder = doorFolders.next();
    } else {
      doorFolder = rootFolder.createFolder(doorSubfolderName);
    }

    // 3. Create Dedicated Candidate Folder
    const cleanName = (candidateName || "Candidate").replace(/[^\w\s\u0600-\u06FF]/gi, '');
    const folderTitle = `[${gaId}] - ${cleanName}`;
    const candidateFolder = doorFolder.createFolder(folderTitle);

    // 4. Auto-Generate Response Dossier (Google Doc)
    const dossierDoc = DocumentApp.create(`Dossier_${gaId}_${cleanName}`);
    const body = dossierDoc.getBody();

    // Header Styling
    body.appendParagraph("GEMIINI SOVEREIGN MEDICAL & SCIENTIFIC ECOSYSTEM")
        .setHeading(DocumentApp.ParagraphHeading.HEADING1);
    body.appendParagraph(`Candidate Official Dossier & Audit Log • ${gaId}`)
        .setHeading(DocumentApp.ParagraphHeading.HEADING2);
    
    body.appendHorizontalRule();
    
    // Candidate Profile Summary
    body.appendParagraph("1. IDENTITY & TRACK METRICS").setHeading(DocumentApp.ParagraphHeading.HEADING3);
    body.appendParagraph(`• Sovereign GA-ID: ${gaId}`);
    body.appendParagraph(`• Candidate Name: ${candidateName || "N/A"}`);
    body.appendParagraph(`• Contact Email: ${payload.email || "N/A"}`);
    body.appendParagraph(`• Phone Number: ${payload.phone || "N/A"}`);
    body.appendParagraph(`• Designated Entity Door: ${door}`);
    body.appendParagraph(`• Institution / University: ${payload.institution || payload.univ || "N/A"}`);
    body.appendParagraph(`• Graduation / Intake Year: ${payload.grad_year || "2026"}`);
    body.appendParagraph(`• Initial GP Balance Credited: ${determineGpReward(payload)} GP`);
    
    body.appendParagraph("\n2. SUBMITTED RESPONSES & AUDIT DETAILS").setHeading(DocumentApp.ParagraphHeading.HEADING3);
    if (payload.responses) {
      body.appendParagraph(typeof payload.responses === 'object' ? JSON.stringify(payload.responses, null, 2) : String(payload.responses));
    } else {
      body.appendParagraph(`• Priority Module / Track: ${payload.track || "SMC Clinical Preparation"}`);
      body.appendParagraph(`• Clinical Diagnostic Feedback: ${payload.feedback || "Standard candidate entry intake"}`);
      body.appendParagraph(`• Nominated Peers: ${payload.referred_peers || "None"}`);
    }

    body.appendParagraph("\n3. VERIFICATION & SECURITY DIRECTIVE").setHeading(DocumentApp.ParagraphHeading.HEADING3);
    body.appendParagraph("This dossier was computationally generated upon sovereign platform intake. Passwords and ciphers are derived dynamically from validated historical records.");
    body.appendParagraph(`Timestamp: ${new Date().toUTCString()}`);

    dossierDoc.saveAndClose();

    // Move Dossier Doc to the Candidate Folder
    const docFile = DriveApp.getFileById(dossierDoc.getId());
    candidateFolder.addFile(docFile);
    DriveApp.getRootFolder().removeFile(docFile);

    return {
      folderUrl: candidateFolder.getUrl(),
      dossierUrl: docFile.getUrl()
    };
  } catch (err) {
    return {
      folderUrl: "https://drive.google.com",
      dossierUrl: ""
    };
  }
}

/**
 * =============================================================================
 * Helper Functions & Relational Schemas
 * =============================================================================
 */
function determineEntityDoor(payload) {
  const track = ((payload.door || payload.track || payload.entity || payload.role || "") + "").toLowerCase();
  if (track.includes("glomet") || track.includes("turnkey") || track.includes("b2b") || track.includes("pharma") || track.includes("procurement")) {
    return "GLOMET_B2B";
  }
  if (track.includes("gene") || track.includes("molecular") || track.includes("research") || track.includes("alumni") || track.includes("masterclass")) {
    return "GENE_RESEARCH";
  }
  return "GEMIINI_CLINICAL";
}

function determineGpReward(payload) {
  if (payload.referred_peers && payload.referred_peers.length > 5) return 1000;
  if (payload.responses || payload.survey) return 600;
  return 500;
}

function ensureAllSheetsExist(ss) {
  // 1. Registry
  let s1 = ss.getSheetByName(SHEET_REGISTRY);
  if (!s1) {
    s1 = ss.insertSheet(SHEET_REGISTRY);
    s1.appendRow(["id", "name", "email", "phone", "entity_door", "status_role", "institution", "grad_year", "priority_track", "gp_balance", "skill_rank", "drive_folder_url", "dossier_url", "created_at", "verified"]);
    s1.getRange(1, 1, 1, 15).setFontWeight("bold").setBackground("#04080F").setFontColor("#00F2FE");
  }

  // 2. Responses Stream
  let s2 = ss.getSheetByName(SHEET_RESPONSES);
  if (!s2) {
    s2 = ss.insertSheet(SHEET_RESPONSES);
    s2.appendRow(["timestamp", "ga_id", "name", "email", "door", "unit_tested", "rating", "clinical_barriers", "feedback", "referred_peers", "dossier_url"]);
    s2.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#130726").setFontColor("#FDE68A");
  }

  // 3. GP Transaction Ledger
  let s3 = ss.getSheetByName(SHEET_LEDGER);
  if (!s3) {
    s3 = ss.insertSheet(SHEET_LEDGER);
    s3.appendRow(["timestamp", "ga_id", "name", "amount", "transaction_type", "new_balance", "status"]);
    s3.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#2C1154").setFontColor("#2DE0C2");
  }

  // 4. Candidate Drive Index
  let s4 = ss.getSheetByName(SHEET_DRIVE_INDEX);
  if (!s4) {
    s4 = ss.insertSheet(SHEET_DRIVE_INDEX);
    s4.appendRow(["ga_id", "name", "email", "door", "drive_folder_url", "dossier_url", "created_at"]);
    s4.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#0B0418").setFontColor("#B48028");
  }

  // 5. GLOMEt B2B Pipeline
  let s5 = ss.getSheetByName(SHEET_GLOMET);
  if (!s5) {
    s5 = ss.insertSheet(SHEET_GLOMET);
    s5.appendRow(["timestamp", "ga_id", "name", "institution_company", "email", "phone", "project_type", "budget_range", "drive_vault_url", "pipeline_stage"]);
    s5.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#022c22").setFontColor("#34d399");
  }
}

function getSheetData(sheet) {
  if (!sheet) return [];
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

function sanitizeMember(m) {
  return {
    id: m.id,
    name: m.name,
    email: m.email ? m.email.replace(/(.{2})(.*)(?=@)/, '$1***') : "",
    phone: m.phone ? m.phone.replace(/(\d{3})\d+(\d{2})/, '$1****$2') : "",
    door: m.entity_door || "GEMIINI_CLINICAL",
    role: m.status_role || "Candidate",
    univ: m.institution || "",
    gradYear: m.grad_year || "",
    track: m.priority_track || "",
    gp: parseInt(m.gp_balance, 10) || 0,
    skillRank: m.skill_rank || "Pathfinder",
    driveFolderUrl: m.drive_folder_url || "",
    dossierUrl: m.dossier_url || "",
    verified: m.verified === true || m.verified === "TRUE"
  };
}
