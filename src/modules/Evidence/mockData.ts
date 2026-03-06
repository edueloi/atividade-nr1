import { Evidence } from './types';

export const mockEvidences: Evidence[] = [
  {
    id: '1',
    title: 'Ajuste de Bancada - Antes',
    description: 'Bancada com altura inadequada gerando flexão de tronco.',
    unit: 'Unidade 1',
    sector: 'Montagem',
    origin: 'Plano de Ação',
    type: 'Antes',
    status: 'Vinculada',
    tags: ['ergonomia', 'bancada', 'ajuste'],
    fileUrl: 'https://picsum.photos/seed/ev1/800/600',
    thumbUrl: 'https://picsum.photos/seed/ev1/400/400',
    date: '01/03/2026',
    uploadDate: '02/03/2026',
    createdBy: 'Ricardo Prof',
    links: [
      { id: 'l1', refType: 'ACTION_ITEM', refId: '1', refName: 'Ajustar altura da bancada', createdAt: '02/03/2026' }
    ]
  },
  {
    id: '2',
    title: 'Ajuste de Bancada - Depois',
    description: 'Bancada ajustada para altura de 105cm.',
    unit: 'Unidade 1',
    sector: 'Montagem',
    origin: 'Plano de Ação',
    type: 'Depois',
    status: 'Vinculada',
    tags: ['ergonomia', 'bancada', 'concluído'],
    fileUrl: 'https://picsum.photos/seed/ev2/800/600',
    thumbUrl: 'https://picsum.photos/seed/ev2/400/400',
    date: '05/03/2026',
    uploadDate: '06/03/2026',
    createdBy: 'Ricardo Prof',
    links: [
      { id: 'l2', refType: 'ACTION_ITEM', refId: '1', refName: 'Ajustar altura da bancada', createdAt: '06/03/2026' }
    ]
  },
  {
    id: '3',
    title: 'Treinamento NR1',
    description: 'Foto da turma de integração.',
    unit: 'Unidade 2',
    sector: 'RH',
    origin: 'NR1',
    type: 'Comprovante',
    status: 'Vinculada',
    tags: ['treinamento', 'nr1', 'integração'],
    fileUrl: 'https://picsum.photos/seed/ev3/800/600',
    thumbUrl: 'https://picsum.photos/seed/ev3/400/400',
    date: '02/03/2026',
    uploadDate: '02/03/2026',
    createdBy: 'Dra. Maria',
    links: []
  },
  {
    id: '4',
    title: 'Campanha Outubro Rosa',
    description: 'Decoração do refeitório.',
    unit: 'Unidade 1',
    sector: 'Geral',
    origin: 'Campanhas',
    type: 'Campanha',
    status: 'Rascunho',
    tags: ['campanha', 'outubro rosa'],
    fileUrl: 'https://picsum.photos/seed/ev4/800/600',
    thumbUrl: 'https://picsum.photos/seed/ev4/400/400',
    date: '01/03/2026',
    uploadDate: '01/03/2026',
    createdBy: 'Ricardo Prof',
    links: []
  },
  {
    id: '5',
    title: 'Cadeira Ergonômica Nova',
    description: 'Modelo X-200 instalado na logística.',
    unit: 'Unidade 1',
    sector: 'Logística',
    origin: 'Ergonomia',
    type: 'Depois',
    status: 'Vinculada',
    tags: ['cadeira', 'ergonomia'],
    fileUrl: 'https://picsum.photos/seed/ev5/800/600',
    thumbUrl: 'https://picsum.photos/seed/ev5/400/400',
    date: '04/03/2026',
    uploadDate: '04/03/2026',
    createdBy: 'Ricardo Prof',
    links: []
  }
];
