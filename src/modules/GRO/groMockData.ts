// GRO Mock Data — Toyota Brasil (tenantId: 'toyota-br')
// Dados realistas de riscos ocupacionais para planta automotiva brasileira

import type {
  GROEstablishment,
  GROSector,
  GRORole,
  GROActivity,
  RiskInventoryItem,
  GROActionItem,
  CriteriaMatrix,
  GRODocument,
  ApprovalStep,
} from './types.js';

import {
  saveEstablishments,
  saveSectors,
  saveRoles,
  saveActivities,
  saveInventory,
  saveActions,
  saveCriteria,
  saveDocuments,
} from './groStorage.js';

// ─── Establishments ────────────────────────────────────────────────────────────
const establishments: GROEstablishment[] = [
  {
    id: 'est-sorocaba',
    tenantId: 'toyota-br',
    name: 'Toyota Brasil — Planta Sorocaba',
    cnpj: '00.168.257/0010-58',
    address: 'Rodovia SP-280, km 110, Sorocaba – SP, 18085-500',
  },
  {
    id: 'est-indaiatuba',
    tenantId: 'toyota-br',
    name: 'Toyota Brasil — Planta Indaiatuba',
    cnpj: '00.168.257/0020-11',
    address: 'Av. Tiradentes, 3080, Indaiatuba – SP, 13347-001',
  },
];

// ─── Sectors ──────────────────────────────────────────────────────────────────
const sectors: GROSector[] = [
  {
    id: 'sec-montagem',
    establishmentId: 'est-sorocaba',
    name: 'Montagem',
    description: 'Linha de montagem final de veículos — junção de subconjuntos mecânicos, elétricos e de acabamento.',
  },
  {
    id: 'sec-logistica',
    establishmentId: 'est-sorocaba',
    name: 'Logística',
    description: 'Recebimento, armazenagem e abastecimento de peças e componentes para a linha de produção.',
  },
  {
    id: 'sec-pintura',
    establishmentId: 'est-sorocaba',
    name: 'Pintura',
    description: 'Preparação de superfície, aplicação de primer, base e verniz em cabines pressurizadas.',
  },
  {
    id: 'sec-manutencao',
    establishmentId: 'est-sorocaba',
    name: 'Manutenção',
    description: 'Manutenção preventiva e corretiva de equipamentos, máquinas e instalações da planta.',
  },
  {
    id: 'sec-administrativo',
    establishmentId: 'est-sorocaba',
    name: 'Administrativo',
    description: 'Áreas de suporte: RH, compras, financeiro, engenharia de produto e SESMT.',
  },
  {
    id: 'sec-montagem-ind',
    establishmentId: 'est-indaiatuba',
    name: 'Montagem',
    description: 'Linha de montagem de motores e transmissões — Planta Indaiatuba.',
  },
];

// ─── Roles ────────────────────────────────────────────────────────────────────
const roles: GRORole[] = [
  { id: 'role-op-montagem',    sectorId: 'sec-montagem',      name: 'Operador de Montagem',       cbo: '7843-10' },
  { id: 'role-empilhador',     sectorId: 'sec-logistica',     name: 'Empilhadorista',              cbo: '4141-05' },
  { id: 'role-pintor',         sectorId: 'sec-pintura',       name: 'Pintor Industrial',           cbo: '7233-10' },
  { id: 'role-tec-manut',      sectorId: 'sec-manutencao',    name: 'Técnico de Manutenção',       cbo: '9112-05' },
  { id: 'role-aux-admin',      sectorId: 'sec-administrativo',name: 'Auxiliar Administrativo',     cbo: '4110-10' },
  { id: 'role-supervisor',     sectorId: 'sec-montagem',      name: 'Supervisor de Produção',      cbo: '3132-10' },
  { id: 'role-soldador',       sectorId: 'sec-montagem',      name: 'Soldador',                    cbo: '7243-15' },
  { id: 'role-op-cnc',         sectorId: 'sec-manutencao',    name: 'Operador CNC',                cbo: '7223-05' },
];

// ─── Activities ───────────────────────────────────────────────────────────────
const activities: GROActivity[] = [
  {
    id: 'act-mont-comp',
    sectorId: 'sec-montagem',
    roleId: 'role-op-montagem',
    name: 'Montagem de componentes',
    description: 'Instalação manual e semimecanizada de componentes mecânicos e elétricos na carroceria.',
    frequency: 'CONTINUOUS',
  },
  {
    id: 'act-mov-cargas',
    sectorId: 'sec-logistica',
    roleId: 'role-empilhador',
    name: 'Movimentação de cargas',
    description: 'Transporte de paletes, contêineres de peças e estantes porta-peças com empilhadeiras e paleteiras.',
    frequency: 'CONTINUOUS',
  },
  {
    id: 'act-pintura-spray',
    sectorId: 'sec-pintura',
    roleId: 'role-pintor',
    name: 'Pintura spray',
    description: 'Aplicação de tinta poliuretânica em spray em cabines com exaustão forçada.',
    frequency: 'CONTINUOUS',
  },
  {
    id: 'act-manut-prev',
    sectorId: 'sec-manutencao',
    roleId: 'role-tec-manut',
    name: 'Manutenção preventiva',
    description: 'Inspeção, lubrificação, ajuste e substituição de peças conforme plano de manutenção.',
    frequency: 'FREQUENT',
  },
  {
    id: 'act-digitacao',
    sectorId: 'sec-administrativo',
    roleId: 'role-aux-admin',
    name: 'Digitação/escritório',
    description: 'Atividades de escritório com uso de computador, telefone e documentação física.',
    frequency: 'CONTINUOUS',
  },
  {
    id: 'act-supervisao',
    sectorId: 'sec-montagem',
    roleId: 'role-supervisor',
    name: 'Supervisão de linha',
    description: 'Acompanhamento e controle do fluxo de produção, gestão de equipe e resolução de anomalias.',
    frequency: 'CONTINUOUS',
  },
  {
    id: 'act-solda-mig',
    sectorId: 'sec-montagem',
    roleId: 'role-soldador',
    name: 'Solda MIG',
    description: 'Soldagem MIG/MAG de estruturas metálicas e subconjuntos da carroceria.',
    frequency: 'CONTINUOUS',
  },
  {
    id: 'act-op-cnc',
    sectorId: 'sec-manutencao',
    roleId: 'role-op-cnc',
    name: 'Operação CNC',
    description: 'Programação, setup e operação de centros de usinagem CNC para fabricação de peças de manutenção.',
    frequency: 'FREQUENT',
  },
];

