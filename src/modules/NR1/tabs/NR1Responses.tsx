import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight,
  ClipboardList,
  Users,
  AlertTriangle,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  LayoutGrid,
  ShieldCheck,
  Plus,
  ExternalLink,
  X,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  FileDown,
  MessageSquare,
  Image as ImageIcon,
  Eye,
  FileText,
  Calendar,
  User,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SectorResponse {
  id: string;
  name: string;
  responses: number;
  adhesion: number;
  score: number;
  trend: number;
  status: 'low' | 'medium' | 'high';
  scoresByBlock?: { label: string; score: number; details?: string }[];
  recommendedActions?: string[];
}

export function NR1Responses() {
  const [selectedCycle, setSelectedCycle] = useState('1');
  const [selectedSector, setSelectedSector] = useState<SectorResponse | null>(null);
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  
  // UI States
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showActionPlanModal, setShowActionPlanModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showObservationModal, setShowObservationModal] = useState(false);
  const [showBlockDetails, setShowBlockDetails] = useState<{ label: string; score: number; details?: string } | null>(null);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);

  const addToast = (message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const sectors: SectorResponse[] = [
    { 
      id: '1', 
      name: 'Montagem Cross', 
      responses: 45, 
      adhesion: 88, 
      score: 65, 
      trend: 5, 
      status: 'high',
      scoresByBlock: [
        { label: 'Ambiente de Trabalho', score: 72, details: 'Ruído excessivo relatado em 40% das respostas. Temperatura oscilante no turno B.' },
        { label: 'Relações Interpessoais', score: 45, details: 'Boa integração entre pares, mas ruído na comunicação com a supervisão imediata.' },
        { label: 'Carga e Ritmo', score: 82, details: 'Fator crítico. 70% dos colaboradores relatam ritmo intenso para cumprir metas diárias.' },
        { label: 'Apoio e Gestão', score: 61, details: 'Necessidade de maior clareza nas expectativas de desempenho.' }
      ],
      recommendedActions: [
        'Revisar carga horária e horas extras do setor',
        'Implementar treinamento de liderança positiva',
        'Realizar DDS focado em ergonomia cognitiva'
      ]
    },
    { 
      id: '2', 
      name: 'Logística', 
      responses: 32, 
      adhesion: 75, 
      score: 42, 
      trend: -2, 
      status: 'medium',
      scoresByBlock: [
        { label: 'Ambiente de Trabalho', score: 38 },
        { label: 'Relações Interpessoais', score: 44 },
        { label: 'Carga e Ritmo', score: 48 },
        { label: 'Apoio e Gestão', score: 38 }
      ]
    },
    { id: '3', name: 'Pintura', responses: 28, adhesion: 92, score: 28, trend: -8, status: 'low' },
    { id: '4', name: 'Manutenção', responses: 15, adhesion: 65, score: 55, trend: 12, status: 'medium' },
    { id: '5', name: 'Administrativo', responses: 8, adhesion: 100, score: 15, trend: 0, status: 'low' },
  ];

  const filteredSectors = sectors.filter(s => riskFilter === 'all' || s.status === riskFilter);

  const getStatusColor = (status: SectorResponse['status']) => {
    switch (status) {
      case 'low': return 'text-emerald-600 bg-emerald-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'high': return 'text-red-600 bg-red-50';
    }
  };

  const getStatusLabel = (status: SectorResponse['status']) => {
    switch (status) {
      case 'low': return 'Risco Baixo';
      case 'medium': return 'Risco Médio';
      case 'high': return 'Risco Alto';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toasts */}
      <div className="fixed bottom-8 right-8 z-[100] space-y-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-2xl shadow-2xl flex items-center gap-3"
            >
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span className="text-sm font-bold">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex-1 flex items-center gap-4">
          <div className="space-y-1 flex-1 max-w-[300px]">
            <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Ciclo de Aplicação</label>
            <select 
              value={selectedCycle}
              onChange={(e) => setSelectedCycle(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="1">Ciclo Março/2026 - Toyota</option>
              <option value="2">Ciclo Fevereiro/2026 - Usina Pilon</option>
            </select>
          </div>
          <div className="space-y-1 flex-1 max-w-[200px]">
            <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Unidade</label>
            <select className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
              <option>Todas as Unidades</option>
              <option>Sorocaba</option>
              <option>Indaiatuba</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-2 self-end">
          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200">
            <button 
              onClick={() => setRiskFilter('all')}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${riskFilter === 'all' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setRiskFilter('high')}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${riskFilter === 'high' ? 'bg-red-500 text-white shadow-sm' : 'text-zinc-500 hover:text-red-600'}`}
            >
              Alto Risco
            </button>
            <button 
              onClick={() => setRiskFilter('medium')}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${riskFilter === 'medium' ? 'bg-amber-500 text-white shadow-sm' : 'text-zinc-500 hover:text-amber-600'}`}
            >
              Médio
            </button>
          </div>
          <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-xl transition-colors border border-zinc-200">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Responses Table */}
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm h-fit">
          <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
            <h4 className="text-sm font-bold text-zinc-900">Resultados por Setor</h4>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{filteredSectors.length} setores encontrados</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-200">
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Setor</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-center">Respostas</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Score Risco</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tendência</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredSectors.map((sector) => (
                  <tr 
                    key={sector.id} 
                    onClick={() => setSelectedSector(sector)}
                    className={`cursor-pointer transition-colors group relative ${selectedSector?.id === sector.id ? 'bg-emerald-50/50' : 'hover:bg-zinc-50'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          sector.status === 'high' ? 'bg-red-500' : 
                          sector.status === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <span className="text-sm font-bold text-zinc-900">{sector.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-2 px-2 py-1 bg-zinc-100 rounded-lg">
                        <Users size={12} className="text-zinc-400" />
                        <span className="text-xs font-bold text-zinc-600">{sector.responses}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getStatusColor(sector.status)}`}>
                        {sector.score} - {getStatusLabel(sector.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1 text-xs font-bold ${
                        sector.trend > 0 ? 'text-red-600' : 
                        sector.trend < 0 ? 'text-emerald-600' : 'text-zinc-400'
                      }`}>
                        {sector.trend > 0 ? <ArrowUpRight size={14} /> : sector.trend < 0 ? <ArrowDownRight size={14} /> : null}
                        {sector.trend === 0 ? 'Estável' : `${Math.abs(sector.trend)}%`}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowActionMenu(showActionMenu === sector.id ? null : sector.id);
                            }}
                            className="p-2 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-400"
                          >
                            <MoreVertical size={18} />
                          </button>
                          
                          <AnimatePresence>
                            {showActionMenu === sector.id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(null)} />
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-zinc-100 z-20 overflow-hidden py-2"
                                >
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setSelectedSector(sector); setShowActionMenu(null); }}
                                    className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                                  >
                                    <Eye size={16} className="text-zinc-400" /> Ver Detalhes
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setShowActionPlanModal(true); setShowActionMenu(null); }}
                                    className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                                  >
                                    <Plus size={16} className="text-emerald-500" /> Criar Plano de Ação
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); addToast('Navegando para Planos de Ação...'); setShowActionMenu(null); }}
                                    className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                                  >
                                    <ClipboardList size={16} className="text-blue-500" /> Ver Planos Vinculados
                                  </button>
                                  <div className="h-px bg-zinc-100 my-1" />
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setShowExportModal(true); setShowActionMenu(null); }}
                                    className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                                  >
                                    <FileDown size={16} className="text-zinc-400" /> Exportar Resumo (PDF)
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); addToast('Exportando dados CSV...'); setShowActionMenu(null); }}
                                    className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                                  >
                                    <FileText size={16} className="text-zinc-400" /> Exportar Dados (CSV)
                                  </button>
                                  <div className="h-px bg-zinc-100 my-1" />
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setShowObservationModal(true); setShowActionMenu(null); }}
                                    className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                                  >
                                    <MessageSquare size={16} className="text-amber-500" /> Adicionar Observação
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); addToast('Abrindo galeria de evidências...'); setShowActionMenu(null); }}
                                    className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                                  >
                                    <ImageIcon size={16} className="text-zinc-400" /> Ver Evidências
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); addToast('Setor marcado em acompanhamento'); setShowActionMenu(null); }}
                                    className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                                  >
                                    <Activity size={16} className="text-zinc-400" /> Em Acompanhamento
                                  </button>
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                        <ChevronRight size={18} className={`transition-transform ${selectedSector?.id === sector.id ? 'translate-x-1 text-emerald-600' : 'text-zinc-300'}`} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedSector ? (
              <motion.div 
                key={selectedSector.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm h-full flex flex-col"
              >
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold text-zinc-900">{selectedSector.name}</h4>
                    <p className="text-xs text-zinc-500">Detalhamento do Setor</p>
                  </div>
                  <button onClick={() => setSelectedSector(null)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                    <X size={18} className="text-zinc-400" />
                  </button>
                </div>

                <div className="p-6 flex-1 space-y-8 overflow-y-auto custom-scrollbar">
                  {selectedSector.responses < 10 ? (
                    <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl text-center space-y-3">
                      <ShieldCheck size={32} className="text-amber-600 mx-auto" />
                      <div className="space-y-1">
                        <h5 className="text-sm font-bold text-amber-900">Privacidade Ativada</h5>
                        <p className="text-xs text-amber-700">Este setor possui apenas {selectedSector.responses} respostas. O detalhamento está oculto para garantir o anonimato dos colaboradores.</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Score Cards */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                          <p className="text-[10px] text-zinc-400 uppercase font-bold mb-1">Score Geral</p>
                          <div className="flex items-end gap-2">
                            <h4 className={`text-2xl font-bold ${selectedSector.status === 'high' ? 'text-red-600' : 'text-emerald-600'}`}>{selectedSector.score}</h4>
                            <span className="text-[10px] font-bold text-zinc-400 mb-1">/ 100</span>
                          </div>
                        </div>
                        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                          <p className="text-[10px] text-zinc-400 uppercase font-bold mb-1">Tendência</p>
                          <div className={`flex items-center gap-1 text-lg font-bold ${selectedSector.trend > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                            {selectedSector.trend > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                            {Math.abs(selectedSector.trend)}%
                          </div>
                        </div>
                      </div>

                      {/* Score by Block */}
                      <div className="space-y-4">
                        <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Score por Bloco</h5>
                        <div className="space-y-4">
                          {(selectedSector.scoresByBlock || [
                            { label: 'Ambiente', score: 45 },
                            { label: 'Relações', score: 32 },
                            { label: 'Carga', score: 78 },
                            { label: 'Gestão', score: 55 }
                          ]).map((block) => (
                            <button 
                              key={block.label} 
                              onClick={() => setShowBlockDetails(block)}
                              className="w-full text-left space-y-1.5 p-2 -mx-2 hover:bg-zinc-50 rounded-xl transition-colors group"
                            >
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-zinc-700 group-hover:text-emerald-600 transition-colors">{block.label}</span>
                                <span className={`font-bold ${block.score > 66 ? 'text-red-600' : block.score > 33 ? 'text-amber-600' : 'text-emerald-600'}`}>{block.score}</span>
                              </div>
                              <div className="w-full bg-zinc-100 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full transition-all duration-1000 ${block.score > 66 ? 'bg-red-500' : block.score > 33 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                  style={{ width: `${block.score}%` }} 
                                />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Recommended Actions */}
                      <div className="space-y-4">
                        <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ações Recomendadas</h5>
                        <div className="space-y-2">
                          {(selectedSector.recommendedActions || [
                            'Realizar feedback coletivo com a equipe',
                            'Revisar processos de comunicação interna'
                          ]).map((action, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-white border border-zinc-100 rounded-xl shadow-sm">
                              <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                <CheckCircle2 size={12} />
                              </div>
                              <p className="text-xs text-zinc-600 leading-relaxed">{action}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-6 bg-zinc-50 border-t border-zinc-100 space-y-3">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button 
                      onClick={() => setShowExportModal(true)}
                      className="flex items-center justify-center gap-2 py-2 border border-zinc-200 text-zinc-600 rounded-xl text-xs font-bold hover:bg-zinc-100 transition-colors"
                    >
                      <FileDown size={14} /> Exportar
                    </button>
                    <button 
                      onClick={() => setShowObservationModal(true)}
                      className="flex items-center justify-center gap-2 py-2 border border-zinc-200 text-zinc-600 rounded-xl text-xs font-bold hover:bg-zinc-100 transition-colors"
                    >
                      <MessageSquare size={14} /> Observação
                    </button>
                  </div>
                  <button 
                    onClick={() => setShowActionPlanModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/10"
                  >
                    <Plus size={18} />
                    Criar Plano de Ação
                  </button>
                  <button 
                    onClick={() => addToast('Navegando para Planos de Ação...')}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-zinc-200 text-zinc-600 rounded-2xl text-sm font-bold hover:bg-zinc-50 transition-colors"
                  >
                    <ExternalLink size={18} />
                    Ver Planos Vinculados
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white border border-zinc-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-6 h-full shadow-sm">
                <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300">
                  <LayoutGrid size={40} />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-zinc-900">Selecione um setor</h4>
                  <p className="text-sm text-zinc-500 max-w-[200px] mx-auto">Clique em uma linha da tabela para ver o detalhamento de riscos e recomendações.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Action Plan Modal */}
        {showActionPlanModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-emerald-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                    <Plus size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">Novo Plano de Ação (NR1)</h3>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Vínculo Automático Ativado</p>
                  </div>
                </div>
                <button onClick={() => setShowActionPlanModal(false)} className="p-2 hover:bg-emerald-100 rounded-xl transition-colors text-emerald-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Origem</label>
                    <div className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-bold text-zinc-500">NR1 Psicossocial</div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Setor</label>
                    <div className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-bold text-zinc-900">{selectedSector?.name || 'Não selecionado'}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Título do Plano</label>
                  <input 
                    type="text" 
                    defaultValue={`Plano de ação NR1 — Setor ${selectedSector?.name} — Ciclo Mar/2026`}
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Problema Identificado</label>
                  <textarea 
                    rows={3}
                    defaultValue={`Score geral ${selectedSector?.score} (${getStatusLabel(selectedSector?.status || 'low')}) — blocos críticos: ${selectedSector?.scoresByBlock?.filter(b => b.score > 60).map(b => b.label).join(', ')}`}
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Responsável</label>
                    <select className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <option>Selecione um responsável</option>
                      <option>Ricardo Silva (SESMT)</option>
                      <option>Ana Paula (RH)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Prazo</label>
                    <input type="date" className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                </div>
              </div>
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setShowActionPlanModal(false)} className="px-6 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl transition-colors">Cancelar</button>
                <button 
                  onClick={() => { addToast('Plano de ação criado com sucesso!'); setShowActionPlanModal(false); }}
                  className="px-8 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Salvar Plano
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                  <FileDown size={18} className="text-emerald-600" />
                  Exportar Dados do Setor
                </h3>
                <button onClick={() => setShowExportModal(false)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Tipo de Arquivo</label>
                  <div className="grid grid-cols-1 gap-2">
                    <label className="flex items-center gap-3 p-3 bg-zinc-50 hover:bg-zinc-100 rounded-2xl transition-colors cursor-pointer border border-zinc-100">
                      <input type="radio" name="exportType" defaultChecked className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-zinc-900">PDF Resumo</p>
                        <p className="text-[10px] text-zinc-500">Score geral, blocos e recomendações</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-zinc-50 hover:bg-zinc-100 rounded-2xl transition-colors cursor-pointer border border-zinc-100">
                      <input type="radio" name="exportType" className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-zinc-900">PDF Técnico</p>
                        <p className="text-[10px] text-zinc-500">Inclui planos de ação e evidências</p>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Opções Adicionais</label>
                  <label className="flex items-center gap-3 px-1 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                    <span className="text-xs text-zinc-600 font-medium">Incluir comparativo com ciclo anterior</span>
                  </label>
                </div>
              </div>
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setShowExportModal(false)} className="px-6 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl transition-colors">Cancelar</button>
                <button 
                  onClick={() => { addToast('Exportando relatório do setor...'); setShowExportModal(false); }}
                  className="px-8 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Gerar Arquivo
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Observation Modal */}
        {showObservationModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                  <MessageSquare size={18} className="text-amber-500" />
                  Adicionar Observação
                </h3>
                <button onClick={() => setShowObservationModal(false)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Observação</label>
                  <textarea 
                    rows={4}
                    placeholder="Registre aqui decisões tomadas ou riscos observados..."
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Tag de Classificação</label>
                  <div className="flex flex-wrap gap-2">
                    {['Decisão', 'Risco', 'Ação', 'Auditoria'].map(tag => (
                      <button key={tag} className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-full text-[10px] font-bold transition-colors">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setShowObservationModal(false)} className="px-6 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl transition-colors">Cancelar</button>
                <button 
                  onClick={() => { addToast('Observação registrada com sucesso!'); setShowObservationModal(false); }}
                  className="px-8 py-2 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/20"
                >
                  Salvar Observação
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Block Details Modal */}
        {showBlockDetails && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                  <Activity size={18} className="text-emerald-600" />
                  Detalhamento: {showBlockDetails.label}
                </h3>
                <button onClick={() => setShowBlockDetails(null)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Score do Bloco</p>
                    <h4 className={`text-3xl font-black ${showBlockDetails.score > 66 ? 'text-red-600' : 'text-emerald-600'}`}>{showBlockDetails.score}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</p>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      showBlockDetails.score > 66 ? 'bg-red-100 text-red-600' : 
                      showBlockDetails.score > 33 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {showBlockDetails.score > 66 ? 'Crítico' : showBlockDetails.score > 33 ? 'Alerta' : 'Saudável'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Análise Qualitativa</h4>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {showBlockDetails.details || 'Dados qualitativos detalhados estarão disponíveis após o fechamento completo do ciclo de auditoria.'}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Perguntas Críticas</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 flex justify-between items-center">
                      <span className="text-xs text-zinc-600">O ritmo de trabalho é excessivo?</span>
                      <span className="text-xs font-bold text-red-600">82% Sim</span>
                    </div>
                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 flex justify-between items-center">
                      <span className="text-xs text-zinc-600">Há pausas suficientes?</span>
                      <span className="text-xs font-bold text-red-600">15% Sim</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-zinc-50 border-t border-zinc-100">
                <button 
                  onClick={() => setShowBlockDetails(null)}
                  className="w-full py-3 bg-zinc-900 text-white rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-colors"
                >
                  Fechar Detalhes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
