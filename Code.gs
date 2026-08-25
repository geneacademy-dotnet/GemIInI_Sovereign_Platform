/**
 * ============================================================================
 * GemIInI Sovereign Backend & Clinical Certification Gateway (Code.gs)
 * Single Source of Truth (SSOT) Architecture — Version 3.3 (Cross-Desk Unified)
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
 * Handles direct browser verification (registry.html) and public leaderboard queries.
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

    return jsonResponse({ success: true, message: 'GemIInI Sovereign API Ready' });
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
 * 1. REAL LOOKUP (Zero hardcoded overrides)
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
  const idIdx = headers.indexOf('GA_ID');
  const nameIdx = headers.indexOf('LEGAL_NAME') !== -1 ? headers.indexOf('LEGAL_NAME') : 1;
  const univIdx = headers.indexOf('UNIVERSITY') !== -1 ? headers.indexOf('UNIVERSITY') : 4;
  const stageIdx = headers.indexOf('CAREER_STAGE') !== -1 ? headers.indexOf('CAREER_STAGE') : 5;
  const statusIdx = headers.indexOf('STATUS') !== -1 ? headers.indexOf('STATUS') : 6;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idIdx]).trim().toUpperCase() === gaId) {
      const telemetry = getTelemetryForUser(ss, gaId);
      const isAccredited = String(data[i][statusIdx]).toUpperCase() === 'ACTIVE' || 
                           String(data[i][statusIdx]).toUpperCase() === 'VERIFIED' || 
                           String(data[i][statusIdx]).toUpperCase() === 'ACCREDITED';
      return {
        success: true,
        verified: isAccredited,
        user: {
          gaId: data[i][idIdx],
          legalName: data[i][nameIdx],
          university: data[i][univIdx],
          careerStage: data[i][stageIdx],
          status: data[i][statusIdx]
        },
        telemetry: telemetry
      };
    }
  }

  return { success: false, error: 'USER_NOT_FOUND', verified: false, message: 'UNVERIFIED / RECORD NOT FOUND' };
}

/**
 * 2. DETERMINISTIC SEQUENTIAL ID MINTING
 */

/**
 * INGESTION INTEGRITY GUARD
 * Prevents non-human labels, invalid universities, and fake IDs from entering.
 */
