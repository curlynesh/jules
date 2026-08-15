import React, { useState, useEffect } from 'react';
import { Node, AnswerType } from '../../types/schema';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Video, Volume2 } from 'lucide-react';
import { useAccessibilityStore } from '../../store/accessibilityStore';

interface Props {
  question: Node;
  onAnswer: (answer: AnswerType) => void;
  currentAnswer?: AnswerType;
}

const ClarificationText: React.FC<{ text?: string }> = ({ text }) => {
  if (!text) return null;
  return (
    <div className="mt-6 p-5 bg-amber-50 border-l-4 border-amber-400 rounded-r-md">
      <span className="font-bold text-amber-900 text-sm uppercase tracking-wider">
        Literal Definition
      </span>
      <p className="mt-2 text-amber-800 leading-relaxed text-lg">
        {text}
      </p>
    </div>
  );
};

export const QuestionDisplay: React.FC<Props> = ({ question, onAnswer, currentAnswer }) => {
  const [textValue, setTextValue] = useState(typeof currentAnswer === 'string' ? currentAnswer : '');
  const { reducedMotion, textToSpeech } = useAccessibilityStore();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
        setTextValue(typeof currentAnswer === 'string' ? currentAnswer : '');
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [currentAnswer]);

  // Handle Text-to-Speech
  useEffect(() => {
      if (textToSpeech && typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel(); // Clear queue
          const utterance = new SpeechSynthesisUtterance(question.text);
          utterance.rate = 0.9; // Slightly slower for processing

          if (question.ui_config?.show_clarification_tooltip) {
             utterance.text += `. Clarification: ${question.ui_config.show_clarification_tooltip}`;
          }

          window.speechSynthesis.speak(utterance);
      }
  }, [question.id, textToSpeech, question.text, question.ui_config?.show_clarification_tooltip]);

  const handleTextSubmit = () => {
    if (textValue.trim()) {
      onAnswer(textValue);
    }
  };

  const { ui_config } = question;

  const playSpeechManually = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(question.text);
          window.speechSynthesis.speak(utterance);
      }
  }

  // Animation variants respect reducedMotion
  const animationVariants = {
      initial: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
      animate: reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
      exit: reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={animationVariants.initial}
        animate={animationVariants.animate}
        exit={animationVariants.exit}
        transition={{ duration: reducedMotion ? 0.1 : 0.2 }}
        className="w-full max-w-2xl mx-auto flex flex-col gap-10"
      >
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
             <h2 className="text-2xl md:text-3xl font-semibold leading-relaxed text-slate-900 dark:text-slate-100 flex-1">
                {question.text}
             </h2>
             {!textToSpeech && (
                <button
                  onClick={playSpeechManually}
                  className="mt-1 p-2 text-slate-400 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors shrink-0"
                  aria-label="Read question aloud"
                >
                    <Volume2 size={20} />
                </button>
             )}
          </div>
          <ClarificationText text={ui_config?.show_clarification_tooltip} />
        </div>

        <div className="flex flex-col gap-4">
          {(question.type === 'likert' || question.type === 'single_choice') && question.options && (
            <div className="flex flex-col gap-4">
              {question.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onAnswer(opt.value)}
                  className={`w-full text-left p-5 border-2 rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 text-lg ${
                    currentAnswer === opt.value
                      ? 'border-blue-600 bg-blue-50 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100'
                      : 'border-slate-200 text-slate-800 bg-white hover:border-blue-600 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {question.type === 'binary' && question.options && (
            <div className="grid grid-cols-2 gap-4">
              {question.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onAnswer(opt.value)}
                  className={`w-full text-center p-6 border-2 rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 text-xl font-medium ${
                    currentAnswer === opt.value
                      ? 'border-blue-600 bg-blue-50 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100'
                      : 'border-slate-200 text-slate-800 bg-white hover:border-blue-600 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {question.type === 'open_text' && (
            <div className="flex flex-col gap-6">
              <textarea
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                maxLength={ui_config?.max_length}
                rows={5}
                className="w-full p-5 text-lg rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-600 focus:ring-4 focus:ring-blue-200 resize-none leading-relaxed"
                placeholder="Type your answer here..."
              />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {ui_config?.allow_audio_response ? (
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                     <span className="text-slate-500 font-bold uppercase text-sm tracking-wider hidden sm:inline-block">OR</span>
                     <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium text-lg focus:outline-none focus:ring-4 focus:ring-slate-300">
                        <Mic size={24} /> Record Audio
                     </button>
                  </div>
                ) : <div />}

                <button
                  onClick={handleTextSubmit}
                  disabled={!textValue.trim()}
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium text-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  Save and Continue
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
