import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileImage,
  Plus,
  LayoutGrid,
  UploadCloud,
  FolderTree,
  FileText,
  Bell,
  Download,
} from 'lucide-react';

import { EvidenceGallery } from './tabs/EvidenceGallery';
import { EvidenceBatchUpload } from './tabs/EvidenceBatchUpload';
import { EvidenceCatalog } from './tabs/EvidenceCatalog';
import { EvidenceReports } from './tabs/EvidenceReports';
import { NewEvidenceModal } from './components/NewEvidenceModal';
import { ClientEvidenceView } from '../Client/ClientEvidenceView.js';

type TabType = 'galeria' | 'lotes' | 'catalogo' | 'relatorios';

interface EvidenceViewProps {
  userRole?: string;
  tenant?: {
    id: string;
    name: string;
  } | null;
}

export function EvidenceView({ userRole, tenant }: EvidenceViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('galeria');
  const [showNewModal, setShowNewModal] = useState(false);
  const isReadOnlyRole = userRole === 'client' || userRole === 'auditor';

  if (isReadOnlyRole && tenant) {
    return <ClientEvidenceView tenant={tenant} />;
  }

  const tabs = [
    { id: 'galeria', label: 'Galeria', icon: <LayoutGrid size={18} /> },
    { id: 'lotes', label: 'Uploads / Lotes', icon: <UploadCloud size={18} /> },
    { id: 'catalogo', label: 'Pastas & Tags', icon: <FolderTree size={18} /> },
    { id: 'relatorios', label: 'Relatórios', icon: <FileText size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-8">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-600 p-2.5 text-white shadow-xl shadow-emerald-600/20">
              <FileImage size={24} />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-900">Evidências</h1>
          </div>
          <p className="ml-14 text-sm font-medium text-zinc-500">Gestão de provas, registros e auditoria visual</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative rounded-2xl border border-zinc-200 bg-white p-3 text-zinc-600 transition-all hover:bg-zinc-50">
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
          </button>
          <button className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-600 transition-all hover:bg-zinc-50">
            <Download size={18} /> Exportar
          </button>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-700"
          >
            <Plus size={18} /> Nova Evidência
          </button>
        </div>
      </div>

      <div className="mb-8 flex w-fit items-center gap-1 rounded-3xl border border-zinc-200 bg-white p-1.5 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/20'
                : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

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
