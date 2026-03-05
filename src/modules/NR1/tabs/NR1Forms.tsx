import React, { useState } from 'react';
import { 
  Plus, 
  FileText, 
  MoreVertical, 
  Edit3, 
  Copy, 
  Archive, 
  History,
  CheckCircle2,
  AlertCircle,
  GripVertical,
  Trash2,
  Save,
  Eye,
  ChevronRight,
  X,
  HelpCircle,
  Settings2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Question {
  id: string;
  text: string;
  type: 'SCALE_10' | 'YES_NO' | 'MULTIPLE_CHOICE';
  weight: number;
  required: boolean;
  helpText?: string;
}

interface Block {
  id: string;
  title: string;
  questions: Question[];
}

interface Form {
  id: string;
  name: string;
  version: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  updatedAt: string;
  questionsCount: number;
  blocks?: Block[];
}

export function NR1Forms() {
  const [forms, setForms] = useState<Form[]>([
    {
      id: '1',
      name: 'DRS Psicossocial - Padrão Atividade',
      version: 1,
      status: 'PUBLISHED',
      updatedAt: '2026-03-01',
      questionsCount: 24,
      blocks: [
        {
          id: 'b1',
          title: 'Ambiente de Trabalho',
          questions: [
            { id: 'q1', text: 'Como você avalia o conforto físico do seu posto de trabalho?', type: 'SCALE_10', weight: 1, required: true, helpText: 'Considere iluminação, temperatura e ergonomia.' },
            { id: 'q2', text: 'O nível de ruído no seu ambiente interfere na sua concentração?', type: 'SCALE_10', weight: 1, required: true },
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Mapeamento de Clima Organizacional',
      version: 2,
      status: 'DRAFT',
      updatedAt: '2026-03-04',
      questionsCount: 15,
      blocks: [
        {
          id: 'b1',
          title: 'Relações Interpessoais',
          questions: [
            { id: 'q3', text: 'Você sente que tem apoio dos seus colegas quando precisa?', type: 'SCALE_10', weight: 1, required: true },
          ]
        }
      ]
    }
  ]);

  const [editingForm, setEditingForm] = useState<Form | null>(null);

  const getStatusColor = (status: Form['status']) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-emerald-100 text-emerald-700';
      case 'ARCHIVED': return 'bg-zinc-100 text-zinc-700';
      case 'DRAFT': return 'bg-amber-100 text-amber-700';
    }
  };

  if (editingForm) {
    return <FormBuilder form={editingForm} onBack={() => setEditingForm(null)} onSave={(updated) => {
      setForms(prev => prev.map(f => f.id === updated.id ? updated : f));
      setEditingForm(null);
    }} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-zinc-900">Modelos de Questionário</h3>
        <button 
          onClick={() => setEditingForm({ id: 'new', name: 'Novo Formulário', version: 1, status: 'DRAFT', updatedAt: new Date().toISOString().split('T')[0], questionsCount: 0, blocks: [] })}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/10"
        >
          <Plus size={18} />
          Criar Modelo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form) => (
          <div 
            key={form.id}
            className="bg-white border border-zinc-200 rounded-3xl p-6 hover:border-emerald-500 transition-all group shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-zinc-50 rounded-2xl text-zinc-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                <FileText size={24} />
              </div>
              <button className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="space-y-1 mb-6">
              <h4 className="font-bold text-zinc-900 line-clamp-1">{form.name}</h4>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(form.status)}`}>
                  {form.status === 'PUBLISHED' ? 'Publicado' : form.status === 'DRAFT' ? 'Rascunho' : 'Arquivado'}
                </span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">v{form.version}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-500 mb-6">
              <div className="flex items-center gap-1">
                <Edit3 size={14} />
                {form.questionsCount} questões
              </div>
              <div className="flex items-center gap-1">
                <History size={14} />
                {form.updatedAt}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setEditingForm(form)}
                className="flex items-center justify-center gap-2 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors"
              >
                {form.status === 'PUBLISHED' ? 'Ver/Duplicar' : 'Editar'}
              </button>
              <button className="flex items-center justify-center gap-2 py-2 border border-zinc-200 text-zinc-600 rounded-xl text-xs font-bold hover:bg-zinc-50 transition-colors">
                Histórico
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormBuilder({ form, onBack, onSave }: { form: Form, onBack: () => void, onSave: (f: Form) => void }) {
  const [activeTab, setActiveTab] = useState<'fields' | 'scoring' | 'privacy'>('fields');
  const [blocks, setBlocks] = useState<Block[]>(form.blocks || []);
  const [editingQuestion, setEditingQuestion] = useState<{ blockId: string, question: Question } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  const handleSaveQuestion = (blockId: string, question: Question) => {
    setBlocks(prev => prev.map(b => {
      if (b.id === blockId) {
        const exists = b.questions.find(q => q.id === question.id);
        return {
          ...b,
          questions: exists 
            ? b.questions.map(q => q.id === question.id ? question : q)
            : [...b.questions, question]
        };
      }
      return b;
    }));
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (blockId: string, questionId: string) => {
    if (window.confirm('Excluir esta pergunta permanentemente?')) {
      setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, questions: b.questions.filter(q => q.id !== questionId) } : b));
    }
  };

  const handlePublish = () => {
    onSave({ ...form, status: 'PUBLISHED', blocks, updatedAt: new Date().toISOString().split('T')[0] });
    setShowPublishConfirm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
            <X size={20} />
          </button>
          <div>
            <h3 className="text-xl font-bold text-zinc-900">{form.name}</h3>
            <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
              {form.status === 'PUBLISHED' ? 'Visualizando' : 'Editando'} Versão {form.version}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-200 text-zinc-600 rounded-xl text-sm font-bold hover:bg-zinc-50 transition-colors"
          >
            <Eye size={18} />
            Preview
          </button>
          {form.status === 'DRAFT' && (
            <button 
              onClick={() => setShowPublishConfirm(true)}
              className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Save size={18} />
              Publicar Versão
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-2xl w-fit">
        {[
          { id: 'fields', label: 'Campos', icon: GripVertical },
          { id: 'scoring', label: 'Pontuação', icon: CheckCircle2 },
          { id: 'privacy', label: 'Segurança', icon: AlertCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${activeTab === tab.id 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50'}
            `}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-zinc-200 rounded-3xl p-8 min-h-[500px] shadow-sm">
        {activeTab === 'fields' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <h4 className="font-bold text-zinc-900">Estrutura do Questionário</h4>
              {form.status === 'DRAFT' && (
                <button 
                  onClick={() => setBlocks([...blocks, { id: `b-${Date.now()}`, title: 'Novo Bloco', questions: [] }])}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  + Adicionar Bloco
                </button>
              )}
            </div>

            {blocks.map((block) => (
              <div key={block.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical size={16} className="text-zinc-300" />
                    <h5 className="text-sm font-bold text-zinc-700 uppercase tracking-wider">{block.title}</h5>
                  </div>
                  {form.status === 'DRAFT' && (
                    <button 
                      onClick={() => setBlocks(blocks.filter(b => b.id !== block.id))}
                      className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {block.questions.map((q) => (
                    <div key={q.id} className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 group">
                      <GripVertical size={16} className="text-zinc-300 cursor-grab" />
                      <div className="flex-1">
                        <p className="text-sm text-zinc-900 font-medium">{q.text}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase">{q.type === 'SCALE_10' ? 'Escala 0-10' : q.type === 'YES_NO' ? 'Sim/Não' : 'Múltipla Escolha'}</span>
                          {q.required && <span className="text-[10px] font-bold text-red-400 uppercase">Obrigatória</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setEditingQuestion({ blockId: block.id, question: q })}
                          className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200 rounded-lg transition-all"
                        >
                          <Edit3 size={14} />
                        </button>
                        {form.status === 'DRAFT' && (
                          <button 
                            onClick={() => handleDeleteQuestion(block.id, q.id)}
                            className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {form.status === 'DRAFT' && (
                    <button 
                      onClick={() => setEditingQuestion({ blockId: block.id, question: { id: `q-${Date.now()}`, text: '', type: 'SCALE_10', weight: 1, required: true } })}
                      className="w-full py-3 border-2 border-dashed border-zinc-200 rounded-2xl text-sm font-bold text-zinc-400 hover:border-emerald-500 hover:text-emerald-600 transition-all"
                    >
                      + Adicionar Pergunta
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'scoring' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl">
              <h4 className="font-bold text-emerald-900 mb-2">Configuração de Pesos</h4>
              <p className="text-sm text-emerald-700">Defina como cada bloco impacta no score final (0-100).</p>
            </div>

            <div className="space-y-6">
              {blocks.map((block) => (
                <div key={block.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-zinc-700">{block.title}</span>
                    <span className="text-sm font-bold text-emerald-600">25%</span>
                  </div>
                  <input type="range" className="w-full accent-emerald-600" defaultValue={25} disabled={form.status === 'PUBLISHED'} />
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-zinc-100">
              <h4 className="font-bold text-zinc-900 mb-4">Thresholds de Risco</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Baixo</p>
                  <p className="text-xl font-bold text-emerald-900">0 - 33</p>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-center">
                  <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">Médio</p>
                  <p className="text-xl font-bold text-amber-900">34 - 66</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-center">
                  <p className="text-[10px] font-bold text-red-600 uppercase mb-1">Alto</p>
                  <p className="text-xl font-bold text-red-900">67 - 100</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl">
              <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                <AlertCircle size={20} /> Regras Anti-Passivo Trabalhista
              </h4>
              <p className="text-sm text-amber-700">Configure travas de segurança para proteger a empresa e o colaborador.</p>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Desativar campos de texto aberto', desc: 'Evita que o colaborador escreva nomes ou situações que gerem passivo direto.', default: true },
                { title: 'Ocultar dados brutos no relatório do cliente', desc: 'O RH/Engenharia verá apenas médias e tendências, nunca respostas individuais.', default: true },
                { title: 'Anonimato por Volume', desc: 'Só exibe score do setor se houver no mínimo 10 respostas.', default: true },
                { title: 'Bloquear exportação de Excel', desc: 'Restringe a saída de dados individuais do sistema.', default: false },
              ].map((rule) => (
                <div key={rule.title} className="flex items-start justify-between p-4 hover:bg-zinc-50 rounded-2xl transition-colors">
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-zinc-900">{rule.title}</h5>
                    <p className="text-xs text-zinc-500 max-w-md">{rule.desc}</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${rule.default ? 'bg-emerald-500' : 'bg-zinc-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${rule.default ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Question Modal */}
      <AnimatePresence>
        {editingQuestion && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] w-full max-w-xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-zinc-900">Configurar Pergunta</h3>
                <button onClick={() => setEditingQuestion(null)} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Enunciado da Pergunta</label>
                  <textarea 
                    defaultValue={editingQuestion.question.text}
                    onChange={(e) => editingQuestion.question.text = e.target.value}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 min-h-[100px]"
                    placeholder="Digite a pergunta aqui..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Tipo de Resposta</label>
                    <select 
                      defaultValue={editingQuestion.question.type}
                      onChange={(e) => editingQuestion.question.type = e.target.value as any}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    >
                      <option value="SCALE_10">Escala 0 a 10</option>
                      <option value="YES_NO">Sim ou Não</option>
                      <option value="MULTIPLE_CHOICE">Múltipla Escolha</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Peso no Score</label>
                    <input 
                      type="number" 
                      defaultValue={editingQuestion.question.weight}
                      onChange={(e) => editingQuestion.question.weight = Number(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Texto de Ajuda (Opcional)</label>
                  <input 
                    type="text" 
                    defaultValue={editingQuestion.question.helpText}
                    onChange={(e) => editingQuestion.question.helpText = e.target.value}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="Explique melhor a pergunta se necessário"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <input 
                    type="checkbox" 
                    defaultChecked={editingQuestion.question.required}
                    onChange={(e) => editingQuestion.question.required = e.target.checked}
                    id="required-check"
                    className="w-5 h-5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="required-check" className="text-sm font-bold text-zinc-700 cursor-pointer">Pergunta de preenchimento obrigatório</label>
                </div>
              </div>

              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button 
                  onClick={() => setEditingQuestion(null)}
                  className="px-6 py-3 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-2xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleSaveQuestion(editingQuestion.blockId, editingQuestion.question)}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Salvar Pergunta
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 bg-white z-[60] overflow-y-auto custom-scrollbar">
            <div className="max-w-2xl mx-auto py-12 px-6">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900">Preview: {form.name}</h3>
                </div>
                <button onClick={() => setShowPreview(false)} className="p-3 bg-zinc-100 hover:bg-zinc-200 rounded-2xl transition-colors text-zinc-600">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-12">
                {blocks.map((block, bIdx) => (
                  <div key={block.id} className="space-y-8">
                    <div className="pb-4 border-b border-zinc-100">
                      <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-1">Bloco {bIdx + 1}</h4>
                      <h3 className="text-2xl font-bold text-zinc-900">{block.title}</h3>
                    </div>

                    <div className="space-y-10">
                      {block.questions.map((q, qIdx) => (
                        <div key={q.id} className="space-y-4">
                          <div className="flex items-start gap-4">
                            <span className="w-8 h-8 bg-zinc-100 text-zinc-500 rounded-lg flex items-center justify-center text-sm font-bold shrink-0">
                              {qIdx + 1}
                            </span>
                            <div className="space-y-1">
                              <p className="text-lg font-medium text-zinc-900 leading-relaxed">{q.text}</p>
                              {q.helpText && (
                                <p className="text-sm text-zinc-500 flex items-center gap-1.5">
                                  <HelpCircle size={14} />
                                  {q.helpText}
                                </p>
                              )}
                            </div>
                          </div>

                          {q.type === 'SCALE_10' && (
                            <div className="grid grid-cols-11 gap-1">
                              {[...Array(11)].map((_, i) => (
                                <button key={i} className="aspect-square border-2 border-zinc-100 rounded-xl flex items-center justify-center text-sm font-bold text-zinc-400 hover:border-emerald-500 hover:text-emerald-600 transition-all">
                                  {i}
                                </button>
                              ))}
                              <div className="col-span-11 flex justify-between mt-2 px-1">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase">Péssimo</span>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase">Excelente</span>
                              </div>
                            </div>
                          )}

                          {q.type === 'YES_NO' && (
                            <div className="flex gap-3">
                              <button className="flex-1 py-4 border-2 border-zinc-100 rounded-2xl text-sm font-bold text-zinc-500 hover:border-emerald-500 hover:text-emerald-600 transition-all">Sim</button>
                              <button className="flex-1 py-4 border-2 border-zinc-100 rounded-2xl text-sm font-bold text-zinc-500 hover:border-emerald-500 hover:text-emerald-600 transition-all">Não</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="pt-12 border-t border-zinc-100 flex justify-center">
                  <button className="px-12 py-4 bg-emerald-600 text-white rounded-3xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-3">
                    Finalizar Respostas
                    <Check size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Publish Confirmation Modal */}
      <AnimatePresence>
        {showPublishConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-zinc-900">Publicar Versão {form.version}?</h3>
                  <p className="text-sm text-zinc-500">Ao publicar, esta versão ficará bloqueada para edições. Novos ciclos usarão esta estrutura.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setShowPublishConfirm(false)}
                    className="px-6 py-3 text-zinc-600 text-sm font-bold hover:bg-zinc-100 rounded-2xl transition-colors"
                  >
                    Revisar
                  </button>
                  <button 
                    onClick={handlePublish}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
