---
name: clinical-case-reviewer
description: Converts raw clinical scenarios into standardized MTC (Mechanism to Clinic) question cards with GP scoring for the GeneAcademy question bank.
---
# MTC™ Clinical Case Reviewer & Question Minting Skill

This skill automates the transformation of unstructured clinical presentations, bedside observations, or exam vignettes into standardized, high-yield **MTC™ (Mechanism to Clinic)** interactive case cards for the GeneAcademy 2,500-case repository.

## The 4-Pillar MTC™ Case Framework

Every submitted clinical scenario must be structured into four rigorous medical tiers:

1. **Subcellular / Molecular Mechanism (الآلية الجزيئية):**
   - Underlying genetics, receptor pharmacology, microbial genomics (e.g., kDNA in Leishmania, HbS $\beta^6\text{Glu}\rightarrow\text{Val}$ mutation, Duffy antigen interaction in Malaria).
2. **Bedside Presentation & Triage (العرض السريري والفرز):**
   - History, vital signs, physical exam signs (e.g., splenomegaly, dactylitis, vaso-occlusive triggers), and acute triage priorities.
3. **Investigation & Differential Diagnosis (الاستقصاء المخبري والتشخيص الفارق):**
   - Lab metrics (CBC, blood film, PCR/electrophoresis, serum ferritin, Wright's F kinship), imaging, and discriminatory biomarkers.
4. **Actionable Management & Protocol (البروتوكول العلاجي العاجل):**
   - First-line pharmacotherapy, dosage guidelines, surgical interventions, and prevention of recurrence.

## GP Telemetry Scoring Matrix
- **Passed Scenario ($\ge 70\%$ Accuracy):** Awards **+10 GP** to the candidate's Independent Ledger.
- **Attempted / Educational Review ($< 70\%$ Accuracy):** Awards **+2 GP** participation telemetry.

## Output Format (Ready for LMS / JSON Ingestion)
```json
{
  "caseId": "MTC-MOD-XXXX",
  "module": "Pediatrics / Tropical / Surgery / Molecular",
  "clinicalTitle": "...",
  "vignette": "...",
  "question": "...",
  "options": [
    {"id": "A", "text": "...", "isCorrect": false},
    {"id": "B", "text": "...", "isCorrect": true, "rationale": "..."},
    {"id": "C", "text": "...", "isCorrect": false},
    {"id": "D", "text": "...", "isCorrect": false}
  ],
  "molecularMechanism": "...",
  "bedsidePearl": "...",
  "gpReward": 10
}
```
