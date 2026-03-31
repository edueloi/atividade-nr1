const STORAGE_KEY = 'atividade-ginastica-laboral-v1';

export type GymSessionStatus = 'planned' | 'running' | 'finished';
export type GymExternalShareStatus = 'active' | 'closed';
export type GymParticipantSource = 'internal' | 'external';

export interface GymExercise {
  id: string;
  name: string;
  focus: string;
  durationMinutes: number;
  completed: boolean;
}

export interface GymParticipant {
  id: string;
  name: string;
  badge: string;
  role: string;
  present: boolean;
  source: GymParticipantSource;
  lastCheckInAt?: string;
  feedbackScore?: number;
  feedbackHelped?: 'yes' | 'no';
  favoriteExercise?: string;
  feedbackComment?: string;
}

export interface GymSession {
  id: string;
  tenantId: string;
  unitName: string;
  sectorName: string;
  shiftName: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  expectedCount: number;
  instructorName: string;
  status: GymSessionStatus;
  notes: string;
  evidenceCount: number;
  exercises: GymExercise[];
  participants: GymParticipant[];
  externalShareToken?: string;
}

export interface GymSchedule {
  id: string;
  tenantId: string;
  unitName: string;
  sectorName: string;
  shiftName: string;
  dayOfWeek: number;
  startTime: string;
  durationMinutes: number;
  expectedCount: number;
  instructorName: string;
  exercises: GymExercise[];
}

export interface GymMonthlySnapshot {
  month: string;
  rate: number;
  satisfaction: number;
  planned: number;
  completed: number;
  externalForms: number;
}

export interface GymExternalShare {
  token: string;
  sessionId: string;
  status: GymExternalShareStatus;
  createdAt: string;
  opens: number;
  submissions: number;
  lastSubmissionAt?: string;
}

export interface GymTenantState {
  tenantId: string;
  tenantName: string;
  sessions: GymSession[];
  schedules: GymSchedule[];
  monthlySnapshots: GymMonthlySnapshot[];
  externalShares: GymExternalShare[];
}

interface GymStorageRoot {
  version: 1;
  tenants: GymTenantState[];
}

export interface GymExternalFormData {
  tenantName: string;
  session: GymSession;
  share: GymExternalShare;
}

export interface GymExternalFormSubmission {
  name: string;
  badge: string;
  role: string;
  feedbackScore: number;
  feedbackHelped: 'yes' | 'no';
  favoriteExercise: string;
  feedbackComment: string;
}

const MONTH_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function formatIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function shiftDate(base: Date, days: number) {
  const next = new Date(base);
  next.setDate(base.getDate() + days);
  return next;
}

function monthLabel(date: Date) {
  return `${MONTH_LABELS[date.getMonth()]}/${String(date.getFullYear()).slice(-2)}`;
}

function readRoot(): GymStorageRoot {
  if (typeof window === 'undefined') {
    return { version: 1, tenants: [] };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { version: 1, tenants: [] };
    }

    const parsed = JSON.parse(raw) as GymStorageRoot;
    if (!parsed || !Array.isArray(parsed.tenants)) {
      return { version: 1, tenants: [] };
    }

    return {
      version: 1,
      tenants: parsed.tenants.map((tenant) => ({
        tenantId: tenant.tenantId,
        tenantName: tenant.tenantName,
        sessions: Array.isArray(tenant.sessions) ? tenant.sessions : [],
        schedules: Array.isArray(tenant.schedules) ? tenant.schedules : [],
        monthlySnapshots: Array.isArray(tenant.monthlySnapshots) ? tenant.monthlySnapshots : [],
        externalShares: Array.isArray(tenant.externalShares) ? tenant.externalShares : [],
      })),
    };
  } catch {
    return { version: 1, tenants: [] };
  }
}

function writeRoot(root: GymStorageRoot) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(root));
}

