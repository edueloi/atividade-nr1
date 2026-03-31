// GRO/PGR Type Definitions — NR-1 Compliance

export type RiskType = 'PHYSICAL' | 'CHEMICAL' | 'BIOLOGICAL' | 'ERGONOMIC' | 'ACCIDENT' | 'PSYCHOSOCIAL';
export type RiskClassification = 'TRIVIAL' | 'TOLERABLE' | 'MODERATE' | 'SUBSTANTIAL' | 'INTOLERABLE';
export type RiskStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';
export type ApprovalArea = 'Segurança' | 'Ergonomia' | 'Gerência Operacional' | 'RH' | 'Manutenção' | 'Médico';
export type ActionPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ActionStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'OVERDUE';

export interface GROEstablishment {
  id: string;
  tenantId: string;
  name: string;
  cnpj?: string;
  address?: string;
}

export interface GROSector {
  id: string;
  establishmentId: string;
  name: string;
  description?: string;
}

export interface GRORole {
  id: string;
  sectorId: string;
  name: string;
  cbo?: string;
}

export interface GROActivity {
  id: string;
  sectorId: string;
  roleId?: string;
  name: string;
  description?: string;
  frequency?: 'CONTINUOUS' | 'FREQUENT' | 'OCCASIONAL' | 'RARE';
}

export interface ApprovalStep {
  area: ApprovalArea;
  approvedBy: string | null;
  date: string | null;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
}

export interface RiskRevision {
  version: number;
  changedBy: string;
  changedAt: string;
  trigger: string;
  notes: string;
}

export interface PsychosocialExtension {
  source: 'OVERLOAD' | 'HARASSMENT' | 'LACK_OF_SUPPORT' | 'ROLE_CONFLICT' | 'ABUSIVE_GOALS' | 'LOW_AUTONOMY' | 'OTHER';
  frequency: 'ALWAYS' | 'OFTEN' | 'SOMETIMES' | 'RARELY';
  perceivedIntensity: 1 | 2 | 3 | 4 | 5;
  organizationalEvidence: string;
  nr17LinkNeeded: boolean;
}

export interface RiskInventoryItem {
  id: string;
  tenantId: string;
  establishmentId: string;
  sectorId: string;
  activityId: string;
  roleId: string;
  hazardDescription: string;
  hazardSource: string;
  hazardCircumstances: string;
  possibleInjuries: string;
  exposedWorkers: number;
  existingMeasures: string;
  exposureCharacterization: string;
  riskType: RiskType;
  severity: 1 | 2 | 3 | 4 | 5;
  probability: 1 | 2 | 3 | 4 | 5;
  riskLevel: number;
  riskClassification: RiskClassification;
  decision: string;
  status: RiskStatus;
  approvals: ApprovalStep[];
  revisionHistory: RiskRevision[];
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  psychosocial?: PsychosocialExtension;
}

export interface GROActionItem {
  id: string;
  riskId: string;
  action: string;
  responsible: string;
  deadline: string;
  priority: ActionPriority;
  status: ActionStatus;
  evidence: string[];
  efficacyVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClassificationRule {
  minLevel: number;
  maxLevel: number;
  classification: RiskClassification;
  color: string;
  recommendedAction: string;
}

export interface CriteriaMatrix {
  id: string;
  tenantId: string;
  severityLabels: Record<1 | 2 | 3 | 4 | 5, string>;
  probabilityLabels: Record<1 | 2 | 3 | 4 | 5, string>;
  classificationRules: ClassificationRule[];
  updatedAt: string;
}

export interface GRODocument {
  id: string;
  tenantId: string;
  type: 'INVENTORY' | 'ACTION_PLAN' | 'PGR_FULL';
  name: string;
  version: number;
  generatedAt: string;
  generatedBy: string;
  trigger: string;
  status: 'generated' | 'signed';
}

// Risk type labels
export const RISK_TYPE_LABEL: Record<RiskType, string> = {
  PHYSICAL: 'Físico',
  CHEMICAL: 'Químico',
  BIOLOGICAL: 'Biológico',
  ERGONOMIC: 'Ergonômico',
  ACCIDENT: 'Acidente',
  PSYCHOSOCIAL: 'Psicossocial',
};

export const RISK_TYPE_COLOR: Record<RiskType, string> = {
  PHYSICAL: 'bg-orange-100 text-orange-700',
  CHEMICAL: 'bg-purple-100 text-purple-700',
  BIOLOGICAL: 'bg-lime-100 text-lime-700',
  ERGONOMIC: 'bg-blue-100 text-blue-700',
  ACCIDENT: 'bg-rose-100 text-rose-700',
  PSYCHOSOCIAL: 'bg-indigo-100 text-indigo-700',
};

export const CLASSIFICATION_COLOR: Record<RiskClassification, string> = {
  TRIVIAL: 'bg-emerald-100 text-emerald-700',
  TOLERABLE: 'bg-blue-100 text-blue-700',
  MODERATE: 'bg-amber-100 text-amber-700',
  SUBSTANTIAL: 'bg-orange-100 text-orange-700',
  INTOLERABLE: 'bg-rose-100 text-rose-700',
};

export const CLASSIFICATION_LABEL: Record<RiskClassification, string> = {
  TRIVIAL: 'Trivial',
  TOLERABLE: 'Tolerável',
  MODERATE: 'Moderado',
  SUBSTANTIAL: 'Substancial',
  INTOLERABLE: 'Intolerável',
};

export const STATUS_LABEL: Record<RiskStatus, string> = {
  DRAFT: 'Rascunho',
  IN_REVIEW: 'Em Revisão',
  APPROVED: 'Aprovado',
  PUBLISHED: 'Publicado',
  ARCHIVED: 'Arquivado',
};

export const STATUS_COLOR: Record<RiskStatus, string> = {
  DRAFT: 'bg-zinc-100 text-zinc-600',
  IN_REVIEW: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  PUBLISHED: 'bg-blue-100 text-blue-700',
  ARCHIVED: 'bg-zinc-100 text-zinc-400',
};

export const ACTION_STATUS_LABEL: Record<ActionStatus, string> = {
  PENDING: 'Pendente',
  IN_PROGRESS: 'Em Andamento',
  DONE: 'Concluída',
  OVERDUE: 'Vencida',
};

export const PRIORITY_LABEL: Record<ActionPriority, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
};

export const PRIORITY_COLOR: Record<ActionPriority, string> = {
  LOW: 'bg-zinc-100 text-zinc-600',
  MEDIUM: 'bg-blue-100 text-blue-700',
  HIGH: 'bg-amber-100 text-amber-700',
  CRITICAL: 'bg-rose-100 text-rose-700',
};

export const PSYCHOSOCIAL_SOURCE_LABEL: Record<PsychosocialExtension['source'], string> = {
  OVERLOAD: 'Sobrecarga de trabalho',
  HARASSMENT: 'Assédio moral/sexual',
  LACK_OF_SUPPORT: 'Falta de apoio da gestão',
  ROLE_CONFLICT: 'Conflito de papéis',
  ABUSIVE_GOALS: 'Metas abusivas',
  LOW_AUTONOMY: 'Baixa autonomia',
  OTHER: 'Outro',
};

export function calculateRiskLevel(severity: number, probability: number): number {
  return severity * probability;
}

export function classifyRisk(level: number): RiskClassification {
  if (level <= 4) return 'TRIVIAL';
  if (level <= 9) return 'TOLERABLE';
  if (level <= 14) return 'MODERATE';
  if (level <= 19) return 'SUBSTANTIAL';
  return 'INTOLERABLE';
}
