import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PatientIntake, TestResult } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AIDoctorPage from './pages/AIDoctorPage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import TestsPage from './pages/TestsPage';
import HeartTestPage from './pages/tests/HeartTestPage';
import DiabetesTestPage from './pages/tests/DiabetesTestPage';
import BloodPressureTestPage from './pages/tests/BloodPressureTestPage';
import KidneyTestPage from './pages/tests/KidneyTestPage';

export default function App() {
  const [intake, setIntake] = useState<PatientIntake>({
    age: '42',
    gender: 'Male',
    height: '175',
    weight: '78',
    smoke: false,
    alcohol: false,
    activityLevel: 'Moderate Aerobic (150m/week)',
  });

  const [recentTests, setRecentTests] = useState<Record<string, TestResult>>({});
  const [suggestedTestId, setSuggestedTestId] = useState<string | null>(null);

  const updateTestResult = (diseaseId: string, result: TestResult) => {
    setRecentTests((prev) => ({
      ...prev,
      [diseaseId]: result,
    }));
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-indigo-500/10 text-start">
        
        {/* Navigation Head */}
        <Navbar intake={intake} />

        {/* Main Workspace Frame */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-0">
          <Routes>
            {/* Landing hub page */}
            <Route 
              path="/" 
              element={
                <Home 
                  intake={intake} 
                  setIntake={setIntake} 
                  recentTests={recentTests} 
                />
              } 
            />

            {/* Diagnostics hub page */}
            <Route 
              path="/tests" 
              element={
                <TestsPage recentTests={recentTests} suggestedTestId={suggestedTestId} />
              } 
            />
            
            {/* Preventive Diagnostic Test Screens */}
            <Route
              path="/tests/heart"
              element={
                <HeartTestPage
                  intake={intake}
                  setIntake={setIntake}
                  setTestResult={updateTestResult}
                  testResult={recentTests.heart || null}
                />
              }
            />
            <Route
              path="/tests/diabetes"
              element={
                <DiabetesTestPage
                  intake={intake}
                  setIntake={setIntake}
                  setTestResult={updateTestResult}
                  testResult={recentTests.diabetes || null}
                />
              }
            />
            <Route
              path="/tests/bp"
              element={
                <BloodPressureTestPage
                  intake={intake}
                  setIntake={setIntake}
                  setTestResult={updateTestResult}
                  testResult={recentTests.bp || null}
                />
              }
            />
            <Route
              path="/tests/kidney"
              element={
                <KidneyTestPage
                  intake={intake}
                  setIntake={setIntake}
                  setTestResult={updateTestResult}
                  testResult={recentTests.kidney || null}
                />
              }
            />

            {/* AI doctor consult space */}
            <Route 
              path="/doctor" 
              element={
                <AIDoctorPage 
                  intake={intake} 
                  recentTests={recentTests} 
                />
              } 
            />

            {/* Symptom Checker intelligence space */}
            <Route 
              path="/symptoms" 
              element={
                <SymptomCheckerPage intake={intake} onSetSuggested={setSuggestedTestId} />
              } 
            />

            {/* Fallback routing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Disclaimer Footer */}
        <Footer />

      </div>
    </Router>
  );
}
