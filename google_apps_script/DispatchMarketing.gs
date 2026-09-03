/**
 * ============================================================================
 * GemIInI SudaGene Platform â€” Email & CRM Campaign Dispatcher
 * Master Spreadsheet ID: 1X74wS42KR5WpMusd8L_3-5LCDSIz9m7JHNdgY-rTbxs
 * Action: Automated Campaign Broadcasts & CRM Lead Notifications
 * ============================================================================
 */

const DISPATCH_CONFIG = {
  OFFICIAL_WHATSAPP: '+20 101 592 2628',
  EXECUTIVE_INBOX: 'mohamedgibbril@geneacademy.net',
  ACADEMIC_INBOX: 'safaa.elhassan@geneacademy.net',
  CLINICAL_INBOX: 'alaa.mursi@geneacademy.net',
  OPERATIONS_INBOX: 'amjad.gorashi@geneacademy.net',
  BLS_INBOX: 'mohamed.sabri@geneacademy.net',
  B2B_INBOX: 'b2b@geneacademy.net',
  ADMISSIONS_INBOX: 'admissions@geneacademy.net',
  RESEARCH_INBOX: 'research@geneacademy.net',
  SUDAPASS_INBOX: 'sudapass@geneacademy.net',
  INFO_INBOX: 'info@geneacademy.net'
};

/**
 * 1. CAMPAIGN A: SMC 242-Candidate National Exam Sprint Launch Broadcast
 * Dispatches timed mock exam links and proctoring instructions to candidate cohort.
 */
