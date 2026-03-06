import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  HardHat, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  FileText, 
  ClipboardList, 
  Image as ImageIcon,
  User,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  FileDown,
  Trash2
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  sector: string;
  unit: string;
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  status: 'Solicitado' | 'Em análise' | 'Aguardando ajustes' | 'Aprovado' | 'Reprovado';
  description?: string;
}

const mockProjects: Project[] = [
  { id: '1', name: 'Linha de Montagem - Posto 04', sector: 'Montagem Final', unit: 'Sorocaba', priority: 'high', deadline: '15/03/2026', status: 'Em análise', description: 'Revisão ergonômica da bancada de parafusamento.' },
  { id: '2', name: 'Novo Centro de Distribuição', sector: 'Logística', unit: 'Indaiatuba', priority: 'medium', deadline: '20/03/2026', status: 'Aprovado' },
  { id: '3', name: 'Ajuste de Bancada - Logística', sector: 'Logística', unit: 'Sorocaba', priority: 'high', deadline: '10/03/2026', status: 'Aguardando ajustes' },
  { id: '4', name: 'Sistema de Exaustão Pintura', sector: 'Pintura', unit: 'Sorocaba', priority: 'low', deadline: '30/03/2026', status: 'Solicitado' },
];

const columns: Project['status'][] = ['Solicitado', 'Em análise', 'Aguardando ajustes', 'Aprovado', 'Reprovado'];

interface ErgoProjectsProps {
  onOpenSector: (sectorId: string) => void;
}

