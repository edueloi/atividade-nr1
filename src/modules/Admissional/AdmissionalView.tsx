import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  fetchAdmissionTemplates, 
  createAdmissionTemplate, 
  fetchAdmissionEvaluations, 
  createAdmissionEvaluation, 
  fetchAdmissionSummary,
  fetchUnits
} from '../../services/api';
import { AdmissionalSummary } from './AdmissionalSummary';
import { AdmissionalEvaluations } from './AdmissionalEvaluations';
import { AdmissionalTemplates } from './AdmissionalTemplates';
import { AdmissionalReports } from './AdmissionalReports';
import { EvaluationDetailDrawer } from './EvaluationDetailDrawer';
import { NewEvaluationModal } from './NewEvaluationModal';
import { TemplateEditor } from './TemplateEditor';
import { AdmissionEvaluation, AdmissionTemplate, AdmissionSummary } from './types';
import { mockSummary, mockEvaluations, mockTemplates } from './mockData';

interface AdmissionalViewProps {
  tenant: { id: string; name: string };
  user: { id: string; name: string; role: string };
}

export const AdmissionalView: React.FC<AdmissionalViewProps> = ({ tenant, user }) => {
  const [activeSubTab, setActiveSubTab] = useState<'summary' | 'list' | 'templates' | 'reports'>('summary');
  const [evaluations, setEvaluations] = useState<AdmissionEvaluation[]>([]);
  const [templates, setTemplates] = useState<AdmissionTemplate[]>([]);
  const [summary, setSummary] = useState<AdmissionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState<any[]>([]);
  
  // UI State
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<AdmissionEvaluation | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<AdmissionTemplate | null>(null);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [evaluationFilter, setEvaluationFilter] = useState<any>(null);

  useEffect(() => {
    loadData();
    loadUnits();
  }, [tenant.id, activeSubTab]);

  const loadUnits = async () => {
    try {
      const data = await fetchUnits(tenant.id);
      setUnits(data || []);
    } catch (e) {
      setUnits([{ id: 'u1', name: 'Unidade 1' }, { id: 'u2', name: 'Unidade 2' }]);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeSubTab === 'summary') {
        const data = await fetchAdmissionSummary(tenant.id);
        setSummary(data || mockSummary);
      } else if (activeSubTab === 'list') {
        const data = await fetchAdmissionEvaluations({ tenantId: tenant.id });
        setEvaluations(data?.length ? data : mockEvaluations);
      } else if (activeSubTab === 'templates') {
        const data = await fetchAdmissionTemplates(tenant.id);
        setTemplates(data?.length ? data : mockTemplates);
      }
    } catch (error) {
      console.error('Error loading admissional data:', error);
      // Fallback to mock data
      if (activeSubTab === 'summary') setSummary(mockSummary);
      if (activeSubTab === 'list') setEvaluations(mockEvaluations);
      if (activeSubTab === 'templates') setTemplates(mockTemplates);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEvaluation = async (data: any) => {
    try {
      const id = `eval-${Date.now()}`;
      await createAdmissionEvaluation({
        ...data,
        id,
        tenant_id: tenant.id,
        evaluator_id: user.id,
        evaluator_name: user.name,
        unit_name: units.find(u => u.id === data.unit_id)?.name || 'Unidade',
        sector_name: 'Setor Exemplo', // In a real app, fetch from sector_id
        template_version: templates.find(t => t.id === data.template_id)?.version || '1.0',
        attachments: [],
        links: []
      });
    } catch (e) {
      // Mock save for demo
      const newEv: AdmissionEvaluation = {
        ...data,
        id: `eval-${Date.now()}`,
        tenant_id: tenant.id,
        evaluator_id: user.id,
        evaluator_name: user.name,
        unit_name: units.find(u => u.id === data.unit_id)?.name || 'Unidade',
        sector_name: 'Setor Exemplo',
        template_version: templates.find(t => t.id === data.template_id)?.version || '1.0',
        attachments: [],
        links: [],
        reasons: data.reasons || []
      };
      setEvaluations([newEv, ...evaluations]);
    }
    setShowNewModal(false);
    loadData();
  };

  const handleFilterFromSummary = (filter: any) => {
    setEvaluationFilter(filter);
    setActiveSubTab('list');
  };

  const handleDeleteEvaluation = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
      setEvaluations(evaluations.filter(e => e.id !== id));
      setSelectedEvaluation(null);
    }
  };

  const handleCompleteEvaluation = (id: string) => {
    setEvaluations(evaluations.map(e => e.id === id ? { ...e, status: 'COMPLETED' } : e));
    if (selectedEvaluation?.id === id) {
      setSelectedEvaluation({ ...selectedEvaluation, status: 'COMPLETED' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 p-1 bg-zinc-100/50 rounded-2xl w-fit border border-zinc-200/50">
        <button 
          onClick={() => { setActiveSubTab('summary'); setEvaluationFilter(null); }}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'summary' ? 'bg-white text-emerald-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
          Resumo
        </button>
        <button 
          onClick={() => setActiveSubTab('list')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'list' ? 'bg-white text-emerald-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
          Avaliações
        </button>
        <button 
          onClick={() => setActiveSubTab('templates')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'templates' ? 'bg-white text-emerald-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
          Templates
        </button>
        <button 
          onClick={() => setActiveSubTab('reports')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'reports' ? 'bg-white text-emerald-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
          Relatórios
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeSubTab === 'summary' && summary && (
          <AdmissionalSummary 
            summary={summary} 
            onFilterEvaluations={handleFilterFromSummary}
          />
        )}

        {activeSubTab === 'list' && (
          <AdmissionalEvaluations 
            evaluations={evaluations}
            onNewEvaluation={() => setShowNewModal(true)}
            onViewDetail={setSelectedEvaluation}
            onDelete={handleDeleteEvaluation}
            onDuplicate={(ev) => setShowNewModal(true)} // Simplified for demo
            onComplete={handleCompleteEvaluation}
            initialFilter={evaluationFilter}
          />
        )}

        {activeSubTab === 'templates' && (
          <AdmissionalTemplates 
            templates={templates}
            onNewTemplate={() => { setEditingTemplate(null); setShowTemplateEditor(true); }}
            onEditTemplate={(tpl) => { setEditingTemplate(tpl); setShowTemplateEditor(true); }}
          />
        )}

        {activeSubTab === 'reports' && (
          <AdmissionalReports />
        )}
      </AnimatePresence>

      {/* Modals & Drawers */}
      <NewEvaluationModal 
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onSave={handleSaveEvaluation}
        templates={templates}
        units={units}
      />

      <EvaluationDetailDrawer 
        evaluation={selectedEvaluation}
        onClose={() => setSelectedEvaluation(null)}
        onEdit={(ev) => { setSelectedEvaluation(null); setShowNewModal(true); }}
        onComplete={handleCompleteEvaluation}
        onDelete={handleDeleteEvaluation}
      />

      {showTemplateEditor && (
        <TemplateEditor 
          template={editingTemplate}
          onClose={() => setShowTemplateEditor(false)}
          onSave={(tpl) => {
            if (editingTemplate) {
              setTemplates(templates.map(t => t.id === tpl.id ? tpl : t));
            } else {
              setTemplates([...templates, { ...tpl, id: `tpl-${Date.now()}` }]);
            }
            setShowTemplateEditor(false);
          }}
        />
      )}
    </div>
  );
};

