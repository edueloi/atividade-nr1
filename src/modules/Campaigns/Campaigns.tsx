import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Megaphone, Calendar, CheckCircle2, 
  Plus, Search, Filter, ChevronRight,
  TrendingUp, Users, Target, Clock,
  BarChart3, Award, AlertTriangle, Star
} from 'lucide-react';
import { Campaign } from './types';
import { mockCampaigns } from './mockData';
import { CampaignManager } from './CampaignManager';

const MONTH_COLORS: Record<string, string> = {
  zinc: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  rose: 'bg-rose-100 text-rose-700 border-rose-200',
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  pink: 'bg-pink-100 text-pink-700 border-pink-200',
  sky: 'bg-sky-100 text-sky-700 border-sky-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
};

const DOT_COLORS: Record<string, string> = {
  zinc: 'bg-zinc-400',
  orange: 'bg-orange-400',
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  yellow: 'bg-yellow-400',
  rose: 'bg-rose-500',
  amber: 'bg-amber-400',
  pink: 'bg-pink-500',
  sky: 'bg-sky-500',
  purple: 'bg-purple-500',
};

const RING_COLORS: Record<string, string> = {
  zinc: 'ring-zinc-300',
  orange: 'ring-orange-300',
  blue: 'ring-blue-300',
  emerald: 'ring-emerald-300',
  yellow: 'ring-yellow-300',
  rose: 'ring-rose-300',
  amber: 'ring-amber-300',
  pink: 'ring-pink-300',
  sky: 'ring-sky-300',
  purple: 'ring-purple-300',
};

