/**
 * GemIInI Sovereign Platform & SudaGene Consortium - Master Backend Engine
 * 
 * Features:
 * 1. Concurrency control via LockService.getScriptLock(10000)
 * 2. Sequential GA-ID minting based on master row counts (GA-1001+)
 * 3. Universal parameter mapping (supports camelCase & snake_case)
 * 4. Real-time Telemetry Email Alerts to amjadgorashi32@gmail.com
 * 5. Public lookup and verification endpoint via doGet(e)
 */

var MASTER_SHEET_NAME = 'GA_MASTER_REGISTRY';
var COUNTER_CELL = 'A1';
var NEXT_ID_START = 6291;

/**
 * Handle POST requests (Registrations & Ledger Sync)
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // 10-second concurrency lock
  } catch (lockErr) {
    return jsonResponse({
      status: 'error',
      message: 'Server is experiencing high traffic. Please retry in a few moments.'
    }, 429);
  }

  try {
    var rawContents = (e && e.postData && e.postData.contents) ? e.postData.contents : '';
    var payload = {};

    if (rawContents) {
      try {
        payload = JSON.parse(rawContents);
      } catch (jsonErr) {
        // Fallback for urlencoded form posts
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    var action = payload.action || (payload.body && payload.body.action) || 'bls_register';
    var body = payload.body || payload;

    // Standardize input fields across both naming conventions
    var fullName = String(body.fullName || body.full_name || body.name || '').trim();
    var email = String(body.email || '').trim().toLowerCase();
    var phone = String(body.phone || body.phoneNumber || '').trim();
    var university = String(body.university || body.univ || 'General').trim();
    var track = String(body.track || body.targetTrack || 'SMC / BLS').trim();
    var gradYear = String(body.gradYear || body.grad_year || '2024').trim();
    var location = String(body.location || 'Egypt').trim();
    var paymentMethod = String(body.paymentMethod || body.payment_method || (body.gp_applied ? 'GP' : 'Vodafone Cash')).trim();
    var providerRef = String(body.providerRef || body.transaction_id || body.refNumber || 'N/A').trim();
    var referralId = String(body.referralId || body.referral_id || 'GA-000').trim().toUpperCase();
    var gpAwarded = Number(body.gpAwarded || (body.boughtCoffee || body.patron_booster ? 250 : 200));

    if (!fullName || !email || !phone) {
      return jsonResponse({
        status: 'error',
        message: 'Missing mandatory fields (fullName, email, phone).'
      }, 400);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(MASTER_SHEET_NAME) || createMasterSheet(ss);

    // Generate sequential GA-ID
    var gaId = getNextSequentialGaId(ss, sheet);
    var timestamp = new Date();
    var status = body.gp_applied ? 'pending_gp_confirmation' : 'pending_payment_verification';

    sheet.appendRow([
      timestamp,
      gaId,
      fullName,
      email,
      phone,
      university,
      gradYear,
      location,
      track,
      paymentMethod,
      providerRef,
      referralId,
      gpAwarded,
      status,
      false // sabri_cv_unlocked / digital_bonus_unlocked
    ]);

    // Dispatch Real-Time Telemetry Email Alert to Information Office
    dispatchCandidateAlert({
      fullName: fullName,
      email: email,
      phone: phone,
      university: university,
      track: track,
      gaId: gaId,
      paymentMethod: paymentMethod,
      providerRef: providerRef
    });

    return jsonResponse({
      status: 'success',
      gaId: gaId,
      gpBalance: gpAwarded,
      registrationStatus: status,
      digitalBonusUnlocked: false,
      message: 'Registration recorded successfully in SudaGene Sovereign Ledger.'
    }, 200);

  } catch (err) {
    return jsonResponse({
      status: 'error',
      message: 'Internal ledger processing error: ' + err.toString()
    }, 500);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Handle GET requests (Public Member & Credential Verification)
 */
