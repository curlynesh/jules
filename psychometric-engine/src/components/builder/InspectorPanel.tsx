import React, { useState } from 'react';
import { ScoringRule, Node as SchemaNode } from '../../types/schema';
import { X, Plus, Trash2 } from 'lucide-react';

interface Props {
  nodeId: string;
  nodeData: Partial<SchemaNode> & { questionType?: string };
  updateNodeData: (newData: Partial<SchemaNode> & { questionType?: string }) => void;
  scoringRules: ScoringRule[];
  updateScoringRules: (rules: ScoringRule[]) => void;
  onClose: () => void;
}

export const InspectorPanel: React.FC<Props> = ({
    nodeId,
    nodeData,
    updateNodeData,
    scoringRules,
    updateScoringRules,
    onClose
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'accessibility' | 'scoring'>('content');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData({ ...nodeData, text: e.target.value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateNodeData({ ...nodeData, questionType: e.target.value });
  };

  // Filter rules specifically for this node
  const nodeRules = scoringRules.filter(r => r.node_id === nodeId);

  const addRule = (optionId: string) => {
      const newRule: ScoringRule = {
          node_id: nodeId,
          option_id: optionId,
          trait_category: 'New_Trait',
          weight_modifier: 1.0
      };
      updateScoringRules([...scoringRules, newRule]);
  };

  const removeRule = (ruleToRemove: ScoringRule) => {
      updateScoringRules(scoringRules.filter(r => r !== ruleToRemove));
  };

  return (
    <div className="w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl z-10">

      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div>
              <h2 className="font-bold text-slate-900 dark:text-white">Node Inspector</h2>
              <p className="text-xs text-slate-500 font-mono">{nodeId}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500">
              <X size={18} />
          </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
          {(['content', 'accessibility', 'scoring'] as const).map(tab => (
              <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
              >
                  {tab}
              </button>
          ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">

        {activeTab === 'content' && (
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Question Type</label>
                    <select
                        value={nodeData.questionType || 'single_choice'}
                        onChange={handleTypeChange}
                        className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                        <option value="single_choice">Single Choice</option>
                        <option value="binary">Binary</option>
                        <option value="likert">Likert Scale</option>
                        <option value="open_text">Open Text</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Question Text</label>
                    <textarea
                        value={nodeData.text || ''}
                        onChange={handleTextChange}
                        rows={4}
                        className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        )}

        {activeTab === 'accessibility' && (
             <div className="space-y-6">
                 <div>
                    <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Allow Audio Response</span>
                        <input
                            type="checkbox"
                            checked={!!nodeData.ui_config?.allow_audio_response}
                            onChange={(e) => updateNodeData({
                                ...nodeData,
                                ui_config: { ...nodeData.ui_config, allow_audio_response: e.target.checked }
                            })}
                            className="w-4 h-4 accent-blue-600"
                        />
                    </label>
                    <p className="text-xs text-slate-500 mt-1">Shows a microphone fallback for open text questions.</p>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Clarification Tooltip (Literal)</label>
                    <textarea
                        value={nodeData.ui_config?.show_clarification_tooltip || ''}
                        onChange={(e) => updateNodeData({
                            ...nodeData,
                            ui_config: { ...nodeData.ui_config, show_clarification_tooltip: e.target.value }
                        })}
                        rows={3}
                        placeholder="e.g. 'Deep focus means you are fully absorbed...'"
                        className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none text-sm"
                    />
                 </div>
             </div>
        )}

        {activeTab === 'scoring' && (
             <div className="space-y-6">
                 <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                     Map answer options to specific psychometric traits.
                 </p>

                 {nodeData.options?.map((opt: {id: string, label: string}) => (
                     <div key={opt.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                         <div className="flex justify-between items-center mb-3">
                             <span className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{opt.label}</span>
                             <button
                                onClick={() => addRule(opt.id)}
                                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-bold"
                             >
                                 <Plus size={14} /> Trait Impact
                             </button>
                         </div>

                         {/* List rules for this option */}
                         <div className="space-y-2">
                            {nodeRules.filter(r => r.option_id === opt.id).map((rule, idx) => (
                                <div key={idx} className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={rule.trait_category}
                                        readOnly
                                        className="flex-1 text-xs p-2 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                    <input
                                        type="number"
                                        value={rule.weight_modifier}
                                        readOnly
                                        className="w-16 text-xs p-2 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-center"
                                    />
                                    <button onClick={() => removeRule(rule)} className="text-red-500 hover:text-red-700 p-1">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                         </div>
                     </div>
                 ))}

                 {(!nodeData.options || nodeData.options.length === 0) && (
                     <div className="text-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                         <p className="text-sm text-slate-500">No options defined for this node.</p>
                     </div>
                 )}
             </div>
        )}

      </div>
    </div>
  );
};
