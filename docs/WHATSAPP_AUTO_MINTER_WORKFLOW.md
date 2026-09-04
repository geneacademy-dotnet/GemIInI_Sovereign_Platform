# ðŸ›ï¸ Secondary Automation Workflow: WhatsApp Receipt âž” GA-ID Auto-Minter

## ðŸ“‹ EXECUTIVE WORKFLOW OVERVIEW
This secondary automation workflow eliminates manual administrative friction by connecting inbound WhatsApp payment receipts directly to the **GemIInI Master Ledger (`Code.gs`)**, automatically verifying transactions, minting sequential **GA-XXXX IDs**, crediting living points (**200 GP / 250 GP**), and dispatching an instant cryptographic credential back to the candidate.

```
========================================================================================================================
                                      END-TO-END AUTOMATION TOPOLOGY
========================================================================================================================

  [ Candidate WhatsApp ]              [ WhatsApp Webhook Router ]           [ Google Apps Script (Code.gs) ]
  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”          â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  â”‚ Candidate submits      â”‚          â”‚ 1. Intercepts webhook msg â”‚         â”‚ 1. LockService Concurrency   â”‚
  â”‚ receipt screenshot/PDF â”‚ â”€â”€â”€â”€â”€â”€â”€â–º â”‚ 2. Parses phone & name    â”‚ â”€â”€â”€â”€â”€â”€â–º â”‚ 2. Checks Idempotency / TRX  â”‚
  â”‚ to +20 101 592 2628    â”‚          â”‚ 3. Regex / OCR TRX ID     â”‚         â”‚ 3. Mints next GA-XXXX ID     â”‚
  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜          â”‚ 4. Detects Coffee Booster â”‚         â”‚ 4. Credits +200 / +250 GP    â”‚
                                      â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜         â”‚ 5. Unlocks Dr. Sabri CV      â”‚
                                                                            â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                                                                           â”‚
                                                                                           â–¼
  [ Candidate Welcome Dispatch ]       [ Automated WhatsApp API ]             [ Master Sheet Ledger ]
  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”          â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  â”‚ Instant WhatsApp Msg:  â”‚          â”‚ Dispatches structured     â”‚         â”‚ New Row Appended:            â”‚
  â”‚ â€¢ GA-ID Credential     â”‚ â—„â”€â”€â”€â”€â”€â”€â”€ â”‚ template message with     â”‚ â—„â”€â”€â”€â”€â”€â”€ â”‚ [GA-1042, Name, 250 GP,      â”‚
  â”‚ â€¢ 250 GP Wallet Balanceâ”‚          â”‚ dynamic profile token     â”‚         â”‚  BLS_CONFIRMED, TRX-Ref...]  â”‚
  â”‚ â€¢ Verify & Cockpit URL â”‚          â”‚ and magic verification URLâ”‚         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜          â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
========================================================================================================================
```

---

## âš™ï¸ STEP-BY-STEP OPERATIONAL STAGES

### Stage 1: Receipt Capture & Parsing
When a candidate completes payment (Vodafone Cash or InstaPay) and messages the Academic Desk (`+20 101 592 2628`), the inbound webhook extracts:
* **Candidate Phone Number:** Extracted from WhatsApp metadata (e.g., `+2+20 101 592 2628`).
* **Candidate Full Name:** From WhatsApp profile or message text.
* **Transaction Reference ID:** Extracted via regex pattern matching (`TRX-[A-Z0-9]+` or 6â€“12 digit banking ref).
* **Payment Amount & Booster Flag:**
  * `3,000 EGP` $
ightarrow$ Standard BLS Workshop (`200 GP`).
  * `3,250 EGP` $
ightarrow$ BLS Workshop + Coffee Booster (`250 GP`).
  * `250 EGP` / `$5` $
ightarrow$ Standalone Coffee Patron (`50 GP`).
* **Affiliate Referral Node:** Extracted from pre-filled message parameter (e.g., `ref: GA-000`).

---

### Stage 2: Google Apps Script Backend Execution (`Code.gs`)
The webhook dispatches an HTTPS POST payload to the master Apps Script Web App endpoint:

```json
{
  "action": "bls_registration",
  "fullName": "Ø¯. Ø£Ø­Ù…Ø¯ Ø¹Ø¨Ø¯ Ø§Ù„Ø±Ø­Ù…Ù†",
  "email": "ahmed.abdelrahman@gmail.com",
  "phone": "+2+20 101 592 2628",
  "university": "Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ø®Ø±Ø·ÙˆÙ… | University of Khartoum",
  "role": "Ø·Ø¨ÙŠØ¨ Ø§Ù…ØªÙŠØ§Ø² (House Officer)",
  "workshopTrack": "BLS_DOKKI_CAIRO_AUG28_2026",
  "paymentMethod": "BANK",
  "boughtCoffee": true,
  "feeAmount": 3250,
  "providerRef": "INSTAPAY-TXN-884920194",
  "referralId": "GA-000",
  "idempotencyKey": "WA-BLS-20260828-884920194"
}
```

#### What `Code.gs` Executes:
1. **`LockService.getScriptLock(10000)`**: Prevents race conditions during simultaneous candidate registrations.
2. **Deduplication Check**: Ensures the same transaction ID or idempotency key is never logged twice.
3. **Sequential Minting**: Mints the next incremental ID (e.g., `GA-1042`).
4. **Points Ledger Credit**: Automatically calculates `initialGp = boughtCoffee ? 250 : 200`.
5. **Logs 15 Structured Columns** into `GA_MASTER_REGISTRY`.

---

### Stage 3: Immediate Outbound Dispatch Loop
The webhook router receives the JSON response:
```json
{
  "status": "success",
  "gaId": "GA-1042",
  "gpBalance": 250,
  "paymentMethod": "BANK",
  "boughtCoffee": true,
  "unlock_sabri_cv": true,
  "workshop": "BLS Dokki Cairo - 28 Aug 2026",
  "referralLogged": "GA-000"
}
```

It immediately triggers an automated WhatsApp message to the candidate:

```text
ðŸ›ï¸ GemIInI Academy â€” Independent Digital Credential Issued

Dear Dr. Ø£Ø­Ù…Ø¯ Ø¹Ø¨Ø¯ Ø§Ù„Ø±Ø­Ù…Ù†,

Your payment of 3,250 EGP (BLS Workshop + Coffee Booster) has been forensically verified for the upcoming session on Friday, August 28, 2026 at 9:00 AM.

ðŸ†” Assigned GemIInI ID: GA-1042
ðŸ’Ž Living Points Balance: +250 GP (250 Certified Clinical Credit Hours)
â˜• Coffee Booster Status: ACTIVE (Fast-Track Review Granted)
ðŸŽ Exclusive Bonus: Dr. Mohamed Sabri Digital Transformation & Personalized CV Unlocked!

ðŸ”— Verify Your Credential on Master Ledger:
https://geneacademy.net/verify?id=GA-1042

ðŸš€ Access Your Member Dashboard & CV Tools:
https://geneacademy.net/dashboard

Venue: Dr. Sabri Training Center (Lic. 1549 Â· Reg. 96628) â€” Dokki, Cairo, Egypt.

Welcome to the Independent Medical Ecosystem.

â€” GemIInI Academy Academic Operations Desk
```
