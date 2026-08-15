import React, { useState } from 'react';
import { Accommodation } from '../../types/accommodations';
import { AccommodationCard } from './AccommodationCard';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    recommendations: Accommodation[];
    onComplete: (selected: Accommodation[]) => void;
}

export const AccommodationCurator: React.FC<Props> = ({ recommendations, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAccommodations, setSelectedAccommodations] = useState<Accommodation[]>([]);

    const handleAccept = (acc: Accommodation) => {
        setSelectedAccommodations(prev => [...prev, acc]);
        nextCard();
    };

    const handleReject = () => {
        nextCard();
    };

    const nextCard = () => {
        if (currentIndex < recommendations.length) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    if (recommendations.length === 0) {
        return (
            <div className="text-center p-8">
                <p className="text-slate-500">No specific accommodations recommended based on this profile.</p>
                <button onClick={() => onComplete([])} className="mt-4 text-blue-600 font-medium">Continue</button>
            </div>
        );
    }

    if (currentIndex >= recommendations.length) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
                <CheckCircle2 size={64} className="text-green-500" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Curation Complete</h2>
                <p className="text-slate-600 dark:text-slate-400">You&apos;ve selected {selectedAccommodations.length} accommodation requests.</p>
                <button
                    onClick={() => onComplete(selectedAccommodations)}
                    className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg"
                >
                    Review Final Document <ChevronRight size={20} />
                </button>
            </div>
        );
    }

    const currentAcc = recommendations[currentIndex];

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto py-12 px-4">
            <div className="w-full flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Curate Your Requests</h2>
                <span className="text-sm font-medium px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300">
                    {currentIndex + 1} of {recommendations.length}
                </span>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentAcc.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.2 }}
                    className="w-full flex justify-center"
                >
                    <AccommodationCard
                        accommodation={currentAcc}
                        onAccept={handleAccept}
                        onReject={handleReject}
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
