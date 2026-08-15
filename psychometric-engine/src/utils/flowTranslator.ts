import { Edge as FlowEdge, Node as FlowNode } from 'reactflow';
import { AssessmentSchema, Node as SchemaNode, LogicEdge, ScoringRule } from '../types/schema';

/**
 * Converts React Flow Edges into our JSON Schema `logic_edges` array.
 */
export function formatEdgesToBranchingLogic(edges: FlowEdge[]): LogicEdge[] {
  const logicMap: Record<string, LogicEdge> = {};

  edges.forEach(edge => {
      const sourceId = edge.source;
      const targetId = edge.target;

      if (!logicMap[sourceId]) {
          logicMap[sourceId] = {
              from_node: sourceId,
              conditions: []
          };
      }

      // Default translation strategy:
      // If the edge has no label or specific condition, we assume it's the "default" route.
      // In a more complex implementation, the label might contain the `option_id` it corresponds to.

      const isDefault = !edge.label || edge.label === 'Default';

      if (isDefault) {
          logicMap[sourceId].conditions.push({
              operator: 'default',
              go_to_node: targetId
          });
      } else {
          logicMap[sourceId].conditions.unshift({ // Put explicit conditions before default
              operator: 'equals',
              target_option: edge.label as string,
              go_to_node: targetId
          });
      }
  });

  return Object.values(logicMap);
}

/**
 * Converts React Flow Nodes into our JSON Schema `nodes` array.
 */
export function formatNodesToSchema(nodes: FlowNode[]): SchemaNode[] {
    return nodes.map(n => ({
        id: n.id,
        type: n.data.questionType || 'single_choice',
        text: n.data.text || '',
        options: n.data.options,
        ui_config: n.data.ui_config
    }));
}

/**
 * Generates the final Assessment JSON.
 */
export function generateFinalJSON(
    nodes: FlowNode[],
    edges: FlowEdge[],
    scoringRules: ScoringRule[]
): AssessmentSchema {
    return {
        id: "generated-assessment-" + Date.now(),
        title: "Generated Assessment",
        version: "1.0",
        config: {
            allow_back_navigation: true
        },
        nodes: formatNodesToSchema(nodes),
        logic_edges: formatEdgesToBranchingLogic(edges),
        scoring_rules: scoringRules
    };
}
