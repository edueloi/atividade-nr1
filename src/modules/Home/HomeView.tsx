import React from 'react';
import {
  Activity,
  Users,
  AlertTriangle,
  Clock,
  Calendar,
  Zap,
  ArrowUpRight,
} from 'lucide-react';
import { StatCard } from '../../components/StatCard.js';
import { ClientPortalHomeView } from '../Client/ClientPortalHomeView.js';

interface HomeViewProps {
  user?: {
    name: string;
    role: string;
  };
  tenant?: {
    id: string;
    name: string;
  } | null;
}

export const HomeView: React.FC<HomeViewProps> = ({ user, tenant }) => {
  if ((user?.role === 'client' || user?.role === 'auditor') && tenant) {
    return <ClientPortalHomeView user={user} tenant={tenant} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Olá, Ricardo</h1>
          <p className="text-zinc-500">Aqui está o resumo das atividades de hoje.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600">
            <Calendar className="h-4 w-4" />
            04 de Março, 2026
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Presença Hoje"
          value="84%"
          trend="+2.4%"
          icon={<Users size={20} />}
          color="emerald"
        />
        <StatCard
          label="Queixas Ativas"
          value="12"
          trend="-1"
          icon={<AlertTriangle size={20} />}
          color="amber"
          negative
        />
        <StatCard
          label="Aulas Realizadas"
          value="8/12"
          trend="0"
          icon={<Activity size={20} />}
          color="blue"
        />
        <StatCard
          label="Pendências"
          value="5"
          trend="+2"
          icon={<Clock size={20} />}
          color="rose"
          negative
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-zinc-900">
              <Zap className="h-5 w-5 text-amber-500" />
              Ações Prioritárias
            </h2>
            <div className="space-y-4">
              {[
                { title: 'Validar Posto de Trabalho - Linha A', type: 'Ergonomia', priority: 'Alta', time: 'Há 2 horas' },
                { title: 'Relatório Mensal Toyota - Fevereiro', type: 'Gestão', priority: 'Média', time: 'Há 5 horas' },
                { title: 'Acompanhamento Fisioterapia - João Silva', type: 'Saúde', priority: 'Baixa', time: 'Ontem' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group flex cursor-pointer items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-4 transition-colors hover:border-emerald-200"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-2 w-2 rounded-full ${item.priority === 'Alta' ? 'bg-rose-500' : item.priority === 'Média' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 transition-colors group-hover:text-emerald-600">{item.title}</h3>
                      <p className="text-xs text-zinc-500">{item.type} • {item.time}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-zinc-300 transition-colors group-hover:text-emerald-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-emerald-600 p-6 text-white shadow-lg shadow-emerald-200">
            <h2 className="mb-4 text-lg font-bold">Lançamento Rápido</h2>
            <p className="mb-6 text-sm text-emerald-100">Registre presenças, queixas ou atendimentos em segundos.</p>
            <button className="w-full rounded-xl bg-white py-3 text-sm font-bold text-emerald-600 transition-colors hover:bg-emerald-50">
              Abrir Lançador
            </button>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-zinc-900">Próximas Campanhas</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-600">
                  MAR
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Março Azul</h3>
                  <p className="text-xs text-zinc-500">Prevenção Câncer Colorretal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