function doGet(e) {
  var params = (e && e.parameter) ? e.parameter : {};
  var action = params.action || 'lookup';
  var queryId = String(params.id || params.q || params.gaId || '').trim().toUpperCase();

  if (action === 'stats') {
    return jsonResponse({
      status: 'success',
      members: 2441,
      courses: 28,
      vignettes: 2500,
      faculties: 54
    });
  }

  if (!queryId) {
    return jsonResponse({ status: 'error', message: 'No GA-ID provided for lookup.' }, 400);
  }

  var normalizedId = queryId.startsWith('GA-') ? queryId : 'GA-' + queryId.replace('GA', '');

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(MASTER_SHEET_NAME);

  if (!sheet) {
    return jsonResponse({ status: 'not_found', message: 'Ledger table not initialized.' }, 404);
  }

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var rowGaId = String(row[1] || '').trim().toUpperCase();

    if (rowGaId === normalizedId) {
      return jsonResponse({
        status: 'found',
        gaId: rowGaId,
        name: row[2],
        university: row[5],
        track: row[8],
        gp: row[12] || 200,
        verified: true,
        tier: 'ACCREDITED'
      });
    }
  }

  return jsonResponse({
    status: 'not_found',
    gaId: normalizedId,
    verified: false,
    message: 'ID not found in master ledger.'
  }, 404);
}

/**
 * Real-Time Telemetry Alert Dispatcher (SudaGene Global Network)
 */
function dispatchCandidateAlert(data) {
  try {
    var recipient = 'amjadgorashi32@gmail.com';
    var candidateName = data.fullName || 'Anonymous Doctor';
    var track = data.track || 'SMC / BLS';
    var phone = data.phone || 'N/A';
    var gaId = data.gaId || 'GA-PENDING';
    var email = data.email || 'N/A';
    var university = data.university || 'N/A';
    var paymentMethod = data.paymentMethod || 'Vodafone Cash';
    var providerRef = data.providerRef || 'N/A';

    var subject = '[SudaGene Alert] New Node Activated: ' + candidateName + ' - ' + track;
    
    var body = '=== SUDAGENE GLOBAL OPERATIONS ALERT ===\n\n' +
      'A new clinical candidate node has been activated on the Sovereign Gateway:\n\n' +
      '• Candidate Name:  ' + candidateName + '\n' +
      '• Minted GA-ID:    ' + gaId + '\n' +
      '• Track / Target:  ' + track + '\n' +
      '• WhatsApp Phone:  ' + phone + '\n' +
      '• Email Address:   ' + email + '\n' +
      '• University:      ' + university + '\n' +
      '• Payment Rail:    ' + paymentMethod + ' (' + providerRef + ')\n' +
      '• Activation Time: ' + new Date().toISOString() + '\n\n' +
      'Audit Reference: SudaGene-MoeGene-Telemetry\n' +
      '========================================';

    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      body: body
    });
    Logger.log('Alert email dispatched to ' + recipient + ' for ' + gaId);
  } catch (err) {
    Logger.log('Failed to dispatch alert email: ' + err.toString());
  }
}

/**
 * Mint the next sequential GA-ID with fallback
 */
function getNextSequentialGaId(ss, sheet) {
  try {
    var meta = ss.getSheetByName('Meta');
    if (!meta) {
      meta = ss.insertSheet('Meta');
      meta.getRange(COUNTER_CELL).setValue(NEXT_ID_START);
    }
    var current = meta.getRange(COUNTER_CELL).getValue();
    var next = Number(current) || NEXT_ID_START;
    meta.getRange(COUNTER_CELL).setValue(next + 1);
    return 'GA-' + next;
  } catch (e) {
    var rowCount = sheet.getLastRow();
    return 'GA-' + (1000 + rowCount);
  }
}

/**
 * Initialize Master Ledger Sheet
 */
function createMasterSheet(ss) {
  var sheet = ss.insertSheet(MASTER_SHEET_NAME);
  sheet.appendRow([
    'Timestamp',
    'GA-ID',
    'Full Name',
    'Email',
    'Phone',
    'University',
    'Grad Year',
    'Location',
    'Track',
    'Payment Method',
    'Transaction Ref',
    'Referral ID',
    'GP Balance',
    'Status',
    'Sabri CV Unlocked'
  ]);
  return sheet;
}

/**
 * Helper to build JSON responses
 */
function jsonResponse(obj, code) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
