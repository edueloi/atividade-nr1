import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronRight, 
  Activity, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Plus, 
  PlusCircle,
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  MessageSquare, 
  Paperclip, 
  History, 
  Stethoscope, 
  ShieldCheck, 
  AlertCircle, 
  FileText, 
  Edit3, 
  Pause, 
  Trash2,
  Target,
  Info
} from 'lucide-react';
import { DataTable } from '../../../components/DataTable';
import { useGrid } from '../../../hooks/useGrid';
import { IGridColumn } from '../../../types/grid';
import { PhysioCase, CaseStatus } from '../types';

const mockCases: PhysioCase[] = [
  { id: '1', startDate: '01/03/2026', unit: 'Unidade 1', sector: 'Montagem Final', bodyStructure: 'Lombar', status: 'Em tratamento', lastSession: '05/03/2026', nextSession: '08/03/2026', objective: 'Redução de dor e ganho de mobilidade', frequency: '2x/semana', plannedSessions: 10, completedSessions: 4, initialPain: 8, currentPain: 5 },
  { id: '2', startDate: '25/02/2026', unit: 'Unidade 1', sector: 'Logística', bodyStructure: 'Ombro', status: 'Ativo', lastSession: '04/03/2026', nextSession: '07/03/2026', objective: 'Tratamento de tendinite', frequency: '2x/semana', plannedSessions: 8, completedSessions: 3, initialPain: 7, currentPain: 6 },
  { id: '3', startDate: '15/02/2026', unit: 'Unidade 2', sector: 'Pintura', bodyStructure: 'Cervical', status: 'Concluído (Reabilitado)', lastSession: '01/03/2026', objective: 'Correção postural', frequency: '1x/semana', plannedSessions: 6, completedSessions: 6, initialPain: 5, currentPain: 1 },
  { id: '4', startDate: '10/02/2026', unit: 'Unidade 1', sector: 'Solda', bodyStructure: 'Pulso/Mão', status: 'Pausado', lastSession: '20/02/2026', objective: 'Reabilitação pós-trauma', frequency: '3x/semana', plannedSessions: 12, completedSessions: 5, initialPain: 9, currentPain: 7 },
  { id: '5', startDate: '05/02/2026', unit: 'Unidade 1', sector: 'Estamparia', bodyStructure: 'Joelho', status: 'Escalou para Absenteísmo', lastSession: '15/02/2026', objective: 'Tratamento de lesão meniscal', frequency: '2x/semana', plannedSessions: 15, completedSessions: 4, initialPain: 8, currentPain: 8 },
];

