import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, BarChart3, FileArchive, 
  Download, Filter, Search, Calendar,
  ChevronDown, LayoutDashboard, History, Map, Info, MoreVertical,
  Settings, Lock, Unlock, Users, Activity, CheckCircle2,
  Layers, Star, Share2, Plus, TrendingUp, ShieldCheck, Camera
} from 'lucide-react';
import { ReportsVision } from './ReportsVision';
import { ReportsBuilder } from './ReportsBuilder';
import { ReportsTemplates } from './ReportsTemplates';
import { ReportsHistory } from './ReportsHistory';
import { ReportsSharing } from './ReportsSharing';
import { ReportJob, ReportTemplate, ShareLink, ReportType } from './reportsTypes';
import * as api from '../../services/api';

interface ReportsViewProps {
  tenant: { id: string; name: string };
  user: { id: string; name: string };
}

export const ReportsView: React.FC<ReportsViewProps> = ({ tenant, user }) => {
  const [activeTab, setActiveTab] = useState<'vision' | 'builder' | 'templates' | 'history' | 'sharing'>('vision');
  const [jobs, setJobs] = useState<ReportJob[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [links, setLinks] = useState<ShareLink[]>([]);
  const [initialBuilderType, setInitialBuilderType] = useState<ReportType | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [tenant.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [historyData, templatesData, sharesData] = await Promise.all([
        api.fetchReportHistory(tenant.id),
        api.fetchReportTemplates(tenant.id),
        api.fetchReportShares(tenant.id)
      ]);
      setJobs(historyData);
      setTemplates(templatesData);
      setLinks(sharesData);
    } catch (error) {
      console.error('Error loading reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickGenerate = (type: string) => {
    setInitialBuilderType(type as ReportType);
    setActiveTab('builder');
  };

  const handleGenerate = async (params: any) => {
    try {
      await api.generateReport({
        tenantId: tenant.id,
        type: params.type,
        format: params.format,
        params,
        created_by: user.id
      });
      setActiveTab('history');
      loadData();
    } catch (error) {
      alert('Erro ao gerar relatório');
    }
  };

  const handleRetry = async (job: ReportJob) => {
    try {
      await api.retryReport(job.id);
      loadData();
    } catch (error) {
      alert('Erro ao tentar novamente');
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (confirm('Deseja excluir este registro do histórico?')) {
      await api.deleteReport(id);
      loadData();
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (confirm('Deseja excluir este modelo?')) {
      await api.deleteReportTemplate(id);
      loadData();
    }
  };

  const handleRevokeShare = async (id: string) => {
    if (confirm('Deseja revogar este link de compartilhamento?')) {
      await api.revokeReportShare(id);
      loadData();
    }
  };

  const handleShare = async (data: any) => {
    try {
      await api.createReportShare(data);
      loadData();
    } catch (error) {
      console.error('Error sharing report:', error);
    }
  };

  const lastReport = jobs.find(j => j.status === 'COMPLETED');
  const recentFailures = jobs.filter(j => j.status === 'FAILED').slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-emerald-600">
            <FileText size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest">Central de Inteligência</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-900">Relatórios & Exportações</h1>
          <p className="text-zinc-500 font-medium">Gere, gerencie e compartilhe documentos oficiais do contrato.</p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-zinc-100/50 rounded-2xl w-fit border border-zinc-200/50">
          {[
            { id: 'vision', label: 'Visão', icon: <TrendingUp size={14} /> },
            { id: 'builder', label: 'Gerar', icon: <Plus size={14} /> },
            { id: 'templates', label: 'Modelos', icon: <Star size={14} /> },
            { id: 'history', label: 'Histórico', icon: <History size={14} /> },
            { id: 'sharing', label: 'Links', icon: <Share2 size={14} /> }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id !== 'builder') setInitialBuilderType(undefined);
              }}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-white text-emerald-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'vision' && (
            <ReportsVision 
              onQuickGenerate={handleQuickGenerate}
              lastReport={lastReport}
              recentFailures={recentFailures}
              onRetry={handleRetry}
            />
          )}

          {activeTab === 'builder' && (
            <ReportsBuilder 
              onGenerate={handleGenerate}
              initialType={initialBuilderType}
            />
          )}

          {activeTab === 'templates' && (
            <ReportsTemplates 
              templates={templates}
              onUse={(tmpl) => {
                setInitialBuilderType(tmpl.type);
                setActiveTab('builder');
              }}
              onEdit={(tmpl) => alert(`Editar modelo: ${tmpl.name}`)}
              onDelete={handleDeleteTemplate}
              onDuplicate={(tmpl) => alert('Duplicar modelo')}
              onSave={async (data) => {
                await api.saveReportTemplate({ ...data, tenantId: tenant.id });
                loadData();
              }}
            />
          )}

          {activeTab === 'history' && (
            <ReportsHistory 
              jobs={jobs}
              onDownload={(job) => alert(`Baixando: ${job.name}`)}
              onPreview={(job) => alert(`Visualizando: ${job.name}`)}
              onRetry={handleRetry}
              onDelete={handleDeleteJob}
              onDetails={(job) => alert(`Detalhes: ${JSON.stringify(job.params)}`)}
              onShare={handleShare}
            />
          )}

          {activeTab === 'sharing' && (
            <ReportsSharing 
              links={links}
              onCopy={(token) => alert(`Link copiado: ${token}`)}
              onRevoke={handleRevokeShare}
              onPreview={(reportId) => alert(`Visualizando relatório: ${reportId}`)}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
