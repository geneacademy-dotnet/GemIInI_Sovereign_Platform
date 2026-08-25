/**
 * src/components/MtcSimulationRunner.jsx
 * Interactive 3-Step Clinical Simulation Engine (MTC-CARDIO-101)
 * Generates Real Diagnostic Telemetry and Dispatches to Sovereign Backend
 */

import React, { useState } from 'react';
import { useLang } from '@/i18n/LanguageContext';
import { SovereignClient } from '@/services/sovereignService';
import { Activity, Stethoscope, HeartPulse, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Award, RefreshCw, Lock, Unlock } from 'lucide-react';

const SIMULATION_CASE = {
  id: 'MTC-CARDIO-101',
  title: 'Acute Coronary Syndrome & Anterior STEMI Triage',
  title_ar: 'متلازمة الشريان التاجي الحادة وطوارئ الاحتشاء القلبي الأمامي (STEMI)',
  track: 'Internal Medicine & Critical Care (SMC-101)',
  difficulty: 'High-Yield Board Standard',
  vignette: {
    en: 'A 58-year-old diabetic male presents to the Emergency Department with crushing retrosternal chest pain radiating to his left jaw and diaphoresis for the past 90 minutes. BP is 85/50 mmHg, HR 112 bpm, SpO2 93% on room air. 12-lead ECG reveals 4mm ST-segment elevation in leads V2-V5 with reciprocal ST depressions in II, III, and aVF.',
    ar: 'مريض يبلغ من العمر 58 عاماً مصاب بالسكري، حضر إلى قسم الطوارئ وهو يعاني من ألم ضاغط خلف القص يمتد للفك الأيسر مع تعرق شديد مستمر منذ 90 دقيقة. الضغط 85/50 ملم زئبق، النبض 112/دقيقة، والأكسجين 93%. تخطيط القلب يوضح ارتفاعاً في قطعة ST بمقدار 4 ملم في V2-V5 مع هبوط تبادلي في II, III, aVF.'
  },
  steps: [
    {
      stepNumber: 1,
      title: 'Step 1: Mechanism & Diagnostic Triangulation',
      title_ar: 'الخطوة ١: التحليل الفيزيولوجي والتشخيصي الدقيق',
      question: {
        en: 'Based on the clinical presentation and ECG findings, which culprit coronary vessel is acutely occluded, and what is the immediate hemodynamic classification?',
        ar: 'بناءً على التخطيط والحالة السريرية، ما هو الشريان التاجي المسدود وما هو التصنيف الهيموديناميكي الفوري؟'
      },
      options: [
        { id: 'A', text: { en: 'Left Anterior Descending (LAD) Artery • Cardiogenic Shock (Killip IV)', ar: 'الشريان التاجي الأمامي النازل (LAD) • صدمة قلبية (Killip IV)' }, correct: true },
        { id: 'B', text: { en: 'Right Coronary Artery (RCA) • Pure Right Ventricular Infarction', ar: 'الشريان التاجي الأيمن (RCA) • احتشاء البطين الأيمن النقي' }, correct: false },
        { id: 'C', text: { en: 'Left Circumflex (LCx) • Uncomplicated Inferolateral STEMI', ar: 'الشريان المنعطف الأيسر (LCx) • احتشاء جانبي غير معقد' }, correct: false },
        { id: 'D', text: { en: 'Posterior Descending Artery • Decompensated Cor Pulmonale', ar: 'الشريان الخلفي النازل • فشل قلبي رئوي حاد' }, correct: false }
      ],
      explanation: {
        en: 'ST elevation in leads V2-V5 localizes to the anterior/septal wall supplied by the LAD. Hypotension (85/50) and tachycardia in STEMI indicate impending cardiogenic shock (Killip Class IV).',
        ar: 'ارتفاع ST في V2-V5 يؤكد انسداد الشريان التاجي الأمامي النازل (LAD). انخفاض الضغط (85/50) وتسرع النبض يمثلان صدمة قلبية وشيكة (Killip IV).'
      }
    },
    {
      stepNumber: 2,
      title: 'Step 2: Emergency Medical Stabilization (Pharmacology)',
      title_ar: 'الخطوة ٢: الاستقرار الدوائي الطارئ وبروتوكول مضادات التخثر',
      question: {
        en: 'Which emergency antiplatelet and antithrombotic regimen must be administered IMMEDIATELY, and what drug is strictly CONTRAINDICATED in this hypotensive patient?',
        ar: 'ما هو البروتوكول الدوائي العاجل الواجب إعطاؤه فوراً، وما هو الدواء الممنوع تماماً في هذا المريض المنخفض الضغط؟'
      },
      options: [
        { id: 'A', text: { en: 'Give Nitrates + Beta-blocker IV; withhold Aspirin until labs return', ar: 'إعطاء النترات وحاصرات بيتا وريدياً، وتأجيل الأسبرين' }, correct: false },
        { id: 'B', text: { en: 'Aspirin 300mg chewed + Ticagrelor 180mg + UFH bolus; Sublingual Nitrates strictly CONTRAINDICATED due to SBP < 90 mmHg', ar: 'أسبرين 300 مجم مضغاً + تيكاجريلور 180 مجم + هيبارين؛ مع حظر النترات لانخفاض الضغط الانقباضي < 90' }, correct: true },
        { id: 'C', text: { en: 'High-dose sublingual Nitroglycerin with loop diuretics bolus', ar: 'إعطاء جرعات عالية من النيتروجليسرين ومدرات البول' }, correct: false },
        { id: 'D', text: { en: 'Morphine 10mg IV alone and observe in triage for 4 hours', ar: 'المورفين 10 مجم وريدياً مع الملاحظة لمدة 4 ساعات' }, correct: false }
      ],
      explanation: {
        en: 'Dual Antiplatelet Therapy (DAPT: Aspirin 300mg + Ticagrelor 180mg) and Unfractionated Heparin are mandatory. Sublingual Nitrates and Beta-blockers are contraindicated in marked hypotension (SBP < 90 mmHg) to avoid profound hemodynamic collapse.',
        ar: 'العلاج المزدوج بمضادات الصفائح (أسبرين 300 مجم + تيكاجريلور 180 مجم) والهيبارين إلزامي. النترات وحاصرات بيتا ممنوعة منعاً باتاً عند هبوط الضغط الانقباضي < 90 ملم زئبق.'
      }
    },
    {
      stepNumber: 3,
      title: 'Step 3: Definitive Revascularization Protocol',
      title_ar: 'الخطوة ٣: مسار إعادة التروية التاجية التداخلية (PCI)',
      question: {
        en: 'The hospital has a 24/7 catheterization laboratory available on-site. What is the gold-standard reperfusion mandate and target time window?',
        ar: 'تتوفر في المستشفى غرفة قسطرة على مدار 24 ساعة. ما هو بروتوكول إعادة التروية المعياري والنافذة الزمنية المستهدفة؟'
      },
      options: [
        { id: 'A', text: { en: 'Primary Percutaneous Coronary Intervention (PPCI) with Door-to-Balloon time < 90 minutes', ar: 'القسطرة القلبية التداخلية الطارئة (PPCI) بزمن انتقال للبالون < 90 دقيقة' }, correct: true },
        { id: 'B', text: { en: 'Immediate IV Tenecteplase thrombolysis followed by elective angiography after 72 hours', ar: 'إعطاء مذيبات التخثر وريدياً ثم قسطرة اختيارية بعد 72 ساعة' }, correct: false },
        { id: 'C', text: { en: 'Conservative medical therapy with serial troponin draws every 8 hours', ar: 'علاج تحفظي مع مراقبة إنزيمات القلب كل 8 ساعات' }, correct: false },
        { id: 'D', text: { en: 'Emergent Coronary Artery Bypass Grafting (CABG) before any diagnostic angiography', ar: 'جراحة قلب مفتوح طارئة دون إجراء تصوير قسطرة' }, correct: false }
      ],
      explanation: {
        en: 'Primary PCI is the undisputed gold standard when available with a door-to-balloon time < 90 minutes. Fibrinolysis is reserved only when PCI transfer exceeds 120 minutes.',
        ar: 'القسطرة التداخلية الأولية (PPCI) هي المعيار الذهبي المطلق بزمن انتقال للبالون أقل من 90 دقيقة.'
      }
    }
  ]
};

