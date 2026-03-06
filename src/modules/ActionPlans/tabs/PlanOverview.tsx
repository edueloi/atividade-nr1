import React from 'react';
import { motion } from 'motion/react';
import { 
  ClipboardList, 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Target, 
  Activity,
  ChevronRight,
  Info,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  AreaChart, 
  Area 
} from 'recharts';

interface PlanOverviewProps {
  onNavigateToActions: (filter?: string) => void;
}

const statusData = [
  { name: 'Pendente', value: 45, color: '#94a3b8' },
  { name: 'Em andamento', value: 30, color: '#3b82f6' },
  { name: 'Aguardando evidência', value: 15, color: '#f59e0b' },
  { name: 'Concluída', value: 60, color: '#10b981' },
  { name: 'Atrasada', value: 12, color: '#ef4444' },
];

const sectorDelayData = [
  { sector: 'Montagem', count: 8 },
  { sector: 'Logística', count: 12 },
  { sector: 'Pintura', count: 5 },
  { sector: 'Solda', count: 15 },
  { sector: 'Estamparia', count: 3 },
  { sector: 'Qualidade', count: 7 },
];

const weeklyCompletionData = [
  { week: 'Semana 1', count: 12 },
  { week: 'Semana 2', count: 18 },
  { week: 'Semana 3', count: 15 },
  { week: 'Semana 4', count: 25 },
  { week: 'Semana 5', count: 22 },
];

export function PlanOverview({ onNavigateToActions }: PlanOverviewProps) {
  const kpis = [
    { id: 'open_plans', label: 'Planos Abertos', value: '24', icon: <ClipboardList size={20} />, color: 'text-blue-600', bg: 'bg-blue-50', filter: 'aberto' },
    { id: 'pending_actions', label: 'Ações Pendentes', value: '156', icon: <CheckSquare size={20} />, color: 'text-zinc-600', bg: 'bg-zinc-50', filter: 'pendente' },
    { id: 'delayed_actions', label: 'Ações Atrasadas', value: '12', icon: <Clock size={20} />, color: 'text-red-600', bg: 'bg-red-50', filter: 'atrasada' },
    { id: 'awaiting_evidence', label: 'Aguardando Evidência', value: '15', icon: <AlertTriangle size={20} />, color: 'text-amber-600', bg: 'bg-amber-50', filter: 'aguardando' },
    { id: 'completed_month', label: 'Concluídas no Mês', value: '84', icon: <CheckCircle2 size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50', filter: 'concluida' },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {kpis.map((kpi) => (
          <motion.button
            key={kpi.id}
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={() => onNavigateToActions(kpi.filter)}
            className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm text-left group transition-all hover:border-zinc-900"
          >
            <div className={`w-12 h-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {kpi.icon}
            </div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">{kpi.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-black text-zinc-900">{kpi.value}</h3>
              <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Completion Line Chart */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-600" />
                Conclusões por Semana
              </h3>
              <p className="text-xs text-zinc-500">Evolução da produtividade do time</p>
            </div>
            <select className="text-xs font-bold text-zinc-600 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 focus:outline-none">
              <option>Últimos 30 dias</option>
              <option>Últimos 90 dias</option>
            </select>
          </div>
          <div className="h-[300px] w-full min-h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%" debounce={100}>
              <AreaChart data={weeklyCompletionData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="week" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 800, color: '#18181b', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Donut Chart */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
            <PieChartIcon size={20} className="text-blue-600" />
            Ações por Status
          </h3>
          <div className="h-[250px] w-full relative min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%" debounce={100}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-zinc-900">162</span>
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Total</span>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {statusData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-zinc-600">{item.name}</span>
                </div>
                <span className="font-bold text-zinc-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sector Delays Bar Chart */}
        <div className="lg:col-span-12 bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-600" />
                Atrasos por Setor
              </h3>
              <p className="text-xs text-zinc-500">Setores que demandam atenção imediata</p>
            </div>
            <button className="text-xs font-bold text-zinc-900 hover:underline flex items-center gap-1">
              Ver todos os setores <ArrowRight size={14} />
            </button>
          </div>
          <div className="h-[300px] w-full min-h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%" debounce={100}>
              <BarChart data={sectorDelayData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="sector" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#18181b', fontWeight: 700 }}
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#ef4444" 
                  radius={[0, 8, 8, 0]} 
                  barSize={24}
                  onClick={(data) => onNavigateToActions(data.sector)}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-start gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
            <AlertCircle size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-red-900 mb-1">Ações Críticas Atrasadas</h4>
            <p className="text-xs text-red-700 leading-relaxed mb-3">Existem 5 ações de alta prioridade com mais de 7 dias de atraso no setor de Solda.</p>
            <button className="text-xs font-black text-red-900 hover:underline flex items-center gap-1">
              Resolver agora <ArrowRight size={14} />
            </button>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-start gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
            <Info size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900 mb-1">Aguardando Validação</h4>
            <p className="text-xs text-amber-700 leading-relaxed mb-3">12 ações foram marcadas como concluídas e aguardam upload de evidência para fechamento.</p>
            <button className="text-xs font-black text-amber-900 hover:underline flex items-center gap-1">
              Verificar itens <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
