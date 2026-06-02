import React from 'react';
import { PatientIntake, TestResult, FieldDefinition } from '../../types';
import TestLayout from '../../components/tests/TestLayout';

interface DiabetesTestPageProps {
  intake: PatientIntake;
  setIntake: (intake: PatientIntake) => void;
  setTestResult: (diseaseId: string, result: TestResult) => void;
  testResult: TestResult | null;
}

const diabetesFields: FieldDefinition[] = [
  {
    key: 'high_bp',
    label: 'High Blood Pressure history',
    placeholder: '0',
    unit: '',
    defaultValue: '0',
    inputType: 'select',
    options: [
      { value: '0', label: '0 - No High BP' },
      { value: '1', label: '1 - Yes, Diagnosed High BP' }
    ]
  },
  {
    key: 'high_chol',
    label: 'High Blood Cholesterol history',
    placeholder: '0',
    unit: '',
    defaultValue: '0',
    inputType: 'select',
    options: [
      { value: '0', label: '0 - No High Cholesterol' },
      { value: '1', label: '1 - Yes, Diagnosed High Cholesterol' }
    ]
  },
  {
    key: 'chol_check',
    label: 'Cholesterol Checked in Past 5 Years',
    placeholder: '1',
    unit: '',
    defaultValue: '1',
    inputType: 'select',
    options: [
      { value: '0', label: '0 - No' },
      { value: '1', label: '1 - Yes' }
    ]
  },
  {
    key: 'stroke',
    label: 'History of Stroke',
    placeholder: '0',
    unit: '',
    defaultValue: '0',
    inputType: 'select',
    options: [
      { value: '0', label: '0 - No History' },
      { value: '1', label: '1 - Yes, History of Stroke' }
    ]
  },
  {
    key: 'heart_disease_or_attack',
    label: 'Coronary Heart Disease or Heart Attack history',
    placeholder: '0',
    unit: '',
    defaultValue: '0',
    inputType: 'select',
    options: [
      { value: '0', label: '0 - No History' },
      { value: '1', label: '1 - Yes, Heart Disease/Attack History' }
    ]
  },
  {
    key: 'fruits',
    label: 'Consumes Fruits Regularly (>= 1 time daily)',
    placeholder: '1',
    unit: '',
    defaultValue: '1',
    inputType: 'select',
    options: [
      { value: '0', label: '0 - No' },
      { value: '1', label: '1 - Yes' }
    ]
  },
  {
    key: 'veggies',
    label: 'Consumes Vegetables Regularly (>= 1 time daily)',
    placeholder: '1',
    unit: '',
    defaultValue: '1',
    inputType: 'select',
    options: [
      { value: '0', label: '0 - No' },
      { value: '1', label: '1 - Yes' }
    ]
  },
  {
    key: 'any_healthcare',
    label: 'Has Healthcare Coverage',
    placeholder: '1',
    unit: '',
    defaultValue: '1',
    inputType: 'select',
    options: [
      { value: '0', label: '0 - No Coverage' },
      { value: '1', label: '1 - Yes, Has Coverage' }
    ]
  },
  {
    key: 'no_doc_bc_cost',
    label: 'Skipped Medical Visit in Past Year due to Cost',
    placeholder: '0',
    unit: '',
    defaultValue: '0',
    inputType: 'select',
    options: [
      { value: '0', label: '0 - No' },
      { value: '1', label: '1 - Yes, Skipped due to cost' }
    ]
  },
  {
    key: 'gen_hlth',
    label: 'General Health Rating',
    placeholder: '2',
    unit: '1-5 Scale',
    defaultValue: '2',
    inputType: 'select',
    options: [
      { value: '1', label: '1 - Excellent' },
      { value: '2', label: '2 - Very Good' },
      { value: '3', label: '3 - Good' },
      { value: '4', label: '4 - Fair' },
      { value: '5', label: '5 - Poor' }
    ]
  },
  {
    key: 'ment_hlth',
    label: 'Poor Mental Health Days (Past 30 Days)',
    placeholder: '0',
    unit: 'days',
    defaultValue: '0',
    min: 0,
    max: 30,
    inputType: 'number'
  },
  {
    key: 'phys_hlth',
    label: 'Poor Physical Health Days (Past 30 Days)',
    placeholder: '0',
    unit: 'days',
    defaultValue: '0',
    min: 0,
    max: 30,
    inputType: 'number'
  },
  {
    key: 'diff_walk',
    label: 'Difficulty Walking or Climbing Stairs',
    placeholder: '0',
    unit: '',
    defaultValue: '0',
    inputType: 'select',
    options: [
      { value: '0', label: '0 - No Difficulty' },
      { value: '1', label: '1 - Yes, Serious Difficulty' }
    ]
  },
  {
    key: 'education',
    label: 'Completed Education Level',
    placeholder: '5',
    unit: '1-6 Scale',
    defaultValue: '5',
    inputType: 'select',
    options: [
      { value: '1', label: '1 - Never attended school' },
      { value: '2', label: '2 - Elementary school' },
      { value: '3', label: '3 - Some High School' },
      { value: '4', label: '4 - High School Graduate' },
      { value: '5', label: '5 - Some College/Technical School' },
      { value: '6', label: '6 - College Graduate' }
    ]
  },
  {
    key: 'income',
    label: 'Annual Household Income Range',
    placeholder: '6',
    unit: '1-8 Scale',
    defaultValue: '6',
    inputType: 'select',
    options: [
      { value: '1', label: '1 - Less than $10,000' },
      { value: '2', label: '2 - $10,000 to $15,000' },
      { value: '3', label: '3 - $15,050 to $20,000' },
      { value: '4', label: '4 - $20,000 to $25,000' },
      { value: '5', label: '5 - $25,000 to $35,000' },
      { value: '6', label: '6 - $35,000 to $50,000' },
      { value: '7', label: '7 - $50,050 to $75,000' },
      { value: '8', label: '8 - More than $75,000' }
    ]
  }
];

export default function DiabetesTestPage({
  intake,
  setIntake,
  setTestResult,
  testResult,
}: DiabetesTestPageProps) {
  return (
    <TestLayout
      title="Diabetes Risk Assistant"
      color="emerald"
      fields={diabetesFields}
      apiEndpoint="/api/predict/diabetes"
      diseaseId="diabetes"
      intake={intake}
      setIntake={setIntake}
      setTestResult={setTestResult}
      testResult={testResult}
    />
  );
}