function createExercises(seed: string): GymExercise[] {
  const templates: Record<string, Array<Omit<GymExercise, 'id' | 'completed'>>> = {
    production: [
      { name: 'Mobilidade cervical', focus: 'Pescoco e ombros', durationMinutes: 3 },
      { name: 'Abertura escapular', focus: 'Coluna toracica', durationMinutes: 4 },
      { name: 'Punhos e antebracos', focus: 'Membros superiores', durationMinutes: 3 },
      { name: 'Respiracao guiada', focus: 'Recuperacao rapida', durationMinutes: 2 },
    ],
    logistics: [
      { name: 'Aquecimento articular', focus: 'Corpo inteiro', durationMinutes: 3 },
      { name: 'Alongamento lombar', focus: 'Coluna e quadril', durationMinutes: 4 },
      { name: 'Posterior de coxa', focus: 'Membros inferiores', durationMinutes: 4 },
      { name: 'Respiracao e foco', focus: 'Ritmo e postura', durationMinutes: 2 },
    ],
    maintenance: [
      { name: 'Rotacao de tronco', focus: 'Coluna', durationMinutes: 3 },
      { name: 'Ombro e peitoral', focus: 'Membros superiores', durationMinutes: 4 },
      { name: 'Punho e pegada', focus: 'Ferramental', durationMinutes: 3 },
      { name: 'Pausa ativa final', focus: 'Recuperacao', durationMinutes: 2 },
    ],
  };

  const selected = templates[seed] || templates.production;
  return selected.map((exercise) => ({
    ...exercise,
    id: createId('exercise'),
    completed: false,
  }));
}

function createParticipants(names: string[], badgePrefix: string, role: string) {
  return names.map((name, index) => ({
    id: createId('participant'),
    name,
    badge: `${badgePrefix}-${String(index + 1).padStart(3, '0')}`,
    role,
    present: false,
    source: 'internal' as const,
  }));
}

function buildMonthlySnapshots(primary: boolean) {
  const baseDate = new Date();
  const rates = primary ? [76, 79, 81, 83, 84, 86] : [71, 73, 75, 76, 78, 80];
  const satisfaction = primary ? [4.1, 4.2, 4.3, 4.4, 4.5, 4.6] : [3.8, 3.9, 4.0, 4.1, 4.1, 4.2];
  const planned = primary ? [82, 84, 86, 87, 88, 90] : [42, 44, 44, 45, 46, 47];
  const completed = primary ? [78, 80, 82, 84, 85, 87] : [39, 41, 42, 43, 44, 45];
  const externalForms = primary ? [9, 11, 14, 16, 18, 20] : [4, 5, 6, 7, 8, 9];

  return Array.from({ length: 6 }, (_, index) => {
    const reference = new Date(baseDate.getFullYear(), baseDate.getMonth() - (5 - index), 1);
    return {
      month: monthLabel(reference),
      rate: rates[index],
      satisfaction: satisfaction[index],
      planned: planned[index],
      completed: completed[index],
      externalForms: externalForms[index],
    };
  });
}