// ─── Approval steps helpers ────────────────────────────────────────────────────
function pendingApproval(area: ApprovalStep['area']): ApprovalStep {
  return { area, approvedBy: null, date: null, status: 'pending' };
}
function approvedStep(area: ApprovalStep['area'], by: string, date: string, comment?: string): ApprovalStep {
  return { area, approvedBy: by, date, status: 'approved', comment };
}

// ─── Risk Inventory (14 items) ─────────────────────────────────────────────────
const inventory: RiskInventoryItem[] = [
  // 1 — PHYSICAL · Ruído · APPROVED
  {
    id: 'risk-001',
    tenantId: 'toyota-br',
    establishmentId: 'est-sorocaba',
    sectorId: 'sec-montagem',
    activityId: 'act-mont-comp',
    roleId: 'role-op-montagem',
    hazardDescription: 'Exposição a ruído contínuo acima do limite de tolerância (NR-15, Anexo I)',
    hazardSource: 'Operação simultânea de parafusadeiras pneumáticas, prensas e esteiras transportadoras',
    hazardCircumstances: 'Durante toda a jornada de trabalho no setor de montagem final (8h/dia)',
    possibleInjuries: 'Perda Auditiva Induzida por Ruído (PAIR), zumbido, estresse auditivo',
    exposedWorkers: 48,
    existingMeasures: 'Protetor auricular tipo concha (CA 14.380); programa PPRA/PCMSO; medições audiométricas anuais',
    exposureCharacterization: 'Nível de ruído medido: 87–92 dB(A) — acima do limite de 85 dB(A) da NR-15',
    riskType: 'PHYSICAL',
    severity: 3,
    probability: 4,
    riskLevel: 12,
    riskClassification: 'MODERATE',
    decision: 'Implementar enclausuramento acústico nas prensas e substituir parafusadeiras por modelo elétrico silencioso até T2/2026',
    status: 'APPROVED',
    approvals: [
      approvedStep('Segurança', 'Carlos Eduardo', '2026-02-10', 'Medições confirmadas pelo técnico de SST'),
      approvedStep('Gerência Operacional', 'Eng. Carlos Tanaka', '2026-02-15'),
      pendingApproval('Médico'),
    ],
    revisionHistory: [
      { version: 1, changedBy: 'Carlos Eduardo', changedAt: '2026-01-20T10:00:00Z', trigger: 'Levantamento inicial GRO', notes: 'Risco identificado no walkthrough de linha' },
    ],
    version: 1,
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-02-15T14:00:00Z',
    createdBy: 'Carlos Eduardo',
  },

  // 2 — PHYSICAL · Calor · PUBLISHED
  {
    id: 'risk-002',
    tenantId: 'toyota-br',
    establishmentId: 'est-sorocaba',
    sectorId: 'sec-pintura',
    activityId: 'act-pintura-spray',
    roleId: 'role-pintor',
    hazardDescription: 'Exposição a calor radiante proveniente dos fornos de cura de tinta (160 °C)',
    hazardSource: 'Fornos de cura e estufa de secagem de verniz na linha de pintura',
    hazardCircumstances: 'Durante abertura de portas dos fornos e inspeção de carroceria recém-curada',
    possibleInjuries: 'Estresse térmico, insolação, desidratação, queimaduras superficiais',
    exposedWorkers: 18,
    existingMeasures: 'IBUTG monitorado; pausas térmicas conforme NR-15 Anexo III; fornecimento de água gelada e eletrólitos',
    exposureCharacterization: 'IBUTG medido: 28,5 °C em atividade leve-moderada — limiar de tolerância 26,7 °C',
    riskType: 'PHYSICAL',
    severity: 3,
    probability: 3,
    riskLevel: 9,
    riskClassification: 'TOLERABLE',
    decision: 'Reforçar cortinas de ar nas entradas dos fornos e revisar frequência das pausas térmicas',
    status: 'PUBLISHED',
    approvals: [
      approvedStep('Segurança', 'Carlos Eduardo', '2026-01-10'),
      approvedStep('Médico', 'Dr. Felipe Nobre', '2026-01-12', 'Exames clínicos e IBUTG dentro do aceitável com controles'),
      approvedStep('Gerência Operacional', 'Eng. Carlos Tanaka', '2026-01-15'),
    ],
    revisionHistory: [
      { version: 1, changedBy: 'Carlos Eduardo', changedAt: '2025-12-05T09:00:00Z', trigger: 'Revisão anual do inventário', notes: 'Atualização dos valores de IBUTG' },
    ],
    version: 1,
    createdAt: '2025-12-05T09:00:00Z',
    updatedAt: '2026-01-15T11:00:00Z',
    createdBy: 'Carlos Eduardo',
  },

  // 3 — CHEMICAL · Tinta poliuretânica · IN_REVIEW
  {
    id: 'risk-003',
    tenantId: 'toyota-br',
    establishmentId: 'est-sorocaba',
    sectorId: 'sec-pintura',
    activityId: 'act-pintura-spray',
    roleId: 'role-pintor',
    hazardDescription: 'Inalação de vapores de solventes orgânicos (tolueno, xileno) durante aplicação de tinta',
    hazardSource: 'Tinta poliuretânica bicomponente e solvente de limpeza de pistola',
    hazardCircumstances: 'Aplicação em cabine com ventilação forçada; limpeza de equipamentos no final do turno',
    possibleInjuries: 'Intoxicação aguda, hepatotoxicidade, neurotoxicidade, dermatose por contato',
    exposedWorkers: 18,
    existingMeasures: 'Cabine de pintura com exaustão regulamentada; respirador semifacial com filtro orgânico (CA 20.891); luvas nitrílicas',
    exposureCharacterization: 'Concentração de tolueno medida: 42 ppm — limite NR-15: 78 ppm. Exposição ocasional acima do limite durante manutenção de cabine',
    riskType: 'CHEMICAL',
    severity: 4,
    probability: 2,
    riskLevel: 8,
    riskClassification: 'TOLERABLE',
    decision: 'Substituir solvente de limpeza por produto de baixa toxicidade e instalar sistema de monitoramento contínuo de COV',
    status: 'IN_REVIEW',
    approvals: [
      approvedStep('Segurança', 'Carlos Eduardo', '2026-03-01'),
      pendingApproval('Médico'),
      pendingApproval('Gerência Operacional'),
    ],
    revisionHistory: [
      { version: 1, changedBy: 'Carlos Eduardo', changedAt: '2026-02-20T08:00:00Z', trigger: 'Denúncia de trabalhador com cefaleia recorrente', notes: 'Avaliação qualitativa inicial' },
    ],
    version: 1,
    createdAt: '2026-02-20T08:00:00Z',
    updatedAt: '2026-03-01T16:00:00Z',
    createdBy: 'Carlos Eduardo',
  },

  // 4 — CHEMICAL · Fumos de solda · DRAFT
  {
    id: 'risk-004',
    tenantId: 'toyota-br',
    establishmentId: 'est-sorocaba',
    sectorId: 'sec-montagem',
    activityId: 'act-solda-mig',
    roleId: 'role-soldador',
    hazardDescription: 'Inalação de fumos metálicos gerados durante processo de soldagem MIG/MAG',
    hazardSource: 'Fusão do arame de solda ER70S-6 e da chapa de aço em atmosfera de Ar + CO₂',
    hazardCircumstances: 'Soldagem em posição forçada em espaço semi-confinado (interior de carroceria)',
    possibleInjuries: 'Febre dos fumos metálicos, irritação de vias aéreas, pneumoconiose a longo prazo, intoxicação por manganês',
    exposedWorkers: 22,
    existingMeasures: 'Exaustor local junto ao ponto de solda; respirador PFF2 (CA 5.628)',
    exposureCharacterization: 'Concentração de Mn: 0,18 mg/m³ — limite NR-15: 0,20 mg/m³. Avaliação quantitativa pendente de renovação',
    riskType: 'CHEMICAL',
    severity: 4,
    probability: 3,
    riskLevel: 12,
    riskClassification: 'MODERATE',
    decision: 'Instalar sistema de exaustão com braço articulado por posto de solda; realizar nova avaliação quantitativa no T2/2026',
    status: 'DRAFT',
    approvals: [
      pendingApproval('Segurança'),
      pendingApproval('Médico'),
      pendingApproval('Gerência Operacional'),
    ],
    revisionHistory: [],
    version: 1,
    createdAt: '2026-03-10T10:00:00Z',
    updatedAt: '2026-03-10T10:00:00Z',
    createdBy: 'Carlos Eduardo',
  },

  // 5 — ERGONOMIC · Esforço repetitivo · PUBLISHED
  {
    id: 'risk-005',
    tenantId: 'toyota-br',
    establishmentId: 'est-sorocaba',
    sectorId: 'sec-montagem',
    activityId: 'act-mont-comp',
    roleId: 'role-op-montagem',
    hazardDescription: 'Movimentos repetitivos de membros superiores com uso de ferramentas em linha de montagem cadenciada',
    hazardSource: 'Ciclo de trabalho de 58 segundos com parafusamento manual e encaixe de conectores elétricos',
    hazardCircumstances: 'Operação contínua de 8h/dia, 5 dias/semana, com dois intervalos de 10 min e almoço de 1h',
    possibleInjuries: 'LER/DORT — tendinite de manguito rotador, epicondilite, síndrome do túnel do carpo, tenossinovite',
    exposedWorkers: 48,
    existingMeasures: 'Rodízio de função a cada 2h; ginástica laboral diária de 10 min; análise ergonômica por RULA',
    exposureCharacterization: 'RULA: pontuação 6 (Nível 3 — mudança necessária em breve). Frequência: >30 movimentos/min de punho',
    riskType: 'ERGONOMIC',
    severity: 3,
    probability: 4,
    riskLevel: 12,
    riskClassification: 'MODERATE',
    decision: 'Implementar automação de aperto (robô colaborativo) nos postos críticos e aumentar rotação entre postos',
    status: 'PUBLISHED',
    approvals: [
      approvedStep('Ergonomia', 'Ricardo Silva', '2026-01-20', 'AET atualizada com pontuação RULA'),
      approvedStep('Gerência Operacional', 'Eng. Carlos Tanaka', '2026-01-22'),
      approvedStep('RH', 'Camila Rocha', '2026-01-23'),
    ],
    revisionHistory: [
      { version: 1, changedBy: 'Ricardo Silva', changedAt: '2025-11-15T09:00:00Z', trigger: 'Análise Ergonômica do Trabalho (AET)', notes: 'Avaliação realizada com RULA e OCRA' },
      { version: 2, changedBy: 'Carlos Eduardo', changedAt: '2026-01-18T14:00:00Z', trigger: 'Aumento de queixas de DORT no CAT', notes: 'Atualização do número de expostos' },
    ],
    version: 2,
    createdAt: '2025-11-15T09:00:00Z',
    updatedAt: '2026-01-23T11:00:00Z',
    createdBy: 'Ricardo Silva',
  },

  // 6 — ERGONOMIC · Postura forçada · IN_REVIEW
  {
    id: 'risk-006',
    tenantId: 'toyota-br',
    establishmentId: 'est-sorocaba',
    sectorId: 'sec-montagem',
    activityId: 'act-solda-mig',
    roleId: 'role-soldador',
    hazardDescription: 'Postura forçada com flexão de coluna > 60° durante soldagem em posição plana e vertical sob a carroceria',
    hazardSource: 'Layout do posto de solda abaixo da linha de cintura; acesso ao interior do veículo sem elevação adequada',
    hazardCircumstances: 'Cerca de 4h por turno com manutenção de postura estática em flexão de tronco',
    possibleInjuries: 'Lombalgia, hérnia de disco, dorsalgia, espondilite',
    exposedWorkers: 22,
    existingMeasures: 'Posicionadores de carroceria com ajuste de altura parcial; cinto lombar de proteção',
    exposureCharacterization: 'Avaliação pelo método OWAS: categoria 3 — efeitos nocivos, ação corretiva tão logo possível',
    riskType: 'ERGONOMIC',
    severity: 3,
    probability: 3,
    riskLevel: 9,
    riskClassification: 'TOLERABLE',
    decision: 'Elevar plataforma de trabalho e instalar braço articulado de suporte de tocha para reduzir esforço postural',
    status: 'IN_REVIEW',
    approvals: [
      approvedStep('Ergonomia', 'Ricardo Silva', '2026-03-05'),
      pendingApproval('Gerência Operacional'),
      pendingApproval('Manutenção'),
    ],
    revisionHistory: [
      { version: 1, changedBy: 'Ricardo Silva', changedAt: '2026-02-25T11:00:00Z', trigger: 'Queixa formal de lombalgias no setor', notes: 'Avaliação OWAS realizada em campo' },
    ],
    version: 1,
    createdAt: '2026-02-25T11:00:00Z',
    updatedAt: '2026-03-05T09:00:00Z',
    createdBy: 'Ricardo Silva',
  },

  // 7 — ERGONOMIC · Digitação prolongada · IN_REVIEW
  {
    id: 'risk-007',
    tenantId: 'toyota-br',
    establishmentId: 'est-sorocaba',
    sectorId: 'sec-administrativo',
    activityId: 'act-digitacao',
    roleId: 'role-aux-admin',
    hazardDescription: 'Uso contínuo de teclado e mouse por período superior a 6h diárias sem pausas regulamentadas',
    hazardSource: 'Demanda crescente por lançamentos em sistemas SAP e ERP; ausência de pausas programadas',
    hazardCircumstances: 'Jornada de 8h com apenas 1h de intervalo; pico de demanda no fechamento mensal',
    possibleInjuries: 'Tendinite de De Quervain, tenossinovite, síndrome do túnel do carpo, fadiga visual, cefaleia tensional',
    exposedWorkers: 14,
    existingMeasures: 'Suporte de monitor; teclado ergonômico disponível sob solicitação; cadeiras reguláveis',
    exposureCharacterization: 'Avaliação RULA: pontuação 5. Nível de risco moderado. Menos de 15% dos postos com ajuste ergonômico completo',
    riskType: 'ERGONOMIC',
    severity: 2,
    probability: 4,
    riskLevel: 8,
    riskClassification: 'TOLERABLE',
    decision: 'Implantar pausas obrigatórias de 10 min a cada 50 min de digitação e revisar layout dos postos de trabalho administrativos',
    status: 'IN_REVIEW',
    approvals: [
      pendingApproval('Ergonomia'),
      pendingApproval('RH'),
    ],
    revisionHistory: [
      { version: 1, changedBy: 'Ricardo Silva', changedAt: '2026-03-15T10:00:00Z', trigger: 'Auditoria interna de SST', notes: 'Postos administrativos incluídos no levantamento GRO' },
    ],
    version: 1,
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-03-15T10:00:00Z',
    createdBy: 'Ricardo Silva',
  },

  // 8 — ACCIDENT · Atropelamento por empilhadeira · APPROVED
  {
    id: 'risk-008',
    tenantId: 'toyota-br',
    establishmentId: 'est-sorocaba',
    sectorId: 'sec-logistica',
    activityId: 'act-mov-cargas',
    roleId: 'role-empilhador',
    hazardDescription: 'Risco de atropelamento de pedestres por empilhadeira elétrica em corredor de abastecimento',
    hazardSource: 'Fluxo simultâneo de empilhadeiras e trabalhadores a pé no mesmo corredor de 3,5m de largura',
    hazardCircumstances: 'Maior risco nos horários de troca de turno (05h50, 13h50, 21h50) e durante abastecimento intensivo da linha',
    possibleInjuries: 'Esmagamento, fraturas múltiplas, trauma craniano grave, óbito',
    exposedWorkers: 35,
    existingMeasures: 'Faixa de pedestre demarcada; sinalização sonora e luminosa nas empilhadeiras; treinamento de operadores',
    exposureCharacterization: 'Houve 1 quase-acidente registrado em Jan/2026. Corredor abaixo da largura mínima recomendada pela NR-11',
    riskType: 'ACCIDENT',
    severity: 5,
    probability: 2,
    riskLevel: 10,
    riskClassification: 'MODERATE',
    decision: 'Segregar fisicamente circulação de veículos e pedestres com guarda-corpo; implementar sistema de detecção de presença com alerta luminoso',
    status: 'APPROVED',
    approvals: [
      approvedStep('Segurança', 'Carlos Eduardo', '2026-02-01', 'Avaliação de risco confirmada após quase-acidente'),
      approvedStep('Gerência Operacional', 'Eng. Carlos Tanaka', '2026-02-05'),
      pendingApproval('Manutenção'),
    ],
    revisionHistory: [
      { version: 1, changedBy: 'Carlos Eduardo', changedAt: '2026-01-28T16:00:00Z', trigger: 'Registro de quase-acidente', notes: 'Investigação de incidente NI-2026-003' },
    ],
    version: 1,
    createdAt: '2026-01-28T16:00:00Z',
    updatedAt: '2026-02-05T10:00:00Z',
    createdBy: 'Carlos Eduardo',
  },

  // 9 — ACCIDENT · Choque elétrico · DRAFT
  {
    id: 'risk-009',
    tenantId: 'toyota-br',
    establishmentId: 'est-sorocaba',
    sectorId: 'sec-manutencao',
    activityId: 'act-manut-prev',
    roleId: 'role-tec-manut',
    hazardDescription: 'Risco de choque elétrico durante manutenção em painéis elétricos de 380V sem desenergização adequada',
    hazardSource: 'Painéis elétricos de distribuição (380V/220V) dos sistemas de automação da linha',
    hazardCircumstances: 'Manutenções corretivas emergenciais realizadas com equipamentos energizados por pressão de produção',
    possibleInjuries: 'Choque elétrico, queimaduras por arco elétrico, fibrilação ventricular, óbito',
    exposedWorkers: 12,
    existingMeasures: 'Procedimento de bloqueio e etiquetagem (LOTO); luvas isolantes Classe 00; treinamento NR-10',
    exposureCharacterization: 'Auditoria interna identificou 3 ocorrências de não conformidade com LOTO nos últimos 6 meses',
    riskType: 'ACCIDENT',
    severity: 5,
    probability: 2,
    riskLevel: 10,
    riskClassification: 'MODERATE',
    decision: 'Reforçar treinamento NR-10 SEP; implantar sistema de bloqueio físico de painéis (cadeados coletivos); auditorias mensais de conformidade LOTO',
    status: 'DRAFT',
    approvals: [
      pendingApproval('Segurança'),
      pendingApproval('Manutenção'),
    ],
    revisionHistory: [],
    version: 1,
    createdAt: '2026-03-20T14:00:00Z',
    updatedAt: '2026-03-20T14:00:00Z',
    createdBy: 'Carlos Eduardo',
  },

  // 10 — BIOLOGICAL · Agentes biológicos · PUBLISHED
  {
    id: 'risk-010',
    tenantId: 'toyota-br',
    establishmentId: 'est-sorocaba',
    sectorId: 'sec-manutencao',
    activityId: 'act-manut-prev',
    roleId: 'role-tec-manut',
    hazardDescription: 'Contato com fluidos de corte (óleos solúveis contaminados por bactérias e fungos)',
    hazardSource: 'Fluidos de usinagem nos reservatórios dos centros de usinagem CNC — contaminação microbiológica por falta de troca periódica',
    hazardCircumstances: 'Manutenção e troca de fluidos de corte; limpeza de máquinas com jato de ar comprimido',
    possibleInjuries: 'Dermatites de contato, foliculite, infecções de pele, pneumonite por hipersensibilidade (febre de usinagem)',
    exposedWorkers: 12,
    existingMeasures: 'Luvas nitrílicas e avental impermeável; análise microbiológica semestral dos fluidos; programa de troca programada',
    exposureCharacterization: 'Contagem bacteriana: 10⁶ UFC/mL — acima do limite recomendado de 10⁵ UFC/mL pela norma ASTM E2756',
    riskType: 'BIOLOGICAL',
    severity: 2,
    probability: 3,
    riskLevel: 6,
    riskClassification: 'TOLERABLE',
    decision: 'Aumentar frequência de análise para trimestral; implantar biocida aprovado e sistema de circulação forçada do fluido',
    status: 'PUBLISHED',
    approvals: [
      approvedStep('Segurança', 'Carlos Eduardo', '2026-01-05'),
      approvedStep('Médico', 'Dr. Felipe Nobre', '2026-01-07', 'Sem casos de doença ocupacional associados até o momento'),
      approvedStep('Gerência Operacional', 'Eng. Carlos Tanaka', '2026-01-09'),
    ],
    revisionHistory: [
      { version: 1, changedBy: 'Carlos Eduardo', changedAt: '2025-12-20T10:00:00Z', trigger: 'Resultado de análise microbiológica', notes: 'Contagem acima do limite em 2 reservatórios' },
    ],
    version: 1,
    createdAt: '2025-12-20T10:00:00Z',
    updatedAt: '2026-01-09T15:00:00Z',
    createdBy: 'Carlos Eduardo',
  },

  // 11 — PSYCHOSOCIAL · Sobrecarga de supervisores · IN_REVIEW
  {
    id: 'risk-011',
    tenantId: 'toyota-br',
    establishmentId: 'est-sorocaba',
    sectorId: 'sec-montagem',
    activityId: 'act-supervisao',
    roleId: 'role-supervisor',
    hazardDescription: 'Sobrecarga de trabalho e conflito de papel em supervisores de produção — acúmulo de função gerencial e operacional',
    hazardSource: 'Redução de quadro gerencial sem redistribuição de responsabilidades; expectativas contraditórias entre engenharia e RH',
    hazardCircumstances: 'Supervisores respondem simultaneamente por qualidade, produtividade, segurança, treinamento e absenteísmo da equipe de ~25 pessoas',
    possibleInjuries: 'Síndrome de Burnout, transtorno de ansiedade, depressão, adoecimento cardiovascular, absenteísmo',
    exposedWorkers: 8,
    existingMeasures: 'Programa de bem-estar; acesso ao PAE (Programa de Assistência ao Empregado); reuniões de acompanhamento com RH',
    exposureCharacterization: 'Pesquisa NR-1 ciclo 2025: 75% dos supervisores relatam sobrecarga "frequente" ou "sempre"; 50% com sintomas de exaustão emocional',
    riskType: 'PSYCHOSOCIAL',
    severity: 4,
    probability: 4,
    riskLevel: 16,
    riskClassification: 'SUBSTANTIAL',
    decision: 'Redesenhar atribuições do supervisor; contratar coordenador de produção para apoio; implantar supervisão de saúde mental com psicólogo do trabalho',
    status: 'IN_REVIEW',
    approvals: [
      approvedStep('Ergonomia', 'Ricardo Silva', '2026-03-10', 'Análise da pesquisa NR-1 confirma risco substancial'),
      pendingApproval('RH'),
      pendingApproval('Gerência Operacional'),
    ],
    revisionHistory: [
      { version: 1, changedBy: 'Ricardo Silva', changedAt: '2026-03-05T11:00:00Z', trigger: 'Resultado da Pesquisa NR-1 Ciclo 2025', notes: 'Risco identificado pelo radar psicossocial — escore crítico em sobrecarga e conflito de papel' },
    ],
    version: 1,
    createdAt: '2026-03-05T11:00:00Z',
    updatedAt: '2026-03-10T13:00:00Z',
    createdBy: 'Ricardo Silva',
    psychosocial: {
      source: 'ROLE_CONFLICT',
      frequency: 'ALWAYS',
      perceivedIntensity: 4,
      organizationalEvidence: 'Resultados da pesquisa NR-1 Ciclo 2025: 75% de relatos de sobrecarga frequente; 3 afastamentos por Burnout no grupo de supervisores em 12 meses; KPIs conflitantes entre qualidade e produtividade formalizados em meta corporativa',
      nr17LinkNeeded: true,
    },
  },

  // 12 — PSYCHOSOCIAL · Metas abusivas · DRAFT
  {
    id: 'risk-012',
    tenantId: 'toyota-br',
    establishmentId: 'est-sorocaba',
    sectorId: 'sec-montagem',
    activityId: 'act-mont-comp',
    roleId: 'role-op-montagem',
    hazardDescription: 'Exposição a pressão por metas de produção inatingíveis gerando sofrimento psíquico nos operadores de montagem',
    hazardSource: 'Metas de produção diária aumentadas em 18% sem acréscimo de pessoal ou revisão dos ciclos de trabalho',
    hazardCircumstances: 'Cobrança diária por supervisores com registros em quadro público de desempenho; horas extras frequentes para "compensação"',
    possibleInjuries: 'Ansiedade, depressão, Burnout, transtorno do sono, absenteísmo, presenteísmo',
    exposedWorkers: 48,
    existingMeasures: 'PAE disponível; psicólogo de referência via plano de saúde (acesso limitado)',
    exposureCharacterization: 'Pesquisa NR-1 ciclo 2025: 62% relatam "pressão excessiva por metas"; absenteísmo no setor 2,3× acima da média da planta',
    riskType: 'PSYCHOSOCIAL',
    severity: 4,
    probability: 3,
    riskLevel: 12,
    riskClassification: 'MODERATE',
    decision: 'Revisão imediata das metas com engenharia industrial; implantação de ouvidoria anônima; treinamento de lideranças em gestão humanizada',
    status: 'DRAFT',
    approvals: [
      pendingApproval('Ergonomia'),
      pendingApproval('RH'),
      pendingApproval('Gerência Operacional'),
    ],
    revisionHistory: [
      { version: 1, changedBy: 'Ricardo Silva', changedAt: '2026-03-18T09:00:00Z', trigger: 'Análise complementar da pesquisa NR-1', notes: 'Fator de risco psicossocial distinto do risco 011 — foco em operadores, não em supervisores' },
    ],
    version: 1,
    createdAt: '2026-03-18T09:00:00Z',
    updatedAt: '2026-03-18T09:00:00Z',
    createdBy: 'Ricardo Silva',
    psychosocial: {
      source: 'ABUSIVE_GOALS',
      frequency: 'OFTEN',
      perceivedIntensity: 4,
      organizationalEvidence: 'Dados de absenteísmo 2025: 2,3× acima da média. Taxa de presenteísmo 41%. Registros de horas extras sistemáticas (avg 2,1h/dia). Pesquisa NR-1 ciclo 2025: 62% indicam pressão excessiva.',
      nr17LinkNeeded: false,
    },
  },

  // 13 — PSYCHOSOCIAL · Assédio moral · IN_REVIEW
  {
    id: 'risk-013',
    tenantId: 'toyota-br',
    establishmentId: 'est-sorocaba',
    sectorId: 'sec-logistica',
    activityId: 'act-mov-cargas',
    roleId: 'role-empilhador',
    hazardDescription: 'Risco de assédio moral por lideranças intermediárias no setor de logística',
    hazardSource: 'Cultura de gestão por intimidação; ausência de canal de denúncia efetivo; casos relatados de humilhação pública',
    hazardCircumstances: 'Ocorrências relatadas em reuniões matinais de início de turno e durante inspeções de produtividade individual',
    possibleInjuries: 'Transtorno de ansiedade, depressão, TEPT, ideação suicida em casos graves, pedidos de demissão, absenteísmo',
    exposedWorkers: 35,
    existingMeasures: 'Política anti-assédio publicada; canal de ética disponível; treinamento de compliance anual',
    exposureCharacterization: 'Três relatos formais registrados no canal de ética em 6 meses; pesquisa NR-1: 28% relatam presenciar comportamentos hostis',
    riskType: 'PSYCHOSOCIAL',
    severity: 5,
    probability: 2,
    riskLevel: 10,
    riskClassification: 'MODERATE',
    decision: 'Investigação formal dos casos; afastamento preventivo das lideranças sinalizadas; treinamento obrigatório de gestores em comunicação não violenta; implementar ouvidoria confidencial presencial',
    status: 'IN_REVIEW',
    approvals: [
      approvedStep('RH', 'Camila Rocha', '2026-03-12', 'Casos encaminhados para comissão de ética'),
      pendingApproval('Gerência Operacional'),
    ],
    revisionHistory: [
      { version: 1, changedBy: 'Ricardo Silva', changedAt: '2026-03-08T14:00:00Z', trigger: 'Relatos ao canal de ética', notes: 'Risco incluído no GRO por determinação do SESMT após análise dos relatos' },
    ],
    version: 1,
    createdAt: '2026-03-08T14:00:00Z',
    updatedAt: '2026-03-12T16:00:00Z',
    createdBy: 'Ricardo Silva',
    psychosocial: {
      source: 'HARASSMENT',
      frequency: 'SOMETIMES',
      perceivedIntensity: 5,
      organizationalEvidence: 'Três registros formais no canal de ética (Jan–Mar/2026). Pesquisa NR-1: 28% relatam presenciar comportamentos hostis. Taxa de rotatividade no setor: 31% ao ano (acima dos 12% da planta).',
      nr17LinkNeeded: false,
    },
  },

  // 14 — ACCIDENT · Queda de nível · APPROVED
  {
    id: 'risk-014',
    tenantId: 'toyota-br',
    establishmentId: 'est-sorocaba',
    sectorId: 'sec-manutencao',
    activityId: 'act-manut-prev',
    roleId: 'role-tec-manut',
    hazardDescription: 'Risco de queda de nível durante manutenção em plataformas elevadas e telhados industriais (altura > 2m)',
    hazardSource: 'Manutenção de iluminação, sistemas de exaustão e estruturas metálicas em altura sem andaime fixo',
    hazardCircumstances: 'Acesso por escada portátil; ausência de linha de vida permanente em coberturas; trabalho individual sem vigia',
    possibleInjuries: 'Fraturas, traumatismo cranioencefálico, lesões medulares, óbito',
    exposedWorkers: 12,
    existingMeasures: 'Talabartes e cinto de segurança tipo paraquedista; PTW (permissão de trabalho em altura); treinamento NR-35',
    exposureCharacterization: 'Inspeção NR-35: 6 pontos de ancoragem inadequados identificados; 2 acessos a cobertura sem proteção coletiva',
    riskType: 'ACCIDENT',
    severity: 5,
    probability: 2,
    riskLevel: 10,
    riskClassification: 'MODERATE',
    decision: 'Instalar linha de vida horizontal permanente nas coberturas; substituir escadas portáteis por plataformas com guarda-corpo; revisar PTW de trabalho em altura',
    status: 'APPROVED',
    approvals: [
      approvedStep('Segurança', 'Carlos Eduardo', '2026-02-20', 'Inspeção de campo realizada pelo SESMT'),
      approvedStep('Manutenção', 'Roberto Campos', '2026-02-22'),
      pendingApproval('Gerência Operacional'),
    ],
    revisionHistory: [
      { version: 1, changedBy: 'Carlos Eduardo', changedAt: '2026-02-15T10:00:00Z', trigger: 'Inspeção de rotina NR-35', notes: 'Não-conformidades identificadas na inspeção semestral' },
    ],
    version: 1,
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-02-22T11:00:00Z',
    createdBy: 'Carlos Eduardo',
  },
];

