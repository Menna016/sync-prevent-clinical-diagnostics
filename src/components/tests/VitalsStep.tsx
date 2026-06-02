import React, { useState } from 'react';
import { FieldDefinition } from '../../types';
import { Sliders, FileText, Upload, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface VitalsStepProps {
  fields: FieldDefinition[];
  vitalsValues: Record<string, string>;
  setVitalsValues: (vals: Record<string, string>) => void;
  vitalsSources: Record<string, 'user' | 'ocr' | 'default'>;
  setVitalsSources: (srcs: Record<string, 'user' | 'ocr' | 'default'>) => void;
  color: 'rose' | 'emerald' | 'amber' | 'indigo' | 'cyan' | 'sky' | 'teal';
  onNext: () => void;
  onBack: () => void;
}

const colorMaps = {
  rose: {
    btn: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-450',
    accentText: 'text-rose-600',
    accentBg: 'bg-rose-50',
    lightBorder: 'border-rose-100',
    focusRing: 'focus:border-rose-400 focus:ring-rose-400',
    badge: 'bg-rose-50 text-rose-700 border-rose-100',
  },
  emerald: {
    btn: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-450',
    accentText: 'text-emerald-600',
    accentBg: 'bg-emerald-50',
    lightBorder: 'border-emerald-100',
    focusRing: 'focus:border-emerald-400 focus:ring-emerald-400',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  amber: {
    btn: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-450',
    accentText: 'text-amber-600',
    accentBg: 'bg-amber-50',
    lightBorder: 'border-amber-100',
    focusRing: 'focus:border-amber-400 focus:ring-amber-400',
    badge: 'bg-amber-50 text-amber-700 border-amber-100',
  },
  indigo: {
    btn: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-450',
    accentText: 'text-indigo-600',
    accentBg: 'bg-indigo-50',
    lightBorder: 'border-indigo-100',
    focusRing: 'focus:border-indigo-400 focus:ring-indigo-400',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  },
  teal: {
    btn: 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-450',
    accentText: 'text-teal-600',
    accentBg: 'bg-teal-50',
    lightBorder: 'border-teal-100',
    focusRing: 'focus:border-teal-400 focus:ring-teal-400',
    badge: 'bg-teal-50 text-teal-700 border-teal-100',
  },
};

export default function VitalsStep({
  fields,
  vitalsValues,
  setVitalsValues,
  vitalsSources,
  setVitalsSources,
  color,
  onNext,
  onBack,
}: VitalsStepProps) {
  const currentColors = colorMaps[color];

  const expectedTests: Record<string, { name: string; description: string; code?: string }> = {
    rose: {
      name: "Cardiovascular Lipid Blood Panel with Fasting Glucose",
      description: "Includes LDL Cholesterol, Fasting Blood Glucose, and clinical blood pressure readings.",
      code: "LOINC: 55454-3 / CPT: 80061"
    },
    emerald: {
      name: "Hemoglobin A1c (HbA1c) Screening Test",
      description: "Combines glycated hemoglobin levels with general/physical health surveys.",
      code: "LOINC: 4548-4 / CPT: 83036"
    },
    teal: {
      name: "Comprehensive Metabolic Panel (CMP)",
      description: "Includes Serum Creatinine, Blood Urea Nitrogen (BUN), and glomerular filtration (eGFR).",
      code: "LOINC: 24320-4 / CPT: 80053"
    },
    indigo: {
      name: "Hemodynamic Vital Signs Panel",
      description: "Includes resting vital logs, measured blood pressure, and sleep/stress profiles.",
      code: "CPT: 99211 (Blood Pressure Profile)"
    }
  };

  const testDetails = expectedTests[color] || {
    name: "General Diagnostic Panel",
    description: "Contains relevant physiological, hematological, or metabolic tracking markers.",
    code: "General Panel"
  };

  // OCR visual states
  const [dragActive, setDragActive] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionMsg, setExtractionMsg] = useState('');
  const [ocrSuccessMsg, setOcrSuccessMsg] = useState<string | null>(null);
  const [ocrErrorMsg, setOcrErrorMsg] = useState<string | null>(null);

  // Handle Drag Events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processImageFile(e.target.files[0]);
    }
  };

  const processImageFile = async (file: File) => {
    setIsExtracting(true);
    setExtractionMsg('Connecting to CardioSync Vision Context...');
    setOcrSuccessMsg(null);
    setOcrErrorMsg(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        setExtractionMsg('Reading lab report biomarkers...');

        // Field keys to extract
        const keys = fields.map((f) => f.key);

        const response = await fetch('/api/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64Data,
            mimeType: file.type || 'image/jpeg',
            keys: keys,
          }),
        });

        if (!response.ok) {
          throw new Error('Biochem reading API did not respond successfully.');
        }

        const data = await response.json();

        // Update vitals fields and tracking
        const updatedVitals = { ...vitalsValues };
        const updatedSources = { ...vitalsSources };

        let anyExtracted = false;
        fields.forEach((f) => {
          if (data[f.key] !== undefined && data[f.key] !== '') {
            updatedVitals[f.key] = data[f.key].toString();
            updatedSources[f.key] = 'ocr';
            anyExtracted = true;
          }
        });

        if (anyExtracted) {
          setVitalsValues(updatedVitals);
          setVitalsSources(updatedSources);
          setOcrSuccessMsg('Lab print decoded successfully! Extracted metrics loaded.');
        } else {
          setOcrErrorMsg('We scanned the slip but did not detect the specific biomarks needed. Pleased enter values manually.');
        }
        setIsExtracting(false);
      };
    } catch (err: any) {
      console.error(err);
      setOcrErrorMsg('We failed to decode the report. Clinical mean imputation will handle empty parameters.');
      setIsExtracting(false);
    }
  };

  const handleChangeField = (key: string, value: string) => {
    setVitalsValues({
      ...vitalsValues,
      [key]: value,
    });
    setVitalsSources({
      ...vitalsSources,
      [key]: value ? 'user' : 'default',
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-left font-sans">
      <div className="bg-white rounded-2xl border border-slate-202 border-slate-200 p-5 md:p-6 shadow-xs">
        <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">
          Step 2 — Vitals & Diagnostics Selection
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Supply clinical features below. You can enter them{' '}
          <strong className={currentColors.accentText}>Manually (Option A)</strong>, or drop a lab biochemistry paper{' '}
          <strong className="text-indigo-600">via intelligent OCR (Option B)</strong> to pre-fill instantly. 
          Unsupplied fields will be automatically filled using standard cohort trial averages.
        </p>
      </div>

      {ocrSuccessMsg && (
        <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-xl border border-emerald-150 text-xs font-bold flex items-center gap-2 shadow-xs ring-4 ring-emerald-50">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{ocrSuccessMsg}</span>
        </div>
      )}

      {ocrErrorMsg && (
        <div className="bg-rose-50 text-rose-800 p-3.5 rounded-xl border border-rose-150 text-xs font-bold flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{ocrErrorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Option A: Manual Entry */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sliders className={`w-4.5 h-4.5 ${currentColors.accentText}`} />
            <h3 className="text-xs font-black uppercase text-slate-700 tracking-wide">
              Option A: Manual Vitals Fields
            </h3>
          </div>

          <div className="flex flex-col gap-4">
            {fields.map((field) => {
              const currentVal = vitalsValues[field.key] || '';
              const currentSrc = vitalsSources[field.key] || 'default';

              return (
                <div key={field.key} className="flex flex-col gap-1.5 text-left font-sans">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {field.label} {field.unit ? `(${field.unit})` : ''}
                    </label>
                    {currentVal && (
                      <span
                        className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
                          currentSrc === 'ocr'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-150'
                            : currentColors.badge
                        }`}
                      >
                        {currentSrc === 'ocr' ? 'OCR Filled' : 'User set'}
                      </span>
                    )}
                  </div>
                  {field.inputType === 'select' ? (
                    <select
                      value={currentVal || field.defaultValue}
                      onChange={(e) => handleChangeField(field.key, e.target.value)}
                      className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-bold focus:outline-none focus:ring-1 transition-all ${currentColors.focusRing} cursor-pointer`}
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.inputType}
                      value={currentVal}
                      placeholder={`Cohort Avg: ${field.defaultValue}`}
                      onChange={(e) => handleChangeField(field.key, e.target.value)}
                      className={`bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-bold focus:outline-none focus:ring-1 transition-all ${currentColors.focusRing}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Option B: OCR Slips Scanner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col gap-5 justify-between">
          <div>
            {/* Preferred Target Lab Test Indicator */}
            <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-xl relative overflow-hidden">
              <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest block mb-1 font-sans">
                Target Lab Test Required
              </span>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight font-sans">
                {testDetails.name}
              </h4>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-1 font-sans">
                {testDetails.description}
              </p>
              {testDetails.code && (
                <div className="mt-2 text-left flex items-center gap-1.5 font-sans">
                  <span className="text-[8px] font-bold font-mono px-1.5 py-0.5 bg-indigo-55 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded">
                    {testDetails.code}
                  </span>
                  <span className="text-[8px] text-slate-400 font-black uppercase tracking-wider">
                    Standard Medical Code
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-indigo-600" />
                <h3 className="text-xs font-black uppercase text-slate-700 tracking-wide">
                  Option B: Laboratory OCR Scanner
                </h3>
              </div>
              <span className="text-[8px] font-black bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 uppercase">
                Multimodal AI
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-3.5 leading-relaxed">
              Drag & drop any lab panel test image, doctor check ticket, or metabolic print layout to let Gemini parse the exact biomarkers needed instantly.
            </p>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3.5 transition-all text-center cursor-pointer min-h-[220px] mt-4 ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50/20'
                : 'border-slate-200 hover:bg-slate-50/60 bg-slate-50/10'
            }`}
          >
            <input
              type="file"
              id="clinical-ocr-input"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {isExtracting ? (
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="h-7 w-7 text-indigo-500 animate-spin" />
                <span className="text-[10px] text-indigo-950 font-black uppercase tracking-wider">
                  {extractionMsg}
                </span>
                <p className="text-[9px] text-slate-400 italic animate-pulse">
                  Querying Gemini vision processing model...
                </p>
              </div>
            ) : (
              <label htmlFor="clinical-ocr-input" className="flex flex-col items-center gap-3.5 cursor-pointer w-full text-slate-500">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs">
                  <Upload className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-800">
                    Drag or click to choose laboratory image
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-1 font-medium">
                    Supports PNG, JPG, JPEG up to 15MB
                  </span>
                </div>
              </label>
            )}
          </div>
        </div>

      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer border border-slate-200"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className={`text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${currentColors.btn}`}
        >
          <span>Verify & Review</span>
          <ChevronRight className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
}
