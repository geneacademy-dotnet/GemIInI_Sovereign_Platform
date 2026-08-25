/**
 * ============================================================================
 * GemIInI Sovereign Backend & Clinical Certification Gateway (Code.gs)
 * Single Source of Truth (SSOT) Architecture — Version 4.0 (Registration Flow v4.0)
 * Target Workbook: GemIInI Master Registry 2026 (1X74wS42KR5WpMusd8L_3-5LCDSIz9m7JHNdgY-rTbxs)
 * ============================================================================
 */

const CONFIG = {
  SHEET_AUTH: 'MASTER_AUTH',
  SHEET_PAYMENTS: 'PAYMENT_AUDIT_LOG',
  SHEET_TELEMETRY: 'TELEMETRY',
  SHEET_QUEUE: 'QUEUE_FALLBACK',
  SHEET_ROSTER: 'BLS_ROSTER',
  SECRET_SALT: 'GEMIINI_SOVEREIGN_SALT_2026',
  LOCK_TIMEOUT_MS: 15000,
  PRICING: {
    BLS_CAIRO_AUG28: {
      MEMBER_EGP: 2000,
      NON_MEMBER_EGP: 3500,
      CURRENCY: 'EGP',
      CAPACITY_MAX: 12
    }
  }
};

/**
 * Public Sanitized Read API (doGet)
 */
function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = String(params.action || 'lookup').toUpperCase();
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'LOOKUP' || action === 'VERIFY') {
      return jsonResponse(handleLookup({ gaId: params.id || params.gaId }, ss));
    }

    if (action === 'LEADERBOARD') {
      return jsonResponse(handleLeaderboard(params, ss));
    }

    return jsonResponse({ success: true, message: 'GemIInI Sovereign API Ready (v4.0)' });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

/**
 * Transactional Mutating API (doPost)
 * Wrapped under LockService concurrency control.
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);
    
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, error: 'EMPTY_PAYLOAD' }, 400);
    }
    
    const payload = JSON.parse(e.postData.contents);
    const action = String(payload.action || '').toUpperCase();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    switch (action) {
      case 'LOOKUP':
      case 'VERIFY':
        return jsonResponse(handleLookup(payload, ss));
        
      case 'REGISTER_USER':
      case 'REGISTER':
      case 'PORTAL_INTAKE':
        return jsonResponse(handleRegisterUser(payload, ss));
        
      case 'BLS_REGISTER':
      case 'SUBMIT_BLS':
        return jsonResponse(handleBlsRegister(payload, ss));
        
      case 'LOG_TELEMETRY':
      case 'LOG_CLINICAL_ATTEMPT':
        return jsonResponse(handleLogTelemetry(payload, ss));
        
      case 'LEADERBOARD':
        return jsonResponse(handleLeaderboard(payload, ss));
        
      default:
        return jsonResponse({ success: false, error: 'INVALID_ACTION: ' + action }, 400);
    }
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  } finally {
    lock.releaseLock();
  }
}

/**
 * 1. REAL LOOKUP (Strict querying, zero mock overrides)
 */