function dispatchSmcExamSprintBroadcast() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const authSheet = ss.getSheetByName('MASTER_AUTH');
  if (!authSheet) throw new Error("MASTER_AUTH sheet missing.");

  const data = authSheet.getDataRange().getValues();
  const headers = data[0];

  const idIdx = headers.indexOf('GA_ID');
  const nameIdx = headers.indexOf('LEGAL_NAME');
  const emailIdx = headers.indexOf('EMAIL');
  const statusIdx = headers.indexOf('STATUS');

  let notifiedIdx = headers.indexOf('SMC_SPRINT_NOTIFIED');
  if (notifiedIdx === -1) {
    authSheet.getRange(1, headers.length + 1).setValue('SMC_SPRINT_NOTIFIED');
    notifiedIdx = headers.length;
  }

  let sentCount = 0;
  for (let i = 1; i < data.length; i++) {
    const status = String(data[i][statusIdx]).trim().toUpperCase();
    const alreadySent = data[i][notifiedIdx];

    if (['ACTIVE', 'VERIFIED', 'ACCREDITED'].includes(status) && !alreadySent) {
      const gaId = data[i][idIdx];
      const name = data[i][nameIdx];
      const email = data[i][emailIdx];

      const subject = `[EXAM SPRINT] Ø±Ø§Ø¨Ø· ÙˆØªÙˆØ¬ÙŠÙ‡Ø§Øª Ø§Ù„Ø§Ù…ØªØ­Ø§Ù† Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠ Ø§Ù„ÙˆØ·Ù†ÙŠ Ù„Ù„Ù…Ø¬Ù„Ø³ Ø§Ù„Ø·Ø¨ÙŠ (SMC 242-Doctor Sprint)`;
      const body = `Ø§Ù„Ø²Ù…ÙŠÙ„(Ø©) Ø§Ù„ÙƒØ±ÙŠÙ…(Ø©) Ø¯. ${name}ØŒ

ØªØ­ÙŠØ© Ø·ÙŠØ¨Ø©ØŒ

Ù†Ø­ÙŠØ·ÙƒÙ… Ø¹Ù„Ù…Ø§Ù‹ Ø¨Ø§Ù†Ø·Ù„Ø§Ù‚ Ø§Ù„Ø§Ù…ØªØ­Ø§Ù† Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ Ø§Ù„ÙˆØ·Ù†ÙŠ Ø¹Ø¨Ø± Ù…Ø­Ø§ÙƒÙŠ MTCâ„¢ Ø§Ù„ØªÙØ§Ø¹Ù„ÙŠ.

ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ø§Ù…ØªØ­Ø§Ù† ÙˆØ§Ù„Ø¬Ù„Ø³Ø© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ©:
==================================================
â€¢ Ø§Ù„Ù…Ø¹Ø±Ù Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ: ${gaId}
â€¢ Ø¹Ø¯Ø¯ Ø§Ù„Ø³ÙŠÙ†Ø§Ø±ÙŠÙˆÙ‡Ø§Øª: 100 Ø­Ø§Ù„Ø© Ø³Ø±ÙŠØ±ÙŠØ© Ø¹Ø§Ù„ÙŠØ© Ø§Ù„Ø£Ù‡Ù…ÙŠØ© (Internal Medicine, Surgery, Obs/Gyn, Paediatrics).
â€¢ Ù†Ø¸Ø§Ù… Ø§Ù„Ø§Ø­ØªØ³Ø§Ø¨: +10 GP Ù„ÙƒÙ„ Ø¥Ø¬Ø§Ø¨Ø© ØµØ­ÙŠØ­Ø© (â‰¥ 70%) ØªÙØ¶Ø§Ù ÙÙˆØ±Ø§Ù‹ Ù„Ù„ÙˆØ­Ø© Ø§Ù„ØµØ¯Ø§Ø±Ø© (Leaderboard).
â€¢ Ø±Ø§Ø¨Ø· Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø§Ù„Ù…Ø¨Ø§Ø´Ø± Ù„Ù„Ø§Ù…ØªØ­Ø§Ù†: https://geneacademy.net/smc.html

ØªØ¹Ù„ÙŠÙ…Ø§Øª Ø§Ù„Ø¬Ù„Ø³Ø©:
1. Ø§Ù„Ø¬Ù„Ø³Ø© Ø®Ø§Ø¶Ø¹Ø© Ù„Ù„Ù…Ø±Ø§Ù‚Ø¨Ø© Ø§Ù„Ø±Ù‚Ù…ÙŠØ© ØºÙŠØ± Ø§Ù„ØªØ¯Ø§Ø®Ù„ÙŠØ© (Unassisted Digital Proctoring).
2. ÙŠÙ‚Ø¯Ù… Ø§Ù„Ù†Ø¸Ø§Ù… ØªØ¹Ù„ÙŠÙ„Ø§Ù‹ Ø¹Ù„Ù…ÙŠØ§Ù‹ Ø¯Ù‚ÙŠÙ‚Ø§Ù‹ Ù„ÙƒÙ„ Ø®ÙŠØ§Ø± Ø¨Ù…Ø¬Ø±Ø¯ Ø¥ØªÙ…Ø§Ù… Ø§Ù„Ø­Ø§Ù„Ø© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ©.

Ù†ØªÙ…Ù†Ù‰ Ù„ÙƒÙ… Ø¯ÙˆØ§Ù… Ø§Ù„ØªÙˆÙÙŠÙ‚ ÙˆØ§Ù„ØªÙ…ÙŠØ² Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØŒ

The Examination & Telemetry Directorate
GemIInI Academy Â· SudaGene Consortium Network
https://geneacademy.net`;

      try {
        GmailApp.sendEmail(email, subject, body, {
          from: DISPATCH_CONFIG.ADMISSIONS_INBOX,
          name: 'GemIInI Examination Directorate'
        });
        authSheet.getRange(i + 1, notifiedIdx + 1).setValue('SENT: ' + new Date().toISOString());
        sentCount++;
      } catch (err) {
        console.warn(`Failed to dispatch SMC sprint to ${email}: ${err.message}`);
      }
    }
  }

  return `Dispatched SMC 242-Candidate Sprint to ${sentCount} doctors.`;
}

/**
 * 2. CAMPAIGN B: AHA BLS Post-Course Certification & +500 GP Credit Broadcast
 * Dispatches SudaPass verified badges and +500 GP credit notices to workshop attendees.
 */
