/**
 * GemIInI Academy — BLS Workshop intake backend (Google Apps Script Web App)
 *
 * Deploy: Extensions > Apps Script in your Google Sheet, paste this in,
 * then Deploy > New deployment > Web app.
 *   - Execute as: Me
 *   - Who has access: Anyone (the endpoint itself checks nothing sensitive
 *     is exposed — it only accepts a registration payload and returns a
 *     minted ID, never reads/returns other people's data)
 * Copy the deployment URL into the site's remote-endpoint config
 * (the `config.endpoint` that `isRemoteConfigured()` checks in geneApi.js).
 *
 * IMPORTANT — GA-ID numbering:
 * This continues the SAME sequential numbering the manual registry cleanup
 * ended on (locked through GA-6290 as of Aug 2026). Update NEXT_ID_START
 * below if more manual assignments happen between now and going live, or
 * two systems will mint colliding IDs again — the exact problem this
 * whole cleanup fixed. The safest fix long-term is making this sheet the
 * single source of truth for the counter, not a hardcoded starting point.
 */

const SHEET_NAME = 'BLS_Registrations';
const COUNTER_CELL = 'A1'; // on a separate 'Meta' sheet — see getNextGaId()
const NEXT_ID_START = 6291; // first free ID after the Aug 2026 registry lock
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

    // GP-applied registrations skip the transaction ID requirement;
    // cash registrations must have one.
    if (!body.gp_applied && (!body.transaction_id || String(body.transaction_id).trim().length < 4)) {
      return jsonResponse({ status: 'error', message: 'Missing or invalid transaction_id' }, 400);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || createRegistrationSheet(ss);

    const gaId = getNextGaId(ss);
    const timestamp = new Date();
    const status = body.gp_applied ? 'pending_gp_confirmation' : 'pending_payment_verification';

    sheet.appendRow([
      timestamp,
      gaId,
      body.full_name,
      body.email,
      body.phone,
      WORKSHOP_ID,
      body.gp_applied ? 'GP' : 'Vodafone Cash',
      body.transaction_id || '',
      body.patron_booster ? 'YES' : 'NO',
      body.referral_id || '',
      status,
      false, // sabri_cv_unlocked — flips to TRUE only after a human confirms payment
    ]);

    dispatchSignupAlert({ gaId, fullName: body.full_name, email: body.email, phone: body.phone,
      referralId: body.referral_id, transactionId: body.transaction_id, gpApplied: body.gp_applied });

    // The CV bonus is promised on the site, but it should not actually
    // unlock until a human confirms the payment/GP deduction — otherwise
    // someone could submit a fake transaction ID and get the bonus for
    // free. So the response tells the user it's reserved, not unlocked.
    return jsonResponse({
      status: 'success',
      gaId: gaId,
      registrationStatus: status,
      unlockSabriCv: false,
      message: 'Registration received. GA-ID reserved pending verification.',
    });

  } catch (err) {
    return jsonResponse({ status: 'error', message: String(err) }, 500);
  }
}

/**
 * Mints the next sequential GA-ID using a counter stored in a dedicated
 * 'Meta' sheet cell — NOT by counting rows (rows can be deleted/reordered)
 * and NOT by timestamp (guaranteed to eventually collide with manually
 * assigned IDs, which is exactly the bug the manual registry just had
 * fixed). LockService prevents two simultaneous submissions from getting
 * the same number.
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
    const next = (Number(current) || NEXT_ID_START) ;
    meta.getRange(COUNTER_CELL).setValue(next + 1);
    return `GA-${next}`;
  } finally {
    lock.releaseLock();
  }
}

/**
 * Sends a real-time email alert when someone registers. Wrapped in try/catch
 * so a mail-quota error or bad address never blocks the actual registration
 * from being saved — the sheet row is the source of truth, the email is a
 * best-effort notification on top of it.
 */
function dispatchSignupAlert(data) {
  try {
    const recipient = 'amjadgorashi32@gmail.com';
    const subject = `[BLS Signup] ${data.fullName || 'New candidate'} — ${data.gaId}`;
    const body = [
      'New BLS workshop registration received.',
      '',
      `GA-ID: ${data.gaId}`,
      `Name: ${data.fullName || 'N/A'}`,
      `Email: ${data.email || 'N/A'}`,
      `Phone: ${data.phone || 'N/A'}`,
      `Payment: ${data.gpApplied ? 'GP applied' : `Vodafone Cash (ref: ${data.transactionId || 'N/A'})`}`,
      `Referral: ${data.referralId || 'none'}`,
      `Time: ${new Date().toISOString()}`,
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
    'Payment Method', 'Transaction ID', 'Patron Booster', 'Referral ID', 'Status', 'Sabri CV Unlocked',
  ]);
  return sheet;
}

function jsonResponse(obj, code) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Manual verification step (run this yourself, or wire a simple sidebar
 * UI to it, after you've checked the Vodafone Cash SMS/statement or
 * confirmed the GP deduction). This is the human-in-the-loop step that
 * keeps the CV bonus from being claimable with a fake transaction ID.
 */
function confirmPayment(gaId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === gaId) {
      sheet.getRange(i + 1, 11).setValue('verified');   // Status column
      sheet.getRange(i + 1, 12).setValue(true);          // Sabri CV Unlocked column
      return `Confirmed ${gaId}`;
    }
  }
  return `${gaId} not found`;
}
