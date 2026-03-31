import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Filter, Download, CheckCircle2, Clock, Share2 } from 'lucide-react';

interface Tenant { id: string; name: string; logo_url?: string; }

const MONTHS = ['Janeiro', 'Fevereiro', 'Março'];
type ReportStatus = 'draft' | 'ready' | 'shared';

const statusLabel: Record<ReportStatus, string> = { draft: 'Rascunho', ready: 'Pronto', shared: 'Compartilhado' };
const statusColor: Record<ReportStatus, string> = {
  draft: 'bg-zinc-100 text-zinc-600',
  ready: 'bg-emerald-100 text-emerald-700',
  shared: 'bg-blue-100 text-blue-700',
};
const statusIcon: Record<ReportStatus, React.ReactNode> = {
  draft: <Clock size={14} />,
  ready: <CheckCircle2 size={14} />,
  shared: <Share2 size={14} />,
};

interface ReportRow {
  tenantName: string;
  month: string;
  status: ReportStatus;
  score: number;
  responses: number;
}

export const AdminReportsView: React.FC<{ tenants: any[] }> = ({ tenants }) => {
  const [statusFilter, setStatusFilter] = useState<'all' | ReportStatus>('all');

  const rows: ReportRow[] = [
    { tenantName: 'Toyota Brasil', month: 'Março', status: 'ready', score: 42, responses: 124 },
    { tenantName: 'Toyota Brasil', month: 'Fevereiro', status: 'shared', score: 48, responses: 110 },
    { tenantName: 'Toyota Brasil', month: 'Janeiro', status: 'shared', score: 52, responses: 95 },
    { tenantName: 'Usina Pilon', month: 'Março', status: 'draft', score: 0, responses: 47 },
    { tenantName: 'Usina Pilon', month: 'Fevereiro', status: 'draft', score: 0, responses: 0 },
  ];

  const filtered = rows.filter(r => statusFilter === 'all' || r.status === statusFilter);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <BarChart3 size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Administração</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-900">Relatórios Consolidados</h1>
          <p className="text-zinc-500 font-medium">Status de relatórios por empresa e período.</p>
        </div>
        <button className="px-6 py-3 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-lg shadow-zinc-200">
          <Download size={16} /> Exportar Visão Geral
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Rascunhos</p>
          <p className="text-3xl font-black text-zinc-900 mt-1">{rows.filter(r => r.status === 'draft').length}</p>
        </div>
        <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Prontos</p>
          <p className="text-3xl font-black text-emerald-900 mt-1">{rows.filter(r => r.status === 'ready').length}</p>
        </div>
        <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Compartilhados</p>
          <p className="text-3xl font-black text-blue-900 mt-1">{rows.filter(r => r.status === 'shared').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'draft', 'ready', 'shared'] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              statusFilter === s ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-900'
            }`}
          >
            {s === 'all' ? 'Todos' : statusLabel[s]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-[32px] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-100">
              <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Empresa</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Mês</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Score</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Respostas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered.map((r, i) => (
              <tr key={i} className="hover:bg-zinc-50/60 transition-colors">
                <td className="px-6 py-4 font-bold text-zinc-900 text-sm">{r.tenantName}</td>
                <td className="px-6 py-4 text-sm text-zinc-600">{r.month} 2026</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColor[r.status]}`}>
                    {statusIcon[r.status]} {statusLabel[r.status]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-zinc-900">{r.score || '—'}</td>
                <td className="px-6 py-4 text-sm text-zinc-600">{r.responses}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-zinc-400">
            <p className="font-bold">Nenhum relatório encontrado</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
