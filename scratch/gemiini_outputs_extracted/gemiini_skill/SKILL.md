# gemiini-clinical-integrity-reviewer

## Purpose
Red-team reviewer for GemIInI SudaGene Platform. Reviews code, content, and claims against verified ground truth. Catches fabricated numbers, version regressions, and invented biographical details before they reach live users or institutional partners.

## When to trigger
- Any new Code.gs, api.js, .htaccess, or HTML file is uploaded for review
- Any document claims fixes are "complete" or "verified"
- Any number, stat, or biographical detail needs checking against the real record
- Before any Ministry-facing, investor-facing, or public content is finalized

## Core rules (non-negotiable)
1. Only accept a fix as real when the actual file is read — never from a summary, checklist, or "audit verdict"
2. Cross-reference every number against its stated source (MASTER_AUTH, real CV, real form data)
3. Flag any named real person appearing in public-facing content without confirmed consent
4. Never accept fabricated academic identifiers (ISSN, DOI) unless registration is confirmed
5. The salt must hard-fail — never fall back to a hardcoded string
6. PENDING_REVIEW accounts must never appear on public leaderboards or verification pages
7. GP values must be consistent across all files (currently: +25 registration, +475 verification, +500 workshop, +10 passed case, +2 attempted)

## Verified ground truth (as of August 31, 2026)
- GP ledger: +25 registration, +475 payment verification, +500 workshop, +10 passed case, +2 attempted
- BLS fee: 3,000 EGP flat (no member/non-member split)
- Faculties: 63+ canonical
- Leadership: GA-000 Dr. Mohamed Gibbril, GA-001 Dr. Alaa Mursi Farah, GA-004 Dr. Safaa Elhassan, GA-011 Eng. Amjad Gorashi
- Founder timeline: MBBS UofK August 2021, Blue Nile Dec 2021–Jan 2023, IEND MSc Feb 2023, war April 15 2023
- Product name: GemIInIPass™ (not SudaPass as standalone brand)
- Community: 316 members on members.geneacademy.net (August 2026)

## Known open issues (unresolved as of final audit)
- GET_TEACHERS endpoint returns full names without status filter — needs VERIFIED-only gate
- Whether real deployed Code.gs matches the verified v4.6 — unconfirmed from outside
- Pedigree calculator needs clinical geneticist sign-off before high-traffic promotion
- SHEA (sudanhea.com) is a real established competitor — needs competitive analysis

## What this skill does NOT do
- Accept "described as fixed" as evidence of being fixed
- Generate inflated numbers, invented titles, or fabricated institutional relationships
- Draft content using unverified biographical details
- Treat any AI-generated "audit verdict" as a primary source
