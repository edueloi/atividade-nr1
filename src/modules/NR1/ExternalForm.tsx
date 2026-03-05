import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Send, 
  ChevronRight, 
  ChevronLeft,
  AlertCircle,
  ShieldCheck,
  Info
} from 'lucide-react';

interface Question {
  id: string;
  text: string;
  type: 'scale' | 'choice' | 'text';
  options?: string[];
  block?: string;
}

interface CycleData {
  id: string;
  name: string;
  form_name: string;
  form_fields: Question[];
  unit_id: string;
  sectors: { id: string, name: string }[];
}

export function ExternalForm({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cycle, setCycle] = useState<CycleData | null>(null);
  const [currentStep, setCurrentStep] = useState(0); // 0: Intro, 1: Sector Selection, 2+: Questions, Last: Success
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Simulate fetching cycle data by token
    setTimeout(() => {
      setCycle({
        id: 'cycle-1',
        name: 'Ciclo Março/2026',
        form_name: 'DRS Psicossocial v1',
        unit_id: 'toyota-sorocaba',
        sectors: [
          { id: 'sec-1', name: 'Montagem Cross' },
          { id: 'sec-2', name: 'Logística' },
          { id: 'sec-3', name: 'Pintura' }
        ],
        form_fields: [
          { id: 'q1', text: 'Como você avalia seu nível de estresse hoje?', type: 'scale', block: 'Ambiente' },
          { id: 'q2', text: 'Você sente que tem suporte da sua liderança?', type: 'scale', block: 'Relações' },
          { id: 'q3', text: 'Teve dificuldades para dormir devido ao trabalho?', type: 'scale', block: 'Saúde' },
          { id: 'q4', text: 'Você se sente seguro para expressar suas opiniões?', type: 'scale', block: 'Segurança Psicológica' }
        ]
      });
      setLoading(false);
    }, 1500);
  }, [token]);

  const handleNext = () => {
    if (currentStep === 1 && !selectedSector) return;
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 2000);
  };

  if (loading && !submitted) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-500 font-medium animate-pulse">Carregando questionário seguro...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900">Link Inválido</h2>
          <p className="text-zinc-500">Este link de acesso expirou ou não é mais válido. Entre em contato com o RH da sua empresa.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-[40px] shadow-2xl max-w-md w-full text-center space-y-8 border border-zinc-100"
        >
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-zinc-900">Obrigado!</h2>
            <p className="text-zinc-500">Sua participação é fundamental para construirmos um ambiente de trabalho melhor.</p>
          </div>
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-xs text-zinc-400">
            Suas respostas foram enviadas de forma anônima e segura.
          </div>
          <button 
            onClick={() => window.close()}
            className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/20"
          >
            Fechar Janela
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 p-6 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-zinc-900">Mapeamento Seguro</h1>
              <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">{cycle?.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-zinc-400 uppercase font-bold mb-1">Progresso</p>
            <div className="w-24 bg-zinc-100 rounded-full h-1.5">
              <div 
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${(currentStep / (cycle!.form_fields.length + 2)) * 100}%` }} 
              />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-6 py-12">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-zinc-900 leading-tight">Olá! Sua voz é importante para nós.</h2>
                <p className="text-lg text-zinc-500 leading-relaxed">
                  Este é um espaço seguro e anônimo para você compartilhar como se sente em relação ao seu trabalho.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-6 bg-white border border-zinc-200 rounded-3xl flex gap-4 items-start">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 mb-1">100% Anônimo</h4>
                    <p className="text-sm text-zinc-500">Ninguém na sua empresa saberá quem deu cada resposta. Os dados são tratados de forma agregada.</p>
                  </div>
                </div>
                <div className="p-6 bg-white border border-zinc-200 rounded-3xl flex gap-4 items-start">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Info size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 mb-1">Rápido e Simples</h4>
                    <p className="text-sm text-zinc-500">Leva menos de 5 minutos para responder. Suas respostas ajudam a melhorar o ambiente de trabalho.</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleNext}
                className="w-full py-5 bg-emerald-600 text-white rounded-[24px] text-lg font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 group"
              >
                Começar agora
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div 
              key="sector"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-zinc-900">Em qual setor você trabalha?</h2>
                <p className="text-zinc-500">Precisamos dessa informação apenas para agrupar os resultados por área.</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {cycle?.sectors.map((sector) => (
                  <button
                    key={sector.id}
                    onClick={() => setSelectedSector(sector.id)}
                    className={`
                      p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group
                      ${selectedSector === sector.id 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                        : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'}
                    `}
                  >
                    <span className="font-bold">{sector.name}</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedSector === sector.id ? 'border-emerald-500 bg-emerald-500' : 'border-zinc-200'
                    }`}>
                      {selectedSector === sector.id && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleBack}
                  className="flex-1 py-4 border border-zinc-200 text-zinc-600 rounded-2xl font-bold hover:bg-zinc-100 transition-all"
                >
                  Voltar
                </button>
                <button 
                  onClick={handleNext}
                  disabled={!selectedSector}
                  className={`
                    flex-[2] py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2
                    ${selectedSector 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20' 
                      : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}
                  `}
                >
                  Próximo
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep >= 2 && currentStep < (cycle!.form_fields.length + 2) && (
            <motion.div 
              key={`q-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              {(() => {
                const question = cycle!.form_fields[currentStep - 2];
                return (
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <span className="px-3 py-1 bg-zinc-100 text-zinc-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
                        {question.block}
                      </span>
                      <h2 className="text-3xl font-bold text-zinc-900 leading-tight">
                        {question.text}
                      </h2>
                    </div>

                    {question.type === 'scale' && (
                      <div className="space-y-8">
                        <div className="grid grid-cols-11 gap-1">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                            <button
                              key={val}
                              onClick={() => handleAnswer(question.id, val)}
                              className={`
                                aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all
                                ${answers[question.id] === val 
                                  ? 'bg-emerald-600 text-white scale-110 shadow-lg shadow-emerald-500/20' 
                                  : 'bg-white border border-zinc-200 text-zinc-400 hover:border-emerald-500 hover:text-emerald-600'}
                              `}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">
                          <span>Péssimo</span>
                          <span>Excelente</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4 pt-8">
                      <button 
                        onClick={handleBack}
                        className="flex-1 py-4 border border-zinc-200 text-zinc-600 rounded-2xl font-bold hover:bg-zinc-100 transition-all"
                      >
                        Voltar
                      </button>
                      <button 
                        onClick={currentStep === cycle!.form_fields.length + 1 ? handleSubmit : handleNext}
                        disabled={answers[question.id] === undefined}
                        className={`
                          flex-[2] py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2
                          ${answers[question.id] !== undefined 
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20' 
                            : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}
                        `}
                      >
                        {currentStep === cycle!.form_fields.length + 1 ? 'Enviar Respostas' : 'Próximo'}
                        {currentStep === cycle!.form_fields.length + 1 ? <Send size={20} /> : <ChevronRight size={20} />}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center">
        <p className="text-xs text-zinc-400 flex items-center justify-center gap-2">
          <ShieldCheck size={14} />
          Sua privacidade é nossa prioridade. Dados protegidos pela LGPD.
        </p>
      </footer>
    </div>
  );
}
