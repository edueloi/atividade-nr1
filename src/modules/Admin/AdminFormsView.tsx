import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Search, Filter, CheckCircle2, Clock, Users, ExternalLink, Eye } from 'lucide-react';

interface Tenant { id: string; name: string; logo_url?: string; }

const MOCK_FORMS = [
  { id: 'f1', name: 'DRS Psicossocial - Padrão Atividade', version: 1, status: 'PUBLISHED', questions: 24, tenants: ['Toyota Brasil', 'Usina Pilon'], responses: 171, updatedAt: '2026-03-01' },
  { id: 'f2', name: 'Mapeamento de Clima Organizacional', version: 2, status: 'DRAFT', questions: 15, tenants: ['Toyota Brasil'], responses: 0, updatedAt: '2026-03-04' },
  { id: 'f3', name: 'Avaliação de Riscos Ergonômicos', version: 1, status: 'PUBLISHED', questions: 18, tenants: ['Usina Pilon'], responses: 47, updatedAt: '2026-02-15' },
  { id: 'f4', name: 'Pesquisa de Satisfação NR-1', version: 1, status: 'PUBLISHED', questions: 10, tenants: ['Toyota Brasil', 'Usina Pilon'], responses: 89, updatedAt: '2026-01-20' },
];

export const AdminFormsView: React.FC<{ tenants: any[] }> = ({ tenants }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'PUBLISHED' | 'DRAFT'>('all');

  const filtered = MOCK_FORMS.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || f.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalResponses = MOCK_FORMS.reduce((s, f) => s + f.responses, 0);
  const publishedCount = MOCK_FORMS.filter(f => f.status === 'PUBLISHED').length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <div className="flex items-center gap-3 text-zinc-400 mb-2">
          <FileText size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest">Administração</span>
        </div>
        <h1 className="text-3xl font-black text-zinc-900">Formulários Globais</h1>
        <p className="text-zinc-500 font-medium">Visão consolidada de todos os formulários da plataforma.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total</p>
          <p className="text-2xl font-black text-zinc-900 mt-1">{MOCK_FORMS.length}</p>
        </div>
        <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Publicados</p>
          <p className="text-2xl font-black text-emerald-900 mt-1">{publishedCount}</p>
        </div>
        <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Respostas Totais</p>
          <p className="text-2xl font-black text-blue-900 mt-1">{totalResponses}</p>
        </div>
        <div className="p-5 bg-purple-50 rounded-2xl border border-purple-100">
          <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Empresas usando</p>
          <p className="text-2xl font-black text-purple-900 mt-1">{tenants.length}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input type="text" placeholder="Buscar formulário..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10" />
        </div>
        <div className="flex gap-2">
          {(['all', 'PUBLISHED', 'DRAFT'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                statusFilter === s ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-900'
              }`}
            >
              {s === 'all' ? 'Todos' : s === 'PUBLISHED' ? 'Publicados' : 'Rascunhos'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(f => (
          <div key={f.id} className="bg-white border border-zinc-200 rounded-[32px] p-7 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-zinc-50 rounded-2xl text-zinc-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                <FileText size={22} />
              </div>
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                f.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {f.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
              </span>
            </div>

            <h3 className="font-black text-zinc-900 mb-1">{f.name}</h3>
            <p className="text-xs text-zinc-400 mb-4">v{f.version} · {f.questions} questões · Atualizado {f.updatedAt}</p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {f.tenants.map(t => (
                <span key={t} className="px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-lg text-[9px] font-bold">{t}</span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
              <div className="flex items-center gap-2 text-xs text-zinc-500 font-bold">
                <Users size={14} /> {f.responses} respostas
              </div>
              <button className="px-4 py-2 bg-zinc-100 text-zinc-600 rounded-xl text-xs font-bold hover:bg-zinc-200 transition-all flex items-center gap-1.5">
                <Eye size={14} /> Visualizar
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 bg-zinc-50 rounded-[40px] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-400">
          <FileText size={40} className="mb-3 opacity-20" />
          <p className="font-bold">Nenhum formulário encontrado</p>
        </div>
      )}
    </motion.div>
  );
}
