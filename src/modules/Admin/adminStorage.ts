export interface AdminTenantInput {
  id: string;
  name: string;
}

export type AdminHealth = 'healthy' | 'attention' | 'critical' | 'onboarding';
export type AdminClosingStatus = 'not_started' | 'open' | 'review' | 'closed';
export type AdminReportStatus = 'draft' | 'ready' | 'shared';

export interface AdminContractRecord {
  id: string;
  name: string;
  owner: string;
  cnpj?: string;
  segment?: string;
  units: number;
  users: number;
  employeeBase: number;
  publishedForms: number;
  nr1Cycles: number;
  nr1Responses: number;
  adherenceRate: number;
  highRiskSectors: number;
  pendingAbsenteeism: number;
  openComplaints: number;
  actionPlansOpen: number;
  actionPlansDelayed: number;
  primaryRisk: string;
  reportStatus: AdminReportStatus;
  closingStatus: AdminClosingStatus;
  health: AdminHealth;
  notes: string;
  lastUpdate: string;
}

export type AdminUserRole = 'admin_atividade' | 'professional' | 'tecnico_sst';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  tenantId: string | null;
  status: 'active' | 'pending';
  createdAt: string;
}

const STORAGE_KEY = 'atividade-nr1-admin-v1';

function createDefaultRecord(tenant: AdminTenantInput, index: number): AdminContractRecord {
  const isPrimary = tenant.id === 'toyota-br' || index === 0;
  const riskThemes = [
    'Sobrecarga e lideranca',
    'Turno e fadiga',
    'Pressao por meta',
    'Conflito de papel',
    'Clima e comunicacao',
  ];
  const riskTheme = riskThemes[index % riskThemes.length];

  return {
    id: tenant.id,
    name: tenant.name,
    owner: isPrimary ? 'Ricardo Prof' : 'Ana Silva',
    units: isPrimary ? 2 : 1,
    users: isPrimary ? 8 : 4,
    employeeBase: isPrimary ? 186 : 94,
    publishedForms: isPrimary ? 2 : 1,
    nr1Cycles: isPrimary ? 2 : 0,
    nr1Responses: isPrimary ? 124 : 0,
    adherenceRate: isPrimary ? 81 : 0,
    highRiskSectors: isPrimary ? 3 : 0,
    pendingAbsenteeism: isPrimary ? 2 : 1,
    openComplaints: isPrimary ? 3 : 0,
    actionPlansOpen: isPrimary ? 9 : 4,
    actionPlansDelayed: isPrimary ? 2 : 1,
    primaryRisk: riskTheme,
    reportStatus: isPrimary ? 'ready' : 'draft',
    closingStatus: isPrimary ? 'review' : 'open',
    health: isPrimary ? 'attention' : 'onboarding',
    notes: isPrimary
      ? 'Contrato com coleta NR1 ativa, radar psicossocial consolidado e backlog leve de fechamento.'
      : 'Contrato em fase inicial de configuracao, com foco em abrir ciclo e estruturar governanca NR1.',
    lastUpdate: new Date().toISOString(),
  };
}

function getDefaults(tenants: AdminTenantInput[]) {
  return tenants.map((tenant, index) => createDefaultRecord(tenant, index));
}

export function loadAdminContracts(tenants: AdminTenantInput[]) {
  const defaults = getDefaults(tenants);

  if (typeof window === 'undefined') {
    return defaults;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }

    const storedMap = new Map(parsed.map((record: AdminContractRecord) => [record.id, record]));
    const merged = tenants.map((tenant, index) => ({
      ...createDefaultRecord(tenant, index),
      ...(storedMap.get(tenant.id) || {}),
      id: tenant.id,
      name: tenant.name,
    }));

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }
}

export function saveAdminContracts(records: AdminContractRecord[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function resetAdminContracts(tenants: AdminTenantInput[]) {
  const defaults = getDefaults(tenants);
  saveAdminContracts(defaults);
  return defaults;
}

// ─── Admin Users ───────────────────────────────────────────────────────────────
const USERS_KEY = 'atividade-admin-users-v1';

const defaultUsers: AdminUser[] = [
  { id: 'u1', name: 'Admin Atividade', email: 'admin@atividade.com.br', role: 'admin_atividade', tenantId: null, status: 'active', createdAt: '2025-01-15T10:00:00Z' },
  { id: 'u2', name: 'Ricardo Silva', email: 'ricardo@atividade.com.br', role: 'professional', tenantId: 'toyota-br', status: 'active', createdAt: '2025-02-01T08:00:00Z' },
  { id: 'u3', name: 'Ana Paula Mendes', email: 'ana.paula@atividade.com.br', role: 'professional', tenantId: 'usina-pilon', status: 'active', createdAt: '2025-03-10T09:00:00Z' },
  { id: 'u4', name: 'Carlos Eduardo', email: 'carlos@atividade.com.br', role: 'tecnico_sst', tenantId: 'toyota-br', status: 'active', createdAt: '2025-06-01T14:00:00Z' },
  { id: 'u5', name: 'Juliana Ferraz', email: 'juliana@atividade.com.br', role: 'tecnico_sst', tenantId: 'usina-pilon', status: 'pending', createdAt: '2026-03-20T11:00:00Z' },
];

export function loadAdminUsers(): AdminUser[] {
  if (typeof window === 'undefined') return defaultUsers;
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) {
      window.localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultUsers;
  } catch {
    return defaultUsers;
  }
}

export function saveAdminUsers(users: AdminUser[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
