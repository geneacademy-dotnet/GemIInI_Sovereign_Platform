/**
 * GemIInI Academy — Sovereign Platform, CRM Dispatch Engine & Multi-Hub Ingestion (Code.gs)
 *
 * Automated Web App + Sheets Custom Menu Ops:
 *   - Auto GA-ID Minting (NEXT_ID_START = 6291)
 *   - Multi-Hub BLS Ingestion: Cairo Dokki (Aug 28) & Sudan Hub (Sept 10)
 *   - 1-Click CRM Blast Menu: Sends customized onboarding emails via MailApp
 */

const SHEET_NAME = 'BLS_Registrations';
const COUNTER_CELL = 'A1';
const NEXT_ID_START = 6291;
const WORKSHOP_ID_CAIRO = 'bls_dokki_2026_08_28';
const WORKSHOP_ID_SUDAN = 'bls_sudan_2026_09_10';

const VERIFIED_INITIAL_BASELINE = [
  { gaId: "GA-3521", name: "الشريف عمر عثمان", role: "Medical Fellow", univ: "University of Khartoum '21", hub: "Khartoum", gp: 750, ccr: 75, accuracy: 92.5, streak: 12, bonus: 50, verified: true },
  { gaId: "GA-305", name: "Ehssan Isam", role: "BSS Surgical Fellow", univ: "National University (NUSU)", hub: "Khartoum", gp: 750, ccr: 65, accuracy: 88.0, streak: 10, bonus: 50, verified: true },
  { gaId: "GA-3479", name: "Hala Sid Ahmed", role: "USMLE Research Fellow", univ: "University of Khartoum '22", hub: "Khartoum", gp: 500, ccr: 70, accuracy: 86.5, streak: 8, bonus: 0, verified: true },
  { gaId: "GA-2491", name: "تنزيل محمد موسى", role: "Clinical Vanguard", univ: "National University '23", hub: "Khartoum", gp: 500, ccr: 70, accuracy: 84.0, streak: 7, bonus: 0, verified: true },
  { gaId: "GA-3463", name: "Mawada Hatim Awad", role: "Surgical Candidate", univ: "University of Khartoum '23", hub: "Khartoum", gp: 500, ccr: 60, accuracy: 82.0, streak: 6, bonus: 0, verified: true },
  { gaId: "GA-3466", name: "Mohamed Loai Saad", role: "MRCS Trainee", univ: "University of Khartoum '23", hub: "Khartoum", gp: 500, ccr: 60, accuracy: 81.5, streak: 6, bonus: 0, verified: true },
  { gaId: "GA-2980", name: "Rabah Daffalla", role: "BLS & MRCPCH Trainee", univ: "University of Khartoum '22", hub: "Khartoum", gp: 500, ccr: 60, accuracy: 80.0, streak: 5, bonus: 0, verified: true },
  { gaId: "GA-3400", name: "Nusaiba Alnuman", role: "Clinical Candidate", univ: "University of Khartoum '21", hub: "Khartoum", gp: 500, ccr: 60, accuracy: 78.0, streak: 4, bonus: 0, verified: true }
];

