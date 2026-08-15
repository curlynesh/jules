import React from 'react';
import { Handle, Position } from 'reactflow';
import { FileText, CheckSquare, List, MessageSquare } from 'lucide-react';
import { Node as SchemaNode } from '../../types/schema';

const icons = {
  single_choice: <CheckSquare size={16} className="text-blue-500" />,
  binary: <CheckSquare size={16} className="text-blue-500" />,
  likert: <List size={16} className="text-emerald-500" />,
  open_text: <FileText size={16} className="text-amber-500" />,
  situational: <MessageSquare size={16} className="text-purple-500" />,
  multiple_choice: <List size={16} className="text-blue-500" />
};

export const CustomQuestionNode = ({ data }: { data: Partial<SchemaNode> & { questionType?: string } }) => {
  return (
    <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-sm w-64">
      {/* Input Handle (Top) */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-slate-400 border-2 border-white dark:border-slate-800"
      />

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
            {icons[data.questionType as keyof typeof icons] || <FileText size={16} />}
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {data.questionType?.replace('_', ' ')}
            </span>
        </div>
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
            {data.text || "Empty Question"}
        </p>
      </div>

      {/* Footer / Info bar */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-b-xl border-t border-slate-100 dark:border-slate-700 flex justify-between text-xs text-slate-500">
          <span>{data.options?.length || 0} Options</span>
          {data.ui_config?.allow_audio_response && <span>🎤</span>}
      </div>

      {/* Output Handle (Bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-2 border-white dark:border-slate-800"
      />
    </div>
  );
};
