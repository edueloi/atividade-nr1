import React, { useState, useEffect } from 'react';
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
  Info,
  ExternalLink,
  Copy,
  AlertTriangle,
  FileDown
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
    includeAI?: boolean;
  };
  error?: string;
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
      params: { cycle: 'Março/2026', unit: 'Sorocaba', includeComparison: true, includeAI: true }
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
      params: { cycle: 'Fevereiro/2026', unit: 'Logística' },
      error: 'Erro na geração do PDF: Timeout do servidor de renderização.'
    }
  ]);

  // UI States
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'error' | 'info' }[]>([]);
  const [previewReport, setPreviewReport] = useState<ReportJob | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<ReportJob | null>(null);
  const [paramsInfo, setParamsInfo] = useState<ReportJob | null>(null);
  const [retryConfirm, setRetryConfirm] = useState<ReportJob | null>(null);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const handleOpenModal = (type: 'executive' | 'technical') => {
    setSelectedType(type);
    setShowGenerateModal(true);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    addToast('Iniciando geração do relatório...', 'info');
    
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
      addToast('Relatório gerado com sucesso!');
    }, 2000);
  };

  const handleDownload = (job: ReportJob) => {
    if (job.status === 'PROCESSING') return;
    if (job.status === 'FAILED') {
      addToast('Relatório falhou. Tente gerar novamente.', 'error');
      return;
    }
    
    addToast('Baixando relatório...');
    // Simulate download
    setTimeout(() => {
      // In a real app: window.location.href = `/api/reports/nr1/${job.id}/download`;
      console.log(`Downloading report ${job.id}`);
    }, 1000);
  };

  const handleView = (job: ReportJob) => {
    setPreviewReport(job);
  };

  const handleDelete = (job: ReportJob) => {
    setHistory(prev => prev.filter(j => j.id !== job.id));
    setDeleteConfirm(null);
    addToast('Relatório excluído do histórico.');
  };

  const handleRetry = (job: ReportJob) => {
    addToast('Gerando relatório novamente...', 'info');
    setRetryConfirm(null);
    
    // Update existing job to processing
    setHistory(prev => prev.map(j => j.id === job.id ? { ...j, status: 'PROCESSING', error: undefined } : j));
    
    setTimeout(() => {
      setHistory(prev => prev.map(j => j.id === job.id ? { ...j, status: 'COMPLETED' } : j));
      addToast('Relatório gerado com sucesso!');
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Toasts */}
      <div className="fixed bottom-8 right-8 z-[100] space-y-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border ${
                toast.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' :
                toast.type === 'error' ? 'bg-rose-600 border-rose-500 text-white' :
                'bg-zinc-900 border-zinc-800 text-white'
              }`}
            >
              {toast.type === 'success' ? <CheckCircle2 size={18} /> : 
               toast.type === 'error' ? <AlertCircle size={18} /> : <Info size={18} />}
              <span className="text-sm font-bold">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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
                RH / Diretoria
              </span>
            </div>
            <div className="space-y-2 mb-8">
              <h4 className="text-xl font-bold text-zinc-900">Relatório Executivo NR1</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">Visão macro de riscos, adesão e tendências. Dados 100% agregados e anonimizados.</p>
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
                Auditoria / SESMT
              </span>
            </div>
            <div className="space-y-2 mb-8">
              <h4 className="text-xl font-bold text-zinc-900">Relatório Técnico NR1</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">Detalhamento técnico por setor, evidências de planos de ação e trilha de auditoria.</p>
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
                          <button 
                            onClick={() => handleDownload(job)}
                            className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" 
                            title="Download PDF"
                          >
                            <Download size={18} />
                          </button>
                          <button 
                            onClick={() => handleView(job)}
                            className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all" 
                            title="Visualizar"
                          >
                            <Eye size={18} />
                          </button>
                        </>
                      ) : job.status === 'FAILED' ? (
                        <button 
                          onClick={() => setRetryConfirm(job)}
                          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                          title="Tentar Novamente"
                        >
                          <RefreshCw size={18} />
                        </button>
                      ) : (
                        <button className="p-2 text-zinc-300 cursor-not-allowed" title="Aguarde finalizar">
                          <Download size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => setParamsInfo(job)}
                        className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                        title="Ver Parâmetros"
                      >
                        <Info size={18} />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm(job)}
                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Excluir"
                      >
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

      {/* Modals */}
      <AnimatePresence>
        {/* Generate Modal */}
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

        {/* Preview Modal */}
        {previewReport && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[40px] w-full max-w-5xl h-full overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${previewReport.type === 'executive' ? 'bg-emerald-600 text-white' : 'bg-zinc-900 text-white'}`}>
                    {previewReport.type === 'executive' ? <FileBarChart size={24} /> : <ShieldCheck size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-zinc-900 tracking-tight">
                      {previewReport.type === 'executive' ? 'Relatório Executivo' : 'Relatório Técnico'}
                    </h3>
                    <p className="text-xs text-zinc-500">Gerado em {previewReport.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDownload(previewReport)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <Download size={18} />
                    Baixar PDF
                  </button>
                  <button className="p-2 hover:bg-zinc-200 rounded-xl transition-colors text-zinc-400">
                    <ExternalLink size={20} />
                  </button>
                  <button onClick={() => setPreviewReport(null)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors text-zinc-400 ml-2">
                    <X size={24} />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-zinc-100 p-12 overflow-y-auto flex justify-center">
                {/* PDF Placeholder */}
                <div className="bg-white w-full max-w-[800px] aspect-[1/1.41] shadow-2xl rounded-sm p-16 space-y-8">
                  <div className="flex justify-between items-start border-b-2 border-zinc-900 pb-8">
                    <div className="space-y-2">
                      <h1 className="text-4xl font-black uppercase tracking-tighter">NR1 Psicossocial</h1>
                      <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Relatório de Gestão de Riscos</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold uppercase text-zinc-400">Data de Emissão</p>
                      <p className="text-sm font-black">{previewReport.createdAt.split(' ')[0]}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">Parâmetros</h2>
                      <div className="space-y-2">
                        <div className="flex justify-between border-b border-zinc-100 py-1">
                          <span className="text-xs text-zinc-500">Ciclo</span>
                          <span className="text-xs font-bold">{previewReport.params.cycle}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-100 py-1">
                          <span className="text-xs text-zinc-500">Unidade</span>
                          <span className="text-xs font-bold">{previewReport.params.unit}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">Resumo</h2>
                      <p className="text-xs text-zinc-600 leading-relaxed italic">
                        "Este documento apresenta os resultados consolidados da avaliação de riscos psicossociais conforme diretrizes da NR1. Os dados indicam uma adesão de 88% no setor de Montagem, com score de risco médio (65/100)."
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-8">
                    <div className="h-4 bg-zinc-900 w-full" />
                    <div className="h-4 bg-zinc-100 w-3/4" />
                    <div className="h-4 bg-zinc-100 w-full" />
                    <div className="h-4 bg-zinc-100 w-1/2" />
                  </div>

                  <div className="pt-20 text-center">
                    <div className="w-32 h-px bg-zinc-200 mx-auto mb-2" />
                    <p className="text-[10px] font-bold uppercase text-zinc-400">Assinatura Digital - Sistema SESMT</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Confirm */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl text-center space-y-6"
            >
              <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-zinc-900">Excluir Relatório?</h3>
                <p className="text-sm text-zinc-500">
                  Deseja excluir o relatório <span className="font-bold text-zinc-900">"{deleteConfirm.type === 'executive' ? 'Executivo' : 'Técnico'}"</span> gerado em {deleteConfirm.createdAt}?
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 bg-zinc-100 text-zinc-600 rounded-2xl font-bold hover:bg-zinc-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-3 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-500/20"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Params Modal */}
        {paramsInfo && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                  <Info size={18} className="text-blue-600" />
                  Parâmetros do Relatório
                </h3>
                <button onClick={() => setParamsInfo(null)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} className="text-zinc-400" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Ciclo</p>
                    <p className="text-sm font-bold text-zinc-900">{paramsInfo.params.cycle}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Unidade</p>
                    <p className="text-sm font-bold text-zinc-900">{paramsInfo.params.unit}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase">Opções Ativas</p>
                  <div className="space-y-2">
                    {paramsInfo.params.includeComparison && (
                      <div className="flex items-center gap-2 text-xs text-zinc-600">
                        <CheckCircle2 size={14} className="text-emerald-500" /> Comparativo Histórico
                      </div>
                    )}
                    {paramsInfo.params.includeActions && (
                      <div className="flex items-center gap-2 text-xs text-zinc-600">
                        <CheckCircle2 size={14} className="text-emerald-500" /> Planos de Ação
                      </div>
                    )}
                    {paramsInfo.params.includeEvidence && (
                      <div className="flex items-center gap-2 text-xs text-zinc-600">
                        <CheckCircle2 size={14} className="text-emerald-500" /> Evidências Fotográficas
                      </div>
                    )}
                    {paramsInfo.params.includeAI && (
                      <div className="flex items-center gap-2 text-xs text-zinc-600">
                        <CheckCircle2 size={14} className="text-emerald-500" /> Resumo Executivo (IA)
                      </div>
                    )}
                  </div>
                </div>
                <div className="pt-4 border-t border-zinc-100 flex justify-between items-center text-[10px] text-zinc-400">
                  <span>ID: {paramsInfo.id}</span>
                  <span>Gerado por: Admin</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Retry Confirm */}
        {retryConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl text-center space-y-6"
            >
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <RefreshCw size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-zinc-900">Tentar Novamente?</h3>
                <p className="text-sm text-zinc-500">
                  Deseja tentar gerar o relatório novamente com os mesmos parâmetros?
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setRetryConfirm(null)}
                  className="flex-1 py-3 bg-zinc-100 text-zinc-600 rounded-2xl font-bold hover:bg-zinc-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleRetry(retryConfirm)}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Tentar Novamente
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
