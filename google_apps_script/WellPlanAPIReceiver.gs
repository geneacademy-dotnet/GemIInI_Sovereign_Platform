/**
 * ============================================================================
 * GemIInI SudaGene Platform â€” Internal CRM Webhook Receiver
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
  const subject = "Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ø³Ø¯Ø§Ø¯ ÙˆØ§Ù„ØªØ±Ù‚ÙŠØ© Ù„Ù„Ø²Ù…Ø§Ù„Ø© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© | GemIInI Independent Framework";
  const body = `Ø§Ù„Ø²Ù…ÙŠÙ„(Ø©) Ø§Ù„ÙƒØ±ÙŠÙ…(Ø©) Ø¯. ${legalName}ØŒ

ØªØ­ÙŠØ© Ø·ÙŠØ¨Ø©ØŒ

ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… ÙˆØªÙˆØ«ÙŠÙ‚ Ø§Ù„Ø³Ø¯Ø§Ø¯ Ø¨Ù†Ø¬Ø§Ø­ Ø¹Ø¨Ø± Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯. 

Ù†ÙÙŠØ¯ÙƒÙ… Ø¨Ø£Ù†Ù‡ ØªÙ… ØªØ±Ù‚ÙŠØ© Ø­Ø§Ù„Ø© Ø­Ø³Ø§Ø¨ÙƒÙ… Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ (GA-ID: ${gaId}) Ø¥Ù„Ù‰ Ø­Ø§Ù„Ø© Ø§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„ÙƒØ§Ù…Ù„ (ACCREDITED).
ÙƒÙ…Ø§ ØªÙ… Ø¥Ø¶Ø§ÙØ© 475 Ù†Ù‚Ø·Ø© Ø§Ø³ØªØ­Ù‚Ø§Ù‚ (475 GP) Ø¥Ù„Ù‰ Ø±ØµÙŠØ¯ÙƒÙ…ØŒ Ù„ÙŠÙƒÙˆÙ† Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø±ØµÙŠØ¯ 500 GP (Ù…Ø³ØªÙˆÙ‰ Pathfinder) ÙÙŠ Ø§Ù„Ù…Ù†Ø¸ÙˆÙ…Ø©.

Ø¨ØµÙØªÙƒ Ø¹Ø¶ÙˆØ§Ù‹ Ù…Ø¹ØªÙ…Ø¯Ø§Ù‹ØŒ ÙŠØ­Ù‚ Ù„Ùƒ Ø§Ù„Ø¢Ù†:
1. Ø§Ù„Ø§Ù†Ø¶Ù…Ø§Ù… Ø¥Ù„Ù‰ Ø§Ù„ÙƒØªÙ„ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© Ø§Ù„Ù…ØºÙ„Ù‚Ø© ÙˆØ¨Ù†ÙˆÙƒ Ø§Ù…ØªØ­Ø§Ù†Ø§Øª Ø§Ù„Ù…Ø¬Ù„Ø³ Ø§Ù„Ø·Ø¨ÙŠ (SMC Mock Bank).
2. Ø§Ø³ØªÙ„Ø§Ù… Ø´Ù‡Ø§Ø¯Ø§Øª Ø¥ØªÙ…Ø§Ù… Ø§Ù„Ù…Ø­Ø§ÙƒØ§Ø© Ø§Ù„Ù…ÙˆØ«Ù‚Ø© ÙÙŠ Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ.
3. Ø§Ù„ØªÙ…ØªØ¹ Ø¨Ø£ÙˆÙ„ÙˆÙŠØ© Ø§Ù„ØªØ³Ø¬ÙŠÙ„ ÙÙŠ ÙˆØ±Ø´ Ø§Ù„Ø¹Ù…Ù„ Ø§Ù„Ø­Ø¶ÙˆØ±ÙŠØ© Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø© (Ù…Ø«Ù„ BLS / BSS-2).

Ù„Ù„ØªÙˆØ§ØµÙ„ Ø£Ùˆ Ø§Ù„Ø§Ø³ØªÙØ³Ø§Ø±Ø§ØªØŒ ÙŠÙ…ÙƒÙ†ÙƒÙ… Ø§Ù„Ø±Ø¯ Ù…Ø¨Ø§Ø´Ø±Ø© Ø¹Ù„Ù‰ Ù‡Ø°Ø§ Ø§Ù„Ø¨Ø±ÙŠØ¯.

The Admissions & Operations Desk
GemIInI Academy & SudaGene Consortium
https://geneacademy.net`;

  GmailApp.sendEmail(recipientEmail, subject, body, {
    from: 'admissions@geneacademy.net',
    name: 'GemIInI Admissions Desk'
  });
}
