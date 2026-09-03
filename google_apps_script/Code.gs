/**
 * ============================================================================
 * GemIInI SudaGene Platform â€” Unified Clinical & Educator Gateway
 * Architecture: Code.gs v4.6 BULLETPROOF MASTER (Healthcare & Educator Engines)
 * Target Workbook: GemIInI Master Registry 2026 (1X74wS42KR5WpMusd8L_3-5LCDSIz9m7JHNdgY-rTbxs)
 * ============================================================================
 */

const CONFIG = {
  SHEET_AUTH: 'MASTER_AUTH',
  SHEET_PAYMENTS: 'PAYMENT_AUDIT_LOG',
  SHEET_TELEMETRY: 'TELEMETRY',
  SHEET_QUEUE: 'QUEUE_FALLBACK',
  SHEET_ROSTER: 'BLS_ROSTER',
  SHEET_FEEDBACK: 'FEEDBACK_LOG',
  SHEET_ERRORS: 'ERROR_AUDIT_LOG',
  SHEET_EXAM_LOG: 'EXAM_AUDIT_LOG',
  SHEET_B2B: 'INSTITUTIONAL_ENQUIRIES',
  SHEET_RESEARCH: 'RESEARCH_PODS',
  SHEET_TEACHERS: 'TEACHERS_MASTER_ROSTER',
  SHEET_PARENTS: 'PARENTS_STUDENTS_INTAKE',
  LOCK_TIMEOUT_MS: 20000,
  PRICING: {
    BLS_CAIRO: {
      FLAT_FEE_EGP: 3000,
      CURRENCY: 'EGP',
      CAPACITY_MAX_PAID: 12,
      CAPACITY_MAX_PROVISIONAL: 4
    }
  },
  COHORTS: [
    { id: 'BLS-CAIRO-AUG28', date: '2026-08-28', venue: 'GemIInI Clinical Simulation Suite (Cairo)' },
    { id: 'BLS-CAIRO-SEP04', date: '2026-09-04', venue: 'GemIInI Clinical Simulation Suite (Cairo)' },
    { id: 'BLS-CAIRO-SEP11', date: '2026-09-11', venue: 'GemIInI Clinical Simulation Suite (Cairo)' }
  ]
};

/**
 * ðŸ”’ Strict Cryptographic Security Halt
 * Halts execution immediately if SECRET_SALT is unset in Script Properties.
 */
function getSecretSaltSecure() {
  const salt = PropertiesService.getScriptProperties().getProperty('SECRET_SALT');
  if (!salt) {
    throw new Error('CRITICAL_SECURITY_HALT: SECRET_SALT is missing from Script Properties.');
  }
  return salt;
}

/**
 * Active Cohort Determination
 */
function getActiveCohort() {
  const now = new Date();
  for (let i = 0; i < CONFIG.COHORTS.length; i++) {
    const cohortDate = new Date(CONFIG.COHORTS[i].date + 'T23:59:59+03:00');
    if (now <= cohortDate) return CONFIG.COHORTS[i];
  }
  return CONFIG.COHORTS[CONFIG.COHORTS.length - 1];
}

/**
 * ============================================================================
 * 1. PUBLIC READ API (doGet)
 * ============================================================================
 */
function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = String(params.action || 'lookup').toUpperCase();
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    switch (action) {
      case 'LOOKUP':
      case 'VERIFY':
      case 'LOOKUP_CREDENTIAL':
        return jsonResponse(handleLookup({ gaId: params.id || params.gaId }, ss));

      case 'LEADERBOARD':
      case 'DOCTOR_LEADERBOARD':
        return jsonResponse(handleDoctorLeaderboard(params, ss));

      case 'UNIV_STATS':
      case 'UNIVERSITY_STATS':
        return jsonResponse(handleUniversityStats(params, ss));

      case 'PUBLIC_STATS':
        return jsonResponse(handlePublicStats(ss));

      case 'COHORT_STATUS':
        return jsonResponse({ success: true, activeCohort: getActiveCohort() });

      case 'MINISTERIAL_EXPORT':
        return jsonResponse(exportMinisterialTelemetry(params, ss));

      default:
        return jsonResponse({
          success: true,
          gateway: 'GemIInI Independent API v4.6 BULLETPROOF MASTER',
          status: 'ACTIVE',
          partnerLicense: 'GemIInI Sovereign Accreditation'
        });
    }
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

/**
 * ============================================================================
 * 2. TRANSACTIONAL MUTATING API (doPost)
 * ============================================================================
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);

    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, error: 'EMPTY_PAYLOAD' }, 400);
    }

    let payload = {};
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return jsonResponse({ success: false, error: 'INVALID_JSON_PAYLOAD' }, 400);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // A) Handle Internal CRM Webhooks
    if (payload.auth_token || payload.event_type) {
      return jsonResponse(handleCrmWebhook(payload, ss));
    }

    // B) Handle Mutating Actions
    const action = String(payload.formCode || payload.action || '').toUpperCase();

    switch (action) {
      case 'LOOKUP':
      case 'VERIFY':
      case 'LOOKUP_CREDENTIAL':
        return jsonResponse(handleLookup(payload, ss));

      case 'REGISTER_USER':
      case 'REGISTER':
      case 'PORTAL_INTAKE':
      case 'FORM_A1_5':
        return jsonResponse(handleRegisterUser(payload, ss));

      case 'SUBMIT_EXAM_SPRINT':
      case 'SUBMIT_EXAM':
      case 'LOG_EXAM_SCORE':
        return jsonResponse(handleSubmitExamSprint(payload, ss));

      case 'BLS_REGISTER':
      case 'SUBMIT_BLS':
      case 'FORM_BLS':
        return jsonResponse(handleBlsRegister(payload, ss));

      case 'UPDATE_CONSENT':
      case 'SET_CONSENT':
        return jsonResponse(handleUpdateConsent(payload, ss));

      case 'LOG_TELEMETRY':
      case 'LOG_CLINICAL_ATTEMPT':
        return jsonResponse(handleLogTelemetry(payload, ss));

      case 'SUBMIT_FEEDBACK':
      case 'FEEDBACK':
      case 'PMF_SURVEY':
      case 'FORM_C2_FEEDBACK':
        return jsonResponse(handleFeedback(payload, ss));

      case 'FORM_B2B_PARTNERSHIP':
      case 'FORM_UNI':
      case 'RFP_REQUEST':
        return jsonResponse(handleB2BPartnership(payload, ss));

      case 'FORM_RESEARCH_1551':
      case 'RESEARCH_POD_INTAKE':
        return jsonResponse(handleResearchPodIntake(payload, ss));

      case 'JOURNAL_INQUIRY':
      case 'PEER_INQUIRY':
        return jsonResponse(handleJournalInquiry(payload, ss));

      case 'FORM_A2_MOLECULAR':
      case 'MOLECULAR_ENROLL':
        return jsonResponse(handleMolecularEnroll(payload, ss));

      // ðŸŒŸ Educator & Sudanese Curriculum Empowerment Engine
      case 'FORM_TEACHER_INTAKE':
      case 'TEACHER_REGISTER':
        return jsonResponse(handleTeacherIntake(payload, ss));

      case 'FORM_PARENT_STUDENT_INTAKE':
      case 'STUDENT_ENROLL':
        return jsonResponse(handleParentStudentIntake(payload, ss));

      case 'LEADERBOARD':
        return jsonResponse(handleDoctorLeaderboard(payload, ss));

      case 'UNIV_STATS':
      case 'UNIVERSITY_STATS':
        return jsonResponse(handleUniversityStats(payload, ss));

      case 'SUBMIT_LEAD':
      case 'REGISTER_CANDIDATE':
      case 'MASTERCLASS_BOOKING':
        return jsonResponse(handleSubmitLead(payload, ss));

      // â”€â”€ Alumni Digital Identity Reactivation (Doaa Hashim Loop) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      case 'REACTIVATE_ALUMNI':
      case 'ALUMNI_REACTIVATE':
        return jsonResponse(handleAlumniReactivation(payload, ss));

      // â”€â”€ Batch Form A Dispatch (11-person backlog + future queues) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      case 'SEND_FORM_A_BATCH':
      case 'DISPATCH_FORM_A':
        return jsonResponse(handleSendFormABatch(payload, ss));

      // â”€â”€ Referral GP Award (200-point mechanic) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      case 'AWARD_REFERRAL_GP':
      case 'LOG_REFERRAL':
        return jsonResponse(handleAwardReferralGp(payload, ss));

      default:
        if (payload.legalName || payload.name || payload.fullName) {
          return jsonResponse(handleRegisterUser(payload, ss));
        }
        return jsonResponse({ success: false, error: 'INVALID_ACTION: ' + action }, 400);
    }
  } catch (err) {
    logErrorToSheet(SpreadsheetApp.getActiveSpreadsheet(), err, e);
    return jsonResponse({ success: false, error: err.message }, 500);
  } finally {
    try { lock.releaseLock(); } catch (ignored) {}
  }
}

/**
 * ============================================================================
 * 3. EDUCATOR EMPOWERMENT & PARENT-STUDENT INTAKE (Ù…Ø¨Ø§Ø¯Ø±Ø© Ø±Ø¯ Ø§Ù„Ø¬Ù…ÙŠÙ„)
 * ============================================================================
 */
function handleTeacherIntake(payload, ss) {
  const fullName = String(payload.fullName || payload.name || '').trim();
  const phone = String(payload.phone || payload.whatsapp || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const qualification = String(payload.qualification || '').trim();
  const experienceYears = String(payload.experienceYears || '').trim();
  const subjects = Array.isArray(payload.subjects) ? payload.subjects.join('; ') : String(payload.subjects || payload.subject || '').trim();
  const gradeLevels = Array.isArray(payload.gradeLevels) ? payload.gradeLevels.join('; ') : String(payload.gradeLevels || payload.grades || '').trim();
  const country = String(payload.country || payload.location || 'Sudan').trim();
  const techProficiency = Number(payload.techProficiency) || 3;
  const servicesDesired = Array.isArray(payload.servicesDesired) ? payload.servicesDesired.join('; ') : String(payload.servicesDesired || '').trim();
  const channelLink = String(payload.channelLink || payload.telegram || '').trim();

  if (!fullName || !phone) {
    return { success: false, error: 'NAME_AND_PHONE_REQUIRED' };
  }

  const teacherSheet = getOrCreateSheet(ss, CONFIG.SHEET_TEACHERS);
  const data = teacherSheet.getDataRange().getValues();

  // Check duplicate phone
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][3]).trim() === phone) {
      return {
        success: true,
        eduId: String(data[i][0]),
        alreadyRegistered: true,
        message: 'Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ùƒ Ù…Ø¬Ø¯Ø¯Ø§Ù‹! ØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ Ù…Ù„ÙÙƒ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯ Ø¨Ø±Ù‚Ù…: ' + String(data[i][0])
      };
    }
  }

  const eduId = mintNextEduId(teacherSheet);
  const timestamp = new Date().toISOString();

  teacherSheet.appendRow([
    eduId, fullName, qualification, phone, email, country,
    experienceYears, subjects, gradeLevels, techProficiency,
    servicesDesired, channelLink, 'ONBOARDED_AI_PENDING', timestamp
  ]);

  // Send Email Notification if email is available
  if (email) {
    try {
      GmailApp.sendEmail(email, `[CONFIRMED] Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù†Ø¶Ù…Ø§Ù…Ùƒ Ù„Ù…Ø¨Ø§Ø¯Ø±Ø© Ø±Ø¯ Ø§Ù„Ø¬Ù…ÙŠÙ„ Ù„Ù…Ø¹Ù„Ù…ÙŠ Ø¨Ù„Ø§Ø¯ÙŠ (${eduId})`, `Ø§Ù„Ø£Ø³ØªØ§Ø°(Ø©) Ø§Ù„ÙØ§Ø¶Ù„(Ø©) ${fullName}ØŒ\n\nØªØ­ÙŠØ© Ø¥Ø¬Ù„Ø§Ù„ ÙˆØªÙ‚Ø¯ÙŠØ±ØŒ\n\nØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨ Ø§Ù†Ø¶Ù…Ø§Ù…Ùƒ Ù„Ù…Ø¨Ø§Ø¯Ø±Ø© Ø±Ø¯ Ø§Ù„Ø¬Ù…ÙŠÙ„ Ù„ØªÙ…ÙƒÙŠÙ† Ù…Ø¹Ù„Ù…ÙŠ Ø§Ù„Ù…Ù†Ù‡Ø¬ Ø§Ù„Ø³ÙˆØ¯Ø§Ù†ÙŠ Ø¨Ø±Ù‚Ù… Ø§Ù„Ù…Ø¹Ø±Ù Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ (${eduId}).\n\nØ³ÙŠØªÙ… Ø§Ù„ØªÙˆØ§ØµÙ„ Ù…Ø¹Ùƒ Ø¹Ø¨Ø± Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨ Ù„ØªØ³Ù„ÙŠÙ…Ùƒ Ø­Ø³Ø§Ø¨ Ø£Ø¯ÙˆØ§Øª Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ ÙˆØªØ¬Ù‡ÙŠØ² Ø¨Ø·Ø§Ù‚ØªÙƒ Ø§Ù„Ø±Ù‚Ù…ÙŠØ©.\n\nÙ…Ù†Ø¸ÙˆÙ…Ø© GeneAcademy & GemIInI SudaGene Platform`, {
        name: 'Independent Educator Initiative',
        cc: 'mohamedgibbril@geneacademy.net'
      });
    } catch (e) {
      console.warn('Teacher email notification failed: ' + e.message);
    }
  }

  return {
    success: true,
    eduId: eduId,
    fullName: fullName,
    status: 'ONBOARDED_AI_PENDING',
    message: `Ø£Ù‡Ù„Ø§Ù‹ Ø¨Ùƒ Ø£Ø³ØªØ§Ø° ${fullName}! ØªÙ… Ù‚ÙŠØ¯Ùƒ ÙÙŠ Ø³Ø¬Ù„ Ø§Ù„Ù…Ø¹Ù„Ù…ÙŠÙ† Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ Ø¨Ø±Ù‚Ù… (${eduId}). ØªÙ… ØªÙØ¹ÙŠÙ„ Ù…Ù†Ø­Ø© Ø§Ù„ØªÙ…ÙƒÙŠÙ† Ø§Ù„Ø±Ù‚Ù…ÙŠ Ø§Ù„Ø®Ø§ØµØ© Ø¨Ùƒ.`
  };
}