function dispatchBlsPostCertificationBroadcast() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rosterSheet = ss.getSheetByName('BLS_ROSTER');
  const authSheet = ss.getSheetByName('MASTER_AUTH');
  const telSheet = ss.getSheetByName('TELEMETRY');

  if (!rosterSheet || !authSheet || !telSheet) throw new Error("Critical sheets missing.");

  const rosterData = rosterSheet.getDataRange().getValues();
  const authData = authSheet.getDataRange().getValues();

  const emailMap = {};
  const nameMap = {};
  for (let i = 1; i < authData.length; i++) {
    const id = String(authData[i][0]).trim().toUpperCase();
    nameMap[id] = authData[i][1];
    emailMap[id] = authData[i][2];
  }

  let sentCount = 0;
  for (let r = 1; r < rosterData.length; r++) {
    const gaId = String(rosterData[r][0]).trim().toUpperCase();
    const status = String(rosterData[r][6]).trim().toUpperCase();

    if (['GRADUATED', 'CERTIFIED', 'COMPLETED'].includes(status)) {
      const email = emailMap[gaId];
      const name = nameMap[gaId] || 'Doctor';

      if (!email) continue;

      const subject = `[CERTIFIED] ØªÙˆØ«ÙŠÙ‚ Ø´Ù‡Ø§Ø¯Ø© Ø§Ù„Ø¥Ù†Ø¹Ø§Ø´ Ø§Ù„Ù‚Ù„Ø¨ÙŠ (AHA BLS) ÙˆØ¥ÙŠØ¯Ø§Ø¹ +500 GP ÙÙŠ Ø±ØµÙŠØ¯Ùƒ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ`;
      const body = `Ø§Ù„Ø²Ù…ÙŠÙ„(Ø©) Ø§Ù„ÙƒØ±ÙŠÙ…(Ø©) Ø¯. ${name}ØŒ

Ù…Ø¨Ø§Ø±Ùƒ Ø¥ØªÙ…Ø§Ù…Ùƒ Ù„ÙˆØ±Ø´Ø© Ø§Ù„ØªØ¯Ø±ÙŠØ¨ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ Ø§Ù„Ø¹Ù…Ù„ÙŠ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø© Ù„Ø¨Ø±Ù†Ø§Ù…Ø¬ Ø§Ù„Ø¥Ù†Ø¹Ø§Ø´ Ø§Ù„Ù‚Ù„Ø¨ÙŠ Ø§Ù„Ø±Ø¦ÙˆÙŠ (BLS Provider) Ø§Ù„Ù…Ù†Ø¹Ù‚Ø¯Ø© Ø¨Ø§Ù„Ù‚Ø§Ù‡Ø±Ø© Ø¨Ø§Ù„Ø´Ø±Ø§ÙƒØ© Ù…Ø¹ Ù…Ø±ÙƒØ² Ø¯. ØµØ¨Ø±ÙŠ Ø£Ø¨Ùˆ Ù‚Ø±ÙˆÙ† Ù„Ù„ØªØ¯Ø±ÙŠØ¨ (ØªØ±Ø®ÙŠØµ 1549).

Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ù…Ø³Ø¬Ù„Ø© ÙÙŠ Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ:
==================================================
â€¢ Ø§Ù„Ù…Ø¹Ø±Ù Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ (GA-ID): ${gaId}
â€¢ ØªØ±Ø®ÙŠØµ Ø¬Ù‡Ø© Ø§Ù„ØªØ¯Ø±ÙŠØ¨: STC Clinical Simulation Center (Lic. 1549)
â€¢ Ø§Ù„Ù†Ù‚Ø§Ø· Ø§Ù„Ù…ÙˆØ¯Ø¹Ø©: +500 GP (ØªÙØ¹ÙŠÙ„ Ø§Ù„Ø¹Ø¶ÙˆÙŠØ© Ø§Ù„Ø¯Ø§Ø¦Ù…Ø© ÙˆØ§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ Ø§Ù„ÙƒØ§Ù…Ù„)
â€¢ Ø±Ø§Ø¨Ø· Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„ÙÙˆØ±ÙŠ Ù…Ù† Ø§Ù„Ù‡ÙˆÙŠØ© ÙˆØ§Ù„Ø´Ù‡Ø§Ø¯Ø©: https://geneacademy.net/verify.html?id=${gaId}

Ø®Ø·ÙˆØªÙƒ Ø§Ù„Ù‚Ø§Ø¯Ù…Ø©:
ÙŠÙ…ÙƒÙ†Ùƒ Ø§Ù„Ø¢Ù† Ø§Ø³ØªØ«Ù…Ø§Ø± Ø±ØµÙŠØ¯Ùƒ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ Ù„Ø®ÙˆØ¶ Ù…Ø­Ø§ÙƒØ§Ø© Ø§Ù…ØªØ­Ø§Ù†Ø§Øª Ø§Ù„Ù…Ø¬Ù„Ø³ Ø§Ù„Ø·Ø¨ÙŠ ÙˆØ§Ù„Ù…Ø´Ø§Ø±ÙƒØ© ÙÙŠ Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Ø§Øª Ø§Ù„Ø¨Ø­Ø«ÙŠØ© 15:5:1.

Ù…Ø¹ Ø£Ø·ÙŠØ¨ Ø§Ù„ØªÙ…Ù†ÙŠØ§ØªØŒ

The Clinical Training & Accreditation Board
GemIInI Academy & SudaGene Consortium
https://geneacademy.net`;

      try {
        GmailApp.sendEmail(email, subject, body, {
          from: DISPATCH_CONFIG.CRM_INBOX,
          name: 'GemIInI Clinical Accreditation'
        });
        sentCount++;
      } catch (err) {
        console.warn(`Failed to dispatch BLS certification to ${email}: ${err.message}`);
      }
    }
  }

  return `Dispatched BLS certification notices to ${sentCount} graduated clinicians.`;
}

