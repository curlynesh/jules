import { AssessmentSchema, QuestionNode, LogicNode, AssessmentNode, AnswerType } from '../types/schema';

export function getNextNodeId(
  currentNode: AssessmentNode,
  answers: Record<string, AnswerType>,
  schema: AssessmentSchema
): string | null {
  if (currentNode.type === 'question') {
    const questionNode = currentNode as QuestionNode;
    const answer = answers[questionNode.id];

    // Check if the selected option has an explicit nextId
    if (questionNode.options && answer !== undefined) {
      const selectedOption = questionNode.options.find(opt => opt.value === answer);
      if (selectedOption?.nextId) {
        return selectedOption.nextId;
      }
    }
  }

  // Find the next node in the array (linear sequence) if no logic or explicit jump
  const currentIndex = schema.nodes.findIndex(n => n.id === currentNode.id);
  const nextNodeInArray = schema.nodes[currentIndex + 1];

  if (!nextNodeInArray) return null;

  if (nextNodeInArray.type === 'logic') {
    const logicNode = nextNodeInArray as LogicNode;
    for (const condition of logicNode.conditions) {
      const answerVal = answers[condition.questionId];
      if (evaluateCondition(answerVal, condition.operator, condition.value)) {
        return condition.nextId;
      }
    }
    return logicNode.defaultNextId;
  }

  return nextNodeInArray.id;
}

function evaluateCondition(actual: AnswerType, operator: string, expected: AnswerType): boolean {
  switch (operator) {
    case 'equals': return actual === expected;
    case 'not_equals': return actual !== expected;
    case 'greater_than': return typeof actual === 'number' && typeof expected === 'number' && actual > expected;
    case 'less_than': return typeof actual === 'number' && typeof expected === 'number' && actual < expected;
    case 'contains': return typeof actual === 'string' && typeof expected === 'string' && actual.includes(expected);
    default: return false;
  }
}
