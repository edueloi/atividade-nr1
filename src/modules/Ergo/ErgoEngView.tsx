import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Map, 
  ClipboardList, 
  HardHat, 
  CheckCircle2, 
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  ShieldCheck
} from 'lucide-react';

// Import Tab Components
import { ErgoOverview } from './tabs/ErgoOverview';
import { ErgoRiskMatrix } from './tabs/ErgoRiskMatrix';
import { ErgoPostEvaluations } from './tabs/ErgoPostEvaluations';
import { ErgoProjects } from './tabs/ErgoProjects';
import { ErgoActions } from './tabs/ErgoActions';
import { ErgoReports } from './tabs/ErgoReports';
import { Sector360Drawer } from './components/Sector360Drawer';

type ErgoTab = 'overview' | 'matrix' | 'evals' | 'projects' | 'actions' | 'reports';

export const ErgoEngView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ErgoTab>('overview');
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: <LayoutDashboard size={18} /> },
    { id: 'matrix', label: 'Matriz de Risco', icon: <Map size={18} /> },
    { id: 'evals', label: 'Avaliações de Posto', icon: <ClipboardList size={18} /> },
    { id: 'projects', label: 'Projetos (Eng)', icon: <HardHat size={18} /> },
    { id: 'actions', label: 'Ações Ergonômicas', icon: <CheckCircle2 size={18} /> },
    { id: 'reports', label: 'Relatórios & Evidências', icon: <FileText size={18} /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ErgoOverview onTabChange={(tab) => setActiveTab(tab as ErgoTab)} onOpenSector={setSelectedSectorId} />;
      case 'matrix':
        return <ErgoRiskMatrix onOpenSector={setSelectedSectorId} />;
      case 'evals':
        return <ErgoPostEvaluations onOpenSector={setSelectedSectorId} />;
      case 'projects':
        return <ErgoProjects onOpenSector={setSelectedSectorId} />;
      case 'actions':
        return <ErgoActions onOpenSector={setSelectedSectorId} />;
      case 'reports':
        return <ErgoReports onOpenSector={setSelectedSectorId} />;
      default:
        return <ErgoOverview onTabChange={(tab) => setActiveTab(tab as ErgoTab)} onOpenSector={setSelectedSectorId} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Ergonomia & Engenharia</h1>
          <p className="text-zinc-500 text-sm font-medium">Gestão de riscos biomecânicos e validação de projetos.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-xs font-bold">
            <ShieldCheck size={16} />
            Módulo Ativo
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-2xl w-fit border border-zinc-200 overflow-x-auto custom-scrollbar max-w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ErgoTab)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-white text-zinc-900 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderTabContent()}
      </motion.div>

      {/* Sector 360 Drawer */}
      <AnimatePresence>
        {selectedSectorId && (
          <Sector360Drawer 
            sectorId={selectedSectorId} 
            onClose={() => setSelectedSectorId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

