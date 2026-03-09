import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Calendar, MapPin, User, ShieldCheck, 
  ClipboardList, FileText, Download, Trash2, 
  Edit3, CheckCircle2, Paperclip, ExternalLink,
  AlertTriangle, Info, ChevronRight
} from 'lucide-react';
import { AdmissionEvaluation } from './types';

interface EvaluationDetailDrawerProps {
  evaluation: AdmissionEvaluation | null;
  onClose: () => void;
  onEdit: (evaluation: AdmissionEvaluation) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const EvaluationDetailDrawer: React.FC<EvaluationDetailDrawerProps> = ({ 
  evaluation, 
  onClose,
  onEdit,
  onComplete,
  onDelete
}) => {
  if (!evaluation) return null;

  const getResultColor = (result: string) => {
    switch (result) {
      case 'RECOMMENDED': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'RESTRICTED': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'NOT_RECOMMENDED': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-zinc-600 bg-zinc-50 border-zinc-100';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex justify-end">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${getResultColor(evaluation.result)}`}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900">{evaluation.role_name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${getResultColor(evaluation.result)}`}>
                    {evaluation.result === 'RECOMMENDED' ? 'Recomendado' : 
                     evaluation.result === 'RESTRICTED' ? 'Restrição' : 'Não Recomendado'}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">v{evaluation.template_version}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-zinc-200 rounded-2xl transition-colors text-zinc-400">
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            {/* Context Info */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Unidade / Setor</p>
                <div className="flex items-center gap-2 text-zinc-900 font-bold">
                  <MapPin size={16} className="text-zinc-400" />
                  {evaluation.unit_name} • {evaluation.sector_name}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Data da Avaliação</p>
                <div className="flex items-center gap-2 text-zinc-900 font-bold">
                  <Calendar size={16} className="text-zinc-400" />
                  {new Date(evaluation.evaluation_date).toLocaleDateString()}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Avaliador</p>
                <div className="flex items-center gap-2 text-zinc-900 font-bold">
                  <User size={16} className="text-zinc-400" />
                  {evaluation.evaluator_name}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                    evaluation.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 
                    evaluation.status === 'DRAFT' ? 'bg-zinc-100 text-zinc-500' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {evaluation.status === 'COMPLETED' ? 'Concluída' : 
                     evaluation.status === 'DRAFT' ? 'Rascunho' : 'Revisão'}
                  </span>
                </div>
              </div>
            </div>

            {/* Answers / Scores */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <ClipboardList size={14} /> Respostas do Template
              </h4>
              <div className="bg-zinc-50 rounded-[32px] border border-zinc-100 overflow-hidden">
                <div className="divide-y divide-zinc-100">
                  {Object.entries(evaluation.scores).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-5">
                      <span className="text-sm font-bold text-zinc-600">{key}</span>
                      <span className={`text-sm font-black ${typeof value === 'boolean' ? (value ? 'text-emerald-600' : 'text-rose-600') : 'text-zinc-900'}`}>
                        {typeof value === 'boolean' ? (value ? 'SIM' : 'NÃO') : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reasons */}
            {evaluation.reasons.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle size={14} className="text-amber-500" /> Motivos de Restrição/Veto
                </h4>
                <div className="flex flex-wrap gap-2">
                  {evaluation.reasons.map((reason, i) => (
                    <span key={i} className="px-4 py-2 bg-rose-50 text-rose-700 rounded-2xl text-xs font-bold border border-rose-100">
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Observations */}
            {evaluation.notes && (
              <div className="space-y-4">
                <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Info size={14} /> Observações
                </h4>
                <div className="p-6 bg-zinc-50 rounded-[32px] border border-zinc-100 text-sm text-zinc-600 leading-relaxed italic">
                  "{evaluation.notes}"
                </div>
              </div>
            )}

            {/* Attachments */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Paperclip size={14} /> Anexos
              </h4>
              {evaluation.attachments.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {evaluation.attachments.map((file) => (
                    <div key={file.id} className="p-4 bg-white border border-zinc-200 rounded-2xl flex items-center justify-between group hover:border-zinc-900 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                          <FileText size={20} />
                        </div>
                        <span className="text-xs font-bold text-zinc-900 truncate max-w-[120px]">{file.name}</span>
                      </div>
                      <button className="p-2 text-zinc-400 hover:text-zinc-900"><Download size={16} /></button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 font-medium italic">Nenhum anexo disponível.</p>
              )}
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <ExternalLink size={14} /> Vínculos
              </h4>
              <div className="space-y-3">
                {evaluation.linked_action_plan_id ? (
                  <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-[32px] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                        <ClipboardList size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-900">Plano de Ação Vinculado</p>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">ID: {evaluation.linked_action_plan_id}</p>
                      </div>
                    </div>
                    <button className="p-2 text-emerald-600 hover:bg-white rounded-xl transition-all">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                ) : (
                  <button className="w-full p-5 bg-zinc-50 border border-dashed border-zinc-200 rounded-[32px] text-zinc-400 text-xs font-bold hover:bg-zinc-100 transition-all flex items-center justify-center gap-2">
                    <PlusCircle size={16} /> Criar Vínculo com Plano de Ação
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex items-center gap-4">
            <button 
              onClick={() => onEdit(evaluation)}
              className="flex-1 py-4 bg-white border border-zinc-200 text-zinc-900 rounded-2xl font-bold text-sm hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Edit3 size={18} /> Editar
            </button>
            {evaluation.status === 'DRAFT' && (
              <button 
                onClick={() => onComplete(evaluation.id)}
                className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-100"
              >
                <CheckCircle2 size={18} /> Concluir
              </button>
            )}
            <button className="p-4 bg-white border border-zinc-200 text-zinc-400 rounded-2xl hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm">
              <Download size={20} />
            </button>
            {evaluation.status === 'DRAFT' && (
              <button 
                onClick={() => onDelete(evaluation.id)}
                className="p-4 bg-white border border-zinc-200 text-zinc-400 rounded-2xl hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const PlusCircle = ({ size }: { size: number }) => <ClipboardList size={size} />;
