import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Upload, Plus, FileText, Video, 
  Presentation, CheckCircle2, Clock, 
  Users, Calendar as CalendarIcon, 
  Camera, Trash2, Download, AlertCircle,
  Megaphone, User, Info
} from 'lucide-react';
import { Campaign, CampaignAction, CampaignMaterial } from './types';

interface CampaignManagerProps {
  campaign: Campaign;
  onClose: () => void;
  onUpdate: (campaign: Campaign) => void;
}

export const CampaignManager: React.FC<CampaignManagerProps> = ({ 
  campaign, 
  onClose,
  onUpdate 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'actions'>('overview');
  const [showAddAction, setShowAddAction] = useState(false);
  const [newAction, setNewAction] = useState<Partial<CampaignAction>>({
    name: '',
    date: new Date().toISOString().split('T')[0],
    type: 'LECTURE',
    status: 'PLANNED',
    participants_count: 0
  });

  const handleAddAction = () => {
    if (newAction.name && newAction.date) {
      const action: CampaignAction = {
        id: `act-${Date.now()}`,
        name: newAction.name,
        date: newAction.date,
        type: newAction.type as any,
        status: newAction.status as any,
        participants_count: newAction.participants_count || 0
      };
      onUpdate({
        ...campaign,
        actions: [...campaign.actions, action]
      });
      setShowAddAction(false);
      setNewAction({
        name: '',
        date: new Date().toISOString().split('T')[0],
        type: 'LECTURE',
        status: 'PLANNED',
        participants_count: 0
      });
    }
  };

  const handleRemoveAction = (id: string) => {
    onUpdate({
      ...campaign,
      actions: campaign.actions.filter(a => a.id !== id)
    });
  };

  const handleToggleActionStatus = (id: string) => {
    onUpdate({
      ...campaign,
      actions: campaign.actions.map(a => 
        a.id === id ? { ...a, status: a.status === 'DONE' ? 'PLANNED' : 'DONE' } : a
      )
    });
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'POSTER': return <FileText size={20} />;
      case 'VIDEO': return <Video size={20} />;
      case 'PRESENTATION': return <Presentation size={20} />;
      default: return <FileText size={20} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-900/90 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white w-full max-w-4xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-10 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 bg-${campaign.color}-100 text-${campaign.color}-600 rounded-3xl flex items-center justify-center shadow-lg shadow-${campaign.color}-100`}>
              <Megaphone size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-black text-zinc-900">{campaign.theme}</h2>
                <span className={`px-3 py-1 bg-${campaign.color}-100 text-${campaign.color}-700 rounded-full text-[10px] font-black uppercase tracking-widest`}>
                  {campaign.month}
                </span>
              </div>
              <p className="text-zinc-500 font-medium flex items-center gap-2">
                <CalendarIcon size={16} /> {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-zinc-100 rounded-2xl transition-colors text-zinc-400">
            <X size={32} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-10 pt-6 flex items-center gap-8 border-b border-zinc-100">
          {[
            { id: 'overview', label: 'Visão Geral' },
            { id: 'materials', label: 'Materiais & Mídia' },
            { id: 'actions', label: 'Ações & Eventos' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-900 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {activeTab === 'overview' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-zinc-50 rounded-[32px] border border-zinc-100">
                  <div className="flex items-center gap-3 text-zinc-400 mb-4">
                    <Users size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Alcance Total</span>
                  </div>
                  <div className="text-4xl font-black text-zinc-900">
                    {campaign.actions.reduce((acc, curr) => acc + curr.participants_count, 0)}
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">Pessoas impactadas</p>
                </div>
                <div className="p-8 bg-zinc-50 rounded-[32px] border border-zinc-100">
                  <div className="flex items-center gap-3 text-zinc-400 mb-4">
                    <CheckCircle2 size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Ações Concluídas</span>
                  </div>
                  <div className="text-4xl font-black text-zinc-900">
                    {campaign.actions.filter(a => a.status === 'DONE').length} / {campaign.actions.length}
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">Progresso do cronograma</p>
                </div>
                <div className="p-8 bg-zinc-50 rounded-[32px] border border-zinc-100">
                  <div className="flex items-center gap-3 text-zinc-400 mb-4">
                    <Clock size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Status</span>
                  </div>
                  <div className="text-2xl font-black text-zinc-900 uppercase">
                    {campaign.status === 'ACTIVE' ? 'Em Andamento' : campaign.status === 'COMPLETED' ? 'Finalizada' : 'Planejada'}
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">Situação atual</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Sobre a Campanha</h4>
                <div className="p-8 bg-white border border-zinc-200 rounded-[32px] leading-relaxed text-zinc-600">
                  {campaign.description}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-8 bg-zinc-50 rounded-[32px] border border-zinc-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-zinc-400">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Responsável</p>
                    <p className="font-bold text-zinc-900">{campaign.responsible || 'Não definido'}</p>
                  </div>
                </div>
                <div className="p-8 bg-zinc-50 rounded-[32px] border border-zinc-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-zinc-400">
                    <Info size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Orçamento</p>
                    <p className="font-bold text-zinc-900">
                      {campaign.budget ? `R$ ${campaign.budget.toLocaleString()}` : 'Sob demanda'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-black text-zinc-900">Materiais de Apoio</h4>
                  <p className="text-zinc-500 text-sm">Posters, vídeos e apresentações para divulgação.</p>
                </div>
                <button className="px-6 py-3 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2">
                  <Upload size={16} /> Upload Material
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaign.materials.map((mat) => (
                  <div key={mat.id} className="p-6 bg-white border border-zinc-200 rounded-[32px] flex items-center justify-between group hover:border-zinc-900 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-50 text-zinc-400 rounded-2xl flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all">
                        {getMaterialIcon(mat.type)}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900">{mat.name}</p>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{mat.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-3 text-zinc-400 hover:text-zinc-900 transition-all"><Download size={20} /></button>
                      <button className="p-3 text-zinc-400 hover:text-rose-600 transition-all"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}
                {campaign.materials.length === 0 && (
                  <div className="col-span-2 py-20 bg-zinc-50 rounded-[48px] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-400">
                    <FileText size={48} className="mb-4 opacity-20" />
                    <p className="font-bold">Nenhum material enviado</p>
                    <p className="text-xs">Faça o upload dos arquivos de divulgação.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-black text-zinc-900">Cronograma de Ações</h4>
                  <p className="text-zinc-500 text-sm">Eventos, palestras e atividades presenciais.</p>
                </div>
                <button 
                  onClick={() => setShowAddAction(true)}
                  className="px-6 py-3 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2"
                >
                  <Plus size={16} /> Nova Ação
                </button>
              </div>

              <div className="space-y-4">
                {campaign.actions.map((action) => (
                  <div key={action.id} className="p-8 bg-white border border-zinc-200 rounded-[40px] flex items-center justify-between group hover:border-zinc-900 transition-all">
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={() => handleToggleActionStatus(action.id)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                          action.status === 'DONE' ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'
                        }`}
                      >
                        <CheckCircle2 size={24} />
                      </button>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-black text-xl text-zinc-900">{action.name}</p>
                          <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-lg text-[8px] font-black uppercase tracking-widest">
                            {action.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-zinc-400 text-xs font-medium">
                          <span className="flex items-center gap-1"><CalendarIcon size={14} /> {new Date(action.date).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Users size={14} /> {action.participants_count} participantes</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {action.status === 'DONE' && (
                        <button className="px-4 py-2 bg-zinc-50 text-zinc-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-all flex items-center gap-2">
                          <Camera size={14} /> Evidências
                        </button>
                      )}
                      <button 
                        onClick={() => handleRemoveAction(action.id)}
                        className="p-3 text-zinc-400 hover:text-rose-600 transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}

                {campaign.actions.length === 0 && (
                  <div className="py-20 bg-zinc-50 rounded-[48px] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-400">
                    <CalendarIcon size={48} className="mb-4 opacity-20" />
                    <p className="font-bold">Nenhuma ação planejada</p>
                    <p className="text-xs">Clique em "Nova Ação" para começar o cronograma.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-10 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white rounded-2xl border border-zinc-200 flex items-center gap-3">
              <AlertCircle size={20} className="text-amber-500" />
              <p className="text-xs text-zinc-500 font-medium">
                Esta campanha impacta diretamente o <span className="font-bold text-zinc-900">Dashboard Estratégico</span>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-8 py-4 bg-white border border-zinc-200 text-zinc-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-100 transition-all">
              Exportar Relatório
            </button>
            <button 
              onClick={onClose}
              className="px-10 py-4 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 shadow-xl shadow-zinc-200 transition-all"
            >
              Salvar Alterações
            </button>
          </div>
        </div>

        {/* Add Action Modal */}
        <AnimatePresence>
          {showAddAction && (
            <div className="fixed inset-0 z-[110] bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl p-10 space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-zinc-900">Nova Ação</h3>
                  <button onClick={() => setShowAddAction(false)} className="text-zinc-400 hover:text-zinc-900"><X size={24} /></button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nome da Ação</label>
                    <input 
                      type="text" 
                      value={newAction.name}
                      onChange={(e) => setNewAction({ ...newAction, name: e.target.value })}
                      placeholder="Ex: Palestra sobre Ansiedade"
                      className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Data</label>
                      <input 
                        type="date" 
                        value={newAction.date}
                        onChange={(e) => setNewAction({ ...newAction, date: e.target.value })}
                        className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Tipo</label>
                      <select 
                        value={newAction.type}
                        onChange={(e) => setNewAction({ ...newAction, type: e.target.value as any })}
                        className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                      >
                        <option value="LECTURE">Palestra</option>
                        <option value="WORKSHOP">Workshop</option>
                        <option value="SCREENING">Exame/Rastreio</option>
                        <option value="OTHER">Outros</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleAddAction}
                  className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all"
                >
                  Adicionar ao Cronograma
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
