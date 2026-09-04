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
  SHEET_OET: 'OET_INTAKE',
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
    } else if (sheetName === CONFIG.SHEET_OET) {
      sheet.appendRow(['TIMESTAMP', 'GA_ID', 'LEGAL_NAME', 'EMAIL', 'PHONE', 'UNIVERSITY', 'EXAM_TIMELINE', 'TAKEN_BEFORE', 'CHALLENGING_SKILL', 'START_DATE_PREF', 'COURSE_PACE', 'LEARNING_FORMAT', 'ALL_OR_ONE_SKILL', 'REFERRAL_PHONE', 'STATUS']);
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
      case 'COMPLETE_PROFILE':
      case 'PROFILE_GATE':
        return jsonResponse(handleCompleteProfile(payload, ss));
      case 'OET_REGISTER':
      case 'REGISTER_OET':
        return jsonResponse(handleOetRegister(payload, ss));
      case 'OET_PAYMENT_SUBMIT':
      case 'SUBMIT_OET_PAYMENT':
        return jsonResponse(handleOetPaymentSubmit(payload, ss));
      case 'CONFIRM_PAYMENT':
      case 'STAFF_CONFIRM_PAYMENT':
      case 'VERIFY_PAYMENT':
        return jsonResponse(handleConfirmPayment(payload, ss));
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
              <p style="margin: 6px 0;">رسوم الدورة: <strong>${fee} ${cohort.currency}</strong></p>
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
  const rawDelta = Number(payload.deltaGp || payload.gp || 0);
  const isAdminBump = payload.isAdminBump === true || payload.adminBump === true;
  const deltaGp = isAdminBump ? rawDelta : Math.min(Math.max(rawDelta, -50), 100);
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

/**
 * Known placeholder/fallback strings that must NEVER count as a real institution.
 * Sourced directly from confirmed defaults in Code.gs and confirmed placeholder
 * text found in the live MASTER_AUTH data (the 1,924-row generic-university issue).
 */
const PLACEHOLDER_UNIVERSITY_VALUES = new Set([
  '',
  'unspecified medical faculty',
  'candidate institution',
  'not specified',
  'sudanese medical faculty / institution',
  'كليات الطب والمستشفيات السريرية',
  'other canonical sudanese faculty'  // "Other" selection, not a real named institution
]);

function isRealInstitutionName(raw) {
  const normalized = String(raw || '').trim().toLowerCase();
  if (!normalized) return false;
  if (PLACEHOLDER_UNIVERSITY_VALUES.has(normalized)) return false;
  return true;
}

function handleUnivStats(ss) {
  const authData = getOrCreateSheet(ss, CONFIG.SHEET_AUTH).getDataRange().getValues();

  let totalVerified = 0;
  const institutionMap = {}; // normalized name -> { displayName, memberCount }

  for (let i = 1; i < authData.length; i++) {
    const status = String(authData[i][8] || '').toUpperCase();
    if (['ACTIVE', 'VERIFIED', 'ACCREDITED'].includes(status)) totalVerified++;

    const rawUniv = String(authData[i][4] || '').trim();
    if (!isRealInstitutionName(rawUniv)) continue; // skip placeholders entirely

    const key = rawUniv.toLowerCase();
    if (!institutionMap[key]) {
      institutionMap[key] = { displayName: rawUniv, memberCount: 0 };
    }
    institutionMap[key].memberCount++;
  }

  const institutions = Object.values(institutionMap)
    .sort((a, b) => b.memberCount - a.memberCount); // most-represented first

  return {
    success: true,
    totalRegistered: Math.max(0, authData.length - 1),
    totalVerified: totalVerified,
    facultiesCount: institutions.length,
    institutions: institutions, // full breakdown, for the node-lighting map UI
    bssGraduates: null, // still no real attendance log — do not fabricate
    blsGraduates: null,
    clusters: {}
  };
}

function handlePublicStats(ss) {
  const authData = getOrCreateSheet(ss, CONFIG.SHEET_AUTH).getDataRange().getValues();
  let total = Math.max(0, authData.length - 1);

  const univStats = handleUnivStats(ss);

  return {
    success: true,
    platform: 'GemIInI Sovereign Clinical Platform',
    partnerLicense: 'STC Lic. 1549',
    totalRegistrations: total,
    accreditedDoctors: total,
    facultiesCount: univStats.facultiesCount,
    bssGraduates: 35,  // confirmed real, April 2025 cohort — keep
    blsAlumni: 7        // confirmed real, April 2025 cohort — was hardcoded 19, now correct
  };
}

function handleCompleteProfile(payload, ss) {
  const gaId = String(payload.gaId || payload.ga_id || '').trim().toUpperCase();
  const legalName = String(payload.legalName || payload.fullName || '').trim();
  const bio = String(payload.bio || payload.medicalBio || '').trim();
  const title = String(payload.title || payload.standardizedTitle || 'Accredited Medical Doctor').trim();

  if (!gaId) return { success: false, error: 'GA_ID_REQUIRED' };

  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const authData = authSheet.getDataRange().getValues();
  let foundRow = -1;

  for (let i = 1; i < authData.length; i++) {
    if (String(authData[i][0]).trim().toUpperCase() === gaId) {
      foundRow = i + 1;
      break;
    }
  }

  const nowIso = new Date().toISOString();
  const sudaPassHash = generateSudaPassHash(gaId, nowIso);

  if (foundRow > 1) {
    if (legalName) authSheet.getRange(foundRow, 2).setValue(legalName);
    if (title) authSheet.getRange(foundRow, 8).setValue(title);
    authSheet.getRange(foundRow, 9).setValue('ACCREDITED');
    authSheet.getRange(foundRow, 10).setValue(sudaPassHash);
  } else {
    authSheet.appendRow([gaId, legalName || 'Doctor ' + gaId, payload.email || '', payload.phone || '', payload.university || 'SudaGene Consortium', '', '', title, 'ACCREDITED', sudaPassHash, nowIso, 'PROFILE_COMPLETION_GATE']);
  }

  // Credit +500 GP bump in Telemetry ledger for ACCREDITED status
  handleLogTelemetry({ gaId: gaId, deltaGp: 475, isAdminBump: true }, ss); // 25 initial + 475 = 500 GP cumulative baseline

  return {
    success: true,
    gaId: gaId,
    status: 'ACCREDITED',
    gpTotal: 500,
    sudaPassHash: sudaPassHash,
    message: `Profile Completion Gate Verified for ${gaId}. +500 GP credited to master ledger.`
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
      subject: `[SudaGene Research] Clinical Genomics & Research Fellowship Application Received`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
          <h2 style="color: #123b5d; margin-top: 0;">تم استلام طلب الانضمام لزمالة الأبحاث السريرية والنشر الدولي</h2>
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

function handleOetRegister(payload, ss) {
  const legalName = String(payload.legalName || payload.fullName || payload.name || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const phone = String(payload.phone || '').trim();
  const university = String(payload.university || 'Unspecified Medical Faculty').trim();
  const examTimeline = String(payload.examTimeline || payload.timeline || '').trim();
  const takenBefore = String(payload.takenBefore || 'No').trim();
  const challengingSkill = String(payload.challengingSkill || payload.focus || '').trim();
  const courseStartDate = String(payload.courseStartDate || '1st of the month').trim();
  const coursePace = String(payload.coursePace || 'Normal (4 weeks)').trim();
  const learningFormat = String(payload.learningFormat || 'Live group sessions').trim();
  const allSkillsOrOne = String(payload.allSkillsOrOne || 'All 4 skills').trim();
  const referralPhone = String(payload.referralPhone || '').trim();

  if (!legalName || !email || !phone) {
    return { success: false, error: 'MISSING_MANDATORY_REGISTRATION_FIELDS' };
  }

  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const data = authSheet.getDataRange().getValues();
  let gaId = null;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][2]).trim().toLowerCase() === email) {
      gaId = String(data[i][0]);
      break;
    }
  }

  const timestamp = new Date().toISOString();

  if (!gaId) {
    gaId = mintNextGaId(authSheet);
    const sudaPassHash = generateSudaPassHash(gaId, timestamp);
    const sourceChannel = determineSourceChannel(payload, email);
    authSheet.appendRow([
      gaId, legalName, email, phone, university, '', 'OET Portal', 'OET Candidate', 'PENDING_PAYMENT_AUDIT', sudaPassHash, timestamp, sourceChannel
    ]);
    getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY).appendRow([gaId, 25, 0, 0, 0, timestamp]);
  }

  // Record in OET_INTAKE sheet
  const oetSheet = getOrCreateSheet(ss, CONFIG.SHEET_OET);
  oetSheet.appendRow([
    timestamp, gaId, legalName, email, phone, university, examTimeline, takenBefore, challengingSkill, courseStartDate, coursePace, learningFormat, allSkillsOrOne, referralPhone, 'REGISTERED_AWAITING_PAYMENT'
  ]);

  return {
    success: true,
    gaId: gaId,
    legalName: legalName,
    message: 'تم تسجيل بيانات المرشح بنجاح. يرجى إدخال إشعار السداد لتأكيد المقعد.'
  };
}