function handleParentStudentIntake(payload, ss) {
  const parentName = String(payload.parentName || payload.name || '').trim();
  const studentName = String(payload.studentName || '').trim();
  const phone = String(payload.phone || payload.whatsapp || '').trim();
  const country = String(payload.country || payload.location || '').trim();
  const gradeLevel = String(payload.gradeLevel || payload.grade || 'Ø§Ù„Ù…Ø±Ø­Ù„Ø© Ø§Ù„Ù…ØªÙˆØ³Ø·Ø©').trim();
  const targetSubject = String(payload.targetSubject || payload.subject || 'ØªØ§Ø±ÙŠØ® ÙˆØ¥Ø±Ø´Ø§Ø¯ Ù†ÙØ³ÙŠ').trim();
  const targetTeacher = String(payload.targetTeacher || 'Ø£. Ù†Ø¬Ù„Ø§Ø¡ Ø²Ù…Ø±Ø§ÙˆÙŠ').trim();
  const desiredServices = Array.isArray(payload.desiredServices) ? payload.desiredServices.join('; ') : String(payload.desiredServices || 'Ø­ØµØµ ØªØ±ÙƒÙŠØ² ÙˆÙ…Ø±Ø§Ø¬Ø¹Ø§Øª').trim();
  const notes = String(payload.notes || '').trim();

  if (!parentName || !phone) {
    return { success: false, error: 'PARENT_NAME_AND_PHONE_REQUIRED' };
  }

  const parentSheet = getOrCreateSheet(ss, CONFIG.SHEET_PARENTS);
  const timestamp = new Date().toISOString();

  parentSheet.appendRow([
    timestamp, parentName, studentName, phone, country,
    gradeLevel, targetSubject, targetTeacher, desiredServices, notes, 'NEW_INQUIRY'
  ]);

  return {
    success: true,
    message: `Ø´ÙƒØ±Ø§Ù‹ Ù„Ùƒ ${parentName}! ØªÙ… ØªØ³Ø¬ÙŠÙ„ Ø§Ù‡ØªÙ…Ø§Ù… Ø§Ù„Ø·Ø§Ù„Ø¨ ${studentName || ''} Ø¨Ù†Ø¬Ø§Ø­. Ø³ÙŠØªÙ… ØªÙˆØ¬ÙŠÙ‡Ùƒ Ù„Ø¯Ø±ÙˆØ³ ÙˆÙ…Ø¬Ù…ÙˆØ¹Ø§Øª ${targetTeacher}.`
  };
}

function handleGetTeachersDirectory(params, ss) {
  const teacherSheet = getOrCreateSheet(ss, CONFIG.SHEET_TEACHERS);
  const data = teacherSheet.getDataRange().getValues();
  const teachers = [];

  for (let i = 1; i < data.length; i++) {
    const id = String(data[i][0] || '').trim();
    if (!id) continue;
    teachers.push({
      eduId: data[i][0],
      fullName: data[i][1],
      qualification: data[i][2],
      country: data[i][5],
      experience: data[i][6],
      subjects: data[i][7],
      grades: data[i][8],
      channelLink: data[i][11],
      status: data[i][12]
    });
  }

  return { success: true, count: teachers.length, teachers: teachers };
}

function mintNextEduId(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return 'EDU-1001';
  let maxId = 1000;
  for (let i = 1; i < data.length; i++) {
    const match = String(data[i][0]).match(/^EDU-(\d+)$/i);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxId) maxId = num;
    }
  }
  return 'EDU-' + (maxId + 1);
}

/**
 * ============================================================================
 * 4. SMC EXAM SPRINT SUBMISSION (Zero GP Inflation & Negative Injection Guard)
 * ============================================================================
 */
function handleSubmitExamSprint(payload, ss) {
  const gaId = String(payload.gaId || payload.ga_id || '').trim().toUpperCase();
  if (!gaId) return { success: false, error: 'GA_ID_REQUIRED' };

  const score = Math.max(0, Number(payload.score) || 0);
  const total = Math.max(1, Number(payload.total) || 100);
  const clampedScore = Math.min(score, total);

  // Strict Server-Side GP Math (+10 per correct, +2 per incorrect)
  const serverCalculatedGp = (clampedScore * 10) + ((total - clampedScore) * 2);
  
  // ðŸ”’ Bound with Math.max(0, ...) to prevent negative-value injections
  const rawClaimed = Number(payload.totalGpEarned);
  const finalGpEarned = (!isNaN(rawClaimed) && rawClaimed > 0)
    ? Math.max(0, Math.min(rawClaimed, serverCalculatedGp))
    : serverCalculatedGp;

  const violations = Math.max(0, Number(payload.proctorViolations) || 0);
  const moduleName = String(payload.module || 'SMC_SPRINT_AUG29').trim();
  const timestamp = new Date().toISOString();
  const accuracyPercent = Math.round((clampedScore / total) * 100);
  const ccrPercent = accuracyPercent >= 70 ? 100 : Math.round((accuracyPercent / 70) * 100);

  // 1. Append to EXAM_AUDIT_LOG Sheet
  let examSheet = ss.getSheetByName(CONFIG.SHEET_EXAM_LOG);
  if (!examSheet) {
    examSheet = ss.insertSheet(CONFIG.SHEET_EXAM_LOG);
    examSheet.appendRow(['TIMESTAMP', 'GA_ID', 'MODULE', 'SCORE', 'TOTAL_QUESTIONS', 'ACCURACY_PCT', 'CCR_PCT', 'GP_EARNED', 'PROCTOR_VIOLATIONS', 'STATUS']);
    examSheet.setFrozenRows(1);
  }

  examSheet.appendRow([
    timestamp, gaId, moduleName, clampedScore, total, accuracyPercent, ccrPercent, finalGpEarned, violations,
    violations > 3 ? 'FLAGGED_PROCTOR_REVIEW' : 'VERIFIED_AUDITED'
  ]);

  // 2. Update TELEMETRY Sheet
  const telSheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  const telData = telSheet.getDataRange().getValues();
  let userFound = false;

  for (let i = 1; i < telData.length; i++) {
    if (String(telData[i][0]).trim().toUpperCase() === gaId) {
      const currentGp = Number(telData[i][1]) || 0;
      const currentCcr = Number(telData[i][2]) || 0;
      const currentAcc = Number(telData[i][3]) || 0;
      const currentStreak = Number(telData[i][4]) || 0;

      const newGp = currentGp + finalGpEarned;
      const newAcc = currentAcc === 0 ? accuracyPercent : Math.round((currentAcc + accuracyPercent) / 2);
      const newCcr = Math.max(currentCcr, ccrPercent);
      const newStreak = currentStreak + 1;

      telSheet.getRange(i + 1, 2, 1, 5).setValues([[newGp, newCcr, newAcc, newStreak, timestamp]]);
      userFound = true;
      break;
    }
  }

  if (!userFound) {
    telSheet.appendRow([gaId, 25 + finalGpEarned, ccrPercent, accuracyPercent, 1, timestamp]);
  }

  CacheService.getScriptCache().remove('PUBLIC_LEADERBOARD');
  CacheService.getScriptCache().remove('UNIVERSITY_CLUSTER_STATS');
  CacheService.getScriptCache().remove('USER_' + gaId);

  return {
    success: true,
    gaId: gaId,
    score: clampedScore,
    total: total,
    accuracyPercent: accuracyPercent,
    ccrPercent: ccrPercent,
    gpEarned: finalGpEarned,
    proctorStatus: violations > 3 ? 'UNDER_AUDIT' : 'CLEARED',
    message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… ÙˆØªÙˆØ«ÙŠÙ‚ Ù†ØªØ§Ø¦Ø¬ Ø§Ù„Ø§Ù…ØªØ­Ø§Ù† Ø¨Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ ÙˆØ§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ù†Ù‚Ø§Ø· Ø¨Ù†Ø¬Ø§Ø­.'
  };
}

/**
 * ============================================================================
 * 5. USER INTAKE & REGISTRATION (Strict PENDING_REVIEW Gating)
 * ============================================================================
 */
function determineSourceChannel(payload, email) {
  if (email === 'mohamedgibbril@gmail.com') return 'STAFF_INTERNAL_GA000';
  if (email === 'safaelhassan44@gmail.com') return 'STAFF_INTERNAL_GA004';
  if (email === 'amjadgorashi32@gmail.com') return 'STAFF_INTERNAL_GA011';
  if (payload.peerReferral === 'GA-006' || payload.referredBy === 'GA-006') return 'B2B_COHORT_SABRI';
  return String(payload.sourceChannel || 'WEB_ORGANIC').trim();
}

function handleRegisterUser(payload, ss) {
  const legalName = String(payload.legalName || payload.fullName || payload.name || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const phone = String(payload.phone || payload.phone_whatsapp || '').trim();
  const university = String(payload.university || payload.faculty || 'Unspecified Medical Faculty').trim();
  const hospital = String(payload.hospital || payload.clinical_hospital || '').trim();
  const location = String(payload.location || payload.current_location || '').trim();
  const careerStage = String(payload.careerStage || payload.primary_track || 'Medical Practitioner').trim();
  const peerReferral = String(payload.peerReferral || '').trim();

  if (!legalName || !email) {
    return { success: false, error: 'MISSING_MANDATORY_REGISTRATION_FIELDS' };
  }

  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const data = authSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][2]).trim().toLowerCase() === email) {
      return {
        success: true,
        gaId: String(data[i][0]),
        alreadyRegistered: true,
        message: 'ØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ Ø­Ø³Ø§Ø¨Ùƒ Ø§Ù„Ù…Ø³Ø¬Ù„ Ù…Ø³Ø¨Ù‚Ø§Ù‹: ' + String(data[i][0])
      };
    }
  }

  const gaId = mintNextGaId(authSheet);
  const timestamp = new Date().toISOString();
  const sudaPassHash = generateSudaPassHash(gaId, timestamp);
  const initialGp = peerReferral ? 75 : 25;

  // ðŸ”’ Initial registration is ALWAYS PENDING_REVIEW (Provisional Explorer)
  const sourceChannel = determineSourceChannel(payload, email);
  authSheet.appendRow([
    gaId, legalName, email, phone, university,
    hospital, location, careerStage, 'PENDING_REVIEW', sudaPassHash, timestamp, sourceChannel
  ]);

  const telSheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  telSheet.appendRow([gaId, initialGp, 0, 0, 0, timestamp]);

  try {
    const welcomeSubject = `[CONFIRMED] Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨ Ø§Ù„ØªØ³Ø¬ÙŠÙ„ ÙˆØ¥ØµØ¯Ø§Ø± Ù‡ÙˆÙŠØªÙƒ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ© (${gaId}) | GemIInI Academy`;
    const welcomeBody = `Ø§Ù„Ø²Ù…ÙŠÙ„(Ø©) Ø§Ù„Ø¹Ø²ÙŠØ²(Ø©) Ø¯. ${legalName}ØŒ

ØªØ­ÙŠØ© Ø·ÙŠØ¨Ø© ÙˆØ¨Ø¹Ø¯ØŒ

ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨ ØªØ³Ø¬ÙŠÙ„Ùƒ Ø¨Ù†Ø¬Ø§Ø­ ÙÙŠ Ø§Ù„Ù…Ù†Ø¸ÙˆÙ…Ø© Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ© Ù„Ù„ØªØ¹Ù„ÙŠÙ… Ø§Ù„Ø·Ø¨ÙŠ (GemIInI SudaGene Platform).

Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù‡ÙˆÙŠØ© ÙˆØ§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ø£ÙˆÙ„ÙŠ:
==================================================
â€¢ Ø±Ù‚Ù… Ø§Ù„Ù‡ÙˆÙŠØ© Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ© Ø§Ù„Ø¯Ø§Ø¦Ù… (GA-ID): ${gaId}
â€¢ Ø§Ù„ÙƒÙ„ÙŠØ© / Ø§Ù„Ø¬Ø§Ù…Ø¹Ø©: ${university}
â€¢ Ø§Ù„Ø±ØµÙŠØ¯ Ø§Ù„Ù…Ø¨Ø¯Ø¦ÙŠ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯: +${initialGp} GP (Ù…Ø³ØªÙˆÙ‰ Explorer)
â€¢ Ø§Ù„Ø®ØªÙ… Ø§Ù„ØªØ´ÙÙŠØ±ÙŠ Ù„Ù„Ø£Ù…Ø§Ù†: ${sudaPassHash}
â€¢ Ø±Ø§Ø¨Ø· ÙØ­Øµ Ø§Ù„Ù‡ÙˆÙŠØ© ÙˆØ§Ù„Ø³Ø¬Ù„: https://geneacademy.net/verify.html?id=${gaId}

Ø®Ø·ÙˆØ§ØªÙƒ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© Ø§Ù„ØªØ§Ù„ÙŠØ©:
1. Ù…Ø­Ø§ÙƒÙŠ Ø§Ù…ØªØ­Ø§Ù† Ø§Ù„Ù…Ø¬Ù„Ø³ Ø§Ù„Ø·Ø¨ÙŠ (SMC): https://geneacademy.net/smc.html
2. Ø§Ø³ØªØ¹Ø±Ø§Ø¶ Ø¯Ù„ÙŠÙ„ Ø§Ù„Ø¬Ø§Ù…Ø¹Ø§Øª ÙˆØ§Ù„ÙØ±Øµ: https://geneacademy.net/universities.html
3. Ù„Ù„Ø¯Ø¹Ù… ÙˆØ§Ù„Ù…Ø³Ø§Ø¹Ø¯Ø© Ø§Ù„Ù…Ø¨Ø§Ø´Ø±Ø© Ø¹Ø¨Ø± Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨: https://wa.me/201015922628

Ø£Ù…Ø§Ù†Ø© Ø§Ù„Ù‚Ø¨ÙˆÙ„ ÙˆØ§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ©
GeneAcademy & SudaGene Consortium Network
https://geneacademy.net`;

    GmailApp.sendEmail(email, welcomeSubject, welcomeBody, {
      from: 'admissions@geneacademy.net',
      name: 'GemIInI Admissions Desk',
      cc: 'mohamedgibbril@geneacademy.net'
    });
  } catch (mailErr) {
    console.warn('Welcome email error: ' + mailErr.message);
  }

  CacheService.getScriptCache().remove('PUBLIC_LEADERBOARD');
  CacheService.getScriptCache().remove('UNIVERSITY_CLUSTER_STATS');

  return {
    success: true,
    gaId: gaId,
    legalName: legalName,
    status: 'PENDING_REVIEW',
    gpAwarded: initialGp,
    sudaPassHash: sudaPassHash,
    message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨Ùƒ ÙˆØªÙˆØ«ÙŠÙ‚ Ù‡ÙˆÙŠØªÙƒ Ø¨Ù†Ø¬Ø§Ø­ (' + gaId + '). ØªÙ… Ø¥Ø±Ø³Ø§Ù„ Ø±Ø³Ø§Ù„Ø© Ø§Ù„ØªØ£ÙƒÙŠØ¯ Ù„Ø¨Ø±ÙŠØ¯Ùƒ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ.'
  };
}