function createSeedState(tenantId: string, tenantName: string): GymTenantState {
  const primary = tenantId === 'toyota-br';
  const today = new Date();
  const todayKey = formatIsoDate(today);
  const yesterdayKey = formatIsoDate(shiftDate(today, -1));
  const tomorrowKey = formatIsoDate(shiftDate(today, 1));

  const lineRoster = createParticipants(
    ['Ana Costa', 'Bruno Lima', 'Carla Dias', 'Diego Souza', 'Elaine Melo', 'Felipe Rocha', 'Gisele Moraes', 'Henrique Paes', 'Iris Neves', 'Joao Cezar', 'Kelly Prado', 'Lucas Faria'],
    'GL-A',
    'Operador(a)',
  );
  const logisticsRoster = createParticipants(
    ['Marcia Lopes', 'Nicolas Reis', 'Olivia Viana', 'Paulo Moura', 'Renata Salles', 'Sergio Pires', 'Tamara Luz', 'Vinicius Prado', 'William Teles', 'Yasmin Rosa'],
    'GL-L',
    'Logistica',
  );
  const maintenanceRoster = createParticipants(
    ['Adriano Nogueira', 'Bianca Serra', 'Caio Mello', 'Daniela Tavares', 'Erik Santana', 'Fabiana Alves', 'Guilherme Mota', 'Helena Costa'],
    'GL-M',
    'Manutencao',
  );

  const finishedParticipants = clone(lineRoster).map((participant, index) => ({
    ...participant,
    present: index < 10,
    feedbackScore: index < 8 ? 4 + (index % 2) : undefined,
    feedbackHelped: index < 8 ? ('yes' as const) : undefined,
    favoriteExercise: index < 6 ? 'Alongamento lombar' : undefined,
    feedbackComment: index === 0 ? 'Sequencia curta e objetiva para o turno.' : undefined,
  }));

  const runningParticipants = clone(logisticsRoster).map((participant, index) => ({
    ...participant,
    present: index < 6,
  }));

  const sessions: GymSession[] = [
    {
      id: createId('session'),
      tenantId,
      unitName: primary ? 'Unidade Sorocaba' : 'Unidade Industrial 01',
      sectorName: 'Producao Linha A',
      shiftName: '1o turno',
      date: todayKey,
      startTime: '08:10',
      durationMinutes: 12,
      expectedCount: lineRoster.length,
      instructorName: 'Ricardo Silva',
      status: 'planned',
      notes: 'Turma com foco em cervical, ombro e punho por repeticao.',
      evidenceCount: 0,
      exercises: createExercises('production'),
      participants: clone(lineRoster),
    },
    {
      id: createId('session'),
      tenantId,
      unitName: primary ? 'Unidade Sorocaba' : 'Unidade Industrial 01',
      sectorName: 'Logistica Interna',
      shiftName: '2o turno',
      date: todayKey,
      startTime: '13:40',
      durationMinutes: 10,
      expectedCount: logisticsRoster.length,
      instructorName: primary ? 'Ricardo Silva' : 'Ana Paula Mendes',
      status: 'running',
      notes: 'Equipe pediu reforco em lombar e posterior de coxa.',
      evidenceCount: 1,
      exercises: createExercises('logistics').map((exercise, index) => ({
        ...exercise,
        completed: index < 2,
      })),
      participants: runningParticipants,
    },
    {
      id: createId('session'),
      tenantId,
      unitName: primary ? 'Unidade Sorocaba' : 'Unidade Industrial 01',
      sectorName: 'Manutencao',
      shiftName: '3o turno',
      date: todayKey,
      startTime: '22:05',
      durationMinutes: 12,
      expectedCount: maintenanceRoster.length,
      instructorName: primary ? 'Carlos Eduardo' : 'Juliana Ferraz',
      status: 'planned',
      notes: 'Turma de noite com mais aderencia quando a aula comeca no posto.',
      evidenceCount: 0,
      exercises: createExercises('maintenance'),
      participants: clone(maintenanceRoster),
    },
    {
      id: createId('session'),
      tenantId,
      unitName: primary ? 'Unidade Sorocaba' : 'Unidade Industrial 01',
      sectorName: 'Expedicao',
      shiftName: '1o turno',
      date: yesterdayKey,
      startTime: '09:30',
      durationMinutes: 10,
      expectedCount: finishedParticipants.length,
      instructorName: primary ? 'Ricardo Silva' : 'Ana Paula Mendes',
      status: 'finished',
      notes: 'Bom engajamento. Pedido para repetir rotacao de tronco na proxima semana.',
      evidenceCount: 2,
      exercises: createExercises('logistics').map((exercise) => ({ ...exercise, completed: true })),
      participants: finishedParticipants,
    },
    {
      id: createId('session'),
      tenantId,
      unitName: primary ? 'Unidade Sorocaba' : 'Unidade Industrial 01',
      sectorName: 'Qualidade',
      shiftName: 'Administrativo',
      date: tomorrowKey,
      startTime: '15:10',
      durationMinutes: 8,
      expectedCount: 9,
      instructorName: 'Ricardo Silva',
      status: 'planned',
      notes: 'Pausa ativa breve antes da reuniao de fechamento.',
      evidenceCount: 0,
      exercises: createExercises('production'),
      participants: createParticipants(
        ['Alice Moraes', 'Breno Campos', 'Cintia Ramos', 'Davi Lacerda', 'Edna Monteiro', 'Fernando Reis', 'Giovana Pacheco', 'Heitor Cunha', 'Isabela Porto'],
        'GL-Q',
        'Qualidade',
      ),
    },
  ];

  const schedules: GymSchedule[] = [
    {
      id: createId('schedule'),
      tenantId,
      unitName: primary ? 'Unidade Sorocaba' : 'Unidade Industrial 01',
      sectorName: 'Producao Linha A',
      shiftName: '1o turno',
      dayOfWeek: 1,
      startTime: '08:10',
      durationMinutes: 12,
      expectedCount: 12,
      instructorName: 'Ricardo Silva',
      exercises: createExercises('production'),
    },
    {
      id: createId('schedule'),
      tenantId,
      unitName: primary ? 'Unidade Sorocaba' : 'Unidade Industrial 01',
      sectorName: 'Logistica Interna',
      shiftName: '2o turno',
      dayOfWeek: 2,
      startTime: '13:40',
      durationMinutes: 10,
      expectedCount: 10,
      instructorName: primary ? 'Ricardo Silva' : 'Ana Paula Mendes',
      exercises: createExercises('logistics'),
    },
    {
      id: createId('schedule'),
      tenantId,
      unitName: primary ? 'Unidade Sorocaba' : 'Unidade Industrial 01',
      sectorName: 'Manutencao',
      shiftName: '3o turno',
      dayOfWeek: 3,
      startTime: '22:05',
      durationMinutes: 12,
      expectedCount: 8,
      instructorName: primary ? 'Carlos Eduardo' : 'Juliana Ferraz',
      exercises: createExercises('maintenance'),
    },
    {
      id: createId('schedule'),
      tenantId,
      unitName: primary ? 'Unidade Sorocaba' : 'Unidade Industrial 01',
      sectorName: 'Qualidade',
      shiftName: 'Administrativo',
      dayOfWeek: 4,
      startTime: '15:10',
      durationMinutes: 8,
      expectedCount: 9,
      instructorName: 'Ricardo Silva',
      exercises: createExercises('production'),
    },
    {
      id: createId('schedule'),
      tenantId,
      unitName: primary ? 'Unidade Sorocaba' : 'Unidade Industrial 01',
      sectorName: 'Expedicao',
      shiftName: '1o turno',
      dayOfWeek: 5,
      startTime: '09:30',
      durationMinutes: 10,
      expectedCount: 11,
      instructorName: primary ? 'Ricardo Silva' : 'Ana Paula Mendes',
      exercises: createExercises('logistics'),
    },
  ];

  const externalShares: GymExternalShare[] = [
    {
      token: createId('gymform'),
      sessionId: sessions[1].id,
      status: 'active',
      createdAt: new Date().toISOString(),
      opens: 12,
      submissions: 6,
      lastSubmissionAt: new Date().toISOString(),
    },
    {
      token: createId('gymform'),
      sessionId: sessions[3].id,
      status: 'closed',
      createdAt: new Date().toISOString(),
      opens: 17,
      submissions: 8,
      lastSubmissionAt: new Date().toISOString(),
    },
  ];

  sessions[1].externalShareToken = externalShares[0].token;
  sessions[3].externalShareToken = externalShares[1].token;

  return {
    tenantId,
    tenantName,
    sessions,
    schedules,
    monthlySnapshots: buildMonthlySnapshots(primary),
    externalShares,
  };
}

