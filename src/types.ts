export interface PatientIntake {
  age: string;
  gender: string;
  height: string;
  weight: string;
  smoke: boolean;
  alcohol: boolean;
  activityLevel: string;
  symptoms?: string[];
}

export interface FieldDefinition {
  key: string;
  label: string;
  placeholder: string;
  unit: string;
  defaultValue: string;
  min?: number;
  max?: number;
  inputType: 'number' | 'text' | 'select';
  options?: { value: string; label: string }[];
}

export interface TestResult {
  riskLevel: 'Low' | 'Medium' | 'High' | 'Unavailable';
  explanation: string;
  recommendations: string[];
  disclaimer: string;
  _mlModelUsed?: boolean;
  _mlDetails?: {
    status?: string;
    probability?: number;
    predictionClass?: number;
    features?: Record<string, any>;
    message?: string;
  } | null;
  _mlStatus?: string;
  _mlMessage?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export type TestId = 'heart' | 'diabetes' | 'liver' | 'bp' | 'kidney';

export interface TestModule {
  id: TestId;
  title: string;
  desc: string;
  color: 'rose' | 'emerald' | 'amber' | 'indigo' | 'cyan' | 'sky' | 'teal';
  fields: FieldDefinition[];
  apiEndpoint: string;
}
