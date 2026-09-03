import os
import zipfile

base_dir = r"G:\My Drive\GemIInI_Sovereign_Platform"
zip_path = os.path.join(base_dir, "GemIInI_Sovereign_Deployment.zip")

files_to_zip = [
    "index.html", "verify.html", "smc.html", "courses.html", 
    "universities.html", "bls.html", "alumni.html", "ideas.html", 
    "registry.html", ".htaccess"
]

dirs_to_zip = ["js", "data", "assets"]

with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for f in files_to_zip:
        f_path = os.path.join(base_dir, f)
        if os.path.exists(f_path):
            zipf.write(f_path, arcname=f)
            
    for d in dirs_to_zip:
        d_path = os.path.join(base_dir, d)
        if os.path.exists(d_path):
            for root, _, files in os.walk(d_path):
                for file in files:
                    file_path = os.path.join(root, file)
                    # Convert backslashes to forward slashes for Linux compatibility
                    arcname = os.path.relpath(file_path, base_dir).replace('\\', '/')
                    zipf.write(file_path, arcname=arcname)

print(f"Created {zip_path} with Linux-compatible paths.")