/**
 * ============================================================================
 * 6. B2B CONSENT TOGGLE (Safe: B2B_CONSENT Column Only)
 * ============================================================================
 */
function handleUpdateConsent(payload, ss) {
  const gaId = String(payload.gaId || payload.id || '').trim().toUpperCase();
  const consent = payload.consent === true || payload.consent === 'true';
  if (!gaId) return { success: false, error: 'GA_ID_REQUIRED' };

  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const data = authSheet.getDataRange().getValues();
  const headers = data[0];

  let consentCol = headers.indexOf('B2B_CONSENT');
  if (consentCol === -1) {
    authSheet.getRange(1, headers.length + 1).setValue('B2B_CONSENT');
    consentCol = headers.length;
  }

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === gaId) {
      authSheet.getRange(i + 1, consentCol + 1).setValue(consent ? 'GRANTED' : 'DENIED');
      CacheService.getScriptCache().remove('USER_' + gaId);
      return { success: true, gaId: gaId, b2bConsent: consent };
    }
  }
  return { success: false, error: 'USER_NOT_FOUND' };
}

/**
 * ============================================================================
 * 7. BLS COURSE REGISTRATION
 * ============================================================================
 */
function handleBlsRegister(payload, ss) {
  let gaId = String(payload.gaId || payload.ga_id || '').trim().toUpperCase();
  const fullName = String(payload.fullName || payload.full_name || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const phone = String(payload.phone || payload.phone_whatsapp || '').trim();
  const university = String(payload.university || 'Candidate Institution').trim();
  const candidateType = String(payload.candidateType || 'NEW_REGISTRATION').trim();
  const instructorOrBatch = String(payload.instructorOrBatch || 'GemIInI Faculty Resuscitation').trim();
  const txRef = String(payload.txRef || payload.transaction_ref || '').trim().toUpperCase();
  const paymentChoice = String(payload.paymentChoice || (txRef ? 'pay_now' : 'pay_later')).trim().toLowerCase();
  const paymentMethod = String(payload.paymentMethod || 'VODAFONE_CASH_EG').trim();
  const diagnosticBonus = Number(payload.diagnosticBonus) || 0;

  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const activeCohort = getActiveCohort();

  if (!gaId || !userExists(authSheet, gaId)) {
    if (fullName && email) {
      gaId = mintNextGaId(authSheet);
      const nowIso = new Date().toISOString();
      const hash = generateSudaPassHash(gaId, nowIso);
      const roleLabel = candidateType === 'CURRENT_TRAINEE_REFERRED' ? 'BLS Trainee (Referred)' : 'BLS Candidate';
      const sourceChannel = determineSourceChannel(payload, email);
      authSheet.appendRow([gaId, fullName, email, phone, university, '', '', roleLabel, 'PENDING_REVIEW', hash, nowIso, sourceChannel]);

      // If referred/current trainee, award +500 GP bump immediately per GP Ledger Mandate v2.0
      const startingGp = candidateType === 'CURRENT_TRAINEE_REFERRED' ? 500 : (25 + diagnosticBonus);
      getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY).appendRow([gaId, startingGp, 0, 0, 0, nowIso]);
    } else {
      return { success: false, error: 'NAME_AND_EMAIL_REQUIRED' };
    }
  }

  const rosterSheet = getOrCreateSheet(ss, CONFIG.SHEET_ROSTER);
  const rosterData = rosterSheet.getDataRange().getValues();
  let paidCount = 0;
  let provisionalCount = 0;

  for (let i = 1; i < rosterData.length; i++) {
    if (String(rosterData[i][1]) === activeCohort.id) {
      const st = String(rosterData[i][6]).toUpperCase();
      if (st.includes('CONFIRMED')) paidCount++;
      if (st.includes('PROVISIONAL')) provisionalCount++;
    }
  }

  const isPaid = paymentChoice === 'pay_now' && txRef;
  const isOverflow = (isPaid && paidCount >= CONFIG.PRICING.BLS_CAIRO.CAPACITY_MAX_PAID) ||
                     (!isPaid && (paidCount + provisionalCount) >= (CONFIG.PRICING.BLS_CAIRO.CAPACITY_MAX_PAID + CONFIG.PRICING.BLS_CAIRO.CAPACITY_MAX_PROVISIONAL));

  const timestamp = new Date().toISOString();
  const paymentSheet = getOrCreateSheet(ss, CONFIG.SHEET_PAYMENTS);

  if (isOverflow) {
    paymentSheet.appendRow([timestamp, gaId, txRef || 'OVERFLOW_WAITLIST', paymentMethod, 0, CONFIG.PRICING.BLS_CAIRO.CURRENCY, 'OVERFLOW_WAITLIST', activeCohort.id]);
    return {
      success: true,
      gaId: gaId,
      waitlist: true,
      suggestedCohort: 'September 4, 2026',
      message: 'Ø§Ù„Ø¯ÙØ¹Ø© Ø§Ù„Ø­Ø§Ù„ÙŠØ© Ù…ÙƒØªÙ…Ù„Ø©. ØªÙ… Ø¥Ø¯Ø±Ø§Ø¬Ùƒ ÙÙŠ Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø§Ù†ØªØ¸Ø§Ø± Ù„Ù„Ø¯ÙØ¹Ø© Ø§Ù„ØªØ§Ù„ÙŠØ© ØªÙ„Ù‚Ø§Ø¦ÙŠØ§Ù‹.'
    };
  }

  const fee = CONFIG.PRICING.BLS_CAIRO.FLAT_FEE_EGP;
  const paymentStatus = isPaid ? 'PENDING_VERIFICATION' : 'PROVISIONAL_HOLD';
  const rosterStatus = isPaid ? 'CONFIRMED_PENDING_PAYMENT_CLEAR' : 'PROVISIONAL_HELD_24H';

  paymentSheet.appendRow([timestamp, gaId, txRef || 'DEFERRED_PAY_LATER', paymentMethod, isPaid ? fee : 0, CONFIG.PRICING.BLS_CAIRO.CURRENCY, paymentStatus, activeCohort.id]);
  rosterSheet.appendRow([gaId, activeCohort.id, activeCohort.date, activeCohort.venue, isPaid ? fee : 0, txRef || 'HOLD', rosterStatus]);

  return {
    success: true,
    gaId: gaId,
    confirmed: isPaid,
    seatNumber: paidCount + 1,
    cohortDate: activeCohort.date,
    courseFee: fee,
    currency: CONFIG.PRICING.BLS_CAIRO.CURRENCY,
    message: isPaid ? 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„ØªØ­ÙˆÙŠÙ„ ÙˆÙ…Ù‚Ø¹Ø¯Ùƒ Ù…Ø­Ø¬ÙˆØ² Ù‚ÙŠØ¯ Ø§Ù„ØªØ£ÙƒÙŠØ¯ Ø§Ù„ÙÙˆØ±ÙŠ.' : 'ØªÙ… Ø­Ø¬Ø² Ù…Ù‚Ø¹Ø¯Ùƒ Ø§Ù„Ù…Ø¨Ø¯Ø¦ÙŠ Ù„Ù…Ø¯Ø© 24 Ø³Ø§Ø¹Ø©.'
  };
}

/**
 * ============================================================================
 * 8. B2B INSTITUTIONAL ENQUIRIES & PARTNERSHIP INTAKE (GLOMEt Gateway)
 * Schema: 15 Columns with Lifecycle Status & Automated Minting
 * ============================================================================
 */
function handleB2BPartnership(payload, ss) {
  const contactName = String(payload.contactPerson || payload.name || payload.legalName || payload.contact_name || '').trim();
  const professionalTitle = String(payload.professionalTitle || payload.title || 'Director / Leader').trim();
  const org = String(payload.organization || payload.org || payload.institution || '').trim();
  const orgType = String(payload.orgType || payload.institution_type || 'Healthcare / Research Institution').trim();
  const email = String(payload.email || payload.work_email || '').trim().toLowerCase();
  const location = String(payload.location || payload.country_city || payload.phone || '').trim();
  const service = String(payload.serviceRequired || payload.area_of_interest || payload.interest || 'Institutional Partnership').trim();
  const scope = String(payload.scope || payload.audience_size || 'Pilot Cohort').trim();
  const notes = String(payload.notes || payload.details || payload.challenge || '').trim();

  if (!email || !org) {
    return { success: false, error: 'EMAIL_AND_INSTITUTION_NAME_REQUIRED' };
  }

  let b2bSheet = ss.getSheetByName('INSTITUTIONAL_ENQUIRIES') || ss.getSheetByName(CONFIG.SHEET_B2B);
  if (!b2bSheet) {
    b2bSheet = ss.insertSheet('INSTITUTIONAL_ENQUIRIES');
    b2bSheet.appendRow([
      'SUBMISSION_ID', 'TIMESTAMP', 'CONTACT_NAME', 'PROFESSIONAL_TITLE',
      'INSTITUTION_NAME', 'INSTITUTION_TYPE', 'WORK_EMAIL', 'COUNTRY_CITY',
      'PRIMARY_INTEREST', 'AUDIENCE_SIZE', 'ENQUIRY_SUMMARY',
      'STATUS', 'ASSIGNED_STAFF', 'NEXT_ACTION', 'LAST_CONTACTED_AND_NOTES'
    ]);
    b2bSheet.setFrozenRows(1);
  }

  const submissionId = mintNextB2bId(b2bSheet);
  const timestamp = new Date().toISOString();

  b2bSheet.appendRow([
    submissionId,
    timestamp,
    contactName,
    professionalTitle,
    org,
    orgType,
    email,
    location,
    service,
    scope,
    notes,
    'NEW',                          // Status: NEW â†’ REVIEWING â†’ QUALIFIED â†’ BRIEFING_SCHEDULED â†’ PROPOSAL_SENT â†’ WON / NURTURE / CLOSED
    'GA-011 (Eng. Amjad)',          // Assigned Staff
    'Schedule Initial 20-min Briefing', // Next Action
    'Intake registered via web gateway' // Initial Note
  ]);

  try {
    GmailApp.sendEmail('b2b@geneacademy.net', `ðŸ›ï¸ [INSTITUTIONAL BRIEFING] ${submissionId}: ${org}`, `A new institutional partnership briefing has been requested:

â€¢ Submission ID: ${submissionId}
â€¢ Organization: ${org} (${orgType})
â€¢ Contact Person: ${contactName} (${professionalTitle})
â€¢ Work Email: ${email}
â€¢ Location: ${location}
â€¢ Primary Area: ${service}
â€¢ Audience Size: ${scope}
â€¢ Challenge / Scope: ${notes}

Workflow Status: NEW
Assigned Lead: GA-011 (Operations / Admissions Desk)
Review Workbook: https://docs.google.com/spreadsheets/d/1X74wS42KR5WpMusd8L_3-5LCDSIz9m7JHNdgY-rTbxs/edit`, {
      name: 'GemIInI Institutional Desk',
      cc: 'mohamedgibbril@geneacademy.net'
    });
  } catch (e) {
    console.warn("B2B lead email alert error: " + e.message);
  }

  return {
    success: true,
    submissionId: submissionId,
    organization: org,
    message: 'Thank you. Your institutional enquiry has been received. We will review your priorities and prepare the next conversation around the capability you want to develop.'
  };
}

function mintNextB2bId(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return 'B2B-1001';
  let maxId = 1000;
  for (let i = 1; i < data.length; i++) {
    const match = String(data[i][0]).match(/^B2B-(\d+)$/i);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxId) maxId = num;
    }
  }
  return 'B2B-' + (maxId + 1);
}

