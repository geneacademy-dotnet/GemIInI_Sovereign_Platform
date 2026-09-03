/**
 * ============================================================================
 * PRE-FLIGHT SENTINEL: LEGACY DATA AUDIT (Pre-August 31st Migration)
 * Executed by: GA-011 | Goal: Zero-Corruption Guarantee
 * ============================================================================
 */

function runLegacyDataSentinel() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  // Target the raw legacy sheet
  const sheet = ss.getSheetByName('LEGACY_STAGE') || ss.getActiveSheet(); 
  const data = sheet.getDataRange().getValues();
  
  // Assume standard columns (Adjust indexes if needed: 0-indexed)
  const NAME_COL = 1;
  const EMAIL_COL = 2;
  const PHONE_COL = 3;
  const AUDIT_NOTES_COL = data[0].length; // Append a new column for notes

  // Set up Header for Audit Notes
  sheet.getRange(1, AUDIT_NOTES_COL + 1).setValue("GA-011 PRE-FLIGHT AUDIT").setBackground('#04080F').setFontColor('#00F2FE').setFontWeight('bold');

  const seenEmails = new Map();
  const seenPhones = new Map();
  
  let flaggedCount = 0;
  let duplicateCount = 0;
  let cleanCount = 0;

  // Clear previous highlights
  sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn() + 1).setBackground(null).setFontColor(null);

  for (let i = 1; i < data.length; i++) {
    const rowNum = i + 1;
    const name = String(data[i][NAME_COL]).trim();
    const email = String(data[i][EMAIL_COL]).trim().toLowerCase();
    const phone = String(data[i][PHONE_COL]).replace(/\D/g, ''); // Extract only digits
    
    let errorNotes = [];
    let isCorrupted = false;

    // 1. Check Missing Data
    if (!name || name.length < 3) errorNotes.push("MISSING/INVALID NAME");
    
    // 2. Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errorNotes.push("INVALID EMAIL");
    } else if (seenEmails.has(email)) {
      errorNotes.push(`DUPLICATE EMAIL (Conflicts with Row ${seenEmails.get(email)})`);
      duplicateCount++;
    } else {
      seenEmails.set(email, rowNum);
    }

    // 3. Validate Phone
    if (!phone || phone.length < 8) {
      errorNotes.push("INVALID PHONE (Too Short)");
    } else if (seenPhones.has(phone)) {
      errorNotes.push(`DUPLICATE PHONE (Conflicts with Row ${seenPhones.get(phone)})`);
      duplicateCount++;
    } else {
      seenPhones.set(phone, rowNum);
    }

    // 4. Execute Highlighting
    if (errorNotes.length > 0) {
      sheet.getRange(rowNum, 1, 1, AUDIT_NOTES_COL).setBackground('#3F0F0F').setFontColor('#EF4444'); // Deep Red for Error
      sheet.getRange(rowNum, AUDIT_NOTES_COL + 1).setValue(errorNotes.join(" | ")).setFontColor('#EF4444').setFontWeight('bold');
      flaggedCount++;
    } else {
      sheet.getRange(rowNum, AUDIT_NOTES_COL + 1).setValue("CLEAN - READY FOR MIGRATION").setFontColor('#30D158');
      cleanCount++;
    }
  }

  // Generate Executive Summary
  const summary = `🛡️ PRE-FLIGHT SENTINEL COMPLETE 🛡️\n\n` +
                  `Total Rows Scanned: ${data.length - 1}\n` +
                  `✅ Clean Records (Ready for Aug 31): ${cleanCount}\n` +
                  `⚠️ Corrupted/Missing Data: ${flaggedCount - duplicateCount}\n` +
                  `🚨 Duplicates Detected: ${duplicateCount}\n\n` +
                  `Eng. Amjad: Please resolve all RED rows before running the OmniSource Harvester.`;
                  
  Logger.log(summary);
  SpreadsheetApp.getUi().alert(summary);
}
