import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, AlertCircle, AlertTriangle, Info, 
  CheckCircle2, MoreVertical, ExternalLink, Eye, 
  CheckSquare, MessageSquare, User, ArrowRight,
  ChevronRight, X
} from 'lucide-react';
import { ClosingIssue, IssueSeverity, IssueStatus } from './types';

interface ClosingIssuesProps {
  issues: ClosingIssue[];
  onResolve: (id: string) => void;
  onNavigate: (issue: ClosingIssue) => void;
  initialFilter?: { severity: string | null; module: string | null };
}

export const ClosingIssues: React.FC<ClosingIssuesProps> = ({
  issues,
  onResolve,
  onNavigate,
  initialFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<IssueSeverity | 'ALL'>((initialFilter?.severity as any) || 'ALL');
  const [moduleFilter, setModuleFilter] = useState<string | 'ALL'>(initialFilter?.module || 'ALL');
  const [selectedIssue, setSelectedIssue] = useState<ClosingIssue | null>(null);

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         issue.module.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || issue.severity === severityFilter;
    const matchesModule = moduleFilter === 'ALL' || issue.module === moduleFilter;
    return matchesSearch && matchesSeverity && matchesModule;
  });

  const getSeverityIcon = (severity: IssueSeverity) => {
    switch (severity) {
      case 'CRITICAL': return <AlertCircle className="text-rose-600" size={18} />;
      case 'IMPORTANT': return <AlertTriangle className="text-amber-600" size={18} />;
      case 'INFO': return <Info className="text-zinc-400" size={18} />;
    }
  };

  const getSeverityLabel = (severity: IssueSeverity) => {
    switch (severity) {
      case 'CRITICAL': return <span className="text-rose-600 font-black uppercase text-[10px] tracking-widest">Crítica</span>;
      case 'IMPORTANT': return <span className="text-amber-600 font-black uppercase text-[10px] tracking-widest">Importante</span>;
      case 'INFO': return <span className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">Informativa</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Buscar pendência ou módulo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>
          <select 
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="px-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-600 focus:outline-none"
          >
            <option value="ALL">Todas Severidades</option>
            <option value="CRITICAL">Críticas</option>
            <option value="IMPORTANT">Importantes</option>
            <option value="INFO">Informativas</option>
          </select>
          <select 
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-600 focus:outline-none"
          >
            <option value="ALL">Todos Módulos</option>
            {Array.from(new Set(issues.map(i => i.module))).map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[40px] border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Severidade</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Módulo</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Pendência</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredIssues.map((issue) => (
                <tr 
                  key={issue.id} 
                  className="hover:bg-zinc-50/50 transition-colors group cursor-pointer"
                  onClick={() => setSelectedIssue(issue)}
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      {getSeverityIcon(issue.severity)}
                      {getSeverityLabel(issue.severity)}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-black text-zinc-900 uppercase tracking-tighter">{issue.module}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-zinc-900">{issue.message}</p>
                      <p className="text-xs text-zinc-400 italic">Sugestão: {issue.suggestion}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      issue.status === 'OPEN' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {issue.status === 'OPEN' ? 'Aberta' : 'Resolvida'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onNavigate(issue); }}
                        className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                        title="Ir para o item"
                      >
                        <ExternalLink size={18} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onResolve(issue.id); }}
                        className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                        title="Resolver agora"
                      >
                        <CheckSquare size={18} />
                      </button>
                      <button className="p-2 text-zinc-400 hover:text-zinc-900 rounded-xl transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredIssues.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-zinc-400">
                      <CheckCircle2 size={48} className="opacity-20" />
                      <p className="text-sm font-bold">Nenhuma pendência encontrada.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Detail Drawer */}
      <AnimatePresence>
        {selectedIssue && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIssue(null)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    selectedIssue.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-600' : 
                    selectedIssue.severity === 'IMPORTANT' ? 'bg-amber-100 text-amber-600' : 'bg-zinc-100 text-zinc-400'
                  }`}>
                    {getSeverityIcon(selectedIssue.severity)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900">Detalhe da Pendência</h3>
                    <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mt-1">{selectedIssue.module}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedIssue(null)} className="p-3 hover:bg-zinc-200 rounded-2xl transition-colors text-zinc-400">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Mensagem</p>
                  <div className="p-6 bg-zinc-50 rounded-[32px] border border-zinc-100 text-sm font-bold text-zinc-900 leading-relaxed">
                    {selectedIssue.message}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ação Recomendada</p>
                  <div className="p-6 bg-emerald-50 rounded-[32px] border border-emerald-100 text-sm font-bold text-emerald-900 leading-relaxed flex items-start gap-3">
                    <ArrowRight size={18} className="mt-0.5 shrink-0" />
                    {selectedIssue.suggestion}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Contexto do Registro</p>
                  <div className="p-6 bg-zinc-50 rounded-[32px] border border-zinc-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-500">Tipo de Referência</span>
                      <span className="text-xs font-black text-zinc-900 uppercase tracking-widest">{selectedIssue.ref_type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-500">ID do Registro</span>
                      <span className="text-xs font-black text-zinc-900 uppercase tracking-widest">{selectedIssue.ref_id}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Comentários / Histórico</p>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400"><User size={16} /></div>
                      <div className="flex-1 p-4 bg-zinc-50 rounded-2xl text-xs text-zinc-600">
                        Aguardando upload do anexo pelo gestor do setor.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex items-center gap-4">
                <button 
                  onClick={() => onNavigate(selectedIssue)}
                  className="flex-1 py-4 bg-white border border-zinc-200 text-zinc-900 rounded-2xl font-bold text-sm hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <ExternalLink size={18} /> Ir para registro
                </button>
                <button 
                  onClick={() => { onResolve(selectedIssue.id); setSelectedIssue(null); }}
                  className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-100"
                >
                  <CheckSquare size={18} /> Resolver Agora
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
