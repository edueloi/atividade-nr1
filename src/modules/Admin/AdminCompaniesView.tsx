import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2, Plus, Search, ExternalLink, Pencil, X,
  Users, FileText, AlertTriangle, CheckCircle2, TrendingUp,
  ChevronRight, BarChart3
} from 'lucide-react';
import {
  type AdminContractRecord,
  type AdminHealth,
  loadAdminContracts,
  saveAdminContracts,
} from './adminStorage.js';

interface Tenant { id: string; name: string; logo_url?: string; }

interface Props {
  tenants: any[];
  onAddTenant: (tenant: any) => void;
  onSelectTenant: (tenant: any) => void;
}

const SEGMENTS = ['Automotivo', 'Agroindustrial', 'Químico', 'Logística', 'Tecnologia', 'Saúde', 'Outro'];

const healthLabel: Record<AdminHealth, string> = {
  healthy: 'Saudável', attention: 'Atenção', critical: 'Crítico', onboarding: 'Onboarding'
};
const healthColor: Record<AdminHealth, string> = {
  healthy: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  attention: 'bg-amber-100 text-amber-700 border-amber-200',
  critical: 'bg-rose-100 text-rose-700 border-rose-200',
  onboarding: 'bg-blue-100 text-blue-700 border-blue-200',
};