function calculateSovereignScore(gp, ccr, accuracy, streak, mentorshipBonus) {
  const safeGp = Math.max(0, Number(gp) || 0);
  const safeCcr = Math.max(0, Math.min(100, Number(ccr) || 0));
  const safeAcc = Math.max(0, Math.min(100, Number(accuracy) || 0));
  const safeStreak = Math.max(0, Number(streak) || 0);
  const safeBonus = Math.max(0, Number(mentorshipBonus) || 0);
  return Math.round(safeGp + safeCcr * 10 + safeAcc * 5 + safeStreak * 20 + safeBonus);
}

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const action = (e && e.parameter && e.parameter.action) ? String(e.parameter.action).toLowerCase() : 'leaderboard';
    const sheet = ss.getSheetByName('GA_MASTER_REGISTRY') || ss.getSheetByName('GEMIINI_CLINICAL_TELEMETRY');

    if (action === 'leaderboard') {
      const scope = (e && e.parameter && e.parameter.scope || 'national').toLowerCase();
      const filterVal = (e && e.parameter && e.parameter.filter || '').toLowerCase().trim();
      const ranked = [];

      if (sheet && sheet.getLastRow() > 1) {
        const lastRow = sheet.getLastRow();
        const data = sheet.getRange(2, 1, lastRow - 1, Math.min(sheet.getLastColumn(), 11)).getValues();
        for (const row of data) {
          const gaId = String(row[0] || '').trim();
          const name = String(row[1] || '').trim();
          if (!gaId || !name) continue;

          const role = String(row[2] || 'Candidate');
          const univ = String(row[3] || 'Unspecified faculty');
          const hub = String(row[4] || 'General');
          const gp = Number(row[5]) || 0;
          const ccr = Number(row[6]) || 0;
          const accuracy = Number(row[7]) || 0;
          const streak = Number(row[8]) || 0;
          const bonus = Number(row[9]) || 0;
          const verified = String(row[10]).toUpperCase() === 'ACCREDITED' || String(row[10]).toUpperCase() === 'TRUE';

          if (scope === 'regional' && filterVal && !hub.toLowerCase().includes(filterVal)) continue;
          if (scope === 'university' && filterVal && !univ.toLowerCase().includes(filterVal)) continue;

          ranked.push({
            gaId, name, role, univ, hub, gp, ccr, accuracy, streak, verified,
            sRank: calculateSovereignScore(gp, ccr, accuracy, streak, bonus)
          });
        }
      }

      if (ranked.length === 0) {
        for (const base of VERIFIED_INITIAL_BASELINE) {
          ranked.push({
            gaId: base.gaId, name: base.name, role: base.role, univ: base.univ, hub: base.hub,
            gp: base.gp, ccr: base.ccr, accuracy: base.accuracy, streak: base.streak, verified: base.verified,
            sRank: calculateSovereignScore(base.gp, base.ccr, base.accuracy, base.streak, base.bonus)
          });
        }
      }

      ranked.sort((a, b) => b.sRank - a.sRank);
      const top = ranked.slice(0, 100).map((m, i) => ({ rank: i + 1, ...m }));
      return jsonResponse({ status: 'success', scope, totalIndexed: ranked.length, items: top });
    }

    if (action === 'lookup' || action === 'verify') {
      const searchId = (e && e.parameter && e.parameter.id || '').toUpperCase().trim();
      if (!searchId) return jsonResponse({ status: 'error', found: false, message: 'ID not provided' });
      const cleanSearch = searchId.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

      for (const base of VERIFIED_INITIAL_BASELINE) {
        if (base.gaId.replace(/[^A-Za-z0-9]/g, '').toUpperCase() === cleanSearch) {
          return jsonResponse({
            status: 'success', found: true,
            member: {
              id: base.gaId, name: base.name, role: base.role, univ: base.univ,
              gp: base.gp, ccr: base.ccr, accuracy: base.accuracy, streak: base.streak,
              verified: base.verified, level2Unlocked: true
            }
          });
        }
      }

      if (sheet && sheet.getLastRow() > 1) {
        const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, Math.min(sheet.getLastColumn(), 11)).getValues();
        for (const row of data) {
          const rowId = String(row[0]).replace(/[^A-Za-z0-9]/g, '').toUpperCase();
          if (rowId === cleanSearch) {
            return jsonResponse({
              status: 'success', found: true,
              member: {
                id: String(row[0]), name: String(row[1]),
                role: String(row[2] || 'Candidate'), univ: String(row[3] || 'Unspecified faculty'),
                gp: Number(row[5]) || 0, ccr: Number(row[6]) || 0, accuracy: Number(row[7]) || 0, streak: Number(row[8]) || 0,
                verified: String(row[10]).toUpperCase() === 'ACCREDITED' || String(row[10]).toUpperCase() === 'TRUE',
                level2Unlocked: (Number(row[7]) || 0) >= 70
              }
            });
          }
        }
      }
      return jsonResponse({ status: 'success', found: false, message: 'Member record not found' });
    }

    return jsonResponse({ status: 'success', message: 'GemIInI backend ready' });
  } catch (err) {
    return jsonResponse({ status: 'error', message: String(err) });
  }
}

