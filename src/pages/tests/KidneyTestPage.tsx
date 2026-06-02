import React from 'react';
import { PatientIntake, TestResult, FieldDefinition } from '../../types';
import TestLayout from '../../components/tests/TestLayout';

interface KidneyTestPageProps {
  intake: PatientIntake;
  setIntake: (intake: PatientIntake) => void;
  setTestResult: (diseaseId: string, result: TestResult) => void;
  testResult: TestResult | null;
}

const kidneyFields: FieldDefinition[] = [
  {
    key: 'gfr',
    label: 'Glomerular Filtration Rate (GFR)',
    placeholder: '95',
    unit: 'mL/min/1.73m²',
    defaultValue: '90',
    min: 5,
    max: 180,
    inputType: 'number',
  },
  {
    key: 'creatinine_level',
    label: 'Serum Creatinine Level',
    placeholder: '0.9',
    unit: 'mg/dL',
    defaultValue: '1.0',
    min: 0.1,
    max: 15.0,
    inputType: 'number',
  },
  {
    key: 'bun',
    label: 'Blood Urea Nitrogen (BUN)',
    placeholder: '15',
    unit: 'mg/dL',
    defaultValue: '15',
    min: 1,
    max: 150,
    inputType: 'number',
  },
  {
    key: 'urine_output',
    label: 'Daily Urine Output',
    placeholder: '1.8',
    unit: 'L/day',
    defaultValue: '1.8',
    min: 0.1,
    max: 10.0,
    inputType: 'number',
  },
  {
    key: 'diabetes',
    label: 'History of Diabetes',
    placeholder: '0',
    unit: '',
    defaultValue: '0',
    inputType: 'select',
    options: [
      { value: '0', label: 'No Diabetes History' },
      { value: '1', label: 'Yes, Diagnosed Diabetes' }
    ]
  },
  {
    key: 'hypertension',
    label: 'History of Hypertension',
    placeholder: '0',
    unit: '',
    defaultValue: '0',
    inputType: 'select',
    options: [
      { value: '0', label: 'No Hypertension History' },
      { value: '1', label: 'Yes, Diagnosed Hypertension' }
    ]
  }
];

export default function KidneyTestPage({
  intake,
  setIntake,
  setTestResult,
  testResult,
}: KidneyTestPageProps) {
  return (
    <TestLayout
      title="Kidney Function Screen"
      color="teal"
      fields={kidneyFields}
      apiEndpoint="/api/predict/kidney"
      diseaseId="kidney"
      intake={intake}
      setIntake={setIntake}
      setTestResult={setTestResult}
      testResult={testResult}
    />
  );
}
