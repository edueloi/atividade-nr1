import { AdmissionEvaluation, AdmissionTemplate, AdmissionSummary } from './types';

export const mockTemplates: AdmissionTemplate[] = [
  {
    id: 'tpl-1',
    tenant_id: 'toyota-br',
    role_name: 'Operador de Montagem',
    version: '1.2',
    status: 'PUBLISHED',
    fields: [
      { id: 'f1', label: 'Flexibilidade de Tronco (cm)', type: 'number', required: true, group: 'Mobilidade' },
      { id: 'f2', label: 'Dor em Ombros?', type: 'boolean', required: true, group: 'Sintomas' },
      { id: 'f3', label: 'Força de Preensão (kg)', type: 'number', required: true, group: 'Força' },
    ],
    reasons: ['Dor lombar', 'Lesão ombro', 'Limitação mobilidade', 'Histórico cirurgia'],
    updated_at: '2026-03-01'
  },
  {
    id: 'tpl-2',
    tenant_id: 'toyota-br',
    role_name: 'Logística / Empilhadeira',
    version: '1.0',
    status: 'PUBLISHED',
    fields: [
      { id: 'f4', label: 'Acuidade Visual', type: 'boolean', required: true },
      { id: 'f5', label: 'Mobilidade Cervical', type: 'boolean', required: true },
    ],
    updated_at: '2026-02-15'
  }
];

export const mockEvaluations: AdmissionEvaluation[] = [
  {
    id: 'ev-1',
    tenant_id: 'toyota-br',
    unit_id: 'u1',
    unit_name: 'Unidade 1',
    sector_id: 's1',
    sector_name: 'Montagem',
    role_name: 'Operador de Montagem',
    template_id: 'tpl-1',
    template_version: '1.2',
    evaluation_date: '2026-03-05',
    result: 'RECOMMENDED',
    status: 'COMPLETED',
    reasons: [],
    scores: { f1: 25, f2: false, f3: 42 },
    evaluator_name: 'Ricardo Prof',
    evaluator_id: 'u-1',
    attachments: []
  },
  {
    id: 'ev-2',
    tenant_id: 'toyota-br',
    unit_id: 'u1',
    unit_name: 'Unidade 1',
    sector_id: 's1',
    sector_name: 'Montagem',
    role_name: 'Operador de Montagem',
    template_id: 'tpl-1',
    template_version: '1.2',
    evaluation_date: '2026-03-06',
    result: 'RESTRICTED',
    status: 'COMPLETED',
    reasons: ['Dor lombar'],
    scores: { f1: 10, f2: false, f3: 38 },
    evaluator_name: 'Ricardo Prof',
    evaluator_id: 'u-1',
    attachments: []
  },
  {
    id: 'ev-3',
    tenant_id: 'toyota-br',
    unit_id: 'u2',
    unit_name: 'Unidade 2',
    sector_id: 's2',
    sector_name: 'Logística',
    role_name: 'Logística / Empilhadeira',
    template_id: 'tpl-2',
    template_version: '1.0',
    evaluation_date: '2026-03-07',
    result: 'NOT_RECOMMENDED',
    status: 'DRAFT',
    reasons: ['Limitação mobilidade'],
    scores: { f4: true, f5: false },
    evaluator_name: 'Dra. Maria',
    evaluator_id: 'u-2',
    attachments: []
  }
];

export const mockSummary: AdmissionSummary = {
  totalEvaluations: 156,
  recommendedRate: 82,
  restrictedRate: 12,
  notRecommendedRate: 6,
  resultDistribution: [
    { name: 'Recomendados', value: 128 },
    { name: 'Restrição', value: 19 },
    { name: 'Não Recomendados', value: 9 }
  ],
  monthlyTrend: [
    { month: 'Out', rate: 4 },
    { month: 'Nov', rate: 5 },
    { month: 'Dez', rate: 8 },
    { month: 'Jan', rate: 6 },
    { month: 'Fev', rate: 7 },
    { month: 'Mar', rate: 6 }
  ],
  frequentReasons: [
    { reason: 'Dor lombar', count: 12 },
    { reason: 'Lesão ombro', count: 8 },
    { reason: 'Limitação mobilidade', count: 5 },
    { reason: 'Histórico cirurgia', count: 3 }
  ],
  topCriticalRoles: [
    { role: 'Operador de Montagem', count: 5 },
    { role: 'Soldador', count: 3 },
    { role: 'Logística / Empilhadeira', count: 1 }
  ]
};
