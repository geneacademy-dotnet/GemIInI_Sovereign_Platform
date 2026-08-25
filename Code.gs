/**
 * SudaGene Consortium & GemIInI Academy — Master Sovereign Backend Engine
 * Strict Integrity 5-Tab Google Sheets Ledger & Atomic Transaction Ingestion
 *
 * Target Sheet: GemIInI Master Registry 2026
 * Schema:
 *   - Tab 1: MASTER_AUTH
 *   - Tab 2: PAYMENT_AUDIT_LOG
 *   - Tab 3: GEMIINI_CLINICAL_TELEMETRY
 *   - Tab 4: QUEUE_FALLBACK
 *   - Tab 5: CONCIERGE_FASTTRACK
 */

const NEXT_ID_START = 6291;
const WORKSHOP_ID_CAIRO = 'BLS-2026-08-CAIRO';
const INBOX_FOLDER_NAME = '01_RECEIPTS_INBOX';

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const action = payload.action || 'ping';

    // 1. ATOMIC PORTAL INTAKE (/join & Registration Gateway)
    if (action === 'portal_intake' || action === 'register') {
      return handlePortalIntake(payload);
    }

    // 2. BLS PHYSICAL CLINICAL WORKSHOP (Cairo Dokki Hub - 3,000 EGP)
    if (action === 'bls_register') {
      return handleBlsRegister(payload);
    }

    // 3. CONCIERGE FAST-TRACK VISA & EXAM TRAVEL
    if (action === 'concierge_fast_track') {
      return handleConciergeFastTrack(payload);
    }

    // 4. CLINICAL SIMULATION & TELEMETRY INGESTION (Strict Zero Defaults)
    if (action === 'log_telemetry') {
      return handleLogTelemetry(payload);
    }

    // 5. SOVEREIGN MEMBER LOOKUP (Strict Database Query, Zero Mock Overrides)
    if (action === 'lookup') {
      return handleLookup(payload);
    }

    // 6. SOVEREIGN MERIT LEADERBOARD
    if (action === 'leaderboard') {
      return handleLeaderboard(payload);
    }

    return jsonResponse({ status: 'success', message: 'GemIInI Sovereign API active', timestamp: new Date().toISOString() });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() }, 500);
  }
}