export function CampaignsView() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  const handleUpdateCampaign = (updated: Campaign) => {
    setCampaigns(campaigns.map(c => c.id === updated.id ? updated : c));
    setSelectedCampaign(updated);
  };

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.month.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const activeCampaign = campaigns.find(c => c.status === 'ACTIVE');
  const upcomingCampaign = campaigns.find(c => c.status === 'UPCOMING');

  const totalParticipants = campaigns.reduce((acc, c) =>
    acc + c.actions.reduce((a2, act) => a2 + act.participants_count, 0), 0
  );
  const completedCount = campaigns.filter(c => c.status === 'COMPLETED').length;
  const totalActions = campaigns.reduce((acc, c) => acc + c.actions.length, 0);
  const doneActions = campaigns.reduce((acc, c) => acc + c.actions.filter(a => a.status === 'DONE').length, 0);
  const complianceRate = Math.round((completedCount / campaigns.length) * 100);

  const statusFilters = [
    { id: 'ALL', label: 'Todas' },
    { id: 'ACTIVE', label: 'Ativa' },
    { id: 'UPCOMING', label: 'Planejadas' },
    { id: 'COMPLETED', label: 'Concluídas' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-10"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-purple-600">
            <Megaphone size={22} />
            <span className="text-[10px] font-black uppercase tracking-widest">Programa de Saúde Ocupacional</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-900">Campanhas 2025</h1>
          <p className="text-zinc-500 font-medium">Calendário anual de conscientização e ações preventivas — NR-7 / PCMSO.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setViewMode('grid')}
            className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-900'}`}
          >
            Grade
          </button>
          <button 
            onClick={() => setViewMode('timeline')}
            className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'timeline' ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-900'}`}
          >
            Timeline
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -3 }} className="p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Award size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Conformidade</p>
            <p className="text-2xl font-black text-zinc-900">{complianceRate}%</p>
            <p className="text-[10px] text-zinc-400">{completedCount} de {campaigns.length} realizadas</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Users size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Impacto Total</p>
            <p className="text-2xl font-black text-zinc-900">{totalParticipants.toLocaleString()}</p>
            <p className="text-[10px] text-zinc-400">Participações registradas</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <BarChart3 size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ações</p>
            <p className="text-2xl font-black text-zinc-900">{doneActions} / {totalActions}</p>
            <p className="text-[10px] text-zinc-400">Eventos realizados</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Target size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Meta Anual</p>
            <p className="text-2xl font-black text-zinc-900">12 / 12</p>
            <p className="text-[10px] text-zinc-400">Campanhas no PCMSO</p>
          </div>
        </motion.div>
      </div>

      {/* Active + Upcoming Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeCampaign && (
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 bg-zinc-900 text-white rounded-[48px] shadow-2xl shadow-zinc-200 relative overflow-hidden group cursor-pointer"
            onClick={() => setSelectedCampaign(activeCampaign)}
          >
            <div className="absolute top-0 right-0 p-12 opacity-[0.07] group-hover:scale-110 transition-transform">
              <Megaphone size={140} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Em Andamento
                </span>
                <span className="text-zinc-400 font-bold text-sm">{activeCampaign.month} 2025</span>
              </div>
              <div>
                <h3 className="text-3xl font-black mb-2">{activeCampaign.theme}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-md line-clamp-2">
                  {activeCampaign.description}
                </p>
              </div>
              <div className="flex items-center gap-6 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>{activeCampaign.actions.filter(a => a.status === 'DONE').length}/{activeCampaign.actions.length} ações</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-emerald-400" />
                  <span>{activeCampaign.actions.reduce((a, b) => a + b.participants_count, 0)} participantes</span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {upcomingCampaign && (
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 bg-white border-2 border-zinc-100 rounded-[48px] relative overflow-hidden group cursor-pointer hover:border-zinc-200 transition-all"
            onClick={() => setSelectedCampaign(upcomingCampaign)}
          >
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-4 py-1.5 bg-zinc-100 text-zinc-500 text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-1.5">
                  <Clock size={10} /> Próxima Campanha
                </span>
                <span className="text-zinc-400 font-bold text-sm">{upcomingCampaign.month} 2025</span>
              </div>
              <div>
                <h3 className="text-3xl font-black text-zinc-900 mb-2">{upcomingCampaign.theme}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">
                  {upcomingCampaign.description}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium">
                  <span className="flex items-center gap-1"><Target size={13} /> {upcomingCampaign.actions.length} ações planejadas</span>
                  {upcomingCampaign.responsible && (
                    <span className="flex items-center gap-1"><Users size={13} /> {upcomingCampaign.responsible}</span>
                  )}
                </div>
                <button className="flex items-center gap-2 text-zinc-900 font-black text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all">
                  Planejar <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Annual Progress Bar */}
      <div className="p-8 bg-white border border-zinc-200 rounded-[40px] shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp size={20} className="text-zinc-400" />
            <h3 className="font-black text-zinc-900">Progresso Anual do PCMSO</h3>
          </div>
          <span className="text-sm font-black text-zinc-500">{completedCount + (activeCampaign ? 1 : 0)}/12 meses</span>
        </div>
        <div className="flex gap-1.5">
          {campaigns.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCampaign(c)}
              title={c.theme}
              className={`flex-1 h-3 rounded-full transition-all hover:scale-y-150 ${
                c.status === 'COMPLETED' ? 'bg-emerald-500' :
                c.status === 'ACTIVE' ? 'bg-amber-400 animate-pulse' :
                'bg-zinc-100'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" /> Concluída</span>
          <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-amber-400 rounded-full" /> Ativa</span>
          <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-zinc-200 rounded-full" /> Planejada</span>
        </div>
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-2">
          {statusFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`px-5 py-2.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
                filterStatus === f.id
                  ? 'bg-zinc-900 text-white'
                  : 'bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input
            type="text"
            placeholder="Buscar campanha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 pr-5 py-3 bg-white border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 w-56"
          />
        </div>
      </div>

      {/* Campaign Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCampaigns.map((campaign, idx) => {
            const colorClass = MONTH_COLORS[campaign.color] || MONTH_COLORS.zinc;
            const dotClass = DOT_COLORS[campaign.color] || DOT_COLORS.zinc;
            const progress = campaign.actions.length > 0
              ? Math.round((campaign.actions.filter(a => a.status === 'DONE').length / campaign.actions.length) * 100)
              : 0;

            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedCampaign(campaign)}
                className={`p-7 rounded-[36px] border-2 transition-all cursor-pointer group ${
                  campaign.status === 'ACTIVE'
                    ? 'border-zinc-900 bg-white shadow-lg shadow-zinc-100'
                    : campaign.status === 'COMPLETED'
                    ? 'border-zinc-100 bg-zinc-50/60 hover:border-zinc-200'
                    : 'border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-md'
                }`}
              >
                {/* Top row */}
                <div className="flex justify-between items-start mb-5">
                  <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border ${colorClass}`}>
                    {campaign.month}
                  </span>
                  <div className="flex items-center gap-2">
                    {campaign.status === 'COMPLETED' && (
                      <span className="flex items-center gap-1 text-emerald-600 text-[9px] font-black uppercase">
                        <CheckCircle2 size={12} /> Concluída
                      </span>
                    )}
                    {campaign.status === 'ACTIVE' && (
                      <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-amber-600">
                        <span className={`w-2 h-2 rounded-full ${dotClass} animate-pulse`} /> Ativa
                      </span>
                    )}
                    {campaign.status === 'UPCOMING' && (
                      <span className="text-zinc-400 text-[9px] font-black uppercase">Planejada</span>
                    )}
                  </div>
                </div>

                {/* Title + desc */}
                <h4 className="text-lg font-black text-zinc-900 mb-1.5 leading-tight">{campaign.theme}</h4>
                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-5">
                  {campaign.description}
                </p>

                {/* Progress */}
                {campaign.actions.length > 0 && (
                  <div className="mb-5 space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      <span>Ações</span>
                      <span>{campaign.actions.filter(a => a.status === 'DONE').length}/{campaign.actions.length}</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ delay: idx * 0.04 + 0.3, duration: 0.6 }}
                        className={`h-full rounded-full ${
                          progress === 100 ? 'bg-emerald-500' :
                          campaign.status === 'ACTIVE' ? 'bg-amber-400' : 'bg-zinc-300'
                        }`}
                      />
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-5 border-t border-zinc-100">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold">
                    {campaign.responsible ? (
                      <span className="truncate max-w-[130px]">{campaign.responsible}</span>
                    ) : (
                      <span>Sem responsável</span>
                    )}
                  </div>
                  <button className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    campaign.status === 'ACTIVE' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white'
                  }`}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="space-y-3">
          {filteredCampaigns.map((campaign, idx) => {
            const dotClass = DOT_COLORS[campaign.color] || DOT_COLORS.zinc;
            const ringClass = RING_COLORS[campaign.color] || RING_COLORS.zinc;
            const doneActs = campaign.actions.filter(a => a.status === 'DONE').length;
            const totalPart = campaign.actions.reduce((a, b) => a + b.participants_count, 0);

            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => setSelectedCampaign(campaign)}
                className="flex items-center gap-6 p-6 bg-white border border-zinc-100 rounded-[32px] hover:border-zinc-200 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex flex-col items-center gap-1 w-20 flex-shrink-0">
                  <div className={`w-4 h-4 rounded-full ring-4 ring-offset-2 ${dotClass} ${ringClass}`} />
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center leading-tight">{campaign.month}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-black text-zinc-900">{campaign.theme}</h4>
                    {campaign.status === 'ACTIVE' && (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-amber-200">Ativa</span>
                    )}
                    {campaign.status === 'COMPLETED' && (
                      <span className="flex items-center gap-1 text-emerald-600 text-[9px] font-black uppercase">
                        <CheckCircle2 size={10} /> Concluída
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-1">{campaign.description}</p>
                </div>

                <div className="hidden lg:flex items-center gap-8 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-base font-black text-zinc-900">{doneActs}/{campaign.actions.length}</p>
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Ações</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-black text-zinc-900">{totalPart}</p>
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Pessoas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-black text-zinc-900">
                      {campaign.budget ? `R$ ${(campaign.budget / 1000).toFixed(1)}k` : '—'}
                    </p>
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Budget</p>
                  </div>
                </div>

                <ChevronRight size={18} className="text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </motion.div>
            );
          })}
        </div>
      )}

      {filteredCampaigns.length === 0 && (
        <div className="py-24 bg-zinc-50 rounded-[48px] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-400">
          <Search size={40} className="mb-4 opacity-20" />
          <p className="font-bold">Nenhuma campanha encontrada</p>
          <p className="text-xs mt-1">Tente outro termo ou filtro.</p>
        </div>
      )}

      {/* Campaign Manager Modal */}
      <AnimatePresence>
        {selectedCampaign && (
          <CampaignManager
            campaign={selectedCampaign}
            onClose={() => setSelectedCampaign(null)}
            onUpdate={handleUpdateCampaign}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
