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
  ClipboardList
} from 'lucide-react';

interface ReportHistory {
  id: string;
  name: string;
  type: string;
  date: string;
  status: 'Concluído' | 'Processando' | 'Erro';
  size: string;
}

const mockHistory: ReportHistory[] = [
  { id: '1', name: 'Relatório Executivo - Planos de Ação Q1', type: 'PDF', date: '06/03/2026 10:30', status: 'Concluído', size: '3.1 MB' },
  { id: '2', name: 'Status de Ações Corretivas - Março', type: 'CSV', date: '05/03/2026 15:45', status: 'Concluído', size: '850 KB' },
  { id: '3', name: 'Relatório Técnico de Evidências - NR1', type: 'PDF', date: '01/03/2026 09:00', status: 'Concluído', size: '12.4 MB' },
  { id: '4', name: 'Exportação Geral de Ações', type: 'CSV', date: '28/02/2026 14:20', status: 'Erro', size: '0 KB' },
];

export function PlanReports() {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportHistory | null>(null);
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);

  const reportTypes = [
    { 
      id: 'executive', 
      title: 'Relatório Executivo', 
      desc: 'Status dos planos, % concluído e análise por setor.', 
      icon: <BarChart3 className="text-blue-600" />,
      color: 'bg-blue-50'
    },
    { 
      id: 'technical', 
      title: 'Relatório Técnico', 
      desc: 'Lista detalhada de ações, evidências e trilha de auditoria.', 
      icon: <ClipboardList className="text-emerald-600" />,
      color: 'bg-emerald-50'
    },
    { 
      id: 'export', 
      title: 'Exportação de Dados', 
      desc: 'Dados brutos em CSV para integrações e BI.', 
      icon: <FileDown className="text-purple-600" />,
      color: 'bg-purple-50'
    },
  ];

  const [history, setHistory] = useState<ReportHistory[]>(mockHistory);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateClick = (type: string) => {
    setSelectedReportType(type);
    setShowConfigModal(true);
  };

  const handleConfirmGenerate = () => {
    setShowConfigModal(false);
    setIsGenerating(true);
    
    // Simulate generation
    const newReport: ReportHistory = {
      id: Math.random().toString(36).substr(2, 9),
      name: `${selectedReportType} - ${new Date().toLocaleDateString('pt-BR')}`,
      type: selectedReportType === 'Exportação de Dados' ? 'CSV' : 'PDF',
      date: new Date().toLocaleString('pt-BR'),
      status: 'Processando',
      size: '0 KB'
    };

    setHistory([newReport, ...history]);

    setTimeout(() => {
      setHistory(prev => prev.map(r => 
        r.id === newReport.id 
          ? { ...r, status: 'Concluído', size: (Math.random() * 5 + 1).toFixed(1) + ' MB' } 
          : r
      ));
      setIsGenerating(false);
    }, 3000);
  };

  const handleDeleteReport = (id: string) => {
    if (window.confirm('Deseja realmente excluir este relatório?')) {
      setHistory(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleDownload = (name: string) => {
    alert(`Iniciando download de: ${name}`);
  };

  const handleView = (report: ReportHistory) => {
    setSelectedReport(report);
    setShowPreviewModal(true);
  };

  return (
    <div className="space-y-8">
      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <div 
            key={report.id}
            className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm hover:border-zinc-900 transition-all group"
          >
            <div className={`w-14 h-14 ${report.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              {report.icon}
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">{report.title}</h3>
            <p className="text-xs text-zinc-500 mb-8 leading-relaxed">{report.desc}</p>
            <button 
              onClick={() => handleGenerateClick(report.title)}
              className="w-full py-3 bg-zinc-900 text-white rounded-2xl text-xs font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-zinc-900/10"
            >
              <Plus size={18} /> Configurar e Gerar
            </button>
          </div>
        ))}
      </div>

      {/* History Table */}
      <div className="bg-white border border-zinc-200 rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <History size={20} className="text-zinc-900" />
              Histórico de Relatórios
            </h3>
            <p className="text-xs text-zinc-500">Acesse relatórios gerados anteriormente</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar no histórico..." 
                className="pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900/20 w-64"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-200">
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Relatório</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Data de Geração</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tamanho</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {history.map((report) => (
                <tr key={report.id} className="group hover:bg-zinc-50/80 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl ${report.type === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        <FileText size={20} />
                      </div>
                      <span className="text-sm font-bold text-zinc-900">{report.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs text-zinc-500 font-medium">{report.date}</td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-2 w-fit ${
                      report.status === 'Concluído' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      report.status === 'Erro' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {report.status === 'Processando' && <RefreshCw size={10} className="animate-spin" />}
                      {report.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-xs text-zinc-500 font-medium">{report.size}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {report.status === 'Concluído' ? (
                        <>
                          <button 
                            onClick={() => handleDownload(report.name)}
                            className="p-2.5 hover:bg-zinc-200 rounded-xl transition-colors text-zinc-400 hover:text-zinc-900" 
                            title="Download"
                          >
                            <Download size={18} />
                          </button>
                          <button 
                            onClick={() => handleView(report)}
                            className="p-2.5 hover:bg-zinc-200 rounded-xl transition-colors text-zinc-400 hover:text-zinc-900" 
                            title="Visualizar"
                          >
                            <Eye size={18} />
                          </button>
                        </>
                      ) : report.status === 'Erro' ? (
                        <button 
                          onClick={() => handleConfirmGenerate()}
                          className="p-2.5 hover:bg-zinc-200 rounded-xl transition-colors text-zinc-400 hover:text-zinc-900" 
                          title="Tentar Novamente"
                        >
                          <RefreshCw size={18} />
                        </button>
                      ) : null}
                      <button 
                        onClick={() => handleDeleteReport(report.id)}
                        className="p-2.5 hover:bg-rose-100 rounded-xl transition-colors text-zinc-400 hover:text-rose-600" 
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

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && selectedReport && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${selectedReport.type === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900">Pré-visualização do Relatório</h3>
                    <p className="text-xs text-zinc-500">{selectedReport.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDownload(selectedReport.name)}
                    className="p-2.5 bg-zinc-100 text-zinc-600 rounded-2xl hover:bg-zinc-200 transition-all flex items-center gap-2 text-xs font-bold"
                  >
                    <Download size={18} /> Download
                  </button>
                  <button onClick={() => setShowPreviewModal(false)} className="p-2.5 hover:bg-zinc-200 rounded-2xl transition-colors">
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 bg-zinc-100/30 custom-scrollbar">
                <div className="bg-white p-12 rounded-[32px] shadow-sm border border-zinc-200 min-h-[1000px] mx-auto max-w-[800px] space-y-10">
                  {/* Mock Report Header */}
                  <div className="flex justify-between items-start border-b-2 border-zinc-900 pb-8">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter">Relatório de Gestão</h1>
                      <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{selectedReport.name}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[10px] font-black text-zinc-400 uppercase">Data de Emissão</p>
                      <p className="text-sm font-bold text-zinc-900">{selectedReport.date}</p>
                    </div>
                  </div>

                  {/* Mock Report Content */}
                  <div className="space-y-8">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                        <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Total de Planos</p>
                        <p className="text-2xl font-black text-zinc-900">24</p>
                      </div>
                      <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                        <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Ações Concluídas</p>
                        <p className="text-2xl font-black text-emerald-600">84%</p>
                      </div>
                      <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                        <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Ações em Atraso</p>
                        <p className="text-2xl font-black text-red-600">12</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-black text-zinc-900 uppercase tracking-widest border-b border-zinc-200 pb-2">Resumo por Setor</h4>
                      <div className="space-y-3">
                        {[
                          { sector: 'Montagem', progress: 75, color: 'bg-blue-500' },
                          { sector: 'Logística', progress: 40, color: 'bg-amber-500' },
                          { sector: 'Pintura', progress: 90, color: 'bg-emerald-500' },
                          { sector: 'Solda', progress: 25, color: 'bg-red-500' },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <span className="text-xs font-bold text-zinc-700 w-24">{item.sector}</span>
                            <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                              <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.progress}%` }} />
                            </div>
                            <span className="text-xs font-black text-zinc-900 w-10 text-right">{item.progress}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-black text-zinc-900 uppercase tracking-widest border-b border-zinc-200 pb-2">Principais Ações Pendentes</h4>
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-zinc-400 font-black uppercase">
                            <th className="pb-3">Ação</th>
                            <th className="pb-3">Responsável</th>
                            <th className="pb-3">Prazo</th>
                            <th className="pb-3 text-right">Prioridade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                          {[
                            { title: 'Ajuste de bancada ergonômica', resp: 'Dr. Silva', date: '15/03/2026', prio: 'Alta' },
                            { title: 'Treinamento de postura', resp: 'Dra. Maria', date: '10/03/2026', prio: 'Média' },
                            { title: 'Instalação de tapetes antifadiga', resp: 'Dr. Carlos', date: '20/03/2026', prio: 'Baixa' },
                          ].map((row, idx) => (
                            <tr key={idx}>
                              <td className="py-3 font-bold text-zinc-900">{row.title}</td>
                              <td className="py-3 text-zinc-500">{row.resp}</td>
                              <td className="py-3 text-zinc-500">{row.date}</td>
                              <td className="py-3 text-right">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                  row.prio === 'Alta' ? 'bg-red-50 text-red-600' :
                                  row.prio === 'Média' ? 'bg-amber-50 text-amber-600' :
                                  'bg-zinc-50 text-zinc-600'
                                }`}>
                                  {row.prio}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mock Report Footer */}
                  <div className="pt-20 border-t border-zinc-100 flex justify-between items-end">
                    <div className="space-y-4">
                      <div className="w-48 h-px bg-zinc-300" />
                      <p className="text-[10px] font-bold text-zinc-400 uppercase">Assinatura do Responsável Técnico</p>
                    </div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Página 1 de 12</p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-4">
                <button onClick={() => setShowPreviewModal(false)} className="px-10 py-3.5 bg-zinc-900 text-white font-bold text-sm rounded-2xl hover:bg-zinc-800 shadow-xl shadow-zinc-900/20 transition-all">
                  Fechar Visualização
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showConfigModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-900 text-white rounded-2xl">
                    <PlusCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900">Configurar Relatório</h3>
                    <p className="text-xs text-zinc-500">{selectedReportType}</p>
                  </div>
                </div>
                <button onClick={() => setShowConfigModal(false)} className="p-2.5 hover:bg-zinc-200 rounded-2xl transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-10 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Período de Análise</label>
                  <select className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-700 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all">
                    <option>Últimos 30 dias</option>
                    <option>Mês Atual (Março)</option>
                    <option>Mês Anterior (Fevereiro)</option>
                    <option>Personalizado...</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Origem dos Dados</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['NR1', 'Ergo', 'Queixa', 'Fisio', 'Absenteísmo'].map(origin => (
                      <label key={origin} className="flex items-center gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl cursor-pointer hover:bg-zinc-100 transition-all">
                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
                        <span className="text-xs font-bold text-zinc-700">{origin}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Opções de Exportação</label>
                  <label className="flex items-center gap-4 p-5 bg-zinc-50 border border-zinc-200 rounded-3xl cursor-pointer hover:bg-zinc-100 transition-all">
                    <input type="checkbox" defaultChecked className="w-6 h-6 rounded-xl border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-zinc-900">Incluir Evidências</p>
                      <p className="text-[10px] text-zinc-500">Anexar fotos e documentos ao relatório final</p>
                    </div>
                  </label>
                </div>
              </div>
              <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-4">
                <button onClick={() => setShowConfigModal(false)} className="px-8 py-3.5 text-zinc-600 font-bold text-sm hover:bg-zinc-200 rounded-2xl transition-all">Cancelar</button>
                <button 
                  onClick={handleConfirmGenerate} 
                  disabled={isGenerating}
                  className="px-10 py-3.5 bg-zinc-900 text-white font-bold text-sm rounded-2xl hover:bg-zinc-800 shadow-xl shadow-zinc-900/20 transition-all flex items-center gap-2"
                >
                  {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : 'Gerar Relatório'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
