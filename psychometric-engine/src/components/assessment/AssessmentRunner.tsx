'use client';

import React, { useState, useEffect } from 'react';
import { AssessmentSchema } from '../../types/schema';
import { useAssessmentStore } from '../../store/assessmentStore';
import { QuestionDisplay } from './QuestionDisplay';
import { ArrowLeft, CheckCircle2, CloudLightning, CloudOff } from 'lucide-react';

interface Props {
  schema: AssessmentSchema;
}

const AccessibilityControls: React.FC<{
  highContrast: boolean;
  toggleContrast: () => void;
  dyslexicFont: boolean;
  toggleFont: () => void;
}> = ({ highContrast, toggleContrast, dyslexicFont, toggleFont }) => {
  return (
    <div className="fixed top-4 right-4 flex space-x-3 z-50">
      <button
        onClick={toggleContrast}
        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {highContrast ? 'Standard Contrast' : 'High Contrast'}
      </button>
      <button
        onClick={toggleFont}
        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {dyslexicFont ? 'Standard Font' : 'Dyslexia Font'}
      </button>
    </div>
  );
};

export const AssessmentRunner: React.FC<Props> = ({ schema }) => {
  const {
    currentNodeId,
    responses,
    isComplete,
    isSyncing,
    syncError,
    history,
    finalProfile,
    initializeSession,
    setResponseAndAdvance,
    goBack,
    clearState
  } = useAssessmentStore();

  // Initialize accessibility defaults based on schema
  const defaultDyslexicFont = schema.config?.theme_overrides?.default_font === 'OpenDyslexic';

  const [highContrast, setHighContrast] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(defaultDyslexicFont);

  // Initialize store on mount
  useEffect(() => {
    initializeSession(schema);
  }, [schema, initializeSession]);

  const currentNode = schema.nodes.find(n => n.id === currentNodeId);
  const totalQuestions = schema.nodes.length;
  const answeredCount = Object.keys(responses).length;
  const progress = Math.min(100, Math.round((answeredCount / totalQuestions) * 100));
  const canGoBack = schema.config?.allow_back_navigation !== false && history.length > 0;

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-slate-900 p-6">
        <div className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center space-y-6">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Assessment Complete</h2>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Thank you for completing the {schema.title}. Your answers have been securely saved.
          </p>

          {finalProfile && (
              <div className="mt-8 text-left border-t pt-8 dark:border-slate-700">
                  <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Your Operating Manual</h3>
                  <div className="space-y-6">
                    {finalProfile.map((profile, idx) => (
                        <div key={idx} className="bg-slate-50 dark:bg-slate-700 p-6 rounded-xl border border-slate-200 dark:border-slate-600">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-200">{profile.traitName}</h4>
                                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 py-1 px-3 rounded-full text-sm font-bold">Score: {profile.score}</span>
                            </div>
                            <p className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-2">{profile.workingStyle}</p>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{profile.environmentNeed}</p>
                        </div>
                    ))}
                  </div>
              </div>
          )}

          <div className="pt-8">
             <button
              onClick={() => {
                clearState();
                initializeSession(schema);
              }}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 rounded-xl font-medium transition-colors focus:outline-none focus:ring-4 focus:ring-slate-300"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Avoid render until initialization is complete
  if (!currentNodeId && !isComplete) return null;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      highContrast ? 'bg-black text-white' : 'bg-[#FAFAFA] dark:bg-slate-900 text-slate-900 dark:text-slate-100'
    } ${dyslexicFont ? 'font-dyslexic' : 'font-sans'}`}>

      <AccessibilityControls
        highContrast={highContrast}
        toggleContrast={() => setHighContrast(!highContrast)}
        dyslexicFont={dyslexicFont}
        toggleFont={() => setDyslexicFont(!dyslexicFont)}
      />

      {/* Header / Navigation */}
      <header className="w-full p-6 pt-20 md:pt-6 flex justify-between items-center z-10 max-w-4xl mx-auto">
        <button
          onClick={goBack}
          disabled={!canGoBack}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-colors font-medium text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 ${
            canGoBack
              ? 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer'
              : 'opacity-30 cursor-not-allowed text-slate-500'
          }`}
          aria-label="Go back to previous question"
        >
          <ArrowLeft size={24} />
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Progress Bar Container */}
        <div className="flex-1 max-w-md mx-8">
           <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
             <div
               className="h-full bg-blue-600 transition-all duration-500 ease-out"
               style={{ width: `${progress}%` }}
               role="progressbar"
               aria-valuenow={progress}
               aria-valuemin={0}
               aria-valuemax={100}
               aria-label="Assessment Progress"
             />
           </div>

           {/* Sync Status Indicator */}
           <div className="flex justify-center mt-3 h-4">
             {syncError ? (
               <span className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
                  <CloudOff size={16} /> {syncError}
               </span>
             ) : isSyncing ? (
               <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                  <CloudLightning size={16} className="animate-pulse text-blue-500" /> Saving securely...
               </span>
             ) : null}
           </div>
        </div>

        {/* Empty div for flexbox balancing since Accessibility controls are fixed */}
        <div className="w-24 hidden sm:block" />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        {currentNode && (
          <QuestionDisplay
            question={currentNode}
            onAnswer={(value) => setResponseAndAdvance(currentNode.id, value)}
            currentAnswer={responses[currentNode.id]}
          />
        )}
      </main>
    </div>
  );
};
