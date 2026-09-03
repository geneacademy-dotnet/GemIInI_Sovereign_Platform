import os

base_dir = r"G:\My Drive\GemIInI_Sovereign_Platform"

files_to_include = [
    ("1. The Corporate Umbrella: Master Landing Page", "index.html", "html"),
    ("2. The Sovereign Identity Vault", "verify.html", "html"),
    ("3. The Active Exam Cockpit", "smc.html", "html"),
    ("4. Sovereign Telemetry & SudaPass Engine", r"google_apps_script\Code.gs", "javascript")
]

with open(os.path.join(base_dir, "GemIInI_Sovereign_Code_System.md"), "w", encoding="utf-8") as out:
    out.write("""# GemIInI Sovereign Platform & SudaGene Consortium
**Full System Architecture & Source Code Export**
**Release:** v2.0 (August 2026) | **Status:** DEPLOYMENT READY 🚀

> [!IMPORTANT]
> **Strategic Capability**
> We are one of the premier sovereign entities in Sudan offering advanced clinical evaluation in **Infectious Diseases, Cellular Immunology, Microbiology, and Genomics**. This platform is a Sovereign Global Talent engine, translating basic science into the absolute standard of care.

---

This document encapsulates the core frontend and operational code system of the GemIInI Sovereign Platform. It includes the full, un-omitted source code for the Master Landing Page, the SudaPass Ledger verification interface, the Horizons React/JS Exam Cockpit (SMC Sprint), and the underlying Telemetry Backend API.

````carousel\n""")

    for i, (title, filename, lang) in enumerate(files_to_include):
        if i > 0:
            out.write("<!-- slide -->\n")
        out.write(f"## {title} (`{filename}`)\n")
        
        filepath = os.path.join(base_dir, filename)
        if os.path.exists(filepath):
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            out.write(f"```{lang}\n{content}\n```\n")
        else:
            out.write(f"Error: File {filename} not found.\n")
            
    out.write("````\n")
