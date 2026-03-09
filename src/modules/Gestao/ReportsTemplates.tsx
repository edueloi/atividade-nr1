import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, MoreVertical, Play, 
  Copy, Trash2, Settings,
  Star, Layers, Shield
} from 'lucide-react';
import { ReportTemplate } from './reportsTypes';
import { TemplateModal } from './ReportsModals';

interface ReportsTemplatesProps {
  templates: ReportTemplate[];
  onUse: (template: ReportTemplate) => void;
  onEdit: (template: ReportTemplate) => void;
  onDelete: (id: string) => void;
  onDuplicate: (template: ReportTemplate) => void;
  onSave: (data: any) => void;
}

export const ReportsTemplates: React.FC<ReportsTemplatesProps> = ({
  templates,
  onUse,
  onEdit,
  onDelete,
  onDuplicate,
  onSave
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ReportTemplate | undefined>(undefined);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-zinc-900">Modelos de Relatório</h3>
          <p className="text-zinc-500 text-sm">Atalhos configurados para geração recorrente.</p>
        </div>
        <button 
          onClick={() => {
            setEditingTemplate(undefined);
            setShowModal(true);
          }}
          className="px-6 py-3 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Criar Novo Modelo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((tmpl) => (
          <div key={tmpl.id} className="p-8 bg-white border border-zinc-200 rounded-[48px] shadow-sm hover:border-zinc-900 transition-all group">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-50 text-zinc-400 rounded-2xl flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all">
                  <Star size={24} fill={tmpl.isDefault ? "currentColor" : "none"} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-zinc-900">{tmpl.name}</h4>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{tmpl.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onUse(tmpl)}
                  className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2"
                >
                  <Play size={12} fill="currentColor" /> Usar
                </button>
                <div className="relative group/menu">
                  <button className="p-2 text-zinc-400 hover:text-zinc-900 transition-all">
                    <MoreVertical size={20} />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-zinc-200 rounded-2xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 p-2">
                    <button 
                      onClick={() => {
                        setEditingTemplate(tmpl);
                        setShowModal(true);
                      }}
                      className="w-full p-3 text-left text-xs font-bold text-zinc-600 hover:bg-zinc-50 rounded-xl flex items-center gap-2"
                    >
                      <Settings size={14} /> Editar
                    </button>
                    <button onClick={() => onDuplicate(tmpl)} className="w-full p-3 text-left text-xs font-bold text-zinc-600 hover:bg-zinc-50 rounded-xl flex items-center gap-2">
                      <Copy size={14} /> Duplicar
                    </button>
                    <div className="h-px bg-zinc-100 my-1" />
                    <button onClick={() => onDelete(tmpl.id)} className="w-full p-3 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2">
                      <Trash2 size={14} /> Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                <div className="flex items-center gap-2 text-zinc-400 mb-2">
                  <Layers size={14} />
                  <span className="text-[8px] font-black uppercase tracking-widest">Módulos</span>
                </div>
                <p className="text-xs font-bold text-zinc-900">{tmpl.modules.length} incluídos</p>
              </div>
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                <div className="flex items-center gap-2 text-zinc-400 mb-2">
                  <Shield size={14} />
                  <span className="text-[8px] font-black uppercase tracking-widest">Privacidade</span>
                </div>
                <p className="text-xs font-bold text-zinc-900">{tmpl.privacy.aggregatedOnly ? 'Agregado' : 'Detalhado'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <TemplateModal 
            initialData={editingTemplate}
            onClose={() => setShowModal(false)}
            onSave={(data) => {
              onSave(data);
              setShowModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
