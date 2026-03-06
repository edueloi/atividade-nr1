export type PlanStatus = 'Aberto' | 'Em andamento' | 'Em validação' | 'Concluído' | 'Cancelado';
export type ActionStatus = 'Pendente' | 'Em andamento' | 'Aguardando evidência' | 'Concluída' | 'Atrasada' | 'Cancelada';
export type Priority = 'Baixa' | 'Média' | 'Alta';
export type Origin = 'NR1' | 'Ergo' | 'Queixa' | 'Fisio' | 'Absenteísmo';

export interface ActionPlan {
  id: string;
  name: string;
  origin: Origin;
  unit: string;
  sector: string;
  status: PlanStatus;
  priority: Priority;
  progress: number; // 0 to 100
  dueDate: string;
  responsible: string;
  description?: string;
  actionsCount: number;
  completedActionsCount: number;
}

export interface ActionItem {
  id: string;
  planId: string;
  planName?: string;
  title: string;
  description?: string;
  sector: string;
  unit: string;
  responsible: string;
  dueDate: string;
  status: ActionStatus;
  priority: Priority;
  evidenceRequired: boolean;
  hasEvidence: boolean;
  origin?: Origin;
}

export interface PlanTimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  user: string;
  type: 'status' | 'action' | 'evidence' | 'comment';
}

export interface Evidence {
  id: string;
  name: string;
  type: 'foto' | 'pdf' | 'comprovante';
  category: 'antes' | 'depois' | 'comprovante';
  url: string;
  date: string;
  user: string;
  description?: string;
}
