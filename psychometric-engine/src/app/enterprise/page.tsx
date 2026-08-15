'use client';

import React from 'react';
import { BurnoutBarometer } from '../../components/dashboard/BurnoutBarometer';
import { TeamSynergy } from '../../components/dashboard/TeamSynergy';
import { ManagerCopilot } from '../../components/dashboard/ManagerCopilot';
import { PieChart, TrendingUp } from 'lucide-react';

export default function EnterpriseDashboard() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <header className="mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Enterprise Ecosystem</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400">Beyond the Assessment: Daily Value & ROI</p>
                </header>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column: Daily Employee/Manager Value */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">1. Employee Daily Value</h2>
                            <BurnoutBarometer />
                        </div>

                        <div>
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">2. Peer-to-Peer Interaction</h2>
                            <TeamSynergy />
                        </div>

                        <div>
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">3. Manager Enablement (AI)</h2>
                            <ManagerCopilot />
                        </div>
                    </div>

                    {/* Right Column: HR / Enterprise ROI Analytics */}
                    <div className="space-y-8">
                         <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">4. HR & Procurement ROI Analytics</h2>

                         {/* Efficacy Analytics */}
                         <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
                             <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                    <PieChart size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Accommodation Efficacy</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">90-Day Post-Grant Surveys</p>
                                </div>
                             </div>

                             <div className="space-y-6">
                                 <div>
                                     <div className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                         <span>Noise Canceling Headphones</span>
                                         <span className="text-emerald-600 dark:text-emerald-400">82% Positive Impact</span>
                                     </div>
                                     <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                                         <div className="h-full bg-emerald-500 rounded-full" style={{ width: '82%' }}></div>
                                     </div>
                                 </div>
                                 <div>
                                     <div className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                         <span>Asynchronous Comm Policies</span>
                                         <span className="text-emerald-600 dark:text-emerald-400">94% Positive Impact</span>
                                     </div>
                                     <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                                         <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }}></div>
                                     </div>
                                 </div>
                             </div>

                             <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                                 <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                     <strong>Financial Impact:</strong> $2,400 invested in physical accommodations yielded an estimated <strong>18% aggregate increase</strong> in self-reported engineering productivity.
                                 </p>
                             </div>
                         </div>

                         {/* Retention Analytics */}
                         <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
                             <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Retention Correlation</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">YTD Cohort Analysis</p>
                                </div>
                             </div>

                             <div className="flex items-center gap-6">
                                 <div className="w-32 h-32 shrink-0 rounded-full border-8 border-blue-500 flex items-center justify-center">
                                     <span className="text-3xl font-bold text-slate-900 dark:text-white">+40%</span>
                                 </div>
                                 <div>
                                     <p className="text-lg text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                         Employees who generate and share a <strong>Personal Operating Manual</strong> have a 40% higher retention rate at the 2-year mark compared to baseline.
                                     </p>
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
