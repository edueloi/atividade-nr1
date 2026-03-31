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
  Stethoscope, 
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
  CalendarCheck, 
  FileDown, 
  Trash2,
  Info,
  ClipboardList
} from 'lucide-react';
import { DataTable } from '../../../components/DataTable';
import { useGrid } from '../../../hooks/useGrid';
import { IGridColumn } from '../../../types/grid';
import { Referral, ReferralStatus, Severity } from '../types';

export const mockReferrals: Referral[] = [
  { id: '1', date: '06/03/2026', origin: 'Queixa', unit: 'Unidade 1', sector: 'Montagem Final', bodyStructure: 'Lombar', severity: 'Alta', status: 'Novo', responsible: 'Dr. Silva' },
  { id: '2', date: '05/03/2026', origin: 'Ambulatório', unit: 'Unidade 1', sector: 'Logística', bodyStructure: 'Ombro', severity: 'Moderada', status: 'Em triagem', responsible: 'Dra. Maria' },
  { id: '3', date: '04/03/2026', origin: 'Ergonomia', unit: 'Unidade 2', sector: 'Pintura', bodyStructure: 'Cervical', severity: 'Leve', status: 'Agendado', responsible: 'Dr. Carlos' },
  { id: '4', date: '03/03/2026', origin: 'NR1', unit: 'Unidade 1', sector: 'Solda', bodyStructure: 'Pulso/Mão', severity: 'Moderada', status: 'Novo' },
  { id: '5', date: '02/03/2026', origin: 'Queixa', unit: 'Unidade 1', sector: 'Estamparia', bodyStructure: 'Joelho', severity: 'Alta', status: 'Cancelado', notes: 'Paciente em férias' },
];

interface PhysioReferralsProps {
  data?: Referral[];
}

