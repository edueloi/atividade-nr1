import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ScrollText, Search, Filter, Activity, User, FileText, Settings, Shield } from 'lucide-react';

interface Tenant { id: string; name: string; logo_url?: string; }

interface AuditEntry {
  id: string;
  date: string;
  user: string;
  tenant: string;
  action: string;
  module: string;
  icon: React.ReactNode;
}

const MOCK_AUDIT: AuditEntry[] = [
  { id: 'a1', date: '2026-03-30T14:32:00', user: 'Ricardo Silva', tenant: 'Toyota Brasil', action: 'Publicou formulário DRS Psicossocial v1', module: 'NR1', icon: <FileText size={16} /> },
  { id: 'a2', date: '2026-03-30T11:15:00', user: 'Admin Atividade', tenant: 'Global', action: 'Criou novo usuário: Juliana Ferraz', module: 'Usuários', icon: <User size={16} /> },
  { id: 'a3', date: '2026-03-29T16:45:00', user: 'Carlos Eduardo', tenant: 'Toyota Brasil', action: 'Lançou 12 registros de absenteísmo', module: 'Absenteísmo', icon: <Activity size={16} /> },
  { id: 'a4', date: '2026-03-29T10:20:00', user: 'Ricardo Silva', tenant: 'Toyota Brasil', action: 'Compartilhou link do formulário para Yazaki', module: 'NR1', icon: <FileText size={16} /> },
  { id: 'a5', date: '2026-03-28T09:00:00', user: 'Ana Paula Mendes', tenant: 'Usina Pilon', action: 'Criou plano de ação — Setor Logística', module: 'Plano de Ação', icon: <Settings size={16} /> },
  { id: 'a6', date: '2026-03-27T15:30:00', user: 'Admin Atividade', tenant: 'Global', action: 'Editou contrato Usina Pilon — atualizou base de colaboradores', module: 'Admin', icon: <Shield size={16} /> },
  { id: 'a7', date: '2026-03-27T08:10:00', user: 'Carlos Eduardo', tenant: 'Toyota Brasil', action: 'Registrou 5 queixas ambulatoriais', module: 'Queixas', icon: <Activity size={16} /> },
  { id: 'a8', date: '2026-03-26T14:00:00', user: 'Ricardo Silva', tenant: 'Toyota Brasil', action: 'Fechou ciclo Fevereiro/2026', module: 'NR1', icon: <FileText size={16} /> },
  { id: 'a9', date: '2026-03-25T10:00:00', user: 'Admin Atividade', tenant: 'Global', action: 'Exportou relatório consolidado Março', module: 'Relatórios', icon: <FileText size={16} /> },
  { id: 'a10', date: '2026-03-24T16:20:00', user: 'Ana Paula Mendes', tenant: 'Usina Pilon', action: 'Lançou presenças ginástica laboral — 28 colaboradores', module: 'Aula + Presença', icon: <Activity size={16} /> },
];

export const AdminAuditView: React.FC<{ tenants: any[] }> = ({ tenants }) => {
  const [search, setSearch] = useState('');
  const [tenantFilter, setTenantFilter] = useState('all');

  const filtered = MOCK_AUDIT.filter(a => {
    const matchSearch = a.action.toLowerCase().includes(search.toLowerCase()) ||
      a.user.toLowerCase().includes(search.toLowerCase()) ||
      a.module.toLowerCase().includes(search.toLowerCase());
    const matchTenant = tenantFilter === 'all' || a.tenant === tenantFilter;
    return matchSearch && matchTenant;
  });

  const allTenantNames = [...new Set(MOCK_AUDIT.map(a => a.tenant))];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <div className="flex items-center gap-3 text-zinc-400 mb-2">
          <ScrollText size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest">Administração</span>
        </div>
        <h1 className="text-3xl font-black text-zinc-900">Auditoria / Logs</h1>
        <p className="text-zinc-500 font-medium">Histórico de ações realizadas na plataforma por todos os usuários.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input type="text" placeholder="Buscar por ação, usuário ou módulo..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10" />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-zinc-400" />
          <select value={tenantFilter} onChange={e => setTenantFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-700 focus:outline-none">
            <option value="all">Todas as empresas</option>
            {allTenantNames.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Feed */}
      <div className="bg-white border border-zinc-200 rounded-[32px] overflow-hidden shadow-sm divide-y divide-zinc-100">
        {filtered.map(a => (
          <div key={a.id} className="p-6 flex items-start gap-5 hover:bg-zinc-50/60 transition-colors">
            <div className="w-10 h-10 bg-zinc-100 text-zinc-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <span className="font-black text-zinc-900 text-sm">{a.user}</span>
                <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-lg text-[9px] font-bold uppercase">{a.tenant}</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-bold uppercase">{a.module}</span>
              </div>
              <p className="text-sm text-zinc-600">{a.action}</p>
            </div>
            <span className="text-[10px] font-bold text-zinc-400 whitespace-nowrap flex-shrink-0">
              {new Date(a.date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-12 text-center text-zinc-400">
            <ScrollText size={32} className="mx-auto mb-3 opacity-20" />
            <p className="font-bold">Nenhum registro encontrado</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
