import React from 'react';
import { motion } from 'motion/react';
import { 
  Plus, ShieldCheck, Copy, Settings, MoreVertical, 
  Eye, Trash2, Archive, CheckCircle2, History
} from 'lucide-react';
import { AdmissionTemplate } from './types';

interface AdmissionalTemplatesProps {
  templates: AdmissionTemplate[];
  onNewTemplate: () => void;
  onEditTemplate: (template: AdmissionTemplate) => void;
}

export const AdmissionalTemplates: React.FC<AdmissionalTemplatesProps> = ({ 
  templates, 
  onNewTemplate,
  onEditTemplate
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Templates de Avaliação</h2>
          <p className="text-sm text-zinc-500">Gerencie os formulários e regras por função.</p>
        </div>
        <button 
          onClick={onNewTemplate}
          className="px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
        >
          <Plus className="w-4 h-4" />
          Novo Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <div 
            key={tpl.id} 
            className="bg-white p-6 rounded-[32px] border border-zinc-200 shadow-sm hover:border-emerald-500/50 transition-all group relative overflow-hidden"
          >
            {/* Status Indicator */}
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rotate-45 ${
              tpl.status === 'PUBLISHED' ? 'bg-emerald-500/10' : 
              tpl.status === 'DRAFT' ? 'bg-zinc-100' : 'bg-zinc-900/10'
            }`} />

            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                tpl.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-50 text-zinc-400'
              }`}>
                <ShieldCheck size={28} />
              </div>
              <div className="relative group/menu">
                <button className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
                  <MoreVertical size={20} />
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-zinc-100 py-2 z-20 hidden group-hover/menu:block">
                  <button onClick={() => onEditTemplate(tpl)} className="w-full px-4 py-2 text-left text-xs font-bold text-zinc-600 hover:bg-zinc-50 flex items-center gap-2">
                    <Settings size={14} /> Editar Template
                  </button>
                  <button className="w-full px-4 py-2 text-left text-xs font-bold text-zinc-600 hover:bg-zinc-50 flex items-center gap-2">
                    <Copy size={14} /> Duplicar
                  </button>
                  <button className="w-full px-4 py-2 text-left text-xs font-bold text-zinc-600 hover:bg-zinc-50 flex items-center gap-2">
                    <History size={14} /> Histórico
                  </button>
                  <button className="w-full px-4 py-2 text-left text-xs font-bold text-zinc-600 hover:bg-zinc-50 flex items-center gap-2">
                    <Eye size={14} /> Preview
                  </button>
                  {tpl.status === 'DRAFT' ? (
                    <button className="w-full px-4 py-2 text-left text-xs font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 border-t border-zinc-50 mt-1 pt-2">
                      <CheckCircle2 size={14} /> Publicar Versão
                    </button>
                  ) : (
                    <button className="w-full px-4 py-2 text-left text-xs font-bold text-zinc-400 hover:bg-zinc-50 flex items-center gap-2 border-t border-zinc-50 mt-1 pt-2">
                      <Archive size={14} /> Arquivar
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="font-bold text-lg text-zinc-900 mb-1">{tpl.role_name}</h3>
              <p className="text-xs text-zinc-500 mb-6 font-medium">
                {tpl.fields.length} campos configurados • {tpl.reasons?.length || 0} motivos de veto
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Versão</span>
                  <span className="text-xs font-bold text-zinc-900">v{tpl.version}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                  tpl.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  tpl.status === 'DRAFT' ? 'bg-zinc-50 text-zinc-400 border-zinc-200' :
                  'bg-zinc-900 text-white border-zinc-900'
                }`}>
                  {tpl.status === 'PUBLISHED' ? 'Publicado' : tpl.status === 'DRAFT' ? 'Rascunho' : 'Arquivado'}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <button 
          onClick={onNewTemplate}
          className="bg-zinc-50 p-6 rounded-[32px] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-4 hover:bg-zinc-100 hover:border-zinc-300 transition-all group min-h-[240px]"
        >
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-zinc-400 group-hover:scale-110 transition-transform shadow-sm">
            <Plus size={28} />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-zinc-900">Novo Template</p>
            <p className="text-xs text-zinc-400 font-medium">Criar formulário para nova função</p>
          </div>
        </button>
      </div>
    </motion.div>
  );
};
