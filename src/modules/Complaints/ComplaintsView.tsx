import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  List, 
  Activity, 
  Settings,
  Plus
} from 'lucide-react';
import { ComplaintsDashboard } from './tabs/ComplaintsDashboard.js';
import { ComplaintsList } from './tabs/ComplaintsList.js';
import { ComplaintsTracking } from './tabs/ComplaintsTracking.js';
import { ComplaintsConfig } from './tabs/ComplaintsConfig.js';

type TabType = 'summary' | 'list' | 'tracking' | 'config';

export function ComplaintsView() {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [listFilters, setListFilters] = useState<any>(null);

  const tabs = [
    { id: 'summary', label: 'Resumo', icon: LayoutDashboard },
    { id: 'list', label: 'Registros', icon: List },
    { id: 'tracking', label: 'Triagem / Acompanhamento', icon: Activity },
    { id: 'config', label: 'Config / Catálogos', icon: Settings },
  ];

  const handleNavigate = (tab: string, filters?: any) => {
    setListFilters(filters || null);
    setActiveTab(tab as TabType);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Gestão de Queixas</h2>
          <p className="text-zinc-500 text-sm">Monitoramento preventivo e ambulatorial de sintomas e dores</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleNavigate('list')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/10"
          >
            <Plus size={18} />
            Novo Registro
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleNavigate(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${activeTab === tab.id 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50'}
            `}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'summary' && <ComplaintsDashboard onNavigate={handleNavigate} />}
            {activeTab === 'list' && <ComplaintsList initialFilters={listFilters} />}
            {activeTab === 'tracking' && <ComplaintsTracking />}
            {activeTab === 'config' && <ComplaintsConfig />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
