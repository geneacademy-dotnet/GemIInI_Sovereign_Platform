# GemIInI SudaGene Platform â€” Publishing & Deployment Guide

This document outlines the rapid deployment steps to publish the **GemIInI Independent Web Platform** to live production across your official domains: `geneacademy.net`, `members.geneacademy.net`, and `members.geneacademy.net`.

---

## 1. Production Web Package (1-Click Upload & Extract)
The complete production static website has been packaged into:
* **[`GemIInI_Hostinger_Deploy_v3.0.zip`](file:///G:/My%20Drive/GemIInI_Sovereign_Platform/GemIInI_Hostinger_Deploy_v3.0.zip)** (431 KB, 74 Files)

### Deployment Steps (Hostinger / cPanel / Apache):
1. Log into your **Hostinger hPanel** / cPanel dashboard.
2. Go to **File Manager** $\rightarrow$ `public_html`.
3. Upload [`GemIInI_Hostinger_Deploy_v3.0.zip`](file:///G:/My%20Drive/GemIInI_Sovereign_Platform/GemIInI_Hostinger_Deploy_v3.0.zip).
4. Right-click and select **Extract** directly into `public_html`.

---

## 2. 1-Click Cloud Hosting (Free, Instant SSL, Global CDN)

### Option A: Vercel Deployment (Recommended)
1. Install Vercel CLI (if not already installed):
   ```bash
   npm install -g vercel
   ```
2. In this directory (`G:\My Drive\GemIInI_Sovereign_Platform`), run:
   ```bash
   vercel --prod
   ```
3. Set your custom domain in the Vercel dashboard:
   * Main Site: `geneacademy.net`
   * Member Hub: `members.geneacademy.net`
   * CRM & Health: `members.geneacademy.net`

### Option B: Netlify Deployment
1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
2. Run:
   ```bash
   netlify deploy --prod --dir=.
   ```

### Option C: GitHub Pages (Direct Hosting)
1. Push this folder to a GitHub repository (e.g. `geneacademy/Independent-platform`).
2. Go to **Settings > Pages** -> Select **Branch: main** / **Root (/)**.
3. Point your DNS records (`CNAME` / `A` records) to your custom domain.

---

## 3. Official Vodafone Cash Gateway Reference
* **Authorized Payment Number:** `+20 101 592 2628`
* **Quick-Dial Code (Egypt):** `*9*7*+20 101 592 2628*Amount#`
* **Account Type:** Egyptian Mobile Cash Wallet
* **Verification Protocol:** Automated GA# reference assignment with manual 15-minute ops verification.

---

## 4. Multi-Entry Referral Links
Use these pre-configured query parameters in social media, email campaigns, and WhatsApp broadcasts to automatically route candidates to their target module:

* **SMC Sudanese Licensing Council:** `https://geneacademy.net/?entry=smc`
* **Molecular Medicine (MM 1.0 - 8.0):** `https://geneacademy.net/?entry=molecular`
* **High School Science / Biology with Gibbril:** `https://geneacademy.net/?entry=highschool`
* **Pediatric Airway & MTC Resuscitation:** `https://geneacademy.net/?entry=peds`
* **GemIInI Jaib AI CRM:** `https://geneacademy.net/?entry=Member LMS`
* **Direct Certificate Verification:** `https://geneacademy.net/?cert=GA0171`

---

## 5. Architectural Directory Inventory
* [`index.html`](file:///G:/My%20Drive/GemIInI_Sovereign_Platform/index.html) — Master Single-Page Independent Web Application
* [`css/styles.css`](file:///G:/My%20Drive/GemIInI_Sovereign_Platform/css/styles.css) — Bespoke Obsidian & Cyan Glassmorphism Design System
* [`js/app.js`](file:///G:/My%20Drive/GemIInI_Sovereign_Platform/js/app.js) — Core Interactive Engines, AI CRM, MTC Simulator, Diploma Generator
* [`GemIInI_Hostinger_Deploy_v3.0.zip`](file:///G:/My%20Drive/GemIInI_Sovereign_Platform/GemIInI_Hostinger_Deploy_v3.0.zip) — 1-Click Hostinger Production Deployment Archive
