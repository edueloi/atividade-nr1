import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Filter, RefreshCw, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface EvidenceFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EvidenceFiltersDrawer({ isOpen, onClose }: EvidenceFiltersDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[70] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-900 text-white rounded-xl">
                  <Filter size={20} />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">Filtros Avançados</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* Período */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Período de Registro</label>
                <div className="grid grid-cols-2 gap-3">
                  <select className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                    <option>Março / 2026</option>
                    <option>Fevereiro / 2026</option>
                    <option>Janeiro / 2026</option>
                  </select>
                  <select className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                    <option>Todos os dias</option>
                    <option>Última semana</option>
                  </select>
                </div>
              </div>

              {/* Unidade / Setor */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Unidade & Setor</label>
                <div className="space-y-3">
                  <select className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                    <option>Todas as Unidades</option>
                    <option>Unidade 1</option>
                    <option>Unidade 2</option>
                  </select>
                  <select className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                    <option>Todos os Setores</option>
                    <option>Montagem</option>
                    <option>Logística</option>
                    <option>RH</option>
                  </select>
                </div>
              </div>

              {/* Origem */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Origem dos Dados</label>
                <div className="grid grid-cols-2 gap-2">
                  {['NR1', 'Ergonomia', 'Eng', 'Plano de Ação', 'Aula', 'Fisio', 'Absenteísmo', 'Campanhas'].map(origin => (
                    <label key={origin} className="flex items-center gap-2 p-3 bg-zinc-50 border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-100 transition-all">
                      <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                      <span className="text-[10px] font-bold text-zinc-700">{origin}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tipo */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Tipo de Evidência</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Antes', 'Depois', 'Comprovante', 'Campanha', 'Auditoria'].map(type => (
                    <label key={type} className="flex items-center gap-2 p-3 bg-zinc-50 border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-100 transition-all">
                      <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                      <span className="text-[10px] font-bold text-zinc-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Status de Vínculo</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Rascunho', 'Vinculada', 'Aprovada', 'Rejeitada'].map(status => (
                    <label key={status} className="flex items-center gap-2 p-3 bg-zinc-50 border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-100 transition-all">
                      <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                      <span className="text-[10px] font-bold text-zinc-700">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pendentes */}
              <label className="flex items-center gap-4 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl cursor-pointer hover:bg-emerald-100 transition-all">
                <input type="checkbox" className="w-6 h-6 rounded-xl border-emerald-300 text-emerald-600 focus:ring-emerald-500" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-emerald-900">Somente pendentes de evidência</p>
                  <p className="text-[10px] text-emerald-600">Mostra onde falta evidência vinculada</p>
                </div>
              </label>
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex gap-3">
              <button className="flex-1 px-6 py-3 bg-white border border-zinc-200 text-zinc-600 rounded-2xl font-bold text-sm hover:bg-zinc-50 transition-all flex items-center justify-center gap-2">
                <RefreshCw size={18} /> Limpar
              </button>
              <button onClick={onClose} className="flex-1 px-6 py-3 bg-zinc-900 text-white rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20">
                Aplicar Filtros
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
