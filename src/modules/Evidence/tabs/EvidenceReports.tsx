import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  FileDown, 
  Download, 
  Eye, 
  Trash2, 
  RefreshCw, 
  Calendar, 
  Filter, 
  Plus, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Search, 
  BarChart3, 
  PieChart, 
  Target, 
  ArrowRight, 
  MessageSquare, 
  History, 
  Edit3, 
  PlusCircle, 
  CalendarDays, 
  ListFilter, 
  ShieldCheck, 
  AlertTriangle, 
  Info,
  ClipboardList,
  FileArchive,
  FileSpreadsheet
} from 'lucide-react';

import { ExportJob } from '../types';

const mockJobs: ExportJob[] = [
  { id: 'j1', name: 'Pacote de Evidências - Março/2026', type: 'ZIP', date: '06/03/2026 10:30', status: 'Concluído', size: '45.2 MB', params: {} },
  { id: 'j2', name: 'Relatório de Evidências - Unidade 1', type: 'PDF', date: '05/03/2026 15:45', status: 'Concluído', size: '12.4 MB', params: {} },
  { id: 'j3', name: 'Metadados de Evidências - Q1', type: 'CSV', date: '01/03/2026 09:00', status: 'Concluído', size: '850 KB', params: {} },
  { id: 'j4', name: 'Pacote Completo - Auditoria NR1', type: 'ZIP', date: '28/02/2026 14:20', status: 'Erro', size: '0 KB', params: {} },
];

export function EvidenceReports() {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState<string | null>(null);
  const [jobs, setJobs] = useState<ExportJob[]>(mockJobs);
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { 
      id: 'zip', 
      title: 'Pacote de Evidências (ZIP)', 
      desc: 'Download de todos os arquivos originais organizados em pastas por período.', 
      icon: <FileArchive className="text-blue-600" />,
      color: 'bg-blue-50'
    },
    { 
      id: 'pdf', 
      title: 'Relatório Fotográfico (PDF)', 
      desc: 'Documento formatado com miniaturas, descrições e metadados de auditoria.', 
      icon: <FileText className="text-emerald-600" />,
      color: 'bg-emerald-50'
    },
    { 
      id: 'csv', 
      title: 'Exportação de Metadados (CSV)', 
      desc: 'Planilha com todos os dados, vínculos e tags para análise externa.', 
      icon: <FileSpreadsheet className="text-purple-600" />,
      color: 'bg-purple-50'
    },
  ];

  const handleGenerateClick = (type: string) => {
    setSelectedJobType(type);
    setShowConfigModal(true);
  };

  const handleConfirmGenerate = () => {
    setShowConfigModal(false);
    setIsGenerating(true);
    
    const newJob: ExportJob = {
      id: Math.random().toString(36).substr(2, 9),
      name: `${selectedJobType} - ${new Date().toLocaleDateString('pt-BR')}`,
      type: selectedJobType?.includes('ZIP') ? 'ZIP' : selectedJobType?.includes('PDF') ? 'PDF' : 'CSV',
      date: new Date().toLocaleString('pt-BR'),
      status: 'Processando',
      size: '0 KB',
      params: {}
    };

    setJobs([newJob, ...jobs]);

    setTimeout(() => {
      setJobs(prev => prev.map(j => 
        j.id === newJob.id 
          ? { ...j, status: 'Concluído', size: (Math.random() * 50 + 1).toFixed(1) + ' MB' } 
          : j
      ));
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="space-y-10">
      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <div 
            key={report.id}
            className="bg-white p-8 rounded-[40px] border border-zinc-200 shadow-sm hover:border-zinc-900 transition-all group"
          >
            <div className={`w-14 h-14 ${report.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              {report.icon}
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">{report.title}</h3>
            <p className="text-xs text-zinc-500 mb-8 leading-relaxed font-medium">{report.desc}</p>
            <button 
              onClick={() => handleGenerateClick(report.title)}
              className="w-full py-3.5 bg-zinc-900 text-white rounded-2xl text-xs font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-zinc-900/10"
            >
              <Plus size={18} /> Configurar e Gerar
            </button>
          </div>
        ))}
      </div>

      {/* History Table */}
      <div className="bg-white border border-zinc-200 rounded-[40px] overflow-hidden shadow-sm">
        <div className="p-10 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <div>
            <h3 className="text-xl font-black text-zinc-900 flex items-center gap-2">
              <History size={24} className="text-zinc-900" />
              Histórico de Exportações
            </h3>
            <p className="text-sm text-zinc-500 font-medium">Acesse pacotes e relatórios gerados anteriormente</p>
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
                        job.type === 'ZIP' ? 'bg-blue-50 text-blue-600' : 
                        job.type === 'PDF' ? 'bg-red-50 text-red-600' : 
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                        {job.type === 'ZIP' ? <FileArchive size={20} /> : job.type === 'PDF' ? <FileText size={20} /> : <FileSpreadsheet size={20} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900">{job.name}</p>
                        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter">{job.type} • ID: {job.id.toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-xs text-zinc-500 font-bold">{job.date}</td>
                  <td className="px-10 py-6">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase border flex items-center gap-2 w-fit ${
                      job.status === 'Concluído' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      job.status === 'Erro' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {job.status === 'Processando' && <RefreshCw size={10} className="animate-spin" />}
                      {job.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-xs text-zinc-500 font-bold">{job.size}</td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {job.status === 'Concluído' ? (
                        <>
                          <button className="p-3 hover:bg-zinc-200 rounded-xl transition-colors text-zinc-400 hover:text-zinc-900" title="Download">
                            <Download size={18} />
                          </button>
                          <button className="p-3 hover:bg-zinc-200 rounded-xl transition-colors text-zinc-400 hover:text-zinc-900" title="Visualizar">
                            <Eye size={18} />
                          </button>
                        </>
                      ) : job.status === 'Erro' ? (
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
                    <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Gerar Exportação</h3>
                    <p className="text-xs text-zinc-500 font-medium">{selectedJobType}</p>
                  </div>
                </div>
                <button onClick={() => setShowConfigModal(false)} className="p-2.5 hover:bg-zinc-200 rounded-2xl transition-colors">
                  <X size={24} className="text-zinc-400" />
                </button>
              </div>
              <div className="p-10 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Período de Análise</label>
                  <select className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-700 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all">
                    <option>Últimos 30 dias</option>
                    <option>Mês Atual (Março)</option>
                    <option>Mês Anterior (Fevereiro)</option>
                    <option>Personalizado...</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Origem dos Dados</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['NR1', 'Ergonomia', 'Eng', 'Plano de Ação', 'Aula', 'Fisio'].map(origin => (
                      <label key={origin} className="flex items-center gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl cursor-pointer hover:bg-zinc-100 transition-all">
                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
                        <span className="text-xs font-bold text-zinc-700">{origin}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Opções Adicionais</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-4 p-5 bg-zinc-50 border border-zinc-200 rounded-[32px] cursor-pointer hover:bg-zinc-100 transition-all">
                      <input type="checkbox" defaultChecked className="w-6 h-6 rounded-xl border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-zinc-900">Incluir Miniaturas</p>
                        <p className="text-[10px] text-zinc-500">Gera um PDF mais leve sem imagens em alta</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-4 p-5 bg-zinc-50 border border-zinc-200 rounded-[32px] cursor-pointer hover:bg-zinc-100 transition-all">
                      <input type="checkbox" defaultChecked className="w-6 h-6 rounded-xl border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-zinc-900">Somente Vinculadas</p>
                        <p className="text-[10px] text-zinc-500">Ignora rascunhos e evidências soltas</p>
                      </div>
                    </label>
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
}
