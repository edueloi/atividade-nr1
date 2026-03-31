import React, { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  ShieldCheck,
  Download,
  BarChart3,
  FileText,
  FileSpreadsheet,
  Eye,
  CalendarDays,
  Lock,
  Activity,
  AlertTriangle,
  HeartPulse,
  Building2,
  Users,
  CheckCircle2,
} from 'lucide-react';
import {
  fetchDashboardStats,
  fetchComplaintsBodyParts,
  fetchAttendanceSummary,
  fetchAbsenteeismSummary,
  fetchAdmissionSummary,
} from '../../services/api.js';
import {
  ClientPortalSnapshot,
  downloadExecutiveReport,
  previewExecutiveReport,
  downloadHealthReport,
  previewHealthReport,
  downloadIndicatorsCsv,
  downloadAbsenteeismCsv,
} from './clientPortalUtils.js';

interface ClientPortalHomeViewProps {
  user: {
    name: string;
  };
  tenant: {
    id: string;
    name: string;
  };
}

const CHART_COLORS = ['#0f766e', '#f59e0b', '#2563eb', '#ef4444', '#8b5cf6'];

const emptySnapshot = (tenantName: string): ClientPortalSnapshot => ({
  tenantName,
  generatedAt: new Date().toLocaleString('pt-BR'),
  dashboard: {
    participation: 0,
    complaints_momentary: 0,
    complaints_ambulatory: 0,
    complaints_recurrent: 0,
    complaints_resolved: 0,
    absenteismo: 0,
    rehabilitated: 0,
  },
  complaints: [],
  attendance: {
    participationByMonth: [],
    rankingBelowGoal: [],
  },
  absenteeism: {
    totalDaysLost: 0,
    totalRecords: 0,
    over15Rate: 0,
    criticalSector: 'Sem destaque',
    topCIDs: [],
    weeklyImpact: [],
    cidDistribution: [],
    sectorRanking: [],
  },
  admission: {
    totalEvaluations: 0,
    recommendedRate: 0,
    restrictedRate: 0,
    notRecommendedRate: 0,
    topCriticalRoles: [],
    resultDistribution: [],
  },
});

