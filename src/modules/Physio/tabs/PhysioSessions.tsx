import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  MoreVertical, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  CalendarCheck, 
  CalendarDays, 
  ListFilter, 
  RefreshCw, 
  AlertTriangle, 
  Search, 
  Filter, 
  Plus, 
  ArrowRight, 
  MessageSquare, 
  History, 
  Edit3, 
  Trash2,
  Info
} from 'lucide-react';
import { DataTable } from '../../../components/DataTable';
import { useGrid } from '../../../hooks/useGrid';
import { IGridColumn } from '../../../types/grid';
import { PhysioSession } from '../types';

const mockSessions: PhysioSession[] = [
  { id: '1', caseId: '1', date: '06/03/2026', time: '09:00', professional: 'Dr. Silva', location: 'Sala 1', status: 'Agendada' },
  { id: '2', caseId: '2', date: '06/03/2026', time: '10:30', professional: 'Dra. Maria', location: 'Sala 2', status: 'Realizada', painBefore: 7, painAfter: 5 },
  { id: '3', caseId: '3', date: '06/03/2026', time: '14:00', professional: 'Dr. Silva', location: 'Sala 1', status: 'Faltou' },
  { id: '4', caseId: '4', date: '07/03/2026', time: '08:00', professional: 'Dra. Maria', location: 'Sala 2', status: 'Agendada' },
  { id: '5', caseId: '5', date: '07/03/2026', time: '11:00', professional: 'Dr. Silva', location: 'Sala 1', status: 'Cancelada' },
];

