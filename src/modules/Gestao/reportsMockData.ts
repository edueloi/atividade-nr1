import { ReportJob, ReportTemplate, ShareLink } from './reportsTypes';

export const mockReportJobs: ReportJob[] = [
  {
    id: 'job-1',
    name: 'Relatório Mensal Consolidado - Março 2026',
    type: 'EXECUTIVE',
    format: 'PDF',
    status: 'COMPLETED',
    progress: 100,
    created_at: '2026-03-09T10:00:00Z',
    completed_at: '2026-03-09T10:02:00Z',
    file_url: '#',
    generated_by: 'Ricardo Prof',
    params: {
      month: '2026-03',
      unitId: 'unit-1',
      modules: ['GYM', 'PHYSIO', 'ABSENTEEISM'],
      privacy: { aggregatedOnly: true, hideSensitiveAttachments: true, hideOpenTextNR1: true }
    }
  },
  {
    id: 'job-2',
    name: 'Relatório Técnico SESMT - Fevereiro 2026',
    type: 'TECHNICAL',
    format: 'PDF',
    status: 'COMPLETED',
    progress: 100,
    created_at: '2026-03-08T15:30:00Z',
    completed_at: '2026-03-08T15:35:00Z',
    file_url: '#',
    generated_by: 'Ana Silva',
    params: {
      month: '2026-02',
      unitId: 'unit-1',
      modules: ['ERGO', 'NR1', 'ACTION_PLANS'],
      privacy: { aggregatedOnly: false, hideSensitiveAttachments: true, hideOpenTextNR1: false }
    }
  },
  {
    id: 'job-3',
    name: 'Pacote de Evidências Q1',
    type: 'ZIP',
    format: 'ZIP',
    status: 'PROCESSING',
    progress: 45,
    created_at: '2026-03-09T15:45:00Z',
    generated_by: 'Carlos Souza',
    params: {
      month: '2026-03',
      unitId: 'unit-1',
      modules: ['EVIDENCE'],
      privacy: { aggregatedOnly: false, hideSensitiveAttachments: false, hideOpenTextNR1: false }
    }
  },
  {
    id: 'job-4',
    name: 'Exportação BI - Janeiro',
    type: 'CSV',
    format: 'CSV',
    status: 'FAILED',
    progress: 80,
    created_at: '2026-03-05T09:00:00Z',
    error_msg: 'Erro ao processar dados do módulo NR1: Timeout na conexão com o banco.',
    generated_by: 'Ricardo Prof',
    params: {
      month: '2026-01',
      unitId: 'unit-1',
      modules: ['NR1', 'GYM'],
      privacy: { aggregatedOnly: true, hideSensitiveAttachments: true, hideOpenTextNR1: true }
    }
  }
];

export const mockReportTemplates: ReportTemplate[] = [
  {
    id: 'tmpl-1',
    name: 'Padrão Diretoria (Executivo)',
    type: 'EXECUTIVE',
    modules: ['GYM', 'PHYSIO', 'ABSENTEEISM', 'CAMPAIGNS'],
    privacy: { aggregatedOnly: true, hideSensitiveAttachments: true, hideOpenTextNR1: true },
    isDefault: true
  },
  {
    id: 'tmpl-2',
    name: 'Auditoria NR1 Completa',
    type: 'AUDIT',
    modules: ['NR1', 'EVIDENCE', 'ACTION_PLANS'],
    privacy: { aggregatedOnly: false, hideSensitiveAttachments: false, hideOpenTextNR1: false },
    alwaysAllUnits: true
  }
];

export const mockShareLinks: ShareLink[] = [
  {
    id: 'share-1',
    token: 'abc-123-xyz',
    report_id: 'job-1',
    report_name: 'Relatório Mensal Consolidado - Março 2026',
    report_type: 'EXECUTIVE',
    expires_at: '2026-03-16T10:00:00Z',
    views_count: 12,
    status: 'ACTIVE',
    has_password: true
  },
  {
    id: 'share-2',
    token: 'def-456-uvw',
    report_id: 'job-2',
    report_name: 'Relatório Técnico SESMT - Fevereiro 2026',
    report_type: 'TECHNICAL',
    expires_at: '2026-03-01T15:30:00Z',
    views_count: 5,
    status: 'EXPIRED'
  }
];