/**
 * 3. CAMPAIGN C: Institutional B2B Partnership Ingestion & Instant Quote Follow-up
 * Triggered upon receiving B2B inquiries for simulation center setup, SudaPass E-logbook, or GLOMEt hardware.
 */
function notifyB2BPartnershipLead(payload) {
  const org = payload.organization || 'Institutional Client';
  const contact = payload.contactPerson || 'Official Representative';
  const email = payload.email || '';
  const phone = payload.phone || '';
  const service = payload.serviceRequired || 'Medical Simulation Setup';
  const scope = payload.scope || 'Unspecified';

  // 1. Admin Alert to B2B Team
  const adminSubject = `ðŸ¢ [B2B LEAD] New Institutional Partnership Request: ${org}`;
  const adminBody = `New Institutional RFP Received on GemIInI Enterprise Gateway:
- Organization: ${org}
- Contact Person: ${contact}
- Official Email: ${email}
- Direct Phone / WhatsApp: ${phone}
- Required Service: ${service}
- Project Scope: ${scope}
- Submission Timestamp: ${new Date().toISOString()}

Direct WhatsApp Link to Contact: https://wa.me/${phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(contact)}%2C%20regarding%20your%20partnership%20inquiry%20from%20${encodeURIComponent(org)}`;

  try {
    GmailApp.sendEmail('b2b@geneacademy.net', adminSubject, adminBody, {
      name: 'GemIInI B2B Executive Desk',
      cc: 'crm@geneacademy.net'
    });
  } catch (e) {
    console.warn("Failed to notify B2B admin: " + e.message);
  }

  // 2. Candidate Acknowledgment Email
  if (email) {
    const clientSubject = `Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨ Ø§Ù„Ø´Ø±Ø§ÙƒØ© Ø§Ù„Ù…Ø¤Ø³Ø³ÙŠØ© ÙˆØªØ·ÙˆÙŠØ± Ø§Ù„Ù‚Ø¯Ø±Ø§Øª Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© | GemIInI Enterprise & GLOMEt`;
    const clientBody = `Ø§Ù„Ø³ÙŠØ¯(Ø©) Ø§Ù„ÙØ§Ø¶Ù„(Ø©) ${contact}ØŒ
Ù…Ù…Ø«Ù„ ${org}ØŒ

ØªØ­ÙŠØ© Ø·ÙŠØ¨Ø© ÙˆØ¨Ø¹Ø¯ØŒ

Ù†Ø¤ÙƒØ¯ Ù„ÙƒÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨ Ø§Ù„Ø´Ø±Ø§ÙƒØ© Ø§Ù„Ù…Ø¤Ø³Ø³ÙŠØ© Ø§Ù„Ù…ØªØ¹Ù„Ù‚ Ø¨Ù€ (${service}) Ø¹Ø¨Ø± Ø¨ÙˆØ§Ø¨Ø© GemIInI Enterprise.

ÙŠÙ‚ÙˆÙ… ÙØ±ÙŠÙ‚ ØªØ·ÙˆÙŠØ± Ø§Ù„Ø£Ø¹Ù…Ø§Ù„ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© ÙˆØ§Ù„Ù…ÙƒØªØ¨ Ø§Ù„ØªÙ†ÙÙŠØ°ÙŠ Ø­Ø§Ù„ÙŠØ§Ù‹ Ø¨Ù…Ø±Ø§Ø¬Ø¹Ø© Ù†Ø·Ø§Ù‚ Ø§Ù„Ù…Ø´Ø±ÙˆØ¹ ÙˆØ¥Ø¹Ø¯Ø§Ø¯ Ù…Ø³ÙˆØ¯Ø© Ù…Ù‚ØªØ±Ø­ Ø§Ù„Ø¹Ù…Ù„ ÙˆØ¬Ø¯ÙˆÙ„ Ø§Ù„Ù…ÙˆØ§ØµÙØ§Øª ÙˆØ§Ù„ØªØ¬Ù‡ÙŠØ²Ø§Øª. 
Ø³ÙŠØªÙˆØ§ØµÙ„ Ù…Ø¹ÙƒÙ… Ø§Ù„Ù…Ø³ØªØ´Ø§Ø± Ø§Ù„Ù…Ø®ØªØµ Ø®Ù„Ø§Ù„ 24 Ø³Ø§Ø¹Ø© Ø¹Ø¨Ø± Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ Ø£Ùˆ Ø§Ù„Ù‡Ø§ØªÙ Ø§Ù„Ù…Ø±ÙÙ‚ Ù„ØªØ±ØªÙŠØ¨ Ø§Ù„Ø§Ø¬ØªÙ…Ø§Ø¹ Ø§Ù„ØªÙ†Ø³ÙŠÙ‚ÙŠ.

Ù„Ù„Ù…Ø±Ø§Ø³Ù„Ø§Øª Ø§Ù„Ø¹Ø§Ø¬Ù„Ø©ØŒ ÙŠÙ…ÙƒÙ†ÙƒÙ… Ø§Ù„Ø±Ø¯ Ù…Ø¨Ø§Ø´Ø±Ø© Ø¹Ù„Ù‰ Ù‡Ø°Ø§ Ø§Ù„Ø¨Ø±ÙŠØ¯.

Ù…Ø¹ ÙØ§Ø¦Ù‚ Ø§Ù„Ø§Ø­ØªØ±Ø§Ù… ÙˆØ§Ù„ØªÙ‚Ø¯ÙŠØ±ØŒ

The Institutional Partnerships & B2B Directorate
GemIInI SudaGene Platform Â· GLOMEt Medical Solutions
https://geneacademy.net/partnerships.html`;

    try {
      GmailApp.sendEmail(email, clientSubject, clientBody, {
        from: DISPATCH_CONFIG.B2B_INBOX,
        name: 'GemIInI Institutional Partnerships'
      });
    } catch (e) {
      console.warn("Failed to send B2B client confirmation: " + e.message);
    }
  }
}