export function PhysioCases() {
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<PhysioCase | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showRegisterSessionModal, setShowRegisterSessionModal] = useState(false);
  const [showUpdatePlanModal, setShowUpdatePlanModal] = useState(false);
  const [showConcludeCaseModal, setShowConcludeCaseModal] = useState(false);

  const initialColumns: IGridColumn[] = [
    { id: 'startDate', name: 'Início', field: 'startDate', order: 1, isSortable: true, isFilterable: true, filterType: 'date' },
    { id: 'sector', name: 'Setor / Unidade', field: 'sector', order: 2, isSortable: true, isFilterable: true, render: (row: PhysioCase) => (
      <div className="flex flex-col">
        <span className="text-sm font-bold text-zinc-900">{row.sector}</span>
        <span className="text-[10px] text-zinc-500 font-medium">{row.unit}</span>
      </div>
    )},
    { id: 'bodyStructure', name: 'Estrutura Corporal', field: 'bodyStructure', order: 3, isSortable: true, isFilterable: true },
    { id: 'status', name: 'Status', field: 'status', order: 4, isSortable: true, isFilterable: true, render: (row: PhysioCase) => {
      const colors: Record<CaseStatus, string> = {
        'Ativo': 'bg-blue-50 text-blue-600 border-blue-100',
        'Em tratamento': 'bg-purple-50 text-purple-600 border-purple-100',
        'Pausado': 'bg-amber-50 text-amber-600 border-amber-100',
        'Concluído (Reabilitado)': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Concluído (Encaminhado médico)': 'bg-orange-50 text-orange-600 border-orange-100',
        'Escalou para Absenteísmo': 'bg-red-50 text-red-600 border-red-100',
        'Abandonado': 'bg-zinc-100 text-zinc-400 border-zinc-200',
      };
      return (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${colors[row.status]}`}>
          {row.status}
        </span>
      );
    }},
    { id: 'lastSession', name: 'Última Sessão', field: 'lastSession', order: 5, isSortable: true, isFilterable: true },
    { id: 'nextSession', name: 'Próxima Sessão', field: 'nextSession', order: 6, isSortable: true, isFilterable: true },
  ];

  const { visibleColumns, toggleSort, updateFilter, columns } = useGrid(initialColumns);

  const filteredData = useMemo(() => {
    return mockCases.filter(item => {
      return columns.every(col => {
        if (!col.filter) return true;
        const val = String(item[col.field as keyof PhysioCase]).toLowerCase();
        return val.includes(String(col.filter).toLowerCase());
      });
    }).sort((a, b) => {
      const activeSort = columns.find(c => c.sort);
      if (!activeSort) return 0;
      const field = activeSort.field as keyof PhysioCase;
      const factor = activeSort.sort === 'asc' ? 1 : -1;
      return a[field]! > b[field]! ? factor : -factor;
    });
  }, [columns]);

  const handleRowClick = (row: PhysioCase) => {
    setSelectedCase(row);
    setShowDetailDrawer(true);
  };

  return (
    <div className="space-y-6">
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
                        <Info size={16} className="text-zinc-400" /> Ver Caso
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedCase(row); setShowUpdatePlanModal(true); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                      >
                        <Edit3 size={16} className="text-blue-500" /> Editar Plano
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                      >
                        <Pause size={16} className="text-amber-500" /> Pausar
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedCase(row); setShowConcludeCaseModal(true); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                      >
                        <CheckCircle2 size={16} className="text-emerald-500" /> Concluir
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-3"
                      >
                        <AlertTriangle size={16} /> Escalar para Absenteísmo
                      </button>
                      <div className="h-px bg-zinc-100 my-1" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                      >
                        <PlusCircle size={16} className="text-zinc-400" /> Criar Plano de Ação
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

      {/* Case 360 Drawer */}
      <AnimatePresence>
        {showDetailDrawer && selectedCase && (
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
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">Caso 360º</h3>
                    <p className="text-xs text-zinc-500">ID: {selectedCase.id} • {selectedCase.sector}</p>
                  </div>
                </div>
                <button onClick={() => setShowDetailDrawer(false)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {/* Summary & Progress */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 text-center">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Sessões</p>
                    <h4 className="text-xl font-black text-zinc-900">{selectedCase.completedSessions} / {selectedCase.plannedSessions}</h4>
                    <div className="w-full h-1.5 bg-zinc-200 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(selectedCase.completedSessions! / selectedCase.plannedSessions!) * 100}%` }} />
                    </div>
                  </div>
                  <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 text-center">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Dor Inicial</p>
                    <h4 className="text-xl font-black text-red-600">{selectedCase.initialPain} / 10</h4>
                  </div>
                  <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 text-center">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Dor Atual</p>
                    <h4 className="text-xl font-black text-emerald-600">{selectedCase.currentPain} / 10</h4>
                  </div>
                </div>

                {/* Treatment Plan */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                      <Target size={18} className="text-emerald-600" />
                      Plano de Tratamento
                    </h4>
                    <button onClick={() => setShowUpdatePlanModal(true)} className="text-[10px] font-bold text-emerald-600 hover:underline">Editar Plano</button>
                  </div>
                  <div className="p-6 bg-white border border-zinc-200 rounded-3xl space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Objetivo</p>
                        <p className="text-sm font-bold text-zinc-900">{selectedCase.objective}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Frequência</p>
                        <p className="text-sm font-bold text-zinc-900">{selectedCase.frequency}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sessions List */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <Clock size={18} className="text-emerald-600" />
                    Histórico de Sessões
                  </h4>
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="p-4 bg-white border border-zinc-200 rounded-2xl flex items-center gap-4 hover:border-emerald-200 transition-all cursor-pointer group">
                        <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                          <CheckCircle2 size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-xs font-bold text-zinc-900">Sessão #{i}</p>
                            <span className="text-[10px] font-bold text-zinc-400">0{i}/03/2026</span>
                          </div>
                          <p className="text-[10px] text-zinc-500 line-clamp-1">Mobilização articular + alongamento cadeias posteriores. Melhora na amplitude.</p>
                        </div>
                        <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Linha do Tempo Completa</p>
                  <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-zinc-100">
                    {[
                      { date: '05/03 14:00', title: 'Sessão Realizada', desc: 'Dor reduziu de 6 para 4 após intervenção.', user: 'Dr. Silva' },
                      { date: '01/03 10:00', title: 'Caso Iniciado', desc: 'Plano definido: 10 sessões, 2x/semana.', user: 'Dra. Maria' },
                      { date: '28/02 16:30', title: 'Triagem Concluída', desc: 'Encaminhado para tratamento imediato.', user: 'Dr. Silva' },
                    ].map((event, i) => (
                      <div key={i} className="relative pl-8">
                        <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center z-10">
                          <div className="w-1 h-1 rounded-full bg-emerald-500" />
                        </div>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-bold text-zinc-900">{event.title}</p>
                            <p className="text-[10px] text-zinc-500 leading-relaxed max-w-sm">{event.desc}</p>
                            <p className="text-[10px] text-zinc-400 mt-1 italic">por {event.user}</p>
                          </div>
                          <span className="text-[10px] font-bold text-zinc-400">{event.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-zinc-50 border-t border-zinc-100 grid grid-cols-2 lg:grid-cols-4 gap-3">
                <button 
                  onClick={() => setShowRegisterSessionModal(true)}
                  className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} /> Registrar Sessão
                </button>
                <button className="px-4 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2">
                  <Calendar size={16} /> Agendar Sessão
                </button>
                <button 
                  onClick={() => setShowConcludeCaseModal(true)}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={16} /> Concluir Caso
                </button>
                <button className="px-4 py-2.5 bg-white border border-zinc-200 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-2">
                  <AlertTriangle size={16} /> Escalar Absenteísmo
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Register Session Modal */}
      <AnimatePresence>
        {showRegisterSessionModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                    <CheckCircle2 size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900">Registrar Sessão</h3>
                </div>
                <button onClick={() => setShowRegisterSessionModal(false)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Dor Antes (0-10)</label>
                    <input type="number" min="0" max="10" className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Dor Depois (0-10)</label>
                    <input type="number" min="0" max="10" className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Intervenções Realizadas</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Mobilização', 'Alongamento', 'Fortalecimento', 'Orientações Ergo', 'Eletroterapia', 'Crioterapia'].map(item => (
                      <label key={item} className="flex items-center gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-100 cursor-pointer hover:bg-zinc-100 transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                        <span className="text-xs font-medium text-zinc-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Evolução Clínica</label>
                  <textarea rows={3} placeholder="Descreva a evolução do paciente nesta sessão..." className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Próxima Ação</label>
                  <select className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                    <option>Manter Frequência</option>
                    <option>Ajustar Plano</option>
                    <option>Alta (Reabilitado)</option>
                    <option>Encaminhar Médico</option>
                  </select>
                </div>
              </div>
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setShowRegisterSessionModal(false)} className="px-6 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl transition-colors">Cancelar</button>
                <button onClick={() => setShowRegisterSessionModal(false)} className="px-8 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20">Salvar Sessão</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Conclude Case Modal */}
      <AnimatePresence>
        {showConcludeCaseModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900">Concluir Caso</h3>
                </div>
                <button onClick={() => setShowConcludeCaseModal(false)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Desfecho do Tratamento</label>
                  <div className="space-y-2">
                    {[
                      { id: 'rehab', label: 'Reabilitado (sem afastamento)', icon: <CheckCircle2 size={16} className="text-emerald-500" /> },
                      { id: 'doctor', label: 'Encaminhado ao Médico', icon: <Stethoscope size={16} className="text-orange-500" /> },
                      { id: 'absent', label: 'Escalou para Absenteísmo', icon: <AlertTriangle size={16} className="text-red-500" /> },
                    ].map(opt => (
                      <label key={opt.id} className="flex items-center gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl cursor-pointer hover:border-emerald-500 transition-all">
                        <input type="radio" name="outcome" className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                        {opt.icon}
                        <span className="text-xs font-bold text-zinc-700">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Observação Final</label>
                  <textarea rows={3} placeholder="Resumo final do caso..." className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </div>
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setShowConcludeCaseModal(false)} className="px-6 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl transition-colors">Cancelar</button>
                <button onClick={() => setShowConcludeCaseModal(false)} className="px-8 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">Concluir Caso</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Update Plan Modal */}
      <AnimatePresence>
        {showUpdatePlanModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                    <Edit3 size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900">Atualizar Plano</h3>
                </div>
                <button onClick={() => setShowUpdatePlanModal(false)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Frequência</label>
                  <select className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                    <option>1x por semana</option>
                    <option>2x por semana</option>
                    <option>3x por semana</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Nº de Sessões Previstas</label>
                  <input type="number" defaultValue="10" className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Objetivo</label>
                  <textarea rows={3} placeholder="Descreva o novo objetivo..." className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </div>
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setShowUpdatePlanModal(false)} className="px-6 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl transition-colors">Cancelar</button>
                <button onClick={() => setShowUpdatePlanModal(false)} className="px-8 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">Salvar Plano</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