function ensureTenantState(root: GymStorageRoot, tenantId: string, tenantName: string) {
  let tenant = root.tenants.find((item) => item.tenantId === tenantId);
  if (!tenant) {
    tenant = createSeedState(tenantId, tenantName);
    root.tenants.push(tenant);
    return { tenant, changed: true };
  }

  let changed = false;
  if (tenant.tenantName !== tenantName) {
    tenant.tenantName = tenantName;
    changed = true;
  }

  if (!Array.isArray(tenant.monthlySnapshots) || tenant.monthlySnapshots.length === 0) {
    tenant.monthlySnapshots = buildMonthlySnapshots(tenantId === 'toyota-br');
    changed = true;
  }

  if (!Array.isArray(tenant.externalShares)) {
    tenant.externalShares = [];
    changed = true;
  }

  return { tenant, changed };
}

function withTenantState<T>(
  tenantId: string,
  tenantName: string,
  updater?: (tenant: GymTenantState) => T,
) {
  const root = readRoot();
  const ensured = ensureTenantState(root, tenantId, tenantName);
  const result = updater ? updater(ensured.tenant) : undefined;
  if (ensured.changed || updater) {
    writeRoot(root);
  }
  return {
    tenant: clone(ensured.tenant),
    result,
  };
}

export function loadGymTenantState(tenantId: string, tenantName: string) {
  return withTenantState(tenantId, tenantName).tenant;
}

