import React, { useEffect, useMemo, useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  HeartPulse,
  ShieldCheck,
  Download,
  Eye,
  Lock,
  CalendarRange,
  Database,
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

interface ClientReportsViewProps {
  tenant: {
    id: string;
    name: string;
  };
  user: {
    name: string;
  };
}

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

export function ClientReportsView({ tenant, user }: ClientReportsViewProps) {
  const [snapshot, setSnapshot] = useState<ClientPortalSnapshot>(() => emptySnapshot(tenant.name));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);

      try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const [
          dashboard,
          complaints,
          attendance,
          absenteeism,
          admission,
        ] = await Promise.all([
          fetchDashboardStats(tenant.id),
          fetchComplaintsBodyParts(tenant.id),
          fetchAttendanceSummary(tenant.id, year),
          fetchAbsenteeismSummary({ tenantId: tenant.id, month, year }),
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
        console.error('Erro ao carregar os relatórios do cliente:', error);
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

  const documents = useMemo(() => ([
    {
      id: 'executive',
      title: 'Relatório Executivo do Contrato',
      format: 'PDF',
      description: 'Consolida participação, queixas, absenteísmo e status do programa em linguagem gerencial.',
      frequency: 'Atualização sob demanda',
      icon: <FileText size={20} />,
      onPreview: () => previewExecutiveReport(snapshot),
      onDownload: () => downloadExecutiveReport(snapshot),
    },
    {
      id: 'health',
      title: 'Relatório de Saúde Ocupacional',
      format: 'PDF',
      description: 'Destaca impacto setorial, grupos de CID e funções admissionais com maior atenção.',
      frequency: 'Atualização sob demanda',
      icon: <HeartPulse size={20} />,
      onPreview: () => previewHealthReport(snapshot),
      onDownload: () => downloadHealthReport(snapshot),
    },
    {
      id: 'indicators',
      title: 'Planilha de Indicadores',
      format: 'CSV',
      description: 'Base agregada para BI, auditoria interna do cliente e conferência mensal.',
      frequency: 'Atualização sob demanda',
      icon: <FileSpreadsheet size={20} />,
      onPreview: () => downloadIndicatorsCsv(snapshot),
      onDownload: () => downloadIndicatorsCsv(snapshot),
    },
    {
      id: 'absenteeism',
      title: 'Planilha de Absenteísmo',
      format: 'CSV',
      description: 'Extrato consolidado com impacto semanal, ranking por setor e grupos de CID.',
      frequency: 'Atualização sob demanda',
      icon: <Database size={20} />,
      onPreview: () => downloadAbsenteeismCsv(snapshot),
      onDownload: () => downloadAbsenteeismCsv(snapshot),
    },
  ]), [snapshot]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700">
            <ShieldCheck size={14} />
            Biblioteca do Cliente
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-zinc-900">Relatórios e exportações</h1>
          <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed text-zinc-500">
            {user.name}, esta área centraliza somente documentos liberados para consulta do cliente.
            Nenhum relatório aqui altera a operação: os arquivos são montados em leitura, com dados agregados
            e privacidade preservada.
          </p>
        </div>

        <div className="rounded-[32px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-600 p-3 text-white">
              <Lock size={22} />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700">Governança</p>
              <h2 className="text-xl font-black text-zinc-900">Exportação protegida</h2>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm text-zinc-600">
            <InfoRow label="Contrato" value={tenant.name} />
            <InfoRow label="Atualização" value={snapshot.generatedAt} />
            <InfoRow label="Formato liberado" value="PDF e CSV" />
            <InfoRow label="Dados pessoais" value="Ocultos para o cliente" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryBox
          label="Documentos disponíveis"
          value={String(documents.length)}
          support="PDFs e planilhas"
        />
        <SummaryBox
          label="Participação média"
          value={`${snapshot.dashboard.participation}%`}
          support="Indicador agregado"
        />
        <SummaryBox
          label="Dias perdidos"
          value={String(snapshot.absenteeism.totalDaysLost)}
          support="Base de absenteísmo"
        />
        <SummaryBox
          label="Avaliações concluídas"
          value={String(snapshot.admission.totalEvaluations)}
          support="Ciclo admissional"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {documents.map((document) => (
          <div key={document.id} className="rounded-[30px] border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="rounded-2xl bg-zinc-900 p-3 text-white">{document.icon}</div>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                {document.format}
              </span>
            </div>

            <h3 className="mt-5 text-xl font-black text-zinc-900">{document.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">{document.description}</p>

            <div className="mt-5 grid gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-xs text-zinc-600 md:grid-cols-2">
              <InfoRow label="Frequência" value={document.frequency} />
              <InfoRow label="Escopo" value="Somente leitura" />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={document.onDownload}
                className="rounded-2xl bg-zinc-900 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-zinc-800"
              >
                <span className="inline-flex items-center gap-2">
                  <Download size={14} />
                  Baixar
                </span>
              </button>
              <button
                onClick={document.onPreview}
                className="rounded-2xl border border-zinc-200 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-600 transition hover:bg-zinc-50"
              >
                <span className="inline-flex items-center gap-2">
                  <Eye size={14} />
                  Visualizar
                </span>
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-zinc-900">Matriz de consulta liberada</h2>
            <p className="text-sm font-medium text-zinc-500">
              O cliente enxerga somente saídas homologadas, com trilha consolidada e sem ações destrutivas.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700">
            <CheckCircle2 size={14} />
            Perfil bloqueado para edição
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-100 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                <th className="px-4 py-4">Documento</th>
                <th className="px-4 py-4">Fonte</th>
                <th className="px-4 py-4">Privacidade</th>
                <th className="px-4 py-4">Atualização</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm text-zinc-600">
              <tr>
                <td className="px-4 py-4 font-bold text-zinc-900">Relatório Executivo do Contrato</td>
                <td className="px-4 py-4">Dashboard, participação, queixas e absenteísmo</td>
                <td className="px-4 py-4">Dados agregados, sem nomes individuais</td>
                <td className="px-4 py-4">Sob demanda pelo cliente</td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-bold text-zinc-900">Relatório de Saúde Ocupacional</td>
                <td className="px-4 py-4">Absenteísmo, admissional e panorama setorial</td>
                <td className="px-4 py-4">Campos sensíveis ocultos</td>
                <td className="px-4 py-4">Sob demanda pelo cliente</td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-bold text-zinc-900">Planilha de Indicadores</td>
                <td className="px-4 py-4">Histórico mensal e distribuição por região corporal</td>
                <td className="px-4 py-4">Planilha agregada</td>
                <td className="px-4 py-4">Sob demanda pelo cliente</td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-bold text-zinc-900">Planilha de Absenteísmo</td>
                <td className="px-4 py-4">Impacto semanal, CID e ranking setorial</td>
                <td className="px-4 py-4">Sem anexos médicos</td>
                <td className="px-4 py-4">Sob demanda pelo cliente</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

interface SummaryBoxProps {
  label: string;
  value: string;
  support: string;
}

function SummaryBox({ label, value, support }: SummaryBoxProps) {
  return (
    <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{label}</p>
      <h3 className="mt-3 text-3xl font-black tracking-tight text-zinc-900">{value}</h3>
      <p className="mt-2 text-sm font-medium text-zinc-500">{support}</p>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
        <CalendarRange size={12} />
        {label}
      </span>
      <span className="text-right text-sm font-semibold text-zinc-700">{value}</span>
    </div>
  );
}
