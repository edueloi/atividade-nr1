import { Campaign } from './types';

export const mockCampaigns: Campaign[] = [
  {
    id: 'camp-01',
    month: 'Janeiro',
    theme: 'Janeiro Branco',
    color: 'zinc',
    status: 'COMPLETED',
    description: 'Campanha dedicada à saúde mental e emocional.',
    start_date: '2024-01-01',
    end_date: '2024-01-31',
    responsible: 'Dra. Helena (Psicóloga)',
    materials: [
      { id: 'mat-1', name: 'Poster Saúde Mental', type: 'POSTER', url: '#', uploaded_at: '2024-01-02' },
      { id: 'mat-2', name: 'Apresentação Ansiedade', type: 'PRESENTATION', url: '#', uploaded_at: '2024-01-05' }
    ],
    actions: [
      { id: 'act-1', name: 'Palestra: Equilíbrio Emocional', date: '2024-01-15', type: 'LECTURE', participants_count: 45, status: 'DONE', evidence_url: '#' }
    ]
  },
  {
    id: 'camp-02',
    month: 'Fevereiro',
    theme: 'Fevereiro Laranja',
    color: 'orange',
    status: 'COMPLETED',
    description: 'Conscientização sobre a leucemia e a importância da doação de medula óssea.',
    start_date: '2024-02-01',
    end_date: '2024-02-29',
    responsible: 'Enf. Marcos',
    materials: [],
    actions: [
      { id: 'act-2', name: 'Blitz Informativa', date: '2024-02-10', type: 'OTHER', participants_count: 120, status: 'DONE' }
    ]
  },
  {
    id: 'camp-03',
    month: 'Março',
    theme: 'Março Azul',
    color: 'blue',
    status: 'ACTIVE',
    description: 'Prevenção do câncer colorretal.',
    start_date: '2024-03-01',
    end_date: '2024-03-31',
    responsible: 'Dr. Roberto (Gastro)',
    materials: [
      { id: 'mat-3', name: 'Folder Informativo', type: 'POSTER', url: '#', uploaded_at: '2024-03-01' }
    ],
    actions: [
      { id: 'act-3', name: 'Webinar: Alimentação e Prevenção', date: '2024-03-20', type: 'LECTURE', participants_count: 0, status: 'PLANNED' },
      { id: 'act-4', name: 'Exames de Rastreamento', date: '2024-03-25', type: 'SCREENING', participants_count: 0, status: 'PLANNED' }
    ]
  },
  {
    id: 'camp-04',
    month: 'Abril',
    theme: 'Abril Verde',
    color: 'emerald',
    status: 'UPCOMING',
    description: 'Saúde e segurança no trabalho.',
    start_date: '2024-04-01',
    end_date: '2024-04-30',
    materials: [],
    actions: []
  },
  {
    id: 'camp-05',
    month: 'Maio',
    theme: 'Maio Amarelo',
    color: 'yellow',
    status: 'UPCOMING',
    description: 'Prevenção de acidentes de trânsito.',
    start_date: '2024-05-01',
    end_date: '2024-05-31',
    materials: [],
    actions: []
  },
  {
    id: 'camp-06',
    month: 'Junho',
    theme: 'Junho Vermelho',
    color: 'rose',
    status: 'UPCOMING',
    description: 'Incentivo à doação de sangue.',
    start_date: '2024-06-01',
    end_date: '2024-06-30',
    materials: [],
    actions: []
  }
];
