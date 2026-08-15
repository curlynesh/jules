export type QuestionType = 'likert' | 'situational' | 'binary' | 'open_text';

export type AnswerType = string | number | boolean;

export interface TraitMapping {
  traitId: string;
  weight: number;
}

export interface Option {
  id: string;
  text: string;
  value: AnswerType; // Numeric for scoring, string for open text
  traitMappings?: TraitMapping[];
  nextId?: string; // For explicit branching directly from an option
}

export interface QuestionNode {
  type: 'question';
  id: string;
  questionType: QuestionType;
  text: string;
  description?: string;
  options?: Option[];
  allowAudioVideo?: boolean; // True for open_text to allow multi-modal
}

export interface Condition {
  questionId: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: AnswerType;
  nextId: string;
}

export interface LogicNode {
  type: 'logic';
  id: string;
  conditions: Condition[];
  defaultNextId: string;
}

export type AssessmentNode = QuestionNode | LogicNode;

export interface Trait {
  id: string;
  name: string;
  description: string;
}

export interface ScoringRule {
  traitId: string;
  minScore: number;
  maxScore: number;
  description: string;
}

export interface AssessmentSchema {
  id: string;
  version: string;
  title: string;
  description: string;
  traits: Trait[];
  nodes: AssessmentNode[];
  startNodeId: string;
  scoringRules?: ScoringRule[];
}