function handleLookup(payload, ss) {
  const gaId = String(payload.gaId || payload.id || '').trim().toUpperCase();
  if (!gaId) {
    return { success: false, error: 'GA_ID_REQUIRED' };
  }

  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const data = authSheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return { success: false, error: 'USER_NOT_FOUND', verified: false };
  }

  const headers = data[0];
  const idIdx = headers.indexOf('GA_ID') !== -1 ? headers.indexOf('GA_ID') : 0;
  const nameIdx = headers.indexOf('LEGAL_NAME') !== -1 ? headers.indexOf('LEGAL_NAME') : 1;
  const emailIdx = headers.indexOf('EMAIL') !== -1 ? headers.indexOf('EMAIL') : 2;
  const phoneIdx = headers.indexOf('PHONE') !== -1 ? headers.indexOf('PHONE') : 3;
  const univIdx = headers.indexOf('UNIVERSITY') !== -1 ? headers.indexOf('UNIVERSITY') : 4;
  const stageIdx = headers.indexOf('CAREER_STAGE') !== -1 ? headers.indexOf('CAREER_STAGE') : 5;
  const statusIdx = headers.indexOf('STATUS') !== -1 ? headers.indexOf('STATUS') : 6;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idIdx]).trim().toUpperCase() === gaId) {
      const telemetry = getTelemetryForUser(ss, gaId);
      const rawStatus = String(data[i][statusIdx]).toUpperCase();
      const isAccredited = rawStatus === 'ACTIVE' || rawStatus === 'VERIFIED' || rawStatus === 'ACCREDITED';
      return {
        success: true,
        verified: isAccredited,
        status: rawStatus,
        user: {
          gaId: data[i][idIdx],
          legalName: data[i][nameIdx],
          university: data[i][univIdx],
          careerStage: data[i][stageIdx],
          status: rawStatus
        },
        telemetry: telemetry
      };
    }
  }

  return { success: false, error: 'USER_NOT_FOUND', verified: false, message: 'UNVERIFIED / RECORD NOT FOUND' };
}

/**
 * 2. REGISTRATION FLOW v4.0 (STRICT GATEWAY WITH CROSS-CHECKS)
 */
