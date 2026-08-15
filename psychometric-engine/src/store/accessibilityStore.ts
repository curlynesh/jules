import { create } from 'zustand';

interface AccessibilityState {
    highContrast: boolean;
    dyslexicFont: boolean;
    reducedMotion: boolean;
    textToSpeech: boolean;

    toggleContrast: () => void;
    toggleFont: () => void;
    toggleMotion: () => void;
    toggleSpeech: () => void;

    // For initializing based on schema config
    setInitialConfigs: (config: { font?: boolean }) => void;
}

export const useAccessibilityStore = create<AccessibilityState>((set) => ({
    highContrast: false,
    dyslexicFont: false,

    // Respect OS level motion preferences on init if possible, otherwise default false
    reducedMotion: typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false,
    textToSpeech: false,

    toggleContrast: () => set(state => ({ highContrast: !state.highContrast })),
    toggleFont: () => set(state => ({ dyslexicFont: !state.dyslexicFont })),
    toggleMotion: () => set(state => ({ reducedMotion: !state.reducedMotion })),
    toggleSpeech: () => set(state => {
        // If turning off speech, immediately cancel any ongoing speech
        if (state.textToSpeech && typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        return { textToSpeech: !state.textToSpeech };
    }),

    setInitialConfigs: ({ font }) => set(state => ({
        dyslexicFont: font !== undefined ? font : state.dyslexicFont
    }))
}));
