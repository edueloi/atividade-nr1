import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  LayoutGrid, 
  MoreVertical, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  ClipboardList, 
  MessageSquare, 
  Image as ImageIcon,
  Copy,
  Trash2,
  FileText,
  Calendar,
  User,
  Activity,
  ShieldCheck,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

interface Evaluation {
  id: string;
  date: string;
  sector: string;
  post: string;
  type: 'Biomecânica' | 'Checklist' | 'Visita';
  risk: 'low' | 'medium' | 'high';
  status: 'Rascunho' | 'Concluída' | 'Revisada';
  score: number;
}

const mockEvaluations: Evaluation[] = [
  { id: '1', date: '04/03/2026', sector: 'Montagem Final', post: 'Posto 04', type: 'Biomecânica', risk: 'high', status: 'Rascunho', score: 82 },
  { id: '2', date: '02/03/2026', sector: 'Logística', post: 'Recebimento', type: 'Checklist', risk: 'medium', status: 'Concluída', score: 45 },
  { id: '3', date: '28/02/2026', sector: 'Pintura', post: 'Cabine 01', type: 'Visita', risk: 'low', status: 'Revisada', score: 15 },
  { id: '4', date: '25/02/2026', sector: 'Solda', post: 'Célula Robotizada', type: 'Biomecânica', risk: 'medium', status: 'Concluída', score: 52 },
];

interface ErgoPostEvaluationsProps {
  onOpenSector: (sectorId: string) => void;
}

