import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  UploadCloud, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  Tag, 
  Link2, 
  MapPin, 
  ClipboardList, 
  Activity, 
  ShieldCheck, 
  Target, 
  User,
  FileText
} from 'lucide-react';

interface NewEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewEvidenceModal({ isOpen, onClose }: NewEvidenceModalProps) {
  const [vincularAgora, setVincularAgora] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-600/20">
                  <PlusCircle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Nova Evidência</h3>
                  <p className="text-xs text-zinc-500 font-medium tracking-wide">Upload de arquivo e metadados</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2.5 hover:bg-zinc-200 rounded-2xl transition-colors">
                <X size={24} className="text-zinc-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              {/* Upload Area */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Arquivo (Foto, PDF ou Documento)</label>
                <div className="border-2 border-dashed border-zinc-200 rounded-[32px] p-12 flex flex-col items-center justify-center text-center gap-4 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UploadCloud size={32} className="text-zinc-400 group-hover:text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-zinc-900">Arraste e solte ou clique para selecionar</p>
                    <p className="text-xs text-zinc-500">PNG, JPG, PDF ou DOC (Máx. 20MB)</p>
                  </div>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3 col-span-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Título da Evidência</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Ajuste de bancada - Depois" 
                    className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
                  />
                </div>

                <div className="space-y-3 col-span-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Descrição (Opcional)</label>
                  <textarea 
                    placeholder="Detalhes sobre o registro..." 
                    rows={3}
                    className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Unidade</label>
                  <select className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all">
                    <option>Unidade 1</option>
                    <option>Unidade 2</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Setor</label>
                  <select className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all">
                    <option>Montagem</option>
                    <option>Logística</option>
                    <option>RH</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Tipo</label>
                  <select className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all">
                    <option>Antes</option>
                    <option>Depois</option>
                    <option>Comprovante</option>
                    <option>Campanha</option>
                    <option>Auditoria</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Origem</label>
                  <select className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all">
                    <option>Plano de Ação</option>
                    <option>NR1</option>
                    <option>Ergonomia</option>
                    <option>Eng</option>
                    <option>Aula</option>
                    <option>Fisio</option>
                    <option>Absenteísmo</option>
                    <option>Campanhas</option>
                  </select>
                </div>

                <div className="space-y-3 col-span-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Tags (Separadas por vírgula)</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Ex: ergonomia, bancada, nr1" 
                      className="w-full pl-12 pr-5 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Vincular Agora Toggle */}
              <div className="p-6 bg-zinc-50 rounded-[32px] border border-zinc-100 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white border border-zinc-200 text-zinc-900 rounded-xl">
                      <Link2 size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">Vincular agora?</p>
                      <p className="text-[10px] text-zinc-500 font-medium">Ligar esta evidência a um plano ou ação</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setVincularAgora(!vincularAgora)}
                    className={`w-12 h-6 rounded-full transition-all relative ${vincularAgora ? 'bg-emerald-600' : 'bg-zinc-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${vincularAgora ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <AnimatePresence>
                  {vincularAgora && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-4 border-t border-zinc-200 overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Vincular a</label>
                          <select className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 focus:outline-none">
                            <option>Plano de Ação</option>
                            <option>Item de Ação</option>
                            <option>Projeto Engenharia</option>
                            <option>Aula / Presença</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Selecionar Item</label>
                          <select className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 focus:outline-none">
                            <option>Plano NR1 - Montagem</option>
                            <option>Ação: Ajustar bancada</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-4">
              <button 
                onClick={onClose}
                className="px-8 py-3.5 text-zinc-600 font-bold text-sm hover:bg-zinc-200 rounded-2xl transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={onClose}
                className="px-10 py-3.5 bg-zinc-900 text-white font-bold text-sm rounded-2xl hover:bg-zinc-800 shadow-xl shadow-zinc-900/20 transition-all flex items-center gap-2"
              >
                Salvar Evidência
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