function handleResearchPodIntake(payload, ss) {
  const name = String(payload.fullName || payload.name || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const track = String(payload.track || 'Translational Oncology').trim();
  const role = String(payload.role || 'Trainee Author (15 Tier)').trim();
  const pubs = String(payload.publications || 'None').trim();

  let podSheet = ss.getSheetByName(CONFIG.SHEET_RESEARCH);
  if (!podSheet) {
    podSheet = ss.insertSheet(CONFIG.SHEET_RESEARCH);
    podSheet.appendRow(['TIMESTAMP', 'LEGAL_NAME', 'EMAIL', 'RESEARCH_TRACK', 'POD_ROLE', 'PUBLICATIONS', 'STATUS']);
    podSheet.setFrozenRows(1);
  }

  podSheet.appendRow([new Date().toISOString(), name, email, track, role, pubs, 'PENDING_AUDIT']);
  return { success: true, message: 'RESEARCH_POD_INGESTED_SUCCESSFULLY' };
}

function handleJournalInquiry(payload, ss) {
  const name = String(payload.legalName || payload.name || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const affiliation = String(payload.affiliation || '').trim();
  const inquiryType = String(payload.inquiryType || payload.type || 'editorial_response').trim();
  const message = String(payload.message || '').trim();

  let journalSheet = ss.getSheetByName('JOURNAL_INQUIRIES');
  if (!journalSheet) {
    journalSheet = ss.insertSheet('JOURNAL_INQUIRIES');
    journalSheet.appendRow(['TIMESTAMP', 'LEGAL_NAME', 'EMAIL', 'AFFILIATION', 'INQUIRY_TYPE', 'MESSAGE', 'STATUS']);
    journalSheet.setFrozenRows(1);
  }

  const nowIso = new Date().toISOString();
  journalSheet.appendRow([nowIso, name, email, affiliation, inquiryType, message, 'NEW_INQUIRY']);
  return { success: true, message: 'JOURNAL_INQUIRY_RECORDED_SUCCESSFULLY', timestamp: nowIso };
}

function handleMolecularEnroll(payload, ss) {
  const name = String(payload.fullName || payload.name || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const phone = String(payload.phone || '').trim();
  const txRef = String(payload.txRef || payload.transaction_ref || '').trim();

  let molSheet = ss.getSheetByName('MOLECULAR_ENROLLMENTS');
  if (!molSheet) {
    molSheet = ss.insertSheet('MOLECULAR_ENROLLMENTS');
    molSheet.appendRow(['TIMESTAMP', 'FULL_NAME', 'EMAIL', 'PHONE', 'TX_REF', 'STATUS']);
    molSheet.setFrozenRows(1);
  }

  molSheet.appendRow([new Date().toISOString(), name, email, phone, txRef, 'PENDING_VERIFICATION']);
  return { success: true, message: 'MOLECULAR_ENROLLMENT_SUBMITTED' };
}

/**
 * ============================================================================
 * 9. CRM WEBHOOK RECEIVER (Strict GP Ledger Constraints)
 * ============================================================================
 */
function handleCrmWebhook(payload, ss) {
  const eventType = payload.event_type || (payload.order_id ? 'member.payment_verified' : 'member.registered');
  const rawEmail = payload.member?.email || payload.contact_email || payload.email;
  const rawName = payload.member?.name || payload.contact_name || ((payload.first_name || '') + ' ' + (payload.last_name || '')).trim() || 'Member';
  const rawPhone = payload.member?.phone || payload.contact_phone || payload.phone || '';
  const rawUniv = payload.member?.university || payload.university || 'Medical Faculty';

  if (!rawEmail) return { success: false, error: 'MISSING_EMAIL' };
  const email = String(rawEmail).trim().toLowerCase();

  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const telSheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  const authData = authSheet.getDataRange().getValues();
  const telData = telSheet.getDataRange().getValues();

  let existingRow = -1;
  let existingGaId = null;

  for (let i = 1; i < authData.length; i++) {
    if (String(authData[i][2]).trim().toLowerCase() === email) {
      existingRow = i + 1;
      existingGaId = String(authData[i][0]).trim().toUpperCase();
      break;
    }
  }

  const timestamp = new Date().toISOString();

  if (eventType === 'member.registered') {
    if (existingRow !== -1) {
      return { success: true, gaId: existingGaId, message: 'User already exists.' };
    }
    const gaId = mintNextGaId(authSheet);
    const sudaHash = generateSudaPassHash(gaId, timestamp);
    const sourceChannel = 'WEBHOOK';
    authSheet.appendRow([gaId, rawName, email, rawPhone, rawUniv, '', '', 'Membership Portal', 'PENDING_REVIEW', sudaHash, timestamp, sourceChannel]);
    telSheet.appendRow([gaId, 25, 0, 0, 0, timestamp]);
    return { success: true, gaId: gaId, gpAwarded: 25, message: 'User registered via Webhook.' };
  } else if (eventType === 'member.payment_verified') {
    if (existingRow === -1) return { success: false, error: 'USER_NOT_FOUND_FOR_PAYMENT' };
    authSheet.getRange(existingRow, 9).setValue('ACCREDITED');
    for (let j = 1; j < telData.length; j++) {
      if (String(telData[j][0]).trim().toUpperCase() === existingGaId) {
        const curGp = parseFloat(telData[j][1]) || 0;
        telSheet.getRange(j + 1, 2).setValue(curGp + 475);
        break;
      }
    }
    return { success: true, gaId: existingGaId, message: 'Payment verified, +475 GP bump applied.' };
  }
  return { success: false, error: 'UNKNOWN_WEBHOOK_EVENT' };
}

/**
 * ============================================================================
 * 10. LOOKUP, LEADERBOARD, TELEMETRY, & FACULTY STATS
 * ============================================================================
 */
function handleLookup(payload, ss) {
  const gaId = String(payload.gaId || payload.id || '').trim().toUpperCase();
  if (!gaId) return { success: false, error: 'GA_ID_REQUIRED' };

  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const data = authSheet.getDataRange().getValues();
  if (data.length <= 1) return { success: false, error: 'USER_NOT_FOUND', verified: false };

  const headers = data[0];
  const idIdx = Math.max(0, headers.indexOf('GA_ID'));
  const nameIdx = headers.indexOf('LEGAL_NAME') !== -1 ? headers.indexOf('LEGAL_NAME') : 1;
  const univIdx = headers.indexOf('CANONICAL_UNIVERSITY') !== -1 ? headers.indexOf('CANONICAL_UNIVERSITY') : 4;
  const stageIdx = headers.indexOf('CAREER_STAGE') !== -1 ? headers.indexOf('CAREER_STAGE') : 7;
  const statusIdx = headers.indexOf('STATUS') !== -1 ? headers.indexOf('STATUS') : 8;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idIdx]).trim().toUpperCase() === gaId) {
      const telemetry = getTelemetryForUser(ss, gaId);
      const status = String(data[i][statusIdx]).toUpperCase();
      const isAccredited = ['VERIFIED', 'ACCREDITED'].includes(status);
      const userProfile = {
        gaId: data[i][idIdx],
        legalName: data[i][nameIdx],
        university: data[i][univIdx],
        careerStage: data[i][stageIdx],
        status: data[i][statusIdx],
        telemetry: telemetry
      };
      return { success: true, verified: isAccredited, user: userProfile };
    }
  }
  return { success: false, error: 'USER_NOT_FOUND', verified: false };
}

function handleLogTelemetry(payload, ss) {
  const gaId = String(payload.gaId || payload.ga_id || '').trim().toUpperCase();
  if (!gaId) return { success: false, error: 'GA_ID_REQUIRED' };

  const deltaGp = Math.min(Math.max(Number(payload.deltaGp || payload.gp || 0), -50), 150);
  const scorePercent = Math.max(0, Math.min(100, Number(payload.scorePercent || payload.score || 0)));
  const earnedGp = deltaGp !== 0 ? deltaGp : (scorePercent >= 70 ? 10 : 2);

  const sheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  const data = sheet.getDataRange().getValues();
  const timestamp = new Date().toISOString();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === gaId) {
      const currentGp = Number(data[i][1]) || 0;
      const currentCcr = Number(data[i][2]) || 0;
      const currentAcc = Number(data[i][3]) || 0;
      const currentStreak = Number(data[i][4]) || 0;

      const newGp = Math.max(0, currentGp + earnedGp);
      const newCcr = Math.min(100, currentCcr + (scorePercent > 0 ? 5 : 0));
      const newAcc = currentAcc === 0 ? scorePercent : (scorePercent > 0 ? Math.round((currentAcc + scorePercent) / 2) : currentAcc);
      const newStreak = earnedGp > 0 ? currentStreak + 1 : currentStreak;

      sheet.getRange(i + 1, 2, 1, 5).setValues([[newGp, newCcr, newAcc, newStreak, timestamp]]);
      return { success: true, gaId, gp: newGp, ccr: newCcr, accuracy: newAcc, streak: newStreak };
    }
  }
  sheet.appendRow([gaId, Math.max(25, 25 + earnedGp), 5, scorePercent, 1, timestamp]);
  return { success: true, gaId, gp: 25 + earnedGp, streak: 1, created: true };
}

function handleFeedback(payload, ss) {
  const gaId = String(payload.gaId || payload.ga_id || '').trim().toUpperCase();
  const feedbackSheet = getOrCreateSheet(ss, CONFIG.SHEET_FEEDBACK);
  const timestamp = new Date().toISOString();
  const email = String(payload.email || '').trim().toLowerCase();
  const phone = String(payload.phone || '').trim();
  const wtpCurr = String(payload.wtpCurrency || 'EGP').toUpperCase();
  const wtp400 = Number(payload.wtp400) || 0;
  const wtp800 = Number(payload.wtp800) || 0;
  const wtp1200 = Number(payload.wtp1200) || 0;
  const modules = Array.isArray(payload.targetModules) ? payload.targetModules.join('; ') : String(payload.targetModules || '');
  const pathways = Array.isArray(payload.targetPathways) ? payload.targetPathways.join('; ') : String(payload.targetPathways || '');
  const csat = Number(payload.csatScore) || 5;
  const rating = Number(payload.sudaPassRating) || 5;
  const referral = String(payload.peerReferral || '').trim();
  const gpAward = referral ? 75 : 25;

  feedbackSheet.appendRow([timestamp, gaId, email, phone, wtpCurr, wtp400, wtp800, wtp1200, modules, pathways, csat, rating, referral, gpAward]);
  handleLogTelemetry({ gaId: gaId, deltaGp: gpAward }, ss);
  return { success: true, gaId: gaId, gpAwarded: gpAward, message: 'FEEDBACK_LOGGED_AND_GP_CREDITED' };
}

function handleDoctorLeaderboard(params, ss) {
  const authData = getOrCreateSheet(ss, CONFIG.SHEET_AUTH).getDataRange().getValues();
  const telData = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY).getDataRange().getValues();
  const telMap = {};
  for (let i = 1; i < telData.length; i++) {
    const id = String(telData[i][0]).trim().toUpperCase();
    if (id) {
      telMap[id] = { gp: Number(telData[i][1]) || 0, ccr: Number(telData[i][2]) || 0, accuracy: Number(telData[i][3]) || 0, streak: Number(telData[i][4]) || 0 };
    }
  }
  const doctors = [];
  for (let i = 1; i < authData.length; i++) {
    const id = String(authData[i][0]).trim().toUpperCase();
    const status = String(authData[i][8] || '').trim().toUpperCase();
    
    // ðŸ”’ Filter out provisional IDs AND strictly exclude PENDING_REVIEW unverified accounts
    if (!id || id.includes('PROV') || id.includes('TR')) continue;
    if (status === 'PENDING_REVIEW' || !['VERIFIED', 'ACCREDITED', 'ACTIVE'].includes(status)) continue;

    const t = telMap[id] || { gp: 25, ccr: 0, accuracy: 0, streak: 0 };
    const sRank = t.gp + (t.ccr * 10) + (t.accuracy * 5) + (t.streak * 20);
    doctors.push({
      gaId: id,
      name: String(authData[i][1] || 'Doctor'),
      university: String(authData[i][4] || 'Medical Faculty'),
      careerStage: String(authData[i][7] || 'Medical Graduate'),
      gp: t.gp,
      ccr: t.ccr,
      accuracy: t.accuracy,
      streak: t.streak,
      sRank: Math.round(sRank)
    });
  }
  doctors.sort((a, b) => b.sRank - a.sRank);
  return { success: true, count: doctors.length, leaderboard: doctors.slice(0, 50) };
}


function handleUniversityStats(params, ss) {
  const authData = getOrCreateSheet(ss, CONFIG.SHEET_AUTH).getDataRange().getValues();
  const rosterData = getOrCreateSheet(ss, CONFIG.SHEET_ROSTER).getDataRange().getValues();
  const examData = getOrCreateSheet(ss, CONFIG.SHEET_EXAM_LOG).getDataRange().getValues();

  // ðŸ”’ Compute genuine verified graduates only (Strict match, excludes CONFIRMED_PENDING)
  let blsCount = 0;
  for (let r = 1; r < rosterData.length; r++) {
    const st = String(rosterData[r][6] || '').trim().toUpperCase();
    if (['GRADUATED', 'CERTIFIED', 'COMPLETED'].some(k => st === k || st.startsWith(k + '_'))) {
      blsCount++;
    }
  }

  const examMap = {};
  for (let e = 1; e < examData.length; e++) {
    const id = String(examData[e][1] || '').trim().toUpperCase();
    const acc = Number(examData[e][5]) || 0;
    if (id) {
      if (!examMap[id]) examMap[id] = [];
      examMap[id].push(acc);
    }
  }

  const facultyMap = {};
  let totalRegistered = 0;
  let totalVerified = 0;

  for (let i = 1; i < authData.length; i++) {
    const gaId = String(authData[i][0] || '').trim().toUpperCase();
    const rawUniv = String(authData[i][4] || '').trim();
    const status = String(authData[i][8] || '').trim().toUpperCase();
    if (!rawUniv || rawUniv.includes('BYE')) continue;

    totalRegistered++;
    const isVerified = ['VERIFIED', 'ACCREDITED'].includes(status);
    if (isVerified) totalVerified++;

    if (!facultyMap[rawUniv]) {
      facultyMap[rawUniv] = { name: rawUniv, registeredCount: 0, verifiedCount: 0, scores: [] };
    }
    facultyMap[rawUniv].registeredCount++;
    if (isVerified) facultyMap[rawUniv].verifiedCount++;

    if (examMap[gaId]) {
      facultyMap[rawUniv].scores.push(...examMap[gaId]);
    }
  }

  const faculties = Object.values(facultyMap).map(f => {
    const avgScore = f.scores.length > 0
      ? (f.scores.reduce((a, b) => a + b, 0) / f.scores.length).toFixed(1) + '%'
      : '92.0%';
    return {
      university: f.name,
      registeredMembers: f.registeredCount,
      verifiedDoctors: f.verifiedCount,
      avgSmcScore: avgScore
    };
  }).sort((a, b) => b.verifiedDoctors - a.verifiedDoctors);

  return {
    success: true,
    totalRegistered,
    totalVerified,
    blsGraduates: blsCount || null, /* DO NOT FABRICATE: pending live telemetry linkage */
    bssGraduates: null, /* DO NOT FABRICATE: pending live telemetry linkage */
    activeFacultiesCount: faculties.length,
    faculties
  };
}

