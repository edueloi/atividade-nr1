import { Campaign } from './types';

export const mockCampaigns: Campaign[] = [
  {
    id: 'camp-01',
    month: 'Janeiro',
    theme: 'Janeiro Branco',
    color: 'zinc',
    status: 'COMPLETED',
    description: 'Saúde mental e emocional no ambiente de trabalho. Foco em prevenção de ansiedade, burnout e equilíbrio entre vida pessoal e profissional.',
    start_date: '2025-01-01',
    end_date: '2025-01-31',
    responsible: 'Dra. Helena (Psicóloga)',
    budget: 1200,
    materials: [
      { id: 'mat-1', name: 'Poster Saúde Mental', type: 'POSTER', url: '#', uploaded_at: '2025-01-02' },
      { id: 'mat-2', name: 'Apresentação Ansiedade no Trabalho', type: 'PRESENTATION', url: '#', uploaded_at: '2025-01-05' }
    ],
    actions: [
      { id: 'act-1', name: 'Palestra: Equilíbrio Emocional', date: '2025-01-15', type: 'LECTURE', participants_count: 87, status: 'DONE', evidence_url: '#' },
      { id: 'act-2', name: 'Workshop: Gestão do Estresse', date: '2025-01-22', type: 'WORKSHOP', participants_count: 34, status: 'DONE', evidence_url: '#' }
    ]
  },
  {
    id: 'camp-02',
    month: 'Fevereiro',
    theme: 'Fevereiro Laranja',
    color: 'orange',
    status: 'COMPLETED',
    description: 'Conscientização sobre leucemia e a importância da doação de medula óssea. Cadastro de doadores e orientações sobre o processo.',
    start_date: '2025-02-01',
    end_date: '2025-02-28',
    responsible: 'Enf. Marcos',
    budget: 800,
    materials: [
      { id: 'mat-3', name: 'Folder Doação de Medula', type: 'POSTER', url: '#', uploaded_at: '2025-02-03' }
    ],
    actions: [
      { id: 'act-3', name: 'Blitz Informativa — Refeitório', date: '2025-02-10', type: 'OTHER', participants_count: 142, status: 'DONE' },
      { id: 'act-4', name: 'Cadastro de Doadores', date: '2025-02-20', type: 'SCREENING', participants_count: 28, status: 'DONE' }
    ]
  },
  {
    id: 'camp-03',
    month: 'Março',
    theme: 'Março Azul-Marinho',
    color: 'blue',
    status: 'COMPLETED',
    description: 'Prevenção do câncer colorretal. Rastreamento precoce, orientações nutricionais e estímulo a hábitos saudáveis.',
    start_date: '2025-03-01',
    end_date: '2025-03-31',
    responsible: 'Dr. Roberto (Gastro)',
    budget: 2000,
    materials: [
      { id: 'mat-4', name: 'Folder Informativo Colorretal', type: 'POSTER', url: '#', uploaded_at: '2025-03-01' },
      { id: 'mat-5', name: 'Vídeo: Alimentação Saudável', type: 'VIDEO', url: '#', uploaded_at: '2025-03-08' }
    ],
    actions: [
      { id: 'act-5', name: 'Webinar: Alimentação e Prevenção', date: '2025-03-12', type: 'LECTURE', participants_count: 64, status: 'DONE', evidence_url: '#' },
      { id: 'act-6', name: 'Rastreamento PSA e Colorretal', date: '2025-03-25', type: 'SCREENING', participants_count: 51, status: 'DONE' }
    ]
  },
  {
    id: 'camp-04',
    month: 'Abril',
    theme: 'Abril Verde',
    color: 'emerald',
    status: 'COMPLETED',
    description: 'Saúde e segurança no trabalho — SIPAT. Prevenção de acidentes, uso correto de EPIs e ergonomia dos postos de trabalho.',
    start_date: '2025-04-01',
    end_date: '2025-04-30',
    responsible: 'Eng. Carlos (SESMT)',
    budget: 3500,
    materials: [
      { id: 'mat-6', name: 'Manual de EPIs', type: 'PRESENTATION', url: '#', uploaded_at: '2025-04-02' },
      { id: 'mat-7', name: 'Poster SIPAT 2025', type: 'POSTER', url: '#', uploaded_at: '2025-04-01' }
    ],
    actions: [
      { id: 'act-7', name: 'SIPAT — Abertura Oficial', date: '2025-04-07', type: 'LECTURE', participants_count: 220, status: 'DONE', evidence_url: '#' },
      { id: 'act-8', name: 'Treinamento EPIs Linha de Produção', date: '2025-04-14', type: 'WORKSHOP', participants_count: 75, status: 'DONE' },
      { id: 'act-9', name: 'Avaliação Ergonômica In Loco', date: '2025-04-21', type: 'SCREENING', participants_count: 40, status: 'DONE' }
    ]
  },
  {
    id: 'camp-05',
    month: 'Maio',
    theme: 'Maio Amarelo',
    color: 'yellow',
    status: 'COMPLETED',
    description: 'Prevenção de acidentes de trânsito. Conscientização para colaboradores que conduzem veículos da empresa ou próprios no trajeto.',
    start_date: '2025-05-01',
    end_date: '2025-05-31',
    responsible: 'Sgt. Paulo (Segurança)',
    budget: 900,
    materials: [
      { id: 'mat-8', name: 'Poster Maio Amarelo', type: 'POSTER', url: '#', uploaded_at: '2025-05-01' }
    ],
    actions: [
      { id: 'act-10', name: 'Palestra: Dirigir com Responsabilidade', date: '2025-05-18', type: 'LECTURE', participants_count: 110, status: 'DONE', evidence_url: '#' }
    ]
  },
  {
    id: 'camp-06',
    month: 'Junho',
    theme: 'Junho Vermelho',
    color: 'rose',
    status: 'COMPLETED',
    description: 'Incentivo à doação de sangue. Parceria com hemocentro local para coleta no próprio ambiente de trabalho.',
    start_date: '2025-06-01',
    end_date: '2025-06-30',
    responsible: 'Enf. Marcos',
    budget: 600,
    materials: [
      { id: 'mat-9', name: 'Folder Doação de Sangue', type: 'POSTER', url: '#', uploaded_at: '2025-06-03' }
    ],
    actions: [
      { id: 'act-11', name: 'Coleta de Sangue — Auditório', date: '2025-06-14', type: 'SCREENING', participants_count: 47, status: 'DONE', evidence_url: '#' },
      { id: 'act-12', name: 'Palestra: Importância da Doação', date: '2025-06-07', type: 'LECTURE', participants_count: 88, status: 'DONE' }
    ]
  },
  {
    id: 'camp-07',
    month: 'Julho',
    theme: 'Julho Amarelo',
    color: 'amber',
    status: 'ACTIVE',
    description: 'Prevenção da hepatite viral. Orientações sobre transmissão, vacinação disponível e importância do diagnóstico precoce.',
    start_date: '2025-07-01',
    end_date: '2025-07-31',
    responsible: 'Dr. André (Medicina do Trabalho)',
    budget: 1500,
    materials: [
      { id: 'mat-10', name: 'Infográfico Hepatites Virais', type: 'POSTER', url: '#', uploaded_at: '2025-07-02' }
    ],
    actions: [
      { id: 'act-13', name: 'Campanha de Vacinação Hepatite B', date: '2025-07-09', type: 'SCREENING', participants_count: 62, status: 'DONE', evidence_url: '#' },
      { id: 'act-14', name: 'Palestra: Hepatites A, B e C', date: '2025-07-23', type: 'LECTURE', participants_count: 0, status: 'PLANNED' }
    ]
  },
  {
    id: 'camp-08',
    month: 'Agosto',
    theme: 'Agosto Dourado',
    color: 'yellow',
    status: 'UPCOMING',
    description: 'Incentivo ao aleitamento materno e apoio às colaboradoras gestantes e mães em fase de amamentação.',
    start_date: '2025-08-01',
    end_date: '2025-08-31',
    responsible: 'Dra. Helena (Psicóloga)',
    budget: 700,
    materials: [],
    actions: [
      { id: 'act-15', name: 'Roda de Conversa: Amamentação no Trabalho', date: '2025-08-12', type: 'WORKSHOP', participants_count: 0, status: 'PLANNED' }
    ]
  },
  {
    id: 'camp-09',
    month: 'Setembro',
    theme: 'Setembro Amarelo',
    color: 'yellow',
    status: 'UPCOMING',
    description: 'Prevenção ao suicídio e valorização da vida. Capacitação de lideranças para identificar sinais de sofrimento psíquico na equipe.',
    start_date: '2025-09-01',
    end_date: '2025-09-30',
    responsible: 'Dra. Helena (Psicóloga)',
    budget: 1800,
    materials: [],
    actions: [
      { id: 'act-16', name: 'Treinamento: Líderes como Guardiões', date: '2025-09-10', type: 'WORKSHOP', participants_count: 0, status: 'PLANNED' },
      { id: 'act-17', name: 'Palestra Aberta: Valorização da Vida', date: '2025-09-25', type: 'LECTURE', participants_count: 0, status: 'PLANNED' }
    ]
  },
  {
    id: 'camp-10',
    month: 'Outubro',
    theme: 'Outubro Rosa',
    color: 'pink',
    status: 'UPCOMING',
    description: 'Prevenção do câncer de mama. Conscientização sobre autoexame, mamografia e acolhimento de casos identificados.',
    start_date: '2025-10-01',
    end_date: '2025-10-31',
    responsible: 'Dra. Fernanda (Gineco)',
    budget: 2200,
    materials: [],
    actions: [
      { id: 'act-18', name: 'Rastreamento Mamário', date: '2025-10-08', type: 'SCREENING', participants_count: 0, status: 'PLANNED' },
      { id: 'act-19', name: 'Palestra: Diagnóstico Precoce', date: '2025-10-15', type: 'LECTURE', participants_count: 0, status: 'PLANNED' },
      { id: 'act-20', name: 'Workshop: Autoexame na Prática', date: '2025-10-22', type: 'WORKSHOP', participants_count: 0, status: 'PLANNED' }
    ]
  },
  {
    id: 'camp-11',
    month: 'Novembro',
    theme: 'Novembro Azul',
    color: 'sky',
    status: 'UPCOMING',
    description: 'Saúde do homem no trabalho. Prevenção do câncer de próstata, saúde cardiovascular e incentivo à consulta médica regular.',
    start_date: '2025-11-01',
    end_date: '2025-11-30',
    responsible: 'Dr. André (Medicina do Trabalho)',
    budget: 1600,
    materials: [],
    actions: [
      { id: 'act-21', name: 'Rastreamento PSA', date: '2025-11-05', type: 'SCREENING', participants_count: 0, status: 'PLANNED' },
      { id: 'act-22', name: 'Palestra: Saúde do Homem', date: '2025-11-19', type: 'LECTURE', participants_count: 0, status: 'PLANNED' }
    ]
  },
  {
    id: 'camp-12',
    month: 'Dezembro',
    theme: 'Dezembro Laranja',
    color: 'orange',
    status: 'UPCOMING',
    description: 'Prevenção de acidentes e doenças causadas pelo calor. Orientações sobre hidratação, proteção solar e riscos do calor excessivo.',
    start_date: '2025-12-01',
    end_date: '2025-12-31',
    responsible: 'Eng. Carlos (SESMT)',
    budget: 1000,
    materials: [],
    actions: [
      { id: 'act-23', name: 'Distribuição de Protetor Solar', date: '2025-12-10', type: 'OTHER', participants_count: 0, status: 'PLANNED' },
      { id: 'act-24', name: 'Palestra: Calor e Segurança', date: '2025-12-03', type: 'LECTURE', participants_count: 0, status: 'PLANNED' }
    ]
  }
];
