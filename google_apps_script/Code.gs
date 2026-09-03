/**
 * ============================================================================
 * GemIInI Sovereign Platform — Unified Backend (Code.gs — FINAL VERIFIED)
 * Fail-closed salt · Explicit field mapping · Source-channel tagging (all 3 staff)
 * Multi-cohort BLS · Email-based ID lookup · Includes safe repair utility
 * ============================================================================
 */

const CONFIG = {
  SHEET_AUTH: 'MASTER_AUTH',
  SHEET_PAYMENTS: 'PAYMENT_AUDIT_LOG',
  SHEET_TELEMETRY: 'TELEMETRY',
  SHEET_ROSTER: 'BLS_ROSTER',
  SHEET_FEEDBACK: 'FEEDBACK_LOG',
  SHEET_QUEUE: 'QUEUE_FALLBACK',
  SHEET_B2B: 'INSTITUTIONAL_ENQUIRIES',
  SHEET_RESEARCH: 'RESEARCH_PODS',
  LOCK_TIMEOUT_MS: 20000,
  BLS_COHORTS: {
    'BLS-CAIRO-AUG28': { id: 'BLS-CAIRO-AUG28', date: '2026-08-28', venue: 'GemIInI Clinical Simulation Suite (Cairo)', maxPaid: 12, maxProvisional: 4, fee: 3000, currency: 'EGP' },
    'BLS-CAIRO-SEP04': { id: 'BLS-CAIRO-SEP04', date: '2026-09-04', venue: 'GemIInI Clinical Simulation Suite (Cairo)', maxPaid: 12, maxProvisional: 4, fee: 3000, currency: 'EGP' },
    'BLS-CAIRO-SEP11': { id: 'BLS-CAIRO-SEP11', date: '2026-09-11', venue: 'GemIInI Clinical Simulation Suite (Cairo)', maxPaid: 12, maxProvisional: 4, fee: 3000, currency: 'EGP' }
  },
  DEFAULT_BLS_COHORT: 'BLS-CAIRO-SEP04'
};

function getSecretSalt() {
  const salt = PropertiesService.getScriptProperties().getProperty('SECRET_SALT');
  if (!salt) throw new Error('CRITICAL_SECURITY_HALT: SECRET_SALT Script Property is not configured.');
  return salt;
}

function generateSudaPassHash(gaId, timestamp) {
  const raw = gaId + '|' + timestamp + '|' + getSecretSalt();
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
  return digest.map(b => ((b < 0 ? b + 256 : b).toString(16)).padStart(2, '0')).join('');
}

function mintNextGaId(authSheet) {
  const data = authSheet.getDataRange().getValues();
  let maxId = 1000;
  for (let i = 1; i < data.length; i++) {
    const match = String(data[i][0]).match(/^GA-(\d+)$/i);
    if (match && match[1]) {
      const n = parseInt(match[1], 10);
      if (!isNaN(n) && n > maxId) maxId = n;
    }
  }
  return 'GA-' + (maxId + 1);
}

function mintNextB2bId(sheet) {
  const data = sheet.getDataRange().getValues();
  let maxNum = 1000;
  for (let i = 1; i < data.length; i++) {
    const match = String(data[i][1] || '').match(/B2B-(\d+)/i);
    if (match) {
      const n = parseInt(match[1], 10);
      if (!isNaN(n) && n > maxNum) maxNum = n;
    }
  }
  return 'B2B-' + (maxNum + 1);
}

function determineSourceChannel(payload, email) {
  const STAFF_EMAILS = {
    'mohamedgibbril@gmail.com': 'STAFF_INTERNAL_GA000',
    'amjadgorashi32@gmail.com': 'STAFF_INTERNAL_GA011',
    'safaelhassan44@gmail.com': 'STAFF_INTERNAL_GA004'
  };
  if (STAFF_EMAILS[email]) return STAFF_EMAILS[email];
  const TRAINER_COHORTS = { 'GA-006': 'B2B_COHORT_SABRI' };
  const ref = String(payload.peerReferral || '').trim().toUpperCase();
  if (TRAINER_COHORTS[ref]) return TRAINER_COHORTS[ref];
  if (payload.peerReferral) return 'PEER_REFERRAL';
  return 'WEB_ORGANIC';
}

