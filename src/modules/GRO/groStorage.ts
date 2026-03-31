// GRO localStorage CRUD — NR-1 Compliance Module

import type {
  GROEstablishment,
  GROSector,
  GRORole,
  GROActivity,
  RiskInventoryItem,
  GROActionItem,
  CriteriaMatrix,
  GRODocument,
} from './types.js';

// ─── Storage Keys ──────────────────────────────────────────────────────────────
const KEYS = {
  establishments: 'gro-establishments-v1',
  sectors:        'gro-sectors-v1',
  roles:          'gro-roles-v1',
  activities:     'gro-activities-v1',
  inventory:      'gro-inventory-v1',
  actions:        'gro-actions-v1',
  criteria:       'gro-criteria-v1',
  documents:      'gro-documents-v1',
} as const;

// ─── Generic helpers ───────────────────────────────────────────────────────────
function readRaw<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeRaw<T>(key: string, items: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // quota exceeded or private-mode restriction — fail silently
  }
}

// ─── Establishments ────────────────────────────────────────────────────────────
export function loadEstablishments(tenantId: string): GROEstablishment[] {
  return readRaw<GROEstablishment>(KEYS.establishments).filter(
    (e) => e.tenantId === tenantId,
  );
}

export function saveEstablishments(items: GROEstablishment[]): void {
  // Merge: keep existing records from other tenants, replace those matching
  // the same tenantId as the new items (or all if items is complete).
  const tenantIds = new Set(items.map((i) => i.tenantId));
  const others = readRaw<GROEstablishment>(KEYS.establishments).filter(
    (e) => !tenantIds.has(e.tenantId),
  );
  writeRaw(KEYS.establishments, [...others, ...items]);
}

// ─── Sectors ──────────────────────────────────────────────────────────────────
export function loadSectors(): GROSector[] {
  return readRaw<GROSector>(KEYS.sectors);
}

export function saveSectors(items: GROSector[]): void {
  writeRaw(KEYS.sectors, items);
}

// ─── Roles ────────────────────────────────────────────────────────────────────
export function loadRoles(): GRORole[] {
  return readRaw<GRORole>(KEYS.roles);
}

export function saveRoles(items: GRORole[]): void {
  writeRaw(KEYS.roles, items);
}

// ─── Activities ───────────────────────────────────────────────────────────────
export function loadActivities(): GROActivity[] {
  return readRaw<GROActivity>(KEYS.activities);
}

export function saveActivities(items: GROActivity[]): void {
  writeRaw(KEYS.activities, items);
}

// ─── Risk Inventory ───────────────────────────────────────────────────────────
export function loadInventory(tenantId: string): RiskInventoryItem[] {
  return readRaw<RiskInventoryItem>(KEYS.inventory).filter(
    (i) => i.tenantId === tenantId,
  );
}

export function saveInventory(items: RiskInventoryItem[]): void {
  const tenantIds = new Set(items.map((i) => i.tenantId));
  const others = readRaw<RiskInventoryItem>(KEYS.inventory).filter(
    (i) => !tenantIds.has(i.tenantId),
  );
  writeRaw(KEYS.inventory, [...others, ...items]);
}

// ─── Actions ──────────────────────────────────────────────────────────────────
export function loadActions(): GROActionItem[] {
  return readRaw<GROActionItem>(KEYS.actions);
}

export function saveActions(items: GROActionItem[]): void {
  writeRaw(KEYS.actions, items);
}

// ─── Criteria Matrix ──────────────────────────────────────────────────────────
export function loadCriteria(tenantId: string): CriteriaMatrix | null {
  const all = readRaw<CriteriaMatrix>(KEYS.criteria);
  return all.find((c) => c.tenantId === tenantId) ?? null;
}

export function saveCriteria(item: CriteriaMatrix): void {
  const others = readRaw<CriteriaMatrix>(KEYS.criteria).filter(
    (c) => c.tenantId !== item.tenantId,
  );
  writeRaw(KEYS.criteria, [...others, item]);
}

// ─── Documents ────────────────────────────────────────────────────────────────
export function loadDocuments(tenantId: string): GRODocument[] {
  return readRaw<GRODocument>(KEYS.documents).filter(
    (d) => d.tenantId === tenantId,
  );
}

export function saveDocuments(items: GRODocument[]): void {
  const tenantIds = new Set(items.map((d) => d.tenantId));
  const others = readRaw<GRODocument>(KEYS.documents).filter(
    (d) => !tenantIds.has(d.tenantId),
  );
  writeRaw(KEYS.documents, [...others, ...items]);
}