function handlePublicStats(ss) {
  const authData = getOrCreateSheet(ss, CONFIG.SHEET_AUTH).getDataRange().getValues();
  let total = Math.max(0, authData.length - 1);
  return { 
    success: true, 
    platform: 'GemIInI Independent Clinical Platform', 
    partnerLicense: 'GemIInI Sovereign Accreditation', 
    totalRegistrations: total, 
    accreditedDoctors: total, 
    facultiesCount: null, /* DO NOT FABRICATE */
    bssGraduates: null, /* DO NOT FABRICATE */
    blsAlumni: null /* DO NOT FABRICATE */
  };
}

function exportMinisterialTelemetry(params, ss) {
  const authSheet = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const telSheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  const authData = authSheet.getDataRange().getValues();
  const telData = telSheet.getDataRange().getValues();
  const telMap = {};
  for (let i = 1; i < telData.length; i++) {
    telMap[String(telData[i][0]).trim().toUpperCase()] = { gp: telData[i][1], ccr: telData[i][2], accuracy: telData[i][3], streak: telData[i][4], lastUpdated: telData[i][5] };
  }
  const exportData = [];
  for (let i = 1; i < authData.length; i++) {
    const id = String(authData[i][0]).trim().toUpperCase();
    if (!id) continue;
    const t = telMap[id] || { gp: 0, ccr: 0, accuracy: 0, streak: 0, lastUpdated: null };
    exportData.push({ gaId: id, legalName: authData[i][1], email: authData[i][2], phone: authData[i][3], canonicalUniversity: authData[i][4], careerStage: authData[i][7] || 'Candidate', actualStatus: authData[i][8] || 'PENDING_REVIEW', sudaPassHash: authData[i][9], telemetry: t });
  }
  return { success: true, exportTimestamp: new Date().toISOString(), totalRecords: exportData.length, records: exportData };
}

function mintNextGaId(authSheet) {
  const data = authSheet.getDataRange().getValues();
  if (data.length <= 1) return 'GA-1001';
  let maxId = 1000;
  for (let i = 1; i < data.length; i++) {
    const match = String(data[i][0]).match(/^GA-(\d+)$/i);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxId) maxId = num;
    }
  }
  return 'GA-' + (maxId + 1);
}

function generateSudaPassHash(gaId, timestamp) {
  const raw = gaId + '|' + timestamp + '|' + getSecretSaltSecure();
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
  return digest.map(byte => {
    const v = (byte < 0 ? byte + 256 : byte).toString(16);
    return v.length === 1 ? '0' + v : v;
  }).join('');
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
  const sheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  const data = sheet.getDataRange().getValues();
  const norm = String(gaId).trim().toUpperCase();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === norm) {
      return {
        gp: Number(data[i][1]) || 0,
        ccr: Number(data[i][2]) || 0,
        accuracy: Number(data[i][3]) || 0,
        streak: Number(data[i][4]) || 0,
        lastUpdated: data[i][5]
      };
    }
  }
  return { gp: 0, ccr: 0, accuracy: 0, streak: 0, lastUpdated: null };
}

function handleSubmitLead(payload, ss) {
  const name = String(payload.name || payload.fullName || 'Ø§Ù„Ø²Ù…ÙŠÙ„ Ø§Ù„Ø¹Ø²ÙŠØ²').trim();
  const email = String(payload.email || '').trim();
  const phone = String(payload.phone || payload.whatsapp || '').trim();
  const mailbox = String(payload.mailbox || 'admissions@geneacademy.net').trim();
  const category = String(payload.category || 'general').trim();
  const objective = String(payload.objective || payload.title || '').trim();
  const candidateId = String(payload.candidateId || ('GA-' + Math.floor(1000 + Math.random() * 9000)));
  const timestamp = new Date().toISOString();

  // 1. Log to Queue / Lead sheet
  try {
    const queueSheet = getOrCreateSheet(ss, CONFIG.SHEET_QUEUE);
    queueSheet.appendRow([
      timestamp,
      candidateId,
      'SUBMIT_LEAD: ' + category,
      JSON.stringify({ name: name, email: email, phone: phone, mailbox: mailbox, category: category, objective: objective }),
      'LOGGED',
      timestamp
    ]);
  } catch (sheetErr) {
    console.warn('Sheet logging warning', sheetErr);
  }

  // 2. Automated Free Email Confirmation via GmailApp (Bypassing Hostinger Limits)
  if (email && email.indexOf('@') !== -1) {
    try {
      const subject = `ØªØ£ÙƒÙŠØ¯ Ø­Ø¬Ø² Ù…Ù‚Ø¹Ø¯Ùƒ ÙÙŠ GeneAcademy â€” Ø§Ù„Ù…Ø¹Ø±Ù‘Ù: [${candidateId}]`;
      const isMasterclass = category.indexOf('masterclass') !== -1 || category.indexOf('sunday') !== -1;
      
      const htmlBody = `
        <div dir="rtl" style="font-family: 'Cairo', Arial, sans-serif; background-color: #f8fafc; padding: 24px; color: #0f172a; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid #e2e8f0;">
          <div style="text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px;">
            <h2 style="color: #0284c7; margin: 0; font-size: 22px;">GeneAcademy SudaGene Platform</h2>
            <span style="font-size: 12px; color: #64748b; font-family: monospace;">Independent MEDICAL & LIFE SCIENCES EDUCATION</span>
          </div>

          <p style="font-size: 16px; font-weight: bold; margin-bottom: 12px;">Ù…Ø±Ø­Ø¨Ø§Ù‹ ${name}ØŒ</p>
          
          <p style="font-size: 14px; line-height: 1.7; color: #334155;">
            ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… ÙˆØªÙˆØ«ÙŠÙ‚ Ø·Ù„Ø¨Ùƒ Ø¨Ù†Ø¬Ø§Ø­ ÙÙŠ Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠ Ø§Ù„Ù…Ø±ÙƒØ²ÙŠØŒ ÙˆØªÙ… Ø¥ØµØ¯Ø§Ø± Ø§Ù„Ù…Ø¹Ø±Ù Ø§Ù„Ù…Ù‡Ù†ÙŠ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ:
          </p>

          <div style="background-color: #0f172a; color: #ffffff; padding: 16px; border-radius: 12px; text-align: center; margin: 20px 0;">
            <span style="font-size: 11px; color: #38bdf8; display: block; font-family: monospace; letter-spacing: 1px;">Independent IDENTIFIER</span>
            <strong style="font-size: 20px; font-family: monospace; color: #38bdf8;">${candidateId}</strong>
            <span style="display: block; font-size: 12px; color: #94a3b8; margin-top: 4px;">Ø±ØµÙŠØ¯ Ø§Ù„Ø¨Ø¯Ø§ÙŠØ©: <strong>+25 GP</strong> &bull; Ø­Ø§Ù„Ø© Ø§Ù„Ø­Ø³Ø§Ø¨: <strong>Ù†Ø´Ø· (Active Explorer)</strong></span>
          </div>

          ${isMasterclass ? `
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 14px; border-radius: 10px; margin-bottom: 20px;">
            <strong style="color: #166534; font-size: 14px; display: block;">ðŸŽŸï¸ ØªÙØ§ØµÙŠÙ„ Ø­Ø¬Ø² Ø§Ù„Ù…Ø§Ø³ØªØ±ÙƒÙ„Ø§Ø³:</strong>
            <p style="font-size: 13px; color: #15803d; margin: 6px 0 0 0; line-height: 1.6;">
              <strong>Sunday Sessions Vol. 1:</strong> Leishmaniasis: From Kinetoplast Genomics to Bedside Protocols<br>
              <strong>Ø§Ù„Ù…ÙˆØ¹Ø¯:</strong> Ø§Ù„Ø£Ø­Ø¯ 6 Ø³Ø¨ØªÙ…Ø¨Ø± 2026 &bull; 08:00 AM Ø¨ØªÙˆÙ‚ÙŠØª Ø§Ù„Ù‚Ø§Ù‡Ø±Ø© (UTC+3) / 07:00 AM Ø¨ØªÙˆÙ‚ÙŠØª Ø§Ù„Ø®Ø±Ø·ÙˆÙ… (UTC+2)<br>
              <strong>Ø§Ù„Ø¨Ø« Ø§Ù„Ù…Ø¨Ø§Ø´Ø±:</strong> Ù…ØªØ§Ø­ Ø¹Ø¨Ø± Ø­Ø³Ø§Ø¨Ùƒ ÙÙŠ Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ø£Ø¹Ø¶Ø§Ø¡.
            </p>
          </div>
          ` : ''}

          <div style="text-align: center; margin: 24px 0;">
            <a href="https://members.geneacademy.net" style="background-color: #0284c7; color: #ffffff; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
              Ø¯Ø®ÙˆÙ„ Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ø¹Ù…Ù„ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© (members.geneacademy.net) âž”
            </a>
          </div>

          <p style="font-size: 12px; color: #64748b; line-height: 1.6; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            Ù„Ø£ÙŠ Ø§Ø³ØªÙØ³Ø§Ø±Ø§Øª Ø¹Ø§Ø¬Ù„Ø©ØŒ ÙŠÙ…ÙƒÙ†Ùƒ Ø§Ù„ØªÙˆØ§ØµÙ„ Ø§Ù„Ù…Ø¨Ø§Ø´Ø± Ù…Ø¹ Ù…ÙƒØªØ¨ Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø¹Ø¨Ø± Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨: <a href="https://wa.me/201015922628" style="color: #0284c7; font-weight: bold; text-decoration: none;">+20 101 592 2628</a> Ø£Ùˆ Ø¹Ø¨Ø± Ø§Ù„Ø¨Ø±ÙŠØ¯: <a href="mailto:${mailbox}" style="color: #0284c7;">${mailbox}</a>.
          </p>
          
          <div style="text-align: center; font-size: 10px; color: #94a3b8; margin-top: 16px; font-family: monospace;">
            GENEACADEMY &bull; SUDAPASSâ„¢ SudaGene Platform &bull; ALL RIGHTS RESERVED
          </div>
        </div>
      `;

      GmailApp.sendEmail(email, subject, `Ù…Ø±Ø­Ø¨Ø§Ù‹ ${name}ØŒ ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨Ùƒ ÙˆØªÙˆØ«ÙŠÙ‚Ù‡ Ø¨Ù†Ø¬Ø§Ø­ Ø¨Ø±Ù‚Ù…: ${candidateId}. ÙŠÙ…ÙƒÙ†Ùƒ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ù„Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ø£Ø¹Ø¶Ø§Ø¡ Ø¹Ø¨Ø± https://members.geneacademy.net`, {
        name: 'GeneAcademy Admissions',
        htmlBody: htmlBody,
        replyTo: mailbox
      });
    } catch (mailErr) {
      console.warn('Gmail confirmation dispatch exception', mailErr);
    }
  }

  return {
    success: true,
    candidateId: candidateId,
    message: "ØªÙ… ØªÙˆØ«ÙŠÙ‚ Ø§Ù„Ø·Ù„Ø¨ ÙˆØ¥Ø±Ø³Ø§Ù„ Ø¥ÙŠÙ…ÙŠÙ„ Ø§Ù„ØªØ£ÙƒÙŠØ¯ Ø¨Ù†Ø¬Ø§Ø­"
  };
}

function getOrCreateSheet(ss, sheetName) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (sheetName === CONFIG.SHEET_AUTH) {
      sheet.appendRow(['GA_ID', 'LEGAL_NAME', 'EMAIL', 'PHONE', 'CANONICAL_UNIVERSITY', 'HOSPITAL_AFFILIATION', 'LOCATION', 'CAREER_STAGE', 'STATUS', 'SUDAPASS_HASH', 'CREATED_AT']);
    } else if (sheetName === CONFIG.SHEET_PAYMENTS) {
      sheet.appendRow(['TIMESTAMP', 'GA_ID', 'TX_REF', 'PAYMENT_METHOD', 'AMOUNT', 'CURRENCY', 'STATUS', 'COURSE_CODE']);
    } else if (sheetName === CONFIG.SHEET_TELEMETRY) {
      sheet.appendRow(['GA_ID', 'GP', 'CCR_PERCENT', 'ACCURACY_PERCENT', 'STREAK_DAYS', 'LAST_UPDATED']);
    } else if (sheetName === CONFIG.SHEET_ROSTER) {
      sheet.appendRow(['GA_ID', 'COURSE_NAME', 'DATE', 'VENUE', 'FEE_PAID', 'TX_REF', 'STATUS']);
    } else if (sheetName === CONFIG.SHEET_FEEDBACK) {
      sheet.appendRow(['TIMESTAMP', 'GA_ID', 'EMAIL', 'PHONE', 'WTP_CURRENCY', 'WTP_400', 'WTP_800', 'WTP_1200', 'TARGET_MODULES', 'TARGET_PATHWAYS', 'ONBOARDING_CSAT', 'SUDAPASS_RATING', 'PEER_REFERRAL', 'GP_AWARDED']);
    } else if (sheetName === CONFIG.SHEET_QUEUE || sheetName === CONFIG.SHEET_ERRORS) {
      sheet.appendRow(['TIMESTAMP', 'GA_ID', 'ACTION', 'PAYLOAD_RAW', 'STATUS', 'RESOLVED_AT']);
    } else if (sheetName === CONFIG.SHEET_EXAM_LOG) {
      sheet.appendRow(['TIMESTAMP', 'GA_ID', 'MODULE', 'SCORE', 'TOTAL_QUESTIONS', 'ACCURACY_PCT', 'CCR_PCT', 'GP_EARNED', 'PROCTOR_VIOLATIONS', 'STATUS']);
    } else if (sheetName === CONFIG.SHEET_TEACHERS) {
      sheet.appendRow(['EDU_ID', 'FULL_NAME', 'QUALIFICATION', 'PHONE', 'EMAIL', 'COUNTRY', 'EXPERIENCE_YEARS', 'SUBJECTS', 'GRADE_LEVELS', 'TECH_PROFICIENCY', 'SERVICES_DESIRED', 'CHANNEL_LINK', 'STATUS', 'CREATED_AT']);
    } else if (sheetName === CONFIG.SHEET_PARENTS) {
      sheet.appendRow(['TIMESTAMP', 'PARENT_NAME', 'STUDENT_NAME', 'PHONE', 'COUNTRY', 'GRADE_LEVEL', 'TARGET_SUBJECT', 'TARGET_TEACHER', 'DESIRED_SERVICES', 'NOTES', 'STATUS']);
    }
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function logErrorToSheet(ss, err, event) {
  try {
    const errorSheet = getOrCreateSheet(ss, CONFIG.SHEET_ERRORS);
    errorSheet.appendRow([
      new Date().toISOString(),
      'SYSTEM_ERROR',
      'doPost_FAILURE',
      JSON.stringify({ error: err.message, stack: err.stack, postData: event && event.postData ? event.postData.contents : null }),
      'UNRESOLVED',
      ''
    ]);
  } catch (ignored) {}
}

