# GemIInI SudaGene Platform — Single Source of Truth
## Last verified: August 31, 2026 (from this conversation's actual file inspections)

### What is real and verified
- Live platform: members.geneacademy.net (Skool-based community)
- Public site: geneacademy.net (Hostinger)
- Community members: 316 (screenshot confirmed, August 2026)
- Active events: Monday Maratons, المسار المهني (Saturdays), OET sessions, Sunday Sessions
- Live courses: GemIInIxSMC Free Trial (Dr. Gibbril), Module IV Surgery/Trauma (Dr. Alaa Mursi)
- Real exam bank: 242 questions in smc_mock_bank.json (verified by direct JSON parse)
- AHA BLS partner: Dr. Sabri Abugroon Training Center, Licence No. 1549, Cairo/Dokki
- BLS capacity: 12 seats, 3,000 EGP flat
- Instagram: @gemiinieducation (publicly indexed)
- LinkedIn: Gene academy / GemIInieducation company page

### Founder facts (CV-verified only)
- MBBS, University of Khartoum, August 2021
- MSc Molecular Medicine, University of Khartoum, In Progress
- Blue Nile region clinical service: December 2021 – January 2023
- IEND MSc start: February 2023, under Prof. Muntaser Ibrahim
- Research assistant to Dr. Ayman Hussein (clinical geneticist) until April 15, 2023
- STUDS co-founder (displaced students support)
- Scientific Literacy Project, IEND: September 2022 – April 2023

### What is NOT verified and should not be stated as fact
- "18 months" or "10+ convoys" in Blue Nile — generated embellishment, corrected to 12 months
- "National Council for Genomic Literacy" — invented title, not a real entity
- Any ISSN or DOI number — not registered, must not appear in public content
- "315 verified members" — was a WhatsApp group count, not verified professional members
- "649+ members" on edusphere — source unknown
- "5,000 students" from CV — listed as target/aspiration, not achieved count
- SHEA competitor analysis — not yet done, needed before any market-leadership claim

### Code.gs verified fixes (v4.6, last confirmed file)
- Salt: hard-fail throw, no fallback ✓
- GP forgery: Math.max(0, ...) floor ✓
- BLS status: strict equality, not substring match ✓
- Leaderboard: PENDING_REVIEW excluded ✓
- UPDATE_CONSENT: isolated to B2B_CONSENT column only ✓
- OPEN: GET_TEACHERS returns full names without status filter — NOT YET FIXED

### Canonical GP ledger (locked)
- +25 GP: registration
- +475 GP: payment verification (reaching 500 Pathfinder)
- +500 GP: completed workshop
- +10 GP: passed clinical case
- +2 GP: attempted clinical case