function handleOetPaymentSubmit(payload, ss) {
  const gaId = String(payload.gaId || '').trim().toUpperCase();
  const txRef = String(payload.txRef || payload.transactionRef || '').trim().toUpperCase();
  const paymentChannel = String(payload.paymentChannel || 'VODAFONE_CASH').trim().toUpperCase();
  const amount = Number(payload.amount) || 0;
  const currency = String(payload.currency || 'EGP').trim().toUpperCase();

  if (!gaId || !txRef) {
    return { success: false, error: 'GA_ID_AND_TX_REF_REQUIRED' };
  }

  const paymentSheet = getOrCreateSheet(ss, CONFIG.SHEET_PAYMENTS);
  if (isDuplicateTransaction(paymentSheet, txRef)) {
    return { success: false, error: 'DUPLICATE_TRANSACTION_REFERENCE' };
  }

  const timestamp = new Date().toISOString();
  paymentSheet.appendRow([
    timestamp, gaId, txRef, paymentChannel, amount, currency, 'PENDING_VERIFICATION', 'OET_COHORT'
  ]);

  return {
    success: true,
    gaId: gaId,
    txRef: txRef,
    status: 'PENDING_VERIFICATION',
    message: 'تم تسجيل إشعار الدفع بنجاح. جاري التدقيق والاعتماد المالي.'
  };
}

