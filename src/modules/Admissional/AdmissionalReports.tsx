import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, FileText, Download, History, Search, 
  Eye, Trash2, RefreshCw, X, PlusCircle, CheckCircle2,
  Filter, Calendar, MapPin
} from 'lucide-react';

interface ReportJob {
  id: string;
  name: string;
  type: 'EXECUTIVE' | 'TECHNICAL';
  date: string;
  status: 'COMPLETED' | 'PROCESSING' | 'ERROR';
  size: string;
  params: any;
}

const mockJobs: ReportJob[] = [
  { id: 'j1', name: 'Relatório Executivo - Março/2026', type: 'EXECUTIVE', date: '09/03/2026 10:30', status: 'COMPLETED', size: '4.2 MB', params: {} },
  { id: 'j2', name: 'Relatório Técnico - Unidade 1', type: 'TECHNICAL', date: '05/03/2026 15:45', status: 'COMPLETED', size: '12.4 MB', params: {} },
  { id: 'j3', name: 'Relatório Executivo - Q1', type: 'EXECUTIVE', date: '01/03/2026 09:00', status: 'COMPLETED', size: '8.5 MB', params: {} },
  { id: 'j4', name: 'Relatório Técnico - Soldadores', type: 'TECHNICAL', date: '28/02/2026 14:20', status: 'ERROR', size: '0 KB', params: {} },
];

