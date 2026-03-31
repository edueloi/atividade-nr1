import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  ClipboardList, 
  Calendar, 
  FileText, 
  LayoutDashboard, 
  Plus, 
  Filter, 
  Search,
  ChevronRight,
  MoreVertical,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  Stethoscope,
  HardHat,
  Image as ImageIcon,
  Download,
  History,
  X,
  ArrowUpRight,
  MessageSquare,
  ExternalLink,
  PlusCircle,
  CalendarDays,
  ListFilter,
  BarChart3,
  PieChart,
  Target,
  ArrowDownRight,
  ShieldCheck,
  AlertTriangle,
  Trash2,
  Edit3,
  Archive,
  Eye,
  UserPlus,
  CalendarCheck,
  FileDown,
  RefreshCw
} from 'lucide-react';

import { PhysioOverview } from './tabs/PhysioOverview';
import { PhysioReferrals } from './tabs/PhysioReferrals';
import { PhysioCases } from './tabs/PhysioCases';
import { PhysioSessions } from './tabs/PhysioSessions';
import { PhysioReports } from './tabs/PhysioReports';

type TabId = 'overview' | 'referrals' | 'cases' | 'sessions' | 'reports';

import { AppModal } from '../../components/ui/AppModal';
import { ModalButton } from '../../components/ui/ModalButton';
import { mockReferrals } from './tabs/PhysioReferrals';
import { Referral } from './types';

