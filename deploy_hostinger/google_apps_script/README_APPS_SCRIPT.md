# 🌐 Google Sheets & Apps Script Integration Guide
## Connecting the 2,136+ Member Registry to Google Sheets & Apps Script Web App

This guide explains how to connect your master database to **Google Sheets** and turn it into a live **Google Apps Script REST API** for real-time lookups and registrations.

---

### 📁 Where the Master Data Files Are Located:

1. **Master CSV Export (2,136 Verified Rows):**
   * Path: `g:\My Drive\GemIInI_Sovereign_Platform\data\master_ga_registry.csv`
2. **Master JSON File:**
   * Path: `g:\My Drive\GemIInI_Sovereign_Platform\data\master_ga_registry.json`
3. **Google Apps Script Backend Code:**
   * Path: `g:\My Drive\GemIInI_Sovereign_Platform\google_apps_script\Code.gs`

---

### 🚀 Step-by-Step Setup (Takes 2 Minutes):

#### Step 1: Open Google Sheets & Import Master Data
1. Go to [https://sheets.new](https://sheets.new) in your browser.
2. Name the sheet: **`GemIInI Master Registry 2026`**.
3. Rename the first tab/sheet at the bottom to: **`GA_MASTER_REGISTRY`**.
4. Click **File (ملف) ➔ Import (استيراد) ➔ Upload (تحميل)**.
5. Select the file:
   `g:\My Drive\GemIInI_Sovereign_Platform\data\master_ga_registry.csv`
6. Choose: **"Replace current sheet" (استبدال الورقة الحالية)** and click **Import data**.
7. You will now see all **2,136 verified members** formatted with columns:
   `id`, `name`, `role`, `univ`, `gp`, `tier`, `tierLabel`, `verified`, `sudaPass`, `hasReview`, `glometId`, `phoneMasked`, `emailMasked`, `cert`.

---

#### Step 2: Add Google Apps Script (Web App Backend)
1. In your Google Sheet, click **Extensions (الإضافات) ➔ Apps Script**.
2. Delete any existing default code in the editor (`function myFunction() {}`).
3. Copy the entire contents of [`google_apps_script/Code.gs`](file:///g:/My%20Drive/GemIInI_Sovereign_Platform/google_apps_script/Code.gs) and paste it into the editor.
4. Click **Save (💾)**.

---

#### Step 3: Deploy as a Live Web App API
1. Click the blue **Deploy (نشر) ➔ New deployment (توزيع جديد)** button at the top right.
2. Select type: **Web app (تطبيق ويب)**.
3. Configure the settings:
   * **Description:** `GemIInI Sovereign API V1`
   * **Execute as:** `Me (حسابي)`
   * **Who has access:** `Anyone (أي شخص)` *(Required for your website frontend to fetch data)*.
4. Click **Deploy (نشر)** and authorize permissions.
5. Copy the generated **Web App URL** (e.g. `https://script.google.com/macros/s/AKfycbx.../exec`).

---

### ⚡ Live API Endpoints Supported by `Code.gs`:

| Action | Example API Request URL | Response |
| :--- | :--- | :--- |
| **Lookup Member by GA#** | `.../exec?action=lookup&id=GA171` | Member record, verified status, and GP balance. |
| **Search by Name/Univ** | `.../exec?action=search&q=دعاء` | Array of matching member objects. |
| **Live Platform Stats** | `.../exec?action=stats` | `{ totalMembers: 2136, totalVerified: 2136, totalGpLedger: 18450000 }` |
| **New Registration (POST)** | `POST .../exec` with JSON body | Appends a new row to Google Sheets in real-time! |

---

### 🔗 Connecting to the Website:
In [`js/app.js`](file:///g:/My%20Drive/GemIInI_Sovereign_Platform/js/app.js), you can set:
```javascript
const APPS_SCRIPT_API_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
```
To enable live bi-directional sync between Google Sheets and the website!
