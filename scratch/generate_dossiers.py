"""
GemIInI Sovereign Platform - Operational Batch Dossier & Telemetry Generator
Generates the standardized 12-Doctor Cohort (GA-1552 through GA-1563) CSV batch
for direct import into WellPlan CRM & Telemetry Ledger.
"""

import csv
import json

doctors = [
    {"ga_id": "GA-1552", "name": "Dr. Candidate 1552", "track": "SMC Licensing / MTC", "gp_baseline": 25, "gp_target": 525},
    {"ga_id": "GA-1553", "name": "Dr. Candidate 1553", "track": "SMC Licensing / MTC", "gp_baseline": 25, "gp_target": 525},
    {"ga_id": "GA-1554", "name": "Dr. Candidate 1554", "track": "OET Fellowship Mobility", "gp_baseline": 25, "gp_target": 525},
    {"ga_id": "GA-1555", "name": "Dr. Candidate 1555", "track": "AHA BLS Resuscitation", "gp_baseline": 25, "gp_target": 525},
    {"ga_id": "GA-1556", "name": "Dr. Candidate 1556", "track": "SMC Licensing / MTC", "gp_baseline": 25, "gp_target": 525},
    {"ga_id": "GA-1557", "name": "Dr. Candidate 1557", "track": "OET Fellowship Mobility", "gp_baseline": 25, "gp_target": 525},
    {"ga_id": "GA-1558", "name": "Dr. Candidate 1558", "track": "AHA BLS Resuscitation", "gp_baseline": 25, "gp_target": 525},
    {"ga_id": "GA-1559", "name": "Dr. Candidate 1559", "track": "SMC Licensing / MTC", "gp_baseline": 25, "gp_target": 525},
    {"ga_id": "GA-1560", "name": "Dr. Candidate 1560", "track": "SMC Licensing / MTC", "gp_baseline": 25, "gp_target": 525},
    {"ga_id": "GA-1561", "name": "Dr. Candidate 1561", "track": "OET Fellowship Mobility", "gp_baseline": 25, "gp_target": 525},
    {"ga_id": "GA-1562", "name": "Dr. Candidate 1562", "track": "SMC Licensing / MTC", "gp_baseline": 25, "gp_target": 525},
    {"ga_id": "GA-1563", "name": "Dr. Candidate 1563", "track": "AHA BLS Resuscitation", "gp_baseline": 25, "gp_target": 525},
]

# Generate WellPlan Import CSV
csv_filename = "scratch/WellPlan_Batch_12_Doctors_Import.csv"
with open(csv_filename, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow([
        "GA_ID", "Provisional_Name", "Track", "Provisional_GP", "Bump_GP_On_Verification",
        "Target_GP", "Profile_Gate_Link", "SudaPass_Status", "Assigned_Lead"
    ])
    for doc in doctors:
        gate_url = f"https://geneacademy.net/join.html?ref=gate&ga_id={doc['ga_id']}"
        writer.writerow([
            doc["ga_id"],
            doc["name"],
            doc["track"],
            doc["gp_baseline"],
            500,
            doc["gp_target"],
            gate_url,
            "PROVISIONAL_EXPLORER",
            "Eng. Amjad Gorashi (GA-011)"
        ])

print(f"Successfully generated batch file: {csv_filename}")