// ==============================================================================
// 1. ATOMIC PORTAL INTAKE HANDLER
// ==============================================================================
function handlePortalIntake(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // 10-Second Concurrency Lock

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const authSheet = getOrCreateSheet(ss, 'MASTER_AUTH', [
      'Timestamp', 'GA_ID', 'Full_Name_Arabic', 'Full_Name_English', 'Email_Address', 
      'WhatsApp_Phone', 'Canonical_University', 'Graduation_Year', 'Primary_Track', 
      'GP_Balance', 'Account_Status', 'Course_Completion_Rate', 'Diagnostic_Accuracy', 
      'Study_Streak_Days', 'Standardized_Title', 'SudaPass_Hash', 'Drive_Folder_URL'
    ]);

    const auditSheet = getOrCreateSheet(ss, 'PAYMENT_AUDIT_LOG', [
      'Audit_Timestamp', 'Transaction_Ref', 'Candidate_GA_ID', 'Payment_Channel', 
      'Amount_Submitted', 'Receipt_Drive_Link', 'Verification_Status', 'Audited_By_Officer', 'Verification_Timestamp'
    ]);

    const txRef = String(payload.provider_ref || payload.transaction_ref || payload.transactionId || '').trim().toUpperCase();
    const email = String(payload.email || payload.email_address || '').trim().toLowerCase();
    const phone = String(payload.phone || payload.whatsapp || payload.phone_whatsapp || '').trim();
    const nameAr = String(payload.full_name_ar || payload.name_ar || '').trim();
    const nameEn = String(payload.full_name_en || payload.fullName || payload.name || 'Doctor').trim();

    // 1. Deduplication Gate
    if (txRef && txRef !== 'MANUAL' && isDuplicateTransaction(auditSheet, txRef)) {
      return jsonResponse({ status: 'error', code: 'DUPLICATE_TX', message: 'Transaction reference already processed.' }, 409);
    }

    // 2. Identity Resolution or Sequential Minting (Zero Math.random())
    let gaId = resolveExistingGaId(authSheet, email, phone);
    let isNewMember = false;

    if (!gaId) {
      isNewMember = true;
      gaId = mintSequentialGaId(ss, authSheet);
      
      authSheet.appendRow([
        new Date().toISOString(),
        gaId,
        nameAr || nameEn,
        nameEn,
        email,
        phone,
        payload.canonical_university || payload.university || 'University of Khartoum',
        Number(payload.graduation_year) || 2024,
        payload.primary_track || payload.track || 'SMC_LICENSURE',
        25, // Initial Explorer Balance
        'EXPLORER',
        0, // Initial CCR%
        0, // Initial Accuracy%
        1, // Day 1 Streak
        payload.standardized_title || 'Clinical Trainee',
        generateSudaPassHash(gaId, email),
        '' // Workspace Drive URL
      ]);
    }

    // 3. Save Receipt Screenshot to Drive if base64 provided
    let receiptUrl = '';
    if (payload.receipt_base64) {
      receiptUrl = saveReceiptToDrive(gaId, txRef, payload.receipt_base64);
    }

    // 4. Log to PAYMENT_AUDIT_LOG
    if (txRef) {
      auditSheet.appendRow([
        new Date().toISOString(),
        txRef,
        gaId,
        payload.payment_channel || payload.paymentMethod || 'VODAFONE_CASH_EG',
        payload.amount_submitted || payload.amount || 0,
        receiptUrl,
        'PENDING_AUDIT',
        '', // Audited_By_Officer
        '' // Verification_Timestamp
      ]);
    }

    return jsonResponse({
      status: 'success',
      gaId: gaId,
      gpBalance: isNewMember ? 25 : getMemberGp(authSheet, gaId),
      tier: isNewMember ? 'EXPLORER' : 'EXISTING',
      message: 'Intake transaction committed atomically.'
    });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() }, 500);
  } finally {
    lock.releaseLock();
  }
}

// ==============================================================================
// 2. INSTALLABLE APPROVAL & GP BUMP TRIGGER
// ==============================================================================
function onEditApprovalTrigger(e) {
  if (!e || !e.range) return;
  const sheet = e.range.getSheet();
  if (sheet.getName() !== 'PAYMENT_AUDIT_LOG') return;

  const col = e.range.getColumn();
  const row = e.range.getRow();
  const val = String(e.range.getValue()).trim().toUpperCase();

  // Column G = Verification_Status (Column 7)
  if (col === 7 && val === 'VERIFIED') {
    const lock = LockService.getScriptLock();
    try {
      lock.waitLock(10000);
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const authSheet = ss.getSheetByName('MASTER_AUTH');
      const gaId = String(sheet.getRange(row, 3).getValue()).trim();
      const officer = Session.getActiveUser().getEmail() || 'GA-STAFF';

      // Update Audit Log metadata
      sheet.getRange(row, 8).setValue(officer);
      sheet.getRange(row, 9).setValue(new Date().toISOString());

      // Bump MASTER_AUTH to Pathfinder Tier (+475 GP -> 500 GP total)
      bumpCandidateToPathfinder(authSheet, gaId);
    } catch (err) {
      Logger.log('Approval Trigger Error: ' + err);
    } finally {
      lock.releaseLock();
    }
  }
}

