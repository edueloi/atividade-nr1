import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  LayoutList,
  Link2,
  MessageSquare,
  PencilLine,
  Play,
  Plus,
  RefreshCw,
  Save,
  Star,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  createAdhocGymSession,
  createGymExternalShare,
  loadGymTenantState,
  removeGymSchedule,
  saveGymSession,
  upsertGymSchedule,
  type GymExternalShare,
  type GymExercise,
  type GymParticipant,
  type GymSchedule,
  type GymSession,
  type GymTenantState,
} from './gymStorage.js';
import { AppModal } from '../../components/ui/AppModal.js';
import { ModalButton } from '../../components/ui/ModalButton.js';
import { ModalSelect } from '../../components/ui/ModalSelect.js';

interface GymViewProps {
  tenant: { id: string; name: string };
  user: { id: string; name: string; role: string };
}

const DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

function formatIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function createLocalId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function presentCount(session: GymSession) {
  return session.participants.filter((participant) => participant.present).length;
}

function attendanceRate(session: GymSession) {
  if (session.expectedCount <= 0) return 0;
  return Math.round((presentCount(session) / session.expectedCount) * 100);
}

function feedbackAverage(session: GymSession) {
  const scores = session.participants
    .map((participant) => participant.feedbackScore)
    .filter((value): value is number => typeof value === 'number');

  if (scores.length === 0) return null;
  return Number((scores.reduce((sum, value) => sum + value, 0) / scores.length).toFixed(1));
}

function sessionStatusLabel(status: GymSession['status']) {
  if (status === 'running') return 'Em andamento';
  if (status === 'finished') return 'Concluida';
  return 'Planejada';
}

function sessionStatusClass(status: GymSession['status']) {
  if (status === 'running') return 'bg-amber-50 text-amber-700';
  if (status === 'finished') return 'bg-emerald-50 text-emerald-700';
  return 'bg-blue-50 text-blue-700';
}

function buildShareUrl(token: string) {
  if (typeof window === 'undefined') {
    return `/gym/s/${token}`;
  }
  return `${window.location.origin}/gym/s/${token}`;
}

function sanitizeExercise(exercise: GymExercise, index: number): GymExercise | null {
  const name = exercise.name.trim();
  if (!name) return null;

  return {
    ...exercise,
    id: exercise.id || createLocalId(`exercise-${index}`),
    name,
    focus: exercise.focus.trim() || 'Pausa ativa',
    durationMinutes: Math.max(1, exercise.durationMinutes || 1),
  };
}

function sanitizeParticipant(participant: GymParticipant, index: number): GymParticipant | null {
  const hasContent =
    participant.name.trim() ||
    participant.badge.trim() ||
    participant.role.trim() ||
    participant.present ||
    participant.feedbackComment ||
    participant.feedbackScore !== undefined;

  if (!hasContent) return null;

  return {
    ...participant,
    id: participant.id || createLocalId(`participant-${index}`),
    name: participant.name.trim() || `Colaborador ${String(index + 1).padStart(2, '0')}`,
    badge: participant.badge.trim() || `GL-${String(index + 1).padStart(3, '0')}`,
    role: participant.role.trim() || 'Equipe',
    favoriteExercise: participant.favoriteExercise?.trim(),
    feedbackComment: participant.feedbackComment?.trim(),
  };
}

function MetricCard({
  title,
  value,
  hint,
  icon,
}: {
  title: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-0.5">{title}</p>
          <div className="text-2xl font-black text-zinc-900 leading-tight">{value}</div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>
      <p className="text-xs text-zinc-500 leading-snug">{hint}</p>
    </div>
  );
}

const MODAL_FIELD_CLASS =
  'w-full h-11 rounded-xl border border-zinc-200 bg-white px-3.5 text-sm font-medium text-zinc-700 outline-none focus:border-emerald-500';
const MODAL_TEXTAREA_CLASS =
  'w-full min-h-[110px] rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm font-medium text-zinc-700 outline-none focus:border-emerald-500 resize-none';
const MODAL_PANEL_CLASS = 'rounded-[28px] bg-zinc-50 border border-zinc-200 p-5';

function buildOptionList(...groups: Array<Array<string | undefined> | undefined>) {
  const seen = new Set<string>();

  groups.forEach((group) => {
    group?.forEach((value) => {
      const next = (value || '').trim();
      if (next) {
        seen.add(next);
      }
    });
  });

  return Array.from(seen);
}

