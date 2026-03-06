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
  Kanban,
  List,
  ExternalLink,
  PlusCircle,
  Copy,
  Archive,
  FileText,
  ShieldCheck,
  Edit3,
  ClipboardList,
  CheckSquare
} from 'lucide-react';
import { DataTable } from '../../../components/DataTable';
import { useGrid } from '../../../hooks/useGrid';
import { IGridColumn } from '../../../types/grid';
import { ActionPlan, PlanStatus, Priority } from '../types';

interface PlanListProps {
  plans: ActionPlan[];
  setPlans: React.Dispatch<React.SetStateAction<ActionPlan[]>>;
}

export function PlanList({ plans, setPlans }: PlanListProps) {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<ActionPlan | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const initialColumns: IGridColumn[] = [
    { id: 'name', name: 'Nome do Plano', field: 'name', order: 1, isSortable: true, isFilterable: true, render: (row: ActionPlan) => (
      <div className="flex flex-col max-w-xs">
        <span className="text-sm font-bold text-zinc-900 truncate">{row.name}</span>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-bold text-zinc-400 uppercase">{row.origin}</span>
          <div className="w-1 h-1 rounded-full bg-zinc-300" />
          <span className="text-[10px] text-zinc-500 font-medium">{row.sector}</span>
        </div>
      </div>
    )},
    { id: 'status', name: 'Status', field: 'status', order: 2, isSortable: true, isFilterable: true, render: (row: ActionPlan) => {
      const colors: Record<PlanStatus, string> = {
        'Aberto': 'bg-blue-50 text-blue-600 border-blue-100',
        'Em andamento': 'bg-purple-50 text-purple-600 border-purple-100',
        'Em validação': 'bg-amber-50 text-amber-600 border-amber-100',
        'Concluído': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Cancelado': 'bg-zinc-100 text-zinc-400 border-zinc-200',
      };
      return (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${colors[row.status]}`}>
          {row.status}
        </span>
      );
    }},
    { id: 'progress', name: 'Progresso', field: 'progress', order: 3, isSortable: true, render: (row: ActionPlan) => (
      <div className="flex items-center gap-3 min-w-[120px]">
        <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              row.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'
            }`} 
            style={{ width: `${row.progress}%` }} 
          />
        </div>
        <span className="text-[10px] font-black text-zinc-900">{row.progress}%</span>
      </div>
    )},
    { id: 'dueDate', name: 'Prazo Final', field: 'dueDate', order: 4, isSortable: true, isFilterable: true },
    { id: 'responsible', name: 'Responsável', field: 'responsible', order: 5, isSortable: true, isFilterable: true },
  ];

  const { visibleColumns, toggleSort, updateFilter, columns } = useGrid(initialColumns);

  const filteredData = useMemo(() => {
    return plans.filter(item => {
      return columns.every(col => {
        if (!col.filter) return true;
        const val = String(item[col.field as keyof ActionPlan]).toLowerCase();
        return val.includes(String(col.filter).toLowerCase());
      });
    }).sort((a, b) => {
      const activeSort = columns.find(c => c.sort);
      if (!activeSort) return 0;
      const field = activeSort.field as keyof ActionPlan;
      const factor = activeSort.sort === 'asc' ? 1 : -1;
      return a[field]! > b[field]! ? factor : -factor;
    });
  }, [columns, plans]);

  const handleDeletePlan = (id: string) => {
    if (window.confirm('Deseja realmente excluir este plano e todas as suas ações?')) {
      setPlans(prev => prev.filter(p => p.id !== id));
      setShowActionMenu(null);
    }
  };

  const handleRowClick = (row: ActionPlan) => {
    setSelectedPlan(row);
    setShowDetailDrawer(true);
  };

  return (
    <div className="space-y-6">
      {/* View Toggle & Filters */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-2 p-1 bg-zinc-100 rounded-xl border border-zinc-200">
          <button 
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-[10px] font-bold rounded-lg transition-all flex items-center gap-2 ${
              viewMode === 'list' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <List size={14} /> Lista
          </button>
          <button 
            onClick={() => setViewMode('kanban')}
            className={`px-4 py-2 text-[10px] font-bold rounded-lg transition-all flex items-center gap-2 ${
              viewMode === 'kanban' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <Kanban size={14} /> Kanban
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar planos..." 
              className="pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/20 w-64"
            />
          </div>
          <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-xl transition-colors border border-zinc-200">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
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
                          onClick={(e) => { e.stopPropagation(); setSelectedPlan(row); setShowEditModal(true); setShowActionMenu(null); }}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                        >
                          <Edit3 size={16} className="text-blue-500" /> Editar Plano
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setShowActionMenu(null); }}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                        >
                          <Copy size={16} className="text-zinc-400" /> Duplicar Plano
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setShowActionMenu(null); }}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                        >
                          <FileDown size={16} className="text-zinc-400" /> Exportar PDF
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setShowActionMenu(null); }}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                        >
                          <Archive size={16} className="text-zinc-400" /> Arquivar
                        </button>
                        <div className="h-px bg-zinc-100 my-1" />
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeletePlan(row.id); }}
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {(['Aberto', 'Em andamento', 'Em validação', 'Concluído', 'Cancelado'] as PlanStatus[]).map(status => (
            <div key={status} className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{status}</h4>
                <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                  {plans.filter(p => p.status === status).length}
                </span>
              </div>
              <div className="space-y-3">
                {plans.filter(p => p.status === status).map(plan => (
                  <motion.div 
                    key={plan.id}
                    whileHover={{ y: -2 }}
                    onClick={() => handleRowClick(plan)}
                    className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm cursor-pointer hover:border-zinc-900 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${
                        plan.priority === 'Alta' ? 'bg-red-50 text-red-600 border-red-100' :
                        plan.priority === 'Média' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-zinc-50 text-zinc-600 border-zinc-100'
                      }`}>
                        {plan.priority}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-400">{plan.dueDate}</span>
                    </div>
                    <h5 className="text-xs font-bold text-zinc-900 mb-2 group-hover:text-blue-600 transition-colors">{plan.name}</h5>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">{plan.origin}</span>
                      <div className="w-1 h-1 rounded-full bg-zinc-200" />
                      <span className="text-[9px] text-zinc-500 font-medium">{plan.sector}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 h-1 bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-900 rounded-full" style={{ width: `${plan.progress}%` }} />
                      </div>
                      <span className="text-[9px] font-black text-zinc-900">{plan.progress}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Plano 360º Drawer */}
      <AnimatePresence>
        {showDetailDrawer && selectedPlan && (
          <>
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]" onClick={() => setShowDetailDrawer(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-[70] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-900 text-white rounded-xl">
                    <ClipboardList size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">Plano 360º</h3>
                    <p className="text-xs text-zinc-500">ID: {selectedPlan.id} • {selectedPlan.sector}</p>
                  </div>
                </div>
                <button onClick={() => setShowDetailDrawer(false)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {/* Header Info */}
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-zinc-900 leading-tight">{selectedPlan.name}</h2>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${
                          selectedPlan.status === 'Em andamento' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-zinc-100 text-zinc-600'
                        }`}>
                          {selectedPlan.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${
                          selectedPlan.priority === 'Alta' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-zinc-100 text-zinc-600'
                        }`}>
                          Prioridade {selectedPlan.priority}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Progresso Geral</p>
                      <h4 className="text-2xl font-black text-zinc-900">{selectedPlan.progress}%</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Origem</p>
                      <button className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                        {selectedPlan.origin} <ExternalLink size={12} />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Responsável Geral</p>
                      <p className="text-sm font-bold text-zinc-900">{selectedPlan.responsible}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Setor / Unidade</p>
                      <p className="text-sm font-bold text-zinc-900">{selectedPlan.sector} - {selectedPlan.unit}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Prazo do Plano</p>
                      <p className="text-sm font-bold text-zinc-900">{selectedPlan.dueDate}</p>
                    </div>
                  </div>
                </div>

                {/* Actions List */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                      <CheckSquare size={18} className="text-zinc-900" />
                      Lista de Ações ({selectedPlan.completedActionsCount}/{selectedPlan.actionsCount})
                    </h4>
                    <button className="text-[10px] font-bold text-blue-600 hover:underline">+ Nova Ação</button>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="p-4 bg-white border border-zinc-200 rounded-2xl flex items-center gap-4 hover:border-zinc-900 transition-all cursor-pointer group">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          i === 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-50 text-zinc-400'
                        }`}>
                          {i === 1 ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-xs font-bold text-zinc-900 truncate">Ação Corretiva #{i}: Ajuste de bancada ergonômica</p>
                            <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${
                              i === 1 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                              {i === 1 ? 'Concluída' : 'Em andamento'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-[10px] text-zinc-500">Resp: Dr. Silva</p>
                            <div className="w-1 h-1 rounded-full bg-zinc-200" />
                            <p className="text-[10px] text-zinc-500">Prazo: 15/03/2026</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence Gallery */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <Paperclip size={18} className="text-zinc-900" />
                    Evidências do Plano
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2].map(i => (
                      <div key={i} className="aspect-video bg-zinc-100 rounded-2xl border border-zinc-200 overflow-hidden relative group cursor-pointer">
                        <img 
                          src={`https://picsum.photos/seed/plan-${i}/400/300`} 
                          alt="Evidência" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Plus size={24} className="text-white" />
                        </div>
                      </div>
                    ))}
                    <button className="aspect-video bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-zinc-400 hover:bg-zinc-100 hover:border-zinc-300 transition-all">
                      <PlusCircle size={24} />
                      <span className="text-[10px] font-bold uppercase">Adicionar</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-zinc-50 border-t border-zinc-100 grid grid-cols-2 lg:grid-cols-4 gap-3">
                <button className="px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/20 flex items-center justify-center gap-2">
                  <Plus size={16} /> Nova Ação
                </button>
                <button className="px-4 py-2.5 bg-white border border-zinc-200 text-zinc-600 rounded-xl text-xs font-bold hover:bg-zinc-50 transition-all flex items-center justify-center gap-2">
                  <FileDown size={16} /> Exportar PDF
                </button>
                <button className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled={selectedPlan.progress < 100}>
                  <ShieldCheck size={16} /> Concluir Plano
                </button>
                <button className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                  <Paperclip size={16} /> Evidência
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Modal Placeholder */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
              <h3 className="text-xl font-bold text-zinc-900 mb-6">Editar Plano</h3>
              <div className="space-y-4">
                <input type="text" defaultValue={selectedPlan?.name} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm" />
                <select className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm">
                  <option>Status: Em andamento</option>
                  <option>Status: Em validação</option>
                  <option>Status: Concluído</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setShowEditModal(false)} className="px-6 py-2.5 text-zinc-600 font-bold text-sm">Cancelar</button>
                <button onClick={() => setShowEditModal(false)} className="px-8 py-2.5 bg-zinc-900 text-white font-bold text-sm rounded-xl">Salvar</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