function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    }
    const action = payload.action;

    // 1. LIVE TELEMETRY LOGGING
    if (action === 'log_telemetry' || action === 'log_clinical_attempt') {
      const candidateGaId = String(payload.ga_id || payload.gaId || '').trim().toUpperCase();
      const moduleId = String(payload.module_id || payload.moduleId || 'MTC-CARDIO-101');
      const score = Number(payload.score) || 0;
      const passed = Boolean(payload.passed || score >= 70);
      const awardedGp = passed ? 10 : 2;

      const ss = SpreadsheetApp.getActiveSpreadsheet();
      let telSheet = ss.getSheetByName('GEMIINI_CLINICAL_TELEMETRY');
      if (!telSheet) {
        telSheet = ss.insertSheet('GEMIINI_CLINICAL_TELEMETRY');
        telSheet.appendRow(['GA_ID', 'FULL_NAME', 'ROLE', 'UNIV', 'HUB', 'GP', 'CCR', 'ACCURACY', 'STREAK', 'BONUS', 'STATUS', 'LAST_MODULE', 'TIMESTAMP']);
      }

      telSheet.appendRow([
        candidateGaId, payload.full_name || payload.fullName || 'Candidate',
        'Clinical Vanguard', payload.university || 'University of Khartoum', 'Cairo / Khartoum',
        awardedGp, passed ? 75 : 50, score, 1, 0,
        passed ? 'ACCREDITED' : 'IN_TRAINING', moduleId, new Date().toISOString()
      ]);

      return jsonResponse({
        status: 'success', gaId: candidateGaId, moduleId, score, passed, awardedGp, level2Unlocked: passed,
        message: 'Clinical telemetry ingested successfully.'
      });
    }

    // 2. MULTI-HUB BLS REGISTRATION (Cairo Dokki & Sudan Hub)
    if (action === 'bls_register') {
      const body = payload.body || payload;
      const required = ['full_name', 'email', 'phone'];
      for (const field of required) {
        if (!body[field] || String(body[field]).trim() === '') {
          return jsonResponse({ status: 'error', message: `Missing field: ${field}` }, 400);
        }
      }

      if (!body.gp_applied && (!body.transaction_id || String(body.transaction_id).trim().length < 4)) {
        return jsonResponse({ status: 'error', message: 'Missing or invalid transaction_id' }, 400);
      }

      const workshopTarget = body.workshop || WORKSHOP_ID_CAIRO;
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName(SHEET_NAME) || createRegistrationSheet(ss);
      const gaId = getNextGaId(ss);
      const timestamp = new Date();
      const status = body.gp_applied ? 'pending_gp_confirmation' : 'pending_payment_verification';

      sheet.appendRow([
        timestamp, gaId, body.full_name, body.email, body.phone, workshopTarget,
        body.gp_applied ? 'GP' : 'Vodafone Cash / Remittance', body.transaction_id || '',
        body.patron_booster ? 'YES' : 'NO', body.referral_id || '', status, false, ''
      ]);

      // Trigger Onboarding CRM Email
      sendCrmOnboardingEmail({
        fullName: body.full_name,
        email: body.email,
        gaId: gaId,
        status: status,
        workshop: workshopTarget
      });

      dispatchSignupAlert({
        gaId, fullName: body.full_name, email: body.email, phone: body.phone,
        referralId: body.referral_id, transactionId: body.transaction_id, gpApplied: body.gp_applied, workshop: workshopTarget
      });

      return jsonResponse({
        status: 'success', gaId, registrationStatus: status, unlockSabriCv: false,
        message: 'Registration received. GA-ID reserved and onboarding CRM dispatched.'
      });
    }

    
    // 4. CONCIERGE FAST-TRACK VISA & EXAM INGESTION
    if (action === 'concierge_fast_track') {
      const body = payload.body || payload;
      const fullName = body.full_name || body.fullName || '';
      const whatsapp = body.whatsapp || body.phone || '';
      const targetExam = body.target_exam || body.targetExam || 'General Medical';

      const ss = SpreadsheetApp.getActiveSpreadsheet();
      let sheet = ss.getSheetByName('Concierge_FastTrack');
      if (!sheet) {
        sheet = ss.insertSheet('Concierge_FastTrack');
        sheet.appendRow(['Timestamp', 'Full Name', 'WhatsApp', 'Target Exam', 'Status', 'Contacted']);
      }

      sheet.appendRow([new Date(), fullName, whatsapp, targetExam, 'URGENT_2HR_SLA', 'NO']);
      
      // Dispatch immediate priority notification
      try {
        MailApp.sendEmail({
          to: 'amjadgorashi32@gmail.com',
          subject: `⚡ [URGENT FAST-TRACK] ${fullName} — ${targetExam} (${whatsapp})`,
          body: `New Concierge Fast-Track Request:\n\nName: ${fullName}\nWhatsApp: ${whatsapp}\nTarget Exam: ${targetExam}\nTime: ${new Date().toISOString()}\n\nAction required: Contact via WhatsApp within 2 hours.`
        });
      } catch (err) {}

      return jsonResponse({
        status: 'success',
        message: 'Fast-Track request secured. Concierge desk notified.'
      });
    }

    // 3. GENERAL REGISTRATION & ONBOARDING (+25 GP)
    const body = payload.body || payload;
    const fullName = body.full_name || body.fullName || '';
    const phone = body.phone || '';
    const email = body.email || '';
    if (!fullName || !phone || !email) {
      return jsonResponse({ status: 'error', message: 'Missing required fields' }, 400);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let regSheet = ss.getSheetByName('Registrations') || ss.getSheetByName('GA_MASTER_REGISTRY');
    if (!regSheet) regSheet = createRegistrationSheet(ss);

    let assignedId = body.existing_ga_id || body.ga_id;
    let isExisting = false;
    if (assignedId && /^GA-?\d{1,6}$/i.test(assignedId.trim())) {
      assignedId = assignedId.trim().toUpperCase();
      if (!assignedId.startsWith('GA-')) assignedId = 'GA-' + assignedId.replace(/[^0-9]/g, '');
      isExisting = true;
    } else {
      assignedId = getNextGaId(ss);
    }

    const gpBalance = 25;
    regSheet.appendRow([
      new Date(), assignedId, fullName, email, phone, body.workshop || 'General Member',
      body.payment_method || 'Free Onboarding', 'PROVISIONAL', 'NO', '', 'PROVISIONAL', false, ''
    ]);

    return jsonResponse({
      status: 'success', gaId: assignedId, fullName, gpBalance,
      message: isExisting ? 'Existing member attached.' : 'New GA-ID minted with +25 GP.'
    });

  } catch (err) {
    return jsonResponse({ status: 'error', message: String(err) }, 500);
  }
}

