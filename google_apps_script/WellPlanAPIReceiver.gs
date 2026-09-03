/**
 * ============================================================================
 * GemIInI SudaGene Platform — Internal CRM Webhook Receiver
 * Target Workbook: GemIInI Master Registry 2026 (1X74wS42KR5WpMusd8L_3-5LCDSIz9m7JHNdgY-rTbxs)
 * Action: Listens for member.registered and member.payment_verified events
 * Security: Requires AUTH_TOKEN. Thread-safe minting via LockService.
 * ============================================================================
 */

const CRM_CONFIG = {
  TARGET_SPREADSHEET_ID: '1X74wS42KR5WpMusd8L_3-5LCDSIz9m7JHNdgY-rTbxs',
  LOCK_WAIT_MS: 15000
};

// ==========================================
// 1. Core Utilities & Security
// ==========================================

function getScriptPropertySecure(key) {
  const value = PropertiesService.getScriptProperties().getProperty(key);
  if (!value) {
    throw new Error(`CRITICAL_SECURITY_HALT: ${key} is missing from Script Properties.`);
  }
  return value;
}

function generateHashSecure(gaId, timestamp) {
  const salt = getScriptPropertySecure('SECRET_SALT');
  const raw = gaId + '|' + timestamp + '|' + salt;
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
  return digest.map(b => (b < 0 ? b + 256 : b).toString(16).padStart(2, '0')).join('');
}

function getColumnIndexByName(sheet, columnName) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const index = headers.findIndex(h => String(h).trim().toLowerCase() === String(columnName).trim().toLowerCase());
  return index >= 0 ? index + 1 : -1;
}

// ==========================================
// 2. Webhook Entry Point
// ==========================================

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return respondJson({ status: "error", message: "No payload provided." }, 400);
    }
    
    const payload = JSON.parse(e.postData.contents);
    
    const expectedToken = getScriptPropertySecure('WEBHOOK_AUTH_TOKEN');
    if (payload.auth_token !== expectedToken) {
      return respondJson({ status: "error", message: "Unauthorized. Invalid token." }, 401);
    }
    
    const eventType = payload.event_type || (payload.order_id ? 'member.payment_verified' : 'member.registered');
    const rawEmail = payload.member?.email || payload.contact_email || payload.email;
    const rawName = payload.member?.name || payload.contact_name || [payload.first_name, payload.last_name].filter(Boolean).join(' ') || 'Candidate Doctor';
    const rawPhone = payload.member?.phone || payload.contact_phone || payload.phone || '';
    const rawUniv = payload.member?.university || payload.university || 'Sudanese Medical Faculty';
    
    if (!rawEmail) {
      return respondJson({ status: "error", message: "Contact email missing from payload." }, 400);
    }

    const email = String(rawEmail).trim().toLowerCase();
    
    const lock = LockService.getScriptLock();
    try {
      lock.waitLock(CRM_CONFIG.LOCK_WAIT_MS);
      return handleWebhookEvent(eventType, email, rawName, rawPhone, rawUniv);
    } catch (lockError) {
      return respondJson({ status: "error", message: "System busy. Could not acquire lock. Please retry." }, 429);
    } finally {
      try { lock.releaseLock(); } catch (ignored) {}
    }

  } catch (err) {
    return respondJson({ status: "error", message: err.toString() }, 500);
  }
}

// ==========================================
// 3. Business Logic
// ==========================================

