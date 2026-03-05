import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  RefreshCw, 
  FileText, 
  Users, 
  ShieldCheck,
  Plus
} from 'lucide-react';
import { NR1Dashboard } from './tabs/NR1Dashboard';
import { NR1Cycles } from './tabs/NR1Cycles';
import { NR1Forms } from './tabs/NR1Forms';
import { NR1Responses } from './tabs/NR1Responses';
import { NR1Reports } from './tabs/NR1Reports';

type TabType = 'dashboard' | 'cycles' | 'forms' | 'responses' | 'reports';

export function NR1View() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Visão', icon: LayoutDashboard },
    { id: 'cycles', label: 'Ciclos', icon: RefreshCw },
    { id: 'forms', label: 'Formulários', icon: FileText },
    { id: 'responses', label: 'Respostas', icon: Users },
    { id: 'reports', label: 'Relatórios & Auditoria', icon: ShieldCheck },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 p-1 bg-zinc-100/50 rounded-2xl w-fit border border-zinc-200/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all
              ${activeTab === tab.id 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-600'}
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
            {activeTab === 'dashboard' && <NR1Dashboard onNavigate={setActiveTab} />}
            {activeTab === 'cycles' && <NR1Cycles />}
            {activeTab === 'forms' && <NR1Forms />}
            {activeTab === 'responses' && <NR1Responses />}
            {activeTab === 'reports' && <NR1Reports />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
