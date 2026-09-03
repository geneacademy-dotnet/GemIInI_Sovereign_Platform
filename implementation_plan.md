# GemIInI SudaGene Platform - Pre-Launch Fixes

This plan addresses the critical blockers identified before the public deployment.

## User Review Required

> [!WARNING]
> **Design System Conflict**
> We currently have `css/styles.css` defining a "Luxury Cream/Purple" theme, while our HTML files use Tailwind classes for an "Obsidian/Cyan" theme. 
> **Decision:** I propose we delete `css/styles.css` completely and rely exclusively on the Obsidian/Cyan Tailwind identity we've built into `index.html`, `smc.html`, and `verify.html`. This ensures 100% consistency. Please confirm.

## Proposed Changes

### 1. Source Code Export (`GemIInI_Independent_Code_System.md`)
- **[MODIFY]** `GemIInI_Independent_Code_System.md`
  - Remove all `<!-- ... -->` placeholders.
  - Inject the *actual*, full source code for `index.html`, `verify.html`, `smc.html`, and `Code.gs`.
  - Soften the exclusivity claim from "ONLY entity in Sudan" to "One of the premier Independent entities in Sudan offering advanced clinical evaluation in Infectious Diseases, Cellular Immunology, Microbiology, and Genomics" to protect institutional credibility against verifiability attacks.

### 2. Design System Consistency
- **[DELETE]** `css/styles.css` (Pending your approval) to eliminate the conflicting Luxury Cream brand.

### 3. Exam Cockpit (`smc.html`) Verification
- **[VERIFY]** `smc.html` has already been updated with the hardened `loadQuizBank()` logic and the strict `(Correct * 10) + (Incorrect * 2)` GP math. It is NOT the mock version anymore. No further modifications are needed to this file, but I will double-check its integrity.

## Verification Plan

- After updating the export markdown, I will verify it contains zero placeholders.
- I will delete `styles.css` to prevent any CSS crossover on the live server.
- The platform will be fully ready for the `.zip` archive packaging.
