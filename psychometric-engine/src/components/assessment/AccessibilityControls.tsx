import React, { useState } from 'react';
import { useAccessibilityStore } from '../../store/accessibilityStore';
import { Settings2, Volume2, VolumeX, Eye, Type, Activity } from 'lucide-react';

export const AccessibilityControls: React.FC = () => {
  const {
      highContrast, toggleContrast,
      dyslexicFont, toggleFont,
      reducedMotion, toggleMotion,
      textToSpeech, toggleSpeech
  } = useAccessibilityStore();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-full shadow-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500 hover:bg-slate-50 transition-colors"
        aria-label="Accessibility Settings"
        aria-expanded={isOpen}
      >
        <Settings2 size={24} />
      </button>

      {isOpen && (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-72 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200 origin-top-right">
            <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">Accessibility Controls</h3>

            <div className="space-y-2">
                <button
                    onClick={toggleContrast}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors font-medium text-sm ${highContrast ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200 border-2 border-blue-500' : 'bg-slate-50 text-slate-700 dark:bg-slate-700 dark:text-slate-200 border-2 border-transparent hover:bg-slate-100 dark:hover:bg-slate-600'}`}
                >
                    <span className="flex items-center gap-2"><Eye size={16}/> High Contrast</span>
                    <span>{highContrast ? 'ON' : 'OFF'}</span>
                </button>

                <button
                    onClick={toggleFont}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors font-medium text-sm ${dyslexicFont ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200 border-2 border-blue-500' : 'bg-slate-50 text-slate-700 dark:bg-slate-700 dark:text-slate-200 border-2 border-transparent hover:bg-slate-100 dark:hover:bg-slate-600'}`}
                >
                    <span className="flex items-center gap-2"><Type size={16}/> Dyslexia Font</span>
                    <span>{dyslexicFont ? 'ON' : 'OFF'}</span>
                </button>

                <button
                    onClick={toggleMotion}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors font-medium text-sm ${reducedMotion ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200 border-2 border-blue-500' : 'bg-slate-50 text-slate-700 dark:bg-slate-700 dark:text-slate-200 border-2 border-transparent hover:bg-slate-100 dark:hover:bg-slate-600'}`}
                >
                    <span className="flex items-center gap-2"><Activity size={16}/> Reduce Motion</span>
                    <span>{reducedMotion ? 'ON' : 'OFF'}</span>
                </button>

                <button
                    onClick={toggleSpeech}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors font-medium text-sm ${textToSpeech ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200 border-2 border-blue-500' : 'bg-slate-50 text-slate-700 dark:bg-slate-700 dark:text-slate-200 border-2 border-transparent hover:bg-slate-100 dark:hover:bg-slate-600'}`}
                >
                    <span className="flex items-center gap-2">
                        {textToSpeech ? <Volume2 size={16}/> : <VolumeX size={16}/>} Read Aloud
                    </span>
                    <span>{textToSpeech ? 'ON' : 'OFF'}</span>
                </button>
            </div>
        </div>
      )}
    </div>
  );
};
