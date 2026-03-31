import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Brain,
  ClipboardCheck,
  Clock3,
  ExternalLink,
  FileText,
  Filter,
  LayoutDashboard,
  Pencil,
  Radar,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  type AdminClosingStatus,
  type AdminContractRecord,
  type AdminHealth,
  type AdminReportStatus,
  loadAdminContracts,
  resetAdminContracts,
  saveAdminContracts,
} from './adminStorage.js';

interface Tenant {
  id: string;
  name: string;
}

interface AdminViewProps {
  tenants: Tenant[];
  onSelectTenant: (tenant: Tenant) => void;
}

type AlertSeverity = 'critical' | 'attention' | 'info';

const healthLabel: Record<AdminHealth, string> = {
  healthy: 'Saudável',
  attention: 'Atenção',
  critical: 'Crítico',
  onboarding: 'Onboarding',
};

const healthClasses: Record<AdminHealth, string> = {
  healthy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  attention: 'bg-amber-50 text-amber-700 border-amber-200',
  critical: 'bg-rose-50 text-rose-700 border-rose-200',
  onboarding: 'bg-blue-50 text-blue-700 border-blue-200',
};

const closingLabel: Record<AdminClosingStatus, string> = {
  not_started: 'Não iniciado',
  open: 'Aberto',
  review: 'Em revisão',
  closed: 'Fechado',
};

const reportLabel: Record<AdminReportStatus, string> = {
  draft: 'Rascunho',
  ready: 'Pronto',
  shared: 'Compartilhado',
};

const reportClasses: Record<AdminReportStatus, string> = {
  draft: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  ready: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  shared: 'bg-blue-50 text-blue-700 border-blue-200',
};

