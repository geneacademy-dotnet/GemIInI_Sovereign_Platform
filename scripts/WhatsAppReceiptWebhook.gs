/**
 * WhatsAppReceiptWebhook.gs — Secondary Automation Router
 * SudaGene Consortium — GemIInI Academy · Gene Academy
 *
 * Receives WhatsApp Business Webhooks or Manual Desk Ingestion
 * and calls the Master Ledger Auto-Minter in Code.gs
 */

const MASTER_GAS_URL = "https://script.google.com/macros/s/AKfycbxAVR42yEQlQMkOBhlcka622FNbSD_3_pIJrNL1bktLyN8TqIYGC2P5cGpUqeZcoql8/exec";
const WHATSAPP_API_TOKEN = "EAAB..."; // WhatsApp Cloud API Token
const PHONE_NUMBER_ID = "1092847291823"; // WhatsApp Business Phone Number ID

/**
 * Handles Inbound WhatsApp Webhook POST
 */
function handleWhatsAppWebhook(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    
    // Check if this is a WhatsApp message event
    if (data.entry && data.entry[0].changes && data.entry[0].changes[0].value.messages) {
      const msg = data.entry[0].changes[0].value.messages[0];
      const fromPhone = msg.from; // Sender's phone number
      const msgText = (msg.text && msg.text.body) || "";
      
      // Parse transaction reference from message text or caption
      const trxMatch = msgText.match(/(TRX-[A-Z0-9]+|\b\d{6,12}\b)/i);
      const providerRef = trxMatch ? trxMatch[0] : ("WA-MANUAL-" + Date.now());
      
      // Parse Coffee booster flag
      const isCoffee = msgText.includes("250") || msgText.includes("قهوة") || msgText.includes("coffee");
      const feeAmount = isCoffee ? 3250 : 3000;
      
      // Parse candidate name
      const nameMatch = msgText.match(/(?:د\.|دكتور|Dr\.?)\s*([\u0600-\u06FFa-zA-Z\s]{3,30})/);
      const fullName = nameMatch ? nameMatch[0] : ("Dr. " + fromPhone);

      // Construct auto-minter payload
      const payload = {
        action: "bls_registration",
        fullName: fullName,
        email: fromPhone + "@gemiini.network",
        phone: "+" + fromPhone,
        university: "Medical Faculty / Hospital",
        role: "Trainee",
        workshopTrack: "BLS_DOKKI_CAIRO_AUG28_2026",
        paymentMethod: "BANK",
        boughtCoffee: isCoffee,
        feeAmount: feeAmount,
        providerRef: providerRef,
        referralId: "GA-000",
        idempotencyKey: "WA-" + fromPhone + "-" + providerRef
      };

      // Call master ledger auto-minter
      const options = {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      };

      const response = UrlFetchApp.fetch(MASTER_GAS_URL, options);
      const resJson = JSON.parse(response.getContentText());

      if (resJson && resJson.status === "success") {
        sendWhatsAppConfirmation(fromPhone, resJson.gaId, resJson.gpBalance, fullName);
      }
    }

    return ContentService.createTextOutput("EVENT_RECEIVED").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    Logger.log("Webhook error: " + err.toString());
    return ContentService.createTextOutput("ERROR: " + err.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * Sends Instant Confirmation Back to Candidate's WhatsApp
 */
function sendWhatsAppConfirmation(toPhone, gaId, gpBalance, doctorName) {
  const replyText = "🏛️ *GemIInI Academy — Sovereign Credential Issued*\n\n" +
    "Dear " + doctorName + ",\n\n" +
    "Your registration has been confirmed for the *BLS Cairo Workshop (Friday, 28 Aug 2026)*.\n\n" +
    "🆔 *GemIInI ID:* `" + gaId + "`\n" +
    "💎 *Living Ledger Credit:* `+" + gpBalance + " GP` (Certified Clinical Hours)\n" +
    "🎁 *Bonus:* Dr. Mohamed Sabri Digital Transformation & CV Module Unlocked!\n\n" +
    "🔗 *Verify in Master Registry:* https://geneacademy.net/verify?id=" + encodeURIComponent(gaId) + "\n" +
    "🚀 *Member Cockpit:* https://geneacademy.net/dashboard\n\n" +
    "— *GemIInI Academy Operations Desk*";

  const url = "https://graph.facebook.com/v18.0/" + PHONE_NUMBER_ID + "/messages";
  const payload = {
    messaging_product: "whatsapp",
    to: toPhone,
    type: "text",
    text: { body: replyText }
  };

  UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + WHATSAPP_API_TOKEN },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
}
