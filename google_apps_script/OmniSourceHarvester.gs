/**
 * ============================================================================
 * GemIInI SudaGene Platform â€” OmniSource Harvester v2.0 (Strict Audit Mode)
 * ACTION: Ingests Legacy Sheets A1.5 & B1.5 safely into MASTER_AUTH
 * SECURITY: All ingested records default to 'LEGACY_PENDING_AUDIT'. Zero auto-verification.
 * ============================================================================
 */

const HARVESTER_CONFIG = {
  TARGET_SPREADSHEET_ID: '1X74wS42KR5WpMusd8L_3-5LCDSIz9m7JHNdgY-rTbxs', // Master Registry
  SOURCE_SHEET_A15_ID: '1ifBVK5JXevdSC75PccHcRvgjhtEuI2UjyUa5hHr_YkQ',
  SOURCE_SHEET_B15_ID: '1-a3JPg3sD_omMEhR61DGErIREBSuDyAWDSnzIKzA1zg',
  DRY_RUN_MODE: false // ðŸš¨ Set to FALSE to execute the actual migration
};

// 1. STRICT SALT ENFORCEMENT
function getSecretSaltSecure() {
  const salt = PropertiesService.getScriptProperties().getProperty('SECRET_SALT');
  if (!salt) {
    throw new Error('CRITICAL_SECURITY_HALT: SECRET_SALT is missing. Harvester aborted.');
  }
  return salt;
}

function executeStrictMigration() {
  if (HARVESTER_CONFIG.DRY_RUN_MODE) {
    Logger.log("âš ï¸ RUNNING IN DRY RUN MODE - No data will be written.");
  }

  const targetSs = SpreadsheetApp.openById(HARVESTER_CONFIG.TARGET_SPREADSHEET_ID);
  const authSheet = targetSs.getSheetByName('MASTER_AUTH');
  const telSheet = targetSs.getSheetByName('TELEMETRY');
  
  // Track existing to prevent duplicates
  const existingEmails = new Set();
  const existingPhones = new Set();
  const existingGaIds = new Set();
  
  const existingAuthData = authSheet.getDataRange().getValues();
  let nextMintNumber = 1000;

  for (let i = 1; i < existingAuthData.length; i++) {
    const gaId = String(existingAuthData[i][0]).trim().toUpperCase();
    const email = String(existingAuthData[i][2]).trim().toLowerCase();
    const phone = String(existingAuthData[i][3]).replace(/\D/g, '');
    
    if (gaId) {
      existingGaIds.add(gaId);
      const match = gaId.match(/^GA-(\d+)$/i);
      if (match && parseInt(match[1], 10) > nextMintNumber) {
        nextMintNumber = parseInt(match[1], 10);
      }
    }
    if (email && email.includes('@')) existingEmails.add(email);
    if (phone && phone.length >= 8) existingPhones.add(phone.slice(-8));
  }
  
  let importedCount = 0;
  let skippedCount = 0;

  // Function to process a legacy sheet
  function processLegacySheet(sheetId, sourceName) {
    const ss = SpreadsheetApp.openById(sheetId);
    const data = ss.getSheets()[0].getDataRange().getValues();
    const header = data[0].map(h => String(h).trim().toLowerCase());
    
    const nameIdx = header.findIndex(h => h.includes('name') || h.includes('Ø§Ø³Ù…'));
    const emailIdx = header.findIndex(h => h.includes('email') || h.includes('mail'));
    const phoneIdx = header.findIndex(h => h.includes('phone') || h.includes('whatsapp'));
    const univIdx = header.findIndex(h => h.includes('univ') || h.includes('Ø¬Ø§Ù…Ø¹Ø©'));

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      let name = nameIdx !== -1 ? String(row[nameIdx]).trim() : '';
      let email = emailIdx !== -1 ? String(row[emailIdx]).trim().toLowerCase() : '';
      let phone = phoneIdx !== -1 ? String(row[phoneIdx]).replace(/\D/g, '') : '';
      let univ = univIdx !== -1 ? String(row[univIdx]).trim() : 'Unknown Legacy Faculty';

      if (!name || name.length < 3) continue;
      
      const phoneLast8 = phone.length >= 8 ? phone.slice(-8) : '';
      if (email && existingEmails.has(email)) { skippedCount++; continue; }
      if (phoneLast8 && existingPhones.has(phoneLast8)) { skippedCount++; continue; }

      nextMintNumber++;
      const gaId = 'GA-' + nextMintNumber;
      const timestamp = new Date().toISOString();
      const sudaHash = generateHashSecure(gaId, timestamp);

      if (!HARVESTER_CONFIG.DRY_RUN_MODE) {
        // ðŸš¨ CRITICAL FIX: Status is explicitly LEGACY_PENDING_AUDIT
        const sourceChannel = 'LEGACY_MIGRATION';
        authSheet.appendRow([
          gaId, name, email, phone, univ, '', '', 'Legacy Candidate', 
          'LEGACY_PENDING_AUDIT', sudaHash, timestamp, sourceChannel
        ]);
        
        // ðŸš¨ CRITICAL FIX: 25 GP Baseline. No free 500 GP.
        telSheet.appendRow([gaId, 25, 0, 0, 0, timestamp]);
      }

      existingGaIds.add(gaId);
      if (email) existingEmails.add(email);
      if (phoneLast8) existingPhones.add(phoneLast8);
      importedCount++;
    }
  }

  processLegacySheet(HARVESTER_CONFIG.SOURCE_SHEET_B15_ID, 'B1.5');
  processLegacySheet(HARVESTER_CONFIG.SOURCE_SHEET_A15_ID, 'A1.5');

  const msg = `ðŸ›¡ï¸ MIGRATION COMPLETE (${HARVESTER_CONFIG.DRY_RUN_MODE ? 'DRY RUN' : 'LIVE'})\n\n` +
              `â€¢ Profiles Ingested: ${importedCount}\n` +
              `â€¢ Duplicates Prevented: ${skippedCount}\n` +
              `â€¢ All ingested records set to LEGACY_PENDING_AUDIT.\n` +
              `â€¢ All ingested records assigned 25 GP baseline.`;
  Logger.log(msg);
}

function generateHashSecure(gaId, timestamp) {
  const raw = gaId + '|' + timestamp + '|' + getSecretSaltSecure();
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
  return digest.map(b => (b < 0 ? b + 256 : b).toString(16).padStart(2, '0')).join('');
}