// ─── GRO Action Items (7 items) ────────────────────────────────────────────────
const actions: GROActionItem[] = [
  {
    id: 'action-001',
    riskId: 'risk-001',
    action: 'Instalação de enclausuramento acústico nas prensas de montagem (módulos A e B)',
    responsible: 'Roberto Campos — Engenharia de Manutenção',
    deadline: '2026-06-30',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    evidence: ['Orçamento aprovado (OF-2026-0312)', 'Projeto técnico elaborado'],
    efficacyVerified: false,
    createdAt: '2026-02-16T10:00:00Z',
    updatedAt: '2026-03-10T09:00:00Z',
  },
  {
    id: 'action-002',
    riskId: 'risk-005',
    action: 'Implantação de robô colaborativo (cobot) para aperto de parafusos nos 4 postos críticos da linha 2',
    responsible: 'Eng. Carlos Tanaka — Engenharia de Produto',
    deadline: '2026-09-30',
    priority: 'CRITICAL',
    status: 'PENDING',
    evidence: [],
    efficacyVerified: false,
    createdAt: '2026-01-24T14:00:00Z',
    updatedAt: '2026-01-24T14:00:00Z',
  },
  {
    id: 'action-003',
    riskId: 'risk-008',
    action: 'Instalação de guarda-corpo de segregação pedestre/veículo no corredor de abastecimento (L1-L4)',
    responsible: 'Roberto Campos — Engenharia de Manutenção',
    deadline: '2026-04-15',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    evidence: ['Memorial de cálculo aprovado', 'Material adquirido — Nota Fiscal 2026-1847'],
    efficacyVerified: false,
    createdAt: '2026-02-06T10:00:00Z',
    updatedAt: '2026-03-20T11:00:00Z',
  },
  {
    id: 'action-004',
    riskId: 'risk-014',
    action: 'Instalação de linha de vida horizontal permanente nas coberturas dos Galpões 1, 2 e 3',
    responsible: 'Roberto Campos — Engenharia de Manutenção',
    deadline: '2026-03-01',
    priority: 'CRITICAL',
    status: 'OVERDUE',
    evidence: [],
    efficacyVerified: false,
    createdAt: '2026-02-23T09:00:00Z',
    updatedAt: '2026-03-25T08:00:00Z',
  },
  {
    id: 'action-005',
    riskId: 'risk-010',
    action: 'Implantação de análise microbiológica trimestral dos fluidos de corte e substituição por biocida aprovado',
    responsible: 'Carlos Eduardo — SESMT',
    deadline: '2026-04-30',
    priority: 'MEDIUM',
    status: 'DONE',
    evidence: ['Laudo microbiológico T1/2026 — dentro do limite', 'Contrato com laboratório externo assinado', 'Registro de aplicação de biocida Mar/2026'],
    efficacyVerified: true,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-03-28T16:00:00Z',
  },
  {
    id: 'action-006',
    riskId: 'risk-011',
    action: 'Contratação de psicólogo do trabalho e implantação de programa de saúde mental para supervisores',
    responsible: 'Camila Rocha — Gerência de RH',
    deadline: '2026-06-30',
    priority: 'HIGH',
    status: 'PENDING',
    evidence: [],
    efficacyVerified: false,
    createdAt: '2026-03-11T10:00:00Z',
    updatedAt: '2026-03-11T10:00:00Z',
  },
  {
    id: 'action-007',
    riskId: 'risk-003',
    action: 'Substituição do solvente de limpeza de pistolas por produto de baixa toxicidade (VOC < 50 g/L) e instalação de monitor de COV',
    responsible: 'Carlos Eduardo — SESMT / Área de Pintura',
    deadline: '2026-05-31',
    priority: 'HIGH',
    status: 'PENDING',
    evidence: [],
    efficacyVerified: false,
    createdAt: '2026-03-02T09:00:00Z',
    updatedAt: '2026-03-02T09:00:00Z',
  },
];

