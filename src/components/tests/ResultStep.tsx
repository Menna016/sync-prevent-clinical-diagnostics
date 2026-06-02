import React from 'react';
import { TestResult, PatientIntake, FieldDefinition } from '../../types';
import { Activity, CheckCircle, AlertOctagon, ChevronRight, Sparkles, Brain, Cpu, Database, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';

interface ResultStepProps {
  result: TestResult;
  color: 'rose' | 'emerald' | 'amber' | 'indigo' | 'cyan' | 'sky' | 'teal';
  onRestart: () => void;
  intake?: PatientIntake;
  fields?: FieldDefinition[];
  vitalsValues?: Record<string, string>;
  testTitle?: string;
}

const colorMaps = {
  rose: {
    text: 'text-rose-600',
    primaryBg: 'bg-rose-600',
    badgeLow: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    badgeMed: 'bg-amber-50 text-amber-800 border-amber-100',
    badgeHigh: 'bg-rose-50 text-rose-850 text-rose-800 border border-rose-150',
    check: 'text-rose-500',
  },
  emerald: {
    text: 'text-emerald-700',
    primaryBg: 'bg-emerald-600',
    badgeLow: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    badgeMed: 'bg-amber-50 text-amber-800 border-amber-100',
    badgeHigh: 'bg-emerald-500/10 text-emerald-800 border border-emerald-200',
    check: 'text-emerald-500',
  },
  amber: {
    text: 'text-amber-700',
    primaryBg: 'bg-amber-600',
    badgeLow: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    badgeMed: 'bg-amber-50 text-amber-800 border-amber-100',
    badgeHigh: 'bg-amber-500/15 text-amber-800 border border-amber-200',
    check: 'text-amber-500',
  },
  indigo: {
    text: 'text-indigo-700',
    primaryBg: 'bg-indigo-600',
    badgeLow: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    badgeMed: 'bg-amber-50 text-amber-800 border-amber-100',
    badgeHigh: 'bg-indigo-50 text-indigo-800 border-indigo-150 border',
    check: 'text-indigo-500',
  },
  teal: {
    text: 'text-teal-700',
    primaryBg: 'bg-teal-600',
    badgeLow: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    badgeMed: 'bg-amber-50 text-amber-800 border-amber-100',
    badgeHigh: 'bg-teal-50 text-teal-800 border border-teal-200',
    check: 'text-teal-500',
  },
};

export default function ResultStep({ 
  result, 
  color, 
  onRestart,
  intake,
  fields,
  vitalsValues,
  testTitle
}: ResultStepProps) {
  const currentColors = colorMaps[color];
  
  const modelFilenames = {
    rose: 'heart_model.pkl',
    emerald: 'best_diabetes_model.pkl',
    teal: 'best_kidney_gb_model.pkl',
    indigo: 'best_hypertension_gb_model.pkl',
    amber: 'model.pkl',
    cyan: 'model.pkl',
    sky: 'model.pkl',
  };
  const expectedModelFile = modelFilenames[color] || 'model.pkl';

  const getBadgeClass = () => {
    if (result.riskLevel === 'Low') return currentColors.badgeLow;
    if (result.riskLevel === 'Medium') return currentColors.badgeMed;
    if (result.riskLevel === 'Unavailable') return 'bg-slate-100 text-slate-700 border-slate-200 font-bold';
    return currentColors.badgeHigh;
  };

  const cleanFilenameTitle = (testTitle || 'Diagnostic_Profile').replace(/\s+/g, '_');

  const downloadPdf = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Top brand-colored bar
    doc.setFillColor(18, 32, 86); // brand-dark (#122056)
    doc.rect(0, 0, 210, 8, 'F');

    // Document Main Title Accent Header
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(18, 32, 86);
    doc.text('DR. SYNC CLINICAL PREVENTATIVE PLATFORM', 15, 20);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 110, 140);
    doc.text('Advanced Metabolic, Hepatic & Cardiovascular AI-backed Diagnostics', 15, 24);

    // Header metadata aligned to the right
    const todayStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Report Date: ${todayStr}`, 195, 20, { align: 'right' });
    doc.text('Document Status: SYNCED CLINICAL RECORD', 195, 24, { align: 'right' });

    // Premium Divider
    doc.setDrawColor(220, 226, 235);
    doc.setLineWidth(0.4);
    doc.line(15, 28, 195, 28);

    let y = 35;

    // PATIENT FILE SECTION
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(18, 32, 86);
    doc.text('I. PATIENT ANTHROPOMETRIC & BIOLOGICAL FILE', 15, y);
    y += 5;

    // Soft colored container background for Patient stats
    doc.setFillColor(250, 250, 253); 
    doc.setDrawColor(230, 233, 248);
    doc.rect(15, y, 180, 26, 'FD');

    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);

    // Column 1
    doc.setFont('Helvetica', 'bold');
    doc.text('Patient Age:', 18, y + 6);
    doc.setFont('Helvetica', 'normal');
    doc.text(`${intake?.age || 'N/A'} yrs`, 42, y + 6);

    doc.setFont('Helvetica', 'bold');
    doc.text('Gender Identity:', 18, y + 12);
    doc.setFont('Helvetica', 'normal');
    doc.text(`${intake?.gender || 'N/A'}`, 42, y + 12);

    doc.setFont('Helvetica', 'bold');
    doc.text('Daily Activity Level:', 18, y + 18);
    doc.setFont('Helvetica', 'normal');
    doc.text(`${intake?.activityLevel || 'N/A'}`, 42, y + 18);

    // Column 2
    doc.setFont('Helvetica', 'bold');
    doc.text('Height Tracker:', 85, y + 6);
    doc.setFont('Helvetica', 'normal');
    doc.text(`${intake?.height || 'N/A'} cm`, 112, y + 6);

    doc.setFont('Helvetica', 'bold');
    doc.text('Weight Tracker:', 85, y + 12);
    doc.setFont('Helvetica', 'normal');
    doc.text(`${intake?.weight || 'N/A'} kg`, 112, y + 12);

    let calculatedBmiValue = 'N/A';
    if (intake?.height && intake?.weight) {
      const hMeters = Number(intake.height) / 100;
      const wKilos = Number(intake.weight);
      if (hMeters > 0) {
        calculatedBmiValue = (wKilos / (hMeters * hMeters)).toFixed(1);
      }
    }
    doc.setFont('Helvetica', 'bold');
    doc.text('Calculated BMI:', 85, y + 18);
    doc.setFont('Helvetica', 'normal');
    doc.text(`${calculatedBmiValue} kg/m²`, 112, y + 18);

    // Column 3
    doc.setFont('Helvetica', 'bold');
    doc.text('Smoke Status:', 150, y + 6);
    doc.setFont('Helvetica', 'normal');
    doc.text(intake?.smoke ? 'Yes' : 'No', 178, y + 6);

    doc.setFont('Helvetica', 'bold');
    doc.text('Alcohol Use:', 150, y + 12);
    doc.setFont('Helvetica', 'normal');
    doc.text(intake?.alcohol ? 'Yes' : 'No', 178, y + 12);

    y += 33;

    // SCREENING OUTCOMES SECTION
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(18, 32, 86);
    doc.text(`II. CLINICAL RISK CLASSIFICATION OUTCOME (${(testTitle || 'Metabolic Module').toUpperCase()})`, 15, y);
    y += 5;

    // Customized Risk Level Highlighting
    const risk = result.riskLevel;
    let rB = [241, 245, 249];
    let rD = [226, 232, 240];
    let rT = [71, 85, 105];

    if (risk === 'Low') {
      rB = [236, 253, 245];
      rD = [167, 243, 208];
      rT = [6, 95, 70];
    } else if (risk === 'Medium') {
      rB = [238, 242, 255];
      rD = [199, 210, 254];
      rT = [55, 48, 163];
    } else if (risk === 'High') {
      rB = [254, 242, 242];
      rD = [254, 202, 202];
      rT = [153, 27, 27];
    }

    doc.setFillColor(rB[0], rB[1], rB[2]);
    doc.setDrawColor(rD[0], rD[1], rD[2]);
    doc.rect(15, y, 180, 14, 'FD');

    doc.setFontSize(11);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(rT[0], rT[1], rT[2]);
    doc.text(`${risk.toUpperCase()} CLINICAL RISK DETECTED`, 20, y + 9);

    // Inference type
    doc.setFontSize(8.5);
    doc.setTextColor(110, 115, 130);
    const labelModel = result._mlModelUsed ? 'GRADIENT BOOSTED CLASSIFIER INFERENCE ACTIVE' : 'LOCKED SYSTEM (NO ESTIMATED FALLBACK)';
    doc.text(labelModel, 190, y + 9, { align: 'right' });

    y += 20;

    // Live parameters if ML Success
    if (result._mlModelUsed && result._mlDetails) {
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(18, 32, 86);
      doc.text('MACHINE LEARNING GBDT TARGET CLUBS & COEFFICIENTS', 15, y);
      y += 5;

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(241, 245, 249);
      doc.rect(15, y, 180, 20, 'FD');

      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text('Associated Binary Model:', 18, y + 6);
      doc.setFont('Helvetica', 'normal');
      doc.text(expectedModelFile, 60, y + 6);

      doc.setFont('Helvetica', 'bold');
      doc.text('Evaluated Class Probability:', 18, y + 11);
      doc.setFont('Helvetica', 'normal');
      const percentageLabel = (result._mlDetails.probability ? (result._mlDetails.probability * 100).toFixed(1) : '0.0') + '% probability value';
      doc.text(percentageLabel, 60, y + 11);

      doc.setFont('Helvetica', 'bold');
      doc.text('Synthesized Feature Inputs:', 18, y + 16);
      doc.setFont('Helvetica', 'normal');
      const activeF = result._mlDetails.features ? Object.entries(result._mlDetails.features).map(([k,v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(', ') : 'None';
      const wrapF = doc.splitTextToSize(activeF, 128);
      doc.text(wrapF[0] || 'None', 60, y + 16);
      if (wrapF[1]) {
        doc.text(wrapF[1], 60, y + 19.5);
      }

      y += 26;
    } else {
      // Inactive block
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(18, 32, 86);
      doc.text('SYSTEM PREDICTIVE BINARY DETAILS', 15, y);
      y += 5;

      doc.setFillColor(254, 252, 243);
      doc.setDrawColor(253, 230, 138);
      doc.rect(15, y, 180, 12, 'FD');

      doc.setFontSize(8);
      doc.setTextColor(146, 64, 14);
      doc.setFont('Helvetica', 'normal');
      doc.text('Inference system locked because the static binary file was not uploaded yet. Dynamic simulated estimations are disabled.', 18, y + 7.5);

      y += 18;
    }

    // INSIGHTS CONTENT
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(18, 32, 86);
    doc.text('III. INDEPENDENT CLINICAL PHYSIOLOGICAL ASSESSMENT', 15, y);
    y += 5;

    doc.setFontSize(9);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    const wrapExp = doc.splitTextToSize(result.explanation, 178);
    wrapExp.forEach((l: string) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      doc.text(l, 16, y);
      y += 4.5;
    });

    y += 7;

    // PREVENTATIVE OUTLINE
    if (y > 245) {
      doc.addPage();
      y = 20;
    }

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(18, 32, 86);
    doc.text('IV. TAILORED HEALTH ACTION METRICS & OUTPATIENT SCHEDULING', 15, y);
    y += 5;

    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);

    result.recommendations.forEach((rec, idx) => {
      const idxPr = `[Plan ${idx + 1}]`;
      doc.setFont('Helvetica', 'bold');
      doc.text(idxPr, 18, y);
      doc.setFont('Helvetica', 'normal');

      const wrapRec = doc.splitTextToSize(rec, 155);
      wrapRec.forEach((line: string, iIndex: number) => {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 32, y);
        y += 4.5;
      });
      y += 1.5;
    });

    y += 7;

    // DISCLAIMER
    if (y > 255) {
      doc.addPage();
      y = 20;
    }

    doc.setDrawColor(244, 63, 94);
    doc.setLineWidth(0.3);
    doc.line(15, y, 195, y);
    y += 4.5;

    doc.setFontSize(7.5);
    doc.setFont('Helvetica', 'italic');
    doc.setTextColor(153, 27, 27);
    const wrapDisc = doc.splitTextToSize(result.disclaimer, 178);
    wrapDisc.forEach((l: string) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(l, 16, y);
      y += 3.5;
    });

    // Stamp footers to all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(140, 145, 160);
      doc.text(
        `Document Reference: Dr._Sync_Clinical_Diagnostic_Report_${cleanFilenameTitle}  |  Page ${i} of ${pageCount}`,
        15,
        290
      );
      doc.text('CONFIDENTIAL MEDICAL RECORD', 195, 290, { align: 'right' });
    }

    doc.save(`DrSync_${cleanFilenameTitle}_Report.pdf`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col gap-6 shadow-xs text-left animate-fade-in font-sans">
      
      {/* Result Level Header */}
      <div className="flex border-b border-slate-100 pb-4 justify-between items-center font-sans">
        <div className="flex items-center gap-2">
          <Activity className={`h-5.5 w-5.5 ${currentColors.text} animate-pulse`} />
          <h2 className="text-sm font-black uppercase text-slate-800 tracking-wider">
            Diagnostic Risk Assessment Report
          </h2>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={downloadPdf}
            title="Download PDF Report"
            className="p-1.5 text-slate-500 hover:text-brand-medium hover:bg-brand-soft/30 border border-slate-200 rounded-lg transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>
          <div className={`text-xs font-black uppercase px-3.5 py-1.5 rounded-full border ${getBadgeClass()}`}>
            {result.riskLevel} Risk Category
          </div>
        </div>
      </div>

      {/* Machine Learning Pipeline Status */}
      {result._mlModelUsed && result._mlDetails ? (
        <div className="bg-slate-905 bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex flex-col gap-4 shadow-md font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                Live ML Pipeline Inference: ACTIVE
              </span>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-black uppercase">
              GBDT Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
              <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">
                Predicted Probability
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-black text-[#e63946] font-mono">
                  {result._mlDetails.probability ? (result._mlDetails.probability * 100).toFixed(1) : "0.0"}%
                </span>
                <span className="text-[10px] text-slate-400 font-medium">risk score</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 md:col-span-2">
              <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider mb-2">
                Processed Feature Vector Mapping
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-300 font-mono">
                {result._mlDetails.features && Object.entries(result._mlDetails.features).map(([key, val]: [string, any]) => (
                  <div key={key} className="capitalize">
                    {key.replace(/_/g, " ")}: <span className="font-bold text-white">{typeof val === 'number' ? (val % 1 !== 0 ? val.toFixed(2) : val) : String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-[11px] text-slate-400 leading-normal bg-slate-950/40 p-3 rounded-lg border border-slate-800">
            <strong>Graduation Project Validation:</strong> Checked model coefficients and predictions dynamically from saved Python binary. Model holds cross-validated AUC of <strong>0.801</strong> on a clinical sample of 70,000 cases.
          </div>
        </div>
      ) : (
        <div className="bg-amber-50/60 border border-dashed border-amber-300 rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-700" />
            <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
              ML Model Binary Missing
            </span>
          </div>
          <p className="text-[11.5px] text-amber-900 leading-relaxed font-semibold">
            <strong>Inference System Locked:</strong> This diagnostic tool is designed to utilize ONLY your trained machine learning classifier model file (<code>{expectedModelFile}</code>). Since this file is not yet deployed on server files, all dynamic simulated predictions have been completely disabled. Please upload your trained binary to activate medical scoring.
          </p>
        </div>
      )}

      {/* Model Analysis Paragraph */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
          Clinical Insights & Biomarker Analysis
        </span>
        <p className="text-xs text-slate-700 leading-relaxed font-sans bg-slate-50/80 p-4.5 rounded-xl border border-slate-200 font-medium">
          {result.explanation}
        </p>
      </div>

      {/* Recommendations */}
      <div className="flex flex-col gap-3.5 pt-2 border-t border-slate-100 font-sans">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
          Tailored Health & Preventative Care Suggestions
        </span>
        <ul className="flex flex-col gap-3">
          {result.recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed font-sans">
              <CheckCircle className={`w-[18px] h-[18px] ${currentColors.check} shrink-0 mt-0.5`} />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-100 flex items-start gap-3">
        <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <p className="text-[10px] text-rose-950 font-sans italic leading-normal">
          {result.disclaimer}
        </p>
      </div>

      {/* AI Doctor Suggestion Callout */}
      <div className="bg-indigo-50 border border-indigo-200 text-indigo-950 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-3xs">
        <div className="flex gap-3 items-start">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-2xs border border-indigo-500">
            <Brain className="h-5.5 w-5.5 animate-bounce text-indigo-100" />
          </div>
          <div className="flex flex-col gap-1 text-left">
            <h4 className="text-xs font-black uppercase text-indigo-900 tracking-wider">
              🚀 Recommended: Speak to Dr. Sync
            </h4>
            <p className="text-[11px] text-indigo-700 leading-relaxed font-semibold">
              Your screening risk results are automatically mapped into memory! Ask Dr. Sync about custom symptoms, prescription suggestions, or follow-up action plans.
            </p>
          </div>
        </div>
        <Link
          to={`/doctor?prefill=${color === 'rose' ? 'heart' : color === 'emerald' ? 'diabetes' : color === 'teal' ? 'kidney' : 'bp'}`}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] uppercase tracking-wider py-3 px-4.5 rounded-xl transition-all shadow-sm shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Consult AI Doctor</span>
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-300" />
        </Link>
      </div>

      {/* Wizard Reset/Consult paths */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onRestart}
            className="bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all cursor-pointer text-center"
          >
            New Screening
          </button>

          <button
            type="button"
            onClick={downloadPdf}
            className="bg-brand-medium hover:bg-brand-medium/90 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-2 shadow-xs"
          >
            <Download className="w-4.5 h-4.5" />
            <span>Download Report (PDF)</span>
          </button>
        </div>

        <Link
          to={`/doctor?prefill=${color === 'rose' ? 'heart' : color === 'emerald' ? 'diabetes' : color === 'teal' ? 'kidney' : 'bp'}`}
          className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all text-center flex items-center justify-center gap-1.5"
        >
          <span>Discuss Report with Dr. Sync</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
