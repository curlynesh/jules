'use client';

import React, { useState, useCallback } from 'react';
import ReactFlow, {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    Background,
    Controls,
    Node as FlowNode,
    Edge as FlowEdge,
    Connection
} from 'reactflow';
import 'reactflow/dist/style.css';

import { InspectorPanel } from './InspectorPanel';
import { CustomQuestionNode } from './CustomNodes';
import { ScoringRule } from '../../types/schema';
import { Save, AlertTriangle } from 'lucide-react';
import { generateFinalJSON } from '../../utils/flowTranslator';
import { validateFlowGraph, ValidationError } from '../../utils/flowValidation';
import { toast } from 'sonner';

const nodeTypes = { custom_question: CustomQuestionNode };

const initialNodes: FlowNode[] = [
  {
    id: 'q_1',
    type: 'custom_question',
    position: { x: 250, y: 100 },
    data: {
        text: 'Do you prefer written or verbal feedback?',
        questionType: 'binary',
        options: [
            { id: 'opt_1', label: 'Written', value: 'written' },
            { id: 'opt_2', label: 'Verbal', value: 'verbal' }
        ],
        ui_config: {}
    },
  },
  {
    id: 'q_2',
    type: 'custom_question',
    position: { x: 250, y: 350 },
    data: {
        text: 'What tools do you use for written feedback?',
        questionType: 'open_text',
        ui_config: { allow_audio_response: true }
    },
  }
];

const initialEdges: FlowEdge[] = [
    { id: 'e1-2', source: 'q_1', target: 'q_2', animated: true, label: 'Default' }
];

export const AssessmentBuilder = () => {
  const [nodes, setNodes] = useState<FlowNode[]>(initialNodes);
  const [edges, setEdges] = useState<FlowEdge[]>(initialEdges);
  const [scoringRules, setScoringRules] = useState<ScoringRule[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const onNodesChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateNodeData = (nodeId: string, newData: any) => {
      setNodes(nds => nds.map(n => {
          if (n.id === nodeId) {
              return { ...n, data: newData };
          }
          return n;
      }));
  };

  const handleSave = () => {
      const validationErrors = validateFlowGraph(nodes, edges);
      setErrors(validationErrors);

      if (validationErrors.length === 0) {
          const finalJSON = generateFinalJSON(nodes, edges, scoringRules);
          console.log("JSON Output:", JSON.stringify(finalJSON, null, 2));
          toast.success("JSON Generated successfully. Check the developer console.");
      } else {
          toast.error("Validation failed. Please fix the errors before publishing.");
      }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-slate-50 dark:bg-slate-900 overflow-hidden">

      {/* Top Bar */}
      <div className="absolute top-20 left-4 z-10 flex flex-col gap-2">
        <div className="flex gap-4 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm"
            >
                <Save size={16} /> Publish JSON
            </button>
        </div>

        {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-xl shadow-lg w-72 animate-in slide-in-from-left-4">
                <h4 className="text-red-800 font-bold text-sm flex items-center gap-1 mb-2">
                    <AlertTriangle size={14} /> Validation Errors
                </h4>
                <ul className="text-xs text-red-600 space-y-1 pl-4 list-disc">
                    {errors.map((e, i) => <li key={i}>{e.message}</li>)}
                </ul>
            </div>
        )}
      </div>

      {/* The Visual Canvas */}
      <div className="flex-grow relative h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, node) => setSelectedNodeId(node.id)}
          onPaneClick={() => setSelectedNodeId(null)}
          fitView
          className="bg-slate-50 dark:bg-slate-900"
        >
          <Background color="#94a3b8" gap={16} />
          <Controls className="bg-white dark:bg-slate-800 shadow-xl border-none fill-slate-700 dark:fill-slate-300" />
        </ReactFlow>
      </div>

      {/* The Detail Inspector */}
      {selectedNodeId && (
        <InspectorPanel
          nodeId={selectedNodeId}
          nodeData={nodes.find(n => n.id === selectedNodeId)?.data}
          updateNodeData={(newData) => updateNodeData(selectedNodeId, newData)}
          scoringRules={scoringRules}
          updateScoringRules={setScoringRules}
          onClose={() => setSelectedNodeId(null)}
        />
      )}
    </div>
  );
}

export default AssessmentBuilder;