function handleRegisterUser(payload, ss) {
  const name = String(payload.legalName || payload.fullName || payload.full_name_en || payload.full_name_ar || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const phone = String(payload.phone || payload.phone_whatsapp || '').trim();
  const univ = String(payload.university || payload.canonical_university || '').trim();
  const careerStage = String(payload.careerStage || payload.primary_track || 'Clinical Student').trim();

  // 1. Validate Legal Name (At least 2 words, no emojis, no single handles)
  const nameWords = name.split(/\s+/);
  if (nameWords.length < 2 || !/^[\u0600-\u06FFa-zA-Z\s\.\-']{4,60}$/.test(name)) {
    return {
      success: false,
      status: 'REJECTED',
      reason: 'INVALID_NAME',
      message: 'Please provide your full legal name (first and last name) as registered with your medical council/faculty.'
    };
  }

  // 2. Validate Email
  if (!email || !email.includes('@') || email.length < 5) {
    return {
      success: false,
      status: 'REJECTED',
      reason: 'INVALID_EMAIL',
      message: 'A valid institutional or personal email address is required.'
    };
  }

  // 3. Validate Phone Number (At least 8 digits)
  const phoneDigits = phone.replace(/\D/g, '');
  if (!phone || phoneDigits.length < 8) {
    return {
      success: false,
      status: 'REJECTED',
      reason: 'INVALID_PHONE',
      message: 'A valid WhatsApp phone number with international country code is required.'
    };
  }

  // 4. Validate Canonical University (Reject blank or generic placeholders)
  if (!univ || univ === 'كليات الطب والمستشفيات السريرية' || univ === 'سجل التدريب والتأهيل السريري' || univ === 'Pending Institution Intake') {
    return {
      success: false,
      status: 'REJECTED',
      reason: 'INVALID_UNIVERSITY',
      message: 'Please select a specific canonical university or medical faculty from the registry.'
    };
  }

  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const data = authSheet.getDataRange().getValues();

  // 5. Cross-Check Email against ALL records in MASTER_AUTH
  for (let i = 1; i < data.length; i++) {
    const rowEmail = String(data[i][2]).trim().toLowerCase();
    if (rowEmail === email) {
      const existingId = String(data[i][0]);
      const existingName = String(data[i][1]);
      const existingUniv = String(data[i][4]);
      const existingStatus = String(data[i][6]).toUpperCase();
      const telemetry = getTelemetryForUser(ss, existingId);

      return {
        success: true,
        status: 'EXISTING_USER',
        gaId: existingId,
        legalName: existingName,
        university: existingUniv,
        userStatus: existingStatus,
        gpBalance: telemetry.gp || (existingStatus === 'VERIFIED' ? 500 : 25),
        message: 'Welcome back! We found your existing record: ' + existingId
      };
    }
  }

  // 6. Cross-Check Phone against ALL records in MASTER_AUTH
  const phoneLast8 = phoneDigits.slice(-8);
  for (let i = 1; i < data.length; i++) {
    const rowPhone = String(data[i][3]).replace(/\D/g, '');
    if (rowPhone && rowPhone.slice(-8) === phoneLast8) {
      // Phone matches but email is different -> Flag as POTENTIAL_DUPLICATE
      return {
        success: false,
        status: 'REVIEW_REQUIRED',
        reason: 'PHONE_EXISTS',
        message: 'This phone number is associated with another record in our registry. Please contact admissions on WhatsApp (+20 101 592 2628) to verify your identity.'
      };
    }
  }

  // 7. ALL CHECKS PASSED: Mint Next Sequential GA-ID with PENDING_REVIEW Status
  const gaId = mintNextGaId(authSheet);
  const timestamp = new Date().toISOString();
  const sudaPassHash = generateSudaPassHash(gaId, timestamp);

  authSheet.appendRow([
    gaId,
    name,
    email,
    phone,
    univ,
    careerStage,
    'PENDING_REVIEW', // STRICT: NOT ACTIVE UNTIL ADMIN VERIFICATION
    sudaPassHash,
    timestamp
  ]);

  // Initialize strict-zero telemetry record (25 starting GP for Explorer tier)
  const telemetrySheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  telemetrySheet.appendRow([
    gaId,
    25, // Starting Provisional Explorer GP
    0,  // CCR %
    0,  // Accuracy %
    0,  // Streak Days
    timestamp
  ]);

  return {
    success: true,
    status: 'PENDING_REVIEW',
    gaId: gaId,
    legalName: name,
    university: univ,
    gpBalance: 25,
    tier: 'EXPLORER',
    sudaPassHash: sudaPassHash,
    message: 'Application received! Your provisional ID is ' + gaId + '. An admissions officer will review your credentials within 24 hours.'
  };
}

/**
 * 3. BLS COURSE REGISTRATION & PAYMENT AUDIT
 * (Single physical track in Cairo on August 28, 2026)
 */
function handleBlsRegister(payload, ss) {
  let gaId = String(payload.gaId || payload.ga_id || '').trim().toUpperCase();
  const fullName = String(payload.fullName || payload.full_name || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const phone = String(payload.phone || payload.phone_whatsapp || '').trim();
  const txRef = String(payload.txRef || payload.transaction_ref || payload.provider_ref || '').trim().toUpperCase();
  const paymentMethod = String(payload.paymentMethod || payload.payment_channel || 'VODAFONE_CASH_EG').trim();
  
  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);

  // If candidate has no GA-ID, mint one under PENDING_REVIEW
  if (!gaId || !userExists(authSheet, gaId)) {
    if (fullName && email) {
      gaId = mintNextGaId(authSheet);
      const timestamp = new Date().toISOString();
      const sudaPassHash = generateSudaPassHash(gaId, timestamp);
      authSheet.appendRow([gaId, fullName, email, phone, 'BLS Candidate Faculty', 'Candidate', 'PENDING_REVIEW', sudaPassHash, timestamp]);
      const telSheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
      telSheet.appendRow([gaId, 25, 0, 0, 0, timestamp]);
    } else {
      return { success: false, error: 'AUTHENTICATED_GA_ID_OR_NAME_EMAIL_REQUIRED' };
    }
  }

  // Check seat capacity (12 Max)
  const rosterSheet = getOrCreateSheet(ss, CONFIG.SHEET_ROSTER);
  const currentRosterSize = Math.max(0, rosterSheet.getLastRow() - 1);
  if (currentRosterSize >= CONFIG.PRICING.BLS_CAIRO_AUG28.CAPACITY_MAX) {
    return { success: false, error: 'ROSTER_FULL_WAITLIST_AVAILABLE', waitlist: true };
  }

  // Deduplicate Transaction Reference
  const paymentSheet = getOrCreateSheet(ss, CONFIG.SHEET_PAYMENTS);
  if (txRef && isDuplicateTransaction(paymentSheet, txRef)) {
    return { success: false, error: 'DUPLICATE_TRANSACTION_REFERENCE' };
  }

  const courseFee = CONFIG.PRICING.BLS_CAIRO_AUG28.MEMBER_EGP;
  const timestamp = new Date().toISOString();

  // Log Payment Audit
  paymentSheet.appendRow([
    timestamp,
    gaId,
    txRef,
    paymentMethod,
    courseFee,
    CONFIG.PRICING.BLS_CAIRO_AUG28.CURRENCY,
    'PENDING_VERIFICATION',
    'BLS_CAIRO_AUG28'
  ]);

  // Log Roster
  rosterSheet.appendRow([
    gaId,
    'AHA_BLS_PROVIDER',
    '2026-08-28',
    'Cairo Simulation Center (Amanirena Hub)',
    courseFee,
    txRef,
    'CONFIRMED_PENDING_PAYMENT_CLEAR'
  ]);

  return {
    success: true,
    gaId: gaId,
    courseFee: courseFee,
    currency: CONFIG.PRICING.BLS_CAIRO_AUG28.CURRENCY,
    sessionDate: '2026-08-28',
    venue: 'Cairo Simulation Center (Amanirena Hub)',
    rosterIndex: currentRosterSize + 1
  };
}

/**
 * 4. STRICT TELEMETRY LOGGER
 */
function handleLogTelemetry(payload, ss) {
  const gaId = String(payload.gaId || payload.ga_id || '').trim().toUpperCase();
  if (!gaId) {
    return { success: false, error: 'GA_ID_REQUIRED' };
  }

  const scorePercent = Math.max(0, Math.min(100, Number(payload.scorePercent || payload.score) || 0));
  const passed = scorePercent >= 70;
  const earnedGp = passed ? 10 : 2;

  const telemetrySheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  const data = telemetrySheet.getDataRange().getValues();
  const timestamp = new Date().toISOString();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === gaId) {
      const currentGp = Number(data[i][1]) || 0;
      const currentCcr = Number(data[i][2]) || 0;
      const currentAcc = Number(data[i][3]) || 0;
      const currentStreak = Number(data[i][4]) || 0;

      const newGp = currentGp + earnedGp;
      const newCcr = Math.min(100, currentCcr + 5);
      const newAcc = currentAcc === 0 ? scorePercent : Math.round((currentAcc + scorePercent) / 2);
      const newStreak = currentStreak + 1;

      telemetrySheet.getRange(i + 1, 2, 1, 5).setValues([[
        newGp,
        newCcr,
        newAcc,
        newStreak,
        timestamp
      ]]);

      return {
        success: true,
        updated: true,
        gaId: gaId,
        gp: newGp,
        ccr: newCcr,
        accuracy: newAcc,
        streak: newStreak,
        earnedGp: earnedGp
      };
    }
  }

  // New telemetry row if not present
  telemetrySheet.appendRow([gaId, earnedGp, 5, scorePercent, 1, timestamp]);
  return {
    success: true,
    created: true,
    gaId: gaId,
    gp: earnedGp,
    ccr: 5,
    accuracy: scorePercent,
    streak: 1,
    earnedGp: earnedGp
  };
}

