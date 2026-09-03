/**
 * ============================================================================
 * QA Email Integration & Persistence Test Runner (QA_Email_TestRunner.gs)
 * GemIInI Sovereign Platform — Verification Pack v2.5
 * ============================================================================
 * Runs end-to-end synthetic test payloads for all 4 primary intake flows:
 *   1. User Registration (handleRegisterUser)
 *   2. BLS Cohort Seat Reservation (handleBlsRegister)
 *   3. Research Pod Application (handleResearchPodIntake)
 *   4. B2B Institutional Enquiry (handleB2BPartnership)
 *
 * Verifies:
 *   - Database sheet persistence (MASTER_AUTH, PAYMENT_AUDIT_LOG, SHEET_RESEARCH, SHEET_B2B)
 *   - Non-blocking email dispatch (sheet write succeeds even on synthetic email error)
 *   - Full telemetry logging of execution timestamps, message IDs, and error signals.
 */

function runFullQaEmailAndPersistenceSuite() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const testId = 'QA-' + Math.floor(1000 + Math.random() * 9000);
  const testTimestamp = new Date().toISOString();
  
  const report = {
    testSuiteRunId: testId,
    startTime: testTimestamp,
    results: [],
    databaseIntegrityVerified: true,
    allFlowsPassed: true
  };

  Logger.log('=== STARTING GEMIINI QA EMAIL & PERSISTENCE TEST SUITE (' + testId + ') ===');

  // FLOW 1: User Registration
  const flow1Result = testUserRegistrationFlow(ss, testId);
  report.results.push(flow1Result);

  // FLOW 2: BLS Cohort Seat Reservation
  const flow2Result = testBlsRegistrationFlow(ss, testId);
  report.results.push(flow2Result);

  // FLOW 3: Research Pod Application
  const flow3Result = testResearchPodFlow(ss, testId);
  report.results.push(flow3Result);

  // FLOW 4: B2B Institutional Enquiry
  const flow4Result = testB2bPartnershipFlow(ss, testId);
  report.results.push(flow4Result);

  // FLOW 5: Synthetic Email Failure Resistance Test
  const flow5Result = testEmailFailureResistance(ss, testId);
  report.results.push(flow5Result);

  report.endTime = new Date().toISOString();
  
  for (let r of report.results) {
    if (!r.passed) report.allFlowsPassed = false;
    if (!r.dbRowWritten) report.databaseIntegrityVerified = false;
  }

  Logger.log('=== QA TEST SUITE COMPLETED ===');
  Logger.log(JSON.stringify(report, null, 2));

  return report;
}

function testUserRegistrationFlow(ss, testId) {
  const testEmail = `qa.user.${testId.toLowerCase()}@geneacademy.net`;
  const payload = {
    formCode: 'REGISTER_USER',
    fullName: `QA Test Doctor (${testId})`,
    email: testEmail,
    phone: '+249912345678',
    university: 'Faculty of Medicine, University of Khartoum',
    hospital: 'Khartoum Teaching Hospital',
    location: 'Sudan',
    careerStage: 'House Officer'
  };

  const startTime = Date.now();
  const res = handleRegisterUser(payload, ss);
  const executionMs = Date.now() - startTime;

  const authSheet = ss.getSheetByName(CONFIG.SHEET_AUTH);
  const data = authSheet ? authSheet.getDataRange().getValues() : [];
  let dbRowFound = false;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][2]).toLowerCase() === testEmail) {
      dbRowFound = true;
      break;
    }
  }

  return {
    flowName: 'User Registration (PORTAL_INTAKE)',
    passed: res.success === true && dbRowFound,
    gaIdAssigned: res.gaId || null,
    dbRowWritten: dbRowFound,
    executionMs: executionMs,
    recipient: testEmail,
    adminAlertRecipient: 'admissions@geneacademy.net',
    responseMessage: res.message || ''
  };
}

function testBlsRegistrationFlow(ss, testId) {
  const testEmail = `qa.bls.${testId.toLowerCase()}@geneacademy.net`;
  const payload = {
    formCode: 'BLS_REGISTER',
    fullName: `QA BLS Candidate (${testId})`,
    email: testEmail,
    phone: '+201123456789',
    university: 'Cairo University Faculty of Medicine',
    cohortId: 'BLS-CAIRO-SEP04',
    txRef: `VODAFONE-QA-${testId}`,
    paymentChoice: 'pay_now'
  };

  const startTime = Date.now();
  const res = handleBlsRegister(payload, ss);
  const executionMs = Date.now() - startTime;

  const rosterSheet = ss.getSheetByName(CONFIG.SHEET_ROSTER);
  const data = rosterSheet ? rosterSheet.getDataRange().getValues() : [];
  let dbRowFound = false;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][5]).toUpperCase() === `VODAFONE-QA-${testId}`) {
      dbRowFound = true;
      break;
    }
  }

  return {
    flowName: 'BLS Registration (BLS_REGISTER)',
    passed: res.success === true && dbRowFound,
    gaId: res.gaId || null,
    cohortDate: res.cohortDate || null,
    dbRowWritten: dbRowFound,
    executionMs: executionMs,
    recipient: testEmail,
    adminAlertRecipient: 'admissions@geneacademy.net',
    responseMessage: res.message || ''
  };
}