export function saveGymSession(tenantId: string, tenantName: string, session: GymSession) {
  return withTenantState(tenantId, tenantName, (tenant) => {
    const index = tenant.sessions.findIndex((item) => item.id === session.id);
    if (index >= 0) {
      tenant.sessions[index] = clone(session);
    } else {
      tenant.sessions.unshift(clone(session));
    }
  }).tenant;
}

export function createAdhocGymSession(tenantId: string, tenantName: string, instructorName: string) {
  let created: GymSession | null = null;

  withTenantState(tenantId, tenantName, (tenant) => {
    const today = formatIsoDate(new Date());
    const defaultParticipants = createParticipants(
      ['Colaborador 01', 'Colaborador 02', 'Colaborador 03', 'Colaborador 04', 'Colaborador 05', 'Colaborador 06'],
      'GL-X',
      'Equipe',
    );
    const referenceSchedule = tenant.schedules[0];
    const referenceSession = tenant.sessions[0];
    const participants = clone(referenceSession?.participants || defaultParticipants);
    const exercises = clone(referenceSchedule?.exercises || referenceSession?.exercises || createExercises('production'));

    created = {
      id: createId('session'),
      tenantId,
      unitName: referenceSchedule?.unitName || referenceSession?.unitName || tenantName,
      sectorName: referenceSchedule?.sectorName || referenceSession?.sectorName || 'Nova turma',
      shiftName: referenceSchedule?.shiftName || referenceSession?.shiftName || 'Turno customizado',
      date: today,
      startTime: referenceSchedule?.startTime || referenceSession?.startTime || '10:00',
      durationMinutes: referenceSchedule?.durationMinutes || referenceSession?.durationMinutes || 10,
      expectedCount: participants.length,
      instructorName: referenceSchedule?.instructorName || referenceSession?.instructorName || instructorName,
      status: 'planned',
      notes: 'Sessao criada manualmente para ajuste operacional.',
      evidenceCount: 0,
      exercises,
      participants,
    };

    tenant.sessions.unshift(created);
  });

  return clone(created as GymSession);
}

export function upsertGymSchedule(tenantId: string, tenantName: string, schedule: GymSchedule) {
  return withTenantState(tenantId, tenantName, (tenant) => {
    const index = tenant.schedules.findIndex((item) => item.id === schedule.id);
    if (index >= 0) {
      tenant.schedules[index] = clone(schedule);
    } else {
      tenant.schedules.push(clone(schedule));
    }
  }).tenant;
}

