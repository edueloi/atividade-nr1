import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  ClipboardList,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
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
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardStats {
  totalResponses: number;
  avgScore: number;
  criticalSectors: number;
  activeAlerts: number;
  openActionPlans: number;
  adhesionRate: number;
}

export function NR1Dashboard({ onNavigate }: { onNavigate: (tab: any) => void }) {
  const [stats, setStats] = useState<DashboardStats>({
    totalResponses: 124,
    avgScore: 42,
    criticalSectors: 3,
    activeAlerts: 5,
    openActionPlans: 8,
    adhesionRate: 85
  });

  const adhesionData = [
    { name: 'Semana 1', value: 65 },
    { name: 'Semana 2', value: 72 },
    { name: 'Semana 3', value: 80 },
    { name: 'Semana 4', value: 85 },
  ];

  const riskBySector = [
    { name: 'Montagem', score: 65 },
    { name: 'Logística', score: 42 },
    { name: 'Pintura', score: 28 },
    { name: 'Manutenção', score: 55 },
    { name: 'RH', score: 15 },
  ];

  const riskDistribution = [
    { name: 'Baixo', value: 60, color: '#10b981' },
    { name: 'Médio', value: 25, color: '#f59e0b' },
    { name: 'Alto', value: 15, color: '#ef4444' },
  ];

  const kpis = [
    { 
      id: 'adhesion',
      label: 'Adesão do Ciclo', 
      value: `${stats.adhesionRate}%`, 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      trend: '+5%',
      trendUp: true,
      onClick: () => onNavigate('cycles')
    },
    { 
      id: 'score',
      label: 'Score de Risco Geral', 
      value: stats.avgScore, 
      icon: Activity, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      trend: '-2%',
      trendUp: false,
      onClick: () => onNavigate('responses')
    },
    { 
      id: 'critical',
      label: 'Setores Críticos', 
      value: stats.criticalSectors, 
      icon: AlertTriangle, 
      color: 'text-red-600', 
      bg: 'bg-red-50',
      trend: 'Estável',
      trendUp: null,
      onClick: () => onNavigate('responses')
    },
    { 
      id: 'plans',
      label: 'Planos de Ação', 
      value: stats.openActionPlans, 
      icon: ClipboardList, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      trend: '+2',
      trendUp: true,
      onClick: () => onNavigate('reports')
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <button
            key={kpi.id}
            onClick={kpi.onClick}
            className="p-6 bg-white border border-zinc-200 rounded-2xl hover:border-emerald-500 transition-all text-left group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color}`}>
                <kpi.icon size={20} />
              </div>
              {kpi.trend && (
                <div className={`flex items-center gap-1 text-[10px] font-bold ${
                  kpi.trendUp === true ? 'text-emerald-600' : 
                  kpi.trendUp === false ? 'text-red-600' : 'text-zinc-400'
                }`}>
                  {kpi.trendUp === true && <ArrowUpRight size={12} />}
                  {kpi.trendUp === false && <ArrowDownRight size={12} />}
                  {kpi.trend}
                </div>
              )}
            </div>
            <p className="text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">{kpi.label}</p>
            <h4 className="text-2xl font-bold text-zinc-900">{kpi.value}</h4>
          </button>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Adhesion Trend */}
        <div className="p-6 bg-white border border-zinc-200 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-zinc-900">Tendência de Adesão</h4>
            <select className="text-xs border-none bg-zinc-100 rounded-lg px-2 py-1 outline-none">
              <option>Últimos 30 dias</option>
              <option>Último ciclo</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={adhesionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#71717a' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#71717a' }}
                  unit="%"
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk by Sector */}
        <div className="p-6 bg-white border border-zinc-200 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-zinc-900">Risco por Setor (Top 5)</h4>
            <button className="text-xs text-emerald-600 font-bold">Ver todos</button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskBySector} layout="vertical">
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
                <Tooltip 
                  cursor={{ fill: '#f4f4f5' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar 
                  dataKey="score" 
                  fill="#10b981" 
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                >
                  {riskBySector.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score > 60 ? '#ef4444' : entry.score > 30 ? '#f59e0b' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="p-6 bg-white border border-zinc-200 rounded-3xl">
          <h4 className="font-bold text-zinc-900 mb-6">Distribuição de Risco</h4>
          <div className="flex items-center">
            <div className="h-[250px] w-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-4">
              {riskDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-zinc-600 font-medium">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-zinc-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparative Analysis */}
        <div className="p-6 bg-white border border-zinc-200 rounded-3xl">
          <h4 className="font-bold text-zinc-900 mb-6">Comparativo Ciclo Anterior</h4>
          <div className="space-y-6">
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-zinc-500">Redução de Risco Crítico</span>
                <span className="text-sm font-bold text-emerald-600">-12%</span>
              </div>
              <div className="w-full bg-zinc-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-zinc-500">Aumento de Participação</span>
                <span className="text-sm font-bold text-emerald-600">+18%</span>
              </div>
              <div className="w-full bg-zinc-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-zinc-500">Planos de Ação Concluídos</span>
                <span className="text-sm font-bold text-emerald-600">85%</span>
              </div>
              <div className="w-full bg-zinc-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
