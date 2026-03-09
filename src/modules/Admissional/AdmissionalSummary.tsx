import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, AlertTriangle, XCircle, ClipboardList,
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { StatCard } from '../../components/StatCard';
import { AdmissionSummary } from './types';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1'];

interface AdmissionalSummaryProps {
  summary: AdmissionSummary;
  onFilterEvaluations: (filter: any) => void;
}

export const AdmissionalSummary: React.FC<AdmissionalSummaryProps> = ({ summary, onFilterEvaluations }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => onFilterEvaluations({})} className="cursor-pointer">
          <StatCard label="Total Avaliações" value={summary.totalEvaluations} trend="+12" icon={<ClipboardList className="text-blue-600" />} color="blue" />
        </div>
        <div onClick={() => onFilterEvaluations({ result: 'RECOMMENDED' })} className="cursor-pointer">
          <StatCard label="% Recomendados" value={`${summary.recommendedRate}%`} trend="+2%" icon={<CheckCircle2 className="text-emerald-600" />} color="emerald" />
        </div>
        <div onClick={() => onFilterEvaluations({ result: 'RESTRICTED' })} className="cursor-pointer">
          <StatCard label="% Com Restrição" value={`${summary.restrictedRate}%`} trend="-1%" icon={<AlertTriangle className="text-amber-600" />} color="amber" />
        </div>
        <div onClick={() => onFilterEvaluations({ result: 'NOT_RECOMMENDED' })} className="cursor-pointer">
          <StatCard label="% Não Recomendados" value={`${summary.notRecommendedRate}%`} trend="-1%" icon={<XCircle className="text-rose-600" />} color="rose" negative />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Result Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6">Aptidão Geral</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary.resultDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  onClick={(data) => {
                    const result = data.name === 'Recomendados' ? 'RECOMMENDED' : 
                                 data.name === 'Restrição' ? 'RESTRICTED' : 'NOT_RECOMMENDED';
                    onFilterEvaluations({ result });
                  }}
                >
                  {summary.resultDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="cursor-pointer" />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6">Tendência de Não Recomendados (%)</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={summary.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa' }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#ef4444' }} 
                  className="cursor-pointer"
                  onClick={(data) => onFilterEvaluations({ month: data.month })}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Frequent Reasons */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6">Motivos de Restrição/Veto</h3>
          <div className="space-y-4">
            {summary.frequentReasons.map((item: any, i: number) => (
              <div 
                key={i} 
                onClick={() => onFilterEvaluations({ reason: item.reason })}
                className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <span className="text-sm font-bold text-zinc-900">{item.reason}</span>
                <span className="px-3 py-1 bg-white rounded-lg text-xs font-bold text-zinc-600 shadow-sm">{item.count} casos</span>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Roles */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6">Funções Críticas (Vetos)</h3>
          <div className="space-y-4">
            {summary.topCriticalRoles.map((item: any, i: number) => (
              <div 
                key={i} 
                onClick={() => onFilterEvaluations({ role: item.role })}
                className="flex items-center justify-between p-4 bg-rose-50 rounded-2xl border border-rose-100 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <span className="text-sm font-bold text-rose-900">{item.role}</span>
                <span className="px-3 py-1 bg-white rounded-lg text-xs font-bold text-rose-600 shadow-sm">{item.count} vetos</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
