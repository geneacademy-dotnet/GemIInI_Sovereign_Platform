/**
 * ============================================================================
 * GemIInI SudaGene Platform — Email & CRM Campaign Dispatcher
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

      const subject = `[EXAM SPRINT] رابط وتوجيهات الامتحان التجريبي الوطني للمجلس الطبي (SMC 242-Doctor Sprint)`;
      const body = `الزميل(ة) الكريم(ة) د. ${name}،

تحية طيبة،

نحيطكم علماً بانطلاق الامتحان التجريبي السريري الوطني عبر محاكي MTC™ التفاعلي.

تفاصيل الامتحان والجلسة السريرية:
==================================================
• المعرف السريري: ${gaId}
• عدد السيناريوهات: 100 حالة سريرية عالية الأهمية (Internal Medicine, Surgery, Obs/Gyn, Paediatrics).
• نظام الاحتساب: +10 GP لكل إجابة صحيحة (≥ 70%) تُضاف فوراً للوحة الصدارة (Leaderboard).
• رابط الدخول المباشر للامتحان: https://geneacademy.net/smc.html

تعليمات الجلسة:
1. الجلسة خاضعة للمراقبة الرقمية غير التداخلية (Unassisted Digital Proctoring).
2. يقدم النظام تعليلاً علمياً دقيقاً لكل خيار بمجرد إتمام الحالة السريرية.

نتمنى لكم دوام التوفيق والتميز الأكاديمي،

The Examination & Telemetry Directorate
GemIInI Academy · SudaGene Consortium Network
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

      const subject = `[CERTIFIED] توثيق شهادة الإنعاش القلبي (AHA BLS) وإيداع +500 GP في رصيدك السريري`;
      const body = `الزميل(ة) الكريم(ة) د. ${name}،

مبارك إتمامك لورشة التدريب السريري العملي المعتمدة لبرنامج الإنعاش القلبي الرئوي (BLS Provider) المنعقدة بالقاهرة بالشراكة مع مركز د. صبري أبو قرون للتدريب (ترخيص 1549).

بيانات الاعتماد المسجلة في السجل السيادي:
==================================================
• المعرف السريري (GA-ID): ${gaId}
• ترخيص جهة التدريب: STC Clinical Simulation Center (Lic. 1549)
• النقاط المودعة: +500 GP (تفعيل العضوية الدائمة والاعتماد السريري الكامل)
• رابط التحقق الفوري من الهوية والشهادة: https://geneacademy.net/verify.html?id=${gaId}

خطوتك القادمة:
يمكنك الآن استثمار رصيدك السريري لخوض محاكاة امتحانات المجلس الطبي والمشاركة في المجموعات البحثية 15:5:1.

مع أطيب التمنيات،

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
  const adminSubject = `🏢 [B2B LEAD] New Institutional Partnership Request: ${org}`;
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
    const clientSubject = `استلام طلب الشراكة المؤسسية وتطوير القدرات السريرية | GemIInI Enterprise & GLOMEt`;
    const clientBody = `السيد(ة) الفاضل(ة) ${contact}،
ممثل ${org}،

تحية طيبة وبعد،

نؤكد لكم استلام طلب الشراكة المؤسسية المتعلق بـ (${service}) عبر بوابة GemIInI Enterprise.

يقوم فريق تطوير الأعمال السريرية والمكتب التنفيذي حالياً بمراجعة نطاق المشروع وإعداد مسودة مقترح العمل وجدول المواصفات والتجهيزات. 
سيتواصل معكم المستشار المختص خلال 24 ساعة عبر البريد الإلكتروني أو الهاتف المرفق لترتيب الاجتماع التنسيقي.

للمراسلات العاجلة، يمكنكم الرد مباشرة على هذا البريد.

مع فائق الاحترام والتقدير،

The Institutional Partnerships & B2B Directorate
GemIInI SudaGene Platform · GLOMEt Medical Solutions
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

    const message = `مرحباً د. ${name}، 

نحيطك علماً بتوثيق حسابك في السجل السيادي (GA-ID: ${gaId}).
رابط فحص الهوية والسجل: https://geneacademy.net/verify.html?id=${gaId}
رابط محاكي الحالات السريرية (SMC Bank): https://geneacademy.net/smc.html

أمانة العمليات السريرية — GemIInI Academy`;

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