/**
 * Sends Personalized Master CRM Dispatch Email
 */
function sendCrmOnboardingEmail(data) {
  try {
    const isSudan = String(data.workshop).includes('sudan');
    const workshopTitle = isSudan ? "Sudan Resuscitation Hub (Sept 10, 2026)" : "Dokki, Cairo Hub (August 28, 2026)";
    const subject = `🟢 Action Required: Your Sovereign GA-ID, Portal Access & BLS Workshop Status`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; background-color: #04080F; color: #E2E8F0; padding: 24px; border-radius: 16px; max-width: 600px; margin: auto; border: 1px solid #1E293B;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #00F2FE; margin: 0; font-size: 24px;">GemIInI Academy</h1>
          <p style="color: #94A3B8; font-size: 12px; margin-top: 4px; letter-spacing: 2px;">SOVEREIGN HEALTHCARE & CLINICAL SIMULATION</p>
        </div>

        <p style="font-size: 15px; line-height: 1.6;">Dear <strong>Dr. ${data.fullName}</strong>,</p>
        <p style="font-size: 14px; color: #94A3B8; line-height: 1.6;">
          Welcome to the <strong>GemIInI Academy Sovereign Registry</strong>. This email contains your official credentialing data, instructions to access your clinical dashboard, and your upcoming simulation workshop logistics.
        </p>

        <div style="background-color: #0A0F1D; border: 1px solid #00F2FE33; border-radius: 12px; padding: 18px; margin: 20px 0;">
          <h3 style="color: #00F2FE; margin-top: 0; font-size: 16px;">1. Your Sovereign Credentials 🔐</h3>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Official GA-ID:</strong> <span style="font-family: monospace; color: #00F2FE; font-weight: bold; background: #00F2FE1A; padding: 3px 8px; border-radius: 6px;">${data.gaId}</span></p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Account Status:</strong> <span style="color: #F59E0B;">${data.status}</span></p>
          <div style="margin-top: 14px;">
            <a href="https://members.geneacademy.net/profile?id=${data.gaId}" style="background-color: #00F2FE; color: #04080F; padding: 10px 18px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 13px; display: inline-block;">🔗 Access My Sovereign Profile</a>
          </div>
        </div>

        <div style="background-color: #0A0F1D; border: 1px solid #334155; border-radius: 12px; padding: 18px; margin: 20px 0;">
          <h3 style="color: #38BDF8; margin-top: 0; font-size: 16px;">2. AHA-BLS Workshop (${workshopTitle})</h3>
          <p style="font-size: 13px; color: #CBD5E1; margin: 6px 0;"><strong>Session Details:</strong> ${isSudan ? 'Thursday, September 10, 2026' : 'Friday, August 28, 2026'}</p>
          <p style="font-size: 13px; color: #CBD5E1; margin: 6px 0;"><strong>Location:</strong> ${isSudan ? 'Khartoum / Port Sudan Clinical Hub' : 'Dokki, Cairo (Full Maps pin provided upon gate check-in)'}</p>
          <p style="font-size: 13px; color: #CBD5E1; margin: 6px 0;"><strong>Verification Gate:</strong> Please have your digital profile open on your phone at reception. Your <strong>${data.gaId}</strong> is your entry pass.</p>
        </div>

        <div style="background-color: #0A0F1D; border: 1px solid #B4802855; border-radius: 12px; padding: 18px; margin: 20px 0;">
          <h3 style="color: #F59E0B; margin-top: 0; font-size: 16px;">3. Multi-Hub Transfer Option (Cairo ↔ Sudan) 🇸🇩</h3>
          <p style="font-size: 13px; color: #94A3B8; line-height: 1.5; margin: 6px 0;">
            If you are based in Sudan, or wish to transfer your booking to the upcoming <strong>Sudan Hub (Sept 10)</strong>, you can secure or manage your seat directly via our sovereign portal:
          </p>
          <div style="margin-top: 10px;">
            <a href="https://members.geneacademy.net/bls?hub=sudan" style="background-color: #B48028; color: #FFFFFF; padding: 8px 16px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 12px; display: inline-block;">🔗 Manage / Book Sudan Cohort (Sept 10)</a>
          </div>
        </div>

        <div style="text-align: center; border-top: 1px solid #1E293B; padding-top: 16px; margin-top: 24px; color: #64748B; font-size: 11px;">
          <p style="margin: 2px 0;">GemIInI Academy | Clinical Operations & Sovereign Data Team</p>
          <p style="margin: 2px 0;">MTC™ Clinical Reasoning Simulator • All Rights Reserved © 2026</p>
        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: data.email,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (err) {
    Logger.log("CRM Dispatch Email Warning: " + err.toString());
  }
}

/**
 * Custom Menu in Google Sheets for 1-Click Operations
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 GemIInI Sovereign Ops')
    .addItem('📧 Blast CRM Onboarding to Unsent Candidates', 'blastUnsentOnboardingEmails')
    .addItem('✅ Confirm Selected Payment (Unlock CV & SudaPass)', 'confirmSelectedPaymentFromMenu')
    .addToUi();
}

function blastUnsentOnboardingEmails() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet || sheet.getLastRow() <= 1) return;

  const data = sheet.getDataRange().getValues();
  let count = 0;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const gaId = String(row[1] || '');
    const fullName = String(row[2] || '');
    const email = String(row[3] || '');
    const workshop = String(row[5] || WORKSHOP_ID_CAIRO);
    const status = String(row[10] || 'pending_payment_verification');
    const emailSent = String(row[12] || '').toUpperCase() === 'SENT';

    if (gaId && email && !emailSent) {
      sendCrmOnboardingEmail({ fullName, email, gaId, status, workshop });
      sheet.getRange(i + 1, 13).setValue('SENT');
      count++;
    }
  }

  SpreadsheetApp.getUi().alert(`✅ Successfully blasted ${count} CRM Onboarding Emails!`);
}

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
    const next = Number(current) || NEXT_ID_START;
    meta.getRange(COUNTER_CELL).setValue(next + 1);
    return `GA-${next}`;
  } finally {
    lock.releaseLock();
  }
}

function dispatchSignupAlert(data) {
  try {
    const recipient = 'amjadgorashi32@gmail.com';
    const subject = `[BLS Signup] ${data.fullName || 'New candidate'} — ${data.gaId} (${data.workshop})`;
    const body = [
      'New BLS workshop registration received.',
      '',
      `GA-ID: ${data.gaId}`,
      `Name: ${data.fullName || 'N/A'}`,
      `Email: ${data.email || 'N/A'}`,
      `Phone: ${data.phone || 'N/A'}`,
      `Workshop: ${data.workshop || 'Cairo'}`,
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
    'Payment Method', 'Transaction ID', 'Patron Booster', 'Referral ID', 'Status', 'Sabri CV Unlocked', 'CRM_Email_Sent'
  ]);
  return sheet;
}

function jsonResponse(obj, code) {
  return ContentService.createTextOutput(JSON.stringify(obj))
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
