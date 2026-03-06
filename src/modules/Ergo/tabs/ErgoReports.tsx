import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  RefreshCw, 
  Search, 
  Filter, 
  Plus, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileDown, 
  Image as ImageIcon,
  Calendar,
  ChevronRight,
  MoreVertical,
  LayoutGrid,
  ShieldCheck,
  Tag
} from 'lucide-react';

interface ReportJob {
  id: string;
  name: string;
  type: string;
  date: string;
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
  size?: string;
}

interface Evidence {
  id: string;
  url: string;
  sector: string;
  origin: string;
  date: string;
  tags: string[];
}

const mockJobs: ReportJob[] = [
  { id: '1', name: 'Relatório Executivo Ergonomia - Mar/2026', type: 'PDF Executivo', date: '05/03/2026 10:30', status: 'COMPLETED', size: '2.4 MB' },
  { id: '2', name: 'Relatório Técnico Ergonomia - Sorocaba', type: 'PDF Técnico', date: '05/03/2026 09:15', status: 'PROCESSING' },
  { id: '3', name: 'Validação de Projetos - Q1 2026', type: 'PDF Projetos', date: '04/03/2026 16:45', status: 'FAILED' },
];

const mockEvidence: Evidence[] = [
  { id: '1', url: 'https://picsum.photos/seed/ergo1/400/300', sector: 'Montagem Final', origin: 'Avaliação', date: '04/03/2026', tags: ['Antes', 'Postura'] },
  { id: '2', url: 'https://picsum.photos/seed/ergo2/400/300', sector: 'Montagem Final', origin: 'Plano de Ação', date: '04/03/2026', tags: ['Depois', 'Melhoria'] },
  { id: '3', url: 'https://picsum.photos/seed/ergo3/400/300', sector: 'Logística', origin: 'Projeto', date: '03/03/2026', tags: ['Desenho', 'Engenharia'] },
  { id: '4', url: 'https://picsum.photos/seed/ergo4/400/300', sector: 'Solda', origin: 'Matriz', date: '02/03/2026', tags: ['Risco', 'Audit'] },
];

interface ErgoReportsProps {
  onOpenSector: (sectorId: string) => void;
}