export function ClientPortalHomeView({ user, tenant }: ClientPortalHomeViewProps) {
  const [snapshot, setSnapshot] = useState<ClientPortalSnapshot>(() => emptySnapshot(tenant.name));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);

      try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        const [
          dashboard,
          complaints,
          attendance,
          absenteeism,
          admission,
        ] = await Promise.all([
          fetchDashboardStats(tenant.id),
          fetchComplaintsBodyParts(tenant.id),
          fetchAttendanceSummary(tenant.id, currentYear),
          fetchAbsenteeismSummary({ tenantId: tenant.id, month: currentMonth, year: currentYear }),
          fetchAdmissionSummary(tenant.id),
        ]);

        if (!mounted) {
          return;
        }

        setSnapshot({
          tenantName: tenant.name,
          generatedAt: new Date().toLocaleString('pt-BR'),
          dashboard,
          complaints,
          attendance,
          absenteeism,
          admission,
        });
      } catch (error) {
        console.error('Erro ao carregar o portal do cliente:', error);
        if (mounted) {
          setSnapshot(emptySnapshot(tenant.name));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [tenant.id, tenant.name]);

  const totalComplaints = useMemo(
    () => snapshot.dashboard.complaints_momentary + snapshot.dashboard.complaints_ambulatory,
    [snapshot.dashboard.complaints_ambulatory, snapshot.dashboard.complaints_momentary],
  );

  const downloadCards = [
    {
      id: 'executive',
      title: 'Relatório Executivo',
      description: 'PDF consolidado com indicadores do contrato, pronto para diretoria e RH.',
      icon: <FileText size={20} />,
      primaryLabel: 'Baixar PDF',
      secondaryLabel: 'Visualizar',
      onPrimary: () => downloadExecutiveReport(snapshot),
      onSecondary: () => previewExecutiveReport(snapshot),
    },
    {
      id: 'health',
      title: 'Saúde Ocupacional',
      description: 'PDF com foco em absenteísmo, admissional e leitura setorial agregada.',
      icon: <HeartPulse size={20} />,
      primaryLabel: 'Baixar PDF',
      secondaryLabel: 'Visualizar',
      onPrimary: () => downloadHealthReport(snapshot),
      onSecondary: () => previewHealthReport(snapshot),
    },
    {
      id: 'indicators',
      title: 'Indicadores Consolidados',
      description: 'CSV com participação, queixas, absenteísmo e evolução mensal.',
      icon: <FileSpreadsheet size={20} />,
      primaryLabel: 'Baixar CSV',
      secondaryLabel: 'Consultar',
      onPrimary: () => downloadIndicatorsCsv(snapshot),
      onSecondary: () => downloadIndicatorsCsv(snapshot),
    },
    {
      id: 'absenteeism',
      title: 'Base de Absenteísmo',
      description: 'CSV agregado com impacto semanal, ranking setorial e grupos de CID.',
      icon: <BarChart3 size={20} />,
      primaryLabel: 'Baixar CSV',
      secondaryLabel: 'Consultar',
      onPrimary: () => downloadAbsenteeismCsv(snapshot),
      onSecondary: () => downloadAbsenteeismCsv(snapshot),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700">
                <ShieldCheck size={14} />
                Portal do Cliente
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-zinc-900">
                  Visão executiva de {tenant.name}
                </h1>
                <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-zinc-500">
                  {user.name}, este ambiente está bloqueado para edição. Aqui você acompanha somente dados
                  agregados, gráficos consolidados e arquivos oficiais para download.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600">
              <div className="flex items-center gap-2 font-bold text-zinc-900">
                <CalendarDays size={16} />
                Atualizado em {snapshot.generatedAt}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                Todas as exportações mantêm anonimização, sem edição, upload, exclusão ou alteração de cadastros.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-600 p-3 text-white shadow-lg shadow-emerald-200">
              <Lock size={22} />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700">Acesso liberado</p>
              <h2 className="text-xl font-black text-zinc-900">Somente leitura</h2>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-xs font-bold text-zinc-700">
            {[
              'Dashboards estratégicos',
              'Indicadores agregados',
              'PDFs oficiais',
              'Exportação CSV',
              'Evidências homologadas',
              'Consulta por período',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white bg-white/80 px-4 py-3 shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<Users size={20} />}
          title="Participação média"
          value={`${snapshot.dashboard.participation}%`}
          subtitle="Programa mensal"
          tone="emerald"
        />
        <MetricCard
          icon={<AlertTriangle size={20} />}
          title="Queixas monitoradas"
          value={String(totalComplaints)}
          subtitle={`${snapshot.dashboard.complaints_recurrent} recorrentes`}
          tone="amber"
        />
        <MetricCard
          icon={<Activity size={20} />}
          title="Dias perdidos"
          value={String(snapshot.absenteeism.totalDaysLost)}
          subtitle={`${snapshot.absenteeism.totalRecords} registros`}
          tone="rose"
        />
        <MetricCard
          icon={<CheckCircle2 size={20} />}
          title="Avaliações admissionais"
          value={String(snapshot.admission.totalEvaluations)}
          subtitle={`${snapshot.admission.recommendedRate}% recomendadas`}
          tone="blue"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <ChartPanel
          title="Participação por mês"
          subtitle="Evolução consolidada do contrato"
          rightLabel="Indicador agregado"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={snapshot.attendance.participationByMonth}>
              <defs>
                <linearGradient id="clientParticipation" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f766e" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 12 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#0f766e"
                strokeWidth={3}
                fill="url(#clientParticipation)"
                name="Participação (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          title="Distribuição de queixas"
          subtitle="Regiões corporais com maior incidência"
          rightLabel="Sem dados individuais"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={snapshot.complaints}
                dataKey="value"
                nameKey="body_part"
                innerRadius={58}
                outerRadius={92}
                paddingAngle={4}
              >
                {snapshot.complaints.map((item, index) => (
                  <Cell key={item.body_part} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartPanel
          title="Impacto semanal do absenteísmo"
          subtitle={`Setor crítico atual: ${snapshot.absenteeism.criticalSector}`}
          rightLabel="Visão mensal"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={snapshot.absenteeism.weeklyImpact}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="days" name="Dias perdidos" fill="#b91c1c" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <div className="space-y-6">
          <ListPanel
            title="Setores abaixo da meta"
            items={snapshot.attendance.rankingBelowGoal.map((item) => ({
              primary: item.sector,
              secondary: `${item.rate}% de participação`,
            }))}
            emptyMessage="Nenhum setor crítico abaixo da meta."
            icon={<Building2 size={16} />}
          />

          <ListPanel
            title="Funções com maior atenção"
            items={snapshot.admission.topCriticalRoles.map((item) => ({
              primary: item.role,
              secondary: `${item.count} ocorrência(s)`,
            }))}
            emptyMessage="Nenhuma função crítica destacada."
            icon={<HeartPulse size={16} />}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-zinc-900">Central de downloads</h2>
            <p className="text-sm font-medium text-zinc-500">
              Arquivos liberados para consulta do cliente, sem alterar a base operacional.
            </p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          {downloadCards.map((card) => (
            <div key={card.id} className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-zinc-900 p-3 text-white">{card.icon}</div>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  Download
                </span>
              </div>
              <h3 className="mt-5 text-lg font-black text-zinc-900">{card.title}</h3>
              <p className="mt-2 min-h-[66px] text-sm leading-relaxed text-zinc-500">{card.description}</p>
              <div className="mt-5 flex gap-2">
                <button
                  onClick={card.onPrimary}
                  className="flex-1 rounded-2xl bg-zinc-900 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-zinc-800"
                >
                  <span className="inline-flex items-center gap-2">
                    <Download size={14} />
                    {card.primaryLabel}
                  </span>
                </button>
                <button
                  onClick={card.onSecondary}
                  className="rounded-2xl border border-zinc-200 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-600 transition hover:bg-zinc-50"
                >
                  <span className="inline-flex items-center gap-2">
                    <Eye size={14} />
                    {card.secondaryLabel}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  tone: 'emerald' | 'amber' | 'rose' | 'blue';
}

function MetricCard({ icon, title, value, subtitle, tone }: MetricCardProps) {
  const toneClasses = {
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    rose: 'bg-rose-50 text-rose-700',
    blue: 'bg-blue-50 text-blue-700',
  };

  return (
    <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
      <div className={`inline-flex rounded-2xl p-3 ${toneClasses[tone]}`}>{icon}</div>
      <h3 className="mt-5 text-3xl font-black tracking-tight text-zinc-900">{value}</h3>
      <p className="mt-1 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">{title}</p>
      <p className="mt-2 text-sm font-medium text-zinc-500">{subtitle}</p>
    </div>
  );
}

interface ChartPanelProps {
  title: string;
  subtitle: string;
  rightLabel: string;
  children: React.ReactNode;
}

function ChartPanel({ title, subtitle, rightLabel, children }: ChartPanelProps) {
  return (
    <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-zinc-900">{title}</h3>
          <p className="text-sm font-medium text-zinc-500">{subtitle}</p>
        </div>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
          {rightLabel}
        </span>
      </div>
      <div className="h-[320px]">{children}</div>
    </div>
  );
}

interface ListPanelProps {
  title: string;
  icon: React.ReactNode;
  items: Array<{ primary: string; secondary: string }>;
  emptyMessage: string;
}

function ListPanel({ title, icon, items, emptyMessage }: ListPanelProps) {
  return (
    <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3 text-zinc-900">
        <div className="rounded-2xl bg-zinc-100 p-2">{icon}</div>
        <h3 className="text-lg font-black">{title}</h3>
      </div>

      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={`${item.primary}-${item.secondary}`} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
              <p className="text-sm font-bold text-zinc-900">{item.primary}</p>
              <p className="text-xs font-medium text-zinc-500">{item.secondary}</p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-sm text-zinc-500">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
}