export default function MtcSimulationRunner({ candidateGaId = 'GA-3521', onComplete }) {
  const { lang, isRtl } = useLang();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [telemetryResult, setTelemetryResult] = useState(null);

  const step = SIMULATION_CASE.steps[currentStepIndex];
  const isLastStep = currentStepIndex === SIMULATION_CASE.steps.length - 1;

  const handleSelectOption = (optionId) => {
    if (submitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentStepIndex]: optionId
    });
  };

  const handleNext = () => {
    if (currentStepIndex < SIMULATION_CASE.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleFinishSimulation = async () => {
    let correctCount = 0;
    SIMULATION_CASE.steps.forEach((st, idx) => {
      const correctOpt = st.options.find(o => o.correct);
      if (selectedAnswers[idx] === correctOpt.id) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / SIMULATION_CASE.steps.length) * 100);
    const passed = scorePercentage >= 70;
    const awardedGp = passed ? 10 : 2;

    setSubmitted(true);
    setIsSubmitting(true);

    try {
      // Dispatch real telemetry to backend under LockService
      const payload = {
        action: 'log_telemetry',
        ga_id: candidateGaId,
        module_id: SIMULATION_CASE.id,
        score: scorePercentage,
        passed: passed
      };

      const res = await SovereignClient.register(payload); // Dispatches POST to Code.gs
      setTelemetryResult({
        score: scorePercentage,
        passed,
        awardedGp,
        level2Unlocked: passed
      });

      if (onComplete) {
        onComplete({
          score: scorePercentage,
          passed,
          awardedGp,
          level2Unlocked: passed
        });
      }
    } catch (err) {
      console.warn('[MTC Simulation] Telemetry offline fallback:', err);
      setTelemetryResult({
        score: scorePercentage,
        passed,
        awardedGp,
        level2Unlocked: passed
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentStepIndex(0);
    setSubmitted(false);
    setTelemetryResult(null);
  };

  return (
    <div className="w-full bg-[#04080F] border border-slate-800 rounded-2xl p-6 sm:p-8 text-slate-100 shadow-2xl relative overflow-hidden font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Case Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs font-bold rounded-md">
              {SIMULATION_CASE.id}
            </span>
            <span className="px-2 py-0.5 bg-teal-500/10 text-teal-300 text-xs font-semibold rounded-md border border-teal-500/30">
              {SIMULATION_CASE.track}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {isRtl ? SIMULATION_CASE.title_ar : SIMULATION_CASE.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
            {isRtl ? `الخطوة ${currentStepIndex + 1} من 3` : `Step ${currentStepIndex + 1} of 3`}
          </div>
        </div>
      </div>

      {/* Clinical Vignette */}
      <div className="bg-[#0A0F1D] border border-slate-800 rounded-xl p-4 sm:p-5 mb-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs mb-2">
          <Activity className="w-4 h-4" />
          <span>{isRtl ? 'الحالة السريرية والمؤشرات الحيوية' : 'Clinical Presentation & Vitals'}</span>
        </div>
        <p>{isRtl ? SIMULATION_CASE.vignette.ar : SIMULATION_CASE.vignette.en}</p>
      </div>

      {/* Active Question Step */}
      <div className="space-y-4 mb-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/50 text-teal-300 text-xs flex items-center justify-center font-mono">
            {step.stepNumber}
          </span>
          <span>{isRtl ? step.title_ar : step.title}</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 font-medium">
          {isRtl ? step.question.ar : step.question.en}
        </p>

        {/* Options List */}
        <div className="space-y-2.5 pt-2">
          {step.options.map((opt) => {
            const isSelected = selectedAnswers[currentStepIndex] === opt.id;
            const showCorrect = submitted && opt.correct;
            const showWrong = submitted && isSelected && !opt.correct;

            return (
              <button
                key={opt.id}
                type="button"
                disabled={submitted}
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full text-start p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${
                  showCorrect
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-200'
                    : showWrong
                    ? 'bg-rose-500/15 border-rose-500 text-rose-200'
                    : isSelected
                    ? 'bg-[#00F2FE]/10 border-[#00F2FE] text-white shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs flex-shrink-0 font-bold ${
                  isSelected ? 'bg-[#00F2FE] text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {opt.id}
                </span>
                <span className="leading-snug pt-0.5">{isRtl ? opt.text.ar : opt.text.en}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation on Submission */}
        {submitted && (
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-300 mt-4 animate-in fade-in">
            <p className="font-bold text-teal-400 mb-1">{isRtl ? 'التعليل السريري المعتمد:' : 'Clinical Rationale:'}</p>
            <p>{isRtl ? step.explanation.ar : step.explanation.en}</p>
          </div>
        )}
      </div>

      {/* Results Banner when Finished */}
      {submitted && telemetryResult && (
        <div className="bg-gradient-to-r from-[#0A0F1D] to-slate-900 border border-[#B48028]/40 rounded-xl p-5 mb-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-xl border ${
              telemetryResult.passed ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400' : 'bg-amber-500/15 border-amber-500 text-amber-400'
            }`}>
              {telemetryResult.passed ? <CheckCircle2 className="w-7 h-7" /> : <AlertCircle className="w-7 h-7" />}
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                {isRtl ? 'نتيجة تقييم المحاكاة السريرية' : 'Simulation Audit Verdict'}
              </p>
              <h4 className="text-lg font-bold text-white">
                {telemetryResult.score}% {isRtl ? 'دقة التشخيص' : 'Diagnostic Accuracy'} • +{telemetryResult.awardedGp} GP
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {telemetryResult.level2Unlocked ? (
              <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-lg flex items-center gap-1.5 font-mono">
                <Unlock className="w-3.5 h-3.5" />
                <span>Level 2 Unlocked (40Q)</span>
              </span>
            ) : (
              <span className="px-3 py-1.5 bg-slate-800 text-slate-400 text-xs rounded-lg flex items-center gap-1 font-mono">
                <Lock className="w-3.5 h-3.5" />
                <span>Score ≥70% to Unlock Level 2</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              title="Retry Case"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          type="button"
          disabled={currentStepIndex === 0}
          onClick={handlePrev}
          className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1.5"
        >
          {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
          <span>{isRtl ? 'السابق' : 'Previous'}</span>
        </button>

        {!submitted ? (
          isLastStep ? (
            <button
              type="button"
              disabled={Object.keys(selectedAnswers).length < SIMULATION_CASE.steps.length || isSubmitting}
              onClick={handleFinishSimulation}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-40 transition-all flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>{isRtl ? 'اعتماد التقييم وحفظ التيليميتري (+10 GP)' : 'Submit Audit & Log Telemetry (+10 GP)'}</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={!selectedAnswers[currentStepIndex]}
              onClick={handleNext}
              className="px-5 py-2.5 bg-[#00F2FE] hover:bg-[#00D2DE] text-slate-950 font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(0,242,254,0.3)] disabled:opacity-40 transition-all flex items-center gap-1.5"
            >
              <span>{isRtl ? 'التالي' : 'Next Step'}</span>
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          )
        ) : (
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-colors"
          >
            {isRtl ? 'إعادة المحاكاة' : 'Restart Simulation'}
          </button>
        )}
      </div>
    </div>
  );
}
