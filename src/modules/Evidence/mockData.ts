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
    fileUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80',
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
    fileUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=400&q=80',
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
    fileUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=400&q=80',
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
    fileUrl: 'https://images.unsplash.com/photo-1602052793312-b99c2a9ee797?auto=format&fit=crop&w=800&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1602052793312-b99c2a9ee797?auto=format&fit=crop&w=400&q=80',
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
    fileUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=800&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=400&q=80',
    date: '04/03/2026',
    uploadDate: '04/03/2026',
    createdBy: 'Ricardo Prof',
    links: []
  }
];
