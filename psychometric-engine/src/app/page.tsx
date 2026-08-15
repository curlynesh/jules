import React from 'react';
import Link from 'next/link';
import { ArrowRight, LayoutDashboard, BrainCircuit, Shield, Blocks } from 'lucide-react';

export default function LandingHub() {
    return (
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-24">

            <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full font-bold text-sm tracking-wide uppercase mb-4">
                    <BrainCircuit size={16} /> Neuro-Inclusive By Design
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                    The Psychometric <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Enterprise Engine</span>
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                    A multi-dimensional assessment platform designed to eliminate cognitive friction, secure behavioral data, and generate actionable workplace accommodations.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Take Assessment */}
                <Link href="/assess" className="group p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between h-72 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full opacity-10 blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
                    <div>
                        <div className="w-14 h-14 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                            <BrainCircuit size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Take Assessment</h2>
                        <p className="text-slate-600 dark:text-slate-400">Experience the frictionless runner, generate a Personal Operating Manual, and curate accommodations.</p>
                    </div>
                    <div className="flex justify-end text-blue-600 font-bold group-hover:translate-x-2 transition-transform">
                        <ArrowRight size={24} />
                    </div>
                </Link>

                {/* Enterprise ROI */}
                <Link href="/enterprise" className="group p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between h-72 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full opacity-10 blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
                    <div>
                        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                            <LayoutDashboard size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Enterprise Dashboard</h2>
                        <p className="text-slate-600 dark:text-slate-400">View Manager Copilot AI, peer-to-peer synergy tracking, and aggregate HR retention/ROI analytics.</p>
                    </div>
                    <div className="flex justify-end text-emerald-600 font-bold group-hover:translate-x-2 transition-transform">
                        <ArrowRight size={24} />
                    </div>
                </Link>

                {/* Visual Builder */}
                <Link href="/builder" className="group p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between h-72 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full opacity-10 blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
                    <div>
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                            <Blocks size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Assessment Builder</h2>
                        <p className="text-slate-600 dark:text-slate-400">Design schemas via a visual Directed Acyclic Graph (DAG) with node-based scoring configurations.</p>
                    </div>
                    <div className="flex justify-end text-purple-600 font-bold group-hover:translate-x-2 transition-transform">
                        <ArrowRight size={24} />
                    </div>
                </Link>

                {/* Privacy Center */}
                <Link href="/privacy" className="group p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between h-72 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500 rounded-full opacity-10 blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
                    <div>
                        <div className="w-14 h-14 bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 rounded-2xl flex items-center justify-center mb-6">
                            <Shield size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Privacy & Consent</h2>
                        <p className="text-slate-600 dark:text-slate-400">Review SOC2/GDPR compliance workflows. Revoke data access links and manage behavioral telemetry.</p>
                    </div>
                    <div className="flex justify-end text-rose-600 font-bold group-hover:translate-x-2 transition-transform">
                        <ArrowRight size={24} />
                    </div>
                </Link>

            </div>
        </div>
    );
}
