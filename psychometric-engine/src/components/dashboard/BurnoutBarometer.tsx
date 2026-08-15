import React, { useState } from 'react';
import { Activity, AlertCircle, TrendingDown, Send } from 'lucide-react';

export const BurnoutBarometer = () => {
    const [draftSent, setDraftSent] = useState(false);

    // Mock data for the sparkline chart
    const energyLevels = [80, 85, 75, 60, 45, 30]; // Trending down

    return (
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 w-full">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Activity className="text-blue-500" /> Cognitive Energy Barometer
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Weekly longitudinal tracking.</p>
                </div>
                <div className="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded-full text-sm font-bold flex items-center gap-1">
                    <TrendingDown size={14} /> Low Energy
                </div>
            </div>

            {/* Mock Sparkline (CSS driven for simplicity) */}
            <div className="w-full h-32 flex items-end gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 pb-2">
                {energyLevels.map((level, i) => (
                    <div
                        key={i}
                        className={`flex-1 rounded-t-md transition-all ${level < 50 ? 'bg-amber-400 dark:bg-amber-600' : 'bg-blue-400 dark:bg-blue-600'}`}
                        style={{ height: `${level}%` }}
                        title={`Week ${i+1}: ${level}%`}
                    />
                ))}
            </div>

            {/* Proactive Alert */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-xl">
                <div className="flex gap-3">
                    <AlertCircle className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-amber-900 dark:text-amber-100">Burnout Warning</h4>
                        <p className="text-amber-800 dark:text-amber-200 mt-1 text-sm leading-relaxed">
                            You&apos;ve had 40% more synchronous meetings than your optimal profile suggests over the last two weeks.
                        </p>

                        {!draftSent ? (
                            <button
                                onClick={() => setDraftSent(true)}
                                className="mt-4 flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold transition-colors"
                            >
                                <Send size={14} /> Draft &apos;No-Meeting Wednesday&apos; request to Manager
                            </button>
                        ) : (
                            <p className="mt-4 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                                ✓ Draft sent to your email for review.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
