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

export function PhysioView() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

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
      case 'referrals': return <PhysioReferrals />;
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
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2">
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
    </div>
  );
}
