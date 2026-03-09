import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Plus, Save, Trash2, Settings, Eye, 
  CheckCircle2, Copy, MoreVertical, Layout, 
  Type, Hash, CheckSquare, List, ChevronDown,
  AlertTriangle, Info, ArrowLeft, ShieldCheck
} from 'lucide-react';
import { AdmissionTemplate } from './types';

interface TemplateEditorProps {
  template: AdmissionTemplate | null;
  onClose: () => void;
  onSave: (template: any) => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({ 
  template, 
  onClose, 
  onSave 
}) => {
  const [activeTab, setActiveTab] = useState<'fields' | 'rules' | 'reasons' | 'preview'>('fields');
  const [formData, setFormData] = useState<Partial<AdmissionTemplate>>(
    template || {
      role_name: '',
      version: '1.0',
      status: 'DRAFT',
      fields: [],
      reasons: [],
      updated_at: new Date().toISOString().split('T')[0]
    }
  );

  const addField = (type: 'number' | 'boolean' | 'text' | 'select') => {
    const newField = {
      id: Math.random().toString(36).substr(2, 9),
      label: 'Novo Campo',
      type,
      required: true,
      group: 'Geral'
    };
    setFormData({ ...formData, fields: [...(formData.fields || []), newField] });
  };

  const removeField = (id: string) => {
    setFormData({ ...formData, fields: formData.fields?.filter(f => f.id !== id) });
  };

  const updateField = (id: string, updates: any) => {
    setFormData({ 
      ...formData, 
      fields: formData.fields?.map(f => f.id === id ? { ...f, ...updates } : f) 
    });
  };

  return (
    <div className="fixed inset-0 z-[120] bg-zinc-900/95 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-5xl h-[90vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-6">
            <button onClick={onClose} className="p-3 hover:bg-zinc-200 rounded-2xl transition-colors text-zinc-400">
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-zinc-200">
                <Layout size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-900">Editor de Template</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Configurando formulário por função</span>
                  <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-lg text-[10px] font-black uppercase tracking-tighter">v{formData.version}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-6 py-3 bg-white border border-zinc-200 text-zinc-600 rounded-2xl font-bold text-sm hover:bg-zinc-50 transition-all flex items-center gap-2">
              <Eye size={18} /> Preview
            </button>
            <button 
              onClick={() => onSave(formData)}
              className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center gap-2"
            >
              <Save size={18} /> Salvar Template
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 py-4 border-b border-zinc-100 flex items-center gap-2 bg-white">
          {[
            { id: 'fields', label: 'Campos', icon: <List size={16} /> },
            { id: 'rules', label: 'Regras', icon: <Settings size={16} /> },
            { id: 'reasons', label: 'Motivos', icon: <AlertTriangle size={16} /> },
            { id: 'preview', label: 'Preview', icon: <Eye size={16} /> }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                activeTab === tab.id ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-200' : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-zinc-50/30">
          {activeTab === 'fields' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Field List */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Estrutura do Formulário</h3>
                  <div className="flex gap-2">
                    <button onClick={() => addField('number')} className="p-2 bg-white border border-zinc-200 rounded-xl text-zinc-600 hover:bg-zinc-50 shadow-sm" title="Adicionar Número"><Hash size={18} /></button>
                    <button onClick={() => addField('boolean')} className="p-2 bg-white border border-zinc-200 rounded-xl text-zinc-600 hover:bg-zinc-50 shadow-sm" title="Adicionar Checkbox"><CheckSquare size={18} /></button>
                    <button onClick={() => addField('text')} className="p-2 bg-white border border-zinc-200 rounded-xl text-zinc-600 hover:bg-zinc-50 shadow-sm" title="Adicionar Texto"><Type size={18} /></button>
                  </div>
                </div>

                <div className="space-y-4">
                  {formData.fields?.map((field, index) => (
                    <motion.div 
                      key={field.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-6 rounded-[32px] border border-zinc-200 shadow-sm group hover:border-emerald-500/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                          {field.type === 'number' ? <Hash size={20} /> : field.type === 'boolean' ? <CheckSquare size={20} /> : <Type size={20} />}
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <input 
                            type="text" 
                            value={field.label}
                            onChange={(e) => updateField(field.id, { label: e.target.value })}
                            className="bg-transparent border-b border-transparent hover:border-zinc-200 focus:border-emerald-500 focus:outline-none py-1 font-bold text-zinc-900 transition-all"
                          />
                          <div className="flex items-center justify-end gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={field.required}
                                onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                              />
                              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Obrigatório</span>
                            </label>
                            <button onClick={() => removeField(field.id)} className="p-2 text-zinc-300 hover:text-rose-600 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {formData.fields?.length === 0 && (
                    <div className="p-20 border-2 border-dashed border-zinc-200 rounded-[48px] flex flex-col items-center justify-center gap-4 text-zinc-400">
                      <Layout size={48} className="opacity-20" />
                      <p className="text-sm font-bold">Nenhum campo adicionado ainda.</p>
                      <button onClick={() => addField('number')} className="px-6 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800">Começar agora</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Config */}
              <div className="space-y-8">
                <div className="p-8 bg-white rounded-[40px] border border-zinc-200 shadow-sm space-y-6">
                  <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Configurações Gerais</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-700">Função / Cargo</label>
                      <input 
                        type="text" 
                        value={formData.role_name}
                        onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
                        placeholder="Ex: Operador de Montagem"
                        className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-700">Versão</label>
                      <input 
                        type="text" 
                        value={formData.version}
                        onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                        className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-emerald-900 text-white rounded-[40px] shadow-xl shadow-emerald-200 space-y-4">
                  <div className="w-12 h-12 bg-emerald-800 rounded-2xl flex items-center justify-center">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-lg font-bold">Publicar Template</h3>
                  <p className="text-xs text-emerald-100 leading-relaxed opacity-80">
                    Ao publicar, este template ficará disponível para novas avaliações. Versões anteriores serão arquivadas.
                  </p>
                  <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-900/20">
                    Publicar Agora
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reasons' && (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-zinc-900">Motivos de Restrição/Veto</h3>
                <p className="text-sm text-zinc-500">Defina os motivos padrão que o avaliador poderá selecionar para esta função.</p>
              </div>

              <div className="bg-white p-8 rounded-[48px] border border-zinc-200 shadow-sm space-y-6">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Adicionar novo motivo..."
                    className="flex-1 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value;
                        if (val) {
                          setFormData({ ...formData, reasons: [...(formData.reasons || []), val] });
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                  <button className="p-4 bg-zinc-900 text-white rounded-2xl hover:bg-zinc-800 transition-all">
                    <Plus size={20} />
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.reasons?.map((reason, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl group hover:bg-zinc-100 transition-all">
                      <span className="text-sm font-bold text-zinc-700">{reason}</span>
                      <button 
                        onClick={() => setFormData({ ...formData, reasons: formData.reasons?.filter((_, idx) => idx !== i) })}
                        className="p-2 text-zinc-300 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {formData.reasons?.length === 0 && (
                    <div className="text-center py-10 text-zinc-400 italic text-xs">
                      Nenhum motivo configurado.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="max-w-2xl mx-auto p-20 border-2 border-dashed border-zinc-200 rounded-[48px] flex flex-col items-center justify-center gap-4 text-zinc-400">
              <Settings size={48} className="opacity-20" />
              <p className="text-sm font-bold text-center">O motor de regras automáticas estará disponível em breve.<br/>Atualmente o resultado é definido manualmente pelo avaliador.</p>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="max-w-xl mx-auto bg-white p-10 rounded-[48px] border border-zinc-200 shadow-sm space-y-8">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-zinc-900">Preview do Formulário</h3>
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-black">Como o avaliador verá no tablet/celular</p>
              </div>

              <div className="space-y-6">
                {formData.fields?.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">{field.label}</label>
                    {field.type === 'number' ? (
                      <input type="number" disabled className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm opacity-50" placeholder="0.00" />
                    ) : field.type === 'boolean' ? (
                      <div className="flex gap-2">
                        <div className="flex-1 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-center text-xs font-bold text-zinc-400">SIM</div>
                        <div className="flex-1 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-center text-xs font-bold text-zinc-400">NÃO</div>
                      </div>
                    ) : (
                      <input type="text" disabled className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm opacity-50" placeholder="..." />
                    )}
                  </div>
                ))}
                <div className="pt-6 border-t border-zinc-100">
                  <div className="w-full py-4 bg-emerald-600/20 text-emerald-600 rounded-2xl text-center font-bold text-sm">
                    Botão de Salvar
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
