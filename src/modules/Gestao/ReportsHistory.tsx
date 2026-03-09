import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, Eye, RefreshCw, Trash2, 
  Info, FileText, FileArchive, BarChart3,
  AlertCircle, Clock, CheckCircle2,
  MoreVertical, Search, Filter, Share2
} from 'lucide-react';
import { ReportJob } from './reportsTypes';
import { PreviewModal, ShareModal } from './ReportsModals';

interface ReportsHistoryProps {
  jobs: ReportJob[];
  onDownload: (job: ReportJob) => void;
  onPreview: (job: ReportJob) => void;
  onRetry: (job: ReportJob) => void;
  onDelete: (id: string) => void;
  onDetails: (job: ReportJob) => void;
  onShare: (data: any) => void;
}

export const ReportsHistory: React.FC<ReportsHistoryProps> = ({
  jobs,
  onDownload,
  onPreview,
  onRetry,
  onDelete,
  onDetails,
  onShare
}) => {
  const [previewJob, setPreviewJob] = useState<ReportJob | null>(null);
  const [shareJob, setShareJob] = useState<ReportJob | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
            <CheckCircle2 size={12} /> Concluído
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
            <Clock size={12} className="animate-spin" /> Processando
          </span>
        );
      case 'FAILED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-[10px] font-black uppercase tracking-widest">
            <AlertCircle size={12} /> Falhou
          </span>
        );
      default:
        return null;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'PDF': return <FileText className="text-rose-500" />;
      case 'ZIP': return <FileArchive className="text-amber-500" />;
      case 'CSV': return <BarChart3 className="text-emerald-500" />;
      case 'XLSX': return <BarChart3 className="text-emerald-600" />;
      default: return <FileText className="text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div>
          <h3 className="text-2xl font-black text-zinc-900">Histórico de Geração</h3>
          <p className="text-zinc-500 text-sm">Acompanhe o status e baixe seus relatórios.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar histórico..."
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
              <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Relatório / Tipo</th>
              <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Parâmetros</th>
              <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Data Geração</th>
              <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-zinc-50/50 transition-all group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white border border-zinc-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      {getFormatIcon(job.format)}
                    </div>
                    <div>
                      <p className="font-black text-zinc-900">{job.name}</p>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{job.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-zinc-600">Mês: {job.params.month}</p>
                    <p className="text-[10px] text-zinc-400 font-medium">{job.params.modules.length} módulos incluídos</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-xs font-bold text-zinc-900">{new Date(job.created_at).toLocaleDateString()}</p>
                  <p className="text-[10px] text-zinc-400 font-medium">{new Date(job.created_at).toLocaleTimeString()}</p>
                </td>
                <td className="px-8 py-6">
                  {getStatusBadge(job.status)}
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onDownload(job)}
                      disabled={job.status !== 'COMPLETED'}
                      className={`p-3 rounded-xl transition-all ${job.status === 'COMPLETED' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-zinc-300 cursor-not-allowed'}`}
                      title="Download"
                    >
                      <Download size={20} />
                    </button>
                    <button 
                      onClick={() => setPreviewJob(job)}
                      disabled={job.status !== 'COMPLETED'}
                      className={`p-3 rounded-xl transition-all ${job.status === 'COMPLETED' ? 'text-blue-600 hover:bg-blue-50' : 'text-zinc-300 cursor-not-allowed'}`}
                      title="Preview"
                    >
                      <Eye size={20} />
                    </button>
                    <button 
                      onClick={() => setShareJob(job)}
                      disabled={job.status !== 'COMPLETED'}
                      className={`p-3 rounded-xl transition-all ${job.status === 'COMPLETED' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-zinc-300 cursor-not-allowed'}`}
                      title="Compartilhar"
                    >
                      <Share2 size={20} />
                    </button>
                    {job.status === 'FAILED' && (
                      <button 
                        onClick={() => onRetry(job)}
                        className="p-3 text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                        title="Tentar Novamente"
                      >
                        <RefreshCw size={20} />
                      </button>
                    )}
                    <div className="relative group/menu">
                      <button className="p-3 text-zinc-400 hover:text-zinc-900 transition-all">
                        <MoreVertical size={20} />
                      </button>
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-zinc-200 rounded-2xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 p-2">
                        <button onClick={() => onDetails(job)} className="w-full p-3 text-left text-xs font-bold text-zinc-600 hover:bg-zinc-50 rounded-xl flex items-center gap-2">
                          <Info size={14} /> Detalhes
                        </button>
                        <div className="h-px bg-zinc-100 my-1" />
                        <button onClick={() => onDelete(job.id)} className="w-full p-3 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2">
                          <Trash2 size={14} /> Excluir
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

      <AnimatePresence>
        {previewJob && (
          <PreviewModal job={previewJob} onClose={() => setPreviewJob(null)} />
        )}
        {shareJob && (
          <ShareModal 
            job={shareJob} 
            onClose={() => setShareJob(null)} 
            onShare={(data) => {
              onShare(data);
              // Modal handles token display, we just trigger the API in parent
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};
