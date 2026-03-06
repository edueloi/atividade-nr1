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
  Info
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
  { id: '1', name: 'Relatório Executivo - Março 2026', type: 'PDF', date: '06/03/2026 10:30', status: 'Concluído', size: '2.4 MB' },
  { id: '2', name: 'Indicadores de Reabilitação Q1', type: 'CSV', date: '05/03/2026 15:45', status: 'Concluído', size: '1.1 MB' },
  { id: '3', name: 'Relatório Técnico Detalhado - Fevereiro', type: 'PDF', date: '01/03/2026 09:00', status: 'Concluído', size: '5.8 MB' },
  { id: '4', name: 'Exportação de Casos Ativos', type: 'CSV', date: '28/02/2026 14:20', status: 'Erro', size: '0 KB' },
];

export function PhysioReports() {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);

  const reportTypes = [
    { 
      id: 'executive', 
      title: 'Relatório Executivo Fisio', 
      desc: 'Resumo de indicadores, reabilitados e funil clínico.', 
      icon: <BarChart3 className="text-emerald-600" />,
      color: 'bg-emerald-50'
    },
    { 
      id: 'technical', 
      title: 'Relatório Técnico Fisio', 
      desc: 'Detalhes de sessões, evolução de dor e condutas.', 
      icon: <FileText className="text-blue-600" />,
      color: 'bg-blue-50'
    },
    { 
      id: 'export', 
      title: 'Exportação CSV', 
      desc: 'Dados brutos de encaminhamentos, casos e sessões.', 
      icon: <FileDown className="text-purple-600" />,
      color: 'bg-purple-50'
    },
  ];

  const handleGenerateClick = (type: string) => {
    setSelectedReportType(type);
    setShowConfigModal(true);
  };

  return (
    <div className="space-y-8">
      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <div 
            key={report.id}
            className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:border-emerald-200 transition-all group"
          >
            <div className={`w-12 h-12 ${report.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {report.icon}
            </div>
            <h3 className="text-sm font-bold text-zinc-900 mb-2">{report.title}</h3>
            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">{report.desc}</p>
            <button 
              onClick={() => handleGenerateClick(report.title)}
              className="w-full py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-zinc-900/10"
            >
              <Plus size={16} /> Configurar e Gerar
            </button>
          </div>
        ))}
      </div>

      {/* History Table */}
      <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <History size={18} className="text-emerald-600" />
            Histórico de Relatórios
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
              <input 
                type="text" 
                placeholder="Buscar no histórico..." 
                className="pl-9 pr-4 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-200">
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Relatório</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Data de Geração</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tamanho</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {mockHistory.map((report) => (
                <tr key={report.id} className="group hover:bg-zinc-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${report.type === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        <FileText size={16} />
                      </div>
                      <span className="text-xs font-bold text-zinc-900">{report.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-500">{report.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${
                      report.status === 'Concluído' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      report.status === 'Erro' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-500">{report.size}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {report.status === 'Concluído' ? (
                        <>
                          <button className="p-2 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-400" title="Download">
                            <Download size={16} />
                          </button>
                          <button className="p-2 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-400" title="Visualizar">
                            <Eye size={16} />
                          </button>
                        </>
                      ) : report.status === 'Erro' ? (
                        <button className="p-2 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-400" title="Tentar Novamente">
                          <RefreshCw size={16} />
                        </button>
                      ) : null}
                      <button className="p-2 hover:bg-rose-100 rounded-lg transition-colors text-zinc-400 hover:text-rose-600" title="Excluir">
                        <Trash2 size={16} />
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                    <PlusCircle size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900">Configurar Relatório</h3>
                </div>
                <button onClick={() => setShowConfigModal(false)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Tipo Selecionado</label>
                  <p className="text-sm font-bold text-zinc-900">{selectedReportType}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Período</label>
                  <select className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                    <option>Últimos 30 dias</option>
                    <option>Mês Atual (Março)</option>
                    <option>Mês Anterior (Fevereiro)</option>
                    <option>Personalizado...</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Unidade / Setor</label>
                  <select className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                    <option>Todas as Unidades</option>
                    <option>Unidade 1</option>
                    <option>Unidade 2</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Incluir no Relatório</label>
                  <div className="space-y-2">
                    {['Reabilitados', 'Sessões Realizadas', 'Casos por Estrutura', 'Cruzamento com Queixas', 'Evidências Fotográficas'].map(item => (
                      <label key={item} className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-100 transition-colors">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded" />
                        <span className="text-xs font-bold text-zinc-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setShowConfigModal(false)} className="px-6 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl transition-colors">Cancelar</button>
                <button onClick={() => setShowConfigModal(false)} className="px-8 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20">Gerar Relatório</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