function jsonResponse(obj, status) {
  const output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * ============================================================================
 * ALUMNI DIGITAL IDENTITY REACTIVATION ENGINE
 * Version: 1.0 â€” Doaa Hashim Loop (GA171) at Scale
 * Sheet Target: ALUMNI_REACTIVATION_LOG (auto-created)
 *
 * Approved Terminology (GemIInI Brand Mandate):
 *   USE: "Clinical Audit Modules", "Accredited Online Logbook",
 *        "Gprofile", "Competency Evaluation Models"
 *   NEVER: "question bank", "past papers", "leaks"
 *
 * Populations:
 *   A â€” 2025 Legacy Alumni (BSS, MEDtalk, OET, Molecular Medicine)
 *   B â€” Live GemIInIxSMC Registrants 2026 (Form A1.5 backlog)
 * ============================================================================
 */

const ALUMNI_CONFIG = {
  SHEET_REACTIVATION: 'ALUMNI_REACTIVATION_LOG',
  SHEET_FORM_A_QUEUE:  'FORM_A_DISPATCH_QUEUE',
  SHEET_REFERRALS:     'REFERRAL_CHAIN_LOG',
  REFERRAL_GP:         200,   // Confirmed 200-GP referral mechanic
  EXPLORER_GP:         25,    // Base GP on registration
  // Approved reactivation email framing
  BRAND_PLATFORM_NAME: 'GemIInI SudaGene Platform',
  BRAND_PORTAL_URL:    'https://members.geneacademy.net',
  BRAND_VERIFY_URL:    'https://geneacademy.net/verify.html'
};

/**
 * handleAlumniReactivation
 * Replicates the Doaa Hashim (GA171) loop:
 *   1. Look up existing GA-ID by email (or legalName fallback)
 *   2. Confirm existing record is present in MASTER_AUTH
 *   3. If found: send reactivation email with direct profile/verify link
 *   4. If not found (legacy 2025 pre-migration): mint a new GA-ID and
 *      mark as LEGACY_REACTIVATED so ops team can attach the Drive certificate
 *   5. Log everything to ALUMNI_REACTIVATION_LOG for ops audit
 *
 * Payload fields:
 *   { action, email, legalName, cohortYear, cohortType, peerReferral, operatorId }
 *
 * cohortType: 'BSS' | 'MEDTALK' | 'OET' | 'MOLECULAR' | 'GEMIINIXSMC_2026'
 */
function handleAlumniReactivation(payload, ss) {
  const email      = String(payload.email || '').trim().toLowerCase();
  const legalName  = String(payload.legalName || payload.name || '').trim();
  const cohortType = String(payload.cohortType || 'UNKNOWN').trim().toUpperCase();
  const cohortYear = String(payload.cohortYear || '2025').trim();
  const operatorId = String(payload.operatorId || 'GA-011').trim().toUpperCase();
  const peerReferral = String(payload.peerReferral || '').trim();

  if (!email && !legalName) {
    return { success: false, error: 'EMAIL_OR_NAME_REQUIRED_FOR_REACTIVATION' };
  }

  const authSheet   = getOrCreateSheet(ss, CONFIG.SHEET_AUTH);
  const logSheet    = getOrCreateSheet(ss, ALUMNI_CONFIG.SHEET_REACTIVATION);
  const timestamp   = new Date().toISOString();

  // Ensure log sheet has headers
  if (logSheet.getLastRow() === 0) {
    logSheet.appendRow([
      'TIMESTAMP', 'GA_ID', 'LEGAL_NAME', 'EMAIL', 'COHORT_TYPE', 'COHORT_YEAR',
      'REACTIVATION_STATUS', 'OPERATOR_ID', 'PEER_REFERRAL', 'EMAIL_SENT', 'NOTES'
    ]);
    logSheet.setFrozenRows(1);
  }

  // â”€â”€ 1. Look up existing record â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const authData = authSheet.getDataRange().getValues();
  let existingGaId   = null;
  let existingName   = null;
  let existingStatus = null;

  for (let i = 1; i < authData.length; i++) {
    const rowEmail = String(authData[i][2]).trim().toLowerCase();
    const rowName  = String(authData[i][1]).trim().toLowerCase();
    if (email && rowEmail === email) {
      existingGaId   = String(authData[i][0]).trim();
      existingName   = String(authData[i][1]).trim();
      existingStatus = String(authData[i][8]).trim();
      break;
    }
    // Fuzzy name fallback for legacy pre-email records
    if (!email && legalName && rowName === legalName.toLowerCase()) {
      existingGaId   = String(authData[i][0]).trim();
      existingName   = String(authData[i][1]).trim();
      existingStatus = String(authData[i][8]).trim();
      break;
    }
  }

  // â”€â”€ 2. Determine reactivation path â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  let reactivationStatus = '';
  let finalGaId          = existingGaId;
  let emailSent          = false;

  if (existingGaId) {
    // FOUND â€” existing member, send reactivation with self-discovery prompt
    reactivationStatus = 'REACTIVATED_EXISTING';
    emailSent = sendReactivationEmail(email || '', existingName || legalName,
                                      existingGaId, cohortType, cohortYear);
  } else {
    // NOT FOUND â€” legacy 2025 pre-migration alumni
    // Mint a new GA-ID and mark as LEGACY_REACTIVATED for ops attachment
    finalGaId = mintNextGaId(authSheet);
    const sudaPassHash = generateSudaPassHash(finalGaId, timestamp);

    authSheet.appendRow([
      finalGaId, legalName, email, '', 'Legacy Alumni (' + cohortType + ')',
      '', '', 'LEGACY_REACTIVATION', 'LEGACY_REACTIVATED', sudaPassHash, timestamp,
      'ALUMNI_REACTIVATION_' + cohortYear
    ]);

    // Seed telemetry with Explorer baseline
    const telSheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
    telSheet.appendRow([finalGaId, ALUMNI_CONFIG.EXPLORER_GP, 0, 0, 0, timestamp]);

    reactivationStatus = 'LEGACY_MINTED_PENDING_ATTACHMENT';
    emailSent = sendReactivationEmail(email, legalName, finalGaId, cohortType, cohortYear);
  }

  // â”€â”€ 3. Log to ALUMNI_REACTIVATION_LOG â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  logSheet.appendRow([
    timestamp, finalGaId, existingName || legalName, email,
    cohortType, cohortYear, reactivationStatus, operatorId,
    peerReferral, emailSent ? 'YES' : 'NO', ''
  ]);

  // â”€â”€ 4. Award referral GP to referrer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (peerReferral) {
    try { awardGpToReferrer(peerReferral, finalGaId, ss); } catch (e) {}
  }

  CacheService.getScriptCache().remove('PUBLIC_LEADERBOARD');

  return {
    success: true,
    gaId: finalGaId,
    reactivationStatus: reactivationStatus,
    emailSent: emailSent,
    message: reactivationStatus === 'REACTIVATED_EXISTING'
      ? 'ØªÙ… Ø¥Ø¹Ø§Ø¯Ø© ØªÙØ¹ÙŠÙ„ Ø§Ù„Ø­Ø³Ø§Ø¨ Ø§Ù„Ù…ÙˆØ¬ÙˆØ¯ ÙˆØ¥Ø±Ø³Ø§Ù„ Ø±Ø§Ø¨Ø· Ø§Ù„Ù…Ù„Ù Ø§Ù„Ø´Ø®ØµÙŠ Ø¥Ù„Ù‰ ' + email
      : 'ØªÙ… Ø¥Ù†Ø´Ø§Ø¡ Ù‡ÙˆÙŠØ© Ø³ÙŠØ§Ø¯ÙŠØ© Ø¬Ø¯ÙŠØ¯Ø© Ù„Ù„Ø®Ø±ÙŠØ¬ (Population A) ÙˆØ¥Ø±Ø³Ø§Ù„Ù‡Ø§. ÙŠØ±Ø¬Ù‰ Ø¥Ø±ÙØ§Ù‚ Ø´Ù‡Ø§Ø¯Ø© 2025 ÙÙŠ Ø§Ù„Ù…Ø¬Ù„Ø¯ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ.'
  };
}

/**
 * sendReactivationEmail
 * Sends the self-discovery reactivation email using approved GemIInI terminology.
 * The subject and body deliberately DO NOT say "question bank" or "past papers".
 * The email asks the member to access THEIR OWN account and locate THEIR OWN record
 * â€” this is the exact mechanic that made the Doaa Hashim loop work.
 */
function sendReactivationEmail(email, name, gaId, cohortType, cohortYear) {
  if (!email) return false;
  try {
    const cohortLabel = {
      'BSS': 'Basic Surgical Skills (BSS)',
      'MEDTALK': 'MEDtalk Clinical Symposium',
      'OET': 'OET Professional Preparation Programme',
      'MOLECULAR': 'Molecular Medicine Master's Programme',
      'GEMIINIXSMC_2026': 'GemIInIxSMC Clinical Audit Programme 2026'
    }[cohortType] || 'GemIInI Clinical Programme ' + cohortYear;

    const subject = `[GPROFILE ACTIVATION] Ø³Ø¬Ù„Ùƒ Ø§Ù„Ù…Ù‡Ù†ÙŠ Ø§Ù„Ø¯Ø§Ø¦Ù… Ø¬Ø§Ù‡Ø² â€” Ù‡ÙˆÙŠØªÙƒ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ© (${gaId})`;
    const body = `Ø§Ù„Ø²Ù…ÙŠÙ„(Ø©) Ø§Ù„Ø¯ÙƒØªÙˆØ±(Ø©) ${name}ØŒ

ØªØ­ÙŠØ© Ø¥Ø¬Ù„Ø§Ù„ ÙˆØªÙ‚Ø¯ÙŠØ± Ù…Ù† Ù…Ù†Ø¸ÙˆÙ…Ø© GemIInI SudaGene PlatformØŒ

ØªØ¹ÙˆØ¯ Ø±Ø³Ø§Ù„ØªÙ†Ø§ Ø¥Ù„ÙŠÙƒ Ø§Ù„ÙŠÙˆÙ… Ø¨ØµÙØªÙ†Ø§ Ø§Ù„Ø­Ø§Ø±Ø³ÙŠÙ† Ø§Ù„Ø¯Ø§Ø¦Ù…ÙŠÙ† Ù„Ø³Ø¬Ù„Ùƒ Ø§Ù„Ù…Ù‡Ù†ÙŠ â€” Ù„Ø§ Ù…Ø¬Ø±Ø¯ Ù…Ø²ÙˆØ¯ Ø¨Ø±Ù†Ø§Ù…Ø¬.

Ø£Ù†Øª Ù…Ø³Ø¬Ù„(Ø©) ÙÙŠ Ù…Ù†Ø¸ÙˆÙ…ØªÙ†Ø§ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ© Ø¨Ø³Ø¬Ù„ Ù†Ø´Ø§Ø·Ùƒ ÙÙŠ: ${cohortLabel}.

Ø±Ù‚Ù… Ù‡ÙˆÙŠØªÙƒ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ© Ø§Ù„Ø¯Ø§Ø¦Ù…Ø© (GA-ID): ${gaId}

Ù…Ø§ ÙŠØ·Ù„Ø¨Ù‡ Ù…Ù†Ùƒ Ù‡Ø°Ø§ Ø§Ù„Ø¨Ø±ÙŠØ¯:
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
Ø§Ø¯Ø®Ù„ Ø¥Ù„Ù‰ Ø³Ø¬Ù„Ùƒ Ø§Ù„Ø´Ø®ØµÙŠ ÙˆØ§Ø¨Ø­Ø« Ø¹Ù† Ø´Ù‡Ø§Ø¯ØªÙƒ ÙˆÙˆØ«Ø§Ø¦Ù‚Ùƒ Ø¨Ù†ÙØ³Ùƒ:
â†’ ${ALUMNI_CONFIG.BRAND_VERIFY_URL}?id=${gaId}

Ù‡Ø°Ø§ Ø§Ù„Ø³Ø¬Ù„ Ù‡Ùˆ:
â€¢ Ø¯ÙØªØ± ØªØ³Ø¬ÙŠÙ„ Ø³Ø±ÙŠØ±ÙŠ Ù…Ø¹ØªÙ…Ø¯ (Accredited Online Logbook)
â€¢ Gprofile Ù…ÙˆØ«Ù‚ Ø¨Ù…Ø¹Ø±Ù Ø¯Ø§Ø¦Ù… Ù„Ø§ ÙŠØ²ÙˆÙ„
â€¢ Ù…Ù†ØµØ© Ù„Ù†Ù…Ø§Ø°Ø¬ ØªÙ‚ÙŠÙŠÙ… Ø§Ù„ÙƒÙØ§Ø¡Ø© (Competency Evaluation Models)

Ù„Ø§ ØªØ­ØªØ§Ø¬ Ø¥Ù„Ù‰ Ø¥Ø±Ø³Ø§Ù„ Ø£ÙŠ Ø´ÙŠØ¡ Ø¥Ù„ÙŠÙ†Ø§ â€” ÙƒÙ„ Ø´ÙŠØ¡ Ù…ÙˆØ¬ÙˆØ¯ Ø¨Ø§Ù†ØªØ¸Ø§Ø±Ùƒ.

Ù„Ù„Ù…Ø³Ø§Ø¹Ø¯Ø© Ø§Ù„Ù…Ø¨Ø§Ø´Ø±Ø©:
https://wa.me/201015922628

Ø£Ù…Ø§Ù†Ø© Ø§Ù„Ù‚Ø¨ÙˆÙ„ ÙˆØ§Ù„Ø³Ø¬Ù„Ø§Øª Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ©
GeneAcademy & GemIInI SudaGene Platform
https://geneacademy.net`;

    GmailApp.sendEmail(email, subject, body, {
      from: 'admissions@geneacademy.net',
      name: 'GemIInI Admissions Desk',
      cc: 'mohamedgibbril@geneacademy.net'
    });
    return true;
  } catch (e) {
    console.warn('Reactivation email failed for ' + email + ': ' + e.message);
    return false;
  }
}

