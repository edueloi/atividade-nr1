import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileImage, 
  Plus, 
  Filter, 
  Search, 
  LayoutGrid, 
  UploadCloud, 
  FolderTree, 
  FileText,
  PlusCircle,
  Bell,
  Download
} from 'lucide-react';

import { EvidenceGallery } from './tabs/EvidenceGallery';
import { EvidenceBatchUpload } from './tabs/EvidenceBatchUpload';
import { EvidenceCatalog } from './tabs/EvidenceCatalog';
import { EvidenceReports } from './tabs/EvidenceReports';
import { NewEvidenceModal } from './components/NewEvidenceModal';

type TabType = 'galeria' | 'lotes' | 'catalogo' | 'relatorios';

export function EvidenceView() {
  const [activeTab, setActiveTab] = useState<TabType>('galeria');
  const [showNewModal, setShowNewModal] = useState(false);

  const tabs = [
    { id: 'galeria', label: 'Galeria', icon: <LayoutGrid size={18} /> },
    { id: 'lotes', label: 'Uploads / Lotes', icon: <UploadCloud size={18} /> },
    { id: 'catalogo', label: 'Pastas & Tags', icon: <FolderTree size={18} /> },
    { id: 'relatorios', label: 'Relatórios', icon: <FileText size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-600/20">
              <FileImage size={24} />
            </div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Evidências</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium ml-14">Gestão de provas, registros e auditoria visual</p>
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
            onClick={() => setShowNewModal(true)}
            className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-xl shadow-emerald-600/20"
          >
            <Plus size={18} /> Nova Evidência
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 bg-white p-1.5 rounded-3xl border border-zinc-200 shadow-sm mb-8 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
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
          {activeTab === 'galeria' && <EvidenceGallery />}
          {activeTab === 'lotes' && <EvidenceBatchUpload />}
          {activeTab === 'catalogo' && <EvidenceCatalog />}
          {activeTab === 'relatorios' && <EvidenceReports />}
        </motion.div>
      </AnimatePresence>

      <NewEvidenceModal isOpen={showNewModal} onClose={() => setShowNewModal(false)} />
    </div>
  );
}
