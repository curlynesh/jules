'use client';

import React from 'react';
import { usePrivacyStore } from '../../store/privacyStore';
import { ShieldCheck, Link as LinkIcon, Trash2, Clock, AlertTriangle } from 'lucide-react';

export default function PrivacyDashboard() {
    const { sharedLinks, revokeLink } = usePrivacyStore();

    const activeLinks = sharedLinks.filter(l => l.status === 'active');
    const revokedLinks = sharedLinks.filter(l => l.status === 'revoked');

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8">

                <header className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-2xl">
                            <ShieldCheck size={32} />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Privacy & Consent Center</h1>
                    </div>
                    <p className="text-xl text-slate-600 dark:text-slate-400">
                        You own your behavioral data. Review and revoke access at any time.
                    </p>
                </header>

                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <LinkIcon className="text-blue-500" /> Active Data Shares
                        </h2>
                    </div>

                    <div className="p-6 md:p-8 space-y-4">
                        {activeLinks.length === 0 ? (
                            <p className="text-slate-500 italic">No active data shares.</p>
                        ) : (
                            activeLinks.map(link => (
                                <div key={link.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl gap-4">
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">{link.label}</h3>
                                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                                            <span className="flex items-center gap-1"><Clock size={14} /> Created: {new Date(link.createdAt).toLocaleDateString()}</span>
                                            {link.expiresAt && (
                                                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                                    <AlertTriangle size={14} /> Expires: {new Date(link.expiresAt).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => revokeLink(link.id)}
                                        className="w-full sm:w-auto px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={16} /> Revoke Access
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {revokedLinks.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 md:p-8">
                        <h2 className="text-lg font-bold text-slate-500 uppercase tracking-wider mb-6">Revoked Shares History</h2>
                        <div className="space-y-3">
                            {revokedLinks.map(link => (
                                <div key={link.id} className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl opacity-60">
                                    <span className="font-medium text-slate-700 dark:text-slate-300 strike-through">{link.label}</span>
                                    <span className="text-sm text-slate-500 font-medium px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-md">Revoked</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