function getOrCreateSheet(ss, sheetName) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (sheetName === CONFIG.SHEET_AUTH) {
      sheet.appendRow(['GA_ID', 'LEGAL_NAME', 'EMAIL', 'PHONE', 'CANONICAL_UNIVERSITY', 'HOSPITAL_AFFILIATION', 'LOCATION', 'CAREER_STAGE', 'STATUS', 'SUDAPASS_HASH', 'CREATED_AT', 'SOURCE_CHANNEL']);
    } else if (sheetName === CONFIG.SHEET_PAYMENTS) {
      sheet.appendRow(['TIMESTAMP', 'GA_ID', 'TX_REF', 'PAYMENT_METHOD', 'AMOUNT', 'CURRENCY', 'STATUS', 'COURSE_CODE']);
    } else if (sheetName === CONFIG.SHEET_TELEMETRY) {
      sheet.appendRow(['GA_ID', 'GP', 'CCR_PERCENT', 'ACCURACY_PERCENT', 'STREAK_DAYS', 'LAST_UPDATED']);
    } else if (sheetName === CONFIG.SHEET_ROSTER) {
      sheet.appendRow(['GA_ID', 'COURSE_NAME', 'DATE', 'VENUE', 'FEE_PAID', 'TX_REF', 'STATUS']);
    } else if (sheetName === CONFIG.SHEET_FEEDBACK) {
      sheet.appendRow(['TIMESTAMP', 'GA_ID', 'EMAIL', 'PHONE', 'WTP_CURRENCY', 'WTP_400', 'WTP_800', 'WTP_1200', 'TARGET_MODULES', 'TARGET_PATHWAYS', 'ONBOARDING_CSAT', 'SUDAPASS_RATING', 'PEER_REFERRAL', 'GP_AWARDED']);
    } else if (sheetName === CONFIG.SHEET_QUEUE) {
      sheet.appendRow(['TIMESTAMP', 'GA_ID', 'ACTION', 'PAYLOAD_RAW', 'STATUS', 'RESOLVED_AT']);
    } else if (sheetName === CONFIG.SHEET_B2B) {
      sheet.appendRow(['TIMESTAMP', 'SUBMISSION_ID', 'CONTACT_PERSON', 'ORGANIZATION', 'ORG_TYPE', 'EMAIL', 'LOCATION', 'SERVICE_REQUIRED', 'SCOPE', 'NOTES', 'STATUS', 'ASSIGNED_STAFF', 'NEXT_ACTION']);
    } else if (sheetName === CONFIG.SHEET_RESEARCH) {
      sheet.appendRow(['TIMESTAMP', 'NAME', 'EMAIL', 'PHONE', 'UNIVERSITY', 'CAREER_STAGE', 'RESEARCH_TRACK', 'NOTES', 'STATUS', 'ASSIGNED_PI']);
    }
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse(obj) {
  const output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = String(params.action || '').toUpperCase();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (action === 'LOOKUP' || action === 'VERIFY') return jsonResponse(handleLookup({ gaId: params.id || params.gaId }, ss));
    if (action === 'LEADERBOARD') return jsonResponse(handleCachedLeaderboard(ss));
    if (action === 'UNIV_STATS') return jsonResponse(handleUnivStats(ss));
    return jsonResponse({ success: true, message: 'GemIInI Sovereign Gateway Active' });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);
    if (!e || !e.postData || !e.postData.contents) return jsonResponse({ success: false, error: 'EMPTY_PAYLOAD' });
    const payload = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const action = String(payload.formCode || payload.action || '').toUpperCase();

    switch (action) {
      case 'REGISTER_USER':
      case 'PORTAL_INTAKE':
        return jsonResponse(handleRegisterUser(payload, ss));
      case 'BLS_REGISTER':
      case 'SUBMIT_BLS':
        return jsonResponse(handleBlsRegister(payload, ss));
      case 'LOOKUP':
      case 'VERIFY':
        return jsonResponse(handleLookup(payload, ss));
      case 'LOOKUP_ID':
        return jsonResponse(handleLookupByEmail(payload, ss));
      case 'LEADERBOARD':
        return jsonResponse(handleCachedLeaderboard(ss));
      case 'LOG_TELEMETRY':
      case 'LOG_CLINICAL_ATTEMPT':
        return jsonResponse(handleLogTelemetry(payload, ss));
      case 'SUBMIT_FEEDBACK':
      case 'FEEDBACK':
        return jsonResponse(handleFeedback(payload, ss));
      case 'FORM_B2B_PARTNERSHIP':
        return jsonResponse(handleB2BPartnership(payload, ss));
      case 'FORM_RESEARCH_1551':
      case 'RESEARCH_POD_INTAKE':
        return jsonResponse(handleResearchPodIntake(payload, ss));
      default:
        return jsonResponse({ success: false, error: 'INVALID_ACTION: ' + action });
    }
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  } finally {
    try { lock.releaseLock(); } catch (ignored) {}
  }
}