const alertClasses: Record<AlertSeverity, string> = {
  critical: 'bg-rose-50 border-rose-200 text-rose-700',
  attention: 'bg-amber-50 border-amber-200 text-amber-700',
  info: 'bg-blue-50 border-blue-200 text-blue-700',
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function StatCard({
  title,
  value,
  hint,
  icon,
  tone,
}: {
  title: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
  tone: 'slate' | 'emerald' | 'blue' | 'amber' | 'rose' | 'violet';
}) {
  const toneClasses = {
    slate: 'bg-zinc-100 text-zinc-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
    rose: 'bg-rose-100 text-rose-700',
    violet: 'bg-violet-100 text-violet-700',
  } as const;

  return (
    <div className="bg-white p-6 rounded-[28px] border border-zinc-200 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${toneClasses[tone]}`}>
          {icon}
        </div>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400 mb-2">{title}</p>
      <div className="text-3xl font-black text-zinc-900">{value}</div>
      <p className="text-sm text-zinc-500 mt-2">{hint}</p>
    </div>
  );
}

export const AdminView: React.FC<AdminViewProps> = ({ tenants, onSelectTenant }) => {
  const [records, setRecords] = useState<AdminContractRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [healthFilter, setHealthFilter] = useState<'all' | AdminHealth>('all');
  const [draft, setDraft] = useState<AdminContractRecord | null>(null);

  useEffect(() => {
    setRecords(loadAdminContracts(tenants));
  }, [tenants]);

  const persistRecords = (next: AdminContractRecord[]) => {
    setRecords(next);
    saveAdminContracts(next);
  };

  const filteredRecords = records
    .filter((record) => {
      const normalizedSearch = searchTerm.toLowerCase();
      const matchesSearch =
        record.name.toLowerCase().includes(normalizedSearch) ||
        record.owner.toLowerCase().includes(normalizedSearch) ||
        record.primaryRisk.toLowerCase().includes(normalizedSearch);
      const matchesHealth = healthFilter === 'all' || record.health === healthFilter;
      return matchesSearch && matchesHealth;
    })
    .sort((left, right) => {
      const leftBacklog =
        left.pendingAbsenteeism +
        left.openComplaints +
        left.actionPlansDelayed +
        Math.max(0, 70 - left.adherenceRate);
      const rightBacklog =
        right.pendingAbsenteeism +
        right.openComplaints +
        right.actionPlansDelayed +
        Math.max(0, 70 - right.adherenceRate);
      return rightBacklog - leftBacklog;
    });

  const totalPending = records.reduce(
    (sum, record) => sum + record.pendingAbsenteeism + record.openComplaints + record.actionPlansDelayed,
    0,
  );
  const totalResponses = records.reduce((sum, record) => sum + record.nr1Responses, 0);
  const totalHighRiskSectors = records.reduce((sum, record) => sum + record.highRiskSectors, 0);
  const totalActionPlansOpen = records.reduce((sum, record) => sum + record.actionPlansOpen, 0);
  const cycleCoverage =
    records.length === 0 ? 0 : Math.round((records.filter((record) => record.nr1Cycles > 0).length / records.length) * 100);
  const formsCoverage =
    records.length === 0 ? 0 : Math.round((records.filter((record) => record.publishedForms > 0).length / records.length) * 100);
  const averageAdherence = average(records.filter((record) => record.nr1Cycles > 0).map((record) => record.adherenceRate));
  const totalEmployeeBase = records.reduce((sum, record) => sum + record.employeeBase, 0);
  const responseCoverage = totalEmployeeBase === 0 ? 0 : Math.min(100, Math.round((totalResponses / totalEmployeeBase) * 100));
  const readyReports = records.filter((record) => record.reportStatus === 'ready' || record.reportStatus === 'shared').length;
  const sharedReports = records.filter((record) => record.reportStatus === 'shared').length;
  const executiveReadyContracts = records.filter(
    (record) =>
      record.reportStatus !== 'draft' &&
      record.actionPlansDelayed === 0 &&
      record.closingStatus !== 'not_started' &&
      record.nr1Cycles > 0,
  ).length;

  const riskThemes = (
    Object.entries(
      records.reduce<Record<string, { contracts: number; sectors: number }>>((accumulator, record) => {
        const current = accumulator[record.primaryRisk] || { contracts: 0, sectors: 0 };
        accumulator[record.primaryRisk] = {
          contracts: current.contracts + 1,
          sectors: current.sectors + record.highRiskSectors,
        };
        return accumulator;
      }, {}),
    ) as Array<[string, { contracts: number; sectors: number }]>
  )
    .map(([theme, values]) => ({
      theme,
      contracts: values.contracts,
      sectors: values.sectors,
    }))
    .sort((left, right) => right.sectors - left.sectors)
    .slice(0, 5);

  const alerts = records
    .flatMap((record) => {
      const items: {
        id: string;
        severity: AlertSeverity;
        contract: string;
        title: string;
        detail: string;
      }[] = [];

      if (record.nr1Cycles === 0) {
        items.push({
          id: `${record.id}-cycle`,
          severity: 'critical',
          contract: record.name,
          title: 'Contrato sem ciclo NR1 ativo',
          detail: 'Abrir coleta psicossocial e publicar formulario para destravar a governanca do contrato.',
        });
      }

      if (record.adherenceRate > 0 && record.adherenceRate < 70) {
        items.push({
          id: `${record.id}-adhesion`,
          severity: 'attention',
          contract: record.name,
          title: `Adesao abaixo do alvo: ${record.adherenceRate}%`,
          detail: 'Reforcar mobilizacao com lideranca local e revisar setores sem resposta.',
        });
      }

      if (record.highRiskSectors >= 3) {
        items.push({
          id: `${record.id}-risk`,
          severity: 'critical',
          contract: record.name,
          title: `${record.highRiskSectors} setores criticos no radar`,
          detail: `Fator dominante: ${record.primaryRisk}. Acionar plano corretivo e acompanhamento clinico.`,
        });
      }

      if (record.actionPlansDelayed > 0) {
        items.push({
          id: `${record.id}-action`,
          severity: 'attention',
          contract: record.name,
          title: `${record.actionPlansDelayed} acoes atrasadas`,
          detail: 'Revisar prazo, owner e evidencias antes do fechamento mensal.',
        });
      }

      if (record.reportStatus === 'draft' && record.nr1Cycles > 0) {
        items.push({
          id: `${record.id}-report`,
          severity: 'info',
          contract: record.name,
          title: 'Relatorio executivo ainda em rascunho',
          detail: 'Consolidar leitura do ciclo, riscos e andamento do plano de acao.',
        });
      }

      return items;
    })
    .sort((left, right) => {
      const severityWeight = { critical: 3, attention: 2, info: 1 };
      return severityWeight[right.severity] - severityWeight[left.severity];
    })
    .slice(0, 8);

  const activityFeed = [...records]
    .sort((left, right) => new Date(right.lastUpdate).getTime() - new Date(left.lastUpdate).getTime())
    .slice(0, 6)
    .map((record) => ({
      id: record.id,
      contract: record.name,
      title:
        record.reportStatus === 'shared'
          ? 'Pacote executivo compartilhado'
          : record.health === 'critical'
            ? 'Contrato em observacao critica'
            : record.nr1Cycles > 0
              ? 'Radar psicossocial atualizado'
              : 'Contrato aguardando ativacao',
      detail: `${record.primaryRisk} - ${record.highRiskSectors} setores criticos - fechamento ${closingLabel[record.closingStatus].toLowerCase()}`,
      date: record.lastUpdate,
    }));

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-zinc-900 rounded-[20px] flex items-center justify-center shadow-xl shadow-zinc-200">
            <Shield className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Painel Admin NR1 Psicossocial</h1>
            <p className="text-zinc-500 font-medium">
              Visão global do programa: cobertura, adesão, risco psicossocial, plano de ação e relatório executivo.
            </p>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-400 mt-2">
              Protótipo funcional persistido em localStorage
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setRecords(loadAdminContracts(tenants))}
            className="px-5 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Recarregar
          </button>
          <button
            onClick={() => setRecords(resetAdminContracts(tenants))}
            className="px-5 py-3 bg-zinc-900 text-white rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-colors"
          >
            Resetar demo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-5">
        <StatCard
          title="Contratos"
          value={records.length.toString()}
          hint={`${cycleCoverage}% com ciclo ativo`}
          icon={<LayoutDashboard size={22} />}
          tone="slate"
        />
        <StatCard
          title="Adesão média"
          value={`${averageAdherence}%`}
          hint={`${responseCoverage}% da base respondida`}
          icon={<TrendingUp size={22} />}
          tone="emerald"
        />
        <StatCard
          title="Setores críticos"
          value={totalHighRiskSectors.toString()}
          hint="Radar psicossocial consolidado"
          icon={<Radar size={22} />}
          tone="rose"
        />
        <StatCard
          title="Planos de ação"
          value={totalActionPlansOpen.toString()}
          hint={`${records.reduce((sum, record) => sum + record.actionPlansDelayed, 0)} atrasados`}
          icon={<ClipboardCheck size={22} />}
          tone="amber"
        />
        <StatCard
          title="Formulários ativos"
          value={`${formsCoverage}%`}
          hint={`${records.reduce((sum, record) => sum + record.publishedForms, 0)} publicados`}
          icon={<FileText size={22} />}
          tone="blue"
        />
        <StatCard
          title="Prontidão executiva"
          value={executiveReadyContracts.toString()}
          hint={`${readyReports} relatórios prontos`}
          icon={<ShieldCheck size={22} />}
          tone="violet"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="bg-white rounded-[34px] border border-zinc-200 shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-zinc-900">Radar psicossocial</h2>
              <p className="text-sm text-zinc-500">Fatores dominantes por carteira para orientar a leitura do comite.</p>
            </div>
            <Brain className="text-zinc-400" size={20} />
          </div>

          <div className="space-y-4">
            {riskThemes.map((item) => (
              <div key={item.theme} className="p-4 rounded-3xl bg-zinc-50 border border-zinc-200">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-sm font-black text-zinc-900">{item.theme}</span>
                  <span className="text-xs font-bold text-zinc-500">
                    {item.contracts} contratos - {item.sectors} setores
                  </span>
                </div>
                <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-900"
                    style={{
                      width: `${Math.min(
                        100,
                        totalHighRiskSectors === 0 ? 0 : (item.sectors / totalHighRiskSectors) * 100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
            {riskThemes.length === 0 && <p className="text-sm text-zinc-500">Sem fatores mapeados.</p>}
          </div>
        </div>

        <div className="bg-white rounded-[34px] border border-zinc-200 shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-zinc-900">Governança NR1</h2>
              <p className="text-sm text-zinc-500">Indicadores de operação do ciclo e cobertura da rotina psicossocial.</p>
            </div>
            <BarChart3 className="text-zinc-400" size={20} />
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-blue-50 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-black text-blue-900">Ciclos ativos</span>
                <span className="text-xs font-bold text-blue-700">{cycleCoverage}% da carteira</span>
              </div>
              <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${cycleCoverage}%` }} />
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-black text-emerald-900">Base respondida</span>
                <span className="text-xs font-bold text-emerald-700">{responseCoverage}% do universo mapeado</span>
              </div>
              <div className="h-2 bg-emerald-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600" style={{ width: `${responseCoverage}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-3xl bg-zinc-50 border border-zinc-200">
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400 mb-2">Universo alvo</div>
                <div className="text-2xl font-black text-zinc-900">{totalEmployeeBase}</div>
                <div className="text-xs text-zinc-500 mt-1">colaboradores no prototipo</div>
              </div>
              <div className="p-4 rounded-3xl bg-zinc-50 border border-zinc-200">
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400 mb-2">Respostas</div>
                <div className="text-2xl font-black text-zinc-900">{totalResponses}</div>
                <div className="text-xs text-zinc-500 mt-1">coletas consolidadas</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[34px] border border-zinc-200 shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-zinc-900">Prontidão executiva</h2>
              <p className="text-sm text-zinc-500">Leitura de fechamento e distribuição dos pacotes de relatório.</p>
            </div>
            <Target className="text-zinc-400" size={20} />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-3xl bg-zinc-50 border border-zinc-200 text-center">
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400 mb-2">Rascunho</div>
                <div className="text-2xl font-black text-zinc-900">
                  {records.filter((record) => record.reportStatus === 'draft').length}
                </div>
              </div>
              <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-100 text-center">
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-600 mb-2">Pronto</div>
                <div className="text-2xl font-black text-emerald-900">
                  {records.filter((record) => record.reportStatus === 'ready').length}
                </div>
              </div>
              <div className="p-4 rounded-3xl bg-blue-50 border border-blue-100 text-center">
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-600 mb-2">Compart.</div>
                <div className="text-2xl font-black text-blue-900">{sharedReports}</div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-violet-50 border border-violet-100">
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-600 mb-2">Comitê mensal</div>
              <div className="text-3xl font-black text-violet-900">{executiveReadyContracts}</div>
              <div className="text-sm text-violet-700 mt-1">contratos prontos para apresentação</div>
            </div>

            <div className="p-5 rounded-3xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-black text-zinc-900">Pendências executivas</span>
                <span className="text-zinc-500">{totalPending}</span>
              </div>
              <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500"
                  style={{
                    width: `${Math.min(
                      100,
                      records.length === 0 ? 0 : (totalPending / Math.max(records.length * 8, 1)) * 100,
                    )}%`,
                  }}
                />
              </div>
              <div className="text-xs text-zinc-500 mt-2">
                Soma de atestados pendentes, queixas abertas e ações atrasadas.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_380px] gap-8">
        <div className="bg-white rounded-[34px] border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-zinc-100">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-zinc-900">Mapa dos contratos</h2>
                <p className="text-sm text-zinc-500">
                  Carteira detalhada com maturidade NR1, risco dominante, backlog operacional e prontidão de relatório.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar contrato, owner ou risco..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 w-72"
                  />
                </div>

                <div className="flex items-center gap-2 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl">
                  <Filter size={16} className="text-zinc-400" />
                  <select
                    value={healthFilter}
                    onChange={(event) => setHealthFilter(event.target.value as 'all' | AdminHealth)}
                    className="bg-transparent text-sm font-bold text-zinc-700 focus:outline-none"
                  >
                    <option value="all">Todos</option>
                    <option value="healthy">Saudável</option>
                    <option value="attention">Atenção</option>
                    <option value="critical">Crítico</option>
                    <option value="onboarding">Onboarding</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-zinc-100">
            {filteredRecords.map((record) => (
              <div key={record.id} className="p-8 hover:bg-zinc-50/60 transition-colors">
                <div className="flex flex-col 2xl:flex-row 2xl:items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h3 className="text-xl font-black text-zinc-900">{record.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.18em] border ${healthClasses[record.health]}`}>
                        {healthLabel[record.health]}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.18em] border ${reportClasses[record.reportStatus]}`}>
                        Relatorio {reportLabel[record.reportStatus]}
                      </span>
                      <span className="text-xs font-bold text-zinc-400">
                        Fechamento: {closingLabel[record.closingStatus]}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                      <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400 mb-2">Estrutura</div>
                        <div className="text-lg font-black text-zinc-900">{record.units} unidades</div>
                        <div className="text-xs text-zinc-500">{record.users} usuarios - base {record.employeeBase}</div>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-600 mb-2">Cobertura</div>
                        <div className="text-lg font-black text-blue-900">{record.publishedForms} formularios</div>
                        <div className="text-xs text-blue-700">{record.nr1Cycles} ciclos - {record.nr1Responses} respostas</div>
                      </div>

                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-600 mb-2">Adesao</div>
                        <div className="text-lg font-black text-emerald-900">{record.adherenceRate}%</div>
                        <div className="h-2 bg-emerald-200 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-emerald-600" style={{ width: `${record.adherenceRate}%` }} />
                        </div>
                      </div>

                      <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-rose-600 mb-2">Risco</div>
                        <div className="text-lg font-black text-rose-900">{record.highRiskSectors} setores</div>
                        <div className="text-xs text-rose-700">{record.primaryRisk}</div>
                      </div>

                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-600 mb-2">Plano de acao</div>
                        <div className="text-lg font-black text-amber-900">{record.actionPlansOpen} abertas</div>
                        <div className="text-xs text-amber-700">
                          {record.actionPlansDelayed} atrasadas - {record.pendingAbsenteeism + record.openComplaints} pendencias
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                      <span className="font-bold text-zinc-900">Owner: {record.owner}</span>
                      <span className="text-zinc-500">Ultima atualizacao: {formatDateTime(record.lastUpdate)}</span>
                    </div>

                    {record.notes && <p className="text-sm text-zinc-500 mt-3">{record.notes}</p>}
                  </div>

                  <div className="w-full 2xl:w-[220px] flex 2xl:flex-col gap-3">
                    <button
                      onClick={() => onSelectTenant({ id: record.id, name: record.name })}
                      className="flex-1 px-5 py-3 bg-zinc-900 text-white rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                    >
                      Acessar contrato
                      <ExternalLink size={16} />
                    </button>
                    <button
                      onClick={() => setDraft({ ...record })}
                      className="flex-1 px-5 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Pencil size={16} />
                      Editar carteira
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredRecords.length === 0 && (
              <div className="p-10 text-center text-zinc-500">Nenhum contrato encontrado com os filtros atuais.</div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[34px] border border-zinc-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-zinc-900">Fila do admin</h2>
                <p className="text-sm text-zinc-500">Itens que travam a leitura mensal da carteira.</p>
              </div>
              <AlertTriangle className="text-zinc-400" size={20} />
            </div>

            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-3xl border ${alertClasses[alert.severity]}`}>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] mb-2">{alert.contract}</div>
                  <div className="text-sm font-black mb-1">{alert.title}</div>
                  <div className="text-xs opacity-90">{alert.detail}</div>
                </div>
              ))}
              {alerts.length === 0 && <div className="text-sm text-zinc-500">Sem alertas no momento.</div>}
            </div>
          </div>

          <div className="bg-white rounded-[34px] border border-zinc-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-zinc-900">Atualizações recentes</h2>
                <p className="text-sm text-zinc-500">Leitura rápida para reunião de status.</p>
              </div>
              <Clock3 className="text-zinc-400" size={20} />
            </div>

            <div className="space-y-4">
              {activityFeed.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0">
                    <Activity size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-black text-zinc-900">{item.contract}</div>
                    <div className="text-sm text-zinc-600">{item.title}</div>
                    <div className="text-xs text-zinc-500">{item.detail}</div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 mt-1">
                      {formatDateTime(item.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[34px] border border-zinc-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-zinc-900">Checklist executivo</h2>
                <p className="text-sm text-zinc-500">Pontos mínimos para dizer que o contrato está redondo.</p>
              </div>
              <Users className="text-zinc-400" size={20} />
            </div>

            <div className="space-y-3">
              {[
                `${formsCoverage}% da carteira com formulários publicados`,
                `${cycleCoverage}% da carteira com ciclos em operação`,
                `${readyReports} contratos com relatório pronto`,
                `${executiveReadyContracts} contratos aptos para comitê`,
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <div className="text-sm font-bold text-zinc-900">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {draft && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/50" onClick={() => setDraft(null)} />
          <div className="relative w-full max-w-5xl bg-white rounded-[32px] border border-zinc-200 shadow-2xl p-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-zinc-900">Editar contrato</h2>
                <p className="text-sm text-zinc-500">{draft.name}</p>
              </div>
              <button onClick={() => setDraft(null)} className="text-sm font-bold text-zinc-400 hover:text-zinc-700">
                Fechar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                ['owner', 'Responsavel'],
                ['units', 'Unidades'],
                ['users', 'Usuarios operacionais'],
                ['employeeBase', 'Base elegivel'],
                ['publishedForms', 'Formularios publicados'],
                ['nr1Cycles', 'Ciclos NR1'],
                ['nr1Responses', 'Respostas coletadas'],
                ['adherenceRate', 'Adesao %'],
                ['highRiskSectors', 'Setores criticos'],
                ['pendingAbsenteeism', 'Atestados pendentes'],
                ['openComplaints', 'Queixas abertas'],
                ['actionPlansOpen', 'Acoes abertas'],
                ['actionPlansDelayed', 'Acoes atrasadas'],
                ['primaryRisk', 'Fator psicossocial dominante'],
              ].map(([field, label]) => (
                <label key={field} className="text-sm font-bold text-zinc-700">
                  {label}
                  <input
                    value={String((draft as Record<string, string | number>)[field])}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        [field]:
                          field === 'owner' || field === 'primaryRisk'
                            ? event.target.value
                            : Number(event.target.value),
                      })
                    }
                    className="mt-2 w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                  />
                </label>
              ))}

              <label className="text-sm font-bold text-zinc-700">
                Saude
                <select
                  value={draft.health}
                  onChange={(event) => setDraft({ ...draft, health: event.target.value as AdminHealth })}
                  className="mt-2 w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl font-medium focus:outline-none"
                >
                  <option value="healthy">Saudavel</option>
                  <option value="attention">Atencao</option>
                  <option value="critical">Critico</option>
                  <option value="onboarding">Onboarding</option>
                </select>
              </label>

              <label className="text-sm font-bold text-zinc-700">
                Fechamento
                <select
                  value={draft.closingStatus}
                  onChange={(event) => setDraft({ ...draft, closingStatus: event.target.value as AdminClosingStatus })}
                  className="mt-2 w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl font-medium focus:outline-none"
                >
                  <option value="not_started">Não iniciado</option>
                  <option value="open">Aberto</option>
                  <option value="review">Em revisão</option>
                  <option value="closed">Fechado</option>
                </select>
              </label>

              <label className="text-sm font-bold text-zinc-700">
                Relatorio executivo
                <select
                  value={draft.reportStatus}
                  onChange={(event) => setDraft({ ...draft, reportStatus: event.target.value as AdminReportStatus })}
                  className="mt-2 w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl font-medium focus:outline-none"
                >
                  <option value="draft">Rascunho</option>
                  <option value="ready">Pronto</option>
                  <option value="shared">Compartilhado</option>
                </select>
              </label>
            </div>

            <label className="block text-sm font-bold text-zinc-700 mt-4">
              Observacoes
              <textarea
                value={draft.notes}
                onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
                rows={4}
                className="mt-2 w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10 resize-none"
              />
            </label>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDraft(null)}
                className="px-5 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const next = records.map((record) =>
                    record.id === draft.id ? { ...draft, lastUpdate: new Date().toISOString() } : record,
                  );
                  persistRecords(next);
                  setDraft(null);
                }}
                className="px-5 py-3 bg-zinc-900 text-white rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-colors"
              >
                Salvar no localStorage
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
