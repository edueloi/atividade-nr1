import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, FileArchive, AlertTriangle, 
  Download, RefreshCw, ChevronRight,
  TrendingUp, Clock, AlertCircle,
  BarChart3, ShieldCheck, Camera
} from 'lucide-react';
import { ReportJob } from './reportsTypes';

interface ReportsVisionProps {
  onQuickGenerate: (type: string) => void;
  lastReport?: ReportJob;
  recentFailures: ReportJob[];
  onRetry: (job: ReportJob) => void;
}

export const ReportsVision: React.FC<ReportsVisionProps> = ({ 
  onQuickGenerate, 
  lastReport, 
  recentFailures,
  onRetry
}) => {
  const shortcuts = [
    { id: 'EXECUTIVE', label: 'Relatório Mensal Consolidado', sub: 'Executivo', icon: <TrendingUp size={24} />, color: 'emerald' },
    { id: 'TECHNICAL', label: 'Relatório Técnico Mensal', sub: 'SESMT / Auditoria', icon: <ShieldCheck size={24} />, color: 'blue' },
    { id: 'ZIP', label: 'Pacote de Evidências', sub: 'ZIP / Fotos', icon: <Camera size={24} />, color: 'rose' },
    { id: 'NR1', label: 'Relatório NR1 Psicossocial', sub: 'Saúde Mental', icon: <FileText size={24} />, color: 'purple' },
    { id: 'ABSENTEEISM', label: 'Relatório Absenteísmo', sub: 'Gestão de Faltas', icon: <BarChart3 size={24} />, color: 'amber' },
    { id: 'ERGO', label: 'Relatório Ergonomia', sub: 'Análise Ergonômica', icon: <AlertCircle size={24} />, color: 'orange' },
  ];

  return (
    <div className="space-y-10">
      {/* Shortcuts */}
      <div className="space-y-6">
        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Atalhos Mais Usados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shortcuts.map((s) => (
            <motion.button
              key={s.id}
              whileHover={{ y: -5 }}
              onClick={() => onQuickGenerate(s.id)}
              className="p-8 bg-white border border-zinc-200 rounded-[40px] shadow-sm hover:shadow-xl hover:border-zinc-900 transition-all text-left group flex flex-col justify-between h-56"
            >
              <div className={`w-14 h-14 bg-${s.color}-50 text-${s.color}-600 rounded-2xl flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all`}>
                {s.icon}
              </div>
              <div>
                <p className={`text-[10px] font-black text-${s.color}-600 uppercase tracking-widest mb-1 group-hover:text-zinc-400`}>{s.sub}</p>
                <h4 className="text-xl font-black text-zinc-900 group-hover:text-zinc-900">{s.label}</h4>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 group-hover:text-zinc-900 transition-all">
                <span className="text-[10px] font-black uppercase tracking-widest">Gerar Agora</span>
                <ChevronRight size={14} />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Last Generated */}
        <div className="p-10 bg-zinc-900 text-white rounded-[48px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
            <FileText size={120} />
          </div>
          <div className="relative z-10 space-y-8">
            <div>
              <span className="px-4 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest">Último Gerado</span>
              <h3 className="text-3xl font-black mt-4">{lastReport?.name || 'Nenhum relatório recente'}</h3>
              <p className="text-zinc-400 text-sm mt-2">Gerado por {lastReport?.generated_by} em {lastReport ? new Date(lastReport.created_at).toLocaleString() : '-'}</p>
            </div>
            {lastReport && (
              <button className="px-8 py-4 bg-white text-zinc-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-100 transition-all flex items-center gap-2">
                <Download size={16} /> Baixar Relatório
              </button>
            )}
          </div>
        </div>

        {/* Recent Failures */}
        <div className="p-10 bg-white border border-zinc-200 rounded-[48px] shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-zinc-900">Falhas Recentes</h3>
            <AlertTriangle className="text-amber-500" size={24} />
          </div>
          
          <div className="space-y-4">
            {recentFailures.length > 0 ? (
              recentFailures.map((f) => (
                <div key={f.id} className="p-6 bg-rose-50 border border-rose-100 rounded-3xl flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-600 shadow-sm">
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 text-sm">{f.name}</p>
                      <p className="text-[10px] text-rose-600 font-medium">Falha no processamento</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onRetry(f)}
                    className="p-3 bg-white text-zinc-400 hover:text-zinc-900 rounded-xl shadow-sm transition-all"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-zinc-400">
                <ShieldCheck size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-bold">Nenhuma falha registrada</p>
                <p className="text-xs">Tudo funcionando perfeitamente.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
