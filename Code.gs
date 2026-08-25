/**
 * GemIInI Academy — BLS Workshop intake backend (Google Apps Script Web App)
 *
 * Features:
 * - Existing member detection: Re-uses existing GA-ID if candidate is already registered
 * - Concurrency control via LockService.getScriptLock(10000)
 * - Sequential GA-ID minting starting at NEXT_ID_START (GA-6291+) for new candidates
 * - Multi-rail payments: Vodafone Cash, Barq (برق - KSA/Gulf), GP Points
 * - Real-time email telemetry dispatch to amjadgorashi32@gmail.com
 */

const SHEET_NAME = 'BLS_Registrations';
const MASTER_SHEET_NAME = 'GA_MASTER_REGISTRY';
const COUNTER_CELL = 'A1';
const NEXT_ID_START = 6291;
const WORKSHOP_ID = 'bls_dokki_2026_08_28';

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    if (action !== 'bls_register') {
      return jsonResponse({ status: 'error', message: 'Unknown action' }, 400);
    }

    const body = payload.body || {};
    const required = ['full_name', 'email', 'phone'];
    for (const field of required) {
      if (!body[field] || String(body[field]).trim() === '') {
        return jsonResponse({ status: 'error', message: `Missing field: ${field}` }, 400);
      }
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || createRegistrationSheet(ss);

    // Existing Member GA-ID Handling:
    // If candidate provides an existing GA-ID, preserve it; otherwise mint a sequential ID.
    let gaId = '';
    let isExistingMember = false;

    const rawExistingId = String(body.existing_ga_id || body.ga_id || '').trim().toUpperCase();
    if (rawExistingId && /^GA-?\d{1,6}$/i.test(rawExistingId)) {
      const match = rawExistingId.match(/^GA-?(\d{1,6})$/i);
      gaId = match ? `GA-${match[1]}` : rawExistingId;
      isExistingMember = true;
    } else {
      gaId = getNextGaId(ss);
    }

    const timestamp = new Date();
    const paymentMethod = body.payment_method || (body.gp_applied ? 'GP' : (body.is_barq ? 'Barq (برق)' : 'Vodafone Cash'));
    const status = body.gp_applied ? 'pending_gp_confirmation' : 'pending_payment_verification';

    sheet.appendRow([
      timestamp,
      gaId,
      body.full_name,
      body.email,
      body.phone,
      WORKSHOP_ID,
      paymentMethod,
      body.transaction_id || '',
      body.patron_booster ? 'YES' : 'NO',
      body.referral_id || '',
      status,
      false, // sabri_cv_unlocked — flips to TRUE upon payment confirmation
      isExistingMember ? 'EXISTING_MEMBER' : 'NEW_CANDIDATE'
    ]);

    dispatchSignupAlert({
      gaId,
      fullName: body.full_name,
      email: body.email,
      phone: body.phone,
      paymentMethod: paymentMethod,
      transactionId: body.transaction_id,
      gpApplied: body.gp_applied,
      referralId: body.referral_id,
      isExistingMember: isExistingMember
    });

    return jsonResponse({
      status: 'success',
      gaId: gaId,
      isExistingMember: isExistingMember,
      registrationStatus: status,
      unlockSabriCv: false,
      message: isExistingMember
        ? `Registration linked to your existing ID (${gaId}).`
        : `Registration received. Minted GA-ID reserved pending verification.`
    });

  } catch (err) {
    return jsonResponse({ status: 'error', message: String(err) }, 500);
  }
}

/**
 * Mints the next sequential GA-ID using a counter stored in 'Meta' sheet
 */
function getNextGaId(ss) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    let meta = ss.getSheetByName('Meta');
    if (!meta) {
      meta = ss.insertSheet('Meta');
      meta.getRange(COUNTER_CELL).setValue(NEXT_ID_START);
    }
    const current = meta.getRange(COUNTER_CELL).getValue();
    const next = (Number(current) || NEXT_ID_START);
    meta.getRange(COUNTER_CELL).setValue(next + 1);
    return `GA-${next}`;
  } finally {
    lock.releaseLock();
  }
}

/**
 * Real-time email telemetry alert
 */
function dispatchSignupAlert(data) {
  try {
    const recipient = 'amjadgorashi32@gmail.com';
    const memberTag = data.isExistingMember ? '[Existing Member]' : '[New Candidate]';
    const subject = `[BLS Signup] ${memberTag} ${data.fullName || 'New candidate'} — ${data.gaId}`;
    const body = [
      '=== GEMIINI ACADEMY BLS REGISTRATION ALERT ===',
      '',
      `Type: ${data.isExistingMember ? 'Existing Sovereign Member' : 'New Intake Candidate'}`,
      `GA-ID: ${data.gaId}`,
      `Name: ${data.fullName || 'N/A'}`,
      `Email: ${data.email || 'N/A'}`,
      `Phone: ${data.phone || 'N/A'}`,
      `Payment Method: ${data.paymentMethod} (Ref: ${data.transactionId || 'N/A'})`,
      `Referral ID: ${data.referralId || 'none'}`,
      `Timestamp: ${new Date().toISOString()}`,
      '=============================================='
    ].join('\n');
    MailApp.sendEmail({ to: recipient, subject, body });
  } catch (err) {
    Logger.log('Signup alert email failed: ' + err.toString());
  }
}

function createRegistrationSheet(ss) {
  const sheet = ss.insertSheet(SHEET_NAME);
  sheet.appendRow([
    'Timestamp', 'GA-ID', 'Full Name', 'Email', 'Phone', 'Workshop',
    'Payment Method', 'Transaction ID', 'Patron Booster', 'Referral ID', 'Status', 'Sabri CV Unlocked', 'Member Type'
  ]);
  return sheet;
}

function jsonResponse(obj, code) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function confirmPayment(gaId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === gaId) {
      sheet.getRange(i + 1, 11).setValue('verified');
      sheet.getRange(i + 1, 12).setValue(true);
      return `Confirmed ${gaId}`;
    }
  }
  return `${gaId} not found`;
}