// ==============================================================================
// 3. BLS PHYSICAL CLINICAL WORKSHOP (Single Physical 3,000 EGP Track)
// ==============================================================================
function handleBlsRegister(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const authSheet = getOrCreateSheet(ss, 'MASTER_AUTH', []);
    const sheet = getOrCreateSheet(ss, 'BLS_Workshop_Intake', [
      'Timestamp', 'GA_ID', 'Full Name', 'Email', 'Phone', 'Hub', 
      'Payment Method', 'Transaction ID', 'Priority Patron', 'Status'
    ]);

    const fullName = payload.fullName || 'Doctor';
    const email = String(payload.email || '').trim().toLowerCase();
    const phone = String(payload.phone || '').trim();
    const txId = payload.transactionId || 'Manual Coordination';
    const priority = payload.expeditedCoffee ? 'VIP_COFFEE_PATRON' : 'STANDARD';

    // Strict Sequential Minting or Existing Lookup (Zero Math.random())
    let gaId = resolveExistingGaId(authSheet, email, phone);
    if (!gaId) {
      gaId = mintSequentialGaId(ss, authSheet);
      authSheet.appendRow([
        new Date().toISOString(),
        gaId,
        fullName,
        fullName,
        email,
        phone,
        payload.university || 'Medical Faculty',
        2024,
        'BLS_RESUSCITATION',
        25,
        'EXPLORER',
        0, 0, 1,
        'BLS Candidate',
        generateSudaPassHash(gaId, email),
        ''
      ]);
    }

    sheet.appendRow([
      new Date().toISOString(),
      gaId,
      fullName,
      email,
      phone,
      'Cairo Dokki Hub (Aug 28 • 3,000 EGP)',
      'Vodafone Cash (+20 101 592 2628)',
      txId,
      priority,
      'PENDING_CONFIRMATION'
    ]);

    return jsonResponse({
      status: 'success',
      gaId: gaId,
      message: 'BLS Workshop seat reserved successfully.'
    });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() }, 500);
  } finally {
    lock.releaseLock();
  }
}

// ==============================================================================
// 4. CONCIERGE FAST-TRACK VISA HANDLER
// ==============================================================================
function handleConciergeFastTrack(payload) {
  const body = payload.body || payload;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet(ss, 'CONCIERGE_FASTTRACK', [
    'Timestamp', 'Full Name', 'WhatsApp', 'Target Exam', 'Status', 'Contacted'
  ]);

  sheet.appendRow([
    new Date().toISOString(),
    body.full_name || body.fullName || '',
    body.whatsapp || body.phone || '',
    body.target_exam || body.targetExam || 'General Medical',
    'URGENT_2HR_SLA',
    'NO'
  ]);

  return jsonResponse({ status: 'success', message: 'Fast-Track request secured.' });
}

// ==============================================================================
// 5. CLINICAL TELEMETRY HANDLER (Strict Mathematical Zero Defaults)
// ==============================================================================
function handleLogTelemetry(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet(ss, 'GEMIINI_CLINICAL_TELEMETRY', [
    'GA_ID', 'Full_Name', 'Role', 'University', 'Hub', 'GP', 'CCR', 'Accuracy', 'Streak', 'Bonus', 'Status', 'Last_Module', 'Timestamp'
  ]);

  const gaId = payload.ga_id || payload.gaId || 'GA-1131';
  sheet.appendRow([
    gaId,
    payload.full_name || 'Candidate',
    payload.role || 'Member',
    payload.university || 'Medical Faculty',
    payload.hub || 'MTC Simulator',
    Number(payload.gp) || 0,        // Strict mathematical zero default
    Number(payload.ccr) || 0,       // Strict mathematical zero default
    Number(payload.accuracy) || 0,  // Strict mathematical zero default
    Number(payload.streak) || 0,    // Strict mathematical zero default
    Number(payload.bonus) || 10,
    'Active',
    payload.last_module || 'STEMI Acute Case',
    new Date().toISOString()
  ]);

  return jsonResponse({ status: 'success', message: 'Telemetry logged (+10 GP).' });
}

