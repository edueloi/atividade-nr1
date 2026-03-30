import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Send,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  ShieldCheck,
  Info,
  Heart,
  Smile,
  Meh,
  Frown,
  Building2,
  User
} from 'lucide-react';

interface Question {
  id: string;
  text: string;
  type: 'scale' | 'choice' | 'yes_no' | 'text';
  options?: string[];
  block?: string;
  helpText?: string;
}

interface CycleData {
  id: string;
  name: string;
  form_name: string;
  unit_id: string;
  unit_name: string;
  shared_by: string;
  shared_by_role: string;
  sectors: { id: string; name: string }[];
  form_fields: Question[];
}

const SCALE_LABELS: Record<number, { label: string; color: string }> = {
  0: { label: 'Muito ruim', color: 'bg-red-500 text-white' },
  1: { label: 'Ruim', color: 'bg-red-400 text-white' },
  2: { label: 'Ruim', color: 'bg-orange-400 text-white' },
  3: { label: 'Razoável', color: 'bg-orange-300 text-white' },
  4: { label: 'Razoável', color: 'bg-yellow-400 text-zinc-900' },
  5: { label: 'Regular', color: 'bg-yellow-300 text-zinc-900' },
  6: { label: 'Bom', color: 'bg-lime-400 text-zinc-900' },
  7: { label: 'Bom', color: 'bg-green-400 text-white' },
  8: { label: 'Muito bom', color: 'bg-emerald-500 text-white' },
  9: { label: 'Excelente', color: 'bg-emerald-600 text-white' },
  10: { label: 'Perfeito!', color: 'bg-emerald-700 text-white' },
};

