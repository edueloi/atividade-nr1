import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Download, 
  History, 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle2,
  Clock,
  X,
  ChevronRight,
  FileBarChart,
  AlertCircle,
  RefreshCw,
  Eye,
  Trash2,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReportJob {
  id: string;
  type: 'executive' | 'technical';
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
  createdAt: string;
  params: {
    cycle: string;
    unit: string;
    includeComparison?: boolean;
    includeActions?: boolean;
    includeEvidence?: boolean;
  };
}

export function NR1Reports() {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedType, setSelectedType] = useState<'executive' | 'technical'>('executive');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<ReportJob[]>([
    {
      id: '1',
      type: 'executive',
      status: 'COMPLETED',
      createdAt: '2026-03-04 14:30',
      params: { cycle: 'Março/2026', unit: 'Sorocaba', includeComparison: true }
    },
    {
      id: '2',
      type: 'technical',
      status: 'COMPLETED',
      createdAt: '2026-03-01 09:15',
      params: { cycle: 'Fevereiro/2026', unit: 'Todas', includeActions: true, includeEvidence: true }
    },
    {
      id: '3',
      type: 'technical',
      status: 'FAILED',
      createdAt: '2026-02-28 16:45',
      params: { cycle: 'Fevereiro/2026', unit: 'Logística' }
    }
  ]);

  const handleOpenModal = (type: 'executive' | 'technical') => {
    setSelectedType(type);
    setShowGenerateModal(true);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate generation process
    setTimeout(() => {
      const newJob: ReportJob = {
        id: Math.random().toString(36).substr(2, 9),
        type: selectedType,
        status: 'COMPLETED',
        createdAt: new Date().toLocaleString('pt-BR').slice(0, 16),
        params: { cycle: 'Março/2026', unit: 'Sorocaba' }
      };
      setHistory([newJob, ...history]);
      setIsGenerating(false);
      setShowGenerateModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Executive Report */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-8 hover:border-emerald-500 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <FileBarChart size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                <FileBarChart size={32} />
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                Ideal para RH / Diretoria
              </span>
            </div>
            <div className="space-y-2 mb-8">
              <h4 className="text-xl font-bold text-zinc-900">Relatório Executivo NR1</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">Visão macro de riscos, adesão e tendências. Dados 100% agregados e anonimizados para tomada de decisão estratégica.</p>
            </div>
            <button 
              onClick={() => handleOpenModal('executive')}
              className="w-full py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
            >
              Gerar Relatório
            </button>
          </div>
        </div>

        {/* Technical Report */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-8 hover:border-zinc-900 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ShieldCheck size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-zinc-900 text-white rounded-2xl">
                <ShieldCheck size={32} />
              </div>
              <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                Ideal para Auditoria / SESMT
              </span>
            </div>
            <div className="space-y-2 mb-8">
              <h4 className="text-xl font-bold text-zinc-900">Relatório Técnico NR1</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">Detalhamento técnico por setor, evidências de planos de ação e trilha de auditoria completa para conformidade legal.</p>
            </div>
            <button 
              onClick={() => handleOpenModal('technical')}
              className="w-full py-3 bg-zinc-900 text-white rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20"
            >
              Gerar Relatório
            </button>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-zinc-900 flex items-center gap-2">
            <History size={18} className="text-zinc-400" />
            Histórico de Relatórios
          </h4>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
              <input type="text" placeholder="Buscar..." className="pl-9 pr-4 py-1.5 bg-zinc-100 border-none rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Relatório</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Parâmetros</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Data de Geração</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {history.map((job) => (
                <tr key={job.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${job.type === 'executive' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-900 text-white'}`}>
                        {job.type === 'executive' ? <FileBarChart size={16} /> : <ShieldCheck size={16} />}
                      </div>
                      <span className="text-sm font-bold text-zinc-900">
                        {job.type === 'executive' ? 'Relatório Executivo' : 'Relatório Técnico'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] font-medium rounded-md">Ciclo: {job.params.cycle}</span>
                      <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] font-medium rounded-md">Unidade: {job.params.unit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-zinc-500">{job.createdAt}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {job.status === 'COMPLETED' ? (
                        <>
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span className="text-xs font-medium text-zinc-600">Concluído</span>
                        </>
                      ) : job.status === 'PROCESSING' ? (
                        <>
                          <RefreshCw size={14} className="text-emerald-500 animate-spin" />
                          <span className="text-xs font-medium text-emerald-600">Processando</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={14} className="text-red-500" />
                          <span className="text-xs font-medium text-red-600">Falhou</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {job.status === 'COMPLETED' ? (
                        <>
                          <button className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Download PDF">
                            <Download size={18} />
                          </button>
                          <button className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all" title="Visualizar">
                            <Eye size={18} />
                          </button>
                        </>
                      ) : job.status === 'FAILED' ? (
                        <button className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Tentar Novamente">
                          <RefreshCw size={18} />
                        </button>
                      ) : null}
                      <button className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className={`p-6 border-b border-zinc-100 flex justify-between items-center ${selectedType === 'executive' ? 'bg-emerald-50/50' : 'bg-zinc-900 text-white'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${selectedType === 'executive' ? 'bg-emerald-100 text-emerald-600' : 'bg-white/10 text-white'}`}>
                    {selectedType === 'executive' ? <FileBarChart size={20} /> : <ShieldCheck size={20} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Configurar {selectedType === 'executive' ? 'Relatório Executivo' : 'Relatório Técnico'}</h3>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${selectedType === 'executive' ? 'text-emerald-600' : 'text-zinc-400'}`}>
                      NR1 Psicossocial
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowGenerateModal(false)} className={`p-2 rounded-xl transition-colors ${selectedType === 'executive' ? 'hover:bg-emerald-100 text-emerald-600' : 'hover:bg-white/10 text-white'}`}>
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Report Content Explanation */}
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-3">
                  <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                    <Info size={14} className="text-emerald-600" />
                    O que este relatório contém?
                  </h4>
                  <ul className="space-y-2">
                    {selectedType === 'executive' ? (
                      <>
                        <li className="text-[11px] text-zinc-600 flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span>Indicadores de adesão e participação por unidade.</span>
                        </li>
                        <li className="text-[11px] text-zinc-600 flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span>Distribuição de níveis de risco psicossocial (Macro).</span>
                        </li>
                        <li className="text-[11px] text-zinc-600 flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span>Comparativos históricos e tendências de bem-estar.</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="text-[11px] text-zinc-600 flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-zinc-900 mt-1.5 shrink-0" />
                          <span>Detalhamento de respostas por setor e bloco de perguntas.</span>
                        </li>
                        <li className="text-[11px] text-zinc-600 flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-zinc-900 mt-1.5 shrink-0" />
                          <span>Lista completa de Planos de Ação e seus status atuais.</span>
                        </li>
                        <li className="text-[11px] text-zinc-600 flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-zinc-900 mt-1.5 shrink-0" />
                          <span>Trilha de evidências para auditorias e fiscalizações.</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Ciclo de Referência</label>
                    <select className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <option>Ciclo Março/2026</option>
                      <option>Ciclo Fevereiro/2026</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Unidade / Setor</label>
                    <select className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <option>Toda a Unidade</option>
                      <option>Setor: Montagem</option>
                      <option>Setor: Logística</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Opções do Documento</label>
                  <div className="grid grid-cols-1 gap-2">
                    <label className="flex items-center gap-3 p-3 bg-zinc-50 hover:bg-zinc-100 rounded-2xl transition-colors cursor-pointer border border-zinc-100">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-zinc-900">Comparativo Histórico</p>
                        <p className="text-[10px] text-zinc-500">Incluir evolução em relação ao ciclo anterior</p>
                      </div>
                    </label>
                    
                    {selectedType === 'technical' && (
                      <>
                        <label className="flex items-center gap-3 p-3 bg-zinc-50 hover:bg-zinc-100 rounded-2xl transition-colors cursor-pointer border border-zinc-100">
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                          <div className="flex-1">
                            <p className="text-xs font-bold text-zinc-900">Planos de Ação</p>
                            <p className="text-[10px] text-zinc-500">Listar status de todas as ações corretivas</p>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 bg-zinc-50 hover:bg-zinc-100 rounded-2xl transition-colors cursor-pointer border border-zinc-100">
                          <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                          <div className="flex-1">
                            <p className="text-xs font-bold text-zinc-900">Evidências Fotográficas</p>
                            <p className="text-[10px] text-zinc-500">Anexar fotos vinculadas aos planos de ação</p>
                          </div>
                        </label>
                      </>
                    )}

                    {selectedType === 'executive' && (
                      <label className="flex items-center gap-3 p-3 bg-zinc-50 hover:bg-zinc-100 rounded-2xl transition-colors cursor-pointer border border-zinc-100">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-zinc-900">Resumo Executivo (IA)</p>
                          <p className="text-[10px] text-zinc-500">Gerar insights automáticos baseados nos dados</p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button 
                  onClick={() => setShowGenerateModal(false)}
                  disabled={isGenerating}
                  className="px-4 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={`px-8 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg ${
                    selectedType === 'executive' 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20' 
                      : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-zinc-900/20'
                  } disabled:opacity-70`}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Gerar PDF
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
