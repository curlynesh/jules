import React, { useState } from 'react';
import { Accommodation, DisclosureLevel } from '../../types/accommodations';
import { FileText, Send, Lock, Eye, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    selectedAccommodations: Accommodation[];
    onBack: () => void;
}

export const DisclosureExport: React.FC<Props> = ({ selectedAccommodations, onBack }) => {
    const [level, setLevel] = useState<DisclosureLevel>('needs_based');
    const [diagnosis, setDiagnosis] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const getIntroText = () => {
        switch (level) {
            case 'full_medical':
                return `I am requesting reasonable accommodations under the ADA for my diagnosis of ${diagnosis || '[Diagnosis]'}. Below are the specific requests recommended by my psychometric profile to operate at peak efficiency.`;
            case 'broad_neurodivergent':
                return "As a neurodivergent professional, I thrive when my environment is structured to support my cognitive profile. I am officially requesting the following reasonable accommodations.";
            case 'needs_based':
            default:
                return "To operate at peak efficiency and deliver my best work, I am requesting the following environmental tools and workflows based on my cognitive working style.";
        }
    };

    const handleSubmitToHR = async () => {
        setIsSubmitting(true);
        // Simulate API push to HRIS (Workday/BambooHR)
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setSubmitted(true);
        toast.success("Successfully routed to HRIS");
    };

    if (submitted) {
        return (
            <div className="max-w-2xl w-full mx-auto p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl text-center space-y-6 animate-in zoom-in-95">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send size={40} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Ticket Submitted Securely</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Your request has been routed directly to the Benefits Coordinator via our secure HRIS integration, bypassing your direct manager&apos;s inbox for privacy.
                </p>
                <button onClick={onBack} className="mt-8 text-blue-600 font-bold hover:underline">Return to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl w-full mx-auto p-6 md:p-12 space-y-10 animate-in fade-in slide-in-from-bottom-4">

            <div className="flex items-center gap-4 border-b pb-6 dark:border-slate-700">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex-1">Finalize Request</h2>
                <button onClick={onBack} className="text-slate-500 font-bold">Cancel</button>
            </div>

            {/* The Disclosure Dial */}
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Lock className="text-blue-500" /> The Disclosure Dial
                </h3>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {[
                        { id: 'needs_based', label: 'Needs-Based', desc: 'No disclosure. Focus on workflow.', icon: Lock },
                        { id: 'broad_neurodivergent', label: 'Neurodivergent', desc: 'Broad disclosure. Reduced stigma.', icon: Eye },
                        { id: 'full_medical', label: 'Full Medical', desc: 'ADA Compliance. Requires diagnosis.', icon: AlertTriangle }
                    ].map(opt => {
                        const Icon = opt.icon;
                        const isActive = level === opt.id;
                        return (
                            <button
                                key={opt.id}
                                onClick={() => setLevel(opt.id as DisclosureLevel)}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${
                                    isActive
                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30'
                                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-blue-400'
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Icon size={16} className={isActive ? 'text-blue-600' : 'text-slate-500'} />
                                    <span className={`font-bold ${isActive ? 'text-blue-900 dark:text-blue-100' : 'text-slate-700 dark:text-slate-200'}`}>
                                        {opt.label}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{opt.desc}</p>
                            </button>
                        )
                    })}
                </div>

                {level === 'full_medical' && (
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Medical Diagnosis</label>
                        <input
                            type="text"
                            placeholder="e.g. ADHD, Autism Spectrum Disorder"
                            value={diagnosis}
                            onChange={e => setDiagnosis(e.target.value)}
                            className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}

                {/* Preview Document */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-inner">
                    <div className="text-center mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
                        <h1 className="text-2xl font-serif text-slate-900 dark:text-white">Official Accommodation Request</h1>
                    </div>

                    <p className="text-lg leading-relaxed text-slate-800 dark:text-slate-200 mb-8 italic">
                        &quot;{getIntroText()}&quot;
                    </p>

                    <div className="space-y-6">
                        {selectedAccommodations.map((acc, i) => (
                            <div key={i} className="pl-6 border-l-4 border-slate-300 dark:border-slate-600">
                                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{acc.title}</h4>
                                <p className="text-slate-700 dark:text-slate-300 mb-3">{acc.description}</p>
                                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                                    Business Justification: <span className="font-medium normal-case text-slate-600 dark:text-slate-400">{acc.business_justification}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => toast("Exporting PDF...")}
                  className="flex-1 py-4 flex justify-center items-center gap-2 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                    <FileText size={20} /> Export as PDF
                </button>
                <button
                    onClick={handleSubmitToHR}
                    disabled={isSubmitting || (level === 'full_medical' && !diagnosis.trim())}
                    className="flex-1 py-4 flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-lg"
                >
                    {isSubmitting ? 'Routing Securely...' : <><Send size={20} /> Submit to HRIS</>}
                </button>
            </div>
        </div>
    );
};
