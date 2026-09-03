# 🌐 Google Sheets & Google Drive Independent Integration Guide (2026)
## Connecting the 3-Door SudaGene Ecosystem & Automated Google Drive Dossier Engine

This guide explains how your **5-Tab Google Sheets Relational Ledger** and **Automated Google Drive Dossier Engine** operate seamlessly with the web application (`geneacademy.net` & `members.geneacademy.net`).

---

### 📂 The 5-Tab Google Sheets Relational Architecture

When you deploy [`google_apps_script/Code.gs`](file:///g:/My%20Drive/GemIInI_Independent_Platform/google_apps_script/Code.gs), it automatically creates and maintains these **5 synchronized tabs**:

| Tab Name | Purpose | Key Columns |
| :--- | :--- | :--- |
| **`GA_MASTER_REGISTRY`** | Central Candidate & Member Identity Layer | `id` (GA#), `name`, `email`, `phone`, `entity_door`, `status_role`, `institution`, `grad_year`, `priority_track`, `gp_balance`, `skill_rank`, `drive_folder_url`, `dossier_url`, `created_at`, `verified` |
| **`RESPONSES_STREAM`** | Real-time intake for clinical surveys, first-time experience forms, and 20-Q diagnostics | `timestamp`, `ga_id`, `name`, `email`, `door`, `unit_tested`, `rating`, `clinical_barriers`, `feedback`, `referred_peers`, `dossier_url` |
| **`GP_TRANSACTION_LEDGER`** | Real-time audit trail of every academic currency credit/debit | `timestamp`, `ga_id`, `name`, `amount`, `transaction_type`, `new_balance`, `status` |
| **`CANDIDATE_DRIVE_INDEX`** | Direct Google Drive URL & folder lookup index | `ga_id`, `name`, `email`, `door`, `drive_folder_url`, `dossier_url`, `created_at` |
| **`B2B_GLOMET_PIPELINE`** | Turnkey lab RFQs, institutional contracts, and hospital batch licenses | `timestamp`, `ga_id`, `name`, `institution_company`, `email`, `phone`, `project_type`, `budget_range`, `drive_vault_url`, `pipeline_stage` |

---

### ⚡ Automated Google Drive Vault Creation Pipeline

When any doctor or candidate fills a form or registers:
1. **Google Apps Script `DriveApp`** triggers instantly.
2. Creates the root folder: `📁 GemIInI_Independent_Vault_2026/`
3. Organizes by Independent Entity Door:
   * `📁 1_GemIInI_Academy_Clinical/`
   * `📁 2_GeneAcademy_Molecular_Research/`
   * `📁 3_GLOMEt_HQ_B2B_Labs/`
4. Creates a dedicated personal folder: `📁 [GA3463] - Dr. Full Name/`
5. Automatically creates and saves a **Candidate Response Dossier (Google Doc)** inside the folder with all submitted clinical answers and credentials.
6. The candidate can instantly access their personal vault directly from their **Members Portal Cockpit** via single-click!

---

### 🚀 2-Minute Setup in Google Sheets:

1. Open your master Google Sheet at [sheets.new](https://sheets.new).
2. Click **Extensions (الإضافات) ➔ Apps Script**.
3. Replace the script editor code with the updated contents of [`google_apps_script/Code.gs`](file:///g:/My%20Drive/GemIInI_Independent_Platform/google_apps_script/Code.gs).
4. Click **Deploy (نشر) ➔ New deployment (توزيع جديد)**:
   * Type: **Web app (تطبيق ويب)**
   * Execute as: **Me (حسابي)**
   * Who has access: **Anyone (أي شخص)**
5. Click **Deploy** and authorize permissions (including Google Drive & Docs permissions).
6. Copy the **Web App URL** and ensure it matches `GAS_URL` in [`api.js`](file:///g:/My%20Drive/GemIInI_Independent_Platform/api.js).

---

### 🚪 3-Door Dynamic Routing Reference:

| User Enters | Detected Door | Routed Workspace |
| :--- | :--- | :--- |
| **Doctor / Medical Student** | 🚪 **Door 1: GemIInI Academy** | SMC Licensure Q-Banks, 20-Q Diagnostic Simulator, Clinical Reality Barometer |
| **Molecular Scholar / Researcher** | 🚪 **Door 2: GeneAcademy** | Molecular Medicine Masterclasses (MM 1.0 - 8.0), Scientific Manuscript Hub, Independent Alumni Museum |
| **Hospital Director / Lab Partner** | 🚪 **Door 3: GLOMEt HQ** | Turnkey Lab Specifications, CBC Reagent Procurement, Institutional Batch Contracts |
