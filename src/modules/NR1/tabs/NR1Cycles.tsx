import React, { useState, useEffect } from 'react';
import { 
  MoreVertical, 
  Plus, 
  Search, 
  Calendar, 
  Users, 
  Link as LinkIcon, 
  QrCode, 
  Copy, 
  Trash2, 
  Play, 
  Square,
  ChevronRight,
  X,
  ShieldCheck,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  History,
  Info,
  ExternalLink,
  Edit3,
  Copy as CopyIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Cycle {
  id: string;
  name: string;
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED';
  startDate: string;
  endDate: string;
  unit: string;
  sectors: string[];
  adhesion: number;
  publicToken: string;
  formName: string;
  responsesCount: number;
  score: number;
  criticalSectors: number;
  createdBy: string;
  createdAt: string;
  activatedAt?: string;
  closedAt?: string;
}

export function NR1Cycles() {
  const [cycles, setCycles] = useState<Cycle[]>([
    {
      id: '1',
      name: 'Ciclo Março/2026 - Toyota Sorocaba',
      status: 'ACTIVE',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      unit: 'Unidade Sorocaba',
      sectors: ['Montagem', 'Logística'],
      adhesion: 85,
      publicToken: 'toyota-mar-26',
      formName: 'DRS Psicossocial v1',
      responsesCount: 142,
      score: 7.8,
      criticalSectors: 1,
      createdBy: 'Ricardo Prof',
      createdAt: '2026-02-20',
      activatedAt: '2026-03-01'
    },
    {
      id: '2',
      name: 'Ciclo Fevereiro/2026 - Usina Pilon',
      status: 'CLOSED',
      startDate: '2026-02-01',
      endDate: '2026-02-28',
      unit: 'Usina Pilon',
      sectors: ['Corte', 'Moenda'],
      adhesion: 92,
      publicToken: 'pilon-feb-26',
      formName: 'DRS Psicossocial v1',
      responsesCount: 86,
      score: 8.4,
      criticalSectors: 0,
      createdBy: 'Ricardo Prof',
      createdAt: '2026-01-15',
      activatedAt: '2026-02-01',
      closedAt: '2026-02-28'
    }
  ]);

  const [showNewModal, setShowNewModal] = useState(false);
  const [editingCycle, setEditingCycle] = useState<Cycle | null>(null);
  const [showQRModal, setShowQRModal] = useState<Cycle | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<Cycle | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const getStatusColor = (status: Cycle['status']) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-100 text-emerald-700';
      case 'CLOSED': return 'bg-zinc-100 text-zinc-700';
      case 'DRAFT': return 'bg-amber-100 text-amber-700';
    }
  };

  const getStatusLabel = (status: Cycle['status']) => {
    switch (status) {
      case 'ACTIVE': return 'Ativo';
      case 'CLOSED': return 'Encerrado';
      case 'DRAFT': return 'Rascunho';
    }
  };

  const handleActivate = (id: string) => {
    if (window.confirm('Ativar este ciclo? O link ficará disponível para respostas.')) {
      setCycles(prev => prev.map(c => c.id === id ? { ...c, status: 'ACTIVE', activatedAt: new Date().toISOString().split('T')[0] } : c));
      setActiveMenu(null);
    }
  };

  const handleClose = (id: string) => {
    if (window.confirm('Encerrar ciclo agora? O link será desativado e não aceitará novas respostas.')) {
      setCycles(prev => prev.map(c => c.id === id ? { ...c, status: 'CLOSED', closedAt: new Date().toISOString().split('T')[0] } : c));
      setActiveMenu(null);
    }
  };

  const handleDuplicate = (cycle: Cycle) => {
    const newCycle: Cycle = {
      ...cycle,
      id: `cycle-${Date.now()}`,
      name: `${cycle.name} (Cópia)`,
      status: 'DRAFT',
      adhesion: 0,
      responsesCount: 0,
      score: 0,
      criticalSectors: 0,
      createdAt: new Date().toISOString().split('T')[0],
      activatedAt: undefined,
      closedAt: undefined,
      publicToken: `${cycle.publicToken}-copy-${Date.now()}`
    };
    setCycles([newCycle, ...cycles]);
    setActiveMenu(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Excluir este ciclo permanentemente?')) {
      setCycles(prev => prev.filter(c => c.id !== id));
      setActiveMenu(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar ciclos..." 
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-100 rounded-xl transition-colors">
            Exportar CSV
          </button>
          <button 
            onClick={() => { setEditingCycle(null); setShowNewModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/10"
          >
            <Plus size={18} />
            Novo Ciclo
          </button>
        </div>
      </div>

      {/* Cycles List */}
      <div className="grid grid-cols-1 gap-4">
        {cycles.map((cycle) => (
          <div 
            key={cycle.id}
            className="group bg-white border border-zinc-200 rounded-2xl p-6 hover:border-emerald-500 transition-all shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-bold text-zinc-900">{cycle.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(cycle.status)}`}>
                    {getStatusLabel(cycle.status)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {cycle.startDate} até {cycle.endDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    {cycle.unit} ({cycle.sectors.join(', ')})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[10px] text-zinc-400 uppercase font-bold mb-1">Adesão</p>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-zinc-100 rounded-full h-1.5">
                      <div 
                        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                        style={{ width: `${cycle.adhesion}%` }} 
                      />
                    </div>
                    <span className="text-sm font-bold text-zinc-900">{cycle.adhesion}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 relative">
                  {cycle.status === 'ACTIVE' && (
                    <button 
                      onClick={() => setShowQRModal(cycle)}
                      className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                      title="Gerar Link/QR"
                    >
                      <QrCode size={18} />
                    </button>
                  )}
                  
                  <div className="relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === cycle.id ? null : cycle.id)}
                      className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
                    >
                      <MoreVertical size={18} />
                    </button>

                    <AnimatePresence>
                      {activeMenu === cycle.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-0 mt-2 w-56 bg-white border border-zinc-200 rounded-2xl shadow-xl z-20 overflow-hidden"
                          >
                            <div className="p-2 space-y-1">
                              <button 
                                onClick={() => { setSelectedCycle(cycle); setActiveMenu(null); }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 rounded-xl transition-colors"
                              >
                                <Info size={16} />
                                Ver detalhes
                              </button>
                              {cycle.status === 'DRAFT' && (
                                <button 
                                  onClick={() => { setEditingCycle(cycle); setShowNewModal(true); setActiveMenu(null); }}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 rounded-xl transition-colors"
                                >
                                  <Edit3 size={16} />
                                  Editar ciclo
                                </button>
                              )}
                              {cycle.status === 'ACTIVE' && (
                                <button 
                                  onClick={() => { setShowQRModal(cycle); setActiveMenu(null); }}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 rounded-xl transition-colors"
                                >
                                  <LinkIcon size={16} />
                                  Gerar Link / QR
                                </button>
                              )}
                              <button 
                                onClick={() => handleDuplicate(cycle)}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 rounded-xl transition-colors"
                              >
                                <CopyIcon size={16} />
                                Duplicar ciclo
                              </button>
                              {cycle.status === 'ACTIVE' && (
                                <button 
                                  onClick={() => handleClose(cycle.id)}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                                >
                                  <Square size={16} />
                                  Encerrar ciclo
                                </button>
                              )}
                              {cycle.status === 'DRAFT' && (
                                <button 
                                  onClick={() => handleDelete(cycle.id)}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                >
                                  <Trash2 size={16} />
                                  Excluir
                                </button>
                              )}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  <button 
                    onClick={() => setSelectedCycle(cycle)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-xs font-bold hover:bg-zinc-800 transition-colors"
                  >
                    Ver Detalhes
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cycle Details Drawer */}
      <AnimatePresence>
        {selectedCycle && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCycle(null)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto custom-scrollbar"
            >
              <div className="p-6 border-b border-zinc-100 sticky top-0 bg-white z-10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <History size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">{selectedCycle.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(selectedCycle.status)}`}>
                      {getStatusLabel(selectedCycle.status)}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedCycle(null)} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <p className="text-[10px] text-zinc-400 uppercase font-bold mb-1">Período</p>
                    <p className="text-xs font-bold text-zinc-900">{selectedCycle.startDate} → {selectedCycle.endDate}</p>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <p className="text-[10px] text-zinc-400 uppercase font-bold mb-1">Formulário</p>
                    <p className="text-xs font-bold text-zinc-900">{selectedCycle.formName}</p>
                  </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white border border-zinc-200 rounded-2xl text-center">
                    <p className="text-[10px] text-zinc-400 uppercase font-bold mb-1">Adesão</p>
                    <h4 className="text-2xl font-bold text-emerald-600">{selectedCycle.adhesion}%</h4>
                    <p className="text-[10px] text-zinc-400 mt-1">{selectedCycle.responsesCount} respostas</p>
                  </div>
                  <div className="p-4 bg-white border border-zinc-200 rounded-2xl text-center">
                    <p className="text-[10px] text-zinc-400 uppercase font-bold mb-1">Score Geral</p>
                    <h4 className="text-2xl font-bold text-blue-600">{selectedCycle.score}</h4>
                    <p className="text-[10px] text-zinc-400 mt-1">{selectedCycle.criticalSectors} setores críticos</p>
                  </div>
                </div>

                {/* Link/QR Section */}
                {selectedCycle.status === 'ACTIVE' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Link & QR Code</h4>
                    <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-200 flex flex-col items-center gap-4">
                      <div className="w-32 h-32 bg-white p-2 rounded-2xl border border-zinc-100 shadow-sm">
                        <QrCode size="100%" />
                      </div>
                      <div className="w-full flex items-center gap-2 p-2 bg-white border border-zinc-200 rounded-xl">
                        <span className="text-[10px] text-zinc-500 truncate flex-1">https://sst.platform/nr1/s/{selectedCycle.publicToken}</span>
                        <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                          <Copy size={14} />
                        </button>
                      </div>
                      <button className="w-full py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors">
                        Baixar QR Code
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ações Rápidas</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedCycle.status === 'DRAFT' && (
                      <button 
                        onClick={() => handleActivate(selectedCycle.id)}
                        className="w-full flex items-center justify-between p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 hover:bg-emerald-100 transition-all font-bold text-sm"
                      >
                        Ativar Ciclo
                        <Play size={18} />
                      </button>
                    )}
                    {selectedCycle.status === 'ACTIVE' && (
                      <button 
                        onClick={() => handleClose(selectedCycle.id)}
                        className="w-full flex items-center justify-between p-4 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100 hover:bg-amber-100 transition-all font-bold text-sm"
                      >
                        Encerrar Ciclo
                        <Square size={18} />
                      </button>
                    )}
                    <button className="w-full flex items-center justify-between p-4 bg-zinc-50 text-zinc-700 rounded-2xl border border-zinc-100 hover:bg-zinc-100 transition-all font-bold text-sm">
                      Exportar Resumo (CSV)
                      <Download size={18} />
                    </button>
                  </div>
                </div>

                {/* Audit Trail */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Trilha de Auditoria</h4>
                  <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-100">
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1 w-6 h-6 bg-zinc-100 text-zinc-400 rounded-full flex items-center justify-center border-4 border-white">
                        <Plus size={12} />
                      </div>
                      <p className="text-xs font-bold text-zinc-900">Criado por {selectedCycle.createdBy}</p>
                      <p className="text-[10px] text-zinc-400">{selectedCycle.createdAt}</p>
                    </div>
                    {selectedCycle.activatedAt && (
                      <div className="relative pl-8">
                        <div className="absolute left-0 top-1 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center border-4 border-white">
                          <Play size={12} />
                        </div>
                        <p className="text-xs font-bold text-zinc-900">Ativado por {selectedCycle.createdBy}</p>
                        <p className="text-[10px] text-zinc-400">{selectedCycle.activatedAt}</p>
                      </div>
                    )}
                    {selectedCycle.closedAt && (
                      <div className="relative pl-8">
                        <div className="absolute left-0 top-1 w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center border-4 border-white">
                          <Square size={12} />
                        </div>
                        <p className="text-xs font-bold text-zinc-900">Encerrado por {selectedCycle.createdBy}</p>
                        <p className="text-[10px] text-zinc-400">{selectedCycle.closedAt}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* New/Edit Cycle Modal */}
      <AnimatePresence>
        {showNewModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900">{editingCycle ? 'Editar Ciclo' : 'Novo Ciclo de Aplicação'}</h3>
                  <p className="text-sm text-zinc-500">Configure a campanha de mapeamento</p>
                </div>
                <button onClick={() => setShowNewModal(false)} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Nome do Ciclo</label>
                    <input 
                      type="text" 
                      defaultValue={editingCycle?.name}
                      placeholder="Ex: Ciclo Abril/2026"
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Formulário</label>
                    <select 
                      defaultValue={editingCycle?.formName}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    >
                      <option>DRS Psicossocial v1 (Publicado)</option>
                      <option>Mapeamento Clima v2 (Publicado)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Unidade</label>
                    <select 
                      defaultValue={editingCycle?.unit}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    >
                      <option>Unidade Sorocaba</option>
                      <option>Usina Pilon</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Setores</label>
                    <div className="flex flex-wrap gap-2 p-2 bg-zinc-50 border border-zinc-200 rounded-2xl min-h-[46px]">
                      {(editingCycle?.sectors || ['Montagem']).map(s => (
                        <span key={s} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg flex items-center gap-1">
                          {s} <X size={10} />
                        </span>
                      ))}
                      <button className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600">+ Adicionar</button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Data Início</label>
                    <input 
                      type="date" 
                      defaultValue={editingCycle?.startDate}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Data Fim</label>
                    <input 
                      type="date" 
                      defaultValue={editingCycle?.endDate}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                    />
                  </div>
                </div>

                <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl">
                  <h5 className="text-xs font-bold text-amber-800 mb-3 flex items-center gap-2">
                    <ShieldCheck size={16} /> Regras de Privacidade
                  </h5>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 border-2 border-amber-300 rounded flex items-center justify-center bg-white group-hover:border-amber-500 transition-colors">
                        <div className="w-2.5 h-2.5 bg-amber-600 rounded-sm" />
                      </div>
                      <span className="text-xs text-amber-700 font-medium">Exibir respostas somente agregadas (mínimo 10 respostas)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 border-2 border-amber-300 rounded flex items-center justify-center bg-white group-hover:border-amber-500 transition-colors">
                        <div className="w-2.5 h-2.5 bg-amber-600 rounded-sm" />
                      </div>
                      <span className="text-xs text-amber-700 font-medium">Ocultar campos de texto aberto para o cliente</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button 
                  onClick={() => setShowNewModal(false)}
                  className="px-6 py-3 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-2xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => setShowNewModal(false)}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  {editingCycle ? 'Salvar Alterações' : 'Salvar e Ativar'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-zinc-900">Distribuir Ciclo</h3>
                <button onClick={() => setShowQRModal(null)} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 flex flex-col items-center text-center space-y-6">
                <div className="p-6 bg-zinc-50 rounded-[40px] border-2 border-dashed border-zinc-200">
                  <div className="w-48 h-48 bg-white rounded-3xl flex items-center justify-center border border-zinc-100 shadow-inner">
                    <QrCode size={140} className="text-zinc-900" />
                  </div>
                </div>

                <div className="space-y-2 w-full">
                  <p className="text-sm font-bold text-zinc-900">{showQRModal.name}</p>
                  <p className="text-xs text-zinc-500">Aponte a câmera para responder ao questionário</p>
                  <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Expira em: {showQRModal.endDate}</p>
                </div>

                <div className="w-full p-3 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-between gap-3">
                  <span className="text-[10px] text-zinc-500 truncate font-mono">https://sst.platform/nr1/s/{showQRModal.publicToken}</span>
                  <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                    <CopyIcon size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <button className="flex items-center justify-center gap-2 px-4 py-3 border border-zinc-200 text-zinc-600 rounded-2xl text-sm font-bold hover:bg-zinc-50 transition-colors">
                    <Download size={18} />
                    Baixar QR
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20">
                    <CopyIcon size={18} />
                    Copiar Link
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