/**
 * 4. WHATSAPP DISPATCH QUEUE BUILDER
 * Generates ready-to-click wa.me links in a dedicated sheet for the official ops line.
 */
function buildWhatsAppDispatchQueue() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const authSheet = ss.getSheetByName('MASTER_AUTH');
  if (!authSheet) throw new Error("MASTER_AUTH sheet missing.");

  const data = authSheet.getDataRange().getValues();
  const outputSheetName = 'WHATSAPP_DISPATCH_QUEUE';
  let queueSheet = ss.getSheetByName(outputSheetName);

  if (!queueSheet) {
    queueSheet = ss.insertSheet(outputSheetName);
    queueSheet.appendRow(['TIMESTAMP', 'GA_ID', 'LEGAL_NAME', 'PHONE', 'WHATSAPP_LINK', 'STATUS']);
    queueSheet.setFrozenRows(1);
  } else {
    queueSheet.getRange(2, 1, Math.max(queueSheet.getLastRow(), 1), 6).clearContent();
  }

  let count = 0;
  for (let i = 1; i < data.length; i++) {
    const gaId = String(data[i][0]).trim().toUpperCase();
    const name = String(data[i][1]).trim();
    let phone = String(data[i][3]).replace(/\D/g, '');
    const status = String(data[i][8] || '').trim().toUpperCase();

    if (!phone || idIsInvalid(gaId)) continue;

    const message = `Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¯. ${name}ØŒ 

Ù†Ø­ÙŠØ·Ùƒ Ø¹Ù„Ù…Ø§Ù‹ Ø¨ØªÙˆØ«ÙŠÙ‚ Ø­Ø³Ø§Ø¨Ùƒ ÙÙŠ Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ (GA-ID: ${gaId}).
Ø±Ø§Ø¨Ø· ÙØ­Øµ Ø§Ù„Ù‡ÙˆÙŠØ© ÙˆØ§Ù„Ø³Ø¬Ù„: https://geneacademy.net/verify.html?id=${gaId}
Ø±Ø§Ø¨Ø· Ù…Ø­Ø§ÙƒÙŠ Ø§Ù„Ø­Ø§Ù„Ø§Øª Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© (SMC Bank): https://geneacademy.net/smc.html

Ø£Ù…Ø§Ù†Ø© Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© â€” GemIInI Academy`;

    const encoded = encodeURIComponent(message);
    const waLink = `https://wa.me/${phone}?text=${encoded}`;

    queueSheet.appendRow([
      new Date().toISOString(),
      gaId,
      name,
      phone,
      waLink,
      status === 'PENDING_REVIEW' ? 'READY_ONBOARDING' : 'READY_FOLLOWUP'
    ]);
    count++;
  }

  return `Queued ${count} contacts in WHATSAPP_DISPATCH_QUEUE.`;
}

function idIsInvalid(gaId) {
  return !gaId || gaId.includes('PROV') || gaId.includes('TR') || gaId.includes('WHATSAPP');
}
