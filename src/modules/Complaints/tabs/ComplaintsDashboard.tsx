import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  AlertCircle, 
  Stethoscope, 
  Activity, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  ClipboardList,
  Users,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  ComposedChart,
  Area
} from 'recharts';

interface DashboardStats {
  total: number;
  momentary: number;
  ambulatory: number;
  recurrent: number;
  resolved: number;
}

export function ComplaintsDashboard({ onNavigate }: { onNavigate: (tab: string, filters?: any) => void }) {
  const [stats, setStats] = useState<DashboardStats>({
    total: 226,
    momentary: 84,
    ambulatory: 142,
    recurrent: 12,
    resolved: 156
  });

  const bodyPartData = [
    { name: 'Lombar', value: 45 },
    { name: 'Ombro', value: 38 },
    { name: 'Pescoço', value: 25 },
    { name: 'Punho', value: 22 },
    { name: 'Joelho', value: 18 },
    { name: 'Cervical', value: 15 },
    { name: 'Dorsal', value: 12 },
    { name: 'Tornozelo', value: 8 },
  ];

  const sectorData = [
    { name: 'Montagem Cross', value: 32 },
    { name: 'Logística', value: 28 },
    { name: 'Pintura', value: 22 },
    { name: 'Manutenção', value: 18 },
    { name: 'RH', value: 5 },
  ];

  const weeklyTrend = [
    { name: 'Sem 1', value: 12 },
    { name: 'Sem 2', value: 18 },
    { name: 'Sem 3', value: 15 },
    { name: 'Sem 4', value: 22 },
  ];

  const preventiveFunnel = [
    { name: 'Momentânea', value: 84, fill: '#60a5fa' },
    { name: 'Ambulatorial', value: 42, fill: '#a78bfa' },
    { name: 'Absenteísmo', value: 12, fill: '#f87171' },
  ];

  const kpis = [
    { label: 'Total no Mês', value: stats.total, icon: Activity, color: 'text-zinc-600', bg: 'bg-zinc-100', trend: '+12%', up: true, tab: 'list' },
    { label: 'Momentâneas', value: stats.momentary, icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+5%', up: true, tab: 'list', filter: { type: 'MOMENTARY' } },
    { label: 'Ambulatoriais', value: stats.ambulatory, icon: Stethoscope, color: 'text-purple-600', bg: 'bg-purple-50', trend: '-2%', up: false, tab: 'list', filter: { type: 'AMBULATORY' } },
    { label: 'Recorrentes', value: stats.recurrent, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50', trend: '+1', up: true, tab: 'list', filter: { is_recurrent: true } },
    { label: 'Resolvidas', value: stats.resolved, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '85%', up: true, tab: 'list', filter: { status: 'RESOLVED' } },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, i) => (
          <button 
            key={i}
            onClick={() => onNavigate(kpi.tab, kpi.filter)}
            className="p-4 bg-white border border-zinc-200 rounded-2xl hover:border-emerald-500 transition-all text-left group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color}`}>
                <kpi.icon size={18} />
              </div>
              <div className={`flex items-center gap-0.5 text-[10px] font-bold ${kpi.up ? 'text-emerald-600' : 'text-red-600'}`}>
                {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {kpi.trend}
              </div>
            </div>
            <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">{kpi.label}</p>
            <h4 className="text-2xl font-bold text-zinc-900">{kpi.value}</h4>
          </button>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Body Part Chart */}
        <div className="p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm">
          <h4 className="font-bold text-zinc-900 mb-6">Queixas por Estrutura Corporal (Top 8)</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bodyPartData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#71717a' }}
                  width={80}
                />
                <Tooltip cursor={{ fill: '#f4f4f5' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Chart */}
        <div className="p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm">
          <h4 className="font-bold text-zinc-900 mb-6">Queixas por Setor (Top 10)</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm">
          <h4 className="font-bold text-zinc-900 mb-6">Evolução Semanal</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Preventive Funnel */}
        <div className="p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm">
          <h4 className="font-bold text-zinc-900 mb-6">Funil Preventivo</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={preventiveFunnel} margin={{ top: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
                  {preventiveFunnel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Intelligent Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3">
          <div className="p-2 bg-red-100 text-red-600 rounded-xl h-fit">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h5 className="text-sm font-bold text-red-900">Aumento em Lombar</h5>
            <p className="text-xs text-red-700">Setor Montagem Cross teve alta de 20% em queixas lombares esta semana.</p>
          </div>
        </div>
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
          <div className="p-2 bg-amber-100 text-amber-600 rounded-xl h-fit">
            <TrendingUp size={18} />
          </div>
          <div>
            <h5 className="text-sm font-bold text-amber-900">Alta Recorrência</h5>
            <p className="text-xs text-amber-700">Setor Logística apresenta 15% de queixas recorrentes no mês.</p>
          </div>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-xl h-fit">
            <Users size={18} />
          </div>
          <div>
            <h5 className="text-sm font-bold text-blue-900">Baixa Participação</h5>
            <p className="text-xs text-blue-700">Setor Pintura tem alta de queixas e baixa adesão às aulas laborais.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20">
          <ClipboardList size={20} />
          Criar Plano de Ação Estratégico
        </button>
      </div>
    </div>
  );
}
