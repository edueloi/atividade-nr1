import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Target,
  ArrowRight,
  ChevronRight
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
  PieChart as RePieChart,
  Pie
} from 'recharts';

interface PhysioOverviewProps {
  onNavigate: (tab: any) => void;
}

const casesBySectorData = [
  { sector: 'Montagem', count: 24 },
  { sector: 'Logística', count: 18 },
  { sector: 'Pintura', count: 12 },
  { sector: 'Solda', count: 10 },
  { sector: 'Estamparia', count: 8 },
  { sector: 'Qualidade', count: 6 },
  { sector: 'Almoxarifado', count: 4 },
  { sector: 'Manutenção', count: 3 },
];

const bodyStructureData = [
  { name: 'Lombar', value: 35 },
  { name: 'Ombro', value: 25 },
  { name: 'Cervical', value: 15 },
  { name: 'Pulso/Mão', value: 12 },
  { name: 'Joelho', value: 8 },
  { name: 'Outros', value: 5 },
];

const rehabilitatedTrendData = [
  { month: 'Set', count: 12 },
  { month: 'Out', count: 15 },
  { month: 'Nov', count: 18 },
  { month: 'Dez', count: 14 },
  { month: 'Jan', count: 22 },
  { month: 'Fev', count: 25 },
];

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#71717a'];

export function PhysioOverview({ onNavigate }: PhysioOverviewProps) {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Casos Ativos', value: '42', icon: <Activity className="text-blue-600" />, tab: 'cases', trend: '+3' },
          { label: 'Novos Encaminh.', value: '12', icon: <ClipboardList className="text-zinc-600" />, tab: 'referrals', trend: '+2' },
          { label: 'Sessões (Mês)', value: '156', icon: <Clock className="text-purple-600" />, tab: 'sessions', trend: '+12%' },
          { label: 'Reabilitados ✅', value: '25', icon: <CheckCircle2 className="text-emerald-600" />, tab: 'cases', trend: '+5' },
          { label: 'Tempo Triagem', value: '1.2d', icon: <Target className="text-amber-600" />, tab: 'referrals', trend: '-0.3d' },
          { label: 'Casos em Risco', value: '7', icon: <AlertTriangle className="text-red-600" />, tab: 'cases', trend: '+1' },
        ].map((kpi, i) => (
          <button
            key={i}
            onClick={() => onNavigate(kpi.tab)}
            className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm hover:border-emerald-200 transition-all text-left group"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-zinc-50 rounded-xl group-hover:bg-emerald-50 transition-colors">
                {kpi.icon}
              </div>
              <span className={`text-[10px] font-bold ${kpi.trend.startsWith('+') ? 'text-emerald-600' : 'text-blue-600'}`}>
                {kpi.trend}
              </span>
            </div>
            <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">{kpi.label}</p>
            <h4 className="text-2xl font-black text-zinc-900">{kpi.value}</h4>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cases by Sector */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <BarChart3 size={18} className="text-emerald-600" />
              Casos por Setor (Top 10)
            </h3>
            <button className="text-[10px] font-bold text-emerald-600 hover:underline">Ver todos</button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={casesBySectorData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f4f4f5" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="sector" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#71717a' }}
                  width={80}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '10px' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Body Structures */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <PieChart size={18} className="text-emerald-600" />
              Estruturas Corporais (Top 8)
            </h3>
          </div>
          <div className="h-[300px] w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={bodyStructureData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bodyStructureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
            <div className="space-y-2 pr-8">
              {bodyStructureData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">{item.name}</span>
                  <span className="text-[10px] font-black text-zinc-900 ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rehabilitated Trend */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-600" />
              Evolução de Reabilitados
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rehabilitatedTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#71717a' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#71717a' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '10px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <h3 className="text-sm font-bold text-zinc-900 mb-8 flex items-center gap-2">
            <Target size={18} className="text-emerald-600" />
            Funil de Reabilitação
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Queixas Iniciais', value: 142, color: 'bg-zinc-100', width: '100%' },
              { label: 'Encaminhados Fisio', value: 84, color: 'bg-blue-100', width: '60%' },
              { label: 'Casos Ativos', value: 42, color: 'bg-purple-100', width: '30%' },
              { label: 'Reabilitados', value: 25, color: 'bg-emerald-100', width: '18%' },
              { label: 'Absenteísmo', value: 3, color: 'bg-red-100', width: '2%' },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className={`h-12 ${item.color} rounded-xl flex items-center px-4 transition-all hover:scale-[1.02] cursor-default`} style={{ width: item.width }}>
                  <span className="text-[10px] font-bold text-zinc-900 uppercase">{item.label}</span>
                  <span className="ml-auto text-sm font-black text-zinc-900">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: '7 casos sem sessão há 10 dias', type: 'warning', icon: <Clock size={16} /> },
          { title: 'Setor Montagem com pico de dor lombar', type: 'danger', icon: <AlertTriangle size={16} /> },
          { title: 'Aumento de encaminhamentos: Pintura', type: 'info', icon: <TrendingUp size={16} /> },
        ].map((alert, i) => (
          <div 
            key={i} 
            className={`p-4 rounded-2xl border flex items-center gap-3 shadow-sm ${
              alert.type === 'danger' ? 'bg-red-50 border-red-100 text-red-700' :
              alert.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-700' :
              'bg-blue-50 border-blue-100 text-blue-700'
            }`}
          >
            <div className={`p-2 rounded-xl ${
              alert.type === 'danger' ? 'bg-red-100' :
              alert.type === 'warning' ? 'bg-amber-100' :
              'bg-blue-100'
            }`}>
              {alert.icon}
            </div>
            <span className="text-xs font-bold">{alert.title}</span>
            <ChevronRight size={16} className="ml-auto opacity-50" />
          </div>
        ))}
      </div>
    </div>
  );
}