function handleWebhookEvent(eventType, email, name, phone, univ) {
  const targetSs = SpreadsheetApp.openById(CRM_CONFIG.TARGET_SPREADSHEET_ID);
  const authSheet = targetSs.getSheetByName('MASTER_AUTH');
  const telSheet = targetSs.getSheetByName('TELEMETRY');
  
  if (!authSheet || !telSheet) {
    throw new Error("Missing MASTER_AUTH or TELEMETRY sheet in target spreadsheet.");
  }
  
  const timestamp = new Date().toISOString();

  // Find user dynamically using TextFinder
  const emailFinder = authSheet.createTextFinder(email).matchEntireCell(false).findNext();
  const existingUserRowIndex = emailFinder ? emailFinder.getRow() : -1;
  const existingGaId = existingUserRowIndex !== -1 ? String(authSheet.getRange(existingUserRowIndex, 1).getValue()).trim().toUpperCase() : null;

  if (eventType === 'member.registered') {
    if (existingUserRowIndex !== -1) {
      return respondJson({ status: "success", message: "User already exists. No action taken for registration.", ga_id: existingGaId });
    }
    
    // Calculate new GA-ID safely
    const authData = authSheet.getDataRange().getValues();
    let nextMintNumber = 1000;
    
    for (let i = 1; i < authData.length; i++) {
      const idMatch = String(authData[i][0]).match(/^GA-(\d+)$/i);
      if (idMatch && parseInt(idMatch[1], 10) > nextMintNumber) {
        nextMintNumber = parseInt(idMatch[1], 10);
      }
    }
    
    const gaId = 'GA-' + (nextMintNumber + 1);
    const sudaHash = generateHashSecure(gaId, timestamp);
    
    const sourceChannel = 'WELLPLAN_WEBHOOK';
    authSheet.appendRow([
      gaId, name, email, phone, univ, '', '', 'Medical Practitioner', 
      'PENDING_REVIEW', sudaHash, timestamp, sourceChannel
    ]);
    
    telSheet.appendRow([gaId, 25, 0, 0, 0, timestamp]);
    
    return respondJson({ status: "success", message: "User registered. 25 GP awarded.", ga_id: gaId });
      
  } else if (eventType === 'member.payment_verified') {
    if (existingUserRowIndex === -1) {
      return respondJson({ status: "error", message: "User not found. Cannot verify payment." }, 404);
    }
    
    // Update Payment / Review Status in MASTER_AUTH
    const statusColIndex = getColumnIndexByName(authSheet, 'Status') || 9;
    authSheet.getRange(existingUserRowIndex, statusColIndex).setValue('ACCREDITED');
    
    // Find row in TELEMETRY using TextFinder
    const idFinder = telSheet.createTextFinder(existingGaId).matchEntireCell(true).findNext();
    
    if (idFinder) {
      const telRowIndex = idFinder.getRow();
      const gpColIndex = getColumnIndexByName(telSheet, 'GP') || 2;
      
      const currentGP = parseFloat(telSheet.getRange(telRowIndex, gpColIndex).getValue()) || 0;
      telSheet.getRange(telRowIndex, gpColIndex).setValue(currentGP + 475);
    }
    
    try {
      sendPaymentVerifiedEmail(email, name, existingGaId);
    } catch (err) {
      console.error("Failed to send payment email: " + err.message);
    }

    return respondJson({ status: "success", message: "Payment verified. 475 GP bump applied (500 GP total Pathfinder). Status set to ACCREDITED.", ga_id: existingGaId });
      
  } else {
    return respondJson({ status: "error", message: `Unknown event_type: ${eventType}` }, 400);
  }
}

// ==========================================
// 4. Response Helper
// ==========================================

function respondJson(data, statusCode = 200) {
  const responseData = { ...data, http_status: statusCode };
  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

// ==========================================
// 5. EMAIL DISPATCH SYSTEM
// ==========================================

function sendPaymentVerifiedEmail(recipientEmail, legalName, gaId) {
  const subject = "اعتماد السداد والترقية للزمالة السريرية | GemIInI Independent Framework";
  const body = `الزميل(ة) الكريم(ة) د. ${legalName}،

تحية طيبة،

تم استلام وتوثيق السداد بنجاح عبر السجل المركزي المعتمد. 

نفيدكم بأنه تم ترقية حالة حسابكم السريري (GA-ID: ${gaId}) إلى حالة الاعتماد الكامل (ACCREDITED).
كما تم إضافة 475 نقطة استحقاق (475 GP) إلى رصيدكم، ليكون إجمالي الرصيد 500 GP (مستوى Pathfinder) في المنظومة.

بصفتك عضواً معتمداً، يحق لك الآن:
1. الانضمام إلى الكتل السريرية المغلقة وبنوك امتحانات المجلس الطبي (SMC Mock Bank).
2. استلام شهادات إتمام المحاكاة الموثقة في السجل السيادي.
3. التمتع بأولوية التسجيل في ورش العمل الحضورية المعتمدة (مثل BLS / BSS-2).

للتواصل أو الاستفسارات، يمكنكم الرد مباشرة على هذا البريد.

The Admissions & Operations Desk
GemIInI Academy & SudaGene Consortium
https://geneacademy.net`;

  GmailApp.sendEmail(recipientEmail, subject, body, {
    from: 'admissions@geneacademy.net',
    name: 'GemIInI Admissions Desk'
  });
}