/**
 * 5. LEADERBOARD COMPUTATION
 */
function handleLeaderboard(payload, ss) {
  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const telSheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  
  const authData = authSheet.getDataRange().getValues();
  const telData = telSheet.getDataRange().getValues();
  
  const telMap = {};
  for (let i = 1; i < telData.length; i++) {
    const id = String(telData[i][0]).trim().toUpperCase();
    telMap[id] = {
      gp: Number(telData[i][1]) || 0,
      ccr: Number(telData[i][2]) || 0,
      accuracy: Number(telData[i][3]) || 0,
      streak: Number(telData[i][4]) || 0
    };
  }

  const candidates = [];
  for (let i = 1; i < authData.length; i++) {
    const id = String(authData[i][0]).trim().toUpperCase();
    if (!id) continue;

    const t = telMap[id] || { gp: 0, ccr: 0, accuracy: 0, streak: 0 };
    const sRank = t.gp + (t.ccr * 10) + (t.accuracy * 5) + (t.streak * 20);

    candidates.push({
      id: id,
      name: String(authData[i][1]),
      university: String(authData[i][4]),
      careerStage: String(authData[i][5]),
      gp: t.gp,
      ccr: t.ccr,
      accuracy: t.accuracy,
      streak: t.streak,
      sRank: Math.round(sRank)
    });
  }

  candidates.sort((a, b) => b.sRank - a.sRank);
  return {
    success: true,
    count: candidates.length,
    items: candidates.slice(0, 50)
  };
}