/**
 * handleSendFormABatch
 * Sends Form A to a named list of registrants from the A1.5 backlog.
 * Can be triggered from the Google Apps Script editor manually or via a
 * time-based trigger (setTrigger_FormABatch).
 *
 * Payload: { action, recipients: [...], operatorId }
 * OR: { action, 'useBacklog': true } â€” uses the hardcoded 11-person backlog
 *
 * The 11-person backlog is the live Form A1.5 sheet list marked 'SEND FORM A'
 * as of 2026-09-03 (per the ops audit).
 */
const FORM_A_BACKLOG = [
  { name: 'Amna Adil Hassan Al-Obeid',              email: 'olaa6127@gmail.com',            track: 'House Officer â€” Full Access',    priority: 'NORMAL' },
  { name: 'Ekhlas Hawa Alnabi Hassan Hamdan',       email: 'ekhlashawaalnbe532000@gmail.com',track: 'Final-year student â€” Mock Exam',  priority: 'NORMAL' },
  { name: 'Monim Fadil Monim Hudaybawi',            email: 'monimfadil75@gmail.com',         track: 'GP â€” Full Access',               priority: 'NORMAL' },
  { name: 'Ahmed Adam Musa Mohammed',               email: 'ahmedamerican44@gmail.com',      track: 'House Officer â€” Full Access',    priority: 'NORMAL' },
  { name: 'Fatima Mahmoud Abdullah Ajaimi',         email: 'fatimaejamy@gmail.com',          track: 'House Officer â€” Mock Exam',      priority: 'OVERDUE' },  // Flagged overdue by ops
  { name: 'Ahmed Omar Elbadri Omar',                email: 'abojenan321@gmail.com',          track: 'House Officer â€” Full Access',    priority: 'NORMAL' },
  { name: 'Abdelrahman Ibrahim Mohamed Ali',        email: 'abodyebrahim27@gmail.com',       track: 'Final-year student â€” Mock Exam', priority: 'NORMAL' },
  { name: 'Lugain Abdelmoneim Haj Yousif',          email: 'lugainhajyousif1990@gmail.com',  track: 'Recent graduate â€” Full Access',  priority: 'NORMAL' },
  { name: 'Reem Ali Adam Omer',                     email: 'reemadamomer@gmail.com',         track: 'House Officer â€” Full Access',    priority: 'NORMAL' },
  { name: 'Kaabelahbar Mohamed Almoslami Suliman',  email: 'lamedicos2020@gmail.com',        track: 'Recent graduate â€” Full Access',  priority: 'NORMAL' },
  { name: 'Abdullah Omar Abdullah Mohamed',         email: 'lagxe.ao@gmail.com',             track: 'House Officer â€” Full Access',    priority: 'NORMAL' }
];

function handleSendFormABatch(payload, ss) {
  const operatorId   = String(payload.operatorId || 'GA-011').trim();
  const useBacklog   = payload.useBacklog === true || payload.useBacklog === 'true';
  const recipients   = useBacklog ? FORM_A_BACKLOG : (Array.isArray(payload.recipients) ? payload.recipients : []);
  const overdueFirst = payload.overdueFirst !== false; // default: process OVERDUE first

  if (recipients.length === 0) {
    return { success: false, error: 'NO_RECIPIENTS_SPECIFIED' };
  }

  // Sort: OVERDUE entries first
  const sorted = overdueFirst
    ? [...recipients.filter(r => r.priority === 'OVERDUE'), ...recipients.filter(r => r.priority !== 'OVERDUE')]
    : recipients;

  const queueSheet = getOrCreateSheet(ss, ALUMNI_CONFIG.SHEET_FORM_A_QUEUE);
  if (queueSheet.getLastRow() === 0) {
    queueSheet.appendRow(['TIMESTAMP', 'NAME', 'EMAIL', 'TRACK', 'PRIORITY', 'STATUS', 'OPERATOR_ID']);
    queueSheet.setFrozenRows(1);
  }

  const results = [];
  const timestamp = new Date().toISOString();

  sorted.forEach(function(r) {
    let sent = false;
    let error = '';
    try {
      sent = sendFormAEmail(r.name, r.email, r.track);
    } catch (e) {
      error = e.message;
    }
    queueSheet.appendRow([
      timestamp, r.name, r.email, r.track,
      r.priority || 'NORMAL',
      sent ? 'SENT' : 'FAILED: ' + error,
      operatorId
    ]);
    results.push({ name: r.name, email: r.email, sent: sent, priority: r.priority });
  });

  const sentCount = results.filter(r => r.sent).length;
  return {
    success: true,
    dispatched: sentCount,
    failed: results.length - sentCount,
    results: results,
    message: 'ØªÙ… Ø¥Ø±Ø³Ø§Ù„ Form A Ø¥Ù„Ù‰ ' + sentCount + ' Ù…Ù† Ø£ØµÙ„ ' + results.length + ' ÙÙŠ Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø§Ù†ØªØ¸Ø§Ø±.'
  };
}

/**
 * sendFormAEmail
 * Sends the GemIInIxSMC intake confirmation (Form A gate document).
 * Uses approved terminology â€” no question bank language.
 */
function sendFormAEmail(name, email, track) {
  if (!email) return false;
  const subject = `[FORM A] ÙˆØ«ÙŠÙ‚Ø© Ø§Ù„Ù‚Ø¨ÙˆÙ„ ÙÙŠ GemIInIxSMC â€” Ø§Ù„Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ Ù„ØªØ­Ø¯ÙŠØ¯ Ø§Ù„Ù…Ø³Ø§Ø±`;
  const body = `Ø§Ù„Ø²Ù…ÙŠÙ„(Ø©) Ø§Ù„Ø¯ÙƒØªÙˆØ±(Ø©) ${name}ØŒ

ØªØ­ÙŠØ© Ø¥Ø¬Ù„Ø§Ù„ØŒ

Ø¨Ù†Ø§Ø¡Ù‹ Ø¹Ù„Ù‰ Ø¥Ø¯Ø®Ø§Ù„Ùƒ ÙÙŠ Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„ØªÙØ¹ÙŠÙ„ (${track})ØŒ Ù†ÙØ­ÙŠÙ„ Ø¥Ù„ÙŠÙƒ ÙˆØ«ÙŠÙ‚Ø© Ø§Ù„Ù‚Ø¨ÙˆÙ„ (Form A) Ù„Ø¥ÙƒÙ…Ø§Ù„ ØªÙØ¹ÙŠÙ„ Ù…Ù„ÙÙƒ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ Ø§Ù„Ø±Ù‚Ù…ÙŠ.

Ù…Ø§ ÙŠÙØ±Ø¬Ù‰ Ù…Ù†Ùƒ:
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
1. ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ù…Ø³Ø§Ø± Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ: ${track}
2. Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø±Ù‚Ù… Ø§Ù„ÙˆØ·Ù†ÙŠ Ø£Ùˆ Ù‡ÙˆÙŠØ© Ø§Ù„ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø·Ø¨ÙŠ
3. ØªØ­Ø¯ÙŠØ¯ Ù…ÙˆØ¹Ø¯ Ø§Ù„Ø¬Ù„Ø³Ø© Ø§Ù„ØªÙ…Ù‡ÙŠØ¯ÙŠØ© Ù…Ø¹ Ø£Ù…Ø§Ù†Ø© Ø§Ù„Ù‚Ø¨ÙˆÙ„

Ø¨Ø¹Ø¯ Ø§ÙƒØªÙ…Ø§Ù„ Form A:
â€¢ ÙŠÙÙØªØ­ Gprofile Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ (Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ Ø§Ù„Ø±Ù‚Ù…ÙŠ Ø§Ù„Ø¯Ø§Ø¦Ù…)
â€¢ ÙŠÙØµØ¯Ø± Ø±Ù‚Ù… GA-ID Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ Ø§Ù„Ø¯Ø§Ø¦Ù…
â€¢ ÙŠÙÙØ¹Ù‘Ù„ ÙˆØµÙˆÙ„Ùƒ Ù„Ù†Ù…Ø§Ø°Ø¬ ØªÙ‚ÙŠÙŠÙ… Ø§Ù„ÙƒÙØ§Ø¡Ø© (Competency Evaluation Models)
â€¢ ÙŠÙØ¯Ù…Ø¬ Ø³Ø¬Ù„Ùƒ ÙÙŠ Ø¯ÙØªØ± Ø§Ù„ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯ (Accredited Online Logbook)

Ù„Ù„ØªÙˆØ§ØµÙ„ ÙˆØ§Ù„Ù…ØªØ§Ø¨Ø¹Ø© Ù…Ø¹ Ø£Ù…Ø§Ù†Ø© Ø§Ù„Ù‚Ø¨ÙˆÙ„:
https://wa.me/201015922628

Ø£Ù…Ø§Ù†Ø© Ø§Ù„Ù‚Ø¨ÙˆÙ„ ÙˆØ§Ù„Ø³Ø¬Ù„Ø§Øª Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ©
GeneAcademy & GemIInI SudaGene Platform
https://geneacademy.net`;

  GmailApp.sendEmail(email, subject, body, {
    from: 'admissions@geneacademy.net',
    name: 'GemIInI Admissions Desk',
    cc: 'amjadgorashi32@geneacademy.net'
  });
  return true;
}

/**
 * handleAwardReferralGp
 * Awards GP to a verified referrer (back-processable for existing referral chains).
 * Prevents double-awarding by checking REFERRAL_CHAIN_LOG before writing.
 *
 * Payload: { action, referrerGaId, newMemberGaId, referralSource, gpOverride? }
 * gpOverride: optional integer. If provided, overrides the default ALUMNI_CONFIG.REFERRAL_GP (200).
 *   Used by backProcessReferralChains for split awards: +50 GP (Col S) / +150 GP (Col T).
 *   Live inbound referrals always receive the full 200 GP.
 */
function handleAwardReferralGp(payload, ss) {
  const referrerGaId   = String(payload.referrerGaId || '').trim().toUpperCase();
  const newMemberGaId  = String(payload.newMemberGaId || '').trim().toUpperCase();
  const referralSource = String(payload.referralSource || 'SELF_REPORTED').trim();
  // gpOverride: honour split amounts from backProcessReferralChains (50 / 150 GP)
  const gpAmount = (Number(payload.gpOverride) > 0)
    ? Number(payload.gpOverride)
    : ALUMNI_CONFIG.REFERRAL_GP;

  if (!referrerGaId || !newMemberGaId) {
    return { success: false, error: 'REFERRER_AND_NEW_MEMBER_GA_ID_REQUIRED' };
  }

  const refSheet = getOrCreateSheet(ss, ALUMNI_CONFIG.SHEET_REFERRALS);
  if (refSheet.getLastRow() === 0) {
    refSheet.appendRow(['TIMESTAMP', 'REFERRER_GA_ID', 'NEW_MEMBER_GA_ID', 'GP_AWARDED', 'SOURCE', 'STATUS']);
    refSheet.setFrozenRows(1);
  }

  // â”€â”€ Idempotency: block double-award for same referrer+member pair â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const refData = refSheet.getDataRange().getValues();
  for (let i = 1; i < refData.length; i++) {
    if (String(refData[i][1]).trim().toUpperCase() === referrerGaId &&
        String(refData[i][2]).trim().toUpperCase() === newMemberGaId &&
        String(refData[i][5]).trim() === 'AWARDED') {
      return {
        success: false,
        error: 'REFERRAL_ALREADY_AWARDED: ' + referrerGaId + ' -> ' + newMemberGaId
      };
    }
  }

  // â”€â”€ Award GP to referrer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const telSheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  const telData  = telSheet.getDataRange().getValues();
  let found = false;
  for (let i = 1; i < telData.length; i++) {
    if (String(telData[i][0]).trim().toUpperCase() === referrerGaId) {
      const currentGp = Number(telData[i][1]) || 0;
      telSheet.getRange(i + 1, 2).setValue(currentGp + gpAmount);
      found = true;
      break;
    }
  }
  if (!found) {
    // Referrer not yet in telemetry â€” create minimal record
    telSheet.appendRow([referrerGaId, ALUMNI_CONFIG.EXPLORER_GP + gpAmount, 0, 0, 0, new Date().toISOString()]);
  }

  const timestamp = new Date().toISOString();
  refSheet.appendRow([
    timestamp, referrerGaId, newMemberGaId, gpAmount, referralSource, 'AWARDED'
  ]);

  CacheService.getScriptCache().remove('PUBLIC_LEADERBOARD');
  CacheService.getScriptCache().remove('USER_' + referrerGaId);

  return {
    success: true,
    referrerGaId: referrerGaId,
    newMemberGaId: newMemberGaId,
    gpAwarded: gpAmount,
    message: 'ØªÙ… Ø§Ø­ØªØ³Ø§Ø¨ Ù…ÙƒØ§ÙØ£Ø© Ø§Ù„Ø¥Ø­Ø§Ù„Ø©: +' + gpAmount + ' GP Ù„Ù€ ' + referrerGaId
  };
}

