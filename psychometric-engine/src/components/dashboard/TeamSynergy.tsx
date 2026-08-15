import React from 'react';
import { Users, Zap, ShieldAlert } from 'lucide-react';

export const TeamSynergy = () => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 w-full">
            <div className="flex items-center gap-3 mb-6 border-b pb-6 dark:border-slate-700">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <Users size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Peer-to-Peer Synergy</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Viewing profile collision with: <strong className="text-slate-800 dark:text-slate-200">Alex Chen (Manager)</strong></p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Synergies */}
                <div className="p-5 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl">
                    <h4 className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2 mb-3">
                        <Zap size={18} /> High Synergy
                    </h4>
                    <p className="text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed">
                        <strong>Deep Work Alignment:</strong> You both strongly prefer asynchronous communication. Alex will deeply respect your blocked calendar time.
                    </p>
                </div>

                {/* Friction Points */}
                <div className="p-5 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800/30 rounded-2xl">
                    <h4 className="font-bold text-rose-800 dark:text-rose-400 flex items-center gap-2 mb-3">
                        <ShieldAlert size={18} /> Potential Friction
                    </h4>
                    <p className="text-sm text-rose-900 dark:text-rose-200 leading-relaxed mb-3">
                        <strong>Processing Speed:</strong> Alex is an <em>external processor</em> who &quot;talks to think.&quot; You are an <em>internal processor</em> who needs silence.
                    </p>
                    <div className="bg-white/60 dark:bg-black/20 p-3 rounded-lg">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">💡 Resolution Strategy:</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Ask Alex to send a quick bulleted brain-dump before 1-on-1s so you have time to internally process the topics.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
