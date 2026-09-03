import os, re, shutil, zipfile

workspace = r'g:\My Drive\GemIInI_Sovereign_Platform'
deploy_dir = r'g:\My Drive\GemIInI_Sovereign_Platform\deploy_hostinger'

target_files = [
    'index.html', 'about.html', 'courses.html', 'bls.html', 
    'join.html', 'teachers.html', 'partnerships.html', 
    'universities.html', 'verify.html', 'smc.html', 'journal.html'
]

unifying_css = """
<style id="unified-sovereign-typography">
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@500;600;700&family=Outfit:wght@500;700;900&display=swap');
  
  body {
    font-family: 'Cairo', system-ui, -apple-system, sans-serif !important;
    background-color: #F8FAFC !important;
    color: #0F172A !important;
    -webkit-font-smoothing: antialiased;
  }
  
  /* High-Contrast, Crystal-Clear Explanatory Typography */
  p, .explanatory-text, .text-slate-500, .text-slate-600 {
    color: #334155 !important;
    font-weight: 500;
    line-height: 1.68 !important;
  }
  
  .editorial-serif {
    font-family: 'Cairo', system-ui, -apple-system, sans-serif !important;
    font-size: 1.05rem !important;
    font-weight: 500 !important;
    color: #1E293B !important;
    line-height: 1.75 !important;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Cairo', system-ui, -apple-system, sans-serif !important;
    color: #0F172A !important;
    letter-spacing: -0.01em;
  }

  .mono-code, .font-mono {
    font-family: 'IBM Plex Mono', monospace !important;
    font-weight: 600 !important;
  }
</style>
"""

for fname in target_files:
    fpath = os.path.join(workspace, fname)
    if not os.path.exists(fpath):
        continue
    
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove old unified tag if exists
    content = re.sub(r'<style id="unified-sovereign-typography">.*?</style>', '', content, flags=re.DOTALL)
    
    # Inject unifying CSS before </head>
    if '</head>' in content:
        content = content.replace('</head>', unifying_css + '\n</head>')
    
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    # Copy to deploy_hostinger
    dest_path = os.path.join(deploy_dir, fname)
    shutil.copy2(fpath, dest_path)

# Rebuild release zip
zip_path = r'g:\My Drive\GemIInI_Sovereign_Platform\geneacademy_release.zip'
desktop_path = r'C:\Users\moham\Desktop\geneacademy_release.zip'

with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(deploy_dir):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, deploy_dir).replace('\\', '/')
            zipf.write(full_path, rel_path)

shutil.copy2(zip_path, desktop_path)
print('ALL_PAGES_UNIFIED_AND_RELEASE_ZIP_PACKAGED_SUCCESSFULLY')