export function removeGymSchedule(tenantId: string, tenantName: string, scheduleId: string) {
  return withTenantState(tenantId, tenantName, (tenant) => {
    tenant.schedules = tenant.schedules.filter((schedule) => schedule.id !== scheduleId);
  }).tenant;
}

export function createGymExternalShare(tenantId: string, tenantName: string, sessionId: string) {
  let created: GymExternalShare | null = null;

  withTenantState(tenantId, tenantName, (tenant) => {
    const session = tenant.sessions.find((item) => item.id === sessionId);
    if (!session) {
      return;
    }

    if (session.externalShareToken) {
      const existing = tenant.externalShares.find((item) => item.token === session.externalShareToken);
      if (existing) {
        existing.status = 'active';
        created = clone(existing);
        return;
      }
    }

    const share: GymExternalShare = {
      token: createId('gymform'),
      sessionId,
      status: 'active',
      createdAt: new Date().toISOString(),
      opens: 0,
      submissions: 0,
    };

    session.externalShareToken = share.token;
    tenant.externalShares.unshift(share);
    created = clone(share);
  });

  return created;
}

export function loadGymExternalForm(token: string): GymExternalFormData | null {
  const root = readRoot();

  for (const tenant of root.tenants) {
    const share = tenant.externalShares.find((item) => item.token === token);
    if (!share) continue;

    const session = tenant.sessions.find((item) => item.id === share.sessionId);
    if (!session) continue;

    return {
      tenantName: tenant.tenantName,
      session: clone(session),
      share: clone(share),
    };
  }

  return null;
}

export function registerGymExternalOpen(token: string) {
  const root = readRoot();
  let changed = false;

  for (const tenant of root.tenants) {
    const share = tenant.externalShares.find((item) => item.token === token);
    if (!share) continue;
    share.opens += 1;
    changed = true;
    break;
  }

  if (changed) {
    writeRoot(root);
  }
}

export function submitGymExternalForm(token: string, submission: GymExternalFormSubmission) {
  const root = readRoot();

  for (const tenant of root.tenants) {
    const share = tenant.externalShares.find((item) => item.token === token);
    if (!share || share.status !== 'active') continue;

    const session = tenant.sessions.find((item) => item.id === share.sessionId);
    if (!session) continue;

    const normalizedName = submission.name.trim().toLowerCase();
    const normalizedBadge = submission.badge.trim().toLowerCase();

    let participant = session.participants.find((item) => {
      const nameMatch = item.name.trim().toLowerCase() === normalizedName;
      const badgeMatch = normalizedBadge.length > 0 && item.badge.trim().toLowerCase() === normalizedBadge;
      return nameMatch || badgeMatch;
    });

    if (!participant) {
      participant = {
        id: createId('participant'),
        name: submission.name.trim(),
        badge: submission.badge.trim() || `EXT-${String(session.participants.length + 1).padStart(3, '0')}`,
        role: submission.role.trim() || 'Colaborador(a)',
        present: true,
        source: 'external',
      };
      session.participants.push(participant);
    }

    participant.present = true;
    participant.source = 'external';
    participant.lastCheckInAt = new Date().toISOString();
    participant.role = submission.role.trim() || participant.role;
    participant.feedbackScore = submission.feedbackScore;
    participant.feedbackHelped = submission.feedbackHelped;
    participant.favoriteExercise = submission.favoriteExercise.trim();
    participant.feedbackComment = submission.feedbackComment.trim();

    share.submissions += 1;
    share.lastSubmissionAt = new Date().toISOString();

    writeRoot(root);

    return {
      tenantName: tenant.tenantName,
      session: clone(session),
      share: clone(share),
    };
  }

  return null;
}