function handleRegisterUser(payload, ss) {
  const legalName = String(payload.legalName || payload.fullName || payload.name || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const phone = String(payload.phone || '').trim();
  const university = String(payload.university || 'Unspecified Medical Faculty').trim();
  const hospital = String(payload.hospital || '').trim();
  const location = String(payload.location || '').trim();
  const careerStage = String(payload.careerStage || 'Medical Practitioner').trim();
  const sourceChannel = determineSourceChannel(payload, email);

  if (!legalName || !email) return { success: false, error: 'MISSING_MANDATORY_REGISTRATION_FIELDS' };

  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const data = authSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][2]).trim().toLowerCase() === email) {
      return { success: true, gaId: String(data[i][0]), alreadyRegistered: true, message: 'تم العثور على حسابك المسجل مسبقاً: ' + String(data[i][0]) };
    }
  }

  const gaId = mintNextGaId(authSheet);
  const timestamp = new Date().toISOString();
  const sudaPassHash = generateSudaPassHash(gaId, timestamp);

  authSheet.appendRow([
    gaId, legalName, email, phone, university, hospital, location, careerStage, 'PENDING_REVIEW', sudaPassHash, timestamp, sourceChannel
  ]);

  getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY).appendRow([gaId, 25, 0, 0, 0, timestamp]);

  // Automated Email Dispatch
  try {
    MailApp.sendEmail({
      to: email,
      name: 'Gene Academy Admissions',
      replyTo: 'admissions@geneacademy.net',
      subject: `[Gene Academy] Registration Confirmed — Your ID: ${gaId}`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
          <h2 style="color: #123b5d; margin-top: 0;">مرحباً بك في منظومة GemIInI SudaGene</h2>
          <p>تم تسجيل حسابك وتوثيق هويتك الأكاديمية بنجاح.</p>
          <div style="background-color: #f8fafc; border-right: 4px solid #168c8c; padding: 16px; margin: 20px 0; border-radius: 6px;">
            <p style="margin: 0; font-weight: bold; color: #123b5d;">معرفك الأكاديمي (GA-ID): <span style="font-family: monospace; font-size: 18px; color: #168c8c;">${gaId}</span></p>
            <p style="margin: 8px 0 0 0; font-size: 13px; color: #64748b;">حالة الحساب: قيد التفعيل المبدئي (+25 GP)</p>
          </div>
          <p style="font-size: 14px; line-height: 1.6;">يمكنك الآن البدء في تقييم مستواك السريري عبر إجراء التقييم التشخيصي الأول:</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="https://geneacademy.net/start.html" style="background-color: #123b5d; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">بدء التقييم التشخيصي (20 MTC Questions)</a>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">GemIInI Sovereign Platform &bull; SudaGene Medical Consortium</p>
        </div>
      `
    });

    GmailApp.sendEmail('admissions@geneacademy.net', `[NEW REGISTRATION] ${gaId} — ${legalName}`,
      `GA-ID: ${gaId}\nName: ${legalName}\nEmail: ${email}\nPhone: ${phone}\nUniversity: ${university}\nCareer Stage: ${careerStage}\nSource: ${sourceChannel}`,
      { name: 'SudaGene System Engine', replyTo: 'admissions@geneacademy.net', cc: 'mohamedgibbril@geneacademy.net' });
  } catch (e) {
    Logger.log('Email dispatch warning: ' + e.message);
  }

  return {
    success: true, gaId: gaId, legalName: legalName, status: 'PENDING_REVIEW', sudaPassHash: sudaPassHash,
    message: 'تم استلام طلبك وتوثيق هويتك بنجاح (' + gaId + ').'
  };
}

function handleBlsRegister(payload, ss) {
  let gaId = String(payload.gaId || payload.ga_id || '').trim().toUpperCase();
  const fullName = String(payload.fullName || payload.full_name || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const phone = String(payload.phone || '').trim();
  const university = String(payload.university || '').trim();
  const txRef = String(payload.txRef || payload.transaction_ref || '').trim().toUpperCase();
  const paymentChoice = String(payload.paymentChoice || (txRef ? 'pay_now' : 'pay_later')).trim().toLowerCase();
  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);

  const requestedCohortId = String(payload.cohortId || '').trim().toUpperCase();
  const cohort = CONFIG.BLS_COHORTS[requestedCohortId] || CONFIG.BLS_COHORTS[CONFIG.DEFAULT_BLS_COHORT];
  if (!cohort) return { success: false, error: 'NO_VALID_COHORT_CONFIGURED' };

  if (!gaId || !userExists(authSheet, gaId)) {
    if (!fullName || !email) return { success: false, error: 'NAME_AND_EMAIL_REQUIRED' };
    gaId = mintNextGaId(authSheet);
    const nowIso = new Date().toISOString();
    const hash = generateSudaPassHash(gaId, nowIso);
    const sourceChannel = determineSourceChannel(payload, email);
    authSheet.appendRow([gaId, fullName, email, phone, university || 'Candidate Institution', '', '', 'BLS Candidate', 'PENDING_REVIEW', hash, nowIso, sourceChannel]);
    getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY).appendRow([gaId, 25, 0, 0, 0, nowIso]);
  }

  const rosterSheet = getOrCreateSheet(ss, CONFIG.SHEET_ROSTER);
  const rosterData = rosterSheet.getDataRange().getValues();
  let paidCount = 0, provisionalCount = 0;
  for (let i = 1; i < rosterData.length; i++) {
    if (String(rosterData[i][1]) !== cohort.id) continue;
    const st = String(rosterData[i][6]);
    if (st.includes('CONFIRMED')) paidCount++;
    if (st.includes('PROVISIONAL')) provisionalCount++;
  }

  const isPaid = paymentChoice === 'pay_now' && txRef;
  const isOverflow = (isPaid && paidCount >= cohort.maxPaid) || (!isPaid && (paidCount + provisionalCount) >= (cohort.maxPaid + cohort.maxProvisional));
  const timestamp = new Date().toISOString();
  const paymentSheet = getOrCreateSheet(ss, CONFIG.SHEET_PAYMENTS);

  if (isOverflow) {
    paymentSheet.appendRow([timestamp, gaId, txRef || 'OVERFLOW_WAITLIST', 'VODAFONE_CASH_EG', 0, cohort.currency, 'WAITLIST', cohort.id]);
    return { success: true, gaId: gaId, waitlist: true, cohortDate: cohort.date, message: 'الدفعة الحالية مكتملة. تم تسجيلك في قائمة الانتظار.' };
  }
  if (txRef && isDuplicateTransaction(paymentSheet, txRef)) return { success: false, error: 'DUPLICATE_TRANSACTION_REFERENCE' };

  const fee = cohort.fee;
  paymentSheet.appendRow([timestamp, gaId, txRef || 'DEFERRED_PAY_LATER', 'VODAFONE_CASH_EG', isPaid ? fee : 0, cohort.currency, isPaid ? 'PENDING_VERIFICATION' : 'PROVISIONAL_HOLD', cohort.id]);
  rosterSheet.appendRow([gaId, cohort.id, cohort.date, cohort.venue, isPaid ? fee : 0, txRef || 'HOLD', isPaid ? 'CONFIRMED_PENDING_PAYMENT_CLEAR' : 'PROVISIONAL_HELD_24H']);

  // Automated Email Dispatch to Candidate & Admissions Desk
  try {
    if (email) {
      MailApp.sendEmail({
        to: email,
        subject: `[GemIInI BLS] Cohort Seat Reservation — ${gaId}`,
        htmlBody: `
          <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
            <h2 style="color: #123b5d; margin-top: 0;">حجز مقعد ورشة الإنعاش القلبي الرئوي (BLS)</h2>
            <p>عزيزي الطبيب (${fullName || gaId})، تم تسجيل حجز مقعدك بنجاح.</p>
            <div style="background-color: #f8fafc; border-right: 4px solid #168c8c; padding: 16px; margin: 20px 0; border-radius: 6px;">
              <p style="margin: 0; font-weight: bold; color: #123b5d;">رمز الدفعة: <span style="font-family: monospace; font-size: 16px; color: #168c8c;">${cohort.id}</span></p>
              <p style="margin: 6px 0;">تاريخ الورشة: <strong>${cohort.date}</strong></p>
              <p style="margin: 6px 0;">المقر: <strong>${cohort.venue}</strong></p>
              <p style="margin: 6px 0;">رسوم الدورة: <strong>${fee} ${cohort.currency}</strong> (تأكيد المقعد: 1,000 EGP عربون حجز)</p>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #64748b;">حالة الحجز: ${isPaid ? 'قيد مراجعة إيصال التحويل' : 'مؤقت (لمدة 24 ساعة)'}</p>
            </div>
            <p style="font-size: 13px; line-height: 1.6;">لإتمام الحجز، يرجى إرسال إشعار التحويل عبر <strong>Vodafone Cash (01015922628)</strong> أو InstaPay مع ذكر معرفك الأكاديمي (${gaId}).</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
            <p style="font-size: 12px; color: #94a3b8; text-align: center;">GemIInI Sovereign Platform &bull; SudaGene Medical Consortium</p>
          </div>
        `
      });
    }
    GmailApp.sendEmail('admissions@geneacademy.net', `[BLS REGISTRATION] ${gaId} — ${fullName || email}`,
      `GA-ID: ${gaId}\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nCohort: ${cohort.id}\nTxRef: ${txRef || 'NONE'}\nPaid: ${isPaid}`,
      { cc: 'mohamedgibbril@geneacademy.net' });
  } catch (e) {
    Logger.log('BLS email notification warning: ' + e.message);
  }

  return {
    success: true, gaId: gaId, confirmed: isPaid, seatNumber: paidCount + 1, cohortDate: cohort.date, courseFee: fee, currency: cohort.currency,
    message: isPaid ? 'تم استلام بيانات التحويل. مقعدك قيد التدقيق.' : 'تم حجز مقعدك المبدئي لمدة 24 ساعة.'
  };
}

function handleLookup(payload, ss) {
  const gaId = String(payload.gaId || payload.id || '').trim().toUpperCase();
  if (!gaId) return { success: false, error: 'GA_ID_REQUIRED' };
  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const data = authSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === gaId) {
      const telemetry = getTelemetryForUser(ss, gaId);
      const status = String(data[i][8]);
      return {
        success: true, verified: ['ACTIVE', 'VERIFIED', 'ACCREDITED'].includes(status.toUpperCase()),
        user: { gaId: data[i][0], legalName: data[i][1], university: data[i][4], careerStage: data[i][7], status: status, telemetry: telemetry }
      };
    }
  }
  return { success: false, error: 'USER_NOT_FOUND', verified: false };
}

function handleLookupByEmail(payload, ss) {
  const email = String(payload.email || '').trim().toLowerCase();
  if (!email) return { success: false, error: 'EMAIL_REQUIRED' };
  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const data = authSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][2]).trim().toLowerCase() === email) {
      return { success: true, found: true, gaId: String(data[i][0]), status: String(data[i][8]) };
    }
  }
  return { success: true, found: false };
}

function handleLogTelemetry(payload, ss) {
  const gaId = String(payload.gaId || '').trim().toUpperCase();
  if (!gaId) return { success: false, error: 'GA_ID_REQUIRED' };
  const deltaGp = Math.min(Math.max(Number(payload.deltaGp || payload.gp || 0), -50), 100);
  const ccr = Math.min(Math.max(Number(payload.ccr || 0), 0), 100);
  const accuracy = Math.min(Math.max(Number(payload.accuracy || 0), 0), 100);
  const sheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  const data = sheet.getDataRange().getValues();
  const timestamp = new Date().toISOString();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === gaId) {
      const newGp = Math.max(0, (Number(data[i][1]) || 0) + deltaGp);
      const newStreak = deltaGp > 0 ? (Number(data[i][4]) || 0) + 1 : (Number(data[i][4]) || 0);
      sheet.getRange(i + 1, 2).setValue(newGp);
      if (ccr > 0) sheet.getRange(i + 1, 3).setValue(ccr);
      if (accuracy > 0) sheet.getRange(i + 1, 4).setValue(accuracy);
      sheet.getRange(i + 1, 5).setValue(newStreak);
      sheet.getRange(i + 1, 6).setValue(timestamp);
      return { success: true, gaId: gaId, gp: newGp, streak: newStreak, updated: true };
    }
  }
  sheet.appendRow([gaId, Math.max(25, 25 + deltaGp), ccr, accuracy, 1, timestamp]);
  return { success: true, gaId: gaId, gp: 25 + deltaGp, streak: 1, created: true };
}

function handleCachedLeaderboard(ss) {
  const authData = getOrCreateSheet(ss, CONFIG.SHEET_AUTH).getDataRange().getValues();
  const telData = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY).getDataRange().getValues();
  const telMap = {};
  for (let i = 1; i < telData.length; i++) {
    telMap[String(telData[i][0]).toUpperCase()] = { gp: Number(telData[i][1]) || 0, ccr: Number(telData[i][2]) || 0, accuracy: Number(telData[i][3]) || 0, streak: Number(telData[i][4]) || 0 };
  }
  const list = [];
  for (let i = 1; i < authData.length; i++) {
    const id = String(authData[i][0]).toUpperCase();
    if (!id) continue;
    const t = telMap[id] || { gp: 0, ccr: 0, accuracy: 0, streak: 0 };
    list.push({ id: id, name: String(authData[i][1]), university: String(authData[i][4]), gp: t.gp, ccr: t.ccr, accuracy: t.accuracy, streak: t.streak, sRank: Math.round(t.gp + t.ccr * 10 + t.accuracy * 5 + t.streak * 20) });
  }
  list.sort((a, b) => b.sRank - a.sRank);
  return { success: true, count: list.length, items: list.slice(0, 50).map((m, i) => ({ rank: i + 1, ...m })) };
}

function handleUnivStats(ss) {
  const authData = getOrCreateSheet(ss, CONFIG.SHEET_AUTH).getDataRange().getValues();
  let totalVerified = 0;
  for (let i = 1; i < authData.length; i++) {
    if (['ACTIVE', 'VERIFIED', 'ACCREDITED'].includes(String(authData[i][8]).toUpperCase())) totalVerified++;
  }
  return {
    success: true,
    totalRegistered: Math.max(0, authData.length - 1),
    totalVerified: totalVerified,
    facultiesCount: null,
    bssGraduates: null,
    blsGraduates: null,
    clusters: {}
  };
}

function handleFeedback(payload, ss) {
  const gaId = String(payload.gaId || '').trim().toUpperCase();
  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  if (!gaId || !userExists(authSheet, gaId)) return { success: false, error: 'UNAUTHORIZED_GA_ID' };
  const feedbackSheet = getOrCreateSheet(ss, CONFIG.SHEET_FEEDBACK);
  const fbData = feedbackSheet.getDataRange().getValues();
  for (let i = 1; i < fbData.length; i++) {
    if (String(fbData[i][1]).trim().toUpperCase() === gaId) return { success: false, error: 'SURVEY_ALREADY_SUBMITTED' };
  }
  const referral = String(payload.peerReferral || '').trim();
  const gpAward = referral ? 75 : 25;
  feedbackSheet.appendRow([
    new Date().toISOString(), gaId, String(payload.email || '').trim().toLowerCase(), String(payload.phone || '').trim(),
    String(payload.wtpCurrency || 'SDG').toUpperCase(), Number(payload.wtp400) || 0, Number(payload.wtp800) || 0, Number(payload.wtp1200) || 0,
    String(payload.targetModules || ''), String(payload.targetPathways || ''), Number(payload.csatScore) || 5, Number(payload.sudaPassRating) || 5,
    referral, gpAward
  ]);
  handleLogTelemetry({ gaId: gaId, deltaGp: gpAward }, ss);
  return { success: true, gaId: gaId, gpAwarded: gpAward, message: 'Feedback archived and GP points credited.' };
}

function handleB2BPartnership(payload, ss) {
  const contactPerson = String(payload.contactPerson || payload.name || '').trim();
  const organization = String(payload.organization || payload.org || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  if (!contactPerson || !email) return { success: false, error: 'MISSING_MANDATORY_CONTACT_OR_EMAIL' };
  const b2bSheet = getOrCreateSheet(ss, CONFIG.SHEET_B2B);
  const submissionId = mintNextB2bId(b2bSheet);
  const timestamp = new Date().toISOString();
  b2bSheet.appendRow([
    timestamp, submissionId, contactPerson, organization, String(payload.orgType || 'Academic Institution').trim(), email,
    String(payload.location || '').trim(), String(payload.serviceRequired || '').trim(), String(payload.scope || '').trim(),
    String(payload.notes || '').trim(), 'NEW', 'GA-011 (Eng. Amjad)', 'Schedule Initial 20-min Briefing'
  ]);
  try {
    MailApp.sendEmail({
      to: email,
      subject: `[Gene Academy B2B] Briefing Request Received — ${submissionId}`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
          <h2 style="color: #123b5d; margin-top: 0;">Institutional Partnership Enquiry</h2>
          <p>Dear ${contactPerson},</p>
          <p>Thank you for submitting an institutional briefing enquiry for <strong>${organization}</strong>.</p>
          <div style="background-color: #f8fafc; border-left: 4px solid #123b5d; padding: 16px; margin: 20px 0; border-radius: 6px;">
            <p style="margin: 0; font-weight: bold;">Submission Reference: <span style="font-family: monospace; font-size: 16px; color: #168c8c;">${submissionId}</span></p>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #64748b;">Assigned Desk: Operational & Telemetry Infrastructure (GA-011)</p>
          </div>
          <p>Our institutional partnerships team will contact you within 24 hours to schedule the initial 20-minute alignment briefing.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">Gene Academy &bull; SudaGene Medical Consortium &bull; b2b@geneacademy.net</p>
        </div>
      `
    });
    GmailApp.sendEmail('b2b@geneacademy.net', `[B2B ENQUIRY] ${submissionId} — ${organization}`,
      `Submission ID: ${submissionId}\nContact: ${contactPerson}\nOrganization: ${organization}\nEmail: ${email}\nTimestamp: ${timestamp}`,
      { cc: 'mohamedgibbril@geneacademy.net' });
  } catch (e) {
    Logger.log('B2B email dispatch warning: ' + e.message);
  }
  return { success: true, submissionId: submissionId, status: 'RECORDED', message: 'Your institutional briefing enquiry has been successfully logged.' };
}