export function ErgoPostEvaluations({ onOpenSector }: ErgoPostEvaluationsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEval, setSelectedEval] = useState<Evaluation | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showConcludeModal, setShowConcludeModal] = useState(false);

  const getRiskColor = (risk: Evaluation['risk']) => {
    switch (risk) {
      case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'high': return 'text-red-600 bg-red-50 border-red-100';
    }
  };

  const getStatusColor = (status: Evaluation['status']) => {
    switch (status) {
      case 'Rascunho': return 'text-zinc-500 bg-zinc-100';
      case 'Concluída': return 'text-emerald-600 bg-emerald-50';
      case 'Revisada': return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar posto ou setor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-xl transition-colors border border-zinc-200">
            <Filter size={20} />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-bold text-sm hover:bg-zinc-50 transition-colors flex items-center gap-2">
            <LayoutGrid size={18} />
            Templates
          </button>
          <button className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-bold text-sm hover:bg-zinc-50 transition-colors flex items-center gap-2">
            <Download size={18} />
            Exportar
          </button>
          <button 
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Nova Avaliação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm h-fit">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-200">
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Setor / Posto</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Risco</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {mockEvaluations.map((evalItem) => (
                  <tr 
                    key={evalItem.id}
                    onClick={() => setSelectedEval(evalItem)}
                    className={`group hover:bg-zinc-50/80 transition-colors cursor-pointer ${selectedEval?.id === evalItem.id ? 'bg-emerald-50/50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-zinc-600">{evalItem.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onOpenSector('1'); }}
                          className="text-sm font-bold text-zinc-900 hover:text-emerald-600 transition-colors text-left"
                        >
                          {evalItem.sector}
                        </button>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase">{evalItem.post}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-zinc-600">{evalItem.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRiskColor(evalItem.risk)}`}>
                        {evalItem.risk.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(evalItem.status)}`}>
                        {evalItem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-400">
                          <MoreVertical size={18} />
                        </button>
                        <ChevronRight size={18} className={`text-zinc-300 transition-transform ${selectedEval?.id === evalItem.id ? 'translate-x-1 text-emerald-600' : ''}`} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Drawer (Right Side) */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedEval ? (
              <motion.div 
                key={selectedEval.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm h-full flex flex-col"
              >
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(selectedEval.status)}`}>
                        {selectedEval.status}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">{selectedEval.type}</span>
                    </div>
                    <h4 className="text-lg font-bold text-zinc-900">{selectedEval.post}</h4>
                    <p className="text-xs text-zinc-500">{selectedEval.sector}</p>
                  </div>
                  <button onClick={() => setSelectedEval(null)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                    <X size={18} className="text-zinc-400" />
                  </button>
                </div>

                <div className="p-6 flex-1 space-y-8 overflow-y-auto custom-scrollbar">
                  {/* Summary Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <p className="text-[10px] text-zinc-400 uppercase font-bold mb-1">Risco Final</p>
                      <div className="flex items-end gap-2">
                        <h4 className={`text-2xl font-black ${getRiskColor(selectedEval.risk).split(' ')[0]}`}>{selectedEval.score}</h4>
                        <span className="text-[10px] font-bold text-zinc-400 mb-1">/ 100</span>
                      </div>
                    </div>
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <p className="text-[10px] text-zinc-400 uppercase font-bold mb-1">Data</p>
                      <div className="flex items-center gap-2 text-zinc-900 font-bold">
                        <Calendar size={16} className="text-zinc-400" />
                        {selectedEval.date}
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Recomendações Geradas</h5>
                    <div className="space-y-2">
                      {[
                        'Instalar suporte regulável para monitor',
                        'Substituir cadeira atual por modelo ergonômico NR17',
                        'Implementar rodízio de tarefas a cada 2 horas'
                      ].map((rec, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-white border border-zinc-100 rounded-xl shadow-sm">
                          <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 size={12} />
                          </div>
                          <p className="text-xs text-zinc-600 leading-relaxed">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Evidence */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Evidências</h5>
                      <button className="text-[10px] font-bold text-emerald-600 hover:underline">Ver todas</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="aspect-video bg-zinc-100 rounded-xl border border-zinc-200 flex flex-col items-center justify-center text-zinc-400">
                        <ImageIcon size={20} />
                        <span className="text-[10px] mt-1">Antes</span>
                      </div>
                      <div className="aspect-video bg-zinc-100 rounded-xl border border-zinc-200 flex flex-col items-center justify-center text-zinc-400">
                        <ImageIcon size={20} />
                        <span className="text-[10px] mt-1">Depois</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-zinc-50 border-t border-zinc-100 space-y-3">
                  {selectedEval.status === 'Rascunho' ? (
                    <>
                      <button className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/10">
                        <ClipboardList size={18} />
                        Continuar Preenchimento
                      </button>
                      <button 
                        onClick={() => setShowConcludeModal(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 border border-emerald-200 text-emerald-600 bg-white rounded-2xl text-sm font-bold hover:bg-emerald-50 transition-colors"
                      >
                        <CheckCircle2 size={18} />
                        Concluir Avaliação
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-900 text-white rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-colors">
                        <FileText size={18} />
                        Gerar Laudo PDF
                      </button>
                      <button className="w-full flex items-center justify-center gap-2 py-3 border border-zinc-200 text-zinc-600 rounded-2xl text-sm font-bold hover:bg-zinc-50 transition-colors">
                        <ClipboardList size={18} />
                        Criar Plano de Ação
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="bg-white border border-zinc-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-6 h-full shadow-sm">
                <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300">
                  <ClipboardList size={40} />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-zinc-900">Selecione uma avaliação</h4>
                  <p className="text-sm text-zinc-500 max-w-[200px] mx-auto">Clique em uma linha para ver o detalhamento técnico e recomendações.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* New Evaluation Modal */}
      <AnimatePresence>
        {showNewModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                  <Plus size={18} className="text-emerald-600" />
                  Nova Avaliação Ergonômica
                </h3>
                <button onClick={() => setShowNewModal(false)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Unidade</label>
                    <select className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <option>Sorocaba</option>
                      <option>Indaiatuba</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Setor</label>
                    <select className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <option>Montagem Final</option>
                      <option>Logística</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Posto de Trabalho</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Posto 04 - Linha A"
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Tipo de Análise</label>
                    <select className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <option>Biomecânica</option>
                      <option>Checklist NR17</option>
                      <option>Visita Técnica</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Data</label>
                    <input type="date" className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                </div>
              </div>
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setShowNewModal(false)} className="px-6 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl transition-colors">Cancelar</button>
                <button 
                  onClick={() => setShowNewModal(false)}
                  className="px-8 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Iniciar Avaliação
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Conclude Modal */}
        {showConcludeModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-emerald-50/50">
                <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  Concluir Avaliação
                </h3>
                <button onClick={() => setShowConcludeModal(false)} className="p-2 hover:bg-emerald-100 rounded-xl transition-colors text-emerald-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                  <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={20} />
                  <p className="text-xs text-emerald-800 font-medium">Ao concluir, esta avaliação se tornará um documento auditável e não poderá ser editada.</p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                    <span className="text-xs text-zinc-600 font-bold group-hover:text-zinc-900 transition-colors">Atualizar Matriz de Risco automaticamente</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                    <span className="text-xs text-zinc-600 font-bold group-hover:text-zinc-900 transition-colors">Sugerir criação de Plano de Ação (Risco Alto)</span>
                  </label>
                </div>
              </div>
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setShowConcludeModal(false)} className="px-6 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl transition-colors">Cancelar</button>
                <button 
                  onClick={() => setShowConcludeModal(false)}
                  className="px-8 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Confirmar Conclusão
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
