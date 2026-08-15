import React, { useState } from 'react';
import { TraitProfile } from '../../types/schema';
import { Share2, Lock, EyeOff, Edit3, Download, Clock } from 'lucide-react';

interface Props {
  profile: TraitProfile[];
  onRestart: () => void;
}

const EditableCard: React.FC<{
    title: string;
    value: string;
    subtitle?: string;
    isVisible: boolean;
    onToggleVisibility: () => void;
}> = ({ title, value, subtitle, isVisible, onToggleVisibility }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(value);

    if (!isVisible && !isEditing) return null;

    return (
        <div className={`p-6 rounded-2xl border-2 transition-all ${
            isVisible ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800' : 'border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 opacity-60'
        }`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h3>
                    {subtitle && <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Edit text"
                    >
                        <Edit3 size={18} />
                    </button>
                    <button
                        onClick={onToggleVisibility}
                        className={`p-2 rounded-lg transition-colors ${
                            isVisible ? 'text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-700' : 'text-slate-500 bg-slate-200 dark:bg-slate-700'
                        }`}
                        title={isVisible ? "Hide from public profile" : "Hidden (Click to show)"}
                    >
                        {isVisible ? <Lock size={18} /> : <EyeOff size={18} />}
                    </button>
                </div>
            </div>

            {isEditing ? (
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full p-3 border rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 min-h-[100px] focus:ring-2 focus:ring-blue-500"
                />
            ) : (
                <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">{text}</p>
            )}
        </div>
    );
};

export const PersonalOperatingManual: React.FC<Props> = ({ profile, onRestart }) => {
    const [showShareModal, setShowShareModal] = useState(false);

    // Mock state for visibility toggles
    const [visibility, setVisibility] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        profile.forEach(p => initial[p.traitName] = true);
        return initial;
    });

    const toggleVisibility = (traitName: string) => {
        setVisibility(prev => ({ ...prev, [traitName]: !prev[traitName] }));
    };

    return (
        <div className="max-w-4xl w-full mx-auto pb-24">

            {/* Header Actions */}
            <div className="flex justify-end gap-4 mb-8">
                <button onClick={onRestart} className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                    Restart Assessment
                </button>
                <button
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm"
                >
                    <Share2 size={18} /> Share Profile
                </button>
            </div>

            {/* Zone A: At a Glance Header */}
            <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 mb-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Personal Operating Manual</h1>
                <div className="inline-block px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm mb-8">
                    <p className="text-lg font-medium text-blue-100">Deep-Focus Specialist & Asynchronous Communicator</p>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-lg font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span> Rules of Engagement
                    </h3>
                    <ul className="space-y-3 text-lg text-slate-200 font-medium">
                        <li className="flex gap-3"><span className="text-blue-400">1.</span> Please put action items in writing.</li>
                        <li className="flex gap-3"><span className="text-blue-400">2.</span> I do my best work in uninterrupted blocks before 11 AM.</li>
                        <li className="flex gap-3"><span className="text-blue-400">3.</span> Direct, literal feedback is highly preferred.</li>
                    </ul>
                </div>
            </section>

            {/* Zone B & C: Modifiable Trait Cards */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 px-2">How to Work With Me</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {profile.map((p) => (
                        <EditableCard
                            key={p.traitName}
                            title={p.traitName}
                            subtitle={p.workingStyle}
                            value={p.environmentNeed}
                            isVisible={visibility[p.traitName]}
                            onToggleVisibility={() => toggleVisibility(p.traitName)}
                        />
                    ))}
                </div>
            </section>

            {/* Share Modal Overlay */}
            {showShareModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 max-w-lg w-full rounded-3xl p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Share Your Manual</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-8">Customize what you want to share with your manager or team.</p>

                        <div className="space-y-4 mb-8">
                            {profile.map((p) => (
                                <div key={p.traitName} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                    <span className="font-medium text-slate-800 dark:text-slate-200">{p.traitName}</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={visibility[p.traitName]}
                                            onChange={() => toggleVisibility(p.traitName)}
                                        />
                                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
                                <Share2 size={20} /> Generate Secure Link
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 py-4 border-2 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-colors">
                                <Clock size={20} /> Set Expiration (7 Days)
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 py-4 border-2 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-colors">
                                <Download size={20} /> Export as PDF
                            </button>
                        </div>

                        <button
                            onClick={() => setShowShareModal(false)}
                            className="mt-6 w-full py-4 font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
