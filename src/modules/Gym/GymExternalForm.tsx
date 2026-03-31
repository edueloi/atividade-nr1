import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  Building2,
  CheckCircle2,
  Clock3,
  MessageSquare,
  ShieldCheck,
  Star,
  User,
} from 'lucide-react';
import { loadGymExternalForm, registerGymExternalOpen, submitGymExternalForm, type GymExternalFormData } from './gymStorage.js';

const SCORE_COPY: Record<number, string> = {
  1: 'Nao ajudou',
  2: 'Fraca',
  3: 'Regular',
  4: 'Boa',
  5: 'Excelente',
};

export function GymExternalForm({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<GymExternalFormData | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [badge, setBadge] = useState('');
  const [role, setRole] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [helped, setHelped] = useState<'yes' | 'no' | null>(null);
  const [favoriteExercise, setFavoriteExercise] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    const nextRecord = loadGymExternalForm(token);
    if (!nextRecord) {
      setError('Link invalido ou expirado.');
      setLoading(false);
      return;
    }

    if (nextRecord.share.status !== 'active') {
      setError('Este formulario foi encerrado pela equipe da Atividade.');
      setLoading(false);
      return;
    }

    setRecord(nextRecord);
    registerGymExternalOpen(token);
    setLoading(false);
  }, [token]);

  const handleSubmit = async () => {
    if (!record || !name.trim() || score === null || helped === null) {
      return;
    }

    setSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 600));

    const result = submitGymExternalForm(token, {
      name,
      badge,
      role,
      feedbackScore: score,
      feedbackHelped: helped,
      favoriteExercise,
      feedbackComment: comment,
    });

    if (!result) {
      setError('Nao foi possivel registrar sua resposta.');
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
        <div className="text-center space-y-5">
          <div className="w-14 h-14 mx-auto rounded-full border-4 border-white/20 border-t-emerald-400 animate-spin" />
          <div>
            <p className="text-lg font-bold">Carregando formulario de presenca</p>
            <p className="text-sm text-zinc-400">Aguarde alguns segundos.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-[36px] border border-zinc-200 shadow-xl p-10 text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <MessageSquare size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-900">Formulario indisponivel</h1>
            <p className="text-zinc-500 mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!record) {
    return null;
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-zinc-100 flex items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="max-w-xl w-full bg-white rounded-[40px] border border-zinc-200 shadow-2xl p-10 text-center space-y-8"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={48} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-zinc-900">Presenca registrada</h1>
            <p className="text-zinc-500 mt-3">
              Sua participacao foi contabilizada na turma de <strong className="text-zinc-800">{record.session.sectorName}</strong>.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="rounded-3xl bg-zinc-50 border border-zinc-200 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">Empresa</p>
              <p className="font-bold text-zinc-900">{record.tenantName}</p>
            </div>
            <div className="rounded-3xl bg-zinc-50 border border-zinc-200 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">Horario</p>
              <p className="font-bold text-zinc-900">{record.session.startTime}</p>
            </div>
            <div className="rounded-3xl bg-zinc-50 border border-zinc-200 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">Turma</p>
              <p className="font-bold text-zinc-900">{record.session.shiftName}</p>
            </div>
          </div>
          <div className="rounded-[28px] bg-emerald-50 border border-emerald-100 p-5 text-left">
            <p className="text-sm font-bold text-emerald-900">Obrigado pelo retorno.</p>
            <p className="text-sm text-emerald-700 mt-1">
              A equipe da Atividade usa essa leitura para ajustar exercicios, horario e aderencia da ginastica laboral.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 relative pb-12 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Premium top accent background */}
      <div className="absolute top-0 left-0 right-0 h-[280px] bg-[#022c22] rounded-b-[40px] sm:rounded-b-[48px] shadow-lg shadow-emerald-950/20" />
      
      <div className="max-w-[840px] mx-auto px-4 py-8 relative z-10 w-full flex flex-col items-center">
        
        {/* Header */}
        <header className="w-full text-white space-y-4 mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200 backdrop-blur-md">
            <Activity size={14} />
            Check-in Laboral
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">Registro de participacao</h1>
          <p className="text-emerald-100/70 text-sm max-w-xl mx-auto sm:mx-0 font-medium">
            Sua avaliacao nos ajuda a moldar aulas de ginastica laboral com mais qualidade e precisao em campo.
          </p>
        </header>

        {/* Content Flow */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
          
          {/* Main Form Box */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] border border-zinc-200 shadow-2xl shadow-zinc-200/50 p-6 sm:p-8 space-y-8 h-fit w-full"
          >
            <div className="space-y-1 border-b border-zinc-100 pb-6">
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight leading-tight">{record.session.sectorName}</h2>
              <p className="text-xs text-zinc-500 font-medium flex flex-wrap gap-2 items-center">
                <span className="bg-zinc-100 px-2.5 py-1 rounded-md text-zinc-700">{record.session.shiftName}</span>
                <span className="text-zinc-300">•</span>
                <span>{record.session.durationMinutes} min</span>
                <span className="text-zinc-300">•</span>
                <span>Prof. {record.session.instructorName}</span>
              </p>
            </div>

            <div className="space-y-6">
              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Nome completo</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Como deseja ser chamado?"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3 text-[13px] font-medium text-zinc-900 outline-none focus:border-emerald-500 transition-colors shadow-sm"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Matricula / Cracha</span>
                  <input
                    value={badge}
                    onChange={(event) => setBadge(event.target.value)}
                    placeholder="(Opcional)"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3 text-[13px] font-medium text-zinc-900 outline-none focus:border-emerald-500 transition-colors shadow-sm"
                  />
                </label>
                <label className="sm:col-span-2 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Funcao / Cargo</span>
                  <input
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    placeholder="Ex.: Operador de Maquinas, Analista, Logistica"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3 text-[13px] font-medium text-zinc-900 outline-none focus:border-emerald-500 transition-colors shadow-sm"
                  />
                </label>
              </div>

              {/* Rating 1 to 5 */}
              <div className="space-y-2 pt-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Sua avaliacao geral da aula</p>
                <div className="flex gap-1.5 sm:gap-2 w-full">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => setScore(value)}
                      className={`flex-1 rounded-2xl border px-1 py-3 transition-all flex flex-col items-center justify-center gap-1.5 ${
                        score === value
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-100/50 scale-[1.02]'
                          : 'border-zinc-200 bg-white text-zinc-400 hover:border-emerald-200 hover:bg-emerald-50/30 hover:text-emerald-500'
                      }`}
                    >
                      <Star size={16} className={score === value ? 'fill-current' : ''} />
                      <div className={`text-base font-black leading-none ${score === value ? 'text-emerald-800' : 'text-zinc-700'}`}>{value}</div>
                      <div className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.1em] text-center w-full break-words px-0.5 ${score === value ? 'text-emerald-700' : 'text-zinc-400'}`}>
                        {SCORE_COPY[value]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Helped Shift */}
              <div className="space-y-2 pt-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">A aula aliviou tensoes do seu turno?</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setHelped('yes')}
                    className={`rounded-2xl border px-3 py-3 font-bold transition-all text-sm outline-none ${
                        helped === 'yes'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-100/50 scale-[1.02]'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:border-emerald-200 hover:bg-emerald-50/30'
                    }`}
                  >
                    Sim, ajudou
                  </button>
                  <button
                    onClick={() => setHelped('no')}
                    className={`rounded-2xl border px-3 py-3 font-bold transition-all text-sm outline-none ${
                        helped === 'no'
                          ? 'border-zinc-800 bg-zinc-900 text-white shadow-md shadow-zinc-900/20 scale-[1.02]'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                    }`}
                  >
                    Nao senti diferenca
                  </button>
                </div>
              </div>

              {/* Extras */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <label className="space-y-1.5 xl:hidden col-span-1 sm:col-span-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Melhor parte da sequencia</span>
                  <select
                    value={favoriteExercise}
                    onChange={(event) => setFavoriteExercise(event.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3 text-[13px] font-medium text-zinc-900 outline-none focus:border-emerald-500 transition-colors shadow-sm cursor-pointer appearance-none"
                    style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%2371717a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>')`, backgroundPosition: 'right 16px center', backgroundRepeat: 'no-repeat' }}
                  >
                    <option value="" disabled hidden>Selecione um exercicio</option>
                    {record.session.exercises.map((exercise) => (
                      <option key={exercise.id} value={exercise.name}>
                        {exercise.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1.5 hidden xl:block">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Melhor parte da sequencia</span>
                  <select
                    value={favoriteExercise}
                    onChange={(event) => setFavoriteExercise(event.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3 text-[13px] font-medium text-zinc-900 outline-none focus:border-emerald-500 transition-colors shadow-sm cursor-pointer appearance-none"
                    style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%2371717a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>')`, backgroundPosition: 'right 16px center', backgroundRepeat: 'no-repeat' }}
                  >
                    <option value="" disabled hidden>Selecione um exercicio</option>
                    {record.session.exercises.map((exercise) => (
                      <option key={exercise.id} value={exercise.name}>
                        {exercise.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1.5 sm:col-span-1 xl:col-span-1 col-span-1 text-left w-full h-full block min-h-[100px]">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Comentario aberto</span>
                  <textarea
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="O que achou ou o que faltou? (Opcional)"
                    className="w-full h-full min-h-[100px] rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3 text-[13px] font-medium text-zinc-900 outline-none focus:border-emerald-500 transition-colors shadow-sm resize-none"
                  />
                </label>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={!name.trim() || score === null || helped === null || submitting}
                  className={`relative w-full overflow-hidden rounded-[20px] px-6 py-4 text-[15px] font-black transition-all outline-none ${
                    !name.trim() || score === null || helped === null || submitting
                      ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 active:scale-[0.98]'
                  }`}
                >
                  <span className={`flex items-center justify-center gap-2 transition-transform ${submitting ? '-translate-y-12 opacity-0' : 'translate-y-0 opacity-100'}`}>
                     Confirmar e finalizar envio
                  </span>
                  <span className={`absolute inset-0 flex items-center justify-center gap-2 transition-transform ${submitting ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Registrando...
                  </span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Information Aside */}
          <aside className="space-y-5 h-fit">
            
            {/* Meta context */}
            <motion.div 
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[28px] bg-white border border-zinc-200 shadow-xl shadow-zinc-200/50 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start gap-4 pb-5 border-b border-zinc-100">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-0.5">Empresarial</p>
                    <p className="text-[15px] font-black text-zinc-900 leading-tight">{record.tenantName}</p>
                    <p className="text-xs text-zinc-500 font-medium flex items-center gap-1.5 mt-2">
                       <Clock3 size={12} className="text-zinc-400" />
                       {record.session.date} as {record.session.startTime}
                    </p>
                  </div>
                </div>

                <div className="pt-5 space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Sequencia executada</p>
                  <div className="space-y-2">
                    {record.session.exercises.map((exercise) => (
                      <div key={exercise.id} className="rounded-xl bg-zinc-50/80 border border-zinc-100 p-3.5 flex justify-between items-start gap-3">
                        <div>
                          <p className="text-[13px] font-bold text-zinc-900">{exercise.name}</p>
                          <p className="text-[11px] text-zinc-500 mt-0.5 font-medium">{exercise.focus}</p>
                        </div>
                        <div className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md shrink-0">
                          {exercise.durationMinutes}m
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Privacy Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-[24px] bg-zinc-900 text-white p-6 shadow-xl shadow-zinc-900/10 border border-zinc-800"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-zinc-400 flex items-center justify-center shrink-0 border border-zinc-700">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-black tracking-wide text-zinc-100">Uso monitorado</p>
                  <p className="text-[11px] text-zinc-400 font-medium mt-1 leading-snug">Seus dados preenchem a lista nominal de presenca mantida pela Atividade.</p>
                </div>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}
