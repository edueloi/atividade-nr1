import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Upload, Plus, FileText, Video, 
  Presentation, CheckCircle2, Clock, 
  Users, Calendar as CalendarIcon, 
  Camera, Trash2, Download, AlertCircle,
  Megaphone, User, Info, Shield, TrendingUp,
  Award, BarChart3, ChevronRight, Star, Edit3
} from 'lucide-react';
import { Campaign, CampaignAction, CampaignMaterial } from './types';

interface CampaignManagerProps {
  campaign: Campaign;
  onClose: () => void;
  onUpdate: (campaign: Campaign) => void;
}

const ACTION_TYPE_LABEL: Record<string, string> = {
  LECTURE: 'Palestra',
  WORKSHOP: 'Workshop',
  SCREENING: 'Rastreamento',
  OTHER: 'Outro',
};

const ACTION_TYPE_COLOR: Record<string, string> = {
  LECTURE: 'bg-blue-100 text-blue-700',
  WORKSHOP: 'bg-purple-100 text-purple-700',
  SCREENING: 'bg-emerald-100 text-emerald-700',
  OTHER: 'bg-zinc-100 text-zinc-600',
};

export const CampaignManager: React.FC<CampaignManagerProps> = ({ 
  campaign, 
  onClose,
  onUpdate 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'actions' | 'materials' | 'compliance'>('overview');
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
        name: newAction.name!,
        date: newAction.date!,
        type: newAction.type as any,
        status: newAction.status as any,
        participants_count: newAction.participants_count || 0
      };
      onUpdate({ ...campaign, actions: [...campaign.actions, action] });
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
    onUpdate({ ...campaign, actions: campaign.actions.filter(a => a.id !== id) });
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

  const totalParticipants = campaign.actions.reduce((a, b) => a + b.participants_count, 0);
  const doneActions = campaign.actions.filter(a => a.status === 'DONE').length;
  const progress = campaign.actions.length > 0
    ? Math.round((doneActions / campaign.actions.length) * 100)
    : 0;

  const statusLabel = campaign.status === 'ACTIVE' ? 'Em Andamento' :
    campaign.status === 'COMPLETED' ? 'Finalizada' :
    campaign.status === 'CANCELED' ? 'Cancelada' : 'Planejada';

  const statusColor = campaign.status === 'ACTIVE' ? 'bg-amber-500' :
    campaign.status === 'COMPLETED' ? 'bg-emerald-500' :
    campaign.status === 'CANCELED' ? 'bg-rose-500' : 'bg-zinc-400';

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.93, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 20 }}
        className="bg-white w-full max-w-4xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-10 pb-0 flex items-start justify-between">
          <div className="flex items-start gap-5">
            <div className={`w-16 h-16 bg-${campaign.color}-100 text-${campaign.color}-600 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <Megaphone size={30} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h2 className="text-2xl font-black text-zinc-900">{campaign.theme}</h2>
                <span className={`px-3 py-1 ${statusColor} text-white rounded-full text-[9px] font-black uppercase tracking-widest`}>
                  {statusLabel}
                </span>
              </div>
              <p className="text-zinc-500 text-sm flex items-center gap-2">
                <CalendarIcon size={14} />
                {new Date(campaign.start_date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                {' '}–{' '}
                {new Date(campaign.end_date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                {campaign.responsible && (
                  <>
                    <span className="text-zinc-300">·</span>
                    <User size={13} />
                    <span>{campaign.responsible}</span>
                  </>
                )}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-zinc-100 rounded-2xl transition-colors text-zinc-400 flex-shrink-0">
            <X size={24} />
          </button>
        </div>

        {/* Progress bar */}
        {campaign.actions.length > 0 && (
          <div className="px-10 mt-6">
            <div className="flex items-center justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">
              <span>Progresso das ações</span>
              <span>{doneActions}/{campaign.actions.length} — {progress}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6 }}
                className={`h-full rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-amber-400'}`}
              />
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="px-10 pt-6 flex items-center gap-6 border-b border-zinc-100 mt-4">
          {[
            { id: 'overview', label: 'Visão Geral', icon: <BarChart3 size={14} /> },
            { id: 'actions', label: 'Ações & Eventos', icon: <CalendarIcon size={14} /> },
            { id: 'materials', label: 'Materiais', icon: <FileText size={14} /> },
            { id: 'compliance', label: 'NR / PCMSO', icon: <Shield size={14} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative flex items-center gap-2 ${
                activeTab === tab.id ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              {tab.icon}{tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="mgr-tab-line" className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-900 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">

          {/* --- OVERVIEW --- */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-7 bg-zinc-50 rounded-[32px] border border-zinc-100">
                  <div className="flex items-center gap-3 text-zinc-400 mb-4">
                    <Users size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Total Impactados</span>
                  </div>
                  <div className="text-4xl font-black text-zinc-900">{totalParticipants.toLocaleString()}</div>
                  <p className="text-xs text-zinc-500 mt-1">Participações registradas</p>
                </div>
                <div className="p-7 bg-zinc-50 rounded-[32px] border border-zinc-100">
                  <div className="flex items-center gap-3 text-zinc-400 mb-4">
                    <CheckCircle2 size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Ações Concluídas</span>
                  </div>
                  <div className="text-4xl font-black text-zinc-900">{doneActions} / {campaign.actions.length}</div>
                  <p className="text-xs text-zinc-500 mt-1">Progresso: {progress}%</p>
                </div>
                <div className="p-7 bg-zinc-50 rounded-[32px] border border-zinc-100">
                  <div className="flex items-center gap-3 text-zinc-400 mb-4">
                    <Award size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Orçamento</span>
                  </div>
                  <div className="text-4xl font-black text-zinc-900">
                    {campaign.budget ? `R$ ${campaign.budget.toLocaleString('pt-BR')}` : '—'}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">Valor aprovado</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Descrição da Campanha</h4>
                <div className="p-7 bg-white border border-zinc-200 rounded-[28px] leading-relaxed text-zinc-700 text-sm">
                  {campaign.description}
                </div>
              </div>

              {/* Type breakdown */}
              {campaign.actions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tipo de Ações</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(['LECTURE', 'WORKSHOP', 'SCREENING', 'OTHER'] as const).map(type => {
                      const count = campaign.actions.filter(a => a.type === type).length;
                      if (count === 0) return null;
                      return (
                        <div key={type} className={`p-5 rounded-[24px] border ${ACTION_TYPE_COLOR[type].replace('text-', 'border-').replace('bg-', 'bg-')} bg-opacity-30`}>
                          <p className={`text-2xl font-black ${ACTION_TYPE_COLOR[type].split(' ')[1]}`}>{count}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">{ACTION_TYPE_LABEL[type]}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- ACTIONS --- */}
          {activeTab === 'actions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-black text-zinc-900">Cronograma de Ações</h4>
                  <p className="text-zinc-500 text-sm">Eventos, palestras e rastreamentos da campanha.</p>
                </div>
                <button
                  onClick={() => setShowAddAction(true)}
                  className="px-6 py-3 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-lg shadow-zinc-200"
                >
                  <Plus size={16} /> Nova Ação
                </button>
              </div>

              <div className="space-y-3">
                {campaign.actions.length === 0 ? (
                  <div className="py-20 bg-zinc-50 rounded-[40px] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-400">
                    <CalendarIcon size={44} className="mb-4 opacity-20" />
                    <p className="font-bold">Nenhuma ação planejada</p>
                    <p className="text-xs mt-1">Adicione eventos ao cronograma desta campanha.</p>
                  </div>
                ) : (
                  campaign.actions.map((action) => (
                    <div key={action.id} className={`p-6 rounded-[32px] border-2 transition-all group flex items-center gap-5 ${
                      action.status === 'DONE' ? 'border-zinc-100 bg-zinc-50/60' : 'border-zinc-200 bg-white hover:border-zinc-300'
                    }`}>
                      <button
                        onClick={() => handleToggleActionStatus(action.id)}
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                          action.status === 'DONE'
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-zinc-100 text-zinc-300 hover:bg-zinc-200 hover:text-zinc-500'
                        }`}
                      >
                        <CheckCircle2 size={22} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className={`font-black text-base ${action.status === 'DONE' ? 'text-zinc-400 line-through' : 'text-zinc-900'}`}>
                            {action.name}
                          </p>
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${ACTION_TYPE_COLOR[action.type]}`}>
                            {ACTION_TYPE_LABEL[action.type]}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
                          <span className="flex items-center gap-1">
                            <CalendarIcon size={12} />
                            {new Date(action.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={12} /> {action.participants_count} participantes
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {action.status === 'DONE' && (
                          <button className="px-3 py-2 bg-zinc-100 text-zinc-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center gap-1.5">
                            <Camera size={12} /> Evidências
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveAction(action.id)}
                          className="p-2.5 text-zinc-300 hover:text-rose-500 transition-all rounded-xl hover:bg-rose-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* --- MATERIALS --- */}
          {activeTab === 'materials' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-black text-zinc-900">Materiais de Apoio</h4>
                  <p className="text-zinc-500 text-sm">Posters, vídeos e apresentações para divulgação.</p>
                </div>
                <button className="px-6 py-3 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-lg shadow-zinc-200">
                  <Upload size={16} /> Upload
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaign.materials.map((mat) => (
                  <div key={mat.id} className="p-6 bg-white border border-zinc-200 rounded-[28px] flex items-center justify-between group hover:border-zinc-900 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-50 text-zinc-400 rounded-2xl flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all">
                        {getMaterialIcon(mat.type)}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 text-sm">{mat.name}</p>
                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">{mat.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-2.5 text-zinc-400 hover:text-zinc-900 transition-all rounded-xl hover:bg-zinc-100"><Download size={16} /></button>
                      <button className="p-2.5 text-zinc-400 hover:text-rose-600 transition-all rounded-xl hover:bg-rose-50"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
                {campaign.materials.length === 0 && (
                  <div className="col-span-2 py-20 bg-zinc-50 rounded-[40px] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-400">
                    <FileText size={44} className="mb-4 opacity-20" />
                    <p className="font-bold">Nenhum material enviado</p>
                    <p className="text-xs mt-1">Faça upload dos arquivos de divulgação.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- COMPLIANCE --- */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div className="p-7 bg-emerald-50 border border-emerald-200 rounded-[32px] flex items-start gap-5">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Shield size={22} />
                </div>
                <div>
                  <h4 className="font-black text-emerald-900 mb-1">Enquadramento NR-7 / PCMSO</h4>
                  <p className="text-emerald-700 text-sm leading-relaxed">
                    Esta campanha compõe o <strong>Programa de Controle Médico de Saúde Ocupacional</strong> previsto na NR-7, 
                    contribuindo para as metas anuais de promoção à saúde e prevenção de doenças ocupacionais.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-7 bg-white border border-zinc-200 rounded-[32px] space-y-4">
                  <h5 className="font-black text-zinc-900 flex items-center gap-2"><Info size={16} /> Dados da Campanha</h5>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: 'Mês de Referência', value: campaign.month },
                      { label: 'Tema', value: campaign.theme },
                      { label: 'Responsável Técnico', value: campaign.responsible || 'Não definido' },
                      { label: 'Período', value: `${new Date(campaign.start_date + 'T12:00:00').toLocaleDateString('pt-BR')} – ${new Date(campaign.end_date + 'T12:00:00').toLocaleDateString('pt-BR')}` },
                      { label: 'Orçamento Aprovado', value: campaign.budget ? `R$ ${campaign.budget.toLocaleString('pt-BR')}` : 'Não informado' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between py-2 border-b border-zinc-50">
                        <span className="text-zinc-500 font-medium">{label}</span>
                        <span className="font-bold text-zinc-900 text-right max-w-[200px]">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-7 bg-white border border-zinc-200 rounded-[32px] space-y-4">
                  <h5 className="font-black text-zinc-900 flex items-center gap-2"><TrendingUp size={16} /> Indicadores</h5>
                  <div className="space-y-3">
                    {[
                      { label: 'Total de Participantes', value: totalParticipants.toString(), ok: totalParticipants > 0 },
                      { label: 'Ações Realizadas', value: `${doneActions} / ${campaign.actions.length}`, ok: doneActions === campaign.actions.length && campaign.actions.length > 0 },
                      { label: 'Materiais Produzidos', value: campaign.materials.length.toString(), ok: campaign.materials.length > 0 },
                      { label: 'Progresso Geral', value: `${progress}%`, ok: progress >= 80 },
                    ].map(({ label, value, ok }) => (
                      <div key={label} className="flex items-center justify-between py-2 border-b border-zinc-50">
                        <span className="text-zinc-500 text-sm font-medium flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${ok ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                          {label}
                        </span>
                        <span className={`font-black text-sm ${ok ? 'text-emerald-600' : 'text-zinc-400'}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-amber-50 border border-amber-200 rounded-[28px] flex items-start gap-4">
                <AlertCircle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800 text-sm">
                  Os registros desta campanha impactam diretamente o <strong>Dashboard Estratégico</strong> e 
                  o relatório de conformidade do PCMSO. Mantenha ações e participantes atualizados.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between gap-4">
          <button className="px-6 py-3.5 bg-white border border-zinc-200 text-zinc-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-100 transition-all flex items-center gap-2">
            <Download size={14} /> Exportar Relatório
          </button>
          <button
            onClick={onClose}
            className="px-10 py-3.5 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 shadow-xl shadow-zinc-200 transition-all"
          >
            Fechar
          </button>
        </div>

        {/* Add Action Modal */}
        <AnimatePresence>
          {showAddAction && (
            <div className="fixed inset-0 z-[110] bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl p-10 space-y-7"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-zinc-900">Nova Ação</h3>
                  <button onClick={() => setShowAddAction(false)} className="text-zinc-400 hover:text-zinc-900 p-2 rounded-xl hover:bg-zinc-100 transition-all">
                    <X size={22} />
                  </button>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nome da Ação *</label>
                    <input
                      type="text"
                      value={newAction.name}
                      onChange={(e) => setNewAction({ ...newAction, name: e.target.value })}
                      placeholder="Ex: Palestra sobre Ansiedade no Trabalho"
                      className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Data *</label>
                      <input
                        type="date"
                        value={newAction.date}
                        onChange={(e) => setNewAction({ ...newAction, date: e.target.value })}
                        className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Tipo</label>
                      <select
                        value={newAction.type}
                        onChange={(e) => setNewAction({ ...newAction, type: e.target.value as any })}
                        className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                      >
                        <option value="LECTURE">Palestra</option>
                        <option value="WORKSHOP">Workshop</option>
                        <option value="SCREENING">Rastreamento</option>
                        <option value="OTHER">Outro</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Participantes previstos</label>
                    <input
                      type="number"
                      min={0}
                      value={newAction.participants_count}
                      onChange={(e) => setNewAction({ ...newAction, participants_count: parseInt(e.target.value) || 0 })}
                      className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddAction}
                  disabled={!newAction.name || !newAction.date}
                  className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
