import { ClosingMonth, ClosingIssue, ClosingRule, ClosingSummary } from './types';

export const mockClosingMonths: ClosingMonth[] = [
  {
    id: 'cm-1',
    tenant_id: 't1',
    month: '2026-03',
    status: 'REVIEW',
    created_at: '2026-03-01T00:00:00Z'
  },
  {
    id: 'cm-2',
    tenant_id: 't1',
    month: '2026-02',
    status: 'CLOSED',
    closed_by: 'Eduardo Eloi',
    closed_at: '2026-03-02T14:30:00Z',
    created_at: '2026-02-01T00:00:00Z'
  },
  {
    id: 'cm-3',
    tenant_id: 't1',
    month: '2026-01',
    status: 'CLOSED',
    closed_by: 'Eduardo Eloi',
    closed_at: '2026-02-02T10:00:00Z',
    created_at: '2026-01-01T00:00:00Z'
  }
];

export const mockClosingIssues: ClosingIssue[] = [
  {
    id: 'ci-1',
    month_id: 'cm-1',
    module: 'Aula + Presença',
    severity: 'CRITICAL',
    ref_type: 'class',
    ref_id: 'class-123',
    message: 'Aula concluída sem presença registrada',
    suggestion: 'Registrar presença para a sessão de 05/03',
    status: 'OPEN'
  },
  {
    id: 'ci-2',
    month_id: 'cm-1',
    module: 'Absenteísmo',
    severity: 'CRITICAL',
    ref_type: 'absenteeism',
    ref_id: 'abs-456',
    message: 'Atestado sem anexo',
    suggestion: 'Fazer upload do documento comprobatório',
    status: 'OPEN'
  },
  {
    id: 'ci-3',
    month_id: 'cm-1',
    module: 'Plano de Ação',
    severity: 'IMPORTANT',
    ref_type: 'action',
    ref_id: 'act-789',
    message: 'Ação concluída sem evidência obrigatória',
    suggestion: 'Vincular foto ou documento de conclusão',
    status: 'OPEN'
  },
  {
    id: 'ci-4',
    month_id: 'cm-1',
    module: 'Fisioterapia',
    severity: 'INFO',
    ref_type: 'fisioterapia',
    ref_id: 'fis-101',
    message: 'Caso ativo sem sessão há 10 dias',
    suggestion: 'Verificar se o paciente ainda está em tratamento',
    status: 'OPEN'
  },
  {
    id: 'ci-5',
    month_id: 'cm-1',
    module: 'NR1',
    severity: 'CRITICAL',
    ref_type: 'nr1',
    ref_id: 'nr1-202',
    message: 'Ciclo ativo expirado não encerrado',
    suggestion: 'Encerrar ciclo ou renovar vigência',
    status: 'OPEN'
  }
];

export const mockClosingRules: ClosingRule[] = [
  {
    id: 'cr-1',
    tenant_id: 't1',
    code: 'CLASS_WITHOUT_ATTENDANCE',
    label: 'Aula sem presença',
    description: 'Bloquear fechamento se existir aula concluída sem presença',
    severity: 'CRITICAL',
    is_enabled: true
  },
  {
    id: 'cr-2',
    tenant_id: 't1',
    code: 'ABSENTEEISM_WITHOUT_ATTACHMENT',
    label: 'Atestado sem anexo',
    description: 'Bloquear fechamento se existir atestado sem anexo',
    severity: 'CRITICAL',
    is_enabled: true
  },
  {
    id: 'cr-3',
    tenant_id: 't1',
    code: 'ACTION_WITHOUT_EVIDENCE',
    label: 'Ação sem evidência',
    description: 'Bloquear fechamento se existir ação concluída sem evidência',
    severity: 'IMPORTANT',
    is_enabled: true
  },
  {
    id: 'cr-4',
    tenant_id: 't1',
    code: 'NR1_EXPIRED_CYCLE',
    label: 'NR1 Ciclo Expirado',
    description: 'Bloquear fechamento se NR1 ciclo ativo não encerrado',
    severity: 'CRITICAL',
    is_enabled: true
  },
  {
    id: 'cr-5',
    tenant_id: 't1',
    code: 'ALLOW_IMPORTANT_ISSUES',
    label: 'Permitir pendências importantes',
    description: 'Permitir fechar com pendências importantes (com justificativa)',
    severity: 'INFO',
    is_enabled: false
  }
];

export const mockClosingSummary: ClosingSummary = {
  totalIssues: 12,
  criticalIssues: 3,
  importantIssues: 5,
  modulesOk: 4,
  reportsGenerated: 2,
  evidencesCount: 45,
  progressByModule: [
    { module: 'Aula + Presença', total: 20, done: 18, status: 'PENDING' },
    { module: 'Queixas', total: 10, done: 10, status: 'OK' },
    { module: 'Fisioterapia', total: 15, done: 14, status: 'PENDING' },
    { module: 'Absenteísmo', total: 30, done: 25, status: 'CRITICAL' },
    { module: 'Ergonomia', total: 5, done: 5, status: 'OK' },
    { module: 'NR1', total: 8, done: 7, status: 'CRITICAL' },
    { module: 'Campanhas', total: 1, done: 1, status: 'OK' },
    { module: 'Plano de Ação', total: 12, done: 10, status: 'PENDING' },
    { module: 'Evidências', total: 45, done: 45, status: 'OK' }
  ]
};
