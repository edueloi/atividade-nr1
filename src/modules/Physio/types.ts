import { ReactNode } from 'react';

export type ReferralStatus = 'Novo' | 'Em triagem' | 'Agendado' | 'Recusado' | 'Cancelado';
export type CaseStatus = 'Ativo' | 'Em tratamento' | 'Pausado' | 'Concluído (Reabilitado)' | 'Concluído (Encaminhado médico)' | 'Escalou para Absenteísmo' | 'Abandonado';
export type Severity = 'Leve' | 'Moderada' | 'Alta';

export interface Referral {
  id: string;
  date: string;
  origin: 'Queixa' | 'Ambulatório' | 'Ergonomia' | 'NR1';
  unit: string;
  sector: string;
  bodyStructure: string;
  severity: Severity;
  status: ReferralStatus;
  responsible?: string;
  notes?: string;
  attachments?: string[];
}

export interface PhysioCase {
  id: string;
  startDate: string;
  unit: string;
  sector: string;
  bodyStructure: string;
  status: CaseStatus;
  lastSession?: string;
  nextSession?: string;
  objective?: string;
  frequency?: string;
  plannedSessions?: number;
  completedSessions?: number;
  initialPain?: number;
  currentPain?: number;
  referralId?: string;
}

export interface PhysioSession {
  id: string;
  caseId: string;
  date: string;
  time: string;
  professional: string;
  location: string;
  status: 'Agendada' | 'Realizada' | 'Faltou' | 'Cancelada';
  painBefore?: number;
  painAfter?: number;
  interventions?: string[];
  evolution?: string;
  nextAction?: 'Manter' | 'Ajustar' | 'Alta' | 'Médico';
}

export interface PhysioTimelineEvent {
  id: string;
  date: string;
  type: 'Referral' | 'Triage' | 'Session' | 'StatusChange' | 'Note';
  title: string;
  description: string;
  user: string;
}
