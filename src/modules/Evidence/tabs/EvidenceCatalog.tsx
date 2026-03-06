import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderTree, 
  Tag, 
  Plus, 
  MoreVertical, 
  ChevronRight, 
  Folder, 
  FileImage, 
  Search, 
  Filter, 
  Settings2, 
  Trash2, 
  Edit3,
  ShieldCheck,
  Activity,
  Target,
  ClipboardList,
  User,
  FileText
} from 'lucide-react';

export function EvidenceCatalog() {
  const [searchTerm, setSearchTerm] = useState('');

  const folders = [
    { id: '1', name: 'Campanhas', count: 24, icon: <Tag className="text-amber-600" />, color: 'bg-amber-50' },
    { id: '2', name: 'Ergonomia (Antes/Depois)', count: 156, icon: <Activity className="text-emerald-600" />, color: 'bg-emerald-50' },
    { id: '3', name: 'Plano de Ação', count: 89, icon: <ClipboardList className="text-blue-600" />, color: 'bg-blue-50' },
    { id: '4', name: 'Projetos Engenharia', count: 42, icon: <Target className="text-purple-600" />, color: 'bg-purple-50' },
    { id: '5', name: 'Ginástica Laboral', count: 210, icon: <User className="text-rose-600" />, color: 'bg-rose-50' },
    { id: '6', name: 'NR1 Psicossocial', count: 34, icon: <ShieldCheck className="text-zinc-600" />, color: 'bg-zinc-50' },
  ];

  const tags = [
    { name: 'cadeira', count: 45, type: 'Equipamento' },
    { name: 'bancada', count: 32, type: 'Equipamento' },
    { name: 'ferramenta', count: 18, type: 'Equipamento' },
    { name: 'DDS', count: 120, type: 'Treinamento' },
    { name: 'treinamento', count: 85, type: 'Treinamento' },
    { name: 'liderança', count: 24, type: 'Treinamento' },
    { name: 'antes', count: 156, type: 'Status' },
    { name: 'depois', count: 156, type: 'Status' },
    { name: 'auditoria', count: 42, type: 'Status' },
  ];

  return (
    <div className="space-y-10">
      {/* Folders Grid */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
              <FolderTree size={24} className="text-zinc-900" />
              Pastas & Categorias
            </h3>
            <p className="text-sm text-zinc-500 font-medium">Organização por filtros salvos e temas</p>
          </div>
          <button className="px-6 py-3 bg-zinc-900 text-white rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-xl shadow-zinc-900/20">
            <Plus size={18} /> Nova Pasta
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.map(folder => (
            <div 
              key={folder.id}
              className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm hover:border-zinc-900 transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 ${folder.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {folder.icon}
                </div>
                <button className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-400">
                  <MoreVertical size={20} />
                </button>
              </div>
              <h4 className="text-lg font-bold text-zinc-900 mb-1">{folder.name}</h4>
              <p className="text-xs text-zinc-500 font-medium mb-6">{folder.count} evidências encontradas</p>
              <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Acessar Pasta</span>
                <ChevronRight size={18} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags Management */}
      <div className="bg-white rounded-[40px] border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-zinc-50/50">
          <div>
            <h3 className="text-xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
              <Tag size={24} className="text-zinc-900" />
              Gerenciamento de Tags
            </h3>
            <p className="text-sm text-zinc-500 font-medium">Padronize a marcação de evidências para auditoria</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar tag..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900/10 w-64"
              />
            </div>
            <button className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-bold text-xs hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10">
              Criar Tag
            </button>
          </div>
        </div>

        <div className="p-10">
          <div className="flex flex-wrap gap-3">
            {tags.map(tag => (
              <div 
                key={tag.name}
                className="group flex items-center gap-3 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl hover:border-zinc-900 hover:bg-white transition-all cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-black text-zinc-900 uppercase tracking-tighter">#{tag.name}</span>
                  <span className="text-[8px] text-zinc-400 font-bold uppercase">{tag.type}</span>
                </div>
                <div className="w-px h-6 bg-zinc-200 group-hover:bg-zinc-900/20" />
                <span className="text-xs font-black text-zinc-900">{tag.count}</span>
                <button className="p-1 hover:bg-zinc-200 rounded-lg text-zinc-400 group-hover:text-zinc-900 transition-colors">
                  <MoreVertical size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-10 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white border border-zinc-200 rounded-2xl text-zinc-900">
                <Settings2 size={20} />
             </div>
             <div>
                <p className="text-xs font-bold text-zinc-900">Tags Obrigatórias</p>
                <p className="text-[10px] text-zinc-500">Defina tags que devem ser preenchidas por origem de dados</p>
             </div>
          </div>
          <button className="text-xs font-black text-zinc-900 uppercase hover:underline">Configurar Regras</button>
        </div>
      </div>
    </div>
  );
}
