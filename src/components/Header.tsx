import React, { useState } from 'react';
import { 
  Search, Plus, Bell, User, ChevronDown, 
  Settings, LogOut, UserCircle, Globe, 
  HelpCircle, Zap, FileText, Shield,
  AlertCircle, CheckCircle2, Clock,
  Stethoscope, Activity, ClipboardList,
  Calendar, QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Tenant {
  id: string;
  name: string;
}

interface UserData {
  id: string;
  name: string;
  role: string;
  tenantName?: string;
}

interface HeaderProps {
  activeTab: string;
  user: UserData;
  selectedTenant: Tenant | null;
  tenants: Tenant[];
  onSelectTenant: (tenant: Tenant) => void;
  onLogout: () => void;
  onQuickLaunch: () => void;
}

const tabNames: Record<string, string> = {
  home: 'Início',
  dashboard: 'Dash Mensal',
  strategic: 'Dash Estratégico',
  implementation: 'Dash Implantação',
  gym: 'Ginastica Laboral',
  physio: 'Fisioterapia',
  complaints: 'Queixas',
  absenteeism: 'Absenteísmo',
  nr1: 'NR1',
  ergo: 'Ergo Eng',
  admissional: 'Admissional',
  action_plans: 'Planos de Ação',
  evidence: 'Galeria de Evidências',
  campaigns: 'Campanhas',
  closing: 'Fechamento',
  reports: 'Relatórios',
  admin: 'Administração',
  admin_companies: 'Empresas',
  admin_users: 'Usuários & Acessos',
  admin_forms: 'Formulários Globais',
  admin_reports: 'Relatórios Consolidados',
  admin_audit: 'Auditoria / Logs',
  gro: 'GRO / PGR'
};

export function Header({ 
  activeTab, 
  user, 
  selectedTenant, 
  tenants, 
  onSelectTenant, 
  onLogout,
  onQuickLaunch 
}: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showTenantMenu, setShowTenantMenu] = useState(false);
  const [showAlertsMenu, setShowAlertsMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const today = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const capitalizedMonth = today.charAt(0).toUpperCase() + today.slice(1);

  const alerts = [
    { id: 1, title: 'Pendências de lançamento', desc: '2 registros aguardando conduta', time: 'há 2h', icon: <Clock className="w-4 h-4 text-amber-500" /> },
    { id: 2, title: 'Setores abaixo da meta', desc: 'Logística está com 72% de adesão', time: 'há 5h', icon: <AlertCircle className="w-4 h-4 text-rose-500" /> },
    { id: 3, title: 'Ciclo NR1', desc: 'Baixa adesão no ciclo atual', time: 'há 1d', icon: <Shield className="w-4 h-4 text-blue-500" /> },
  ];

  const createActions = [
    { id: 'complaint', label: 'Nova Queixa', icon: <AlertCircle className="w-4 h-4" />, color: 'text-rose-600 bg-rose-50' },
    { id: 'absenteeism', label: 'Novo Atestado', icon: <FileText className="w-4 h-4" />, color: 'text-amber-600 bg-amber-50' },
    { id: 'gym', label: 'Nova Ginastica Laboral', icon: <Activity className="w-4 h-4" />, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'admissional', label: 'Nova Avaliação', icon: <Stethoscope className="w-4 h-4" />, color: 'text-purple-600 bg-purple-50' },
    { id: 'physio', label: 'Novo Registro Fisio', icon: <Zap className="w-4 h-4" />, color: 'text-blue-600 bg-blue-50' },
  ];

  const getModuleSettings = () => {
    switch (activeTab) {
      case 'complaints': return [{ label: 'Configurar campos e catálogos', icon: <Settings className="w-4 h-4" /> }];
      case 'absenteeism': return [{ label: 'Regras de visibilidade', icon: <Shield className="w-4 h-4" /> }];
      case 'gym': return [{ label: 'Configurar turma e presenca', icon: <Zap className="w-4 h-4" /> }];
      case 'nr1': return [{ label: 'Configurar privacidade', icon: <Shield className="w-4 h-4" /> }];
      default: return [];
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-40 px-8 py-3 flex items-center justify-between shadow-sm">
      {/* Left: Breadcrumb + Context */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowTenantMenu(!showTenantMenu)}
            className="flex flex-col items-start group"
          >
            <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest group-hover:text-zinc-600 transition-colors">
              {selectedTenant?.name || 'Painel Global'} • Unidade Sorocaba
              <ChevronDown size={10} className={`transition-transform ${showTenantMenu ? 'rotate-180' : ''}`} />
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight text-zinc-900">
                {tabNames[activeTab] || 'Dashboard'}
              </h2>
              <span className="text-xs font-medium text-zinc-400 mt-1">
                ({capitalizedMonth})
              </span>
            </div>
          </button>

          <AnimatePresence>
            {showTenantMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowTenantMenu(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-zinc-100 p-2 z-20"
                >
                  <p className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Trocar Contrato</p>
                  {tenants.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSelectTenant(t);
                        setShowTenantMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        selectedTenant?.id === t.id ? 'bg-emerald-50 text-emerald-600' : 'text-zinc-600 hover:bg-zinc-50'
                      }`}
                    >
                      <Globe size={16} />
                      {t.name}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Center: Contextual Info (Optional) */}
      <div className="hidden lg:flex items-center gap-3">
        {/* Placeholder for active filter chips */}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Alerts */}
        <div className="relative">
          <button 
            onClick={() => setShowAlertsMenu(!showAlertsMenu)}
            className="p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all relative"
          >
            <Bell size={20} />
            <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>

          <AnimatePresence>
            {showAlertsMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowAlertsMenu(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden z-20"
                >
                  <div className="p-4 border-b border-zinc-50 bg-zinc-50/50 flex items-center justify-between">
                    <h3 className="font-bold text-zinc-900">Alertas</h3>
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">3 Novos</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto p-2">
                    {alerts.map(alert => (
                      <div key={alert.id} className="p-3 hover:bg-zinc-50 rounded-2xl transition-colors group">
                        <div className="flex gap-3">
                          <div className="mt-1">{alert.icon}</div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-zinc-900">{alert.title}</p>
                            <p className="text-xs text-zinc-500 mt-0.5">{alert.desc}</p>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-[10px] text-zinc-400 font-medium">{alert.time}</span>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-[10px] font-bold text-emerald-600 hover:underline">Ver</button>
                                <button className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600">Dispensar</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full p-4 text-xs font-bold text-zinc-400 hover:text-zinc-900 border-t border-zinc-50 transition-colors">
                    Ver todas as notificações
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Create Hub */}
        {selectedTenant && (
          <div className="relative">
            <button 
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="flex items-center justify-center w-10 h-10 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95"
            >
              <Plus size={20} />
            </button>

            <AnimatePresence>
              {showCreateMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowCreateMenu(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-zinc-100 p-2 z-20"
                  >
                    <p className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Lançamento Rápido</p>
                    <div className="space-y-1">
                      {createActions.map(action => (
                        <button
                          key={action.id}
                          onClick={() => {
                            onQuickLaunch();
                            setShowCreateMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-all group"
                        >
                          <div className={`p-2 rounded-xl transition-colors ${action.color}`}>
                            {action.icon}
                          </div>
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="h-6 w-px bg-zinc-200 mx-1" />

        {/* User Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 hover:bg-zinc-100 rounded-2xl transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center border border-zinc-200 shadow-sm overflow-hidden">
              <User size={18} className="text-zinc-400" />
            </div>
            <ChevronDown size={14} className={`text-zinc-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-72 bg-white rounded-[32px] shadow-2xl border border-zinc-100 overflow-hidden z-20"
                >
                  {/* User Profile Info */}
                  <div className="p-5 bg-zinc-50/50 border-b border-zinc-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                        <User size={24} className="text-zinc-400" />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900">{user.name}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{user.role}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 space-y-4">
                    {/* Section: Conta */}
                    <div>
                      <p className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Conta</p>
                      <div className="space-y-1">
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
                          <UserCircle size={16} /> Meu Perfil
                        </button>
                        <button 
                          onClick={() => {
                            setShowTenantMenu(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-all"
                        >
                          <Globe size={16} /> Trocar Contrato
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
                          <Settings size={16} /> Preferências
                        </button>
                      </div>
                    </div>

                    {/* Section: Configurações do Módulo (Contextual) */}
                    {getModuleSettings().length > 0 && (
                      <div>
                        <p className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Configurações do Módulo</p>
                        <div className="space-y-1">
                          {getModuleSettings().map((s, i) => (
                            <button key={i} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
                              {s.icon} {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section: Atalhos */}
                    <div>
                      <p className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Atalhos</p>
                      <div className="space-y-1">
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
                          <Clock size={16} /> Pendências do Mês
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
                          <FileText size={16} /> Relatórios
                        </button>
                      </div>
                    </div>

                    {/* Section: Ajuda & Sair */}
                    <div className="pt-2 border-t border-zinc-100">
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
                        <HelpCircle size={16} /> Ajuda & Suporte
                      </button>
                      <button 
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all"
                      >
                        <LogOut size={16} /> Sair
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
