import React from 'react';
import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Image as ImageIcon,
  ArrowRight,
  Activity,
  Users,
  HardHat,
  ClipboardList,
  FileText,
  Plus,
  Download
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface ErgoOverviewProps {
  onTabChange: (tab: string) => void;
  onOpenSector: (sectorId: string) => void;
}

const trendData = [
  { month: 'Set', risk: 45 },
  { month: 'Out', risk: 42 },
  { month: 'Nov', risk: 48 },
  { month: 'Dez', risk: 40 },
  { month: 'Jan', risk: 38 },
  { month: 'Fev', risk: 35 },
];

const topSectors = [
  { id: '1', name: 'Montagem Final', risk: 85, status: 'high' },
  { id: '2', name: 'Logística Interna', risk: 72, status: 'high' },
  { id: '3', name: 'Pintura', risk: 68, status: 'medium' },
  { id: '4', name: 'Solda', risk: 65, status: 'medium' },
  { id: '5', name: 'Estamparia', risk: 58, status: 'medium' },
];

export function ErgoOverview({ onTabChange, onOpenSector }: ErgoOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Top Actions */}
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20">
          <Plus size={18} />
          Atualizar Matriz
        </button>
        <button className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-bold text-sm hover:bg-zinc-50 transition-colors flex items-center gap-2 shadow-sm">
          <ClipboardList size={18} className="text-emerald-600" />
          Nova Avaliação
        </button>
        <button className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-bold text-sm hover:bg-zinc-50 transition-colors flex items-center gap-2 shadow-sm">
          <HardHat size={18} className="text-blue-600" />
          Novo Projeto (Eng)
        </button>
        <button className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-bold text-sm hover:bg-zinc-50 transition-colors flex items-center gap-2 shadow-sm ml-auto">
          <Download size={18} />
          Relatório Mensal
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <button 
          onClick={() => onTabChange('matrix')}
          className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:border-red-200 hover:bg-red-50/30 transition-all text-left group"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-red-100 text-red-600 rounded-xl">
              <AlertTriangle size={20} />
            </div>
            <ArrowRight size={16} className="text-zinc-300 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
          </div>
          <div className="text-2xl font-black text-zinc-900">12</div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Risco Alto</div>
        </button>

        <button 
          onClick={() => onTabChange('matrix')}
          className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:border-amber-200 hover:bg-amber-50/30 transition-all text-left group"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
              <TrendingUp size={20} />
            </div>
            <ArrowRight size={16} className="text-zinc-300 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </div>
          <div className="text-2xl font-black text-zinc-900">05</div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Pioraram no mês</div>
        </button>

        <button 
          onClick={() => onTabChange('projects')}
          className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:border-blue-200 hover:bg-blue-50/30 transition-all text-left group"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <Clock size={20} />
            </div>
            <ArrowRight size={16} className="text-zinc-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
          </div>
          <div className="text-2xl font-black text-zinc-900">08</div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Aguardando Validação</div>
        </button>

        <button 
          onClick={() => onTabChange('actions')}
          className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:border-rose-200 hover:bg-rose-50/30 transition-all text-left group"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
              <ClipboardList size={20} />
            </div>
            <ArrowRight size={16} className="text-zinc-300 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
          </div>
          <div className="text-2xl font-black text-zinc-900">14</div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Ações Atrasadas</div>
        </button>

        <button 
          onClick={() => onTabChange('reports')}
          className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:border-emerald-200 hover:bg-emerald-50/30 transition-all text-left group"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
              <ImageIcon size={20} />
            </div>
            <ArrowRight size={16} className="text-zinc-300 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </div>
          <div className="text-2xl font-black text-zinc-900">28</div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Evidências no mês</div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Tendência de Risco Médio</h3>
              <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Últimos 6 meses</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-xs font-bold">
              <TrendingDown size={14} />
              -12%
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#a1a1aa' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#a1a1aa' }}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="risk" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRisk)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Sectors Ranking */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <h3 className="text-sm font-bold text-zinc-900 mb-6">Top 5 Setores Críticos</h3>
          <div className="space-y-4">
            {topSectors.map((sector, i) => (
              <button 
                key={sector.id}
                onClick={() => onOpenSector(sector.id)}
                className="w-full flex items-center gap-4 p-3 hover:bg-zinc-50 rounded-2xl transition-colors group"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-zinc-100 rounded-xl text-xs font-black text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                  0{i + 1}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-xs font-bold text-zinc-900">{sector.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${sector.status === 'high' ? 'bg-red-500' : 'bg-amber-500'}`}
                        style={{ width: `${sector.risk}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-black ${sector.status === 'high' ? 'text-red-600' : 'text-amber-600'}`}>
                      {sector.risk}%
                    </span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
              </button>
            ))}
          </div>
          <button 
            onClick={() => onTabChange('matrix')}
            className="w-full mt-6 py-3 border border-zinc-200 rounded-2xl text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            Ver Matriz Completa
          </button>
        </div>
      </div>
    </div>
  );
}
