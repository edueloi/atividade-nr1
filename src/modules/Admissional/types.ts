export type EvaluationResult = 'RECOMMENDED' | 'RESTRICTED' | 'NOT_RECOMMENDED';
export type EvaluationStatus = 'DRAFT' | 'COMPLETED' | 'REVISION';

export interface AdmissionEvaluation {
  id: string;
  tenant_id: string;
  unit_id: string;
  unit_name: string;
  sector_id: string;
  sector_name: string;
  role_name: string;
  template_id: string;
  template_version: string;
  evaluation_date: string;
  result: EvaluationResult;
  status: EvaluationStatus;
  reasons: string[];
  scores: Record<string, any>;
  notes?: string;
  evaluator_name: string;
  evaluator_id: string;
  attachments: { id: string; name: string; url: string }[];
  linked_action_plan_id?: string;
}

export interface AdmissionTemplate {
  id: string;
  tenant_id: string;
  role_name: string;
  version: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  fields: {
    id: string;
    label: string;
    type: 'number' | 'boolean' | 'select' | 'text';
    options?: string[];
    required: boolean;
    group?: string;
  }[];
  rules?: any;
  reasons?: string[];
  updated_at: string;
}

export interface AdmissionSummary {
  totalEvaluations: number;
  recommendedRate: number;
  restrictedRate: number;
  notRecommendedRate: number;
  resultDistribution: { name: string; value: number }[];
  monthlyTrend: { month: string; rate: number }[];
  frequentReasons: { reason: string; count: number }[];
  topCriticalRoles: { role: string; count: number }[];
}
