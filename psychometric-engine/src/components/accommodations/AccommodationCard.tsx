import React, { useState } from 'react';
import { Accommodation } from '../../types/accommodations';
import { Plus, X, Edit3, Lightbulb } from 'lucide-react';

interface Props {
  accommodation: Accommodation;
  onAccept: (customizedAccommodation: Accommodation) => void;
  onReject: () => void;
}

export const AccommodationCard: React.FC<Props> = ({ accommodation, onAccept, onReject }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [customDescription, setCustomDescription] = useState(accommodation.description);

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg transition-all max-w-lg w-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 tracking-wider">
            {accommodation.category}
          </span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {accommodation.title}
          </h3>
        </div>
        <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Edit Description"
        >
            <Edit3 size={18} />
        </button>
      </div>

      {isEditing ? (
          <textarea
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            className="w-full p-4 border rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 min-h-[100px] focus:ring-2 focus:ring-blue-500 mb-4"
          />
      ) : (
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            {customDescription}
          </p>
      )}

      {/* The Reframe: Showing the user HOW to justify it to their boss */}
      <div className="bg-emerald-50 dark:bg-emerald-900/30 border-l-4 border-emerald-500 p-4 mb-8 rounded-r-xl">
        <p className="text-sm text-emerald-900 dark:text-emerald-100 font-medium flex gap-2 items-start">
          <Lightbulb size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <span><strong className="font-bold">Business Value:</strong> {accommodation.business_justification}</span>
        </p>
      </div>

      <div className="flex gap-4">
        <button
            onClick={() => onAccept({ ...accommodation, description: customDescription })}
            className="flex-1 flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold transition-colors shadow-md"
        >
          <Plus size={18} /> Add Request
        </button>
        <button
            onClick={onReject}
            className="px-6 py-3 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 font-bold rounded-xl transition-colors"
        >
          <X size={18} /> Skip
        </button>
      </div>
    </div>
  );
};