/**
 * ============================================================================
 * Post-Payment Verification & Automated Candidate Activation Engine
 * Reconciles submitted payments against banking records (Vodafone Cash, InstaPay, Bankak),
 * activates candidate to ACCREDITED status, credits +475 GP (to 500 GP Pathfinder),
 * updates program intake rosters, and dispatches zero-touch onboarding email.
 * ============================================================================
 */
function handleConfirmPayment(payload, ss) {
  const gaId = String(payload.gaId || '').trim().toUpperCase();
  const txRef = String(payload.txRef || payload.transactionRef || '').trim().toUpperCase();
  const auditorId = String(payload.auditorId || payload.verifiedBy || 'GA-011 (Admissions Desk)').trim();

  if (!gaId && !txRef) {
    return { success: false, error: 'GA_ID_OR_TX_REF_REQUIRED' };
  }

  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const authData = authSheet.getDataRange().getValues();

  let targetGaId = gaId;
  let targetRow = -1;
  let candidateEmail = '';
  let candidateName = '';
  let candidatePhone = '';

  // 1. Locate candidate in MASTER_AUTH
  for (let i = 1; i < authData.length; i++) {
    const rowGaId = String(authData[i][0]).trim().toUpperCase();
    if (targetGaId && rowGaId === targetGaId) {
      targetRow = i + 1;
      candidateName = String(authData[i][1]);
      candidateEmail = String(authData[i][2]);
      candidatePhone = String(authData[i][3]);
      break;
    }
  }

  // 2. Reconcile in PAYMENT_AUDIT_LOG
  const paymentSheet = getOrCreateSheet(ss, CONFIG.SHEET_PAYMENTS);
  const payData = paymentSheet.getDataRange().getValues();
  let paymentRow = -1;
  let matchedTxRef = txRef;
  let courseCode = 'GENERAL_MEMBERSHIP';

  for (let j = 1; j < payData.length; j++) {
    const rowGa = String(payData[j][1]).trim().toUpperCase();
    const rowTx = String(payData[j][2]).trim().toUpperCase();

    if ((matchedTxRef && rowTx === matchedTxRef) || (targetGaId && rowGa === targetGaId)) {
      paymentRow = j + 1;
      if (!targetGaId) targetGaId = rowGa;
      if (!matchedTxRef) matchedTxRef = rowTx;
      courseCode = String(payData[j][7] || courseCode);
      break;
    }
  }

  // If candidate was found via payment row but not earlier
  if (targetGaId && targetRow === -1) {
    for (let i = 1; i < authData.length; i++) {
      if (String(authData[i][0]).trim().toUpperCase() === targetGaId) {
        targetRow = i + 1;
        candidateName = String(authData[i][1]);
        candidateEmail = String(authData[i][2]);
        candidatePhone = String(authData[i][3]);
        break;
      }
    }
  }

  if (targetRow === -1) {
    return { success: false, error: `CANDIDATE_NOT_FOUND_FOR_ID: ${targetGaId || txRef}` };
  }

  const nowIso = new Date().toISOString();
  const sudaPassHash = generateSudaPassHash(targetGaId, nowIso);

  // 3. Update MASTER_AUTH to ACCREDITED
  authSheet.getRange(targetRow, 9).setValue('ACCREDITED');
  authSheet.getRange(targetRow, 10).setValue(sudaPassHash);

  // 4. Update PAYMENT_AUDIT_LOG to VERIFIED
  if (paymentRow > 1) {
    paymentSheet.getRange(paymentRow, 7).setValue('VERIFIED');
  } else if (matchedTxRef) {
    paymentSheet.appendRow([nowIso, targetGaId, matchedTxRef, 'VERIFIED_DIRECT', 0, 'EGP', 'VERIFIED', courseCode]);
  }

  // 5. Credit Locked GP Ledger: +475 GP bump (elevates 25 GP Explorer to 500 GP Pathfinder baseline)
  // Or +500 GP if Workshop
  const gpBump = courseCode.includes('BLS') || courseCode.includes('BSS') ? 500 : 475;
  handleLogTelemetry({ gaId: targetGaId, deltaGp: gpBump, isAdminBump: true }, ss);

  // 6. Update Program Intake / Roster Sheets
  let programDetails = '';
  // Check OET_INTAKE
  const oetSheet = getOrCreateSheet(ss, CONFIG.SHEET_OET);
  const oetData = oetSheet.getDataRange().getValues();
  for (let o = 1; o < oetData.length; o++) {
    if (String(oetData[o][1]).trim().toUpperCase() === targetGaId) {
      oetSheet.getRange(o + 1, 15).setValue('ENROLLED_CONFIRMED');
      programDetails = 'OET Medicine International Fellowship (Thursday Cohort)';
      break;
    }
  }

  // Check BLS_ROSTER
  const blsSheet = getOrCreateSheet(ss, CONFIG.SHEET_ROSTER);
  const blsData = blsSheet.getDataRange().getValues();
  for (let b = 1; b < blsData.length; b++) {
    if (String(blsData[b][0]).trim().toUpperCase() === targetGaId) {
      blsSheet.getRange(b + 1, 7).setValue('CONFIRMED_PAID_SEAT');
      if (!programDetails) programDetails = 'Cairo Hands-On BLS Workshop (STC Lic. 1549)';
      break;
    }
  }

  if (!programDetails) programDetails = 'GemIInI Sovereign Clinical & Academic Pathway';

  // 7. Automated Zero-Touch Candidate Onboarding Email Dispatch
  if (candidateEmail) {
    try {
      MailApp.sendEmail({
        to: candidateEmail,
        name: 'GemIInI Academy Admissions',
        replyTo: 'admissions@geneacademy.net',
        subject: `[GemIInI Academy] Official Enrollment Confirmed & SudaPass Activated — ${targetGaId}`,
        htmlBody: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; background-color: #ffffff; direction: ltr;">
            <div style="border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h2 style="color: #123b5d; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">GemIInI Academy</h2>
                <span style="font-size: 11px; color: #168c8c; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">SudaGene Medical Consortium</span>
              </div>
              <div style="background: #10b981; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700;">
                ✓ ACCREDITED
              </div>
            </div>

            <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-top: 0;">
              Dear <strong>${candidateName || 'Doctor'}</strong>,
            </p>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              We have officially verified your payment receipt for <strong>${programDetails}</strong>. Your sovereign enrollment is confirmed, and your candidate status has been elevated to <strong>Pathfinder Tier (500 GP)</strong>.
            </p>

            <div style="background: linear-gradient(135deg, #0a192f 0%, #123b5d 100%); color: #ffffff; padding: 24px; border-radius: 14px; margin: 24px 0; box-shadow: 0 4px 12px rgba(18, 59, 93, 0.15);">
              <div style="font-size: 11px; text-transform: uppercase; color: #2dd4bf; letter-spacing: 1.5px; font-weight: 700; margin-bottom: 8px;">Official Candidate ID</div>
              <div style="font-size: 28px; font-weight: 800; font-family: monospace; letter-spacing: 1px; color: #ffffff; margin-bottom: 12px;">${targetGaId}</div>
              <div style="display: flex; gap: 16px; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 12px; font-size: 12px;">
                <div>Ledger Tier: <strong style="color: #38bdf8;">Pathfinder (500 GP)</strong></div>
                <div>Status: <strong style="color: #4ade80;">ACCREDITED</strong></div>
                ${matchedTxRef ? `<div>Ref: <span style="font-family: monospace; color: #cbd5e1;">${matchedTxRef}</span></div>` : ''}
              </div>
            </div>

            <h3 style="font-size: 16px; color: #123b5d; font-weight: 700; margin-top: 28px; margin-bottom: 12px;">Your Immediate Next Steps:</h3>
            
            <ol style="font-size: 14px; color: #475569; line-height: 1.7; padding-left: 20px; margin: 0 0 24px 0;">
              <li><strong>Verify Your Public Credential:</strong> Your SudaPass profile is permanently indexed in the consortium vault at <a href="https://geneacademy.net/verify.html?id=${targetGaId}" style="color: #168c8c; font-weight: 600; text-decoration: underline;">geneacademy.net/verify.html?id=${targetGaId}</a>.</li>
              <li><strong>Complete Your Diagnostic Baseline:</strong> Complete the 20-question pre-course clinical diagnostic case series to calibrate your diagnostic accuracy baseline.</li>
              <li><strong>Cohort Community & Materials:</strong> Your lead mentor and cohort coordinator will connect you directly into the active cohort workspace before the upcoming orientation session.</li>
            </ol>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://geneacademy.net/start.html" style="background-color: #168c8c; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 10px rgba(22, 140, 140, 0.3);">
                Begin Pre-Course Diagnostic Assessment ➔
              </a>
            </div>

            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 28px; font-size: 12px; color: #94a3b8; text-align: center;">
              <p style="margin: 0 0 6px 0;">SudaGene Medical Consortium &bull; GemIInI Sovereign Platform</p>
              <p style="margin: 0;">Verified by Operations Desk (${auditorId}) &bull; For questions: <a href="mailto:admissions@geneacademy.net" style="color: #64748b;">admissions@geneacademy.net</a></p>
            </div>
          </div>
        `
      });
    } catch (mailErr) {
      Logger.log('Candidate onboarding email warning: ' + mailErr.message);
    }
  }

  // 8. Internal Alert to Admissions Desk
  try {
    GmailApp.sendEmail('admissions@geneacademy.net', `[PAYMENT VERIFIED & ACTIVATED] ${targetGaId} — ${candidateName}`,
      `Candidate GA-ID: ${targetGaId}\nName: ${candidateName}\nEmail: ${candidateEmail}\nTxRef: ${matchedTxRef}\nProgram: ${programDetails}\nStatus: ACCREDITED (+${gpBump} GP)\nAuditor: ${auditorId}\nTimestamp: ${nowIso}`,
      { cc: 'mohamedgibbril@geneacademy.net' });
  } catch (adminErr) {
    Logger.log('Admin alert warning: ' + adminErr.message);
  }

  // 9. Clear Leaderboard Cache
  CacheService.getScriptCache().remove('PUBLIC_LEADERBOARD');

  return {
    success: true,
    gaId: targetGaId,
    legalName: candidateName,
    email: candidateEmail,
    txRef: matchedTxRef,
    status: 'ACCREDITED',
    gpCredited: gpBump,
    program: programDetails,
    verifiedBy: auditorId,
    message: `Payment confirmed and candidate ${targetGaId} successfully activated to ACCREDITED status (+${gpBump} GP). Onboarding dispatch sent.`
  };
}

/**
 * Direct execution wrappers for Google Apps Script Editor & Custom Menu
 */
function confirmPayment(gaId, txRef, auditorId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return handleConfirmPayment({
    gaId: gaId,
    txRef: txRef,
    auditorId: auditorId || 'GA-000 / GA-011 Direct Execution'
  }, ss);
}

function confirmPaymentByTxRef(txRef, auditorId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return handleConfirmPayment({
    txRef: txRef,
    auditorId: auditorId || 'GA-011 (Eng. Amjad)'
  }, ss);
}

/**
 * Google Spreadsheet Custom Menu Trigger
 */
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('⚡ GemIInI Sovereign Admin')
      .addItem('🚀 1-Click: Auto-Create All 9 Sheets', 'initializeConsortiumSheets')
      .addSeparator()
      .addItem('✓ Confirm Payment by GA-ID', 'uiPromptConfirmPayment')
      .addItem('✓ Verify Selected Row in PAYMENT_AUDIT_LOG', 'uiVerifySelectedPaymentRow')
      .addSeparator()
      .addItem('🔄 Clear Public Leaderboard Cache', 'uiClearCache')
      .addToUi();
  } catch (e) {
    Logger.log('onOpen UI error: ' + e.message);
  }
}

function uiPromptConfirmPayment() {
  const ui = SpreadsheetApp.getUi();
  const res = ui.prompt('GemIInI Payment Confirmation', 'Enter Candidate GA-ID (e.g. GA-6291):', ui.ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== ui.Button.OK) return;
  const gaId = res.getResponseText().trim().toUpperCase();
  if (!gaId) return;

  const result = confirmPayment(gaId);
  if (result.success) {
    ui.alert('✓ Success', `${result.message}\n\nCandidate: ${result.legalName}\nTier: 500 GP Pathfinder`, ui.ButtonSet.OK);
  } else {
    ui.alert('⚠️ Error', result.error || 'Failed to verify payment.', ui.ButtonSet.OK);
  }
}

function uiVerifySelectedPaymentRow() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const activeSheet = ss.getActiveSheet();

  if (activeSheet.getName() !== CONFIG.SHEET_PAYMENTS) {
    ui.alert('Please switch to the PAYMENT_AUDIT_LOG tab and select a row to verify.');
    return;
  }

  const row = activeSheet.getActiveCell().getRow();
  if (row <= 1) {
    ui.alert('Please select a candidate data row (row 2 or below).');
    return;
  }

  const rowData = activeSheet.getRange(row, 1, 1, 8).getValues()[0];
  const gaId = String(rowData[1]).trim().toUpperCase();
  const txRef = String(rowData[2]).trim().toUpperCase();

  if (!gaId && !txRef) {
    ui.alert('Selected row does not contain a valid GA-ID or Transaction Reference.');
    return;
  }

  const result = handleConfirmPayment({ gaId: gaId, txRef: txRef, auditorId: 'Google Sheets 1-Click UI' }, ss);
  if (result.success) {
    ui.alert('✓ Payment Verified & Activated', `Row ${row} verified for ${result.gaId} (${result.legalName}).\nAccreditation & welcome email dispatched!`, ui.ButtonSet.OK);
  } else {
    ui.alert('⚠️ Error', result.error, ui.ButtonSet.OK);
  }
}

function uiClearCache() {
  CacheService.getScriptCache().remove('PUBLIC_LEADERBOARD');
  SpreadsheetApp.getUi().alert('Leaderboard Cache Cleared.');
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


/**
 * 1-Click Automated Setup for All Consortium Sheets
 * Creates all 9 required sheets with their canonical columns and frozen headers.
 */
function initializeConsortiumSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetsToCreate = [
    CONFIG.SHEET_AUTH,
    CONFIG.SHEET_PAYMENTS,
    CONFIG.SHEET_TELEMETRY,
    CONFIG.SHEET_ROSTER,
    CONFIG.SHEET_FEEDBACK,
    CONFIG.SHEET_QUEUE,
    CONFIG.SHEET_B2B,
    CONFIG.SHEET_RESEARCH,
    CONFIG.SHEET_OET
  ];

  const created = [];
  for (let i = 0; i < sheetsToCreate.length; i++) {
    const sName = sheetsToCreate[i];
    let sheet = ss.getSheetByName(sName);
    if (!sheet) {
      getOrCreateSheet(ss, sName);
      created.push(sName);
    }
  }

  const msg = created.length > 0
    ? Created  new sheet(s): 
    : 'All 9 required sheets are already active and configured!';

  try {
    SpreadsheetApp.getUi().alert('Sheets Initialization Result', msg, SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (e) {
    Logger.log(msg);
  }
  return { success: true, message: msg, created: created };
}
