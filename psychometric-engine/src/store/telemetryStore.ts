import { create } from 'zustand';

export interface NodeTelemetry {
    nodeId: string;
    timeSpentMs: number;
    hesitationCount: number; // Number of times they changed their answer before proceeding
    enteredAt: number;
}

interface TelemetryState {
    metrics: Record<string, NodeTelemetry>;
    sessionStartTime: number | null;

    // Actions
    startSession: () => void;
    recordNodeEntry: (nodeId: string) => void;
    recordAnswerChange: (nodeId: string) => void;
    recordNodeExit: (nodeId: string) => void;

    // Aggregation
    getTotalHesitations: () => number;
    getAverageResponseTime: () => number;
}

export const useTelemetryStore = create<TelemetryState>((set, get) => ({
    metrics: {},
    sessionStartTime: null,

    startSession: () => set({ sessionStartTime: Date.now() }),

    recordNodeEntry: (nodeId) => {
        set(state => {
            const current = state.metrics[nodeId] || { nodeId, timeSpentMs: 0, hesitationCount: 0, enteredAt: 0 };
            return {
                metrics: {
                    ...state.metrics,
                    [nodeId]: { ...current, enteredAt: Date.now() }
                }
            };
        });
    },

    recordAnswerChange: (nodeId) => {
        set(state => {
            const current = state.metrics[nodeId];
            if (!current) return state; // Should not happen if entered properly

            return {
                metrics: {
                    ...state.metrics,
                    [nodeId]: { ...current, hesitationCount: current.hesitationCount + 1 }
                }
            };
        });
    },

    recordNodeExit: (nodeId) => {
        set(state => {
            const current = state.metrics[nodeId];
            if (!current || !current.enteredAt) return state;

            const timeSpent = Date.now() - current.enteredAt;

            return {
                metrics: {
                    ...state.metrics,
                    [nodeId]: {
                        ...current,
                        timeSpentMs: current.timeSpentMs + timeSpent,
                        enteredAt: 0 // Reset entry
                    }
                }
            };
        });
    },

    getTotalHesitations: () => {
        const { metrics } = get();
        return Object.values(metrics).reduce((sum, m) => sum + m.hesitationCount, 0);
    },

    getAverageResponseTime: () => {
        const { metrics } = get();
        const vals = Object.values(metrics);
        if (vals.length === 0) return 0;

        const totalMs = vals.reduce((sum, m) => sum + m.timeSpentMs, 0);
        return totalMs / vals.length;
    }
}));