export function PhysioReferrals({ data = mockReferrals }: PhysioReferralsProps) {
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showTriageModal, setShowTriageModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCreateCaseModal, setShowCreateCaseModal] = useState(false);

  const [painScale, setPainScale] = useState(6);
  const [confirmedSeverity, setConfirmedSeverity] = useState<string | null>(null);

  const initialColumns: IGridColumn[] = [
    { id: 'date', name: 'Data', field: 'date', order: 1, isSortable: true, isFilterable: true, filterType: 'date' },
    { id: 'origin', name: 'Origem', field: 'origin', order: 2, isSortable: true, isFilterable: true },
    { id: 'sector', name: 'Setor / Unidade', field: 'sector', order: 3, isSortable: true, isFilterable: true, render: (row: Referral) => (
      <div className="flex flex-col">
        <span className="text-sm font-bold text-zinc-900">{row.sector}</span>
        <span className="text-[10px] text-zinc-500 font-medium">{row.unit}</span>
      </div>
    )},
    { id: 'bodyStructure', name: 'Estrutura Corporal', field: 'bodyStructure', order: 4, isSortable: true, isFilterable: true },
    { id: 'severity', name: 'Severidade', field: 'severity', order: 5, isSortable: true, isFilterable: true, render: (row: Referral) => (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          row.severity === 'Alta' ? 'bg-red-500' : 
          row.severity === 'Moderada' ? 'bg-amber-500' : 
          'bg-emerald-500'
        }`} />
        <span className="text-xs font-bold text-zinc-600">{row.severity}</span>
      </div>
    )},
    { id: 'status', name: 'Status', field: 'status', order: 6, isSortable: true, isFilterable: true, render: (row: Referral) => {
      const colors: Record<ReferralStatus, string> = {
        'Novo': 'bg-zinc-100 text-zinc-600 border-zinc-200',
        'Em triagem': 'bg-blue-50 text-blue-600 border-blue-100',
        'Agendado': 'bg-purple-50 text-purple-600 border-purple-100',
        'Recusado': 'bg-zinc-100 text-zinc-400 border-zinc-200',
        'Cancelado': 'bg-zinc-100 text-zinc-400 border-zinc-200',
      };
      return (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${colors[row.status]}`}>
          {row.status}
        </span>
      );
    }},
    { id: 'responsible', name: 'Responsável', field: 'responsible', order: 7, isSortable: true, isFilterable: true },
  ];

  const { visibleColumns, toggleSort, updateFilter, columns } = useGrid(initialColumns);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      return columns.every(col => {
        if (!col.filter) return true;
        const val = String(item[col.field as keyof Referral]).toLowerCase();
        return val.includes(String(col.filter).toLowerCase());
      });
    }).sort((a, b) => {
      const activeSort = columns.find(c => c.sort);
      if (!activeSort) return 0;
      const field = activeSort.field as keyof Referral;
      const factor = activeSort.sort === 'asc' ? 1 : -1;
      return a[field]! > b[field]! ? factor : -factor;
    });
  }, [columns, data]);

  const handleRowClick = (row: Referral) => {
    setSelectedReferral(row);
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
                        <Info size={16} className="text-zinc-400" /> Ver Detalhes
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedReferral(row); setShowTriageModal(true); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                      >
                        <Stethoscope size={16} className="text-blue-500" /> Iniciar Triagem
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedReferral(row); setShowScheduleModal(true); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                      >
                        <Calendar size={16} className="text-purple-500" /> Agendar Sessão
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedReferral(row); setShowCreateCaseModal(true); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                      >
                        <Activity size={16} className="text-emerald-500" /> Criar Caso
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                      >
                        <UserPlus size={16} className="text-zinc-400" /> Atribuir Responsável
                      </button>
                      <div className="h-px bg-zinc-100 my-1" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-3"
                      >
                        <X size={16} /> Cancelar/Recusar
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

      {/* Detail Drawer */}
      <AnimatePresence>
        {showDetailDrawer && selectedReferral && (
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
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                    <ClipboardList size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">Detalhe do Encaminhamento</h3>
                    <p className="text-xs text-zinc-500">ID: {selectedReferral.id}</p>
                  </div>
                </div>
                <button onClick={() => setShowDetailDrawer(false)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {/* Header Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Origem</p>
                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
                      {selectedReferral.origin}
                      <button className="text-emerald-600 hover:underline flex items-center gap-1">
                        <ArrowRight size={14} /> Ver vínculo
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Data</p>
                    <p className="text-sm font-bold text-zinc-900">{selectedReferral.date}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Setor / Unidade</p>
                    <p className="text-sm font-bold text-zinc-900">{selectedReferral.sector} - {selectedReferral.unit}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Estrutura Corporal</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        selectedReferral.severity === 'Alta' ? 'bg-red-500' : 
                        selectedReferral.severity === 'Moderada' ? 'bg-amber-500' : 
                        'bg-emerald-500'
                      }`} />
                      <p className="text-sm font-bold text-zinc-900">{selectedReferral.bodyStructure} ({selectedReferral.severity})</p>
                    </div>
                  </div>
                </div>

                {/* Observations */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Observações Iniciais</p>
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-sm text-zinc-600 leading-relaxed">
                    {selectedReferral.notes || 'Nenhuma observação registrada.'}
                  </div>
                </div>

                {/* Attachments */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Anexos</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2].map(i => (
                      <div key={i} className="p-3 bg-white border border-zinc-200 rounded-xl flex items-center gap-3 group hover:border-emerald-200 transition-all cursor-pointer">
                        <div className="p-2 bg-zinc-50 rounded-lg group-hover:bg-emerald-50 transition-colors">
                          <Paperclip size={16} className="text-zinc-400 group-hover:text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-zinc-900 truncate">exame_imagem_{i}.pdf</p>
                          <p className="text-[10px] text-zinc-500">2.4 MB</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Linha do Tempo</p>
                  <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-zinc-100">
                    {[
                      { date: '06/03 09:15', title: 'Encaminhamento Criado', user: 'Dr. Silva', icon: <Plus size={12} /> },
                      { date: '06/03 10:30', title: 'Triagem Iniciada', user: 'Dra. Maria', icon: <Stethoscope size={12} /> },
                    ].map((event, i) => (
                      <div key={i} className="relative pl-8">
                        <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center z-10">
                          <div className="w-1 h-1 rounded-full bg-emerald-500" />
                        </div>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-bold text-zinc-900">{event.title}</p>
                            <p className="text-[10px] text-zinc-500">por {event.user}</p>
                          </div>
                          <span className="text-[10px] font-bold text-zinc-400">{event.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-zinc-50 border-t border-zinc-100 grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setShowTriageModal(true)}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  <Stethoscope size={16} /> Iniciar Triagem
                </button>
                <button 
                  onClick={() => setShowScheduleModal(true)}
                  className="px-4 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                >
                  <Calendar size={16} /> Agendar Sessão
                </button>
                <button 
                  onClick={() => setShowCreateCaseModal(true)}
                  className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Activity size={16} /> Criar Caso
                </button>
                <button className="px-4 py-2.5 bg-white border border-zinc-200 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-2">
                  <X size={16} /> Recusar/Cancelar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Triage Modal */}
      <AnimatePresence>
        {showTriageModal && (
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
                    <Stethoscope size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900">Iniciar Triagem</h3>
                </div>
                <button onClick={() => setShowTriageModal(false)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Severidade Confirmada</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Leve', 'Moderada', 'Alta'].map(s => (
                      <button 
                        key={s} 
                        onClick={() => setConfirmedSeverity(s)}
                        className={`px-3 py-2 border rounded-xl text-xs font-bold transition-all ${
                          confirmedSeverity === s 
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                            : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-emerald-500'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Escala de Dor (0-10)</label>
                    <span className="text-lg font-black text-blue-600">{painScale}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    value={painScale} 
                    onChange={(e) => setPainScale(parseInt(e.target.value))}
                    className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Conduta Inicial</label>
                  <textarea rows={3} placeholder="Descreva a conduta inicial..." className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Próximo Passo</label>
                  <select className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                    <option>Criar Caso (Tratamento)</option>
                    <option>Agendar Sessão Avulsa</option>
                    <option>Encaminhar ao Médico</option>
                  </select>
                </div>
              </div>
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setShowTriageModal(false)} className="px-6 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl transition-colors">Cancelar</button>
                <button onClick={() => setShowTriageModal(false)} className="px-8 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">Salvar Triagem</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
                    <Calendar size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900">Agendar Sessão</h3>
                </div>
                <button onClick={() => setShowScheduleModal(false)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Data</label>
                    <input type="date" className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Hora</label>
                    <input type="time" className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Profissional</label>
                  <select className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20">
                    <option>Dr. Silva</option>
                    <option>Dra. Maria</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Local</label>
                  <input type="text" placeholder="Sala / Unidade" className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20" />
                </div>
              </div>
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setShowScheduleModal(false)} className="px-6 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl transition-colors">Cancelar</button>
                <button onClick={() => setShowScheduleModal(false)} className="px-8 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20">Agendar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Case Modal */}
      <AnimatePresence>
        {showCreateCaseModal && (
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
                    <Activity size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900">Criar Caso de Tratamento</h3>
                </div>
                <button onClick={() => setShowCreateCaseModal(false)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Objetivo do Tratamento</label>
                  <input type="text" placeholder="Ex: Redução de dor lombar crônica" className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Frequência</label>
                    <select className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <option>1x por semana</option>
                      <option>2x por semana</option>
                      <option>3x por semana</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Previsão de Sessões</label>
                    <input type="number" defaultValue="8" className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Status Inicial</label>
                  <div className="flex gap-2">
                    {['Ativo', 'Em tratamento'].map(s => (
                      <button key={s} className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold hover:border-emerald-500 transition-all">{s}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setShowCreateCaseModal(false)} className="px-6 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl transition-colors">Cancelar</button>
                <button onClick={() => setShowCreateCaseModal(false)} className="px-8 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20">Criar Caso</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
