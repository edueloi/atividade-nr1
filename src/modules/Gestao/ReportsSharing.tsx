import React from 'react';
import { motion } from 'motion/react';
import { 
  Link, Copy, Trash2, Eye, 
  Clock, Shield, ExternalLink,
  CheckCircle2, AlertCircle, MoreVertical,
  Search, Filter
} from 'lucide-react';
import { ShareLink } from './reportsTypes';

interface ReportsSharingProps {
  links: ShareLink[];
  onCopy: (token: string) => void;
  onRevoke: (id: string) => void;
  onPreview: (reportId: string) => void;
}

export const ReportsSharing: React.FC<ReportsSharingProps> = ({
  links,
  onCopy,
  onRevoke,
  onPreview
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
            <CheckCircle2 size={12} /> Ativo
          </span>
        );
      case 'REVOKED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-[10px] font-black uppercase tracking-widest">
            <AlertCircle size={12} /> Revogado
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Clock size={12} /> Expirado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div>
          <h3 className="text-2xl font-black text-zinc-900">Compartilhamentos Seguros</h3>
          <p className="text-zinc-500 text-sm">Gerencie links externos e controle o acesso aos relatórios.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar links..."
              className="pl-12 pr-6 py-3 bg-white border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 w-64"
            />
          </div>
          <button className="p-3 bg-white border border-zinc-200 rounded-2xl text-zinc-400 hover:text-zinc-900 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-[48px] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-100">
              <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Relatório / Link</th>
              <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Expira em</th>
              <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Visualizações</th>
              <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {links.map((link) => (
              <tr key={link.id} className="hover:bg-zinc-50/50 transition-all group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white border border-zinc-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Link className="text-zinc-400" size={24} />
                    </div>
                    <div>
                      <p className="font-black text-zinc-900">{link.report_name}</p>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                        {link.token} {link.has_password && <Shield size={10} className="text-emerald-500" />}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-xs font-bold text-zinc-900">{new Date(link.expires_at).toLocaleDateString()}</p>
                  <p className="text-[10px] text-zinc-400 font-medium">às {new Date(link.expires_at).toLocaleTimeString()}</p>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <Eye size={14} className="text-zinc-400" />
                    <span className="text-xs font-bold text-zinc-900">{link.views_count}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  {getStatusBadge(link.status)}
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onCopy(link.token)}
                      className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                      title="Copiar Link"
                    >
                      <Copy size={20} />
                    </button>
                    <button 
                      onClick={() => onPreview(link.report_id)}
                      className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      title="Visualizar"
                    >
                      <ExternalLink size={20} />
                    </button>
                    <div className="relative group/menu">
                      <button className="p-3 text-zinc-400 hover:text-zinc-900 transition-all">
                        <MoreVertical size={20} />
                      </button>
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-zinc-200 rounded-2xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 p-2">
                        <button onClick={() => onRevoke(link.id)} className="w-full p-3 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2">
                          <Trash2 size={14} /> Revogar Link
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