// ─── Criteria Matrix ───────────────────────────────────────────────────────────
export function getDefaultCriteria(tenantId: string): CriteriaMatrix {
  return {
    id: `criteria-${tenantId}`,
    tenantId,
    severityLabels: {
      1: 'Insignificante',
      2: 'Leve',
      3: 'Moderada',
      4: 'Grave',
      5: 'Catastrófica',
    },
    probabilityLabels: {
      1: 'Rara',
      2: 'Pouco provável',
      3: 'Possível',
      4: 'Provável',
      5: 'Quase certa',
    },
    classificationRules: [
      {
        minLevel: 1,
        maxLevel: 4,
        classification: 'TRIVIAL',
        color: '#10b981',
        recommendedAction: 'Manter controles existentes. Nenhuma ação imediata necessária.',
      },
      {
        minLevel: 5,
        maxLevel: 9,
        classification: 'TOLERABLE',
        color: '#3b82f6',
        recommendedAction: 'Monitorar periodicamente. Melhorias desejáveis sem prazo crítico.',
      },
      {
        minLevel: 10,
        maxLevel: 14,
        classification: 'MODERATE',
        color: '#f59e0b',
        recommendedAction: 'Implantar melhorias dentro de prazo definido. Gestão por plano de ação.',
      },
      {
        minLevel: 15,
        maxLevel: 19,
        classification: 'SUBSTANTIAL',
        color: '#f97316',
        recommendedAction: 'Ação corretiva prioritária. Não iniciar atividade sem redução do risco.',
      },
      {
        minLevel: 20,
        maxLevel: 25,
        classification: 'INTOLERABLE',
        color: '#ef4444',
        recommendedAction: 'Paralisação imediata da atividade. Risco não pode ser tolerado.',
      },
    ],
    updatedAt: '2026-01-01T00:00:00Z',
  };
}