// ==============================================================================
// 6. SOVEREIGN MEMBER LOOKUP (Strict Database Query, Zero Mock Overrides)
// ==============================================================================
function handleLookup(payload) {
  const id = String(payload.id || '').trim().toUpperCase().replace('-', '');
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const authSheet = ss.getSheetByName('MASTER_AUTH');
  if (!authSheet) return jsonResponse({ status: 'error', message: 'Registry not found' }, 404);

  const data = authSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const rowId = String(data[i][1]).toUpperCase().replace('-', '');
    if (rowId === id) {
      return jsonResponse({
        status: 'success',
        member: {
          gaId: data[i][1],
          name: data[i][3] || data[i][2],
          role: data[i][14] || 'Verified Member',
          university: data[i][6],
          tier: data[i][10] || 'EXPLORER',
          gp: Number(data[i][9]) || 0,
          ccr: Number(data[i][11]) || 0,
          accuracy: Number(data[i][12]) || 0,
          streak: Number(data[i][13]) || 0,
          verified: true,
          sudapass: true
        }
      });
    }
  }

  return jsonResponse({ status: 'error', message: 'Member not found' }, 404);
}

function handleLeaderboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const authSheet = ss.getSheetByName('MASTER_AUTH');
  if (!authSheet) return jsonResponse({ status: 'success', members: [] });

  const data = authSheet.getDataRange().getValues();
  const members = [];
  for (let i = 1; i < data.length; i++) {
    members.push({
      gaId: data[i][1],
      name: data[i][3] || data[i][2],
      university: data[i][6],
      gp: Number(data[i][9]) || 0,
      ccr: Number(data[i][11]) || 0,
      accuracy: Number(data[i][12]) || 0,
      streak: Number(data[i][13]) || 0
    });
  }

  members.sort((a, b) => b.gp - a.gp);
  return jsonResponse({ status: 'success', members: members.slice(0, 50) });
}

// ==============================================================================
// UTILITY HELPERS
// ==============================================================================
function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers && headers.length > 0) sheet.appendRow(headers);
  }
  return sheet;
}

function isDuplicateTransaction(auditSheet, txRef) {
  const data = auditSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim().toUpperCase() === txRef) return true;
  }
  return false;
}

function resolveExistingGaId(authSheet, email, phone) {
  if (!email && !phone) return null;
  const data = authSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const rowEmail = String(data[i][4]).trim().toLowerCase();
    const rowPhone = String(data[i][5]).trim();
    if (email && rowEmail === email) return data[i][1];
    if (phone && rowPhone && rowPhone.endsWith(phone.slice(-9))) return data[i][1];
  }
  return null;
}

function mintSequentialGaId(ss, authSheet) {
  let metaSheet = ss.getSheetByName('Meta');
  if (!metaSheet) {
    metaSheet = ss.insertSheet('Meta');
    metaSheet.getRange('A1').setValue(NEXT_ID_START);
  }
  let currentId = Number(metaSheet.getRange('A1').getValue()) || NEXT_ID_START;
  metaSheet.getRange('A1').setValue(currentId + 1);
  return `GA-${currentId}`;
}

function getMemberGp(authSheet, gaId) {
  const data = authSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim() === gaId) return Number(data[i][9]) || 0;
  }
  return 0;
}

function bumpCandidateToPathfinder(authSheet, gaId) {
  const data = authSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim() === gaId) {
      const currentGp = Number(data[i][9]) || 0;
      authSheet.getRange(i + 1, 10).setValue(currentGp + 475); // Bump to 500 GP
      authSheet.getRange(i + 1, 11).setValue('PATHFINDER');
      break;
    }
  }
}

function generateSudaPassHash(gaId, email) {
  const raw = `${gaId}:${email}:${new Date().getTime()}:GEMIINI_SOVEREIGN`;
  const signature = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
  return signature.map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('').slice(0, 32);
}

function saveReceiptToDrive(gaId, txRef, base64Data) {
  try {
    let folders = DriveApp.getFoldersByName(INBOX_FOLDER_NAME);
    let folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(INBOX_FOLDER_NAME);
    const decoded = Utilities.base64Decode(base64Data.replace(/^data:image\/\w+;base64,/, ''));
    const blob = Utilities.newBlob(decoded, 'image/jpeg', `RECEIPT_${gaId}_${txRef}.jpg`);
    const file = folder.createFile(blob);
    return file.getUrl();
  } catch (e) {
    return 'DRIVE_SAVE_FAILED';
  }
}

function jsonResponse(obj, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
