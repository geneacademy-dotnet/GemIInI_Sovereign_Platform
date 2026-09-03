import re

with open('universities.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update utility ribbon text
old_ribbon = """<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 font-bold text-[10px]">
          السجل الأكاديمي المعتمد
        </span>
        <span class="text-slate-300 font-semibold text-xs">الدليل الوطني لكليات الطب السودانية (63+ كلية)</span>"""

new_ribbon = """<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#168C8C]/20 text-teal-400 border border-teal-800 font-bold text-[10px]">
          دليل الكليات
        </span>
        <span class="text-slate-300 font-semibold text-xs">دليل كليات الطب السودانية (Sudanese Medical Faculties Directory)</span>"""

content = content.replace(old_ribbon, new_ribbon)

# 2. Update Hero section
hero_replacement = """  <!-- Hero Header -->
  <section class="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200 py-12 px-4 sm:px-8">
    <div class="max-w-4xl mx-auto text-center space-y-3">
      <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-mono text-sky-800 font-bold">
        <span>63+ CANONICAL SUDANESE MEDICAL FACULTIES</span>
      </div>
      <h1 class="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
        دليل كليات الطب السودانية
      </h1>
      <p class="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
        المرجع الأكاديمي الشامل لطلاب الشهادة السودانية والأطباء والمؤسسات الدولية للتعرف على كليات الطب، مناهجها، ومعدلات الأداء في المجلس الطبي السوداني.
      </p>
      
      <!-- Methodology Note -->
      <div class="mt-6 mx-auto max-w-3xl bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 text-xs leading-relaxed font-sans text-right" dir="rtl">
        <strong class="block mb-1">ملاحظة المنهجية (Methodology Note):</strong>
        هذا الدليل هو مصدر معلومات يتم صيانته بشكل مستقل. يتم تجميع حالة المؤسسة، والاعتماد، ومتطلبات القبول، وإحصائيات أداء الامتحانات من بيانات المجلس المتاحة للجمهور والمقاييس المؤسسية المُبلغ عنها ذاتياً. وهو ليس سجلاً تنظيمياً رسمياً.
        <br><br>
        <span dir="ltr" class="block text-left">
          This directory is an independently maintained informational resource. Institutional status, accreditation, admission requirements, and examination performance statistics are compiled from publicly available council data and self-reported institutional metrics. It is not an official regulatory record.
        </span>
      </div>
    </div>
  </section>"""
content = re.sub(r'<!-- Hero Header -->\s*<section.*?</section>', hero_replacement, content, flags=re.DOTALL)

# 3. Update footer subtext about registry
content = content.replace(
    '● بيانات السجل المركزي محدثة ومربوطة بـ SudaPass™',
    '● بيانات يتم صيانتها بشكل مستقل ومربوطة بـ SudaPass™'
)

with open('universities.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("universities.html updated successfully.")
