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
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950 text-white">
      <div className="max-w-3xl mx-auto px-5 py-8 space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300">
              <Activity size={14} />
              Ginastica Laboral
            </div>
            <h1 className="text-4xl font-black">Registro rapido de presenca</h1>
            <p className="text-zinc-300 max-w-2xl">
              Confirme sua participacao e diga como a aula foi percebida. Isso ajuda a equipe a ajustar a rotina na ponta.
            </p>
          </div>
          <div className="rounded-[28px] bg-white/10 border border-white/10 p-4 min-w-[220px]">
            <div className="flex items-center gap-3 text-sm font-bold">
              <Building2 size={16} className="text-emerald-300" />
              {record.tenantName}
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300 mt-2">
              <Clock3 size={16} className="text-emerald-300" />
              {record.session.date} as {record.session.startTime}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_320px] gap-6">
          <div className="bg-white text-zinc-900 rounded-[36px] border border-white/20 shadow-2xl p-7 space-y-7">
            <div className="space-y-2">
              <h2 className="text-2xl font-black">{record.session.sectorName}</h2>
              <p className="text-sm text-zinc-500">
                {record.session.shiftName} · {record.session.durationMinutes} min · Profissional {record.session.instructorName}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Nome</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Digite seu nome completo"
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Matricula</span>
                <input
                  value={badge}
                  onChange={(event) => setBadge(event.target.value)}
                  placeholder="Opcional"
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                />
              </label>
              <label className="sm:col-span-2 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Funcao</span>
                <input
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  placeholder="Ex.: Operador(a), Logistica, Qualidade"
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                />
              </label>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Como voce avaliou a aula?</p>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => setScore(value)}
                    className={`rounded-2xl border px-3 py-4 text-center transition-all ${
                      score === value
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      <Star size={18} className={score === value ? 'fill-current' : ''} />
                    </div>
                    <div className="text-lg font-black">{value}</div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em]">{SCORE_COPY[value]}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">A aula ajudou no seu turno?</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setHelped('yes')}
                  className={`rounded-2xl border px-4 py-4 font-bold transition-all ${
                    helped === 'yes'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300'
                  }`}
                >
                  Sim, ajudou
                </button>
                <button
                  onClick={() => setHelped('no')}
                  className={`rounded-2xl border px-4 py-4 font-bold transition-all ${
                    helped === 'no'
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300'
                  }`}
                >
                  Ainda nao
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Exercicio que mais ajudou</span>
                <select
                  value={favoriteExercise}
                  onChange={(event) => setFavoriteExercise(event.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                >
                  <option value="">Selecione</option>
                  {record.session.exercises.map((exercise) => (
                    <option key={exercise.id} value={exercise.name}>
                      {exercise.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Observacao</span>
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Opcional"
                  className="w-full min-h-[120px] rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 resize-none"
                />
              </label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!name.trim() || score === null || helped === null || submitting}
              className={`w-full rounded-[24px] px-6 py-4 text-lg font-black transition-all ${
                !name.trim() || score === null || helped === null || submitting
                  ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20'
              }`}
            >
              {submitting ? 'Enviando...' : 'Confirmar presenca'}
            </button>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[32px] bg-white/10 border border-white/10 p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300 mb-4">Sequencia prevista</p>
              <div className="space-y-3">
                {record.session.exercises.map((exercise) => (
                  <div key={exercise.id} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <p className="font-bold">{exercise.name}</p>
                    <p className="text-sm text-zinc-300 mt-1">{exercise.focus}</p>
                    <p className="text-xs text-zinc-400 mt-2">{exercise.durationMinutes} min</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] bg-white/10 border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="font-bold">Uso interno Atividade</p>
                  <p className="text-sm text-zinc-300">Presenca e retorno agregados para aderencia e ajuste da aula.</p>
                </div>
              </div>
              <div className="rounded-2xl bg-black/20 p-4 text-sm text-zinc-300">
                <p className="flex items-center gap-2">
                  <User size={14} className="text-emerald-300" />
                  Seu registro entra na lista nominal da turma.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
