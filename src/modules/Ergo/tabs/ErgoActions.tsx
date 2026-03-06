import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  User, 
  Calendar, 
  Image as ImageIcon,
  Plus,
  MessageSquare,
  ExternalLink,
  Users,
  ArrowUpRight,
  Trash2,
  X,
  ClipboardList
} from 'lucide-react';

interface ErgoAction {
  id: string;
  action: string;
  sector: string;
  priority: 'low' | 'medium' | 'high';
  responsible: string;
  deadline: string;
  status: 'aberto' | 'em andamento' | 'concluído' | 'atrasado';
  hasEvidence: boolean;
}

const mockActions: ErgoAction[] = [
  { id: '1', action: 'Instalar suporte regulável para monitor', sector: 'Montagem Final', priority: 'medium', responsible: 'Ricardo Silva', deadline: '15/03/2026', status: 'em andamento', hasEvidence: true },
  { id: '2', action: 'Substituir cadeira atual por modelo ergonômico', sector: 'Logística', priority: 'high', responsible: 'Ana Paula', deadline: '01/03/2026', status: 'atrasado', hasEvidence: false },
  { id: '3', action: 'Implementar rodízio de tarefas', sector: 'Pintura', priority: 'medium', responsible: 'Carlos Eduardo', deadline: '20/03/2026', status: 'aberto', hasEvidence: false },
  { id: '4', action: 'Ajuste de iluminação no posto 04', sector: 'Solda', priority: 'low', responsible: 'Ricardo Silva', deadline: '05/03/2026', status: 'concluído', hasEvidence: true },
];

interface ErgoActionsProps {
  onOpenSector: (sectorId: string) => void;
}

export function ErgoActions({ onOpenSector }: ErgoActionsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const getPriorityColor = (priority: ErgoAction['priority']) => {
    switch (priority) {
      case 'low': return 'text-emerald-600 bg-emerald-50';
      case 'medium': return 'text-blue-600 bg-blue-50';
      case 'high': return 'text-red-600 bg-red-50';
    }
  };

  const getStatusColor = (status: ErgoAction['status']) => {
    switch (status) {
      case 'aberto': return 'bg-zinc-100 text-zinc-600';
      case 'em andamento': return 'bg-blue-100 text-blue-600';
      case 'concluído': return 'bg-emerald-100 text-emerald-600';
      case 'atrasado': return 'bg-red-100 text-red-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar ação ou setor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-xl transition-colors border border-zinc-200">
            <Filter size={20} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl flex items-center gap-2">
            <ClipboardList size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Origem: Ergonomia/Eng</span>
          </div>
        </div>
      </div>

      {/* Actions Table */}
      <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-200">
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Ação</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Setor</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Prioridade</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Responsável</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Prazo</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {mockActions.map((action) => (
                <tr key={action.id} className="group hover:bg-zinc-50/80 transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${action.status === 'atrasado' ? 'bg-red-500 animate-pulse' : action.status === 'concluído' ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                      <span className="text-sm font-bold text-zinc-900">{action.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onOpenSector('1'); }}
                      className="text-xs text-zinc-600 font-bold hover:text-emerald-600 transition-colors"
                    >
                      {action.sector}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${getPriorityColor(action.priority)}`}>
                      {action.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400">
                        <User size={12} />
                      </div>
                      <span className="text-xs text-zinc-600">{action.responsible}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 text-xs font-bold ${action.status === 'atrasado' ? 'text-red-600' : 'text-zinc-500'}`}>
                      <Calendar size={14} className="text-zinc-400" />
                      {action.deadline}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(action.status)}`}>
                        {action.status}
                      </span>
                      {action.hasEvidence && <ImageIcon size={14} className="text-emerald-500" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowActionMenu(showActionMenu === action.id ? null : action.id);
                          }}
                          className="p-2 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-400"
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        <AnimatePresence>
                          {showActionMenu === action.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(null)} />
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-zinc-100 z-20 overflow-hidden py-2"
                              >
                                <button className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3">
                                  <ExternalLink size={16} className="text-zinc-400" /> Ver Detalhes
                                </button>
                                <button className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3">
                                  <ArrowUpRight size={16} className="text-blue-500" /> Marcar em Andamento
                                </button>
                                <button className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3">
                                  <CheckCircle2 size={16} className="text-emerald-500" /> Concluir Ação
                                </button>
                                <button className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3">
                                  <ImageIcon size={16} className="text-zinc-400" /> Adicionar Evidência
                                </button>
                                <div className="h-px bg-zinc-100 my-1" />
                                <button className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3">
                                  <Users size={16} className="text-zinc-400" /> Reatribuir Responsável
                                </button>
                                <button className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3">
                                  <Calendar size={16} className="text-zinc-400" /> Alterar Prazo
                                </button>
                                <div className="h-px bg-zinc-100 my-1" />
                                <button className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-3">
                                  <Trash2 size={16} /> Excluir
                                </button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                      <ChevronRight size={18} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
