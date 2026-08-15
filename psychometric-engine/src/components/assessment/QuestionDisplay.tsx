import React, { useState, useEffect } from 'react';
import { QuestionNode, AnswerType } from '../../types/schema';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Video } from 'lucide-react';

interface Props {
  question: QuestionNode;
  onAnswer: (answer: AnswerType) => void;
  currentAnswer?: AnswerType;
}

export const QuestionDisplay: React.FC<Props> = ({ question, onAnswer, currentAnswer }) => {
  const [textValue, setTextValue] = useState(typeof currentAnswer === 'string' ? currentAnswer : '');

  // Keep internal text state synced with external answer state safely
  useEffect(() => {
    // Defer the state update to avoid synchronous state changes inside useEffect
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

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl mx-auto flex flex-col gap-8"
      >
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-medium leading-tight text-gray-900 dark:text-white">
            {question.text}
          </h2>
          {question.description && (
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {question.description}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {question.questionType === 'likert' && question.options && (
            <div className="flex flex-col gap-3">
              {question.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onAnswer(opt.value)}
                  className={`p-4 text-left rounded-xl border-2 transition-all ${
                    currentAnswer === opt.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-blue-700 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="text-lg font-medium">{opt.text}</span>
                </button>
              ))}
            </div>
          )}

          {question.questionType === 'binary' && question.options && (
            <div className="grid grid-cols-2 gap-4">
              {question.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onAnswer(opt.value)}
                  className={`p-6 text-center rounded-xl border-2 transition-all ${
                    currentAnswer === opt.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-blue-700 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="text-xl font-medium">{opt.text}</span>
                </button>
              ))}
            </div>
          )}

          {question.questionType === 'open_text' && (
            <div className="flex flex-col gap-4">
              <textarea
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                rows={5}
                className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-blue-500 focus:ring-0 resize-none"
                placeholder="Type your answer here..."
              />
              <div className="flex justify-between items-center">
                {question.allowAudioVideo && (
                  <div className="flex gap-2">
                    <button className="p-3 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" title="Record Audio">
                      <Mic size={24} />
                    </button>
                    <button className="p-3 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" title="Record Video">
                      <Video size={24} />
                    </button>
                  </div>
                )}
                <button
                  onClick={handleTextSubmit}
                  disabled={!textValue.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors ml-auto"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
