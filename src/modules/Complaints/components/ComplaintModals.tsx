import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Stethoscope, 
  Activity, 
  Users, 
  Clock, 
  ShieldCheck,
  Send,
  Trash2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface Complaint {
  id: string;
  type: 'MOMENTARY' | 'AMBULATORY';
  unit: string;
  sector: string;
  body_part: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: string;
  description: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint?: Complaint | null;
  onSuccess?: () => void;
}

export function EditComplaintModal({ isOpen, onClose, complaint, onSuccess }: ModalProps) {
  if (!isOpen || !complaint) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-zinc-900">Editar Queixa</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Tipo</label>
              <select defaultValue={complaint.type} className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm">
                <option value="MOMENTARY">Momentânea</option>
                <option value="AMBULATORY">Ambulatorial</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Severidade</label>
              <select defaultValue={complaint.severity} className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm">
                <option value="LOW">Leve</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
                <option value="CRITICAL">Crítica</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase">Descrição</label>
            <textarea 
              defaultValue={complaint.description}
              className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm min-h-[100px]"
            />
          </div>
        </div>

        <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl">Cancelar</button>
          <button onClick={() => { onSuccess?.(); onClose(); }} className="px-8 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">Salvar Alterações</button>
        </div>
      </motion.div>
    </div>
  );
}

export function UpdateStatusModal({ isOpen, onClose, complaint, onSuccess }: ModalProps) {
  const [status, setStatus] = useState(complaint?.status || 'OPEN');

  if (!isOpen || !complaint) return null;

  const statuses = [
    { id: 'OPEN', label: 'Aberta', color: 'bg-zinc-100 text-zinc-600' },
    { id: 'TRACKING', label: 'Em Acompanhamento', color: 'bg-blue-100 text-blue-600' },
    { id: 'RESOLVED', label: 'Resolvida', color: 'bg-emerald-100 text-emerald-600' },
    { id: 'RECURRENT', label: 'Recorrente', color: 'bg-orange-100 text-orange-600' },
    { id: 'ESCALATED', label: 'Escalou para Absenteísmo', color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-zinc-900">Atualizar Status</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase">Novo Status</label>
            <div className="grid grid-cols-1 gap-2">
              {statuses.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStatus(s.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                    status === s.id ? 'border-emerald-500 bg-emerald-50' : 'border-zinc-100 hover:border-zinc-200'
                  }`}
                >
                  <span className={`text-xs font-bold ${status === s.id ? 'text-emerald-700' : 'text-zinc-600'}`}>{s.label}</span>
                  {status === s.id && <CheckCircle2 size={16} className="text-emerald-500" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase">Observação da Evolução</label>
            <textarea 
              placeholder="Descreva o que mudou ou o motivo da atualização..."
              className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-zinc-300 text-emerald-600" />
              <span className="text-xs text-zinc-600">Criar plano de ação sugerido</span>
            </label>
          </div>
        </div>

        <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl">Cancelar</button>
          <button onClick={() => { onSuccess?.(); onClose(); }} className="px-8 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">Salvar Status</button>
        </div>
      </motion.div>
    </div>
  );
}

export function ReferralModal({ isOpen, onClose, complaint, onSuccess }: ModalProps) {
  const [target, setTarget] = useState('FISIO');

  if (!isOpen || !complaint) return null;

  const targets = [
    { id: 'FISIO', label: 'Fisioterapia', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'AMBULATORY', label: 'Ambulatório', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'ERGO', label: 'Ergonomia', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'ABSENTEEISM', label: 'Medicina / Absenteísmo', icon: Users, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-zinc-900">Encaminhar Caso</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase">Destino do Encaminhamento</label>
            <div className="grid grid-cols-1 gap-2">
              {targets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTarget(t.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                    target === t.id ? 'border-emerald-500 bg-emerald-50' : 'border-zinc-100 hover:border-zinc-200'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${t.bg} ${t.color}`}>
                    <t.icon size={18} />
                  </div>
                  <span className={`text-sm font-bold flex-1 ${target === t.id ? 'text-emerald-700' : 'text-zinc-600'}`}>{t.label}</span>
                  {target === t.id && <CheckCircle2 size={16} className="text-emerald-500" />}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Prioridade</label>
              <select className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm">
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Responsável</label>
              <select className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm">
                <option>Automático</option>
                <option>Dra. Juliana (Fisio)</option>
                <option>Dr. Marcos (Med)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase">Observação</label>
            <textarea 
              placeholder="Instruções para o profissional de destino..."
              className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm min-h-[80px]"
            />
          </div>
        </div>

        <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl">Cancelar</button>
          <button onClick={() => { onSuccess?.(); onClose(); }} className="px-8 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">Confirmar</button>
        </div>
      </motion.div>
    </div>
  );
}

export function DeleteComplaintModal({ isOpen, onClose, complaint, onSuccess }: ModalProps) {
  if (!isOpen || !complaint) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Trash2 size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-zinc-900">Excluir Queixa?</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Deseja excluir a queixa do setor <span className="font-bold text-zinc-900">{complaint.sector}</span> ({complaint.body_part})? 
              Esta ação não pode ser desfeita.
            </p>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-left flex gap-3">
            <AlertTriangle size={20} className="text-amber-600 shrink-0" />
            <p className="text-[10px] text-amber-800 font-medium">
              Nota: Se esta queixa já possuir vínculos com absenteísmo ou planos de ação, recomendamos apenas arquivá-la para manter a trilha de auditoria.
            </p>
          </div>
        </div>

        <div className="p-6 bg-zinc-50 border-t border-zinc-100 grid grid-cols-2 gap-3">
          <button onClick={onClose} className="py-3 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl">Cancelar</button>
          <button onClick={() => { onSuccess?.(); onClose(); }} className="py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 shadow-lg shadow-red-500/20">Excluir Permanentemente</button>
        </div>
      </motion.div>
    </div>
  );
}
