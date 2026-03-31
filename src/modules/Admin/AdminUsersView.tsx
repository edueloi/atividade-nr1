import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Plus, Search, X, Shield, User, HardHat, CheckCircle2, Clock } from 'lucide-react';
import { type AdminUser, type AdminUserRole, loadAdminUsers, saveAdminUsers } from './adminStorage.js';

interface Tenant { id: string; name: string; logo_url?: string; }

const ROLE_LABEL: Record<AdminUserRole, string> = {
  admin_atividade: 'Administrador',
  professional: 'Profissional',
  tecnico_sst: 'Técnico SST',
};

const ROLE_COLOR: Record<AdminUserRole, string> = {
  admin_atividade: 'bg-zinc-100 text-zinc-700',
  professional: 'bg-emerald-100 text-emerald-700',
  tecnico_sst: 'bg-blue-100 text-blue-700',
};

const ROLE_ICON: Record<AdminUserRole, React.ReactNode> = {
  admin_atividade: <Shield size={16} />,
  professional: <User size={16} />,
  tecnico_sst: <HardHat size={16} />,
};

export const AdminUsersView: React.FC<{ tenants: any[] }> = ({ tenants }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | AdminUserRole>('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'professional' as AdminUserRole, tenantId: '' as string | null });

  useEffect(() => { setUsers(loadAdminUsers()); }, []);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleAdd = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    const newUser: AdminUser = {
      id: `u-${Date.now()}`,
      name: form.name,
      email: form.email,
      role: form.role,
      tenantId: form.role === 'admin_atividade' ? null : (form.tenantId || null),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const next = [...users, newUser];
    setUsers(next);
    saveAdminUsers(next);
    setShowModal(false);
    setForm({ name: '', email: '', role: 'professional', tenantId: '' });
  };

  const getTenantName = (id: string | null) => {
    if (!id) return 'Global';
    return tenants.find(t => t.id === id)?.name || id;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <Users size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Administração</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-900">Usuários & Acessos</h1>
          <p className="text-zinc-500 font-medium">Gerencie profissionais, técnicos e administradores da plataforma.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-lg shadow-zinc-200">
          <Plus size={16} /> Novo Usuário
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total</p>
          <p className="text-2xl font-black text-zinc-900 mt-1">{users.length}</p>
        </div>
        <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Ativos</p>
          <p className="text-2xl font-black text-emerald-900 mt-1">{users.filter(u => u.status === 'active').length}</p>
        </div>
        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Pendentes</p>
          <p className="text-2xl font-black text-amber-900 mt-1">{users.filter(u => u.status === 'pending').length}</p>
        </div>
        <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Técnicos SST</p>
          <p className="text-2xl font-black text-blue-900 mt-1">{users.filter(u => u.role === 'tecnico_sst').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input type="text" placeholder="Buscar por nome ou e-mail..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10" />
        </div>
        <div className="flex gap-2">
          {(['all', 'admin_atividade', 'professional', 'tecnico_sst'] as const).map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                roleFilter === r ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-900'
              }`}
            >
              {r === 'all' ? 'Todos' : ROLE_LABEL[r]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-[32px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Usuário</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Papel</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Empresa</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Criado em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-zinc-900 text-sm">{u.name}</p>
                    <p className="text-xs text-zinc-400">{u.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${ROLE_COLOR[u.role]}`}>
                      {ROLE_ICON[u.role]} {ROLE_LABEL[u.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-600">{getTenantName(u.tenantId)}</td>
                  <td className="px-6 py-4">
                    {u.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold"><CheckCircle2 size={14} /> Ativo</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-bold"><Clock size={14} /> Pendente</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-400">{new Date(u.createdAt).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-zinc-400">
            <Users size={32} className="mx-auto mb-3 opacity-20" />
            <p className="font-bold">Nenhum usuário encontrado</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] bg-zinc-900/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-zinc-100 flex justify-between items-center">
                <h3 className="text-xl font-black text-zinc-900">Novo Usuário</h3>
                <button onClick={() => setShowModal(false)} className="p-2 text-zinc-400 hover:text-zinc-900 rounded-xl hover:bg-zinc-100"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Nome *</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nome completo"
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">E-mail *</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@empresa.com"
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Papel</label>
                    <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as AdminUserRole })}
                      className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10">
                      <option value="professional">Profissional</option>
                      <option value="tecnico_sst">Técnico SST</option>
                      <option value="admin_atividade">Administrador</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Empresa</label>
                    <select value={form.tenantId || ''} onChange={e => setForm({ ...form, tenantId: e.target.value || null })}
                      disabled={form.role === 'admin_atividade'}
                      className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 disabled:opacity-50">
                      <option value="">Selecionar...</option>
                      {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800">
                  O acesso será criado com status <strong>Pendente</strong>. A configuração final de credenciais será feita posteriormente.
                </div>
              </div>
              <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-6 py-3 text-zinc-600 font-bold text-sm hover:bg-zinc-200 rounded-2xl">Cancelar</button>
                <button onClick={handleAdd} disabled={!form.name.trim() || !form.email.trim()}
                  className="px-8 py-3 bg-zinc-900 text-white rounded-2xl font-bold text-sm hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-zinc-200">
                  Cadastrar Usuário
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
