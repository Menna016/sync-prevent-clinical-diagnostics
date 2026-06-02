import React from 'react';
import { PatientIntake, TestResult, FieldDefinition } from '../../types';
import TestLayout from '../../components/tests/TestLayout';

interface BloodPressureTestPageProps {
  intake: PatientIntake;
  setIntake: (intake: PatientIntake) => void;
  setTestResult: (diseaseId: string, result: TestResult) => void;
  testResult: TestResult | null;
}

const bpFields: FieldDefinition[] = [
  {
    key: 'salt_intake',
    label: 'Daily Salt Intake',
    placeholder: '3',
    unit: 'g/day',
    defaultValue: '3',
    min: 0,
    max: 20,
    inputType: 'number'
  },
  {
    key: 'stress_score',
    label: 'Stress Score',
    placeholder: '4',
    unit: '1-10 Scale',
    defaultValue: '4',
    min: 1,
    max: 10,
    inputType: 'number'
  },
  {
    key: 'bp_history',
    label: 'History of High Blood Pressure',
    placeholder: '0',
    unit: '',
    defaultValue: '0',
    inputType: 'select',
    options: [
      { value: '0', label: '0 - No History' },
      { value: '1', label: '1 - Yes, History of High Blood Pressure' }
    ]
  },
  {
    key: 'sleep_duration',
    label: 'Average Sleep Duration',
    placeholder: '7',
    unit: 'hours/night',
    defaultValue: '7',
    min: 1,
    max: 24,
    inputType: 'number'
  },
  {
    key: 'family_history',
    label: 'Family History of Hypertension',
    placeholder: '0',
    unit: '',
    defaultValue: '0',
    inputType: 'select',
    options: [
      { value: '0', label: 'No Family History' },
      { value: '1', label: 'Yes, Family History of Hypertension' }
    ]
  }
];

export default function BloodPressureTestPage({
  intake,
  setIntake,
  setTestResult,
  testResult,
}: BloodPressureTestPageProps) {
  return (
    <TestLayout
      title="Hypertension Monitor"
      color="indigo"
      fields={bpFields}
      apiEndpoint="/api/predict/bp"
      diseaseId="bp"
      intake={intake}
      setIntake={setIntake}
      setTestResult={setTestResult}
      testResult={testResult}
    />
  );
}