export function PhysioView() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>(mockReferrals);

  const [newPlan, setNewPlan] = useState({
    origin: '',
    collaborator: '',
    sector: '',
    bodyStructure: '',
    severity: 'Moderada',
    notes: ''
  });

  const handleCreatePlan = () => {
    const originMap: Record<string, string> = {
      ambulatorio: 'Ambulatório',
      ergonomia: 'Ergonomia',
      queixa: 'Queixa',
      nr1: 'NR1'
    };
    const bodyMap: Record<string, string> = {
      lombar: 'Lombar',
      ombro: 'Ombro',
      cervical: 'Cervical',
      punho: 'Punho/Mão',
      joelho: 'Joelho',
      outro: 'Outro'
    };

    const newRef: Referral = {
      id: Math.random().toString(36).slice(2, 9),
      date: new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      origin: (originMap[newPlan.origin] || 'Queixa') as "Ambulatório" | "Ergonomia" | "Queixa" | "NR1",
      unit: 'Unidade 1',
      sector: newPlan.sector || 'Geral',
      bodyStructure: bodyMap[newPlan.bodyStructure] || 'Não especificada',
      severity: newPlan.severity as any,
      status: 'Novo',
      notes: newPlan.notes
    };
    
    setReferrals(prev => [newRef, ...prev]);
    setShowCreateModal(false);
    setActiveTab('referrals');
    setNewPlan({ origin: '', collaborator: '', sector: '', bodyStructure: '', severity: 'Moderada', notes: '' });
  };

  const tabs = [
    { id: 'overview', label: 'Visão (Dashboard)', icon: <LayoutDashboard size={18} /> },
    { id: 'referrals', label: 'Encaminhamentos (Fila)', icon: <ClipboardList size={18} /> },
    { id: 'cases', label: 'Casos (Tratamentos)', icon: <Activity size={18} /> },
    { id: 'sessions', label: 'Sessões (Agenda)', icon: <Calendar size={18} /> },
    { id: 'reports', label: 'Relatórios', icon: <FileText size={18} /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <PhysioOverview onNavigate={setActiveTab} />;
      case 'referrals': return <PhysioReferrals data={referrals} />;
      case 'cases': return <PhysioCases />;
      case 'sessions': return <PhysioSessions />;
      case 'reports': return <PhysioReports />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-8 pt-8 pb-0 border-b border-zinc-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black text-zinc-900">Fisioterapia</h2>
              <p className="text-sm text-zinc-500 font-medium tracking-tight">Gestão de reabilitação e atendimentos clínicos</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Criar Plano de Ação
              </button>
            </div>
          </div>

          <div className="flex items-center gap-8 overflow-x-auto custom-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`flex items-center gap-2 py-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-zinc-400 hover:text-zinc-600'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
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
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showCreateModal && (
          <AppModal
            title="Novo Encaminhamento / Plano"
            description="Crie um novo plano de ação ou direcione o colaborador para a fila de fisioterapia."
            icon={<ClipboardList size={20} />}
            onClose={() => setShowCreateModal(false)}
            maxWidthClassName="max-w-xl"
            bodyClassName="p-0 border-t border-zinc-100"
          >
            <div className="bg-zinc-50 p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Origem</span>
                  <select 
                    value={newPlan.origin}
                    onChange={(e) => setNewPlan({ ...newPlan, origin: e.target.value })}
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Selecione...</option>
                    <option value="ambulatorio">Ambulatório Médico</option>
                    <option value="ergonomia">Equipe de Ergonomia</option>
                    <option value="queixa">Queixa Direta</option>
                    <option value="nr1">Desdobramento NR1</option>
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Colaborador</span>
                  <input
                    type="text"
                    value={newPlan.collaborator}
                    onChange={(e) => setNewPlan({ ...newPlan, collaborator: e.target.value })}
                    placeholder="Nome completo ou Matrícula"
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 transition-colors"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Setor</span>
                  <input
                    type="text"
                    value={newPlan.sector}
                    onChange={(e) => setNewPlan({ ...newPlan, sector: e.target.value })}
                    placeholder="Ex: Montagem, Pintura"
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 transition-colors"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Local da Dor/Queixa</span>
                  <select 
                    value={newPlan.bodyStructure}
                    onChange={(e) => setNewPlan({ ...newPlan, bodyStructure: e.target.value })}
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Selecione...</option>
                    <option value="lombar">Lombar / Coluna</option>
                    <option value="ombro">Ombro</option>
                    <option value="cervical">Cervical</option>
                    <option value="punho">Punho / Mão</option>
                    <option value="joelho">Joelho</option>
                    <option value="outro">Outro</option>
                  </select>
                </label>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Severidade Sugerida</span>
                <div className="grid grid-cols-3 gap-3">
                  {['Leve', 'Moderada', 'Alta'].map(sev => (
                    <button 
                      key={sev} 
                      onClick={() => setNewPlan({ ...newPlan, severity: sev })}
                      className={`rounded-xl border py-2 text-xs font-bold transition-colors ${
                        newPlan.severity === sev 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                          : 'border-zinc-200 bg-white text-zinc-600 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <label className="space-y-2 flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Observações Iniciais</span>
                <textarea
                  value={newPlan.notes}
                  onChange={(e) => setNewPlan({ ...newPlan, notes: e.target.value })}
                  placeholder="Relate os sintomas, há quanto tempo ocorrem, restrições..."
                  className="w-full min-h-[100px] rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 transition-colors resize-none"
                />
              </label>

              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
                <p className="text-xs font-bold text-emerald-900 flex items-center gap-2">
                  <ShieldCheck size={16} /> Próximo Passo Automático
                </p>
                <p className="text-[11px] text-emerald-700 mt-1">
                  Este registro irá direto para a "Fila de Encaminhamentos", 
                  onde o profissional de Fisioterapia fará a triagem presencial ou agendamento de sessão de avaliação.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
                <ModalButton
                  variant="primary"
                  onClick={handleCreatePlan}
                  iconLeft={<PlusCircle size={16} />}
                  fullWidth
                >
                  Confirmar Encaminhamento
                </ModalButton>
                <ModalButton
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                  fullWidth
                >
                  Cancelar
                </ModalButton>
              </div>
            </div>
          </AppModal>
        )}
      </AnimatePresence>
    </div>
  );
}
