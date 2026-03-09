import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  fetchClosingMonths, 
  fetchClosingSummary, 
  fetchClosingIssues, 
  startClosingReview, 
  closeMonthStatus as apiCloseMonth, 
  reopenMonth as apiReopenMonth,
  fetchClosingRules,
  updateClosingRule
} from '../../services/api';
import { ClosingOverview } from './ClosingOverview';
import { ClosingIssues } from './ClosingIssues';
import { ClosingValidations } from './ClosingValidations';
import { ClosingDelivery } from './ClosingDelivery';
import { ClosingHistory } from './ClosingHistory';
import { ClosingMonth, ClosingIssue, ClosingRule, ClosingSummary, ClosingStatus } from './types';
import { mockClosingMonths, mockClosingIssues, mockClosingRules, mockClosingSummary } from './mockData';

interface ClosingViewProps {
  tenant: { id: string; name: string };
  user: { id: string; name: string; role: string };
}

export const ClosingView: React.FC<ClosingViewProps> = ({ tenant, user }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'validations' | 'delivery' | 'history'>('overview');
  const [months, setMonths] = useState<ClosingMonth[]>([]);
  const [currentMonth, setCurrentMonth] = useState<ClosingMonth | null>(null);
  const [summary, setSummary] = useState<ClosingSummary | null>(null);
  const [issues, setIssues] = useState<ClosingIssue[]>([]);
  const [rules, setRules] = useState<ClosingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [issueFilter, setIssueFilter] = useState<{ severity: string | null; module: string | null } | null>(null);

  useEffect(() => {
    loadInitialData();
  }, [tenant.id]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const monthsData = await fetchClosingMonths(tenant.id);
      const rulesData = await fetchClosingRules(tenant.id);
      
      const activeMonths = monthsData?.length ? monthsData : mockClosingMonths;
      setMonths(activeMonths);
      setRules(rulesData?.length ? rulesData : mockClosingRules);
      
      if (activeMonths.length > 0) {
        handleSelectMonth(activeMonths[0]);
      }
    } catch (error) {
      console.error('Error loading closing data:', error);
      setMonths(mockClosingMonths);
      setRules(mockClosingRules);
      handleSelectMonth(mockClosingMonths[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMonth = async (month: ClosingMonth) => {
    setCurrentMonth(month);
    try {
      const summaryData = await fetchClosingSummary(month.id);
      const issuesData = await fetchClosingIssues(month.id);
      setSummary(summaryData || mockClosingSummary);
      setIssues(issuesData?.length ? issuesData : mockClosingIssues);
    } catch (e) {
      setSummary(mockClosingSummary);
      setIssues(mockClosingIssues);
    }
  };

  const handleStartReview = async () => {
    if (!currentMonth) return;
    try {
      await startClosingReview(currentMonth.id);
      setCurrentMonth({ ...currentMonth, status: 'REVIEW' });
    } catch (e) {
      setCurrentMonth({ ...currentMonth, status: 'REVIEW' });
    }
  };

  const handleCloseMonth = async () => {
    if (!currentMonth) return;
    if (summary && summary.criticalIssues > 0) {
      alert('Não é possível fechar o mês com pendências críticas.');
      return;
    }
    try {
      await apiCloseMonth(currentMonth.id, user.id);
      setCurrentMonth({ ...currentMonth, status: 'CLOSED', closed_by: user.name, closed_at: new Date().toISOString() });
    } catch (e) {
      setCurrentMonth({ ...currentMonth, status: 'CLOSED', closed_by: user.name, closed_at: new Date().toISOString() });
    }
  };

  const handleReopenMonth = async (monthId: string, reason: string, modules: string[]) => {
    try {
      await apiReopenMonth(monthId, { reason, modules, userId: user.id });
      const updatedMonths = months.map(m => m.id === monthId ? { ...m, status: 'REOPENED' as ClosingStatus } : m);
      setMonths(updatedMonths);
      if (currentMonth?.id === monthId) {
        setCurrentMonth({ ...currentMonth, status: 'REOPENED' });
      }
    } catch (e) {
      const updatedMonths = months.map(m => m.id === monthId ? { ...m, status: 'REOPENED' as ClosingStatus } : m);
      setMonths(updatedMonths);
      if (currentMonth?.id === monthId) {
        setCurrentMonth({ ...currentMonth, status: 'REOPENED' });
      }
    }
  };

  const handleFilterIssues = (severity: string | null, module: string | null) => {
    setIssueFilter({ severity, module });
    setActiveTab('issues');
  };

  const handleResolveIssue = (id: string) => {
    setIssues(issues.map(i => i.id === id ? { ...i, status: 'DONE', resolved_by: user.name, resolved_at: new Date().toISOString() } : i));
  };

  const handleToggleRule = async (id: string) => {
    const rule = rules.find(r => r.id === id);
    if (!rule) return;
    try {
      await updateClosingRule(id, { is_enabled: !rule.is_enabled });
      setRules(rules.map(r => r.id === id ? { ...r, is_enabled: !r.is_enabled } : r));
    } catch (e) {
      setRules(rules.map(r => r.id === id ? { ...r, is_enabled: !r.is_enabled } : r));
    }
  };

  const handleUpdateSeverity = async (id: string, severity: any) => {
    try {
      await updateClosingRule(id, { severity });
      setRules(rules.map(r => r.id === id ? { ...r, severity } : r));
    } catch (e) {
      setRules(rules.map(r => r.id === id ? { ...r, severity } : r));
    }
  };

  return (
    <div className="space-y-8">
      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 p-1 bg-zinc-100/50 rounded-2xl w-fit border border-zinc-200/50">
        {[
          { id: 'overview', label: 'Visão Geral' },
          { id: 'issues', label: 'Pendências' },
          { id: 'validations', label: 'Validações' },
          { id: 'delivery', label: 'Entrega' },
          { id: 'history', label: 'Histórico' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              if (tab.id !== 'issues') setIssueFilter(null);
            }}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-emerald-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            {tab.label}
          </button>
        ))}
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
          {activeTab === 'overview' && summary && currentMonth && (
            <ClosingOverview 
              summary={summary}
              status={currentMonth.status}
              onStartReview={handleStartReview}
              onCloseMonth={handleCloseMonth}
              onGeneratePackage={() => setActiveTab('delivery')}
              onReopen={() => setActiveTab('history')}
              onFilterIssues={handleFilterIssues}
            />
          )}

          {activeTab === 'issues' && (
            <ClosingIssues 
              issues={issues}
              onResolve={(id) => {
                handleResolveIssue(id);
                alert('Pendência marcada como resolvida!');
              }}
              onNavigate={(issue) => alert(`Navegando para o registro ${issue.ref_id} no módulo ${issue.module}...`)}
              initialFilter={issueFilter || undefined}
            />
          )}

          {activeTab === 'validations' && (
            <ClosingValidations 
              rules={rules}
              onToggleRule={handleToggleRule}
              onUpdateSeverity={handleUpdateSeverity}
            />
          )}

          {activeTab === 'delivery' && (
            <ClosingDelivery 
              onGenerate={(type) => console.log('Generate', type)}
              onSendToClient={(id) => console.log('Send', id)}
            />
          )}

          {activeTab === 'history' && (
            <ClosingHistory 
              history={months}
              onReopen={handleReopenMonth}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
