import { Edge as FlowEdge, Node as FlowNode } from 'reactflow';

export interface ValidationError {
    type: 'ORPHAN_NODE' | 'DEAD_END' | 'MISSING_TEXT';
    nodeId: string;
    message: string;
}

/**
 * Validates the React Flow state before allowing a JSON export.
 */
export function validateFlowGraph(nodes: FlowNode[], edges: FlowEdge[]): ValidationError[] {
    const errors: ValidationError[] = [];

    // 1. Check for missing text
    nodes.forEach(node => {
        if (!node.data.text || node.data.text.trim() === '') {
            errors.push({
                type: 'MISSING_TEXT',
                nodeId: node.id,
                message: `Node ${node.id} is missing question text.`
            });
        }
    });

    // 2. Check for Dead Ends (Nodes with no outgoing edges, unless it's explicitly the last node)
    // For a robust system, we assume if it's not the target of NO edges, it might be the start.
    // But if it has no targets, it's an end node. If there are multiple end nodes, that's fine.

    // 3. Check for Orphan Nodes (Nodes with no incoming OR outgoing edges, ignoring single-node graphs)
    if (nodes.length > 1) {
        nodes.forEach(node => {
            const hasIncoming = edges.some(e => e.target === node.id);
            const hasOutgoing = edges.some(e => e.source === node.id);

            if (!hasIncoming && !hasOutgoing) {
                errors.push({
                    type: 'ORPHAN_NODE',
                    nodeId: node.id,
                    message: `Node ${node.id} is completely disconnected from the flow.`
                });
            }
        });
    }

    return errors;
}
