import { useState, useEffect, useCallback } from 'react';
import { AssessmentSchema, Node, AnswerType } from '../types/schema';
import { getNextNodeId } from '../utils/engine';

interface AssessmentState {
  currentNodeId: string | null;
  answers: Record<string, AnswerType>;
  history: string[]; // For going back
  isComplete: boolean;
}

export function useAssessment(schema: AssessmentSchema, storageKey: string) {
  const startNodeId = schema.nodes[0]?.id || null;

  const [state, setState] = useState<AssessmentState>(() => {
    // Attempt to load from localStorage for auto-save/resume
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved state", e);
        }
      }
    }
    return {
      currentNodeId: startNodeId,
      answers: {},
      history: [],
      isComplete: false,
    };
  });

  // Auto-save
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(state));
    }
  }, [state, storageKey]);

  const currentNode = schema.nodes.find(n => n.id === state.currentNodeId) as Node | undefined;

  const handleAnswer = useCallback((answer: AnswerType) => {
    if (!currentNode) return;

    setState(prev => {
      const newAnswers = { ...prev.answers, [currentNode.id]: answer };
      const nextId = getNextNodeId(currentNode, newAnswers, schema);

      return {
        ...prev,
        answers: newAnswers,
        currentNodeId: nextId,
        history: [...prev.history, currentNode.id],
        isComplete: nextId === null
      };
    });
  }, [currentNode, schema]);

  const handleBack = useCallback(() => {
    setState(prev => {
      if (prev.history.length === 0) return prev;
      const newHistory = [...prev.history];
      const previousNodeId = newHistory.pop()!;
      return {
        ...prev,
        currentNodeId: previousNodeId,
        history: newHistory,
        isComplete: false // If they went back, it's not complete anymore
      };
    });
  }, []);

  const clearState = useCallback(() => {
    setState({
      currentNodeId: startNodeId,
      answers: {},
      history: [],
      isComplete: false,
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  }, [startNodeId, storageKey]);

  return {
    currentNode,
    answers: state.answers,
    isComplete: state.isComplete,
    handleAnswer,
    handleBack,
    canGoBack: schema.config?.allow_back_navigation !== false && state.history.length > 0,
    clearState,
    totalQuestions: schema.nodes.length,
    answeredCount: Object.keys(state.answers).length
  };
}