export const AdmissionalReports: React.FC = () => {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedType, setSelectedType] = useState<'EXECUTIVE' | 'TECHNICAL' | null>(null);
  const [jobs, setJobs] = useState<ReportJob[]>(mockJobs);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateClick = (type: 'EXECUTIVE' | 'TECHNICAL') => {
    setSelectedType(type);
    setShowConfigModal(true);
  };

  const handleConfirmGenerate = () => {
    setShowConfigModal(false);
    setIsGenerating(true);
    
    const newJob: ReportJob = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Relatório ${selectedType === 'EXECUTIVE' ? 'Executivo' : 'Técnico'} - ${new Date().toLocaleDateString('pt-BR')}`,
      type: selectedType!,
      date: new Date().toLocaleString('pt-BR'),
      status: 'PROCESSING',
      size: '0 KB',
      params: {}
    };

    setJobs([newJob, ...jobs]);

    setTimeout(() => {
      setJobs(prev => prev.map(j => 
        j.id === newJob.id 
          ? { ...j, status: 'COMPLETED', size: (Math.random() * 10 + 1).toFixed(1) + ' MB' } 
          : j
      ));
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="space-y-10">
      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[40px] border border-zinc-200 shadow-sm hover:border-blue-500/50 transition-all group">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <BarChart3 size={32} />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">Relatório Executivo</h3>
          <p className="text-sm text-zinc-500 mb-8 leading-relaxed font-medium">Visão macro com gráficos e indicadores agregados para diretoria.</p>
          <button 
            onClick={() => handleGenerateClick('EXECUTIVE')}
            className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10"
          >
            <PlusCircle size={20} /> Gerar PDF Executivo
          </button>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-zinc-200 shadow-sm hover:border-emerald-500/50 transition-all group">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FileText size={32} />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">Relatório Técnico</h3>
          <p className="text-sm text-zinc-500 mb-8 leading-relaxed font-medium">Detalhamento por função, motivos de veto e scores de testes.</p>
          <button 
            onClick={() => handleGenerateClick('TECHNICAL')}
            className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10"
          >
            <PlusCircle size={20} /> Gerar PDF Técnico
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white border border-zinc-200 rounded-[40px] overflow-hidden shadow-sm">
        <div className="p-10 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <div>
            <h3 className="text-xl font-black text-zinc-900 flex items-center gap-2">
              <History size={24} className="text-zinc-900" />
              Histórico de Relatórios
            </h3>
            <p className="text-sm text-zinc-500 font-medium">Acesse documentos e laudos gerados anteriormente</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar no histórico..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900/10 w-64"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-200">
                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Relatório</th>
                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Data de Geração</th>
                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tamanho</th>
                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {jobs.map((job) => (
                <tr key={job.id} className="group hover:bg-zinc-50/80 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        job.type === 'EXECUTIVE' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {job.type === 'EXECUTIVE' ? <BarChart3 size={20} /> : <FileText size={20} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900">{job.name}</p>
                        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter">PDF • ID: {job.id.toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-xs text-zinc-500 font-bold">{job.date}</td>
                  <td className="px-10 py-6">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase border flex items-center gap-2 w-fit ${
                      job.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      job.status === 'ERROR' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {job.status === 'PROCESSING' && <RefreshCw size={10} className="animate-spin" />}
                      {job.status === 'COMPLETED' ? 'Concluído' : job.status === 'ERROR' ? 'Erro' : 'Processando'}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-xs text-zinc-500 font-bold">{job.size}</td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {job.status === 'COMPLETED' ? (
                        <>
                          <button className="p-3 hover:bg-zinc-200 rounded-xl transition-colors text-zinc-400 hover:text-zinc-900" title="Download">
                            <Download size={18} />
                          </button>
                          <button className="p-3 hover:bg-zinc-200 rounded-xl transition-colors text-zinc-400 hover:text-zinc-900" title="Visualizar">
                            <Eye size={18} />
                          </button>
                        </>
                      ) : job.status === 'ERROR' ? (
                        <button onClick={handleConfirmGenerate} className="p-3 hover:bg-zinc-200 rounded-xl transition-colors text-zinc-400 hover:text-zinc-900" title="Tentar Novamente">
                          <RefreshCw size={18} />
                        </button>
                      ) : null}
                      <button className="p-3 hover:bg-rose-100 rounded-xl transition-colors text-zinc-400 hover:text-rose-600" title="Excluir">
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

      {/* Config Modal */}
      <AnimatePresence>
        {showConfigModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-10 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-900 text-white rounded-2xl shadow-xl shadow-zinc-900/20">
                    <PlusCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Gerar Relatório</h3>
                    <p className="text-xs text-zinc-500 font-medium">{selectedType === 'EXECUTIVE' ? 'Executivo' : 'Técnico'}</p>
                  </div>
                </div>
                <button onClick={() => setShowConfigModal(false)} className="p-2.5 hover:bg-zinc-200 rounded-2xl transition-colors">
                  <X size={24} className="text-zinc-400" />
                </button>
              </div>
              <div className="p-10 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Período</label>
                  <select className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-700 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all">
                    <option>Últimos 30 dias</option>
                    <option>Mês Atual (Março)</option>
                    <option>Mês Anterior (Fevereiro)</option>
                    <option>Personalizado...</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Unidade / Setor</label>
                  <select className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-700 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all">
                    <option>Todas as unidades</option>
                    <option>Unidade 1</option>
                    <option>Unidade 2</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Opções Adicionais</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-4 p-5 bg-zinc-50 border border-zinc-200 rounded-[32px] cursor-pointer hover:bg-zinc-100 transition-all">
                      <input type="checkbox" defaultChecked className="w-6 h-6 rounded-xl border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-zinc-900">Incluir Gráficos</p>
                        <p className="text-[10px] text-zinc-500">Adiciona visualizações de tendência e distribuição</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-4 p-5 bg-zinc-50 border border-zinc-200 rounded-[32px] cursor-pointer hover:bg-zinc-100 transition-all">
                      <input type="checkbox" className="w-6 h-6 rounded-xl border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-zinc-900">Ocultar Dados Sensíveis</p>
                        <p className="text-[10px] text-zinc-500">Remove nomes de avaliadores e observações privadas</p>
                      </div>
                    </label>
                    {selectedType === 'TECHNICAL' && (
                      <label className="flex items-center gap-4 p-5 bg-zinc-50 border border-zinc-200 rounded-[32px] cursor-pointer hover:bg-zinc-100 transition-all">
                        <input type="checkbox" defaultChecked className="w-6 h-6 rounded-xl border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-zinc-900">Tabela de Vetos</p>
                          <p className="text-[10px] text-zinc-500">Incluir lista detalhada de motivos por função</p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-10 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-4">
                <button onClick={() => setShowConfigModal(false)} className="px-8 py-4 text-zinc-600 font-bold text-sm hover:bg-zinc-200 rounded-2xl transition-all">Cancelar</button>
                <button 
                  onClick={handleConfirmGenerate} 
                  disabled={isGenerating}
                  className="px-12 py-4 bg-zinc-900 text-white font-bold text-sm rounded-2xl hover:bg-zinc-800 shadow-xl shadow-zinc-900/20 transition-all flex items-center gap-2"
                >
                  {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : 'Gerar Agora'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
