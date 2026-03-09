import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Plus, CheckCircle2, ArrowRight, ArrowLeft, 
  Save, Camera, ClipboardList, ShieldCheck, AlertTriangle
} from 'lucide-react';
import { AdmissionTemplate, AdmissionEvaluation, EvaluationResult } from './types';

interface NewEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (evaluation: any) => void;
  templates: AdmissionTemplate[];
  units: any[];
}

export const NewEvaluationModal: React.FC<NewEvaluationModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  templates, 
  units 
}) => {
  const [step, setStep] = useState(1);
  const [newEval, setNewEval] = useState({
    unit_id: '',
    sector_id: '',
    role_name: '',
    template_id: '',
    evaluation_date: new Date().toISOString().split('T')[0],
    result: 'RECOMMENDED' as EvaluationResult,
    reasons: [] as string[],
    scores: {} as Record<string, any>,
    notes: ''
  });

  const selectedTemplate = templates.find(t => t.id === newEval.template_id);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setNewEval({
        unit_id: '',
        sector_id: '',
        role_name: '',
        template_id: '',
        evaluation_date: new Date().toISOString().split('T')[0],
        result: 'RECOMMENDED',
        reasons: [],
        scores: {},
        notes: ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (status: 'DRAFT' | 'COMPLETED') => {
    onSave({ ...newEval, status });
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] bg-zinc-900/90 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-900">Nova Avaliação</h2>
                <p className="text-zinc-500 text-sm">Registro cinesiofuncional admissional.</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-zinc-100 rounded-2xl transition-colors text-zinc-400"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {/* Steps Indicator */}
            <div className="flex items-center justify-center gap-4 mb-12">
              {[1, 2].map((s) => (
                <React.Fragment key={s}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    step === s ? 'bg-emerald-600 text-white scale-110 shadow-lg shadow-emerald-200' : 
                    step > s ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-100 text-zinc-400'
                  }`}>
                    {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                  </div>
                  {s < 2 && <div className={`w-12 h-0.5 rounded-full ${step > s ? 'bg-emerald-600' : 'bg-zinc-100'}`} />}
                </React.Fragment>
              ))}
            </div>

            {step === 1 ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-700">Unidade</label>
                    <select 
                      value={newEval.unit_id}
                      onChange={(e) => setNewEval({ ...newEval, unit_id: e.target.value })}
                      className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="">Selecione...</option>
                      {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-700">Setor</label>
                    <select 
                      value={newEval.sector_id}
                      onChange={(e) => setNewEval({ ...newEval, sector_id: e.target.value })}
                      className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="">Selecione...</option>
                      <option value="toyota-montagem">Montagem Cross</option>
                      <option value="toyota-logistica">Logística</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-700">Função / Cargo</label>
                  <select 
                    value={newEval.template_id}
                    onChange={(e) => {
                      const tpl = templates.find(t => t.id === e.target.value);
                      setNewEval({ ...newEval, template_id: e.target.value, role_name: tpl?.role_name || '' });
                    }}
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="">Selecione a função...</option>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.role_name}</option>)}
                  </select>
                  {selectedTemplate && (
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest ml-1">
                      Template v{selectedTemplate.version} carregado automaticamente
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-700">Data da Avaliação</label>
                  <input 
                    type="date" 
                    value={newEval.evaluation_date}
                    onChange={(e) => setNewEval({ ...newEval, evaluation_date: e.target.value })}
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <button 
                  onClick={() => setStep(2)}
                  disabled={!newEval.unit_id || !newEval.sector_id || !newEval.template_id}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Próximo Passo
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <div className="p-6 bg-zinc-50 rounded-[32px] border border-zinc-100">
                    <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <ClipboardList size={14} /> Formulário do Template
                    </h4>
                    <div className="space-y-6">
                      {selectedTemplate?.fields.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <label className="text-sm font-bold text-zinc-700">{field.label}</label>
                          {field.type === 'number' ? (
                            <input 
                              type="number" 
                              placeholder="Score / Valor"
                              className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm"
                              onChange={(e) => setNewEval({ ...newEval, scores: { ...newEval.scores, [field.label]: e.target.value }})}
                            />
                          ) : field.type === 'boolean' ? (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setNewEval({ ...newEval, scores: { ...newEval.scores, [field.label]: true }})}
                                className={`flex-1 py-3 rounded-xl border-2 font-bold text-xs transition-all ${newEval.scores[field.label] === true ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-zinc-100 text-zinc-400'}`}
                              >
                                Sim
                              </button>
                              <button 
                                onClick={() => setNewEval({ ...newEval, scores: { ...newEval.scores, [field.label]: false }})}
                                className={`flex-1 py-3 rounded-xl border-2 font-bold text-xs transition-all ${newEval.scores[field.label] === false ? 'border-rose-600 bg-rose-50 text-rose-700' : 'border-zinc-100 text-zinc-400'}`}
                              >
                                Não
                              </button>
                            </div>
                          ) : (
                            <input 
                              type="text" 
                              className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm"
                              onChange={(e) => setNewEval({ ...newEval, scores: { ...newEval.scores, [field.label]: e.target.value }})}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Resultado Final</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'RECOMMENDED', label: 'Recomendado', color: 'emerald' },
                        { id: 'RESTRICTED', label: 'Restrição', color: 'amber' },
                        { id: 'NOT_RECOMMENDED', label: 'Não Recomendado', color: 'rose' }
                      ].map((r) => (
                        <button 
                          key={r.id}
                          onClick={() => setNewEval({ ...newEval, result: r.id as any })}
                          className={`py-4 rounded-2xl border-2 font-bold text-[10px] uppercase transition-all ${
                            newEval.result === r.id ? 
                            (r.id === 'RECOMMENDED' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 
                             r.id === 'RESTRICTED' ? 'border-amber-600 bg-amber-50 text-amber-700' : 
                             'border-rose-600 bg-rose-50 text-rose-700') : 
                            'border-zinc-100 text-zinc-400 hover:bg-zinc-50'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(newEval.result === 'RESTRICTED' || newEval.result === 'NOT_RECOMMENDED') && (
                    <div className="space-y-3">
                      <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <AlertTriangle size={14} className="text-amber-500" /> Motivos (Obrigatório)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(selectedTemplate?.reasons || ['Dor lombar', 'Lesão ombro', 'Limitação mobilidade', 'Histórico cirurgia']).map((reason) => (
                          <button 
                            key={reason}
                            onClick={() => {
                              const exists = newEval.reasons.includes(reason);
                              setNewEval({ 
                                ...newEval, 
                                reasons: exists ? newEval.reasons.filter(r => r !== reason) : [...newEval.reasons, reason] 
                              });
                            }}
                            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
                              newEval.reasons.includes(reason) ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100'
                            }`}
                          >
                            {reason}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Observações</label>
                    <textarea 
                      rows={3}
                      value={newEval.notes}
                      onChange={(e) => setNewEval({ ...newEval, notes: e.target.value })}
                      placeholder="Detalhes adicionais da avaliação..."
                      className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Anexo (Laudo/Foto)</label>
                    <div className="p-8 border-2 border-dashed border-zinc-200 rounded-[32px] flex flex-col items-center justify-center gap-3 text-zinc-400 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all cursor-pointer group">
                      <Camera className="w-8 h-8 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold uppercase tracking-wider">Clique para anexar</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="px-6 py-4 bg-zinc-100 text-zinc-600 rounded-2xl font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleSave('DRAFT')}
                    className="flex-1 py-4 bg-white border border-zinc-200 text-zinc-600 rounded-2xl font-bold hover:bg-zinc-50 transition-all"
                  >
                    Salvar Rascunho
                  </button>
                  <button 
                    onClick={() => handleSave('COMPLETED')}
                    disabled={(newEval.result !== 'RECOMMENDED' && newEval.reasons.length === 0)}
                    className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    Salvar e Concluir
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
