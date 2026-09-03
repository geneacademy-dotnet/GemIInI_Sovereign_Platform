# GemIInI SudaGene Ecosystem â€” Master Google Sheet Architecture (2026)

This document specifies the exact **7-Tab Master Google Sheet Data Blueprint** that powers the entire GemIInI / SudaGene ecosystem, connects Google Forms and the web platform, and manages member identities, inquiry routing, and academic points ledger.

---

## ðŸ“‘ 1. The 7 Master Sheet Tabs Overview

| Tab Name | Purpose & Workflow | Key Identity Key |
| :--- | :--- | :--- |
| **`GA_MASTER_REGISTRY`** | Central cryptographic ledger of all 1,200+ verified members, doctors, and scholars. | `id` (`GA####`) |
| **`INQUIRY_CLINICAL_SMC`** | Form 1: Medical graduates, house officers, and clinical candidates for SMC Modules 1-8. | `GA_ID` / Email |
| **`INQUIRY_MOLECULAR_GENOMICS`** | Form 2: Molecular medicine trainees (MM 1.0 - 8.0), thesis rescue, and qPCR researchers. | `GA_ID` / Email |
| **`INQUIRY_GENETIC_COUNSELING`** | Form 3: Pre-marital risk screening and clinical WES / NGS raw data interpretation cases. | `Case_ID` / Phone |
| **`INQUIRY_GLOMET_TURNKEY`** | Form 4: B2B hospital lab design from zero, CBC reagents, solar power, and reagent placement contracts. | `GLOMEt_REQ_ID` / Rep ID |
| **`INQUIRY_STUDENT_PREMED`** | Form 5: High school / Pre-med biology immersion camps and 57357 hospital shadow programs. | `Student_ID` / Parent Phone |
| **`GP_TRANSACTION_LEDGER`** | Real-time audit log of GemIInI Points: Grants (+500 GP), Unlocks (-50 GP), Bounties (+150 GP). | `Tx_Hash` / `GA_ID` |

---

## ðŸ›ï¸ Tab 1: `GA_MASTER_REGISTRY` (Columns A - N)

```csv
id,name,status_role,institution,grad_year,priority_track,advised_modules,gp_balance,skill_rank,high_value,tags,source_workbook,notes,verified
```

* **A: `id`**: Unique GA Independent Identifier (`GA001` - `GA9999`).
* **B: `name`**: Full legal/professional name as registered.
* **C: `status_role`**: Clinical/academic rank (`House Officer`, `Specialist`, `Graduate / Postgraduate`, `Pre-clinical`).
* **D: `institution`**: University or clinical entity (`University of Khartoum`, `Ahfad`, `University of Bahri`, etc.).
* **E: `grad_year`**: Graduation or entry cohort year (`2021` - `2026`).
* **F: `priority_track`**: Target career vector (`SMC Permanent`, `MRCS / UK`, `USMLE / USA`, `Ireland / AMC`, `Ambassador`).
* **G: `advised_modules`**: Recommended clinical or research modules (`gemiiniXsmc Modules 1 - 8`, `MM 1.0 - 8.0`).
* **H: `gp_balance`**: Active GemIInI Points balance in ledger (`500` welcome balance + earned points).
* **I: `skill_rank`**: Member tier (`Pathfinder`, `Pioneer`, `Vanguard`).
* **J: `high_value`**: Strategic talent flag (`YES` / `NO`).
* **K: `tags`**: Operational segment tags (e.g. `_PIPELINE_HIGH_VALUE`, `_TARGET_MRCS`, `_BLS_VERIFIED`).
* **L: `source_workbook`**: Origin audit source (`GemIInI_Smart_Contacts-4.xlsx`, `Web_Portal_Join`).
* **M: `notes`**: Real operational notes and clinical tracking.
* **N: `verified`**: Boolean verification status (`TRUE` / `FALSE`).

---

## ðŸ©º Tab 2: `INQUIRY_CLINICAL_SMC` (Form 1: Doctors & Candidates)

```csv
Timestamp,GA_ID,FullName,WhatsApp,Email,University,GradYear,CurrentRole,TargetLicensure,SelectedModules,PaymentStatus,AssignedMentor
```
* Captures house officers and graduates targeting the 8 discipline modules.
* Automatically credits **`+500 GP`** upon registration and issues a pending **`GA#`**.

---

## ðŸ§¬ Tab 3: `INQUIRY_MOLECULAR_GENOMICS` (Form 2: Molecular Scholars)

```csv
Timestamp,GA_ID,FullName,WhatsApp,Email,DegreeTarget,ResearchTopic,LabExperience,RequestedModules,ThesisRescueNeeded,AssignedPI
```
* Captures master's/PhD scholars targeting Molecular Medicine MM 1.0 - 8.0 and qPCR data analysis.

---

## ðŸ”¬ Tab 4: `INQUIRY_GENETIC_COUNSELING` (Form 3: Pre-Marital & Patients)

```csv
Timestamp,Case_ID,ClientName,WhatsApp,CityState,ConsanguinityDegree,FamilyHistoryDiseases,TargetGenes_VCF,AssignedGeneticCounselor,Status
```
* Gated clinical intake for thalassemia, sickle cell, BRCA1/2 hereditary cancer, and WES reports.

---

## ðŸ›ï¸ Tab 5: `INQUIRY_GLOMET_TURNKEY` (Form 4: B2B Hospital Setup)

```csv
Timestamp,GLOMEt_REQ_ID,FacilityName,OwnerDirector,LocationState,WhatsApp,SubmitterRole,AgentID,FinanceOfficer,WorkloadScale,TestLinesArray,PowerSource,CoolingStatus,RoomSize,BudgetTier,ContractModel,AssignedBioMedicalEngineer
```
* Captures exact 6-section requirements: Omdurman, Gedaref, Sennar, Port Sudan turnkey facilities.

---

## ðŸŽ’ Tab 6: `INQUIRY_STUDENT_PREMED` (Form 5: Pre-Med STEM)

```csv
Timestamp,StudentID,StudentName,ParentWhatsApp,SchoolName,GradeLevel,TargetCamp,MedicalInterest,AssignedInstructor
```
* Captures high school biology champions, 57357 clinical visits, and Pre-Med foundation tracks.

---

## ðŸ’³ Tab 7: `GP_TRANSACTION_LEDGER` (Points Audit Log)

```csv
Tx_ID,Timestamp,GA_ID,TransactionType,AmountGP,RemainingBalance,ModuleOrBountyRef,AuthorizedBy
```
* Logs every credit (+500 Welcome, +150 Case Bounty) and debit (-50 Module Unlock, -75 OSCE Sim).

---

## ðŸ”— Webhook & Apps Script Integration
* The Google Apps Script in [`google_apps_script/Code.gs`](file:///g:/My%20Drive/GemIInI_Independent_Platform/google_apps_script/Code.gs) listens for HTTP POST requests from [`join.html`](file:///g:/My%20Drive/GemIInI_Independent_Platform/join.html), [`glomet.html`](file:///g:/My%20Drive/GemIInI_Independent_Platform/glomet.html), and [`courses.html`](file:///g:/My%20Drive/GemIInI_Independent_Platform/courses.html).
* Automatically routes rows to `GA_MASTER_REGISTRY` and the corresponding inquiry sub-sheet without manual data entry.
