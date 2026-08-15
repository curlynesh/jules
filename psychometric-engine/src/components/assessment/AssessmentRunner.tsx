'use client';

import React, { useEffect } from 'react';
import { AssessmentSchema } from '../../types/schema';
import { useAssessmentStore } from '../../store/assessmentStore';
import { useAccessibilityStore } from '../../store/accessibilityStore';
import { QuestionDisplay } from './QuestionDisplay';
import { PersonalOperatingManual } from '../profile/PersonalOperatingManual';
import { ArrowLeft, CloudLightning, CloudOff } from 'lucide-react';
import { AccessibilityControls } from './AccessibilityControls';

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
    finalProfile,
    initializeSession,
    setResponseAndAdvance,
    goBack,
    clearState
  } = useAssessmentStore();

  const { highContrast, dyslexicFont, setInitialConfigs } = useAccessibilityStore();

  useEffect(() => {
    initializeSession(schema);
    setInitialConfigs({
        font: schema.config?.theme_overrides?.default_font === 'OpenDyslexic'
    });
  }, [schema, initializeSession, setInitialConfigs]);

  const currentNode = schema.nodes.find(n => n.id === currentNodeId);
  const totalQuestions = schema.nodes.length;
  const answeredCount = Object.keys(responses).length;
  const progress = Math.min(100, Math.round((answeredCount / totalQuestions) * 100));
  const canGoBack = schema.config?.allow_back_navigation !== false && history.length > 0;

  if (isComplete && finalProfile) {
    return (
      <div className={`min-h-screen bg-[#FAFAFA] dark:bg-slate-900 p-6 pt-24 transition-colors duration-300 ${
        highContrast ? 'bg-black text-white' : 'text-slate-900 dark:text-slate-100'
      } ${dyslexicFont ? 'font-dyslexic' : 'font-sans'}`}>
        <AccessibilityControls />
        <PersonalOperatingManual
          profile={finalProfile}
          onRestart={() => {
            clearState();
            initializeSession(schema);
          }}
        />
      </div>
    );
  }

  // Loading state if complete but fetching profile
  if (isComplete && !finalProfile) {
      return (
        <div className={`min-h-screen flex items-center justify-center p-6 ${highContrast ? 'bg-black text-white' : 'bg-[#FAFAFA] dark:bg-slate-900 text-slate-900 dark:text-white'} ${dyslexicFont ? 'font-dyslexic' : 'font-sans'}`}>
            <div className="text-center space-y-4">
                <CloudLightning className="w-12 h-12 text-blue-500 animate-pulse mx-auto" />
                <h2 className="text-2xl font-bold">Generating your Manual...</h2>
            </div>
        </div>
      );
  }

  if (!currentNodeId && !isComplete) return null;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      highContrast ? 'bg-black text-white' : 'bg-[#FAFAFA] dark:bg-slate-900 text-slate-900 dark:text-slate-100'
    } ${dyslexicFont ? 'font-dyslexic' : 'font-sans'}`}>

      <AccessibilityControls />

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

        <div className="w-24 hidden sm:block" />
      </header>

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
