import React, { useState, useEffect } from 'react';
import { Node, AnswerType } from '../../types/schema';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Video } from 'lucide-react';

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

  // Keep internal text state synced with external answer state safely
  useEffect(() => {
    const timeoutId = setTimeout(() => {
        setTextValue(typeof currentAnswer === 'string' ? currentAnswer : '');
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [currentAnswer]);

  const handleTextSubmit = () => {
    if (textValue.trim()) {
      onAnswer(textValue);
    }
  };

  const { ui_config } = question;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl mx-auto flex flex-col gap-10"
      >
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold leading-relaxed text-slate-900 dark:text-slate-100">
            {question.text}
          </h2>
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
