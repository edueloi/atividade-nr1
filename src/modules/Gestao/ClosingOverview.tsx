import React from 'react';
import { motion } from 'motion/react';
import { 
  AlertCircle, AlertTriangle, CheckCircle2, 
  FileText, Camera, ChevronRight, Play, 
  Lock, Package, RotateCcw
} from 'lucide-react';
import { ClosingSummary, ClosingStatus } from './types';
import { StatCard } from '../../components/StatCard';

interface ClosingOverviewProps {
  summary: ClosingSummary;
  status: ClosingStatus;
  onStartReview: () => void;
  onCloseMonth: () => void;
  onGeneratePackage: () => void;
  onReopen: () => void;
  onFilterIssues: (severity: string | null, module: string | null) => void;
}

export const ClosingOverview: React.FC<ClosingOverviewProps> = ({
  summary,
  status,
  onStartReview,
  onCloseMonth,
  onGeneratePackage,
  onReopen,
  onFilterIssues
}) => {
  const getStatusBadge = (status: ClosingStatus) => {
    switch (status) {
      case 'OPEN': return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase">Aberto</span>;
      case 'REVIEW': return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-black uppercase">Em Revisão</span>;
      case 'CLOSED': return <span className="px-3 py-1 bg-zinc-800 text-white rounded-full text-xs font-black uppercase">Fechado</span>;
      case 'REOPENED': return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-black uppercase">Reaberto</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-6 bg-white p-8 rounded-[40px] border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Mês de Referência</p>
            <h2 className="text-2xl font-bold text-zinc-900">Março / 2026</h2>
          </div>
          <div className="h-10 w-px bg-zinc-100" />
          <div className="space-y-1">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status Atual</p>
            {getStatusBadge(status)}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {status === 'OPEN' && (
            <button 
              onClick={onStartReview}
              className="px-6 py-3 bg-zinc-900 text-white rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-xl shadow-zinc-200"
            >
              <Play size={18} /> Iniciar Revisão
            </button>
          )}
          {status === 'REVIEW' && (
            <button 
              onClick={onCloseMonth}
              disabled={summary.criticalIssues > 0}
              className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-xl shadow-emerald-100 disabled:opacity-50"
            >
              <Lock size={18} /> Fechar Mês
            </button>
          )}
          {status === 'CLOSED' && (
            <>
              <button 
                onClick={onGeneratePackage}
                className="px-6 py-3 bg-zinc-900 text-white rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-xl shadow-zinc-200"
              >
                <Package size={18} /> Gerar Pacote
              </button>
              <button 
                onClick={onReopen}
                className="px-6 py-3 bg-white border border-zinc-200 text-orange-600 rounded-2xl font-bold text-sm hover:bg-orange-50 transition-all flex items-center gap-2"
              >
                <RotateCcw size={18} /> Reabrir Mês
              </button>
            </>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div 
          onClick={() => onFilterIssues('CRITICAL', null)}
          className="cursor-pointer"
        >
          <StatCard 
            label="Críticas" 
            value={summary?.criticalIssues?.toString() || '0'} 
            trend={summary?.criticalIssues > 0 ? '+ Crítico' : 'OK'}
            icon={<AlertCircle className="text-rose-600" />} 
            color="rose" 
            negative={summary.criticalIssues > 0}
          />
        </div>
        <div 
          onClick={() => onFilterIssues('IMPORTANT', null)}
          className="cursor-pointer"
        >
          <StatCard 
            label="Importantes" 
            value={summary?.importantIssues?.toString() || '0'} 
            trend={summary?.importantIssues > 0 ? 'Pendente' : 'OK'}
            icon={<AlertTriangle className="text-amber-600" />} 
            color="amber" 
            negative={summary.importantIssues > 0}
          />
        </div>
          <StatCard 
            label="Módulos OK" 
            value={summary?.modulesOk?.toString() || '0'} 
            trend="Ativo"
            icon={<CheckCircle2 className="text-emerald-600" />} 
            color="emerald" 
          />
          <StatCard 
            label="Relatórios" 
            value={summary?.reportsGenerated?.toString() || '0'} 
            trend="Gerado"
            icon={<FileText className="text-blue-600" />} 
            color="blue" 
          />
          <StatCard 
            label="Evidências" 
            value={summary?.evidencesCount?.toString() || '0'} 
            trend="Anexado"
            icon={<Camera className="text-zinc-600" />} 
            color="zinc" 
          />
      </div>

      {/* Progress by Module */}
      <div className="bg-white p-10 rounded-[48px] border border-zinc-200 shadow-sm">
        <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-8">Progresso por Módulo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {summary?.progressByModule?.map((mod, i) => (
            <motion.div 
              key={mod.module}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onFilterIssues(null, mod.module)}
              className="group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">{mod.module}</span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${
                  mod.status === 'OK' ? 'bg-emerald-100 text-emerald-700' : 
                  mod.status === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {mod.status === 'OK' ? 'OK' : mod.status === 'CRITICAL' ? 'Crítico' : 'Pendente'}
                </span>
              </div>
              <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(mod.done / mod.total) * 100}%` }}
                  className={`h-full rounded-full ${
                    mod.status === 'OK' ? 'bg-emerald-500' : 
                    mod.status === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-500'
                  }`}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{mod.done} / {mod.total} Itens</span>
                <ChevronRight size={14} className="text-zinc-300 group-hover:text-emerald-600 transition-all group-hover:translate-x-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
