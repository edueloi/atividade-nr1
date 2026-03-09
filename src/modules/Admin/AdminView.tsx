import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, Users, Building2, MapPin, Layers, 
  Clock, Shield, TrendingUp, Search, Filter,
  ChevronRight, ExternalLink, Activity, AlertCircle
} from 'lucide-react';

interface AdminViewProps {
  tenants: any[];
  onSelectTenant: (tenant: any) => void;
}

function AdminStat({ icon, label, value, trend, color }: { icon: React.ReactNode, label: string, value: string, trend?: string, color: string }) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-zinc-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${color}-50 text-${color}-600`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
      <h4 className="text-2xl font-bold text-zinc-900">{value}</h4>
    </div>
  );
}

export const AdminView: React.FC<AdminViewProps> = ({ tenants, onSelectTenant }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState<'contracts' | 'campaigns' | 'global_reports'>('contracts');

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-zinc-900 rounded-[20px] flex items-center justify-center shadow-xl shadow-zinc-200">
            <Shield className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Painel Global</h1>
            <p className="text-zinc-500 font-medium">Gestão centralizada de todos os contratos ativos.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
            Configurações Base
          </button>
          <button className="px-6 py-3 bg-zinc-900 text-white rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200">
            Novo Contrato
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 p-1 bg-zinc-100 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveAdminTab('contracts')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeAdminTab === 'contracts' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          Contratos
        </button>
        <button 
          onClick={() => setActiveAdminTab('campaigns')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeAdminTab === 'campaigns' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          Campanhas Globais
        </button>
        <button 
          onClick={() => setActiveAdminTab('global_reports')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeAdminTab === 'global_reports' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          Relatórios Consolidados
        </button>
      </div>

      {activeAdminTab === 'contracts' && (
        <>
          {/* Global Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdminStat icon={<Building2 size={24} />} label="Contratos Ativos" value={tenants.length.toString()} trend="+2 este mês" color="zinc" />
            <AdminStat icon={<Users size={24} />} label="Total Usuários" value="1.248" trend="+12%" color="emerald" />
            <AdminStat icon={<Activity size={24} />} label="Lançamentos/Dia" value="452" trend="+5%" color="blue" />
            <AdminStat icon={<AlertCircle size={24} />} label="Pendências" value="18" color="rose" />
          </div>

          {/* Multi-Tenant Management & Global Feed */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 bg-white rounded-[40px] border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900">Gestão de Contratos</h3>
                  <p className="text-sm text-zinc-500">Visualize e alimente dados de múltiplos contratos.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Buscar contrato..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 w-48"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-zinc-50/50 border-b border-zinc-100">
                      <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Contrato</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredTenants.map((tenant) => (
                      <tr key={tenant.id} className="hover:bg-zinc-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                              <Building2 className="text-zinc-400 group-hover:text-zinc-900" size={20} />
                            </div>
                            <span className="font-bold text-zinc-900">{tenant.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Ativo</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button 
                            onClick={() => onSelectTenant(tenant)}
                            className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all flex items-center gap-2 ml-auto"
                          >
                            Acessar <ExternalLink size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Global Activity Feed */}
            <div className="bg-white rounded-[40px] border border-zinc-200 shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-zinc-900">Atividade Global</h3>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>

              <div className="space-y-6">
                {[
                  { tenant: 'Toyota Brasil', action: 'Novo Atestado', user: 'Ricardo Prof', time: '2 min ago', type: 'absenteeism' },
                  { tenant: 'Usina Pilon', action: 'Aula Finalizada', user: 'Ana Silva', time: '15 min ago', type: 'gym' },
                  { tenant: 'Toyota Brasil', action: 'Plano de Ação', user: 'Marcos Eng', time: '1h ago', type: 'action' },
                  { tenant: 'Usina Pilon', action: 'Relatório Gerado', user: 'Sistema', time: '2h ago', type: 'report' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center shrink-0 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                      <Activity size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-bold text-zinc-900 truncate">{item.tenant}</p>
                        <span className="text-[10px] text-zinc-400 font-medium">{item.time}</span>
                      </div>
                      <p className="text-sm text-zinc-500 truncate">
                        <span className="font-bold text-zinc-700">{item.action}</span> por {item.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-8 py-4 border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-400 hover:text-zinc-900 hover:border-zinc-900 transition-all">
                Ver Todo Histórico
              </button>
            </div>
          </div>
        </>
      )}

      {activeAdminTab === 'campaigns' && (
        <div className="bg-white rounded-[40px] border border-zinc-200 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-zinc-900">Campanhas Globais</h3>
              <p className="text-zinc-500">Crie campanhas que serão enviadas para todos os contratos ativos.</p>
            </div>
            <button className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
              Nova Campanha Global
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Março Azul', desc: 'Prevenção Câncer Colorretal', status: 'Ativa', reach: '100% Contratos' },
              { title: 'Abril Verde', desc: 'Segurança no Trabalho', status: 'Agendada', reach: '100% Contratos' },
              { title: 'Maio Amarelo', desc: 'Segurança no Trânsito', status: 'Rascunho', reach: 'Pendente' },
            ].map((c, i) => (
              <div key={i} className="p-6 bg-zinc-50 rounded-3xl border border-zinc-200 hover:border-emerald-500 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Layers className="text-zinc-400 group-hover:text-emerald-600" size={24} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    c.status === 'Ativa' ? 'bg-emerald-100 text-emerald-700' : 
                    c.status === 'Agendada' ? 'bg-blue-100 text-blue-700' : 'bg-zinc-200 text-zinc-600'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-zinc-900 mb-1">{c.title}</h4>
                <p className="text-sm text-zinc-500 mb-4">{c.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
                  <span className="text-xs font-bold text-zinc-400 uppercase">{c.reach}</span>
                  <button className="text-emerald-600 font-bold text-xs hover:underline">Editar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeAdminTab === 'global_reports' && (
        <div className="space-y-8">
          <div className="bg-white rounded-[40px] border border-zinc-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-zinc-900">Relatórios Consolidados</h3>
                <p className="text-zinc-500">Visão macro de performance entre todos os contratos.</p>
              </div>
              <button className="px-6 py-3 bg-zinc-900 text-white rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200">
                Gerar PDF Consolidado
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-widest mb-2">Participação Média Global</h4>
                <div className="text-4xl font-black text-emerald-900">82.4%</div>
                <p className="text-xs text-emerald-600 mt-2">+3.1% em relação ao mês anterior</p>
              </div>
              <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                <h4 className="text-sm font-bold text-blue-700 uppercase tracking-widest mb-2">Total de Check-ins</h4>
                <div className="text-4xl font-black text-blue-900">45.2k</div>
                <p className="text-xs text-blue-600 mt-2">Média de 1.5k por contrato</p>
              </div>
              <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100">
                <h4 className="text-sm font-bold text-rose-700 uppercase tracking-widest mb-2">Taxa de Queixas</h4>
                <div className="text-4xl font-black text-rose-900">4.2%</div>
                <p className="text-xs text-rose-600 mt-2">-0.5% em relação ao mês anterior</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-[40px] border border-zinc-200 shadow-sm p-8">
              <h3 className="text-xl font-bold text-zinc-900 mb-6">Ranking de Performance (Top 5)</h3>
              <div className="space-y-4">
                {[
                  { name: 'Toyota Brasil', score: 98, trend: 'up' },
                  { name: 'Usina Pilon', score: 92, trend: 'up' },
                  { name: 'Nestlé BR', score: 88, trend: 'down' },
                  { name: 'Ambev', score: 85, trend: 'up' },
                  { name: 'Vale', score: 82, trend: 'stable' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <span className="w-6 text-xs font-bold text-zinc-400">0{i+1}</span>
                      <span className="font-bold text-zinc-900">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-zinc-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${item.score}%` }} />
                      </div>
                      <span className="text-xs font-bold text-zinc-600">{item.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[40px] border border-zinc-200 shadow-sm p-8">
              <h3 className="text-xl font-bold text-zinc-900 mb-6">Distribuição de Queixas por CID (Global)</h3>
              <div className="space-y-4">
                {[
                  { label: 'Grupo F (Mental)', value: 45, color: 'bg-purple-500' },
                  { label: 'Grupo G (Nervoso)', value: 25, color: 'bg-blue-500' },
                  { label: 'Grupo I (Circulatório)', value: 20, color: 'bg-amber-500' },
                  { label: 'Outros', value: 10, color: 'bg-zinc-400' },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-zinc-400">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
