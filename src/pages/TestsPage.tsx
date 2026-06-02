import React from 'react';
import TestsHomePage from './tests/TestsHomePage';
import { TestResult } from '../types';

interface TestsPageProps {
  recentTests: Record<string, TestResult>;
  suggestedTestId?: string | null;
}

export default function TestsPage({ recentTests, suggestedTestId }: TestsPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 lg:py-12 flex-1 font-sans text-left">
      <TestsHomePage recentTests={recentTests} suggestedTestId={suggestedTestId} />
    </div>
  );
}
