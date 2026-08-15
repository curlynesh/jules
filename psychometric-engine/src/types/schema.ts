export type QuestionType = 'single_choice' | 'multiple_choice' | 'likert' | 'situational' | 'binary' | 'open_text';

export type AnswerType = string | number | boolean;

export interface AssessmentConfig {
  allow_back_navigation?: boolean;
  theme_overrides?: {
    default_font?: string;
    [key: string]: string | undefined;
  };
}

export interface Option {
  id: string;
  label: string;
  value: AnswerType;
}

export interface UIConfig {
  allow_audio_response?: boolean;
  show_clarification_tooltip?: string;
  max_length?: number;
}

export interface Node {
  id: string;
  type: QuestionType;
  text: string;
  options?: Option[];
  ui_config?: UIConfig;
}

export interface LogicCondition {
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'default';
  target_option?: AnswerType; // Usually matches the Option.id or value
  go_to_node: string;
}

export interface LogicEdge {
  from_node: string;
  conditions: LogicCondition[];
}

export interface ScoringRule {
  node_id: string;
  option_id?: string; // Specific answer choice (if applicable)
  trait_category: string;
  weight_modifier: number;
}

export interface TraitThreshold {
  max: number;
  style: string;
  need: string;
}

export interface TraitMetadata {
  maxPossibleScore: number;
  thresholds: TraitThreshold[];
}

export interface TraitProfile {
  traitName: string;
  score: number; // 0-100
  workingStyle: string;
  environmentNeed: string;
}

export interface AssessmentSchema {
  id: string; // Adding required ID field
  title: string; // Adding required Title field
  version: string;
  config?: AssessmentConfig;
  nodes: Node[];
  logic_edges: LogicEdge[];
  scoring_rules: ScoringRule[];
  trait_metadata?: Record<string, TraitMetadata>;
}

// --- Enterprise Integration & Compliance Types ---

export interface UserSession {
  id: string;
  external_candidate_id: string;
  source_system: string;
  status: 'pending' | 'in-progress' | 'completed';
  version_id: string;
  created_at: string;
}

export interface ConsentLog {
  id: string;
  user_id: string; // Internal User/Session ID
  action: 'SHARED_WITH_MANAGER' | 'EXPORTED_PDF' | 'REVOKED_ACCESS' | 'DATA_ANONYMIZED';
  target_email?: string;
  timestamp: string;
  ip_address: string;
}