/**
 * HELPER UTILITIES
 */
function mintNextGaId(authSheet) {
  const data = authSheet.getDataRange().getValues();
  if (data.length <= 1) {
    return 'GA-1001';
  }
  
  let maxId = 1000;
  for (let i = 1; i < data.length; i++) {
    const rawId = String(data[i][0]);
    const match = rawId.match(/^GA-(\d+)$/i);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxId) maxId = num;
    }
  }
  return 'GA-' + (maxId + 1);
}

function generateSudaPassHash(gaId, timestamp) {
  const raw = gaId + '|' + timestamp + '|' + CONFIG.SECRET_SALT;
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
  return digest.map(function(byte) {
    const v = (byte < 0 ? byte + 256 : byte).toString(16);
    return v.length === 1 ? '0' + v : v;
  }).join('');
}

function isDuplicateTransaction(paymentSheet, txRef) {
  if (!txRef) return false;
  const data = paymentSheet.getDataRange().getValues();
  const normalized = String(txRef).trim().toUpperCase();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][2]).trim().toUpperCase() === normalized) {
      return true;
    }
  }
  return false;
}

function userExists(authSheet, gaId) {
  const data = authSheet.getDataRange().getValues();
  const normalized = String(gaId).trim().toUpperCase();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === normalized) return true;
  }
  return false;
}

function getTelemetryForUser(ss, gaId) {
  const sheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  const data = sheet.getDataRange().getValues();
  const normalized = String(gaId).trim().toUpperCase();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === normalized) {
      return {
        gp: Number(data[i][1]) || 0,
        ccr: Number(data[i][2]) || 0,
        accuracy: Number(data[i][3]) || 0,
        streak: Number(data[i][4]) || 0,
        lastUpdated: data[i][5] || null
      };
    }
  }
  return { gp: 0, ccr: 0, accuracy: 0, streak: 0, lastUpdated: null };
}

function getOrCreateSheet(ss, sheetName) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (sheetName === CONFIG.SHEET_AUTH) {
      sheet.appendRow(['GA_ID', 'LEGAL_NAME', 'EMAIL', 'PHONE', 'UNIVERSITY', 'CAREER_STAGE', 'STATUS', 'SUDAPASS_HASH', 'CREATED_AT']);
    } else if (sheetName === CONFIG.SHEET_PAYMENTS) {
      sheet.appendRow(['TIMESTAMP', 'GA_ID', 'TX_REF', 'PAYMENT_METHOD', 'AMOUNT', 'CURRENCY', 'STATUS', 'COURSE_CODE']);
    } else if (sheetName === CONFIG.SHEET_TELEMETRY) {
      sheet.appendRow(['GA_ID', 'GP', 'CCR_PERCENT', 'ACCURACY_PERCENT', 'STREAK_DAYS', 'LAST_UPDATED']);
    } else if (sheetName === CONFIG.SHEET_ROSTER) {
      sheet.appendRow(['GA_ID', 'COURSE_NAME', 'DATE', 'VENUE', 'FEE_PAID', 'TX_REF', 'STATUS']);
    }
  }
  return sheet;
}

function jsonResponse(obj, status) {
  const output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
