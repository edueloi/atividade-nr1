import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Plus, 
  UploadCloud, 
  X, 
  ChevronRight,
  MoreVertical,
  Download,
  Trash2,
  Info,
  Edit3,
  Link2,
  Share2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ShieldCheck,
  Target,
  Activity,
  User,
  Calendar,
  Tag
} from 'lucide-react';

import { Evidence, EvidenceType, EvidenceStatus, EvidenceOrigin } from '../types';
import { mockEvidences } from '../mockData';
import { EvidenceCard } from '../components/EvidenceCard';
import { EvidenceDetailDrawer } from '../components/EvidenceDetailDrawer';
import { EvidenceFiltersDrawer } from '../components/EvidenceFiltersDrawer';

export function EvidenceGallery() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [evidences, setEvidences] = useState<Evidence[]>(mockEvidences);

  const filteredEvidences = useMemo(() => {
    return evidences.filter(ev => {
      const matchesSearch = ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ev.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ev.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
  }, [evidences, searchTerm]);

  const handleCardClick = (evidence: Evidence) => {
    setSelectedEvidence(evidence);
    setShowDetail(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Deseja realmente excluir esta evidência?')) {
      setEvidences(prev => prev.filter(ev => ev.id !== id));
      setShowDetail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-3 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por título, setor ou tag..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <button 
            onClick={() => setShowFilters(true)}
            className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-xl transition-colors border border-zinc-200 flex items-center gap-2 text-xs font-bold"
          >
            <Filter size={16} /> Filtros
          </button>
        </div>

        <div className="flex items-center gap-2 p-1 bg-zinc-100 rounded-xl border border-zinc-200">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'grid' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <LayoutGrid size={16} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Grid/List View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredEvidences.map(ev => (
            <EvidenceCard key={ev.id} evidence={ev} onClick={() => handleCardClick(ev)} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-200">
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Evidência</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Setor / Unidade</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tipo</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredEvidences.map(ev => (
                <tr key={ev.id} className="group hover:bg-zinc-50/80 transition-colors cursor-pointer" onClick={() => handleCardClick(ev)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-200">
                        <img src={ev.thumbUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-zinc-900">{ev.title}</span>
                        <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter">{ev.origin}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-900">{ev.sector}</span>
                      <span className="text-[10px] text-zinc-500 font-medium">{ev.unit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                      ev.type === 'Antes' ? 'bg-zinc-100 text-zinc-600 border-zinc-200' :
                      ev.type === 'Depois' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      ev.type === 'Comprovante' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                      ev.type === 'Campanha' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-zinc-900 text-white border-zinc-900'
                    }`}>
                      {ev.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold border flex items-center gap-2 w-fit ${
                      ev.status === 'Vinculada' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      ev.status === 'Rascunho' ? 'bg-zinc-100 text-zinc-400 border-zinc-200' :
                      ev.status === 'Aprovada' ? 'bg-emerald-600 text-white border-emerald-600' :
                      'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {ev.status === 'Vinculada' && <Link2 size={10} />}
                      {ev.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-400">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Filters Drawer */}
      <EvidenceFiltersDrawer isOpen={showFilters} onClose={() => setShowFilters(false)} />

      {/* Detail Drawer */}
      <EvidenceDetailDrawer 
        isOpen={showDetail} 
        onClose={() => setShowDetail(false)} 
        evidence={selectedEvidence}
        onDelete={handleDelete}
      />
    </div>
  );
}
