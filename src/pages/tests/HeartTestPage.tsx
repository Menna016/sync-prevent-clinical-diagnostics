import React from 'react';
import { PatientIntake, TestResult, FieldDefinition } from '../../types';
import TestLayout from '../../components/tests/TestLayout';

interface HeartTestPageProps {
  intake: PatientIntake;
  setIntake: (intake: PatientIntake) => void;
  setTestResult: (diseaseId: string, result: TestResult) => void;
  testResult: TestResult | null;
}

const heartFields: FieldDefinition[] = [
  {
    key: 'systolic',
    label: 'Systolic Blood Pressure',
    placeholder: '120',
    unit: 'mmHg',
    defaultValue: '120',
    min: 70,
    max: 240,
    inputType: 'number'
  },
  {
    key: 'diastolic',
    label: 'Diastolic Blood Pressure',
    placeholder: '80',
    unit: 'mmHg',
    defaultValue: '80',
    min: 40,
    max: 140,
    inputType: 'number'
  },
  {
    key: 'cholesterol',
    label: 'Serum Cholesterol',
    placeholder: '100',
    unit: 'mg/dL',
    defaultValue: '100',
    min: 40,
    max: 300,
    inputType: 'number'
  },
  {
    key: 'glucose',
    label: 'Fasting Blood Glucose',
    placeholder: '90',
    unit: 'mg/dL',
    defaultValue: '90',
    min: 50,
    max: 400,
    inputType: 'number'
  }
];

export default function HeartTestPage({
  intake,
  setIntake,
  setTestResult,
  testResult,
}: HeartTestPageProps) {
  return (
    <TestLayout
      title="Heart Disease Test Assistant"
      color="rose"
      fields={heartFields}
      apiEndpoint="/api/predict/heart"
      diseaseId="heart"
      intake={intake}
      setIntake={setIntake}
      setTestResult={setTestResult}
      testResult={testResult}
    />
  );
}
