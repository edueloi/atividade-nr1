import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronRight, 
  Plus, 
  Calendar, 
  Activity, 
  Target, 
  X, 
  Clock, 
  User, 
  ArrowRight, 
  MessageSquare, 
  Paperclip, 
  History, 
  CheckCircle2, 
  AlertTriangle, 
  UserPlus, 
  FileDown, 
  Trash2,
  Info,
  ExternalLink,
  PlusCircle,
  Edit3,
  CheckSquare,
  AlertCircle,
  PlayCircle,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { DataTable } from '../../../components/DataTable';
import { useGrid } from '../../../hooks/useGrid';
import { IGridColumn } from '../../../types/grid';
import { ActionItem, ActionStatus, Priority } from '../types';

interface ActionListProps {
  actions: ActionItem[];
  setActions: React.Dispatch<React.SetStateAction<ActionItem[]>>;
  initialFilter?: string;
}

export function ActionList({ actions, setActions, initialFilter }: ActionListProps) {
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showConcludeModal, setShowConcludeModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);

  const initialColumns: IGridColumn[] = [
    { id: 'title', name: 'Ação', field: 'title', order: 1, isSortable: true, isFilterable: true, filter: initialFilter, render: (row: ActionItem) => (
      <div className="flex flex-col max-w-xs">
        <span className="text-sm font-bold text-zinc-900 truncate">{row.title}</span>
        <span className="text-[10px] text-zinc-500 font-medium truncate">{row.planName}</span>
      </div>
    )},
    { id: 'sector', name: 'Setor / Unidade', field: 'sector', order: 2, isSortable: true, isFilterable: true, render: (row: ActionItem) => (
      <div className="flex flex-col">
        <span className="text-sm font-bold text-zinc-900">{row.sector}</span>
        <span className="text-[10px] text-zinc-500 font-medium">{row.unit}</span>
      </div>
    )},
    { id: 'responsible', name: 'Responsável', field: 'responsible', order: 3, isSortable: true, isFilterable: true },
    { id: 'dueDate', name: 'Prazo', field: 'dueDate', order: 4, isSortable: true, isFilterable: true },
    { id: 'status', name: 'Status', field: 'status', order: 5, isSortable: true, isFilterable: true, render: (row: ActionItem) => {
      const colors: Record<ActionStatus, string> = {
        'Pendente': 'bg-zinc-100 text-zinc-600 border-zinc-200',
        'Em andamento': 'bg-blue-50 text-blue-600 border-blue-100',
        'Aguardando evidência': 'bg-amber-50 text-amber-600 border-amber-100',
        'Concluída': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Atrasada': 'bg-red-50 text-red-600 border-red-100',
        'Cancelada': 'bg-zinc-100 text-zinc-400 border-zinc-200',
      };
      return (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${colors[row.status]}`}>
          {row.status}
        </span>
      );
    }},
    { id: 'priority', name: 'Prioridade', field: 'priority', order: 6, isSortable: true, isFilterable: true, render: (row: ActionItem) => {
      const colors: Record<Priority, string> = {
        'Alta': 'bg-red-50 text-red-600 border-red-100',
        'Média': 'bg-amber-50 text-amber-600 border-amber-100',
        'Baixa': 'bg-zinc-100 text-zinc-600 border-zinc-200',
      };
      return (
        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase border ${colors[row.priority]}`}>
          {row.priority}
        </span>
      );
    }},
    { id: 'evidence', name: 'Evidência', field: 'hasEvidence', order: 7, render: (row: ActionItem) => (
      <div className="flex items-center justify-center">
        {row.hasEvidence ? (
          <Paperclip size={16} className="text-emerald-600" />
        ) : row.evidenceRequired ? (
          <AlertTriangle size={16} className="text-amber-400" />
        ) : (
          <span className="text-zinc-300">—</span>
        )}
      </div>
    )},
  ];

  const { visibleColumns, toggleSort, updateFilter, columns } = useGrid(initialColumns);

  const filteredData = useMemo(() => {
    return actions.filter(item => {
      return columns.every(col => {
        if (!col.filter) return true;
        const val = String(item[col.field as keyof ActionItem]).toLowerCase();
        return val.includes(String(col.filter).toLowerCase());
      });
    }).sort((a, b) => {
      const activeSort = columns.find(c => c.sort);
      if (!activeSort) return 0;
      const field = activeSort.field as keyof ActionItem;
      const factor = activeSort.sort === 'asc' ? 1 : -1;
      return a[field]! > b[field]! ? factor : -factor;
    });
  }, [columns, actions]);

  const handleDeleteAction = (id: string) => {
    if (window.confirm('Deseja realmente excluir esta ação?')) {
      setActions(prev => prev.filter(a => a.id !== id));
      setShowActionMenu(null);
    }
  };

  const handleRowClick = (row: ActionItem) => {
    setSelectedAction(row);
    setShowDetailDrawer(true);
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white p-6 rounded-[32px] border border-zinc-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar ações..." 
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
            />
          </div>
          <select className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-600 focus:outline-none">
            <option>Setor: Todos</option>
            <option>Montagem</option>
            <option>Logística</option>
          </select>
          <select className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-600 focus:outline-none">
            <option>Origem: Todas</option>
            <option>NR1</option>
            <option>Ergo</option>
          </select>
          <select className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-600 focus:outline-none">
            <option>Status: Todos</option>
            <option>Pendente</option>
            <option>Atrasada</option>
          </select>
          <button className="p-2.5 bg-zinc-900 text-white rounded-2xl hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/20">
            <Filter size={20} />
          </button>
        </div>
        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-5 bg-zinc-200 rounded-full relative transition-colors group-hover:bg-zinc-300">
              <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform" />
            </div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Somente Atrasadas</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-5 bg-zinc-200 rounded-full relative transition-colors group-hover:bg-zinc-300">
              <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform" />
            </div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Aguardando Evidência</span>
          </label>
        </div>
      </div>

      <DataTable 
        columns={visibleColumns}
        data={filteredData}
        onSort={toggleSort}
        onFilter={updateFilter}
        onRowClick={handleRowClick}
        actions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActionMenu(showActionMenu === row.id ? null : row.id);
                }}
                className="p-2 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-400"
              >
                <MoreVertical size={18} />
              </button>
              
              <AnimatePresence>
                {showActionMenu === row.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(null)} />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-zinc-100 z-20 overflow-hidden py-2"
                    >
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRowClick(row); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                      >
                        <Info size={16} className="text-zinc-400" /> Ver Detalhes
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                      >
                        <PlayCircle size={16} className="text-blue-500" /> Marcar em Andamento
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedAction(row); setShowConcludeModal(true); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                      >
                        <CheckCircle2 size={16} className="text-emerald-500" /> Concluir Ação
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedAction(row); setShowEvidenceModal(true); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                      >
                        <Paperclip size={16} className="text-amber-500" /> Adicionar Evidência
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                      >
                        <UserPlus size={16} className="text-zinc-400" /> Reatribuir
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                      >
                        <Calendar size={16} className="text-zinc-400" /> Alterar Prazo
                      </button>
                      <div className="h-px bg-zinc-100 my-1" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteAction(row.id); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-3"
                      >
                        <Trash2 size={16} /> Excluir
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <ChevronRight size={18} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
          </div>
        )}
      />

      {/* Detalhe da Ação Drawer */}
      <AnimatePresence>
        {showDetailDrawer && selectedAction && (
          <>
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]" onClick={() => setShowDetailDrawer(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-[70] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-900 text-white rounded-xl">
                    <CheckSquare size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 truncate max-w-[280px]">Detalhe da Ação</h3>
                    <p className="text-xs text-zinc-500">ID: {selectedAction.id} • {selectedAction.sector}</p>
                  </div>
                </div>
                <button onClick={() => setShowDetailDrawer(false)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {/* Header Info */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-zinc-900 leading-tight">{selectedAction.title}</h2>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${
                        selectedAction.status === 'Em andamento' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        {selectedAction.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${
                        selectedAction.priority === 'Alta' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        Prioridade {selectedAction.priority}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Descrição</p>
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-sm text-zinc-600 leading-relaxed">
                      {selectedAction.description || 'Realizar o ajuste técnico da altura da bancada conforme normas de ergonomia vigentes para reduzir a flexão de tronco dos operadores.'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Responsável</p>
                      <p className="text-sm font-bold text-zinc-900">{selectedAction.responsible}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Prazo</p>
                      <p className="text-sm font-bold text-zinc-900">{selectedAction.dueDate}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Plano Vinculado</p>
                      <button className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1 text-left">
                        {selectedAction.planName} <ExternalLink size={12} />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Origem</p>
                      <p className="text-sm font-bold text-zinc-900">{selectedAction.origin}</p>
                    </div>
                  </div>
                </div>

                {/* Evidence Checklist */}
                {selectedAction.evidenceRequired && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                      <ShieldCheck size={18} className="text-emerald-600" />
                      Checklist de Evidências
                    </h4>
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedAction.hasEvidence ? 'bg-emerald-500 border-emerald-500' : 'border-emerald-300'
                        }`}>
                          {selectedAction.hasEvidence && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                        <span className="text-xs font-bold text-emerald-900">Evidência Fotográfica Obrigatória</span>
                      </div>
                      {!selectedAction.hasEvidence && (
                        <button onClick={() => setShowEvidenceModal(true)} className="text-[10px] font-black text-emerald-600 uppercase hover:underline">Anexar agora</button>
                      )}
                    </div>
                  </div>
                )}

                {/* Timeline / Comments */}
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Comentários / Timeline</p>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-600">JS</div>
                      <div className="flex-1 bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-zinc-900">João Silva</span>
                          <span className="text-[10px] text-zinc-400">06/03 10:30</span>
                        </div>
                        <p className="text-xs text-zinc-600">Aguardando a chegada das peças para finalização do ajuste.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-white">EU</div>
                    <div className="flex-1 relative">
                      <textarea placeholder="Adicionar um comentário..." className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900/20 min-h-[80px]" />
                      <button className="absolute right-3 bottom-3 p-1.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-all">
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-zinc-50 border-t border-zinc-100 grid grid-cols-2 lg:grid-cols-4 gap-3">
                <button className="px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/20 flex items-center justify-center gap-2">
                  <Edit3 size={16} /> Editar
                </button>
                <button className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                  <PlayCircle size={16} /> Em Andamento
                </button>
                <button 
                  onClick={() => setShowConcludeModal(true)}
                  className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} /> Concluir
                </button>
                <button 
                  onClick={() => setShowEvidenceModal(true)}
                  className="px-4 py-2.5 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <Paperclip size={16} /> Evidência
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Conclude Modal */}
      <AnimatePresence>
        {showConcludeModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                    <CheckCircle2 size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900">Concluir Ação</h3>
                </div>
                <button onClick={() => setShowConcludeModal(false)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                {selectedAction?.evidenceRequired && !selectedAction.hasEvidence ? (
                  <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex flex-col items-center text-center gap-4">
                    <AlertCircle size={40} className="text-red-500" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-red-900">Evidência Obrigatória</h4>
                      <p className="text-xs text-red-700">Para concluir esta ação, é necessário anexar uma evidência (foto ou documento).</p>
                    </div>
                    <button 
                      onClick={() => { setShowConcludeModal(false); setShowEvidenceModal(true); }}
                      className="px-6 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all"
                    >
                      Anexar Evidência
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Observação Final</label>
                      <textarea rows={3} placeholder="Descreva o resultado da ação..." className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Anexar Evidência Adicional (Opcional)</label>
                      <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-zinc-400 hover:bg-zinc-50 transition-all cursor-pointer">
                        <PlusCircle size={24} />
                        <span className="text-[10px] font-bold uppercase">Fazer Upload</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setShowConcludeModal(false)} className="px-6 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl transition-colors">Cancelar</button>
                <button 
                  onClick={() => setShowConcludeModal(false)} 
                  className="px-8 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  disabled={selectedAction?.evidenceRequired && !selectedAction.hasEvidence}
                >
                  Concluir Ação
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Evidence Modal */}
      <AnimatePresence>
        {showEvidenceModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                    <Paperclip size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900">Adicionar Evidência</h3>
                </div>
                <button onClick={() => setShowEvidenceModal(false)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Upload de Arquivo</label>
                  <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 text-zinc-400 hover:bg-zinc-50 transition-all cursor-pointer">
                    <div className="p-4 bg-zinc-100 rounded-full">
                      <FileDown size={32} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-zinc-900">Clique para fazer upload</p>
                      <p className="text-[10px] text-zinc-500">ou arraste e solte (Foto ou PDF)</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Tipo de Evidência</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Antes', 'Depois', 'Comprovante'].map(type => (
                      <button key={type} className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-[10px] font-bold hover:border-amber-500 transition-all">{type}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Descrição</label>
                  <textarea rows={2} placeholder="Breve descrição da evidência..." className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
                </div>
              </div>
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setShowEvidenceModal(false)} className="px-6 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl transition-colors">Cancelar</button>
                <button onClick={() => setShowEvidenceModal(false)} className="px-8 py-2 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20">Salvar Evidência</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