export function ExternalForm({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cycle, setCycle] = useState<CycleData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setCycle({
        id: 'cycle-1',
        name: 'Ciclo Março/2026',
        form_name: 'DRS Psicossocial — NR1',
        unit_id: 'yazaki-br',
        unit_name: 'Yazaki do Brasil',
        shared_by: 'Ricardo Silva',
        shared_by_role: 'Médico do Trabalho — Atividade SST',
        sectors: [
          { id: 'sec-1', name: 'Produção — Linha A' },
          { id: 'sec-2', name: 'Produção — Linha B' },
          { id: 'sec-3', name: 'Logística' },
          { id: 'sec-4', name: 'Qualidade' },
          { id: 'sec-5', name: 'Administrativo' },
          { id: 'sec-6', name: 'Manutenção' },
        ],
        form_fields: [
          {
            id: 'q1',
            text: 'Como você avalia seu nível de estresse no trabalho?',
            type: 'scale',
            block: 'Carga & Ritmo',
            helpText: 'Considere a semana atual. 0 = nenhum estresse, 10 = extremamente estressado.'
          },
          {
            id: 'q2',
            text: 'Você sente que tem suporte da sua liderança direta quando precisa?',
            type: 'scale',
            block: 'Apoio & Gestão',
            helpText: '0 = nunca tenho suporte, 10 = sempre tenho suporte.'
          },
          {
            id: 'q3',
            text: 'Nos últimos 30 dias, teve dificuldades para dormir por causa do trabalho?',
            type: 'yes_no',
            block: 'Saúde & Bem-estar'
          },
          {
            id: 'q4',
            text: 'Você se sente seguro(a) para expressar suas opiniões sem medo de retaliação?',
            type: 'scale',
            block: 'Segurança Psicológica',
          },
          {
            id: 'q5',
            text: 'Como você avalia a comunicação entre os colegas do seu setor?',
            type: 'scale',
            block: 'Relações Interpessoais',
          },
          {
            id: 'q6',
            text: 'No geral, como você avalia seu bem-estar no trabalho?',
            type: 'scale',
            block: 'Bem-estar Geral',
            helpText: '0 = muito ruim, 10 = excelente.'
          },
        ]
      });
      setLoading(false);
    }, 1400);
  }, [token]);

  const totalSteps = cycle ? cycle.form_fields.length + 2 : 0;
  const progress = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;

  const handleNext = () => {
    if (currentStep === 1 && !selectedSector) return;
    setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    setSubmitted(true);
    setSubmitting(false);
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-6">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="8"
                strokeDasharray="60 190" strokeLinecap="round" className="animate-spin" style={{ transformOrigin: 'center' }} />
            </svg>
          </div>
          <div className="space-y-1">
            <div className="w-6 h-6 border-[3px] border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-zinc-500 font-medium">Carregando questionário...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">Link Inválido</h2>
            <p className="text-zinc-500">Este link expirou ou não é mais válido. Entre em contato com o RH da sua empresa.</p>
          </div>
        </div>
      </div>
    );
  }

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-zinc-50 flex flex-col font-sans">
        <header className="p-6 flex items-center justify-between max-w-2xl mx-auto w-full">
          <AtividadeLogo />
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{cycle?.unit_name}</span>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="bg-white rounded-[48px] shadow-2xl shadow-zinc-100 max-w-md w-full p-12 text-center space-y-8 border border-zinc-100"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle2 size={48} className="text-emerald-500" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <h2 className="text-3xl font-black text-zinc-900 mb-3">Obrigado pela sua participação!</h2>
              <p className="text-zinc-500 leading-relaxed">
                Suas respostas foram enviadas com sucesso e contribuem para construirmos um ambiente de trabalho mais saudável na <strong className="text-zinc-700">{cycle?.unit_name}</strong>.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="grid grid-cols-1 gap-3">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0" />
                <p className="text-sm text-emerald-800 text-left">Suas respostas são <strong>100% anônimas</strong> e tratadas de forma agregada.</p>
              </div>
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center gap-3">
                <Heart size={18} className="text-rose-400 flex-shrink-0" />
                <p className="text-sm text-zinc-600 text-left">Os resultados serão usados para criar melhorias reais no seu dia a dia.</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              className="pt-2 border-t border-zinc-100">
              <p className="text-xs text-zinc-400">
                Aplicado por <span className="font-bold text-zinc-500">{cycle?.shared_by}</span> · {cycle?.shared_by_role}
              </p>
            </motion.div>
          </motion.div>
        </main>

        <footer className="p-8 text-center">
          <p className="text-xs text-zinc-400 flex items-center justify-center gap-2">
            <ShieldCheck size={13} /> Dados protegidos pela LGPD · Atividade SST &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-emerald-50/30 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-zinc-100 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <AtividadeLogo />

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-black text-zinc-900 leading-tight">{cycle?.unit_name}</span>
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest">{cycle?.name}</span>
            </div>
            <div className="w-8 h-8 bg-zinc-100 rounded-xl flex items-center justify-center">
              <Building2 size={16} className="text-zinc-500" />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-zinc-100">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-5 py-10">
        <AnimatePresence mode="wait">

          {/* Step 0 — Intro */}
          {currentStep === 0 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 text-[11px] font-black uppercase tracking-widest mb-4">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  Questionário Ativo
                </div>
                <h1 className="text-4xl font-black text-zinc-900 leading-tight">
                  Sua voz <span className="text-emerald-600">importa.</span>
                </h1>
                <p className="text-lg text-zinc-500 leading-relaxed">
                  Este mapeamento ajuda a identificar oportunidades de melhoria no seu ambiente de trabalho na <strong className="text-zinc-700">{cycle?.unit_name}</strong>.
                </p>
              </div>

              {/* Shared by card */}
              <div className="p-5 bg-white border border-zinc-200 rounded-3xl flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <User size={22} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Compartilhado por</p>
                  <p className="font-black text-zinc-900">{cycle?.shared_by}</p>
                  <p className="text-xs text-zinc-400">{cycle?.shared_by_role}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: <ShieldCheck size={20} />,
                    color: 'bg-emerald-50 text-emerald-600',
                    title: '100% Anônimo',
                    desc: 'Ninguém saberá quem respondeu o quê. Dados tratados de forma agregada.'
                  },
                  {
                    icon: <Info size={20} />,
                    color: 'bg-blue-50 text-blue-600',
                    title: 'Menos de 5 minutos',
                    desc: `${cycle?.form_fields.length} perguntas rápidas. Responda no celular ou computador.`
                  },
                ].map((item) => (
                  <div key={item.title} className="p-5 bg-white border border-zinc-100 rounded-3xl flex gap-4 shadow-sm">
                    <div className={`p-2.5 rounded-xl flex-shrink-0 ${item.color}`}>{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-zinc-900 text-sm mb-0.5">{item.title}</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-full py-5 bg-zinc-900 text-white rounded-[24px] text-lg font-black hover:bg-zinc-800 active:scale-[0.99] transition-all shadow-xl shadow-zinc-900/20 flex items-center justify-center gap-3 group"
              >
                Começar agora
                <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-center text-xs text-zinc-400">
                Ao responder, você concorda com os termos de privacidade da Atividade SST.
              </p>
            </motion.div>
          )}

          {/* Step 1 — Sector */}
          {currentStep === 1 && (
            <motion.div
              key="sector"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Passo 1 de {cycle!.form_fields.length + 1}</span>
                <h2 className="text-3xl font-black text-zinc-900">Em qual setor você trabalha?</h2>
                <p className="text-zinc-400">Usamos isso apenas para agrupar os resultados por área — não identifica você.</p>
              </div>

              <div className="space-y-3">
                {cycle?.sectors.map((sector) => (
                  <button
                    key={sector.id}
                    onClick={() => setSelectedSector(sector.id)}
                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${
                      selectedSector === sector.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm'
                    }`}
                  >
                    <span className={`font-bold ${selectedSector === sector.id ? 'text-emerald-700' : 'text-zinc-700'}`}>
                      {sector.name}
                    </span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                      selectedSector === sector.id ? 'border-emerald-500 bg-emerald-500' : 'border-zinc-200'
                    }`}>
                      {selectedSector === sector.id && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={handleBack} className="flex-1 py-4 border-2 border-zinc-200 text-zinc-500 rounded-2xl font-bold hover:bg-zinc-50 transition-all flex items-center justify-center gap-2">
                  <ChevronLeft size={18} /> Voltar
                </button>
                <button
                  onClick={handleNext}
                  disabled={!selectedSector}
                  className={`flex-[2] py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${
                    selectedSector
                      ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/20'
                      : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                  }`}
                >
                  Próximo <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Questions */}
          {currentStep >= 2 && currentStep < (cycle!.form_fields.length + 2) && (
            <motion.div
              key={`q-${currentStep}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-10"
            >
              {(() => {
                const qIdx = currentStep - 2;
                const question = cycle!.form_fields[qIdx];
                const answer = answers[question.id];
                const isLast = currentStep === cycle!.form_fields.length + 1;

                return (
                  <>
                    {/* Block tag + counter */}
                    <div className="flex items-center justify-between">
                      {question.block && (
                        <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                          {question.block}
                        </span>
                      )}
                      <span className="text-xs font-bold text-zinc-400 ml-auto">
                        {qIdx + 1} / {cycle!.form_fields.length}
                      </span>
                    </div>

                    {/* Question text */}
                    <div className="space-y-3">
                      <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 leading-snug">
                        {question.text}
                      </h2>
                      {question.helpText && (
                        <p className="text-sm text-zinc-400 flex items-start gap-2">
                          <Info size={14} className="mt-0.5 flex-shrink-0" />
                          {question.helpText}
                        </p>
                      )}
                    </div>

                    {/* Scale 0-10 */}
                    {question.type === 'scale' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-11 gap-1.5">
                          {Array.from({ length: 11 }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => handleAnswer(question.id, i)}
                              className={`aspect-square rounded-xl text-sm font-black transition-all active:scale-95 ${
                                answer === i
                                  ? SCALE_LABELS[i].color + ' scale-110 shadow-md'
                                  : 'bg-white border-2 border-zinc-200 text-zinc-400 hover:border-zinc-400 hover:text-zinc-700'
                              }`}
                            >
                              {i}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">
                          <span>Péssimo</span>
                          <span>Excelente</span>
                        </div>
                        {answer !== undefined && (
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black ${SCALE_LABELS[answer].color}`}
                          >
                            {answer <= 3 ? <Frown size={16} /> : answer <= 6 ? <Meh size={16} /> : <Smile size={16} />}
                            {SCALE_LABELS[answer].label}
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Yes / No */}
                    {question.type === 'yes_no' && (
                      <div className="grid grid-cols-2 gap-4">
                        {['Sim', 'Não'].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleAnswer(question.id, opt)}
                            className={`py-6 rounded-3xl font-black text-lg transition-all active:scale-95 ${
                              answer === opt
                                ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-900/20 scale-[1.02]'
                                : 'bg-white border-2 border-zinc-200 text-zinc-500 hover:border-zinc-400'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Nav buttons */}
                    <div className="flex gap-3 pt-4">
                      <button onClick={handleBack} className="flex-1 py-4 border-2 border-zinc-200 text-zinc-500 rounded-2xl font-bold hover:bg-zinc-50 transition-all flex items-center justify-center gap-2">
                        <ChevronLeft size={18} /> Voltar
                      </button>
                      {isLast ? (
                        <button
                          onClick={handleSubmit}
                          disabled={answer === undefined || submitting}
                          className={`flex-[2] py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${
                            answer !== undefined && !submitting
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20'
                              : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                          }`}
                        >
                          {submitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              Enviar Respostas <Send size={18} />
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={handleNext}
                          disabled={answer === undefined}
                          className={`flex-[2] py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${
                            answer !== undefined
                              ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/20'
                              : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                          }`}
                        >
                          Próximo <ChevronRight size={18} />
                        </button>
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 text-center border-t border-zinc-100 bg-white/50">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-zinc-400">
          <AtividadeLogo small />
          <span className="hidden sm:block text-zinc-200">·</span>
          <span className="flex items-center gap-1.5"><ShieldCheck size={13} /> Dados protegidos pela LGPD</span>
          <span className="hidden sm:block text-zinc-200">·</span>
          <span>Respostas 100% anônimas</span>
        </div>
      </footer>
    </div>
  );
}

function AtividadeLogo({ small = false }: { small?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${small ? 'opacity-60' : ''}`}>
      <div className={`${small ? 'w-6 h-6' : 'w-9 h-9'} bg-zinc-900 rounded-xl flex items-center justify-center`}>
        <svg viewBox="0 0 32 32" fill="none" className={small ? 'w-3.5 h-3.5' : 'w-5 h-5'}>
          <path d="M8 24 L16 8 L24 24" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11 18 L21 18" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
      {!small && (
        <div className="leading-tight">
          <p className="text-sm font-black text-zinc-900 leading-none">atividade</p>
          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">SST</p>
        </div>
      )}
    </div>
  );
}
