import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, FileText, Camera, Download, 
  ExternalLink, RefreshCw, CheckCircle2, 
  Clock, X, Send, Shield, Globe, Lock
} from 'lucide-react';

interface ClosingDeliveryProps {
  onGenerate: (type: string) => void;
  onSendToClient: (packageId: string) => void;
}

export const ClosingDelivery: React.FC<ClosingDeliveryProps> = ({
  onGenerate,
  onSendToClient
}) => {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  const packages = [
    { id: 'p1', type: 'Relatório Mensal Consolidado', format: 'PDF', status: 'READY', date: '2026-03-09 10:00' },
    { id: 'p2', type: 'Relatório Técnico Detalhado', format: 'PDF', status: 'PROCESSING', date: '2026-03-09 10:05' },
    { id: 'p3', type: 'Pacote de Evidências (ZIP)', format: 'ZIP', status: 'READY', date: '2026-03-09 09:45' },
    { id: 'p4', type: 'Link do Dashboard (Somente Leitura)', format: 'LINK', status: 'READY', date: '2026-03-09 08:30' }
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-zinc-200">
            <Package size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">Entrega (Pacote do Cliente)</h2>
            <p className="text-sm text-zinc-500">Gere e envie os pacotes de fechamento mensal sem a necessidade de PPTs.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowGenerateModal(true)}
          className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center gap-2"
        >
          <RefreshCw size={18} /> Gerar Novo Pacote
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white p-8 rounded-[40px] border border-zinc-200 shadow-sm flex flex-col justify-between group hover:border-emerald-500/50 transition-all">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  pkg.format === 'PDF' ? 'bg-rose-50 text-rose-600' : 
                  pkg.format === 'ZIP' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {pkg.format === 'PDF' ? <FileText size={28} /> : pkg.format === 'ZIP' ? <Package size={28} /> : <Globe size={28} />}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${
                    pkg.status === 'READY' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {pkg.status === 'READY' ? 'Pronto' : 'Processando'}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{pkg.format}</span>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-zinc-900 leading-tight">{pkg.type}</h4>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2 flex items-center gap-1">
                  <Clock size={10} /> {pkg.date}
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2">
              {pkg.status === 'READY' ? (
                <>
                  <button className="flex-1 py-3 bg-zinc-900 text-white rounded-xl font-bold text-xs hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
                    <Download size={14} /> Baixar
                  </button>
                  <button 
                    onClick={() => setShowSendModal(true)}
                    className="p-3 bg-white border border-zinc-200 text-zinc-400 hover:text-emerald-600 hover:border-emerald-200 rounded-xl transition-all"
                  >
                    <Send size={18} />
                  </button>
                </>
              ) : (
                <button className="w-full py-3 bg-zinc-50 text-zinc-400 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed">
                  <RefreshCw size={14} className="animate-spin" /> Gerando...
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* History Table */}
      <div className="bg-white rounded-[48px] border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Histórico de Exportações</h3>
          <button className="text-xs font-bold text-emerald-600 hover:underline">Ver tudo</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Data/Hora</th>
                <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tipo</th>
                <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Mês Ref.</th>
                <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {[1, 2, 3].map((i) => (
                <tr key={i} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-8 py-4 text-sm font-bold text-zinc-900">09/03/2026 10:00</td>
                  <td className="px-8 py-4 text-sm text-zinc-600 font-medium">Relatório Mensal Consolidado</td>
                  <td className="px-8 py-4 text-xs font-black text-zinc-400 uppercase tracking-widest">Mar/2026</td>
                  <td className="px-8 py-4">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase">Sucesso</span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-zinc-400 hover:text-zinc-900"><Download size={16} /></button>
                      <button className="p-2 text-zinc-400 hover:text-zinc-900"><ExternalLink size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Modal */}
      <AnimatePresence>
        {showGenerateModal && (
          <div className="fixed inset-0 z-[110] bg-zinc-900/90 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-10 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                    <RefreshCw size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900">Gerar Pacote Mensal</h2>
                    <p className="text-zinc-500 text-sm">Selecione os módulos e o nível de detalhamento.</p>
                  </div>
                </div>
                <button onClick={() => setShowGenerateModal(false)} className="p-3 hover:bg-zinc-100 rounded-2xl transition-colors text-zinc-400">
                  <X size={28} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Mês de Referência</label>
                    <select className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <option>Março / 2026</option>
                      <option>Fevereiro / 2026</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Unidade / Setor</label>
                    <select className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <option>Toda a Unidade</option>
                      <option>Setor Montagem</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Módulos para Incluir</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Aula+Presença', 'Queixas', 'Fisioterapia', 'Absenteísmo', 'Ergonomia', 'NR1', 'Campanhas', 'Plano de Ação'].map((mod) => (
                      <label key={mod} className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 cursor-pointer hover:bg-white hover:border-emerald-500/50 transition-all group">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                        <span className="text-sm font-bold text-zinc-600 group-hover:text-zinc-900">{mod}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Privacidade & Dados</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 cursor-pointer hover:bg-white hover:border-emerald-500/50 transition-all group">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-zinc-900">Ocultar dados sensíveis</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Nomes e CIDs serão anonimizados</p>
                      </div>
                      <Lock size={18} className="text-zinc-300" />
                    </label>
                    <label className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 cursor-pointer hover:bg-white hover:border-emerald-500/50 transition-all group">
                      <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-zinc-900">Incluir evidências (fotos/docs)</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Aumenta o tamanho do pacote final</p>
                      </div>
                      <Camera size={18} className="text-zinc-300" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-10 bg-zinc-50 border-t border-zinc-100 flex items-center gap-4">
                <button onClick={() => setShowGenerateModal(false)} className="flex-1 py-4 bg-white border border-zinc-200 text-zinc-600 rounded-2xl font-bold hover:bg-zinc-100 transition-all">Cancelar</button>
                <button 
                  onClick={() => { onGenerate('FULL'); setShowGenerateModal(false); }}
                  className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw size={20} /> Gerar Pacote
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Send Modal */}
      <AnimatePresence>
        {showSendModal && (
          <div className="fixed inset-0 z-[110] bg-zinc-900/90 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-10 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-zinc-200">
                    <Send size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900">Enviar para Cliente</h2>
                    <p className="text-zinc-500 text-sm">Compartilhe o link seguro do pacote.</p>
                  </div>
                </div>
                <button onClick={() => setShowSendModal(false)} className="p-3 hover:bg-zinc-100 rounded-2xl transition-colors text-zinc-400">
                  <X size={28} />
                </button>
              </div>

              <div className="p-10 space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Destinatários</label>
                  <div className="flex flex-wrap gap-2 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl min-h-[100px]">
                    <span className="px-3 py-1 bg-white border border-zinc-200 rounded-lg text-xs font-bold text-zinc-600 flex items-center gap-2">
                      joao.gestor@cliente.com <X size={12} className="cursor-pointer" />
                    </span>
                    <span className="px-3 py-1 bg-white border border-zinc-200 rounded-lg text-xs font-bold text-zinc-600 flex items-center gap-2">
                      maria.rh@cliente.com <X size={12} className="cursor-pointer" />
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Mensagem Padrão</label>
                  <textarea 
                    rows={4}
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    defaultValue="Olá, segue o pacote de fechamento mensal referente a Março/2026. O link expira em 30 dias."
                  />
                </div>

                <div className="p-6 bg-emerald-50 rounded-[32px] border border-emerald-100 flex flex-col items-center gap-4 text-center">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                    <Shield size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-emerald-900">Link Seguro Gerado</p>
                    <p className="text-xs text-emerald-600 font-medium">https://portal.ergosystem.com/share/abc-123</p>
                  </div>
                  <button className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all">Copiar Link</button>
                </div>
              </div>

              <div className="p-10 bg-zinc-50 border-t border-zinc-100 flex items-center gap-4">
                <button onClick={() => setShowSendModal(false)} className="flex-1 py-4 bg-white border border-zinc-200 text-zinc-600 rounded-2xl font-bold hover:bg-zinc-100 transition-all">Cancelar</button>
                <button 
                  onClick={() => { onSendToClient('p1'); setShowSendModal(false); }}
                  className="flex-[2] py-4 bg-zinc-900 text-white rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-zinc-200"
                >
                  <Send size={20} /> Enviar Pacote
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