export const AdminCompaniesView: React.FC<Props> = ({ tenants, onAddTenant, onSelectTenant }) => {
  const [records, setRecords] = useState<AdminContractRecord[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', cnpj: '', segment: 'Automotivo', employeeBase: 100, owner: '' });

  useEffect(() => {
    setRecords(loadAdminContracts(tenants));
  }, [tenants]);

  const filtered = records.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.owner.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setEditId(null);
    setForm({ name: '', cnpj: '', segment: 'Automotivo', employeeBase: 100, owner: '' });
    setShowModal(true);
  };

  const openEdit = (r: AdminContractRecord) => {
    setEditId(r.id);
    setForm({ name: r.name, cnpj: r.cnpj || '', segment: r.segment || 'Outro', employeeBase: r.employeeBase, owner: r.owner });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;

    if (editId) {
      const next = records.map(r => r.id === editId ? {
        ...r,
        name: form.name,
        cnpj: form.cnpj,
        segment: form.segment,
        employeeBase: form.employeeBase,
        owner: form.owner,
        lastUpdate: new Date().toISOString(),
      } : r);
      setRecords(next);
      saveAdminContracts(next);
    } else {
      const id = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const newTenant: Tenant = { id, name: form.name };
      onAddTenant(newTenant);

      const newRecord: AdminContractRecord = {
        id,
        name: form.name,
        cnpj: form.cnpj,
        segment: form.segment,
        owner: form.owner || 'Não definido',
        units: 1,
        users: 0,
        employeeBase: form.employeeBase,
        publishedForms: 0,
        nr1Cycles: 0,
        nr1Responses: 0,
        adherenceRate: 0,
        highRiskSectors: 0,
        pendingAbsenteeism: 0,
        openComplaints: 0,
        actionPlansOpen: 0,
        actionPlansDelayed: 0,
        primaryRisk: 'Aguardando mapeamento',
        reportStatus: 'draft',
        closingStatus: 'not_started',
        health: 'onboarding',
        notes: '',
        lastUpdate: new Date().toISOString(),
      };
      const next = [...records, newRecord];
      setRecords(next);
      saveAdminContracts(next);
    }
    setShowModal(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <Building2 size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Administração</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-900">Empresas Cadastradas</h1>
          <p className="text-zinc-500 font-medium">Gerencie contratos, crie novas empresas e configure acessos.</p>
        </div>
        <button onClick={openNew} className="px-6 py-3 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-lg shadow-zinc-200">
          <Plus size={16} /> Nova Empresa
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Empresas', value: records.length, color: 'bg-zinc-50' },
          { label: 'Ciclos Ativos', value: records.filter(r => r.nr1Cycles > 0).length, color: 'bg-blue-50' },
          { label: 'Setores Críticos', value: records.reduce((s, r) => s + r.highRiskSectors, 0), color: 'bg-rose-50' },
          { label: 'Base Total', value: records.reduce((s, r) => s + r.employeeBase, 0).toLocaleString(), color: 'bg-emerald-50' },
        ].map(s => (
          <div key={s.label} className={`${s.color} p-5 rounded-2xl border border-zinc-100`}>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{s.label}</p>
            <p className="text-2xl font-black text-zinc-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
        <input
          type="text"
          placeholder="Buscar empresa..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(r => (
          <motion.div key={r.id} whileHover={{ y: -3 }}
            className="bg-white border border-zinc-200 rounded-[32px] p-7 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                  <Building2 size={22} />
                </div>
                <div>
                  <h3 className="font-black text-zinc-900">{r.name}</h3>
                  <p className="text-xs text-zinc-400">{r.owner}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${healthColor[r.health]}`}>
                {healthLabel[r.health]}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="text-center p-3 bg-zinc-50 rounded-xl">
                <p className="text-lg font-black text-zinc-900">{r.employeeBase}</p>
                <p className="text-[9px] font-black text-zinc-400 uppercase">Colab.</p>
              </div>
              <div className="text-center p-3 bg-zinc-50 rounded-xl">
                <p className="text-lg font-black text-zinc-900">{r.nr1Cycles}</p>
                <p className="text-[9px] font-black text-zinc-400 uppercase">Ciclos</p>
              </div>
              <div className="text-center p-3 bg-zinc-50 rounded-xl">
                <p className="text-lg font-black text-zinc-900">{r.adherenceRate}%</p>
                <p className="text-[9px] font-black text-zinc-400 uppercase">Adesão</p>
              </div>
            </div>

            {r.highRiskSectors > 0 && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl mb-5 text-xs text-rose-700 font-bold">
                <AlertTriangle size={14} /> {r.highRiskSectors} setores críticos — {r.primaryRisk}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => onSelectTenant({ id: r.id, name: r.name })}
                className="flex items-center justify-center gap-2 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all"
              >
                <ExternalLink size={14} /> Acessar
              </button>
              <button onClick={() => openEdit(r)}
                className="flex items-center justify-center gap-2 py-2.5 border border-zinc-200 text-zinc-600 rounded-xl text-xs font-bold hover:bg-zinc-50 transition-all"
              >
                <Pencil size={14} /> Editar
              </button>
            </div>
          </motion.div>
        ))}

        {/* Add card placeholder */}
        <button onClick={openNew}
          className="border-2 border-dashed border-zinc-200 rounded-[32px] p-7 flex flex-col items-center justify-center gap-3 text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 transition-all min-h-[260px]"
        >
          <Plus size={32} />
          <span className="font-black text-xs uppercase tracking-widest">Nova Empresa</span>
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] bg-zinc-900/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-zinc-900">{editId ? 'Editar Empresa' : 'Nova Empresa'}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{editId ? 'Atualize os dados do contrato' : 'Cadastre um novo contrato'}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 text-zinc-400 hover:text-zinc-900 rounded-xl hover:bg-zinc-100 transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Nome da Empresa *</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Ex: Yazaki do Brasil"
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">CNPJ</label>
                    <input type="text" value={form.cnpj} onChange={e => setForm({ ...form, cnpj: e.target.value })}
                      placeholder="00.000.000/0001-00"
                      className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Segmento</label>
                    <select value={form.segment} onChange={e => setForm({ ...form, segment: e.target.value })}
                      className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10">
                      {SEGMENTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Base de Colaboradores</label>
                    <input type="number" min={1} value={form.employeeBase} onChange={e => setForm({ ...form, employeeBase: parseInt(e.target.value) || 0 })}
                      className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Responsável</label>
                    <input type="text" value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })}
                      placeholder="Ex: Ricardo Silva"
                      className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10" />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-6 py-3 text-zinc-600 font-bold text-sm hover:bg-zinc-200 rounded-2xl transition-all">Cancelar</button>
                <button onClick={handleSave} disabled={!form.name.trim()}
                  className="px-8 py-3 bg-zinc-900 text-white rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-zinc-200"
                >
                  {editId ? 'Salvar Alterações' : 'Criar Empresa'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
