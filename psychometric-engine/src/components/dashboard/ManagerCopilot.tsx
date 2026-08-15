import React, { useState } from 'react';
import { Bot, Sparkles, AlertTriangle } from 'lucide-react';

export const ManagerCopilot = () => {
    const [input, setInput] = useState("We need to boil the ocean on this project. Let's touch base later to see if we can move the needle.");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            setResult("We need to conduct a comprehensive review of all aspects of this project. Let's schedule a meeting tomorrow at 2 PM to review the core metrics.");
        }, 1200);
    };

    return (
        <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-700 w-full relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-purple-600 rounded-full opacity-20 blur-3xl"></div>

            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
                    <Bot size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold">Manager Comm-Copilot</h3>
                    <p className="text-sm text-slate-400">Target Profile: <span className="text-slate-200">Literal & Direct (No idioms)</span></p>
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={3}
                    placeholder="Draft your message to your direct report here..."
                />

                <div className="flex justify-end">
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !input}
                        className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg font-bold transition-colors"
                    >
                        {isAnalyzing ? <Sparkles size={16} className="animate-pulse" /> : <Bot size={16} />}
                        {isAnalyzing ? 'Analyzing...' : 'Neuro-Inclusive Rewrite'}
                    </button>
                </div>

                {result && (
                    <div className="mt-6 bg-slate-800 border border-purple-500/30 p-5 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center gap-2 text-purple-400 mb-3 text-sm font-bold uppercase tracking-wider">
                            <AlertTriangle size={16} /> Issues Detected: Metaphors (3)
                        </div>
                        <p className="text-slate-200 leading-relaxed font-medium">
                            {result}
                        </p>
                        <div className="mt-4 pt-4 border-t border-slate-700 flex justify-end">
                             <button className="text-sm text-purple-400 hover:text-purple-300 font-bold">Copy Rewrite</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