export function ErgoProjects({ onOpenSector }: ErgoProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showParecerModal, setShowParecerModal] = useState(false);
  const [parecerType, setParecerType] = useState<'Aprovado' | 'Reprovado' | 'Aguardando ajustes'>('Aprovado');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'low': return 'text-emerald-600 bg-emerald-50';
      case 'medium': return 'text-blue-600 bg-blue-50';
      case 'high': return 'text-red-600 bg-red-50';
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'Solicitado': return 'bg-zinc-100 text-zinc-600';
      case 'Em análise': return 'bg-blue-100 text-blue-600';
      case 'Aguardando ajustes': return 'bg-amber-100 text-amber-600';
      case 'Aprovado': return 'bg-emerald-100 text-emerald-600';
      case 'Reprovado': return 'bg-red-100 text-red-600';
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
              placeholder="Buscar projeto..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-xl transition-colors border border-zinc-200">
            <Filter size={20} />
          </button>
        </div>
        <button 
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Novo Projeto (Eng)
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar min-h-[600px]">
        {columns.map((column) => (
          <div key={column} className="flex-1 min-w-[280px] space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider">{column}</h3>
                <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-full text-[10px] font-bold">
                  {mockProjects.filter(p => p.status === column).length}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {mockProjects.filter(p => p.status === column).map((project) => (
                <motion.div 
                  key={project.id}
                  layoutId={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:border-emerald-200 transition-all cursor-pointer group relative"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowActionMenu(showActionMenu === project.id ? null : project.id);
                        }}
                        className="p-1 text-zinc-300 hover:text-zinc-600 transition-colors"
                      >
                        <MoreVertical size={14} />
                      </button>

                      <AnimatePresence>
                        {showActionMenu === project.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setShowActionMenu(null); }} />
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-zinc-100 z-20 overflow-hidden py-1"
                            >
                              <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedProject(project); setShowActionMenu(null); }}
                                className="w-full px-4 py-2 text-left text-[10px] font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                              >
                                <FileText size={14} className="text-zinc-400" /> Ver Detalhes
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setShowActionMenu(null); }}
                                className="w-full px-4 py-2 text-left text-[10px] font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                              >
                                <MessageSquare size={14} className="text-zinc-400" /> Alterar Status
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setShowActionMenu(null); }}
                                className="w-full px-4 py-2 text-left text-[10px] font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                              >
                                <FileDown size={14} className="text-zinc-400" /> Parecer PDF
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setShowActionMenu(null); }}
                                className="w-full px-4 py-2 text-left text-[10px] font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                              >
                                <ClipboardList size={14} className="text-emerald-500" /> Criar Plano
                              </button>
                              <div className="h-px bg-zinc-100 my-1" />
                              <button 
                                onClick={(e) => { e.stopPropagation(); setShowActionMenu(null); }}
                                className="w-full px-4 py-2 text-left text-[10px] font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                              >
                                <Trash2 size={14} /> Excluir
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900 mb-1 group-hover:text-emerald-600 transition-colors">{project.name}</h4>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onOpenSector('1'); }}
                    className="text-[10px] text-zinc-500 font-bold hover:text-emerald-600 transition-colors uppercase mb-4 text-left"
                  >
                    {project.sector} • {project.unit}
                  </button>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-50">
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <Calendar size={12} />
                      <span className="text-[10px] font-bold">{project.deadline}</span>
                    </div>
                    <div className="w-6 h-6 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300">
                      <User size={12} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Project Detail Drawer */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[80]" onClick={() => setSelectedProject(null)} />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-[90] flex flex-col"
            >
              <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(selectedProject.status)}`}>
                      {selectedProject.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getPriorityColor(selectedProject.priority)}`}>
                      {selectedProject.priority.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900">{selectedProject.name}</h3>
                  <p className="text-xs text-zinc-500">{selectedProject.sector} • {selectedProject.unit}</p>
                </div>
                <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 flex-1 overflow-y-auto custom-scrollbar space-y-8">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <p className="text-[10px] text-zinc-400 uppercase font-bold mb-1">Prazo Final</p>
                    <div className="flex items-center gap-2 text-zinc-900 font-bold">
                      <Calendar size={16} className="text-zinc-400" />
                      {selectedProject.deadline}
                    </div>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <p className="text-[10px] text-zinc-400 uppercase font-bold mb-1">Solicitante</p>
                    <div className="flex items-center gap-2 text-zinc-900 font-bold">
                      <User size={16} className="text-zinc-400" />
                      Eng. Ricardo
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Descrição do Projeto</h5>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {selectedProject.description || 'Nenhuma descrição detalhada fornecida para este projeto.'}
                  </p>
                </div>

                {/* Checklist Ergonômico */}
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Checklist Ergonômico de Projeto</h5>
                  <div className="space-y-2">
                    {[
                      { label: 'Altura da bancada regulável?', value: 'Sim' },
                      { label: 'Área de alcance otimizada?', value: 'Em análise' },
                      { label: 'Iluminação adequada (500 lux)?', value: 'Sim' },
                      { label: 'Espaço para pernas livre?', value: 'Não' },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                        <span className="text-xs text-zinc-600">{item.label}</span>
                        <span className={`text-xs font-bold ${item.value === 'Sim' ? 'text-emerald-600' : item.value === 'Não' ? 'text-red-600' : 'text-amber-600'}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence */}
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Anexos & Desenhos</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="aspect-video bg-zinc-100 rounded-xl border border-zinc-200 flex flex-col items-center justify-center text-zinc-400">
                      <ImageIcon size={24} />
                      <span className="text-[10px] mt-1 font-bold">Planta Baixa.pdf</span>
                    </div>
                    <div className="aspect-video bg-zinc-100 rounded-xl border border-zinc-200 flex flex-col items-center justify-center text-zinc-400">
                      <ImageIcon size={24} />
                      <span className="text-[10px] mt-1 font-bold">Render 3D.png</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-zinc-50 border-t border-zinc-100 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => { setParecerType('Aprovado'); setShowParecerModal(true); }}
                    className="flex flex-col items-center justify-center gap-1 py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl hover:bg-emerald-100 transition-colors"
                  >
                    <CheckCircle2 size={18} />
                    <span className="text-[10px] font-bold uppercase">Aprovar</span>
                  </button>
                  <button 
                    onClick={() => { setParecerType('Aguardando ajustes'); setShowParecerModal(true); }}
                    className="flex flex-col items-center justify-center gap-1 py-3 bg-amber-50 text-amber-600 border border-amber-100 rounded-2xl hover:bg-amber-100 transition-colors"
                  >
                    <AlertTriangle size={18} />
                    <span className="text-[10px] font-bold uppercase">Ajustes</span>
                  </button>
                  <button 
                    onClick={() => { setParecerType('Reprovado'); setShowParecerModal(true); }}
                    className="flex flex-col items-center justify-center gap-1 py-3 bg-red-50 text-red-600 border border-red-100 rounded-2xl hover:bg-red-100 transition-colors"
                  >
                    <X size={18} />
                    <span className="text-[10px] font-bold uppercase">Reprovar</span>
                  </button>
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-900 text-white rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-colors">
                  <FileText size={18} />
                  Gerar Parecer Técnico
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* New Project Modal */}
      <AnimatePresence>
        {showNewModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                  <Plus size={18} className="text-emerald-600" />
                  Nova Solicitação de Engenharia
                </h3>
                <button onClick={() => setShowNewModal(false)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Nome do Projeto</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Nova Linha de Pintura"
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

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
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Descrição</label>
                  <textarea 
                    rows={3}
                    placeholder="Descreva o escopo do projeto..."
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Prioridade</label>
                    <select className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <option>Baixa</option>
                      <option>Média</option>
                      <option>Alta</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Prazo</label>
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
                  Salvar Solicitação
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Parecer Modal */}
        {showParecerModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  Registrar Parecer: {parecerType}
                </h3>
                <button onClick={() => setShowParecerModal(false)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Resumo da Decisão</label>
                  <textarea 
                    rows={3}
                    placeholder="Descreva os pontos principais da validação..."
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {parecerType === 'Aguardando ajustes' && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Ajustes Obrigatórios</label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input type="text" placeholder="Adicionar ajuste..." className="flex-1 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm" />
                        <button className="p-2 bg-zinc-100 text-zinc-600 rounded-xl hover:bg-zinc-200 transition-colors">
                          <Plus size={18} />
                        </button>
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer group px-1">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                        <span className="text-[10px] text-zinc-600 font-bold group-hover:text-zinc-900 transition-colors uppercase">Criar plano de ação automaticamente</span>
                      </label>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Anexos Adicionais</label>
                  <button className="w-full py-4 border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center text-zinc-400 hover:border-emerald-200 hover:text-emerald-600 transition-all">
                    <ImageIcon size={24} />
                    <span className="text-[10px] font-bold mt-1 uppercase">Upload de Evidência</span>
                  </button>
                </div>
              </div>
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setShowParecerModal(false)} className="px-6 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl transition-colors">Cancelar</button>
                <button 
                  onClick={() => setShowParecerModal(false)}
                  className="px-8 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Salvar Parecer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