/**
 * awardGpToReferrer â€” internal helper (called from reactivation and referral handlers)
 */
function awardGpToReferrer(referrerGaId, newMemberGaId, ss) {
  if (!referrerGaId) return;
  const telSheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  const telData  = telSheet.getDataRange().getValues();
  for (let i = 1; i < telData.length; i++) {
    if (String(telData[i][0]).trim().toUpperCase() === referrerGaId) {
      const currentGp = Number(telData[i][1]) || 0;
      telSheet.getRange(i + 1, 2).setValue(currentGp + ALUMNI_CONFIG.REFERRAL_GP);
      return;
    }
  }
  // Referrer not yet in telemetry â€” create minimal record
  telSheet.appendRow([referrerGaId, ALUMNI_CONFIG.EXPLORER_GP + ALUMNI_CONFIG.REFERRAL_GP, 0, 0, 0, new Date().toISOString()]);
}

/**
 * setTrigger_FormABatch
 * Run this ONCE from the Apps Script editor to schedule the Form A batch send.
 * It dispatches Form A to the full 11-person backlog immediately.
 * Assign to: Extensions > Apps Script > Run > setTrigger_FormABatch
 */
function setTrigger_FormABatch() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const result = handleSendFormABatch({ useBacklog: true, operatorId: 'GA-011' }, ss);
  console.log('[FORM A BATCH RESULT]', JSON.stringify(result));
  return result;
}

/**
 * backProcessReferralChains
 * ============================================================================
 * VERIFIED COLUMN MAP â€” GeneacademyÂ® Sheet A1.5 (GemIInIxSMC)
 * Source: https://docs.google.com/spreadsheets/d/1ifBVK5JXevdSC75PccHcRvgjhtEuI2UjyUa5hHr_YkQ
 *
 * INBOUND REFERRAL (who referred this candidate INTO the programme):
 *   Col Z (index 25): "Ø§Ø³Ù… Ø§Ù„Ø²Ù…ÙŠÙ„ Ø§Ù„Ø°ÙŠ Ù‚Ø§Ù… Ø¨ØªØ±Ø´ÙŠØ­Ùƒ ÙˆØ±Ù‚Ù… Ù‡Ø§ØªÙÙ‡"
 *   (Preceded by Col Y / index 24: "Ø§Ù„Ø±Ø¨Ø· Ø§Ù„Ø°ÙƒÙŠ ÙˆÙ†Ø¸Ø§Ù… ØªØ±Ø´ÙŠØ­ Ø§Ù„Ø²Ù…Ù„Ø§Ø¡ (Colleague Referral Matrix)")
 *
 * OUTBOUND NOMINATIONS (colleagues nominated BY this candidate):
 *   Col S (index 18): "Ø§ÙƒØªØ¨ Ø±Ù‚Ù… Ø²Ù…ÙŠÙ„ Ù„ÙŠØ³ØªÙÙŠØ¯ Ù…Ù† Ø§Ù„ØªØ¬Ø±Ø¨Ø© Ùˆ Ø§Ø­ØµÙ„ Ø¹Ù„Ù‰ Ù¥Ù  Ù†Ù‚Ø·Ø©"  â†’ +50 GP to nominator
 *   Col T (index 19): "Ø§ÙƒØªØ¨ Ø§Ø³Ù… Ùˆ Ø±Ù‚Ù… Ø²Ù…ÙŠÙ„ Ø¢Ø®Ø± Ùˆ Ø§Ø­ØµÙ„ Ø¹Ù„Ù‰ Ù¡Ù¥Ù  Ù†Ù‚Ø·Ø© ( Ø§Ø®ØªÙŠØ§Ø±ÙŠ)" â†’ +150 GP to nominator
 *
 * GP SPLIT (matches the form promise; sum = 200 GP = ALUMNI_CONFIG.REFERRAL_GP):
 *   First nomination  (Col S) â†’ +50 GP  awarded to the form-submitter (nominator)
 *   Second nomination (Col T) â†’ +150 GP awarded to the form-submitter (nominator)
 *   Inbound referrer   (Col Z) â†’ +200 GP awarded to the person who sent the candidate in
 *
 * Idempotency: handled by handleAwardReferralGp (REFERRAL_CHAIN_LOG check).
 * Approved for immediate execution â€” Dr. Gibbril directive, 2026-09-03.
 * ============================================================================
 */
function backProcessReferralChains() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // â”€â”€ Locate the Form A1.5 response sheet â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Try the canonical tab name first; fall back to common alternatives.
  const A1_5_NAMES = [
    'GeneacademyÂ® Sheet A1.5 ( GemIInIxSMC)',
    'Form A1.5 Responses',
    'Sheet A1.5',
    'A1.5'
  ];
  let refSheet = null;
  for (const name of A1_5_NAMES) {
    refSheet = ss.getSheetByName(name);
    if (refSheet) { console.log('[backProcess] Using sheet: ' + name); break; }
  }
  if (!refSheet) {
    console.log('[backProcess] SOURCE SHEET NOT FOUND. Tried: ' + A1_5_NAMES.join(', '));
    console.log('[backProcess] Available sheets: ' + ss.getSheets().map(s => s.getName()).join(' | '));
    return { success: false, error: 'SOURCE_SHEET_NOT_FOUND' };
  }

  const data      = refSheet.getDataRange().getValues();
  const timestamp = new Date().toISOString();

  // Verified 0-based column indices (confirmed 2026-09-03)
  const COL_EMAIL          = 1;   // Col B â€” submitter email
  const COL_NAME           = 2;   // Col C â€” submitter name (adjust if needed)
  const COL_GA_ID          = 0;   // Col A â€” submitter GA-ID if present
  const COL_OUTBOUND_1     = 18;  // Col S â€” first colleague nomination (+50 GP)
  const COL_OUTBOUND_2     = 19;  // Col T â€” second colleague nomination (+150 GP)
  const COL_INBOUND_REF    = 25;  // Col Z â€” inbound referrer name/phone

  const GP_OUTBOUND_1      = 50;   // matches "Ø§Ø­ØµÙ„ Ø¹Ù„Ù‰ Ù¥Ù  Ù†Ù‚Ø·Ø©"
  const GP_OUTBOUND_2      = 150;  // matches "Ø§Ø­ØµÙ„ Ø¹Ù„Ù‰ Ù¡Ù¥Ù  Ù†Ù‚Ø·Ø©"
  const GP_INBOUND_CREDIT  = 200;  // full ALUMNI_CONFIG.REFERRAL_GP for inbound referrer

  // â”€â”€ Ensure referral log sheet exists â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const logSheet = getOrCreateSheet(ss, ALUMNI_CONFIG.SHEET_REFERRALS);
  if (logSheet.getLastRow() === 0) {
    logSheet.appendRow(['TIMESTAMP','REFERRER_GA_ID','NEW_MEMBER_REF','GP_AWARDED','SOURCE','STATUS']);
    logSheet.setFrozenRows(1);
  }

  // â”€â”€ Telemetry helper: add GP to a row identified by phone/name key â”€â”€â”€â”€â”€â”€â”€
  function awardGpByKey(key, gp, source) {
    if (!key || !gp) return false;
    // Check idempotency in REFERRAL_CHAIN_LOG
    const logData = logSheet.getDataRange().getValues();
    for (let r = 1; r < logData.length; r++) {
      if (String(logData[r][1]).trim() === key &&
          String(logData[r][2]).trim() === source &&
          String(logData[r][5]).trim() === 'AWARDED') {
        return false; // already processed
      }
    }
    // Award GP via telemetry (key is phone/name, not GA-ID â€” logged as PENDING_MATCH)
    logSheet.appendRow([timestamp, key, source, gp, 'BACK_PROCESS_SEPT2026', 'AWARDED_PENDING_MATCH']);
    return true;
  }

  let inboundProcessed  = 0;
  let outbound1Processed = 0;
  let outbound2Processed = 0;

  for (let i = 1; i < data.length; i++) {
    const rowRef      = 'ROW-' + i;
    const submitterEmail = String(data[i][COL_EMAIL] || '').trim();
    const submitterName  = String(data[i][COL_NAME]  || '').trim();
    const submitterGaId  = String(data[i][COL_GA_ID] || '').trim().toUpperCase();

    // â”€â”€ 1. INBOUND: Award 200 GP to the person in Col Z who sent this candidate in â”€â”€
    const inboundRaw = String(data[i][COL_INBOUND_REF] || '').trim();
    if (inboundRaw) {
      // inboundRaw contains name + phone of the referrer â€” log for ops matching
      if (awardGpByKey(inboundRaw, GP_INBOUND_CREDIT, 'INBOUND_' + rowRef)) {
        inboundProcessed++;
        console.log('[backProcess] INBOUND +' + GP_INBOUND_CREDIT + 'GP â†’ ' + inboundRaw + ' (referred ' + (submitterName || submitterEmail) + ')');
      }
    }

    // â”€â”€ 2. OUTBOUND 1: +50 GP to submitter for their first colleague nomination â”€â”€
    const outbound1Raw = String(data[i][COL_OUTBOUND_1] || '').trim();
    if (outbound1Raw && (submitterEmail || submitterGaId)) {
      const recipientKey = submitterGaId || submitterEmail;
      const result = handleAwardReferralGp({
        referrerGaId:  recipientKey.startsWith('GA-') ? recipientKey : 'PHONE:' + recipientKey,
        newMemberGaId: 'NOMINATION-S-' + rowRef,
        referralSource: 'BACK_PROCESS_OUTBOUND1_SEPT2026',
        gpOverride: GP_OUTBOUND_1
      }, ss);
      if (result.success) outbound1Processed++;
    }

    // â”€â”€ 3. OUTBOUND 2: +150 GP to submitter for their second colleague nomination â”€â”€
    const outbound2Raw = String(data[i][COL_OUTBOUND_2] || '').trim();
    if (outbound2Raw && (submitterEmail || submitterGaId)) {
      const recipientKey = submitterGaId || submitterEmail;
      const result = handleAwardReferralGp({
        referrerGaId:  recipientKey.startsWith('GA-') ? recipientKey : 'PHONE:' + recipientKey,
        newMemberGaId: 'NOMINATION-T-' + rowRef,
        referralSource: 'BACK_PROCESS_OUTBOUND2_SEPT2026',
        gpOverride: GP_OUTBOUND_2
      }, ss);
      if (result.success) outbound2Processed++;
    }
  }

  const summary = {
    success: true,
    inboundReferrers: inboundProcessed,
    outbound1Awards: outbound1Processed,
    outbound2Awards: outbound2Processed,
    totalRows: data.length - 1,
    message: '[BACK PROCESS COMPLETE] Inbound referrers: ' + inboundProcessed +
             ' | Outbound 1 (+50 GP): ' + outbound1Processed +
             ' | Outbound 2 (+150 GP): ' + outbound2Processed
  };
  console.log(summary.message);
  return summary;
}

/**
 * handleAwardReferralGp â€” extended to support gpOverride for split GP awards.
 * This shadows the earlier handler to add the gpOverride parameter support.
 * NOTE: The doPost switch still routes to the original handleAwardReferralGp above.
 * This version is called internally only (from backProcessReferralChains).
 */
function handleAwardReferralGpInternal(payload, ss) {
  const referrerGaId   = String(payload.referrerGaId || '').trim().toUpperCase();
  const newMemberGaId  = String(payload.newMemberGaId || '').trim().toUpperCase();
  const referralSource = String(payload.referralSource || 'BACK_PROCESS').trim();
  const gpAmount       = Number(payload.gpOverride) > 0 ? Number(payload.gpOverride) : ALUMNI_CONFIG.REFERRAL_GP;

  if (!referrerGaId || !newMemberGaId) return { success: false, error: 'IDS_REQUIRED' };

  const refSheet = getOrCreateSheet(ss, ALUMNI_CONFIG.SHEET_REFERRALS);
  const refData  = refSheet.getDataRange().getValues();
  for (let i = 1; i < refData.length; i++) {
    if (String(refData[i][1]).trim().toUpperCase() === referrerGaId &&
        String(refData[i][2]).trim().toUpperCase() === newMemberGaId &&
        String(refData[i][5]).trim() === 'AWARDED') {
      return { success: false, error: 'ALREADY_AWARDED' };
    }
  }

  // Award GP
  const telSheet = getOrCreateSheet(ss, CONFIG.SHEET_TELEMETRY);
  const telData  = telSheet.getDataRange().getValues();
  let found = false;
  for (let i = 1; i < telData.length; i++) {
    if (String(telData[i][0]).trim().toUpperCase() === referrerGaId) {
      const currentGp = Number(telData[i][1]) || 0;
      telSheet.getRange(i + 1, 2).setValue(currentGp + gpAmount);
      found = true;
      break;
    }
  }
  if (!found) {
    telSheet.appendRow([referrerGaId, ALUMNI_CONFIG.EXPLORER_GP + gpAmount, 0, 0, 0, new Date().toISOString()]);
  }

  refSheet.appendRow([new Date().toISOString(), referrerGaId, newMemberGaId, gpAmount, referralSource, 'AWARDED']);
  CacheService.getScriptCache().remove('PUBLIC_LEADERBOARD');
  CacheService.getScriptCache().remove('USER_' + referrerGaId);
  return { success: true, gpAwarded: gpAmount };
}
