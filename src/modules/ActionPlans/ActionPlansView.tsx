import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  CheckSquare, 
  FileText, 
  Plus, 
  Download, 
  Bell, 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
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
  Kanban,
  List
} from 'lucide-react';

import { PlanOverview } from './tabs/PlanOverview';
import { PlanList } from './tabs/PlanList';
import { ActionList } from './tabs/ActionList';
import { PlanReports } from './tabs/PlanReports';
import { ActionPlan, ActionItem } from './types';

// Mock Data
const mockPlans: ActionPlan[] = [
  { id: '1', name: 'Plano NR1 – Montagem – Ciclo Mar/2026', origin: 'NR1', unit: 'Unidade 1', sector: 'Montagem', status: 'Em andamento', priority: 'Alta', progress: 65, dueDate: '30/03/2026', responsible: 'Dr. Silva', actionsCount: 12, completedActionsCount: 8 },
  { id: '2', name: 'Correção Ergonômica – Logística', origin: 'Ergo', unit: 'Unidade 1', sector: 'Logística', status: 'Aberto', priority: 'Média', progress: 0, dueDate: '15/04/2026', responsible: 'Dra. Maria', actionsCount: 5, completedActionsCount: 0 },
  { id: '3', name: 'Plano Preventivo – Pintura', origin: 'Fisio', unit: 'Unidade 2', sector: 'Pintura', status: 'Em validação', priority: 'Baixa', progress: 90, dueDate: '10/03/2026', responsible: 'Dr. Carlos', actionsCount: 10, completedActionsCount: 9 },
  { id: '4', name: 'Ajuste de Posto de Trabalho – Solda', origin: 'Queixa', unit: 'Unidade 1', sector: 'Solda', status: 'Concluído', priority: 'Alta', progress: 100, dueDate: '01/03/2026', responsible: 'Dr. Silva', actionsCount: 4, completedActionsCount: 4 },
  { id: '5', name: 'Redução de Absenteísmo – Estamparia', origin: 'Absenteísmo', unit: 'Unidade 1', sector: 'Estamparia', status: 'Cancelado', priority: 'Média', progress: 20, dueDate: '20/03/2026', responsible: 'Dra. Maria', actionsCount: 8, completedActionsCount: 1 },
];

const mockActions: ActionItem[] = [
  { id: '1', planId: '1', planName: 'Plano NR1 – Montagem', title: 'Ajustar altura da bancada de solda', sector: 'Montagem', unit: 'Unidade 1', responsible: 'Dr. Silva', dueDate: '15/03/2026', status: 'Em andamento', priority: 'Alta', evidenceRequired: true, hasEvidence: false, origin: 'NR1' },
  { id: '2', planId: '1', planName: 'Plano NR1 – Montagem', title: 'Treinamento de postura para operadores', sector: 'Montagem', unit: 'Unidade 1', responsible: 'Dra. Maria', dueDate: '10/03/2026', status: 'Atrasada', priority: 'Média', evidenceRequired: true, hasEvidence: false, origin: 'NR1' },
  { id: '3', planId: '2', planName: 'Correção Ergonômica – Logística', title: 'Instalação de tapetes antifadiga', sector: 'Logística', unit: 'Unidade 1', responsible: 'Dr. Carlos', dueDate: '20/03/2026', status: 'Pendente', priority: 'Baixa', evidenceRequired: false, hasEvidence: false, origin: 'Ergo' },
  { id: '4', planId: '1', planName: 'Plano NR1 – Montagem', title: 'Substituição de cadeiras ergonômicas', sector: 'Montagem', unit: 'Unidade 1', responsible: 'Dr. Silva', dueDate: '05/03/2026', status: 'Concluída', priority: 'Alta', evidenceRequired: true, hasEvidence: true, origin: 'NR1' },
  { id: '5', planId: '3', planName: 'Plano Preventivo – Pintura', title: 'Revisão de iluminação no posto 4', sector: 'Pintura', unit: 'Unidade 2', responsible: 'Dra. Maria', dueDate: '12/03/2026', status: 'Aguardando evidência', priority: 'Média', evidenceRequired: true, hasEvidence: false, origin: 'Fisio' },
];

type TabType = 'visao' | 'planos' | 'acoes' | 'relatorios';

