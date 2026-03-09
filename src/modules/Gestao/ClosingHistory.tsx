import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, RotateCcw, Download, Eye, 
  User, Calendar, MessageSquare, X, 
  AlertCircle, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { ClosingMonth, ClosingStatus } from './types';

interface ClosingHistoryProps {
  history: ClosingMonth[];
  onReopen: (monthId: string, reason: string, modules: string[]) => void;
}

export const ClosingHistory: React.FC<ClosingHistoryProps> = ({
  history,
  onReopen
}) => {
  const [selectedMonth, setSelectedMonth] = useState<ClosingMonth | null>(null);
  const [reopenReason, setReopenReason] = useState('');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const modules = [
    'Aula + Presença', 'Queixas', 'Fisioterapia', 
    'Absenteísmo', 'Ergonomia', 'NR1', 
    'Campanhas', 'Plano de Ação'
  ];

  const getStatusBadge = (status: ClosingStatus) => {
    switch (status) {
      case 'CLOSED': return <span className="px-3 py-1 bg-zinc-800 text-white rounded-full text-[10px] font-black uppercase">Fechado</span>;
      case 'REOPENED': return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black uppercase">Reaberto</span>;
      default: return null;
    }
  };

  const handleReopen = () => {
    if (selectedMonth && reopenReason) {
      onReopen(selectedMonth.id, reopenReason, selectedModules);
      setSelectedMonth(null);
      setReopenReason('');
      setSelectedModules([]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-zinc-200">
          <History size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Histórico & Reabertura</h2>
          <p className="text-sm text-zinc-500">Consulte fechamentos passados e gerencie reaberturas auditadas.</p>
        </div>
      </div>

      <div className="bg-white rounded-[48px] border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Mês</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Fechado Por</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Data Fechamento</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-zinc-400" />
                      <span className="text-sm font-bold text-zinc-900">{item.month}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400"><User size={14} /></div>
                      <span className="text-sm text-zinc-600 font-medium">{item.closed_by || '-'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-zinc-500">
                    {item.closed_at ? new Date(item.closed_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-zinc-400 hover:text-zinc-900 transition-all" title="Ver Pacote"><Eye size={18} /></button>
                      <button className="p-2 text-zinc-400 hover:text-zinc-900 transition-all" title="Baixar"><Download size={18} /></button>
                      {item.status === 'CLOSED' && (
                        <button 
                          onClick={() => setSelectedMonth(item)}
                          className="p-2 text-zinc-400 hover:text-orange-600 transition-all" 
                          title="Reabrir"
                        >
                          <RotateCcw size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reopen Modal */}
      <AnimatePresence>
        {selectedMonth && (
          <div className="fixed inset-0 z-[110] bg-zinc-900/90 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-10 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100">
                    <RotateCcw size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900">Reabrir Mês: {selectedMonth.month}</h2>
                    <p className="text-zinc-500 text-sm">Esta ação é auditada e requer justificativa obrigatória.</p>
                  </div>
                </div>
                <button onClick={() => setSelectedMonth(null)} className="p-3 hover:bg-zinc-100 rounded-2xl transition-colors text-zinc-400">
                  <X size={28} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                <div className="p-6 bg-rose-50 border border-rose-100 rounded-[32px] flex items-start gap-4">
                  <ShieldAlert size={24} className="text-rose-600 mt-1" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-rose-900">Atenção: Impacto na Integridade</p>
                    <p className="text-xs text-rose-600 leading-relaxed">
                      Ao reabrir um mês, os dados poderão ser alterados, o que pode invalidar relatórios já entregues ao cliente.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Módulos para Destravar</label>
                  <div className="grid grid-cols-2 gap-3">
                    {modules.map((mod) => (
                      <label key={mod} className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 cursor-pointer hover:bg-white hover:border-orange-500/50 transition-all group">
                        <input 
                          type="checkbox" 
                          checked={selectedModules.includes(mod)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedModules([...selectedModules, mod]);
                            else setSelectedModules(selectedModules.filter(m => m !== mod));
                          }}
                          className="w-4 h-4 rounded border-zinc-300 text-orange-600 focus:ring-orange-500" 
                        />
                        <span className="text-sm font-bold text-zinc-600 group-hover:text-zinc-900">{mod}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <MessageSquare size={14} /> Motivo da Reabertura (Obrigatório)
                  </label>
                  <textarea 
                    rows={4}
                    value={reopenReason}
                    onChange={(e) => setReopenReason(e.target.value)}
                    placeholder="Descreva detalhadamente por que este mês precisa ser reaberto..."
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div className="p-10 bg-zinc-50 border-t border-zinc-100 flex items-center gap-4">
                <button onClick={() => setSelectedMonth(null)} className="flex-1 py-4 bg-white border border-zinc-200 text-zinc-600 rounded-2xl font-bold hover:bg-zinc-100 transition-all">Cancelar</button>
                <button 
                  onClick={handleReopen}
                  disabled={!reopenReason || selectedModules.length === 0}
                  className="flex-[2] py-4 bg-orange-600 text-white rounded-2xl font-bold text-lg hover:bg-orange-700 shadow-xl shadow-orange-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RotateCcw size={20} /> Confirmar Reabertura
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
