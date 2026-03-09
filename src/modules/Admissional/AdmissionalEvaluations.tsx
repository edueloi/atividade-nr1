import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, Download, Plus, Eye, Trash2, 
  MoreVertical, FileText, ClipboardList, Copy, CheckCircle2,
  X, Calendar, MapPin, User, ChevronRight, Paperclip
} from 'lucide-react';
import { AdmissionEvaluation, EvaluationResult, EvaluationStatus } from './types';

interface AdmissionalEvaluationsProps {
  evaluations: AdmissionEvaluation[];
  onNewEvaluation: () => void;
  onViewDetail: (evaluation: AdmissionEvaluation) => void;
  onDelete: (id: string) => void;
  onDuplicate: (evaluation: AdmissionEvaluation) => void;
  onComplete: (id: string) => void;
  initialFilter?: any;
}

export const AdmissionalEvaluations: React.FC<AdmissionalEvaluationsProps> = ({ 
  evaluations, 
  onNewEvaluation, 
  onViewDetail,
  onDelete,
  onDuplicate,
  onComplete,
  initialFilter 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<any>(initialFilter || {});

  const filteredEvaluations = useMemo(() => {
    return evaluations.filter(ev => {
      const matchesSearch = 
        ev.role_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.sector_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesResult = !activeFilters.result || ev.result === activeFilters.result;
      const matchesRole = !activeFilters.role || ev.role_name === activeFilters.role;
      const matchesReason = !activeFilters.reason || ev.reasons.includes(activeFilters.reason);
      
      return matchesSearch && matchesResult && matchesRole && matchesReason;
    });
  }, [evaluations, searchTerm, activeFilters]);

  const getResultBadge = (result: EvaluationResult) => {
    switch (result) {
      case 'RECOMMENDED':
        return <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase border border-emerald-100">Recomendado</span>;
      case 'RESTRICTED':
        return <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-bold uppercase border border-amber-100">Restrição</span>;
      case 'NOT_RECOMMENDED':
        return <span className="px-2 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-bold uppercase border border-rose-100">Não Recomendado</span>;
    }
  };

  const getStatusBadge = (status: EvaluationStatus) => {
    switch (status) {
      case 'DRAFT':
        return <span className="px-2 py-1 bg-zinc-100 text-zinc-500 rounded-lg text-[10px] font-bold uppercase">Rascunho</span>;
      case 'COMPLETED':
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold uppercase">Concluída</span>;
      case 'REVISION':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-bold uppercase">Revisão</span>;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Filters & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Buscar por função, setor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" 
            />
          </div>
          <button className="p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-400 hover:text-zinc-900 transition-colors relative">
            <Filter className="w-5 h-5" />
            {Object.keys(activeFilters).length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {Object.keys(activeFilters).length}
              </span>
            )}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-zinc-600 flex items-center gap-2 hover:bg-zinc-50">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button 
            onClick={onNewEvaluation}
            className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Avaliação
          </button>
        </div>
      </div>

      {/* Active Filters Chips */}
      {Object.keys(activeFilters).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => (
            <div key={key} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-2 border border-emerald-100">
              <span className="opacity-60 uppercase text-[10px]">{key}:</span> {value as string}
              <button onClick={() => {
                const newFilters = { ...activeFilters };
                delete newFilters[key];
                setActiveFilters(newFilters);
              }}>
                <X size={14} />
              </button>
            </div>
          ))}
          <button 
            onClick={() => setActiveFilters({})}
            className="text-xs font-bold text-zinc-400 hover:text-zinc-600 ml-2"
          >
            Limpar tudo
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Data</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Função</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Unidade / Setor</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Resultado</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Motivo Principal</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredEvaluations.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-zinc-50/50 transition-colors group cursor-pointer"
                  onClick={() => onViewDetail(item)}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-zinc-900">{new Date(item.evaluation_date).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-zinc-900">{item.role_name}</div>
                    <div className="text-[10px] text-zinc-400 font-bold uppercase">v{item.template_version}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-zinc-500">{item.sector_name}</div>
                    <div className="text-[10px] text-zinc-400 uppercase font-bold">{item.unit_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getResultBadge(item.result)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-zinc-500 truncate max-w-[150px]">{item.reasons?.[0] || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onViewDetail(item)}
                        className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="relative group/menu">
                        <button className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-zinc-100 py-2 z-10 hidden group-hover/menu:block">
                          <button onClick={() => onViewDetail(item)} className="w-full px-4 py-2 text-left text-xs font-bold text-zinc-600 hover:bg-zinc-50 flex items-center gap-2">
                            <Eye size={14} /> Ver Detalhes
                          </button>
                          <button onClick={() => onDuplicate(item)} className="w-full px-4 py-2 text-left text-xs font-bold text-zinc-600 hover:bg-zinc-50 flex items-center gap-2">
                            <Copy size={14} /> Duplicar
                          </button>
                          {item.status === 'DRAFT' && (
                            <button onClick={() => onComplete(item.id)} className="w-full px-4 py-2 text-left text-xs font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2">
                              <CheckCircle2 size={14} /> Concluir
                            </button>
                          )}
                          <button className="w-full px-4 py-2 text-left text-xs font-bold text-zinc-600 hover:bg-zinc-50 flex items-center gap-2">
                            <FileText size={14} /> Exportar PDF
                          </button>
                          {(item.result === 'RESTRICTED' || item.result === 'NOT_RECOMMENDED') && (
                            <button className="w-full px-4 py-2 text-left text-xs font-bold text-amber-600 hover:bg-amber-50 flex items-center gap-2">
                              <ClipboardList size={14} /> Criar Plano de Ação
                            </button>
                          )}
                          {item.status === 'DRAFT' && (
                            <button 
                              onClick={() => onDelete(item.id)}
                              className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-zinc-50 mt-1 pt-2"
                            >
                              <Trash2 size={14} /> Excluir
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
