'use client';

import React, { useState, useEffect } from 'react';
import { AssessmentSchema } from '../../types/schema';
import { useAssessmentStore } from '../../store/assessmentStore';
import { QuestionDisplay } from './QuestionDisplay';
import { ArrowLeft, Settings, CheckCircle2, CloudLightning, CloudOff } from 'lucide-react';

interface Props {
  schema: AssessmentSchema;
}

export const AssessmentRunner: React.FC<Props> = ({ schema }) => {
  const {
    currentNodeId,
    responses,
    isComplete,
    isSyncing,
    syncError,
    history,
    initializeSession,
    setResponseAndAdvance,
    goBack,
    clearState
  } = useAssessmentStore();

  // Initialize accessibility defaults based on schema
  const defaultDyslexicFont = schema.config?.theme_overrides?.default_font === 'OpenDyslexic';

  const [highContrast, setHighContrast] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(defaultDyslexicFont);
  const [showSettings, setShowSettings] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center space-y-6">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Assessment Complete</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Thank you for completing the {schema.title}. Your answers have been securely saved.
          </p>
          <div className="pt-4">
             <button
              onClick={() => {
                clearState();
                initializeSession(schema);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium underline"
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
      highContrast ? 'bg-black text-white' : 'bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white'
    } ${dyslexicFont ? 'font-dyslexic' : 'font-sans'}`}>

      {/* Header / Navigation */}
      <header className="w-full p-4 md:p-6 flex justify-between items-center z-10">
        <button
          onClick={goBack}
          disabled={!canGoBack}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            canGoBack
              ? 'hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer'
              : 'opacity-30 cursor-not-allowed'
          }`}
          aria-label="Go back to previous question"
        >
          <ArrowLeft size={20} />
          <span className="font-medium hidden sm:inline">Back</span>
        </button>

        {/* Progress Bar Container */}
        <div className="flex-1 max-w-md mx-8 hidden sm:block">
           <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
             <div
               className="h-full bg-blue-600 transition-all duration-500 ease-out"
               style={{ width: `${progress}%` }}
               role="progressbar"
               aria-valuenow={progress}
               aria-valuemin={0}
               aria-valuemax={100}
             />
           </div>

           {/* Sync Status Indicator */}
           <div className="flex justify-center mt-2 h-4">
             {syncError ? (
               <span className="text-xs text-orange-500 flex items-center gap-1 font-medium">
                  <CloudOff size={12} /> {syncError}
               </span>
             ) : isSyncing ? (
               <span className="text-xs text-gray-400 flex items-center gap-1">
                  <CloudLightning size={12} className="animate-pulse text-blue-400" /> Saving...
               </span>
             ) : null}
           </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label="Accessibility settings"
          >
            <Settings size={24} />
          </button>

          {/* Accessibility Settings Dropdown */}
          {showSettings && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 flex flex-col gap-4 z-50">
              <h3 className="font-semibold text-lg border-b dark:border-gray-700 pb-2">Accessibility</h3>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-medium">High Contrast</span>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="w-5 h-5 accent-blue-600"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-medium">Dyslexia Font</span>
                <input
                  type="checkbox"
                  checked={dyslexicFont}
                  onChange={(e) => setDyslexicFont(e.target.checked)}
                  className="w-5 h-5 accent-blue-600"
                />
              </label>
            </div>
          )}
        </div>
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

      {/* Mobile Progress Bar */}
      <div className="sm:hidden w-full h-1 bg-gray-200 dark:bg-gray-700">
        <div
           className="h-full bg-blue-600 transition-all duration-500 ease-out"
           style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