export function ErgoReports({ onOpenSector }: ErgoReportsProps) {
  const [activeSubTab, setActiveSubTab] = useState<'reports' | 'evidence'>('reports');
  const [showConfigModal, setShowConfigModal] = useState(false);

  return (
    <div className="space-y-8">
      {/* Sub-tabs */}
      <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-2xl w-fit border border-zinc-200">
        <button 
          onClick={() => setActiveSubTab('reports')}
          className={`px-6 py-2 text-xs font-bold rounded-xl transition-all ${activeSubTab === 'reports' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          Relatórios
        </button>
        <button 
          onClick={() => setActiveSubTab('evidence')}
          className={`px-6 py-2 text-xs font-bold rounded-xl transition-all ${activeSubTab === 'evidence' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          Galeria de Evidências
        </button>
      </div>

      {activeSubTab === 'reports' ? (
        <div className="space-y-8">
          {/* Report Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Relatório Executivo', desc: 'Visão gerencial de riscos e tendências', icon: <ShieldCheck className="text-emerald-600" /> },
              { title: 'Relatório Técnico', desc: 'Detalhamento por posto e recomendações', icon: <FileText className="text-blue-600" /> },
              { title: 'Relatório de Projetos', desc: 'Status de validações e pareceres técnicos', icon: <LayoutGrid className="text-amber-600" /> },
            ].map((card, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:border-emerald-200 transition-all group">
                <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h4 className="text-sm font-bold text-zinc-900 mb-1">{card.title}</h4>
                <p className="text-xs text-zinc-500 mb-6">{card.desc}</p>
                <button 
                  onClick={() => setShowConfigModal(true)}
                  className="w-full py-2 bg-zinc-50 text-zinc-600 rounded-xl text-xs font-bold hover:bg-zinc-900 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw size={14} />
                  Gerar Novo
                </button>
              </div>
            ))}
          </div>

          {/* History */}
          <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
              <h4 className="text-sm font-bold text-zinc-900">Histórico de Relatórios</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 border-b border-zinc-200">
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Relatório</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Data de Geração</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {mockJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-zinc-400" />
                          <div className="space-y-0.5">
                            <span className="text-sm font-bold text-zinc-900">{job.name}</span>
                            {job.size && <p className="text-[10px] text-zinc-400 font-bold">{job.size}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-zinc-600">{job.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-zinc-500">{job.date}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {job.status === 'COMPLETED' && (
                            <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-[10px] font-bold">
                              <CheckCircle2 size={12} /> Concluído
                            </span>
                          )}
                          {job.status === 'PROCESSING' && (
                            <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-1 rounded-lg text-[10px] font-bold">
                              <RefreshCw size={12} className="animate-spin" /> Processando
                            </span>
                          )}
                          {job.status === 'FAILED' && (
                            <span className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2 py-1 rounded-lg text-[10px] font-bold">
                              <AlertCircle size={12} /> Falhou
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {job.status === 'COMPLETED' && (
                            <>
                              <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-emerald-600 transition-colors" title="Download">
                                <Download size={18} />
                              </button>
                              <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-blue-600 transition-colors" title="Visualizar">
                                <Eye size={18} />
                              </button>
                            </>
                          )}
                          {job.status === 'FAILED' && (
                            <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-amber-600 transition-colors" title="Tentar novamente">
                              <RefreshCw size={18} />
                            </button>
                          )}
                          <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-red-600 transition-colors" title="Excluir">
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
        </div>
      ) : (
        <div className="space-y-6">
          {/* Evidence Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar evidência..."
                  className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-xl transition-colors border border-zinc-200">
                <Filter size={20} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <select className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 focus:outline-none">
                <option>Todos os Setores</option>
                <option>Montagem Final</option>
                <option>Logística</option>
              </select>
              <select className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 focus:outline-none">
                <option>Todas as Origens</option>
                <option>Matriz</option>
                <option>Avaliação</option>
                <option>Projeto</option>
                <option>Plano de Ação</option>
              </select>
            </div>
          </div>

          {/* Evidence Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockEvidence.map((item) => (
              <div key={item.id} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm group hover:border-emerald-200 transition-all">
                <div className="aspect-video relative overflow-hidden">
                  <img src={item.url} alt={item.sector} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button className="p-2 bg-white rounded-full text-zinc-900 hover:bg-emerald-500 hover:text-white transition-colors shadow-lg">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 bg-white rounded-full text-zinc-900 hover:bg-blue-500 hover:text-white transition-colors shadow-lg">
                      <Download size={16} />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-[8px] font-bold rounded-full uppercase tracking-wider">
                      {item.origin}
                    </span>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <button 
                        onClick={() => onOpenSector('1')}
                        className="text-[10px] font-black text-zinc-900 uppercase tracking-wider hover:text-emerald-600 transition-colors text-left block"
                      >
                        {item.sector}
                      </button>
                      <p className="text-[10px] text-zinc-400 font-bold">{item.date}</p>
                    </div>
                    <button className="text-zinc-300 hover:text-zinc-600">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 px-1.5 py-0.5 bg-zinc-50 text-zinc-500 rounded text-[8px] font-bold border border-zinc-100">
                        <Tag size={8} /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Config Modal */}
      <AnimatePresence>
        {showConfigModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                  <RefreshCw size={18} className="text-emerald-600" />
                  Configurar Relatório
                </h3>
                <button onClick={() => setShowConfigModal(false)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Mês</label>
                    <select className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none">
                      <option>Março</option>
                      <option>Fevereiro</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Ano</label>
                    <select className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none">
                      <option>2026</option>
                      <option>2025</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Unidade / Setor</label>
                  <select className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none">
                    <option>Todas as Unidades</option>
                    <option>Sorocaba - Montagem Final</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Conteúdo do Relatório</label>
                  <div className="space-y-2">
                    {[
                      { label: 'Matriz de Risco Heatmap', id: 'matriz' },
                      { label: 'Avaliações de Posto', id: 'eval' },
                      { label: 'Projetos de Engenharia', id: 'proj' },
                      { label: 'Planos de Ação Ergonômicos', id: 'plan' },
                      { label: 'Galeria de Evidências', id: 'evid' },
                    ].map(item => (
                      <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                        <span className="text-xs text-zinc-600 font-bold group-hover:text-zinc-900 transition-colors">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setShowConfigModal(false)} className="px-6 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl transition-colors">Cancelar</button>
                <button 
                  onClick={() => setShowConfigModal(false)}
                  className="px-8 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Gerar Relatório
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