export const GymView: React.FC<GymViewProps> = ({ tenant, user }) => {
  const [activeSubTab, setActiveSubTab] = useState<'operation' | 'schedule' | 'reports'>('operation');
  const [data, setData] = useState<GymTenantState | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionDraft, setSessionDraft] = useState<GymSession | null>(null);
  const [scheduleDraft, setScheduleDraft] = useState<GymSchedule | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [showRightDrawer, setShowRightDrawer] = useState(false);

  const todayKey = formatIsoDate(new Date());

  const loadData = () => {
    setLoading(true);
    const nextState = loadGymTenantState(tenant.id, tenant.name);
    setData(nextState);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [tenant.id, tenant.name]);

  const shareMap = new Map<string, GymExternalShare>((data?.externalShares ?? []).map((share) => [share.token, share]));
  const todaySessions = (data?.sessions ?? [])
    .filter((session) => session.date === todayKey)
    .sort((left, right) => left.startTime.localeCompare(right.startTime));
  const monthlySessions = (data?.sessions ?? []).filter((session) => session.date.startsWith(todayKey.slice(0, 7)));
  const activeShares: GymExternalShare[] = (data?.externalShares ?? []).filter((share) => share.status === 'active');
  const totalExpectedToday = todaySessions.reduce((sum, session) => sum + session.expectedCount, 0);
  const totalPresentToday = todaySessions.reduce((sum, session) => sum + presentCount(session), 0);
  const averageAttendanceToday = totalExpectedToday > 0 ? Math.round((totalPresentToday / totalExpectedToday) * 100) : 0;
  const feedbackValues = todaySessions
    .map((session) => feedbackAverage(session))
    .filter((value): value is number => typeof value === 'number');
  const averageFeedbackToday = feedbackValues.length > 0
    ? (feedbackValues.reduce((sum, value) => sum + value, 0) / feedbackValues.length).toFixed(1)
    : '-';
  const latestSnapshot = data?.monthlySnapshots[data.monthlySnapshots.length - 1];
  const unitOptions = buildOptionList(
    [tenant.name, sessionDraft?.unitName, scheduleDraft?.unitName],
    data?.sessions.map((session) => session.unitName),
    data?.schedules.map((schedule) => schedule.unitName),
  );
  const sectorOptions = buildOptionList(
    [sessionDraft?.sectorName, scheduleDraft?.sectorName],
    data?.sessions.map((session) => session.sectorName),
    data?.schedules.map((schedule) => schedule.sectorName),
  );
  const shiftOptions = buildOptionList(
    [sessionDraft?.shiftName, scheduleDraft?.shiftName],
    data?.sessions.map((session) => session.shiftName),
    data?.schedules.map((schedule) => schedule.shiftName),
  );
  const instructorOptions = buildOptionList(
    [user.name, sessionDraft?.instructorName, scheduleDraft?.instructorName],
    data?.sessions.map((session) => session.instructorName),
    data?.schedules.map((schedule) => schedule.instructorName),
  );

  const sectorPerformanceMap = new Map<
    string,
    { planned: number; active: number; expected: number; present: number; feedback: number[] }
  >();

  monthlySessions.forEach((session) => {
    const current = sectorPerformanceMap.get(session.sectorName) || {
      planned: 0,
      active: 0,
      expected: 0,
      present: 0,
      feedback: [],
    };

    current.planned += 1;
    if (session.status !== 'planned') current.active += 1;
    current.expected += session.expectedCount;
    current.present += presentCount(session);
    session.participants.forEach((participant) => {
      if (typeof participant.feedbackScore === 'number') {
        current.feedback.push(participant.feedbackScore);
      }
    });
    sectorPerformanceMap.set(session.sectorName, current);
  });

  const sectorRows = Array.from(sectorPerformanceMap.entries())
    .map(([sector, metrics]) => ({
      sector,
      planned: metrics.planned,
      active: metrics.active,
      rate: metrics.expected > 0 ? Math.round((metrics.present / metrics.expected) * 100) : 0,
      feedback: metrics.feedback.length > 0
        ? Number((metrics.feedback.reduce((sum, value) => sum + value, 0) / metrics.feedback.length).toFixed(1))
        : null,
    }))
    .sort((left, right) => right.rate - left.rate);

  const feedbackNotes = monthlySessions.flatMap((session) =>
    session.participants
      .filter((participant) => participant.feedbackComment)
      .map((participant) => ({
        sessionId: session.id,
        sector: session.sectorName,
        name: participant.name,
        comment: participant.feedbackComment as string,
      })),
  );

  const openSession = (session: GymSession) => {
    setSessionDraft(cloneValue(session));
  };

  const copyShareLink = async (token: string) => {
    const url = buildShareUrl(token);
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
    }
    setCopiedToken(token);
    window.setTimeout(() => setCopiedToken((current) => (current === token ? null : current)), 2200);
  };

  const handleCreateShare = async (sessionId: string) => {
    const created = createGymExternalShare(tenant.id, tenant.name, sessionId);
    if (!created) return;
    loadData();
    const refreshed = loadGymTenantState(tenant.id, tenant.name);
    const nextSession = refreshed.sessions.find((session) => session.id === sessionId);
    if (nextSession && sessionDraft?.id === sessionId) {
      setSessionDraft(cloneValue(nextSession));
    }
    await copyShareLink(created.token);
  };

  const handleCreateAdhocSession = () => {
    const created = createAdhocGymSession(tenant.id, tenant.name, user.name);
    loadData();
    setSessionDraft(cloneValue(created));
  };

  const handlePersistSession = (nextStatus?: GymSession['status']) => {
    if (!sessionDraft) return;

    const exercises = sessionDraft.exercises
      .map((exercise, index) => sanitizeExercise(exercise, index))
      .filter((exercise): exercise is GymExercise => Boolean(exercise));
    const participants = sessionDraft.participants
      .map((participant, index) => sanitizeParticipant(participant, index))
      .filter((participant): participant is GymParticipant => Boolean(participant));

    const cleanedSession: GymSession = {
      ...sessionDraft,
      status: nextStatus || sessionDraft.status,
      exercises: exercises.length > 0 ? exercises : [{
        id: createLocalId('exercise'),
        name: 'Alongamento rapido',
        focus: 'Pausa ativa',
        durationMinutes: 5,
        completed: nextStatus === 'finished',
      }],
      participants,
      expectedCount: Math.max(sessionDraft.expectedCount, participants.length),
      notes: sessionDraft.notes.trim(),
      unitName: sessionDraft.unitName.trim() || tenant.name,
      sectorName: sessionDraft.sectorName.trim() || 'Turma sem setor',
      shiftName: sessionDraft.shiftName.trim() || 'Turno em definicao',
      instructorName: sessionDraft.instructorName.trim() || user.name,
    };

    saveGymSession(tenant.id, tenant.name, cleanedSession);
    loadData();
    setSessionDraft(cloneValue(cleanedSession));
  };

  const openScheduleEditor = (schedule?: GymSchedule) => {
    if (schedule) {
      setScheduleDraft(cloneValue(schedule));
      return;
    }

    const reference = data?.schedules[0] || data?.sessions[0];
    const templateExercises = cloneValue(data?.schedules[0]?.exercises || data?.sessions[0]?.exercises || []);
    setScheduleDraft({
      id: createLocalId('schedule'),
      tenantId: tenant.id,
      unitName: reference?.unitName || tenant.name,
      sectorName: reference?.sectorName || '',
      shiftName: reference?.shiftName || '',
      dayOfWeek: 'dayOfWeek' in (reference || {}) ? Number(reference.dayOfWeek) || 1 : 1,
      startTime: reference?.startTime || '08:00',
      durationMinutes: reference?.durationMinutes || 10,
      expectedCount: reference?.expectedCount || 10,
      instructorName: reference?.instructorName || user.name,
      exercises: templateExercises,
    });
  };

  const saveScheduleDraft = () => {
    if (!scheduleDraft) return;
    upsertGymSchedule(tenant.id, tenant.name, {
      ...scheduleDraft,
      unitName: scheduleDraft.unitName.trim() || tenant.name,
      sectorName: scheduleDraft.sectorName.trim() || 'Nova recorrencia',
      shiftName: scheduleDraft.shiftName.trim() || 'Turno padrao',
      instructorName: scheduleDraft.instructorName.trim() || user.name,
      durationMinutes: Math.max(5, scheduleDraft.durationMinutes),
      expectedCount: Math.max(1, scheduleDraft.expectedCount),
    });
    loadData();
    setScheduleDraft(null);
  };

  const deleteScheduleDraft = () => {
    if (!scheduleDraft) return;
    removeGymSchedule(tenant.id, tenant.name, scheduleDraft.id);
    loadData();
    setScheduleDraft(null);
  };

  if (loading || !data) {
    return (
      <div className="bg-white rounded-[32px] border border-zinc-200 shadow-sm p-10 text-center">
        <div className="w-12 h-12 mx-auto rounded-full border-4 border-zinc-200 border-t-emerald-500 animate-spin" />
        <p className="text-zinc-500 font-medium mt-4">Carregando operacao de ginastica laboral...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-[0.2em]">
            <Users size={14} />
            Ginastica Laboral
          </div>
          <h1 className="text-3xl font-black text-zinc-900 mt-4">Execucao, presenca nominal e retorno da turma</h1>
          <p className="text-zinc-500 mt-2 max-w-3xl">
            Cada turma pode ter sequencia de exercicios, lista editavel, formulario externo e consolidacao de aderencia no proprio modulo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowRightDrawer(true)}
            className="px-4 py-3 bg-zinc-800 text-white border border-zinc-800 rounded-2xl text-sm font-bold hover:bg-zinc-700 transition-colors flex items-center gap-2"
          >
            <LayoutList size={16} />
            Checklist e Fila
          </button>
          <button
            onClick={loadData}
            className="px-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Recarregar
          </button>
          <button
            onClick={handleCreateAdhocSession}
            className="px-4 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-100"
          >
            <Plus size={16} />
            Nova turma avulsa
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 bg-zinc-100/70 border border-zinc-200 rounded-2xl p-1">
        {[
          { id: 'operation', label: 'Operacao' },
          { id: 'schedule', label: 'Escalas' },
          { id: 'reports', label: 'Resultados' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as 'operation' | 'schedule' | 'reports')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
              activeSubTab === tab.id ? 'bg-white text-emerald-700 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'operation' && (
          <motion.div
            key="operation"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              <MetricCard
                title="Turmas do dia"
                value={todaySessions.length.toString()}
                hint={`${todaySessions.filter((session) => session.status === 'running').length} em andamento agora`}
                icon={<LayoutList size={20} />}
              />
              <MetricCard
                title="Presenca contabilizada"
                value={`${totalPresentToday}/${totalExpectedToday || 0}`}
                hint={`Aderencia media de ${averageAttendanceToday}%`}
                icon={<Users size={20} />}
              />
              <MetricCard
                title="Formularios ativos"
                value={activeShares.length.toString()}
                hint="Links externos em coleta agora"
                icon={<Link2 size={20} />}
              />
              <MetricCard
                title="Retorno da turma"
                value={averageFeedbackToday.toString()}
                hint="Media da avaliacao registrada hoje"
                icon={<Star size={20} />}
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-5">
                {todaySessions.map((session) => {
                  const share = session.externalShareToken ? shareMap.get(session.externalShareToken) : undefined;
                  const feedback = feedbackAverage(session);
                  const rate = attendanceRate(session);

                  return (
                    <div key={session.id} className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                        <div className="space-y-4 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] ${sessionStatusClass(session.status)}`}>
                              {sessionStatusLabel(session.status)}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                              {session.unitName}
                            </span>
                          </div>

                          <div>
                            <h2 className="text-lg leading-tight font-black text-zinc-900">{session.sectorName}</h2>
                            <p className="text-xs text-zinc-500 mt-1">
                              {session.shiftName} · {session.startTime} · {session.durationMinutes} min · Profissional {session.instructorName}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">
                              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">Presentes</p>
                              <p className="text-lg font-black text-zinc-900 leading-tight">{presentCount(session)}</p>
                              <p className="text-[10px] text-zinc-500 mt-1">Base esperada {session.expectedCount}</p>
                            </div>
                            <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">
                              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">Aderencia</p>
                              <p className="text-lg font-black text-zinc-900 leading-tight">{rate}%</p>
                              <div className="mt-2 h-1.5 rounded-full bg-zinc-200 overflow-hidden">
                                <div className={`h-full ${rate >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(rate, 100)}%` }} />
                              </div>
                            </div>
                            <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">
                              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">Exercicios</p>
                              <p className="text-lg font-black text-zinc-900 leading-tight">{session.exercises.length}</p>
                              <p className="text-[10px] text-zinc-500 mt-1">
                                {session.exercises.filter((exercise) => exercise.completed).length} marcados
                              </p>
                            </div>
                            <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">
                              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">Feedback</p>
                              <p className="text-lg font-black text-zinc-900 leading-tight">{feedback ?? '-'}</p>
                              <p className="text-[10px] text-zinc-500 mt-1">
                                {share ? `${share.submissions} respostas` : 'S/ link'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="lg:w-[240px] space-y-3">
                          <button
                            onClick={() => openSession(session)}
                            className="w-full h-10 px-3 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                          >
                            <PencilLine size={14} />
                            Abrir gestao da turma
                          </button>

                          {share ? (
                            <>
                              <button
                                onClick={() => copyShareLink(share.token)}
                                className="w-full h-10 px-3 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2"
                              >
                                <Link2 size={14} />
                                {copiedToken === share.token ? 'Copiado' : 'Copiar link externo'}
                              </button>
                              <button
                                onClick={() => window.open(buildShareUrl(share.token), '_blank', 'noopener,noreferrer')}
                                className="w-full h-10 px-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
                              >
                                <ExternalLink size={14} />
                                Abrir formulario
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleCreateShare(session.id)}
                              className="w-full h-10 px-3 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-emerald-100"
                            >
                              <MessageSquare size={14} />
                              Gerar form externo
                            </button>
                          )}

                          {share && (
                            <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">
                              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">Coleta</p>
                              <p className="text-xs font-bold text-zinc-900">{share.submissions} respostas</p>
                              <p className="text-[10px] text-zinc-500 mt-0.5">{share.opens} acessos ao link</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              </div>
          </motion.div>
        )}

        {activeSubTab === 'schedule' && (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-white rounded-[34px] border border-zinc-200 shadow-sm p-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-black text-zinc-900">Escalas recorrentes</h2>
                <p className="text-sm text-zinc-500 mt-2">Planejamento semanal da ginastica laboral por setor, turno e profissional.</p>
              </div>
              <button
                onClick={() => openScheduleEditor()}
                className="px-4 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-100"
              >
                <Plus size={16} />
                Nova recorrencia
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map((label, index) => {
                const dayOfWeek = (index + 1) % 7;
                const daySchedules = data.schedules
                  .filter((schedule) => schedule.dayOfWeek === dayOfWeek)
                  .sort((left, right) => left.startTime.localeCompare(right.startTime));

                return (
                  <div key={label} className="space-y-3">
                    <div className="rounded-xl bg-zinc-50 border border-zinc-200 py-3 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                      {label}
                    </div>
                    <div className="min-h-[340px] rounded-[28px] bg-zinc-50/70 border border-dashed border-zinc-200 p-3 space-y-3">
                      {daySchedules.length === 0 && (
                        <div className="h-full flex items-center justify-center text-center text-xs text-zinc-400 px-3">
                          Sem recorrencia cadastrada
                        </div>
                      )}
                      {daySchedules.map((schedule) => (
                        <button
                          key={schedule.id}
                          onClick={() => openScheduleEditor(schedule)}
                          className="w-full text-left rounded-3xl bg-white border border-zinc-200 shadow-sm p-4 hover:border-emerald-300 transition-colors"
                        >
                          <p className="text-sm font-black text-zinc-900">{schedule.startTime}</p>
                          <p className="text-sm text-zinc-700 mt-1">{schedule.sectorName}</p>
                          <p className="text-xs text-zinc-500 mt-1">{schedule.shiftName}</p>
                          <p className="text-[11px] text-zinc-400 mt-3">
                            {schedule.durationMinutes} min · base {schedule.expectedCount}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeSubTab === 'reports' && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              <MetricCard
                title="Aderencia mensal"
                value={`${latestSnapshot?.rate ?? averageAttendanceToday}%`}
                hint="Participacao consolidada do periodo"
                icon={<BarChart3 size={20} />}
              />
              <MetricCard
                title="Satisfacao media"
                value={latestSnapshot ? latestSnapshot.satisfaction.toFixed(1) : averageFeedbackToday.toString()}
                hint="Media do feedback coletado"
                icon={<Star size={20} />}
              />
              <MetricCard
                title="Turmas executadas"
                value={`${latestSnapshot?.completed ?? 0}/${latestSnapshot?.planned ?? 0}`}
                hint="Comparativo entre planejado e realizado"
                icon={<CheckCircle2 size={20} />}
              />
              <MetricCard
                title="Formularios no mes"
                value={`${latestSnapshot?.externalForms ?? activeShares.length}`}
                hint="Uso de coleta externa na rotina"
                icon={<MessageSquare size={20} />}
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white rounded-[34px] border border-zinc-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <BarChart3 size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-zinc-900">Aderencia mensal</h3>
                    <p className="text-sm text-zinc-500">Historico de participacao da ginastica laboral.</p>
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.monthlySnapshots}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                      <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-[34px] border border-zinc-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-700 flex items-center justify-center">
                    <CalendarDays size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-zinc-900">Uso de formulario externo</h3>
                    <p className="text-sm text-zinc-500">Quantidade de turmas com envio de link por mes.</p>
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.monthlySnapshots}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                      <Tooltip />
                      <Bar dataKey="externalForms" fill="#18181b" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.3fr)_360px] gap-6">
              <div className="bg-white rounded-[34px] border border-zinc-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-zinc-100">
                  <h3 className="text-xl font-black text-zinc-900">Desempenho por setor</h3>
                  <p className="text-sm text-zinc-500 mt-2">Leitura rapida de presenca, execucao e feedback.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-zinc-50">
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Setor</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Planejadas</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Executadas</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Aderencia</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Feedback</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sectorRows.map((row) => (
                        <tr key={row.sector} className="border-t border-zinc-100">
                          <td className="px-6 py-4 text-sm font-bold text-zinc-900">{row.sector}</td>
                          <td className="px-6 py-4 text-sm text-zinc-600">{row.planned}</td>
                          <td className="px-6 py-4 text-sm text-zinc-600">{row.active}</td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-bold ${row.rate >= 80 ? 'text-emerald-700' : 'text-amber-600'}`}>
                              {row.rate}%
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-zinc-600">{row.feedback ?? '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-[34px] border border-zinc-200 shadow-sm p-6">
                  <h3 className="text-xl font-black text-zinc-900">Leitura dos participantes</h3>
                  <div className="space-y-4 mt-5">
                    {feedbackNotes.length === 0 && (
                      <div className="rounded-3xl bg-zinc-50 border border-zinc-200 p-5 text-sm text-zinc-500">
                        Ainda nao ha comentarios textuais neste mes.
                      </div>
                    )}
                    {feedbackNotes.slice(0, 4).map((note) => (
                      <div key={`${note.sessionId}-${note.name}`} className="rounded-3xl bg-zinc-50 border border-zinc-200 p-5">
                        <p className="text-sm font-black text-zinc-900">{note.name}</p>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400 mt-1">{note.sector}</p>
                        <p className="text-sm text-zinc-600 mt-3">{note.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-[34px] border border-zinc-200 shadow-sm p-6">
                  <h3 className="text-xl font-black text-zinc-900">Radar de risco operacional</h3>
                  <div className="space-y-3 mt-5">
                    {[
                      `${sectorRows.filter((row) => row.rate < 80).length} setores abaixo da meta de 80%`,
                      `${monthlySessions.filter((session) => !session.externalShareToken).length} turmas sem link externo neste mes`,
                      `${monthlySessions.filter((session) => session.status === 'planned').length} registros ainda em aberto`,
                    ].map((line) => (
                      <div key={line} className="rounded-2xl bg-zinc-50 border border-zinc-200 p-4 text-sm font-medium text-zinc-700">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sessionDraft && (
          <AppModal
            title={`${sessionDraft.sectorName} - ${sessionStatusLabel(sessionDraft.status)}`}
            description={`Data de execucao: ${sessionDraft.date}. Ajuste presenca nominal, exercicios e colete feedback.`}
            icon={<LayoutList size={20} />}
            onClose={() => setSessionDraft(null)}
            maxWidthClassName="max-w-[1240px]"
            bodyClassName="p-8"
          >
            <div className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-8">
                <div className="space-y-6">
                  <div className="rounded-[30px] bg-zinc-50 border border-zinc-200 p-6 space-y-4">
                    <h3 className="text-xl font-black text-zinc-900">Dados da turma</h3>
                    <label className="block space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Unidade</span>
                      <input
                        value={sessionDraft.unitName}
                        onChange={(event) => setSessionDraft((current) => current ? { ...current, unitName: event.target.value } : current)}
                        className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                      />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Setor</span>
                      <input
                        value={sessionDraft.sectorName}
                        onChange={(event) => setSessionDraft((current) => current ? { ...current, sectorName: event.target.value } : current)}
                        className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                      />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Turno</span>
                      <input
                        value={sessionDraft.shiftName}
                        onChange={(event) => setSessionDraft((current) => current ? { ...current, shiftName: event.target.value } : current)}
                        className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="block space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Horario</span>
                        <input
                          type="time"
                          value={sessionDraft.startTime}
                          onChange={(event) => setSessionDraft((current) => current ? { ...current, startTime: event.target.value } : current)}
                          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                        />
                      </label>
                      <label className="block space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Duracao</span>
                        <input
                          type="number"
                          min={5}
                          value={sessionDraft.durationMinutes}
                          onChange={(event) => setSessionDraft((current) => current ? { ...current, durationMinutes: Number(event.target.value) || 5 } : current)}
                          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                        />
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="block space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Base esperada</span>
                        <input
                          type="number"
                          min={1}
                          value={sessionDraft.expectedCount}
                          onChange={(event) => setSessionDraft((current) => current ? { ...current, expectedCount: Number(event.target.value) || 1 } : current)}
                          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                        />
                      </label>
                      <label className="block space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Profissional</span>
                        <input
                          value={sessionDraft.instructorName}
                          onChange={(event) => setSessionDraft((current) => current ? { ...current, instructorName: event.target.value } : current)}
                          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                        />
                      </label>
                    </div>
                    <label className="block space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Observacoes da aula</span>
                      <textarea
                        value={sessionDraft.notes}
                        onChange={(event) => setSessionDraft((current) => current ? { ...current, notes: event.target.value } : current)}
                        className="w-full min-h-[120px] rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 resize-none"
                      />
                    </label>
                  </div>

                  <div className="rounded-[30px] bg-zinc-50 border border-zinc-200 p-6 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-black text-zinc-900">Formulario externo</h3>
                        <p className="text-sm text-zinc-500 mt-1">Envio para contabilizar presenca e impressao da turma.</p>
                      </div>
                      {sessionDraft.externalShareToken ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-[0.18em]">
                          ativo
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-zinc-200 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.18em]">
                          pendente
                        </span>
                      )}
                    </div>

                    {sessionDraft.externalShareToken ? (
                      <>
                        <div className="rounded-2xl bg-white border border-zinc-200 p-4">
                          <p className="text-xs font-mono text-zinc-600 break-all">{buildShareUrl(sessionDraft.externalShareToken)}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => copyShareLink(sessionDraft.externalShareToken as string)}
                            className="px-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-700 hover:bg-zinc-100 transition-colors"
                          >
                            {copiedToken === sessionDraft.externalShareToken ? 'Link copiado' : 'Copiar link'}
                          </button>
                          <button
                            onClick={() => window.open(buildShareUrl(sessionDraft.externalShareToken as string), '_blank', 'noopener,noreferrer')}
                            className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            Abrir
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => handleCreateShare(sessionDraft.id)}
                        className="w-full px-4 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
                      >
                        Gerar formulario externo
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <ModalButton
                      variant="ghost"
                      onClick={() => handlePersistSession('planned')}
                      iconLeft={<Save size={16} />}
                      fullWidth
                    >
                      Salvar
                    </ModalButton>
                    <ModalButton
                      variant="secondary"
                      onClick={() => handlePersistSession('running')}
                      iconLeft={<Play size={16} />}
                      fullWidth
                    >
                      Em andamento
                    </ModalButton>
                    <ModalButton
                      variant="primary"
                      onClick={() => handlePersistSession('finished')}
                      iconLeft={<CheckCircle2 size={16} />}
                      fullWidth
                    >
                      Concluir
                    </ModalButton>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-[30px] bg-zinc-50 border border-zinc-200 p-6">
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div>
                        <h3 className="text-xl font-black text-zinc-900">Sequencia da ginastica</h3>
                        <p className="text-sm text-zinc-500 mt-1">Monte a aula com os exercicios realmente aplicados.</p>
                      </div>
                      <button
                        onClick={() => setSessionDraft((current) => current ? {
                          ...current,
                          exercises: [...current.exercises, { id: createLocalId('exercise'), name: '', focus: '', durationMinutes: 2, completed: false }],
                        } : current)}
                        className="px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-colors"
                      >
                        Adicionar
                      </button>
                    </div>

                    <div className="space-y-4">
                      {sessionDraft.exercises.map((exercise) => (
                        <div key={exercise.id} className="rounded-3xl bg-white border border-zinc-200 p-4">
                          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_190px_110px_44px] gap-3">
                            <input
                              value={exercise.name}
                              onChange={(event) => setSessionDraft((current) => current ? {
                                ...current,
                                exercises: current.exercises.map((item) => item.id === exercise.id ? { ...item, name: event.target.value } : item),
                              } : current)}
                              placeholder="Nome do exercicio"
                              className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                            />
                            <input
                              value={exercise.focus}
                              onChange={(event) => setSessionDraft((current) => current ? {
                                ...current,
                                exercises: current.exercises.map((item) => item.id === exercise.id ? { ...item, focus: event.target.value } : item),
                              } : current)}
                              placeholder="Foco"
                              className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                            />
                            <input
                              type="number"
                              min={1}
                              value={exercise.durationMinutes}
                              onChange={(event) => setSessionDraft((current) => current ? {
                                ...current,
                                exercises: current.exercises.map((item) => item.id === exercise.id ? { ...item, durationMinutes: Number(event.target.value) || 1 } : item),
                              } : current)}
                              className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                            />
                            <button
                              onClick={() => setSessionDraft((current) => current ? {
                                ...current,
                                exercises: current.exercises.filter((item) => item.id !== exercise.id),
                              } : current)}
                              className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => setSessionDraft((current) => current ? {
                              ...current,
                              exercises: current.exercises.map((item) => item.id === exercise.id ? { ...item, completed: !item.completed } : item),
                            } : current)}
                            className={`mt-3 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                              exercise.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
                            }`}
                          >
                            {exercise.completed ? 'Marcado como aplicado' : 'Marcar como aplicado'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[30px] bg-zinc-50 border border-zinc-200 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                      <div>
                        <h3 className="text-xl font-black text-zinc-900">Lista nominal</h3>
                        <p className="text-sm text-zinc-500 mt-1">Edite nomes, matriculas e confirme quem participou da aula.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-white border border-zinc-200 px-4 py-3 text-sm">
                          <span className="font-black text-zinc-900">{presentCount(sessionDraft)}</span>
                          <span className="text-zinc-500"> / {sessionDraft.expectedCount} presentes</span>
                        </div>
                        <button
                          onClick={() => setSessionDraft((current) => current ? {
                            ...current,
                            participants: [...current.participants, { id: createLocalId('participant'), name: '', badge: '', role: '', present: false, source: 'internal' }],
                          } : current)}
                          className="px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-colors"
                        >
                          Adicionar nome
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1 custom-scrollbar">
                      {sessionDraft.participants.map((participant) => (
                        <div key={participant.id} className="rounded-3xl bg-white border border-zinc-200 p-4">
                          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_180px_170px_120px_44px] gap-3">
                            <input
                              value={participant.name}
                              onChange={(event) => setSessionDraft((current) => current ? {
                                ...current,
                                participants: current.participants.map((item) => item.id === participant.id ? { ...item, name: event.target.value } : item),
                              } : current)}
                              placeholder="Nome"
                              className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                            />
                            <input
                              value={participant.badge}
                              onChange={(event) => setSessionDraft((current) => current ? {
                                ...current,
                                participants: current.participants.map((item) => item.id === participant.id ? { ...item, badge: event.target.value } : item),
                              } : current)}
                              placeholder="Matricula"
                              className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                            />
                            <input
                              value={participant.role}
                              onChange={(event) => setSessionDraft((current) => current ? {
                                ...current,
                                participants: current.participants.map((item) => item.id === participant.id ? { ...item, role: event.target.value } : item),
                              } : current)}
                              placeholder="Funcao"
                              className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                            />
                            <button
                              onClick={() => setSessionDraft((current) => current ? {
                                ...current,
                                participants: current.participants.map((item) =>
                                  item.id === participant.id
                                    ? { ...item, present: !item.present, lastCheckInAt: !item.present ? new Date().toISOString() : item.lastCheckInAt }
                                    : item,
                                ),
                              } : current)}
                              className={`rounded-2xl px-4 py-3 text-sm font-bold transition-colors ${
                                participant.present ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                              }`}
                            >
                              {participant.present ? 'Presente' : 'Marcar'}
                            </button>
                            <button
                              onClick={() => setSessionDraft((current) => current ? {
                                ...current,
                                participants: current.participants.filter((item) => item.id !== participant.id),
                              } : current)}
                              className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {(participant.feedbackScore || participant.feedbackComment || participant.favoriteExercise) && (
                            <div className="mt-3 rounded-2xl bg-zinc-50 border border-zinc-200 p-3 text-sm text-zinc-600">
                              <p>
                                <strong className="text-zinc-900">Feedback:</strong>{' '}
                                nota {participant.feedbackScore ?? '-'}
                                {participant.favoriteExercise ? ` · exercicio ${participant.favoriteExercise}` : ''}
                              </p>
                              {participant.feedbackComment && <p className="mt-1">{participant.feedbackComment}</p>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
          </AppModal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {scheduleDraft && (
          <AppModal
            title="Recorrencia da ginastica"
            description="Defina setor, turno, horario e base prevista para o calendario."
            icon={<CalendarDays size={20} />}
            onClose={() => setScheduleDraft(null)}
            maxWidthClassName="max-w-2xl"
            bodyClassName="p-8 space-y-5"
          >
            <div className="space-y-5">
                <label className="block space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Unidade</span>
                  <input
                    value={scheduleDraft.unitName}
                    onChange={(event) => setScheduleDraft((current) => current ? { ...current, unitName: event.target.value } : current)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Setor</span>
                  <input
                    value={scheduleDraft.sectorName}
                    onChange={(event) => setScheduleDraft((current) => current ? { ...current, sectorName: event.target.value } : current)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Turno</span>
                  <input
                    value={scheduleDraft.shiftName}
                    onChange={(event) => setScheduleDraft((current) => current ? { ...current, shiftName: event.target.value } : current)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                  />
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Dia da semana</span>
                    <select
                      value={scheduleDraft.dayOfWeek}
                      onChange={(event) => setScheduleDraft((current) => current ? { ...current, dayOfWeek: Number(event.target.value) } : current)}
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                    >
                      {DAY_LABELS.map((label, index) => (
                        <option key={label} value={index}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Horario</span>
                    <input
                      type="time"
                      value={scheduleDraft.startTime}
                      onChange={(event) => setScheduleDraft((current) => current ? { ...current, startTime: event.target.value } : current)}
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="block space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Duracao</span>
                    <input
                      type="number"
                      min={5}
                      value={scheduleDraft.durationMinutes}
                      onChange={(event) => setScheduleDraft((current) => current ? { ...current, durationMinutes: Number(event.target.value) || 5 } : current)}
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Base prevista</span>
                    <input
                      type="number"
                      min={1}
                      value={scheduleDraft.expectedCount}
                      onChange={(event) => setScheduleDraft((current) => current ? { ...current, expectedCount: Number(event.target.value) || 1 } : current)}
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Profissional</span>
                    <input
                      value={scheduleDraft.instructorName}
                      onChange={(event) => setScheduleDraft((current) => current ? { ...current, instructorName: event.target.value } : current)}
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500"
                    />
                  </label>
                </div>

                <div className="rounded-3xl bg-zinc-50 border border-zinc-200 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">Template atual</p>
                  <p className="text-sm font-bold text-zinc-900">{scheduleDraft.exercises.length} exercicios padrao</p>
                  <p className="text-sm text-zinc-500 mt-2">
                    Ajustes detalhados da sequencia podem ser feitos quando a turma do dia for aberta na operacao.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ModalButton
                    variant="primary"
                    onClick={saveScheduleDraft}
                    iconLeft={<Save size={16} />}
                    fullWidth
                  >
                    Salvar recorrencia
                  </ModalButton>
                  <ModalButton
                    variant="danger"
                    onClick={deleteScheduleDraft}
                    iconLeft={<Trash2 size={16} />}
                    fullWidth
                  >
                    Excluir
                  </ModalButton>
                </div>
              </div>
          </AppModal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRightDrawer && (
          <AppModal
            title="Checklist Fila de Links"
            description="Visao resumida da operação em andamento para hoje."
            icon={<LayoutList size={20} />}
            onClose={() => setShowRightDrawer(false)}
            maxWidthClassName="max-w-md"
            bodyClassName="p-0 border-t border-zinc-100"
          >
            <div className="bg-zinc-50 p-6 space-y-6">
              <div>
                <h3 className="text-lg font-black text-zinc-900">Checklist operacional</h3>
                <div className="space-y-3 mt-4">
                  {[
                    `${todaySessions.filter((session) => session.status === 'planned').length} turmas ainda precisam iniciar`,
                    `${todaySessions.filter((session) => session.externalShareToken).length} turmas com formulario externo pronto`,
                    `${todaySessions.filter((session) => presentCount(session) === 0).length} turmas sem presenca registrada`,
                  ].map((item) => (
                    <div key={item} className="rounded-xl bg-white border border-zinc-200 p-4 text-sm font-medium text-zinc-700 shadow-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-zinc-900">Fila de links externos</h3>
                <p className="text-xs text-zinc-500 mt-1">Registros de presenca e leitura remota.</p>
                <div className="space-y-4 mt-4">
                  {activeShares.length === 0 && (
                    <div className="rounded-xl bg-white border border-zinc-200 p-4 text-xs font-medium text-zinc-500">
                      Nenhum formulario ativo no momento.
                    </div>
                  )}
                  {activeShares.map((share) => {
                    const session = data.sessions.find((item) => item.id === share.sessionId);
                    if (!session) return null;
                    return (
                      <div key={share.token} className="rounded-xl bg-white border border-zinc-200 shadow-sm p-4 space-y-3">
                        <div>
                          <p className="font-bold text-sm text-zinc-900 leading-tight">{session.sectorName}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{session.shiftName} · {session.startTime}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-2.5">
                            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-400 mb-0.5">Respostas</p>
                            <p className="font-black text-zinc-900 leading-none">{share.submissions}</p>
                          </div>
                          <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-2.5">
                            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-400 mb-0.5">Acessos</p>
                            <p className="font-black text-zinc-900 leading-none">{share.opens}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => copyShareLink(share.token)}
                          className="w-full py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                        >
                          {copiedToken === share.token ? 'Link copiado' : 'Copiar link'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </AppModal>
        )}
      </AnimatePresence>
    </div>
  );
};