// ─── Documents ────────────────────────────────────────────────────────────────
const documents: GRODocument[] = [
  {
    id: 'doc-inv-2026-01',
    tenantId: 'toyota-br',
    type: 'INVENTORY',
    name: 'Inventário de Riscos GRO — Toyota Brasil Sorocaba — Jan/2026',
    version: 1,
    generatedAt: '2026-01-31T17:00:00Z',
    generatedBy: 'Ricardo Silva',
    trigger: 'Primeira publicação do inventário de riscos pós-implementação do GRO',
    status: 'signed',
  },
  {
    id: 'doc-pgr-2026-01',
    tenantId: 'toyota-br',
    type: 'PGR_FULL',
    name: 'PGR Completo — Toyota Brasil Sorocaba — Ciclo 2026',
    version: 1,
    generatedAt: '2026-02-28T17:00:00Z',
    generatedBy: 'Ricardo Silva',
    trigger: 'Emissão do PGR para o ciclo 2026 conforme NR-1 §1.4.1 a §1.4.3',
    status: 'generated',
  },
];

// ─── Seed function ─────────────────────────────────────────────────────────────
export function seedGROData(tenantId: string): void {
  // Filter data to the given tenantId (establishments, inventory, etc.)
  const tenantEstablishments = establishments.filter((e) => e.tenantId === tenantId);

  // Resolve which establishmentIds belong to this tenant
  const estIds = new Set(tenantEstablishments.map((e) => e.id));
  const tenantSectors = sectors.filter((s) => estIds.has(s.establishmentId));

  const sectorIds = new Set(tenantSectors.map((s) => s.id));
  const tenantRoles      = roles.filter((r) => sectorIds.has(r.sectorId));
  const tenantActivities = activities.filter((a) => sectorIds.has(a.sectorId));
  const tenantInventory  = inventory.filter((i) => i.tenantId === tenantId);

  const inventoryIds = new Set(tenantInventory.map((i) => i.id));
  const tenantActions   = actions.filter((a) => inventoryIds.has(a.riskId));
  const tenantDocuments = documents.filter((d) => d.tenantId === tenantId);

  saveEstablishments(tenantEstablishments);
  saveSectors(tenantSectors);
  saveRoles(tenantRoles);
  saveActivities(tenantActivities);
  saveInventory(tenantInventory);
  saveActions(tenantActions);
  saveCriteria(getDefaultCriteria(tenantId));
  saveDocuments(tenantDocuments);
}