export default function ActionPlansView() {
  const [activeTab, setActiveTab] = useState<TabType>('visao');
  const [plans, setPlans] = useState<ActionPlan[]>(mockPlans);
  const [actions, setActions] = useState<ActionItem[]>(mockActions);
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [showCreateActionModal, setShowCreateActionModal] = useState(false);
  const [actionFilter, setActionFilter] = useState<string | undefined>(undefined);

  const [newPlan, setNewPlan] = useState<Partial<ActionPlan>>({
    origin: 'NR1',
    responsible: 'Dr. Silva',
    unit: 'Unidade 1',
    sector: 'Montagem',
    priority: 'Alta',
    dueDate: new Date().toISOString().split('T')[0]
  });

  const [newAction, setNewAction] = useState<Partial<ActionItem>>({
    responsible: 'Dr. Silva',
    priority: 'Alta',
    status: 'Pendente',
    dueDate: new Date().toISOString().split('T')[0],
    evidenceRequired: false
  });

  const handleCreatePlan = () => {
    const plan: ActionPlan = {
      id: Math.random().toString(36).substr(2, 9),
      name: newPlan.name || 'Novo Plano',
      origin: newPlan.origin as any,
      unit: newPlan.unit!,
      sector: newPlan.sector!,
      status: 'Aberto',
      priority: newPlan.priority as any,
      progress: 0,
      dueDate: newPlan.dueDate!,
      responsible: newPlan.responsible!,
      actionsCount: 0,
      completedActionsCount: 0
    };
    setPlans([plan, ...plans]);
    setShowCreatePlanModal(false);
    setActiveTab('planos');
  };

  const handleCreateAction = () => {
    const parentPlan = plans[0]; // Default to first plan for mock purposes
    const action: ActionItem = {
      id: Math.random().toString(36).substr(2, 9),
      planId: parentPlan?.id || '1',
      planName: parentPlan?.name || 'Plano Geral',
      title: newAction.title || 'Nova Ação',
      sector: parentPlan?.sector || 'Montagem',
      unit: parentPlan?.unit || 'Unidade 1',
      responsible: newAction.responsible!,
      dueDate: newAction.dueDate!,
      status: newAction.status as any,
      priority: newAction.priority as any,
      evidenceRequired: newAction.evidenceRequired!,
      hasEvidence: false,
      origin: parentPlan?.origin || 'NR1'
    };
    setActions([action, ...actions]);
    setShowCreateActionModal(false);
    setActiveTab('acoes');
  };

  const tabs = [
    { id: 'visao', label: 'Visão Geral', icon: <LayoutDashboard size={18} /> },
    { id: 'planos', label: 'Planos (Lista/Kanban)', icon: <ClipboardList size={18} /> },
    { id: 'acoes', label: 'Ações (Itens)', icon: <CheckSquare size={18} /> },
    { id: 'relatorios', label: 'Relatórios', icon: <FileText size={18} /> },
  ];

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    if (tabId !== 'acoes') {
      setActionFilter(undefined);
    }
  };

  const handleNavigateToActions = (filter?: string) => {
    setActionFilter(filter);
    setActiveTab('acoes');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-900 text-white rounded-2xl shadow-xl shadow-zinc-900/20">
              <CheckSquare size={24} />
            </div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Plano de Ação</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium ml-14">Transformando dados em correção comprovada</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-3 bg-white border border-zinc-200 text-zinc-600 rounded-2xl hover:bg-zinc-50 transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <button className="px-6 py-3 bg-white border border-zinc-200 text-zinc-600 rounded-2xl font-bold text-sm hover:bg-zinc-50 transition-all flex items-center gap-2">
            <Download size={18} /> Exportar
          </button>
          <button 
            onClick={() => setShowCreatePlanModal(true)}
            className="px-6 py-3 bg-zinc-900 text-white rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-xl shadow-zinc-900/20"
          >
            <Plus size={18} /> Novo Plano
          </button>
          <button 
            onClick={() => setShowCreateActionModal(true)}
            className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-xl shadow-emerald-600/20"
          >
            <Plus size={18} /> Nova Ação
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 bg-white p-1.5 rounded-3xl border border-zinc-200 shadow-sm mb-8 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as TabType)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/20' 
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'visao' && <PlanOverview onNavigateToActions={handleNavigateToActions} />}
          {activeTab === 'planos' && <PlanList plans={plans} setPlans={setPlans} />}
          {activeTab === 'acoes' && <ActionList actions={actions} setActions={setActions} initialFilter={actionFilter} />}
          {activeTab === 'relatorios' && <PlanReports />}
        </motion.div>
      </AnimatePresence>

      {/* Modal + Criar Plano */}
      {showCreatePlanModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] w-full max-w-lg p-8 shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-zinc-900 text-white rounded-xl">
                  <PlusCircle size={20} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900">Criar Novo Plano</h3>
              </div>
              <button onClick={() => setShowCreatePlanModal(false)} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            
            <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nome do Plano</label>
                <input 
                  type="text" 
                  placeholder="Ex: Plano NR1 – Montagem – Ciclo Mar/2026" 
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/20" 
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Origem</label>
                  <select 
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                    onChange={(e) => setNewPlan({ ...newPlan, origin: e.target.value as any })}
                  >
                    <option>NR1</option>
                    <option>Ergo</option>
                    <option>Queixa</option>
                    <option>Fisio</option>
                    <option>Absenteísmo</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Responsável Geral</label>
                  <select 
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                    onChange={(e) => setNewPlan({ ...newPlan, responsible: e.target.value })}
                  >
                    <option>Dr. Silva</option>
                    <option>Dra. Maria</option>
                    <option>Dr. Carlos</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Unidade</label>
                  <select 
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                    onChange={(e) => setNewPlan({ ...newPlan, unit: e.target.value })}
                  >
                    <option>Unidade 1</option>
                    <option>Unidade 2</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Setor</label>
                  <select 
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                    onChange={(e) => setNewPlan({ ...newPlan, sector: e.target.value })}
                  >
                    <option>Montagem</option>
                    <option>Logística</option>
                    <option>Pintura</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Prioridade</label>
                  <select 
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                    onChange={(e) => setNewPlan({ ...newPlan, priority: e.target.value as any })}
                  >
                    <option>Alta</option>
                    <option>Média</option>
                    <option>Baixa</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Prazo Final</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/20" 
                    onChange={(e) => setNewPlan({ ...newPlan, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Observação</label>
                <textarea rows={2} placeholder="Detalhes adicionais sobre o plano..." className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/20" />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-zinc-100">
              <button onClick={() => setShowCreatePlanModal(false)} className="px-6 py-3 text-zinc-600 font-bold text-sm hover:bg-zinc-100 rounded-2xl transition-all">Cancelar</button>
              <button onClick={handleCreatePlan} className="px-8 py-3 bg-zinc-900 text-white font-bold text-sm rounded-2xl hover:bg-zinc-800 shadow-xl shadow-zinc-900/20 transition-all">Criar Plano</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal + Nova Ação */}
      {showCreateActionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] w-full max-w-lg p-8 shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-600 text-white rounded-xl">
                  <CheckSquare size={20} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900">Nova Ação (Item)</h3>
              </div>
              <button onClick={() => setShowCreateActionModal(false)} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            
            <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Título da Ação</label>
                <input 
                  type="text" 
                  placeholder="Ex: Ajustar altura da bancada" 
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20" 
                  onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Descrição Curta</label>
                <textarea 
                  rows={2} 
                  placeholder="O que deve ser feito?" 
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20" 
                  onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Responsável</label>
                  <select 
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    onChange={(e) => setNewAction({ ...newAction, responsible: e.target.value })}
                  >
                    <option>Dr. Silva</option>
                    <option>Dra. Maria</option>
                    <option>Dr. Carlos</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Prazo</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20" 
                    onChange={(e) => setNewAction({ ...newAction, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Prioridade</label>
                  <select 
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    onChange={(e) => setNewAction({ ...newAction, priority: e.target.value as any })}
                  >
                    <option>Alta</option>
                    <option>Média</option>
                    <option>Baixa</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Status Inicial</label>
                  <select 
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    onChange={(e) => setNewAction({ ...newAction, status: e.target.value as any })}
                  >
                    <option>Pendente</option>
                    <option>Em andamento</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl">
                <input 
                  type="checkbox" 
                  id="evidence-req" 
                  className="w-5 h-5 rounded-lg border-zinc-300 text-emerald-600 focus:ring-emerald-500" 
                  onChange={(e) => setNewAction({ ...newAction, evidenceRequired: e.target.checked })}
                />
                <label htmlFor="evidence-req" className="text-xs font-bold text-zinc-700 cursor-pointer">Evidência obrigatória para conclusão?</label>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Tags / Vínculo</label>
                <div className="flex flex-wrap gap-2">
                  {['NR1', 'Ergo', 'Queixa', 'Fisio', 'Absenteísmo'].map(tag => (
                    <button key={tag} className="px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-[10px] font-bold text-zinc-500 hover:border-emerald-500 hover:text-emerald-600 transition-all">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-zinc-100">
              <button onClick={() => setShowCreateActionModal(false)} className="px-6 py-3 text-zinc-600 font-bold text-sm hover:bg-zinc-100 rounded-2xl transition-all">Cancelar</button>
              <button onClick={handleCreateAction} className="px-8 py-3 bg-emerald-600 text-white font-bold text-sm rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all">Criar Ação</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
