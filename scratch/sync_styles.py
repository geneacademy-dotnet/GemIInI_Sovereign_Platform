import os, glob, shutil, zipfile

base_dir = r"g:\My Drive\GemIInI_Sovereign_Platform"
deploy_root = os.path.join(base_dir, "deploy_hostinger")

core_pages = [
    "index.html", "academic-solutions.html", "academic_solutions_ar.html",
    "bls.html", "courses.html", "institutions.html", "institutions_ar.html",
    "journal.html", "pedigree.html", "verify.html", "universities.html",
    "about.html", "start.html", "join.html", "training.html", "smc.html"
]

link_tag = '  <link rel="stylesheet" href="styles.css">\n</head>'

for p in core_pages:
    target = os.path.join(base_dir, p)
    if os.path.exists(target):
        with open(target, "r", encoding="utf-8") as fp:
            html = fp.read()
        if "styles.css" not in html and "</head>" in html:
            html = html.replace("</head>", link_tag)
            with open(target, "w", encoding="utf-8") as fp:
                fp.write(html)
            print("Injected in base:", p)
        shutil.copy2(target, os.path.join(deploy_root, p))

# Recompile zip
zip_path = os.path.join(base_dir, "geneacademy_release.zip")
desktop_path = r"C:\Users\moham\Desktop\geneacademy_release.zip"

with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(deploy_root):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, deploy_root).replace("\\", "/")
            zipf.write(full_path, rel_path)

shutil.copy2(zip_path, desktop_path)
print("ALL_CORE_PAGES_LINKED_TO_STYLES_CSS_AND_RECOMPILED_PERFECTLY")
