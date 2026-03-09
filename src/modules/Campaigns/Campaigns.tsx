import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Megaphone, Calendar, CheckCircle2, 
  Plus, Search, Filter, ChevronRight,
  TrendingUp, Users, Target, Clock
} from 'lucide-react';
import { Campaign } from './types';
import { mockCampaigns } from './mockData';
import { CampaignManager } from './CampaignManager';

export function CampaignsView() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleUpdateCampaign = (updated: Campaign) => {
    setCampaigns(campaigns.map(c => c.id === updated.id ? updated : c));
    setSelectedCampaign(updated);
  };

  const filteredCampaigns = campaigns.filter(c => 
    c.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.month.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCampaign = campaigns.find(c => c.status === 'ACTIVE');
  const upcomingCampaign = campaigns.find(c => c.status === 'UPCOMING');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-10"
    >
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-purple-600">
            <Megaphone size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest">Gestão de Saúde</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-900">Campanhas Anuais</h1>
          <p className="text-zinc-500 font-medium">Cronograma de conscientização e ações preventivas.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-4 bg-white border border-zinc-200 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Target size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Meta Anual</p>
              <p className="text-lg font-black text-zinc-900">12 / 12</p>
            </div>
          </div>
          <div className="p-4 bg-white border border-zinc-200 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Impacto</p>
              <p className="text-lg font-black text-zinc-900">2.4k</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeCampaign && (
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 bg-zinc-900 text-white rounded-[48px] shadow-2xl shadow-zinc-200 relative overflow-hidden group cursor-pointer"
            onClick={() => setSelectedCampaign(activeCampaign)}
          >
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
              <Megaphone size={120} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-4 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest">Em Andamento</span>
                <span className="text-zinc-400 font-bold">{activeCampaign.month}</span>
              </div>
              <div>
                <h3 className="text-3xl font-black mb-2">{activeCampaign.theme}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                  {activeCampaign.description}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <span className="text-xs font-bold">{activeCampaign.actions.filter(a => a.status === 'DONE').length} Ações Concluídas</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-emerald-500" />
                  <span className="text-xs font-bold">85% Engajamento</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {upcomingCampaign && (
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 bg-white border border-zinc-200 rounded-[48px] shadow-sm relative overflow-hidden group cursor-pointer"
            onClick={() => setSelectedCampaign(upcomingCampaign)}
          >
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-4 py-1 bg-zinc-100 text-zinc-500 text-[10px] font-black rounded-full uppercase tracking-widest">Próxima Campanha</span>
                <span className="text-zinc-400 font-bold">{upcomingCampaign.month}</span>
              </div>
              <div>
                <h3 className="text-3xl font-black text-zinc-900 mb-2">{upcomingCampaign.theme}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
                  {upcomingCampaign.description}
                </p>
              </div>
              <button className="flex items-center gap-2 text-zinc-900 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                Iniciar Planejamento <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black text-zinc-900">Calendário Anual</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar campanha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 w-64"
              />
            </div>
            <button className="p-3 bg-white border border-zinc-200 rounded-2xl text-zinc-400 hover:text-zinc-900 transition-all">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <motion.div 
              key={campaign.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedCampaign(campaign)}
              className={`p-8 rounded-[40px] border-2 transition-all cursor-pointer group ${
                campaign.status === 'ACTIVE' ? 'border-zinc-900 bg-white' : 
                campaign.status === 'COMPLETED' ? 'border-zinc-100 bg-zinc-50/50' : 
                'border-zinc-100 bg-white hover:border-zinc-200'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 bg-${campaign.color}-100 text-${campaign.color}-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Megaphone size={24} />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">{campaign.month}</span>
                  {campaign.status === 'COMPLETED' ? (
                    <span className="flex items-center gap-1 text-emerald-600 text-[8px] font-black uppercase">
                      <CheckCircle2 size={12} /> Concluída
                    </span>
                  ) : campaign.status === 'ACTIVE' ? (
                    <span className="px-2 py-0.5 bg-emerald-600 text-white text-[8px] font-black rounded-lg uppercase animate-pulse">Ativa</span>
                  ) : (
                    <span className="text-zinc-400 text-[8px] font-black uppercase">Planejada</span>
                  )}
                </div>
              </div>

              <h4 className="text-xl font-black text-zinc-900 mb-2">{campaign.theme}</h4>
              <p className="text-xs text-zinc-500 line-clamp-2 mb-6 leading-relaxed">
                {campaign.description}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-zinc-200" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400">+{campaign.actions.length} ações</span>
                </div>
                <button className={`p-2 rounded-xl transition-all ${
                  campaign.status === 'ACTIVE' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400 group-hover:text-zinc-900'
                }`}>
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

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