function handleResearchPodIntake(payload, ss) {
  const name = String(payload.name || payload.fullName || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  if (!name || !email) return { success: false, error: 'MISSING_MANDATORY_NAME_OR_EMAIL' };
  const podSheet = getOrCreateSheet(ss, CONFIG.SHEET_RESEARCH);
  const timestamp = new Date().toISOString();
  podSheet.appendRow([
    timestamp, name, email, String(payload.phone || '').trim(), String(payload.university || '').trim(),
    String(payload.careerStage || payload.role || 'Medical Practitioner').trim(), String(payload.track || 'Molecular Medicine & Genomics').trim(),
    String(payload.notes || payload.publications || '').trim(), 'PENDING_MATCH', 'GA-000 (Dr. Mohamed Gibbril)'
  ]);
  try {
    MailApp.sendEmail({
      to: email,
      subject: `[SudaGene Research] 15:5:1 Pod Application Received`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
          <h2 style="color: #123b5d; margin-top: 0;">تم استلام طلب الانضمام لمجموعات الأبحاث (15:5:1 Pods)</h2>
          <p>عزيزي الطبيب (${name})،</p>
          <p>تم إدراج بياناتك بنجاح في سجل أبحاث SudaGene Medical Consortium.</p>
          <div style="background-color: #f8fafc; border-right: 4px solid #168c8c; padding: 16px; margin: 20px 0; border-radius: 6px;">
            <p style="margin: 0; font-weight: bold; color: #123b5d;">المسار البحثي: <span style="color: #168c8c;">${String(payload.track || 'General Research').trim()}</span></p>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #64748b;">حالة الطلب: قيد الفحص والمطابقة بواسطة لجنة الأبحاث الأكاديمية</p>
          </div>
          <p style="font-size: 13px; line-height: 1.6;">سيتم التواصل معك عبر البريد الإلكتروني فور توجيه ملفك إلى المشرف الرئيسي (Principal Investigator) الخاص بالمجموعة.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">SudaGene Research Sanctuary &bull; admissions@geneacademy.net</p>
        </div>
      `
    });
    GmailApp.sendEmail('admissions@geneacademy.net', `[RESEARCH POD INTAKE] ${name}`,
      `Name: ${name}\nEmail: ${email}\nTrack: ${payload.track}\nTimestamp: ${timestamp}`, { cc: 'mohamedgibbril@geneacademy.net' });
  } catch (e) {
    Logger.log('Research email dispatch warning: ' + e.message);
  }
  return { success: true, status: 'ENROLLED', message: 'Your research application has been logged into the SudaGene Research Registry.' };
}

function isDuplicateTransaction(paymentSheet, txRef) {
  if (!txRef) return false;
  const data = paymentSheet.getDataRange().getValues();
  const norm = String(txRef).trim().toUpperCase();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][2]).trim().toUpperCase() === norm) return true;
  }
  return false;
}

function userExists(authSheet, gaId) {
  const data = authSheet.getDataRange().getValues();
  const norm = String(gaId).trim().toUpperCase();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === norm) return true;
  }
  return false;
}

function getTelemetryForUser(ss, gaId) {
  const data = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY).getDataRange().getValues();
  const norm = String(gaId).trim().toUpperCase();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === norm) {
      return { gp: Number(data[i][1]) || 0, ccr: Number(data[i][2]) || 0, accuracy: Number(data[i][3]) || 0, streak: Number(data[i][4]) || 0 };
    }
  }
  return { gp: 0, ccr: 0, accuracy: 0, streak: 0 };
}

/**
 * REPAIR UTILITY — GA-1542 to GA-1551. Explicit verified per-row values +
 * automatic timestamped backup before touching anything. Run ONCE, manually,
 * from the Apps Script editor. Not part of doPost/doGet — safe to leave in.
 */
function repairCorruptedRows_1542_1551() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const authSheet = ss.getSheetByName(CONFIG.SHEET_AUTH);
  if (!authSheet) throw new Error('CRITICAL: Tab "MASTER_AUTH" not found.');
  const salt = getSecretSalt();
  const data = authSheet.getDataRange().getValues();

  const backupSheetName = 'BACKUP_AUTH_' + Utilities.formatDate(new Date(), 'GMT+3', 'yyyyMMdd_HHmmss');
  const backupSheet = ss.insertSheet(backupSheetName);
  backupSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  Logger.log('Safety backup created: ' + backupSheetName);

  const CORRECTIONS = {
    'GA-1542': { legalName: 'محمد أحمد عبد الفتاح', email: 'mohamedgibbril@gmail.com', phone: '201270192777', location: 'Egypt', university: 'Faculty of Medicine, University of Khartoum', hospital: '', careerStage: 'House Officer', sourceChannel: 'STAFF_INTERNAL_GA000' },
    'GA-1543': { legalName: 'د. سيدة عبدالله حسن علي', email: 'saydaabdallah8@gmail.com', phone: '249914867346', location: 'Sudan', university: 'Other Canonical Sudanese Faculty', hospital: '', careerStage: 'Resident', sourceChannel: 'WEB_ORGANIC' },
    'GA-1544': { legalName: 'امجد قرشي حسن علي', email: 'amjadgorashi32@gmail.com', phone: '966550476176', location: 'Saudi Arabia', university: 'Faculty of Medicine, University of Khartoum', hospital: '', careerStage: 'Clinical Student', sourceChannel: 'STAFF_INTERNAL_GA011' },
    'GA-1545': { legalName: 'د. حسين بشرى موسى عبد الهادي', email: 'husseinbushra02@gmail.com', phone: '24914679728', location: 'Sudan', university: 'Faculty of Medicine, University of Khartoum', hospital: '', careerStage: 'Clinical Student', sourceChannel: 'WEB_ORGANIC' },
    'GA-1546': { legalName: 'صفاء مكي موسي عبدالرحمن', email: 'safamaki25@gmail.com', phone: '249127112991', location: 'Sudan', university: 'Faculty of medicine university of Elfasher', hospital: '', careerStage: 'Resident', sourceChannel: 'WEB_ORGANIC' },
    'GA-1547': { legalName: 'محمد احمد دوتم احمد', email: 'moddyx25@gmail.com', phone: '906067057', location: 'Sudan', university: 'Riyadh International College', hospital: '', careerStage: 'House Officer', sourceChannel: 'WEB_ORGANIC' },
    'GA-1548': { legalName: 'نازك مهدي محمود أحمد', email: 'nazikaboasal@gmail.com', phone: '129912127', location: 'Sudan', university: 'Other Canonical Sudanese Faculty', hospital: '', careerStage: 'House Officer', sourceChannel: 'WEB_ORGANIC' },
    'GA-1549': { legalName: 'Montaser Mohammed Ahmed Tambl Ably', email: 'tambl199723@gmail.com', phone: '966547624854', location: 'Saudi Arabia', university: 'Faculty of Medicine, Al-Neelain University', hospital: '', careerStage: 'Resident', sourceChannel: 'WEB_ORGANIC' },
    'GA-1550': { legalName: 'د.سلافه على هارون اندوسه', email: 'solafaandosa@gmail.com', phone: '+201125192876', location: 'Egypt', university: 'Faculty of Medicine, National University Sudan | الجامعة الوطنية | NUSU', hospital: '', careerStage: 'Medical Graduate', sourceChannel: 'WEB_ORGANIC' },
    'GA-1551': { legalName: 'Safa Abdelgadir Mohamed Elhassan', email: 'safaelhassan44@gmail.com', phone: '96550872572', location: 'Other', university: 'Not specified', hospital: '', careerStage: 'Doctor or healthcare professional', sourceChannel: 'STAFF_INTERNAL_GA004' }
  };

  let repairedCount = 0;
  const repairedList = [];

  for (let r = 1; r < data.length; r++) {
    const gaId = String(data[r][0] || '').trim().toUpperCase();
    const fix = CORRECTIONS[gaId];
    if (!fix) continue;
    const createdAt = data[r][10] ? new Date(data[r][10]).toISOString() : new Date().toISOString();
    const rawPayload = gaId + '|' + createdAt + '|' + salt;
    const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, rawPayload);
    const newHash = digest.map(b => (b < 0 ? b + 256 : b).toString(16).padStart(2, '0')).join('');
    const status = fix.sourceChannel.startsWith('STAFF_INTERNAL') ? 'INTERNAL_TEST_SUBMISSION' : 'PENDING_REVIEW';
    const correctedRow = [gaId, fix.legalName, fix.email, fix.phone, fix.university, fix.hospital, fix.location, fix.careerStage, status, newHash, createdAt, fix.sourceChannel];
    authSheet.getRange(r + 1, 1, 1, correctedRow.length).setValues([correctedRow]);
    repairedCount++;
    repairedList.push(gaId);
  }

  CacheService.getScriptCache().remove('PUBLIC_LEADERBOARD');
  Logger.log('Repaired ' + repairedCount + ' rows: ' + repairedList.join(', '));
  return { success: true, repairedCount: repairedCount, repairedIds: repairedList, backupSheet: backupSheetName };
}
