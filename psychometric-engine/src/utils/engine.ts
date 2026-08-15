import { AssessmentSchema, Node, AnswerType } from '../types/schema';

export function getNextNodeId(
  currentNode: Node,
  answers: Record<string, AnswerType>,
  schema: AssessmentSchema
): string | null {
  const currentAnswer = answers[currentNode.id];

  // Find the edge originating from the current node
  const edge = schema.logic_edges?.find(e => e.from_node === currentNode.id);

  if (edge) {
    for (const condition of edge.conditions) {
      if (condition.operator === 'default') {
        return condition.go_to_node;
      }

      if (evaluateCondition(currentAnswer, condition.operator, condition.target_option)) {
        return condition.go_to_node;
      }
    }
  }

  // If no explicit logic edge exists, move to the next node in the array (linear fallback)
  const currentIndex = schema.nodes.findIndex(n => n.id === currentNode.id);
  const nextNode = schema.nodes[currentIndex + 1];

  return nextNode ? nextNode.id : null;
}

function evaluateCondition(actual: AnswerType | undefined, operator: string, expected: AnswerType | undefined): boolean {
  if (actual === undefined || expected === undefined) return false;

  switch (operator) {
    case 'equals': return actual === expected;
    case 'not_equals': return actual !== expected;
    case 'greater_than': return typeof actual === 'number' && typeof expected === 'number' && actual > expected;
    case 'less_than': return typeof actual === 'number' && typeof expected === 'number' && actual < expected;
    case 'contains': return typeof actual === 'string' && typeof expected === 'string' && actual.includes(expected);
    default: return false;
  }
}
