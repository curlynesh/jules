import { create } from 'zustand';
import { AssessmentSchema, AnswerType, TraitProfile } from '../types/schema';
import { getNextNodeId } from '../utils/engine';

interface AssessmentState {
  // Assessment Data
  schema: AssessmentSchema | null;
  responses: Record<string, AnswerType>; // { "node_id": "response_value" }

  // Navigation State
  currentNodeId: string | null;
  history: string[]; // Stack of previous node IDs

  // Sync State
  isSyncing: boolean;
  lastSavedAt: Date | null;
  syncError: string | null;
  isComplete: boolean;

  // Final Results
  finalProfile: TraitProfile[] | null;

  // Actions
  initializeSession: (schema: AssessmentSchema, resumeNodeId?: string | null, pastResponses?: Record<string, AnswerType>) => void;
  setResponseAndAdvance: (nodeId: string, value: AnswerType) => void;
  goBack: () => void;
  clearState: () => void;
}

// Background sync utility
let saveQueue: Array<{ nodeId: string, value: AnswerType }> = [];
let isProcessingQueue = false;

const processQueue = async () => {
  if (isProcessingQueue || saveQueue.length === 0) return;
  isProcessingQueue = true;

  const batch = [...saveQueue]; // Copy current queue
  saveQueue = []; // Clear queue for incoming saves

  try {
    // Send to your Next.js API route
    const response = await fetch('/api/assessments/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updates: batch }),
    });

    if (!response.ok) throw new Error('Failed to sync');

    useAssessmentStore.setState({
      isSyncing: false,
      lastSavedAt: new Date()
    });
  } catch (error) {
    // If it fails, push the batch back to the front of the queue
    saveQueue = [...batch, ...saveQueue];
    useAssessmentStore.setState({ syncError: 'Offline. Saving locally...' });

    // Retry after 5 seconds
    setTimeout(processQueue, 5000);
  } finally {
    isProcessingQueue = false;
    if (saveQueue.length > 0) processQueue();
  }
};

const triggerBackgroundSave = (nodeId: string, value: AnswerType) => {
  saveQueue.push({ nodeId, value });
  useAssessmentStore.setState({ isSyncing: true, syncError: null });
  processQueue();
};

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  schema: null,
  responses: {},
  currentNodeId: null,
  history: [],
  isSyncing: false,
  lastSavedAt: null,
  syncError: null,
  isComplete: false,
  finalProfile: null,

  initializeSession: (schema, resumeNodeId, pastResponses = {}) => {
    // On mount, load from localStorage optionally
    let initResponses = pastResponses;
    let initNodeId = resumeNodeId || schema.nodes[0]?.id || null;
    let initHistory: string[] = [];

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`assessment_${schema.id}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          initResponses = parsed.responses || {};
          initNodeId = parsed.currentNodeId || initNodeId;
          initHistory = parsed.history || [];
        } catch(e) {
            console.error("Local storage decode error", e);
        }
      }
    }

    set({
      schema,
      currentNodeId: initNodeId,
      responses: initResponses,
      history: initHistory,
      isComplete: initNodeId === null && Object.keys(initResponses).length > 0
    });
  },

  setResponseAndAdvance: async (nodeId, value) => {
    const { schema, currentNodeId, history, responses } = get();
    if (!schema || !currentNodeId) return;

    // 1. Update the response immediately (Optimistic UI)
    const newResponses = { ...responses, [nodeId]: value };
    set({ responses: newResponses });

    // Backup optimistic UI locally just in case
    if (typeof window !== 'undefined') {
       localStorage.setItem(`assessment_${schema.id}`, JSON.stringify({
          responses: newResponses,
          currentNodeId: currentNodeId,
          history: history
       }));
    }

    // 2. Trigger the auto-save API call in the background (fire-and-forget)
    triggerBackgroundSave(nodeId, value);

    // 3. Evaluate logic edges to find the next node
    const currentNode = schema.nodes.find(n => n.id === nodeId);
    if (!currentNode) return;

    const nextNodeId = getNextNodeId(currentNode, newResponses, schema);

    // 4. Advance the user instantly
    if (nextNodeId) {
      const newHistory = [...history, currentNodeId];
      set({
        currentNodeId: nextNodeId,
        history: newHistory
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem(`assessment_${schema.id}`, JSON.stringify({
           responses: newResponses,
           currentNodeId: nextNodeId,
           history: newHistory
        }));
      }

    } else {
      // Handle assessment completion
      set({ isComplete: true, currentNodeId: null });
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`assessment_${schema.id}`); // Clear local state on complete
      }

      // Finalize scoring
      try {
        const sessionId = "mock-session-123"; // In a real app, this comes from auth/init
        const result = await fetch('/api/assessments/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            assessmentId: schema.id,
            responses: newResponses
          })
        });

        if (result.ok) {
           const data = await result.json();
           set({ finalProfile: data.profile });
        }
      } catch (err) {
        console.error("Failed to complete assessment", err);
      }
    }
  },

  goBack: () => {
    set((state) => {
      if (state.history.length === 0) return state;
      const newHistory = [...state.history];
      const previousNodeId = newHistory.pop()!;

      const newState = {
          currentNodeId: previousNodeId,
          history: newHistory,
          isComplete: false
      };

      if (typeof window !== 'undefined' && state.schema) {
        localStorage.setItem(`assessment_${state.schema.id}`, JSON.stringify({
           responses: state.responses,
           currentNodeId: previousNodeId,
           history: newHistory
        }));
      }

      return newState;
    });
  },

  clearState: () => {
    const { schema } = get();
    set({
      responses: {},
      currentNodeId: schema?.nodes[0]?.id || null,
      history: [],
      isComplete: false,
      finalProfile: null
    });
    if (typeof window !== 'undefined' && schema) {
      localStorage.removeItem(`assessment_${schema.id}`);
    }
  }
}));