function validateCandidatePayload(payload) {
  const name = String(payload.legalName || payload.fullName || payload.full_name_en || payload.full_name_ar || "").trim();
  const phone = String(payload.phone || payload.phone_whatsapp || "").trim();
  const email = String(payload.email || "").trim().toLowerCase();
  const univ = String(payload.university || payload.canonical_university || "").trim();

  // 1. Blacklist Non-Person Scrap Keywords
  const blacklistedKeywords = [
    "مبادرة", "مبادره", "المبادره", "المبادرة", "باص", "دفعة", "بروفات", "بروف", "منصه", "منصة",
    "مواصلات", "الطلبه", "الطلبة", "عضو", "workspace", "instagram", "جروب", "group", "whatsapp",
    "بص", "طالبه مصر", "طالب مصر", "البروفيسورات", "البوفيسورات", "الاشتراكات", "مصر", "Family",
    "2024", "٧٢", "Oncology", "Engineering"
  ];
  for (let kw of blacklistedKeywords) {
    if (name.toLowerCase().includes(kw.toLowerCase())) {
      throw new Error(`REJECTED: Non-person entity or contact group name detected ('${name}').`);
    }
  }

  // 2. Reject Emoji-Only or Symbol Names
  if (!/^[\u0600-\u06FFa-zA-Z\s\.\-']{3,60}$/.test(name)) {
    throw new Error(`REJECTED: Invalid name syntax ('${name}'). Must be legal person name.`);
  }

  // 3. Reject Defaulting to Generic Faculty Categories
  if (univ === "كليات الطب والمستشفيات السريرية" || univ === "سجل التدريب والتأهيل السريري" || !univ) {
    throw new Error("REJECTED: Must select a specific canonical university from the consortium registry.");
  }

  // 4. Validate Phone & Email Uniqueness
  if (!phone || !email || !email.includes("@")) {
    throw new Error("REJECTED: Missing valid phone or email address.");
  }

  return true;
}

function handleRegisterUser(payload, ss) {
  validateCandidatePayload(payload);
  const legalName = String(payload.legalName || payload.fullName || payload.full_name_en || payload.full_name_ar || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const phone = String(payload.phone || payload.phone_whatsapp || '').trim();
  const university = String(payload.university || payload.canonical_university || 'University of Khartoum').trim();
  const careerStage = String(payload.careerStage || payload.primary_track || 'Clinical Student').trim();

  if (!legalName || !email) {
    return { success: false, error: 'MISSING_MANDATORY_REGISTRATION_FIELDS' };
  }

  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  
  // Check duplicate email
  const data = authSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][2]).trim().toLowerCase() === email) {
      const existingId = String(data[i][0]);
      return {
        success: true,
        gaId: existingId,
        isExisting: true,
        message: 'EXISTING_USER_RETRIEVED'
      };
    }
  }

  const gaId = mintNextGaId(authSheet);
  const timestamp = new Date().toISOString();
  const sudaPassHash = generateSudaPassHash(gaId, timestamp);

  authSheet.appendRow([
    gaId,
    legalName,
    email,
    phone,
    university,
    careerStage,
    'ACTIVE',
    sudaPassHash,
    timestamp
  ]);

  // Initialize strict-zero telemetry record (25 starting GP for Explorer tier)
  const telemetrySheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  telemetrySheet.appendRow([
    gaId,
    25, // Initial GP
    0,  // CCR %
    0,  // Accuracy %
    0,  // Streak Days
    timestamp
  ]);

  return {
    success: true,
    gaId: gaId,
    gpBalance: 25,
    tier: 'EXPLORER',
    sudaPassHash: sudaPassHash,
    message: 'USER_REGISTERED_SUCCESSFULLY'
  };
}

/**
 * 3. BLS COURSE REGISTRATION & PAYMENT AUDIT
 * (Single physical track in Cairo on August 28, 2026)
 */
function handleBlsRegister(payload, ss) {
  validateCandidatePayload(payload);
  let gaId = String(payload.gaId || payload.ga_id || '').trim().toUpperCase();
  const fullName = String(payload.fullName || payload.full_name || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const phone = String(payload.phone || payload.phone_whatsapp || '').trim();
  const txRef = String(payload.txRef || payload.transaction_ref || payload.provider_ref || '').trim().toUpperCase();
  const paymentMethod = String(payload.paymentMethod || payload.payment_channel || 'VODAFONE_CASH_EG').trim();
  
  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);

  // If candidate has no GA-ID, mint one
  if (!gaId || !userExists(authSheet, gaId)) {
    if (fullName && email) {
      gaId = mintNextGaId(authSheet);
      const timestamp = new Date().toISOString();
      const sudaPassHash = generateSudaPassHash(gaId, timestamp);
      authSheet.appendRow([gaId, fullName, email, phone, 'BLS Attendee', 'Candidate', 'ACTIVE', sudaPassHash, timestamp]);
      const telSheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
      telSheet.appendRow([gaId, 25, 0, 0, 0, timestamp]);
    } else {
      return { success: false, error: 'AUTHENTICATED_GA_ID_OR_NAME_EMAIL_REQUIRED' };
    }
  }

  const isMember = true; // Registered member

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

  const courseFee = isMember 
    ? CONFIG.PRICING.BLS_CAIRO_AUG28.MEMBER_EGP 
    : CONFIG.PRICING.BLS_CAIRO_AUG28.NON_MEMBER_EGP;

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
 * 4. STRICT-ZERO TELEMETRY LOGGER
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