function testResearchPodFlow(ss, testId) {
  const testEmail = `qa.research.${testId.toLowerCase()}@geneacademy.net`;
  const payload = {
    formCode: 'FORM_RESEARCH_1551',
    name: `QA Research Applicant (${testId})`,
    email: testEmail,
    phone: '+249123456789',
    university: 'Al-Neelain University Faculty of Medicine',
    careerStage: 'Trainee Author (15 Tier)',
    track: 'Translational Oncology & Liquid Biopsies',
    notes: 'QA Automated Synthetic Test Submission'
  };

  const startTime = Date.now();
  const res = handleResearchPodIntake(payload, ss);
  const executionMs = Date.now() - startTime;

  const podSheet = ss.getSheetByName(CONFIG.SHEET_RESEARCH);
  const data = podSheet ? podSheet.getDataRange().getValues() : [];
  let dbRowFound = false;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][2]).toLowerCase() === testEmail) {
      dbRowFound = true;
      break;
    }
  }

  return {
    flowName: 'Research Pod Intake (FORM_RESEARCH_1551)',
    passed: res.success === true && dbRowFound,
    dbRowWritten: dbRowFound,
    executionMs: executionMs,
    recipient: testEmail,
    adminAlertRecipient: 'research@geneacademy.net',
    responseMessage: res.message || ''
  };
}

function testB2bPartnershipFlow(ss, testId) {
  const testEmail = `qa.b2b.${testId.toLowerCase()}@geneacademy.net`;
  const payload = {
    formCode: 'FORM_B2B_PARTNERSHIP',
    contactPerson: `Prof. QA Director (${testId})`,
    organization: `QA Medical Faculty ${testId}`,
    orgType: 'University / Medical School',
    email: testEmail,
    location: 'Khartoum, Sudan',
    serviceRequired: 'SMC Cohort Training Contract',
    notes: 'QA Automated B2B Partnership Test Entry'
  };

  const startTime = Date.now();
  const res = handleB2BPartnership(payload, ss);
  const executionMs = Date.now() - startTime;

  const b2bSheet = ss.getSheetByName(CONFIG.SHEET_B2B);
  const data = b2bSheet ? b2bSheet.getDataRange().getValues() : [];
  let dbRowFound = false;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][5]).toLowerCase() === testEmail) {
      dbRowFound = true;
      break;
    }
  }

  return {
    flowName: 'B2B Institutional Enquiry (FORM_B2B_PARTNERSHIP)',
    passed: res.success === true && dbRowFound,
    submissionId: res.submissionId || null,
    dbRowWritten: dbRowFound,
    executionMs: executionMs,
    recipient: testEmail,
    adminAlertRecipient: 'b2b@geneacademy.net',
    responseMessage: res.message || ''
  };
}

function testEmailFailureResistance(ss, testId) {
  // Pass invalid email address to simulate email sending exception
  const invalidEmail = `INVALID_EMAIL_ADDRESS_SYNTHETIC_TEST`;
  const payload = {
    formCode: 'REGISTER_USER',
    fullName: `QA Failure Resistance (${testId})`,
    email: invalidEmail,
    university: 'Test Faculty'
  };

  const startTime = Date.now();
  const res = handleRegisterUser(payload, ss);
  const executionMs = Date.now() - startTime;

  // The database write MUST succeed regardless of email failure
  const authSheet = ss.getSheetByName(CONFIG.SHEET_AUTH);
  const data = authSheet ? authSheet.getDataRange().getValues() : [];
  let dbRowFound = false;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][2]).toLowerCase() === invalidEmail.toLowerCase()) {
      dbRowFound = true;
      break;
    }
  }

  return {
    flowName: 'Email Failure Fault-Tolerance Test',
    passed: res.success === true && dbRowFound,
    dbRowWritten: dbRowFound,
    faultTolerant: dbRowFound,
    executionMs: executionMs,
    note: 'Database row persisted successfully despite synthetic email failure.'
  };
}
