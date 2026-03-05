import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronRight, 
  Plus, 
  Calendar, 
  MapPin, 
  Activity, 
  Stethoscope, 
  AlertCircle,
  Paperclip,
  Edit3,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  ArrowRight,
  X,
  History,
  ShieldCheck,
  FileText,
  ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  EditComplaintModal, 
  UpdateStatusModal, 
  ReferralModal, 
  DeleteComplaintModal 
} from '../components/ComplaintModals.js';

interface Complaint {
  id: string;
  date: string;
  type: 'MOMENTARY' | 'AMBULATORY';
  unit: string;
  sector: string;
  body_part: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'TRACKING' | 'REFERRED' | 'RESOLVED' | 'RECURRENT' | 'ESCALATED';
  is_recurrent: boolean;
  description: string;
  initial_action: string[];
  creator: string;
}

export function ComplaintsList({ initialFilters }: { initialFilters?: any }) {
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: '1',
      date: '2026-03-04 14:30',
      type: 'MOMENTARY',
      unit: 'Unidade Sorocaba',
      sector: 'Montagem Cross',
      body_part: 'Lombar',
      severity: 'MEDIUM',
      status: 'TRACKING',
      is_recurrent: false,
      description: 'Dor leve ao final do turno após movimentação de carga.',
      initial_action: ['Orientação postural', 'Alongamento'],
      creator: 'Ricardo Prof'
    },
    {
      id: '2',
      date: '2026-03-04 10:15',
      type: 'AMBULATORY',
      unit: 'Unidade Sorocaba',
      sector: 'Logística',
      body_part: 'Ombro',
      severity: 'HIGH',
      status: 'REFERRED',
      is_recurrent: true,
      description: 'Dor aguda recorrente no ombro direito.',
      initial_action: ['Encaminhamento Fisioterapia'],
      creator: 'Ana Saúde'
    }
  ]);

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'bg-emerald-500';
      case 'MEDIUM': return 'bg-amber-500';
      case 'HIGH': return 'bg-red-500';
      case 'CRITICAL': return 'bg-red-900';
      default: return 'bg-zinc-300';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN': return { label: 'Aberta', color: 'bg-zinc-100 text-zinc-600' };
      case 'TRACKING': return { label: 'Em Acompanhamento', color: 'bg-blue-100 text-blue-600' };
      case 'REFERRED': return { label: 'Encaminhada', color: 'bg-purple-100 text-purple-600' };
      case 'RESOLVED': return { label: 'Resolvida', color: 'bg-emerald-100 text-emerald-600' };
      case 'RECURRENT': return { label: 'Recorrente', color: 'bg-orange-100 text-orange-600' };
      case 'ESCALATED': return { label: 'Absenteísmo', color: 'bg-red-100 text-red-600' };
      default: return { label: status, color: 'bg-zinc-100 text-zinc-600' };
    }
  };

  const getTypeBadge = (type: string) => {
    return type === 'MOMENTARY' 
      ? { label: 'Momentânea', color: 'bg-blue-50 text-blue-600 border-blue-100' }
      : { label: 'Ambulatorial', color: 'bg-purple-50 text-purple-600 border-purple-100' };
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por setor, estrutura ou descrição..." 
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <select className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none">
          <option>Todos os Tipos</option>
          <option>Momentânea</option>
          <option>Ambulatorial</option>
        </select>
        <select className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none">
          <option>Todos os Status</option>
          <option>Aberta</option>
          <option>Em Acompanhamento</option>
          <option>Resolvida</option>
        </select>
        <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-xl transition-colors border border-zinc-200">
          <Filter size={20} />
        </button>
        <button 
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all"
        >
          <Plus size={18} />
          Nova Queixa
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Setor / Unidade</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Estrutura</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Sev.</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {complaints.map((complaint) => {
                const status = getStatusBadge(complaint.status);
                const type = getTypeBadge(complaint.type);
                return (
                  <tr 
                    key={complaint.id} 
                    onClick={() => setSelectedComplaint(complaint)}
                    className="hover:bg-zinc-50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-zinc-900">{complaint.date.split(' ')[0]}</span>
                        <span className="text-[10px] text-zinc-400">{complaint.date.split(' ')[1]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${type.color}`}>
                        {type.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-zinc-900">{complaint.sector}</span>
                        <span className="text-[10px] text-zinc-400">{complaint.unit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-zinc-700">{complaint.body_part}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`w-2.5 h-2.5 rounded-full ${getSeverityColor(complaint.severity)}`} />
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedComplaint && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedComplaint(null)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto custom-scrollbar"
            >
              <div className="p-6 border-b border-zinc-100 sticky top-0 bg-white z-10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${selectedComplaint.type === 'MOMENTARY' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                    {selectedComplaint.type === 'MOMENTARY' ? <AlertCircle size={20} /> : <Stethoscope size={20} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">{selectedComplaint.body_part}</h3>
                    <p className="text-xs text-zinc-400 uppercase font-bold tracking-wider">{selectedComplaint.type === 'MOMENTARY' ? 'Queixa Momentânea' : 'Queixa Ambulatorial'}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedComplaint(null)} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* Header Info */}
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(selectedComplaint.status).color}`}>
                    {getStatusBadge(selectedComplaint.status).label}
                  </span>
                  <div className="flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                    <div className={`w-2 h-2 rounded-full ${getSeverityColor(selectedComplaint.severity)}`} />
                    Severidade: {selectedComplaint.severity}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 rounded-full text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                    <Calendar size={12} />
                    {selectedComplaint.date}
                  </div>
                </div>

                {/* Location */}
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center gap-4">
                  <div className="p-2 bg-white rounded-xl text-zinc-400 shadow-sm">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Localização</p>
                    <p className="text-sm font-bold text-zinc-900">{selectedComplaint.sector} • {selectedComplaint.unit}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Registro e Conduta</h4>
                  <div className="p-4 bg-white border border-zinc-100 rounded-2xl space-y-4 shadow-sm">
                    <div>
                      <p className="text-xs text-zinc-400 mb-1">Descrição</p>
                      <p className="text-sm text-zinc-700 leading-relaxed">{selectedComplaint.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedComplaint.initial_action.map((action, i) => (
                        <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg border border-emerald-100">
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Evolução do Caso</h4>
                  <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-100">
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center border-4 border-white">
                        <CheckCircle2 size={12} />
                      </div>
                      <p className="text-xs font-bold text-zinc-900">Resolvida</p>
                      <p className="text-[10px] text-zinc-400">12/03/2026 • Por Ricardo Prof</p>
                    </div>
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center border-4 border-white">
                        <ExternalLink size={12} />
                      </div>
                      <p className="text-xs font-bold text-zinc-900">Encaminhada para Fisioterapia</p>
                      <p className="text-[10px] text-zinc-400">08/03/2026 • Por Ana Saúde</p>
                    </div>
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center border-4 border-white">
                        <Clock size={12} />
                      </div>
                      <p className="text-xs font-bold text-zinc-900">Em acompanhamento</p>
                      <p className="text-[10px] text-zinc-400">06/03/2026 • Por Ricardo Prof</p>
                    </div>
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1 w-6 h-6 bg-zinc-100 text-zinc-400 rounded-full flex items-center justify-center border-4 border-white">
                        <Plus size={12} />
                      </div>
                      <p className="text-xs font-bold text-zinc-900">Queixa registrada</p>
                      <p className="text-[10px] text-zinc-400">04/03/2026 • Por Ricardo Prof</p>
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Vínculos</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <button className="flex items-center justify-between p-3 bg-zinc-50 hover:bg-zinc-100 rounded-xl border border-zinc-100 transition-colors group">
                      <div className="flex items-center gap-3">
                        <Activity size={16} className="text-purple-600" />
                        <span className="text-xs font-bold text-zinc-700">Tratamento Fisioterápico</span>
                      </div>
                      <ChevronRight size={14} className="text-zinc-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="flex items-center justify-between p-3 bg-zinc-50 hover:bg-zinc-100 rounded-xl border border-zinc-100 transition-colors group">
                      <div className="flex items-center gap-3">
                        <ClipboardList size={16} className="text-emerald-600" />
                        <span className="text-xs font-bold text-zinc-700">Plano de Ação #124</span>
                      </div>
                      <ChevronRight size={14} className="text-zinc-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button 
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center justify-center gap-2 py-3 bg-zinc-900 text-white rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-all"
                  >
                    <Edit3 size={18} />
                    Editar
                  </button>
                  <button 
                    onClick={() => setShowStatusModal(true)}
                    className="flex items-center justify-center gap-2 py-3 border border-zinc-200 text-zinc-600 rounded-2xl text-sm font-bold hover:bg-zinc-50 transition-all"
                  >
                    <History size={18} />
                    Evoluir
                  </button>
                  <button 
                    onClick={() => setShowReferralModal(true)}
                    className="flex items-center justify-center gap-2 py-3 bg-purple-600 text-white rounded-2xl text-sm font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
                  >
                    <ExternalLink size={18} />
                    Encaminhar
                  </button>
                  <button 
                    onClick={() => setShowStatusModal(true)}
                    className="flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle2 size={18} />
                    Resolver
                  </button>
                  <button 
                    onClick={() => setShowDeleteModal(true)}
                    className="col-span-2 flex items-center justify-center gap-2 py-3 text-red-600 hover:bg-red-50 rounded-2xl text-sm font-bold transition-all"
                  >
                    <Trash2 size={18} />
                    Excluir Registro
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modals */}
      <EditComplaintModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        complaint={selectedComplaint} 
      />
      <UpdateStatusModal 
        isOpen={showStatusModal} 
        onClose={() => setShowStatusModal(false)} 
        complaint={selectedComplaint} 
      />
      <ReferralModal 
        isOpen={showReferralModal} 
        onClose={() => setShowReferralModal(false)} 
        complaint={selectedComplaint} 
      />
      <DeleteComplaintModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        complaint={selectedComplaint} 
      />

      {/* New Complaint Modal */}
      <AnimatePresence>
        {showNewModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] w-full max-w-xl overflow-hidden shadow-2xl"
            >
              <div className="p-5 border-b border-zinc-100 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">Novo Registro de Queixa</h3>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider mt-0.5">Lançamento Rápido</p>
                </div>
                <button onClick={() => setShowNewModal(false)} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Tipo de Queixa</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="p-2.5 border-2 border-blue-500 bg-blue-50 text-blue-700 rounded-2xl text-[10px] font-bold flex flex-col items-center gap-1.5">
                        <AlertCircle size={18} />
                        Momentânea
                      </button>
                      <button className="p-2.5 border-2 border-zinc-100 bg-zinc-50 text-zinc-400 rounded-2xl text-[10px] font-bold flex flex-col items-center gap-1.5 hover:border-purple-200 hover:text-purple-600 transition-all">
                        <Stethoscope size={18} />
                        Ambulatorial
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Severidade</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button className="p-2.5 border-2 border-emerald-500 bg-emerald-50 text-emerald-700 rounded-xl text-[9px] font-bold uppercase">Leve</button>
                      <button className="p-2.5 border-2 border-zinc-100 bg-zinc-50 text-zinc-400 rounded-xl text-[9px] font-bold uppercase">Média</button>
                      <button className="p-2.5 border-2 border-zinc-100 bg-zinc-50 text-zinc-400 rounded-xl text-[9px] font-bold uppercase">Alta</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Unidade</label>
                    <select className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <option>Unidade Sorocaba</option>
                      <option>Unidade Indaiatuba</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Setor</label>
                    <select className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <option>Montagem Cross</option>
                      <option>Logística</option>
                      <option>Pintura</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Estrutura Corporal</label>
                    <select className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <option>Lombar</option>
                      <option>Ombro</option>
                      <option>Pescoço</option>
                      <option>Punho</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Turno</label>
                    <select className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <option>1º Turno</option>
                      <option>2º Turno</option>
                      <option>3º Turno</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Descrição e Conduta</label>
                  <textarea 
                    placeholder="Descreva brevemente a queixa e a conduta inicial..."
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 min-h-[80px]"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white rounded-lg text-zinc-400 shadow-sm">
                      <Paperclip size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500">Anexar evidência (foto)</span>
                  </div>
                  <button className="px-3 py-1 bg-white border border-zinc-200 rounded-lg text-[10px] font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
                    Upload
                  </button>
                </div>
              </div>

              <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button 
                  onClick={() => setShowNewModal(false)}
                  className="px-5 py-2 text-zinc-600 text-xs font-bold hover:bg-zinc-200 rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button className="px-7 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20">
                  Salvar Registro
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