export function PhysioSessions() {
  const [viewMode, setViewMode] = useState<'agenda' | 'list'>('agenda');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<PhysioSession | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);

  const initialColumns: IGridColumn[] = [
    { id: 'date', name: 'Data', field: 'date', order: 1, isSortable: true, isFilterable: true, filterType: 'date' },
    { id: 'time', name: 'Hora', field: 'time', order: 2, isSortable: true, isFilterable: true },
    { id: 'professional', name: 'Profissional', field: 'professional', order: 3, isSortable: true, isFilterable: true },
    { id: 'location', name: 'Local', field: 'location', order: 4, isSortable: true, isFilterable: true },
    { id: 'status', name: 'Status', field: 'status', order: 5, isSortable: true, isFilterable: true, render: (row: PhysioSession) => {
      const colors = {
        'Agendada': 'bg-blue-50 text-blue-600 border-blue-100',
        'Realizada': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Faltou': 'bg-red-50 text-red-600 border-red-100',
        'Cancelada': 'bg-zinc-100 text-zinc-400 border-zinc-200',
      };
      return (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${colors[row.status]}`}>
          {row.status}
        </span>
      );
    }},
  ];

  const { visibleColumns, toggleSort, updateFilter, columns } = useGrid(initialColumns);

  const filteredData = useMemo(() => {
    return mockSessions.filter(item => {
      return columns.every(col => {
        if (!col.filter) return true;
        const val = String(item[col.field as keyof PhysioSession]).toLowerCase();
        return val.includes(String(col.filter).toLowerCase());
      });
    }).sort((a, b) => {
      const activeSort = columns.find(c => c.sort);
      if (!activeSort) return 0;
      const field = activeSort.field as keyof PhysioSession;
      const factor = activeSort.sort === 'asc' ? 1 : -1;
      return a[field]! > b[field]! ? factor : -factor;
    });
  }, [columns]);

  const handleSessionClick = (session: PhysioSession) => {
    setSelectedSession(session);
    setShowDetailDrawer(true);
  };

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-2 p-1 bg-zinc-100 rounded-xl border border-zinc-200">
          <button 
            onClick={() => setViewMode('agenda')}
            className={`px-4 py-2 text-[10px] font-bold rounded-lg transition-all flex items-center gap-2 ${
              viewMode === 'agenda' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <CalendarDays size={14} /> Agenda
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-[10px] font-bold rounded-lg transition-all flex items-center gap-2 ${
              viewMode === 'list' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <ListFilter size={14} /> Lista
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-xl transition-colors border border-zinc-200">
            <RefreshCw size={20} />
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <Plus size={18} />
            Agendar Sessão
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <DataTable 
          columns={visibleColumns}
          data={filteredData}
          onSort={toggleSort}
          onFilter={updateFilter}
          onRowClick={handleSessionClick}
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
                          onClick={(e) => { e.stopPropagation(); handleSessionClick(row); setShowActionMenu(null); }}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                        >
                          <Info size={16} className="text-zinc-400" /> Ver Detalhes
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedSession(row); setShowRescheduleModal(true); setShowActionMenu(null); }}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                        >
                          <RefreshCw size={16} className="text-blue-500" /> Reagendar
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedSession(row); setShowAbsenceModal(true); setShowActionMenu(null); }}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                        >
                          <AlertTriangle size={16} className="text-red-500" /> Marcar Falta
                        </button>
                        <div className="h-px bg-zinc-100 my-1" />
                        <button 
                          onClick={(e) => { e.stopPropagation(); setShowActionMenu(null); }}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-3"
                        >
                          <X size={16} /> Cancelar Sessão
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
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, i) => (
            <div key={day} className="space-y-4">
              <div className="text-center p-2 bg-zinc-50 rounded-xl border border-zinc-100">
                <p className="text-[10px] font-bold text-zinc-400 uppercase">{day}</p>
                <p className="text-sm font-black text-zinc-900">{6 + i}</p>
              </div>
              <div className="space-y-2">
                {mockSessions.filter(s => parseInt(s.date.split('/')[0]) === 6 + i).map(session => (
                  <button 
                    key={session.id}
                    onClick={() => handleSessionClick(session)}
                    className={`w-full p-3 rounded-xl border text-left transition-all hover:scale-[1.02] shadow-sm ${
                      session.status === 'Realizada' ? 'bg-emerald-50 border-emerald-100' :
                      session.status === 'Faltou' ? 'bg-red-50 border-red-100' :
                      'bg-white border-zinc-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-zinc-900">{session.time}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        session.status === 'Realizada' ? 'bg-emerald-500' :
                        session.status === 'Faltou' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`} />
                    </div>
                    <p className="text-[10px] font-bold text-zinc-900 truncate">Caso #{session.caseId}</p>
                    <p className="text-[10px] text-zinc-500 truncate">{session.professional}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Drawer */}
      <AnimatePresence>
        {showDetailDrawer && selectedSession && (
          <>
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]" onClick={() => setShowDetailDrawer(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[70] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">Detalhe da Sessão</h3>
                    <p className="text-xs text-zinc-500">ID: {selectedSession.id} • {selectedSession.status}</p>
                  </div>
                </div>
                <button onClick={() => setShowDetailDrawer(false)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Data / Hora</p>
                    <p className="text-sm font-bold text-zinc-900">{selectedSession.date} às {selectedSession.time}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Profissional</p>
                    <p className="text-sm font-bold text-zinc-900">{selectedSession.professional}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Local</p>
                    <p className="text-sm font-bold text-zinc-900">{selectedSession.location}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Caso Vinculado</p>
                    <button className="text-sm font-bold text-emerald-600 hover:underline flex items-center gap-1">
                      Ver Caso #{selectedSession.caseId} <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {selectedSession.status === 'Realizada' && (
                  <div className="space-y-4 p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Registro Clínico</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400">Dor Antes</p>
                        <p className="text-lg font-black text-red-600">{selectedSession.painBefore} / 10</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400">Dor Depois</p>
                        <p className="text-lg font-black text-emerald-600">{selectedSession.painAfter} / 10</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-zinc-50 border-t border-zinc-100 grid grid-cols-2 gap-3">
                <button className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} /> Iniciar Atendimento
                </button>
                <button 
                  onClick={() => setShowAbsenceModal(true)}
                  className="px-4 py-2.5 bg-white border border-zinc-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                >
                  <AlertTriangle size={16} /> Marcar Falta
                </button>
                <button 
                  onClick={() => setShowRescheduleModal(true)}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} /> Reagendar
                </button>
                <button className="px-4 py-2.5 bg-white border border-zinc-200 text-zinc-600 rounded-xl text-xs font-bold hover:bg-zinc-100 transition-all flex items-center justify-center gap-2">
                  <X size={16} /> Cancelar Sessão
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {showRescheduleModal && (
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
                    <RefreshCw size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900">Reagendar Sessão</h3>
                </div>
                <button onClick={() => setShowRescheduleModal(false)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Nova Data</label>
                    <input type="date" className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Nova Hora</label>
                    <input type="time" className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Motivo do Reagendamento</label>
                  <textarea rows={3} placeholder="Descreva o motivo..." className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </div>
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setShowRescheduleModal(false)} className="px-6 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl transition-colors">Cancelar</button>
                <button onClick={() => setShowRescheduleModal(false)} className="px-8 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">Salvar Alteração</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Absence Modal */}
      <AnimatePresence>
        {showAbsenceModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                    <AlertTriangle size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900">Marcar Falta</h3>
                </div>
                <button onClick={() => setShowAbsenceModal(false)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Motivo da Falta</label>
                  <select className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20">
                    <option>Não compareceu (sem aviso)</option>
                    <option>Avisou com antecedência</option>
                    <option>Problema operacional no setor</option>
                    <option>Outros</option>
                  </select>
                </div>
                <label className="flex items-center gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-red-600 focus:ring-red-500 rounded" />
                  <span className="text-xs font-bold text-zinc-700">Criar lembrete de retorno</span>
                </label>
              </div>
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setShowAbsenceModal(false)} className="px-6 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl transition-colors">Cancelar</button>
                <button onClick={() => setShowAbsenceModal(false)} className="px-8 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-500/20">Registrar Falta</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
