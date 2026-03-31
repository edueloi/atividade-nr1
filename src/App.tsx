import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';

// Components
import { Sidebar } from './components/Sidebar.js';
import { Header } from './components/Header.js';
import { QuickLaunchModal } from './components/QuickLaunchModal.js';

// Modules
import { LoginView } from './modules/Auth/LoginView.js';
import { TenantSelectionView } from './modules/Auth/TenantSelection.js';
import { HomeView } from './modules/Home/HomeView.js';
import { MonthlyDashboardView } from './modules/Dashboard/MonthlyDashboard.js';
import { StrategicDashboardView } from './modules/Dashboard/StrategicDashboard.js';
import { ImplementationDashboardView } from './modules/Dashboard/ImplementationDashboard.js';
import { GymView } from './modules/Gym/GymView.js';
import { GymExternalForm } from './modules/Gym/GymExternalForm.js';
import { PhysioView } from './modules/Physio/PhysioView.js';
import { ComplaintsView } from './modules/Complaints/ComplaintsView.js';
import { NR1View } from './modules/NR1/NR1View.js';
import { ExternalForm } from './modules/NR1/ExternalForm.js';
import { ErgoEngView } from './modules/Ergo/ErgoEngView.js';
import { AdmissionalView } from './modules/Admissional/AdmissionalView.js';
import { AbsenteeismView } from './modules/Absenteeism/AbsenteeismView.js';
import { EvidenceView } from './modules/Evidence/EvidenceView.js';
import ActionPlansView from './modules/ActionPlans/ActionPlansView.js';
import { CampaignsView } from './modules/Campaigns/Campaigns.js';
import { ClosingView } from './modules/Gestao/ClosingView.js';
import { ReportsView } from './modules/Gestao/ReportsView.js';
import { AdminView } from './modules/Admin/AdminView.js';
import { AdminCompaniesView } from './modules/Admin/AdminCompaniesView.js';
import { AdminUsersView } from './modules/Admin/AdminUsersView.js';
import { AdminFormsView } from './modules/Admin/AdminFormsView.js';
import { AdminReportsView } from './modules/Admin/AdminReportsView.js';
import { AdminAuditView } from './modules/Admin/AdminAuditView.js';
import { GROView } from './modules/GRO/GROView.js';
import { fetchTenants } from './services/api.js';

// Types
type Role = 'admin_atividade' | 'professional' | 'tecnico_sst' | 'client' | 'auditor';

interface Tenant {
  id: string;
  name: string;
  logo_url?: string;
}

interface User {
  id: string;
  name: string;
  role: Role;
  tenantId?: string;
  tenantName?: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showQuickLaunch, setShowQuickLaunch] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [externalRoute, setExternalRoute] = useState<{ type: 'nr1' | 'gym'; token: string } | null>(null);

  // Check for external public routes
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/nr1/s/')) {
      const token = path.split('/').pop();
      if (token) setExternalRoute({ type: 'nr1', token });
      return;
    }

    if (path.startsWith('/gym/s/')) {
      const token = path.split('/').pop();
      if (token) setExternalRoute({ type: 'gym', token });
    }
  }, []);

  useEffect(() => {
    const loadTenants = async () => {
      try {
        const result: Tenant[] = await fetchTenants();
        setTenants(result);
      } catch (error) {
        console.error('Erro ao carregar contratos:', error);
        setTenants([
          { id: 'toyota-br', name: 'Toyota Brasil' },
          { id: 'usina-pilon', name: 'Usina Pilon' }
        ]);
      }
    };

    loadTenants();
  }, []);

  const handleLogin = (role: string, tenantId: string | null) => {
    const tenant = tenants.find(t => t.id === tenantId);
    const nameMap: Record<string, string> = {
      admin_atividade: 'Admin Atividade',
      professional: 'Ricardo Prof',
      tecnico_sst: 'Carlos Técnico',
      client: 'Eng. Carlos (Cliente)',
      auditor: 'Auditor Externo',
    };
    (window as any).__atividade_role = role;
    setUser({
      id: 'user-1',
      name: nameMap[role] || role,
      role: role as Role,
      tenantId: tenantId || undefined,
      tenantName: tenant?.name
    });
    
    if (role === 'admin_atividade' && !tenantId) {
      setActiveTab('admin');
    } else if (tenant) {
      setSelectedTenant(tenant);
      setActiveTab('home');
    }
  };

  const handleAddTenant = (newTenant: Tenant) => {
    setTenants(prev => [...prev, newTenant]);
  };

  const handleLogout = () => {
    (window as any).__atividade_role = null;
    setUser(null);
    setSelectedTenant(null);
    setActiveTab('home');
  };

  const handleBackToAdmin = () => {
    setSelectedTenant(null);
    setActiveTab('admin');
  };

  if (externalRoute?.type === 'nr1') {
    return <ExternalForm token={externalRoute.token} />;
  }

  if (externalRoute?.type === 'gym') {
    return <GymExternalForm token={externalRoute.token} />;
  }

  if (!user) {
    return <LoginView tenants={tenants} onLogin={handleLogin} />;
  }

  const currentTenantName = selectedTenant?.name || user.tenantName || (user.role === 'admin_atividade' ? 'Painel Global' : 'Atividade Laboral');

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      <Sidebar 
        collapsed={isSidebarCollapsed} 
        setCollapsed={setIsSidebarCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={user.role}
        selectedTenant={selectedTenant}
        onLogout={handleLogout}
        onBackToAdmin={user.role === 'admin_atividade' && selectedTenant ? handleBackToAdmin : undefined}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          activeTab={activeTab}
          user={user}
          selectedTenant={selectedTenant}
          tenants={tenants}
          onSelectTenant={setSelectedTenant}
          onLogout={handleLogout}
          onQuickLaunch={() => setShowQuickLaunch(true)} 
        />

        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {/* Tenant isolation badge */}
          {user.role === 'admin_atividade' && selectedTenant && (
            <div className="mb-6 px-5 py-3 bg-zinc-900 text-white rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm font-bold">Visualizando dados isolados de: <strong>{selectedTenant.name}</strong></span>
              </div>
              <button onClick={handleBackToAdmin} className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                Voltar ao Painel Global
              </button>
            </div>
          )}

          {/* Read-only banners */}
          {user.role === 'client' && (
            <div className="mb-6 px-5 py-3 bg-violet-600 text-white rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span className="text-sm font-bold">SOMENTE LEITURA — Portal do Cliente · {selectedTenant?.name}</span>
            </div>
          )}
          {user.role === 'auditor' && (
            <div className="mb-6 px-5 py-3 bg-amber-500 text-white rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span className="text-sm font-bold">MODO AUDITOR — Somente Exportação · {selectedTenant?.name}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === 'home' && <HomeView key="home" />}
            {activeTab === 'dashboard' && <MonthlyDashboardView key="dashboard" />}
            {activeTab === 'strategic' && selectedTenant && (
              <StrategicDashboardView 
                key="strategic" 
                tenant={selectedTenant} 
                role={user.role} 
              />
            )}
            {activeTab === 'implementation' && <ImplementationDashboardView key="implementation" />}
            {activeTab === 'gym' && selectedTenant && (
              <GymView 
                key="gym" 
                tenant={selectedTenant} 
                user={user} 
              />
            )}
            {activeTab === 'physio' && <PhysioView key="physio" />}
            {activeTab === 'complaints' && <ComplaintsView key="complaints" />}
            {activeTab === 'absenteeism' && selectedTenant && (
              <AbsenteeismView 
                key="absenteeism" 
                tenant={selectedTenant} 
                user={user} 
              />
            )}
            {activeTab === 'nr1' && <NR1View key="nr1" />}
            {activeTab === 'ergo' && <ErgoEngView key="ergo" />}
            {activeTab === 'admissional' && selectedTenant && (
              <AdmissionalView 
                key="admissional" 
                tenant={selectedTenant} 
                user={user} 
              />
            )}
            {activeTab === 'action_plans' && <ActionPlansView key="action_plans" />}
            {activeTab === 'evidence' && <EvidenceView key="evidence" />}
            {activeTab === 'campaigns' && <CampaignsView key="campaigns" />}
            {activeTab === 'gro' && selectedTenant && (
              <GROView tenant={selectedTenant} user={user} />
            )}
            {activeTab === 'closing' && selectedTenant && (
              <ClosingView 
                key="closing" 
                tenant={selectedTenant} 
                user={user} 
              />
            )}
            {activeTab === 'reports' && selectedTenant && (
              <ReportsView 
                key="reports" 
                tenant={selectedTenant} 
                user={user} 
              />
            )}
            {activeTab === 'admin' && (
              <AdminView 
                key="admin" 
                tenants={tenants} 
                onSelectTenant={(t) => {
                  setSelectedTenant(t);
                  setActiveTab('home');
                }} 
              />
            )}
            {activeTab === 'admin_companies' && (
              <AdminCompaniesView
                key="admin_companies"
                tenants={tenants as any}
                onAddTenant={handleAddTenant}
                onSelectTenant={(t) => {
                  setSelectedTenant(t);
                  setActiveTab('home');
                }}
              />
            )}
            {activeTab === 'admin_users' && <AdminUsersView key="admin_users" tenants={tenants as any} />}
            {activeTab === 'admin_forms' && <AdminFormsView key="admin_forms" tenants={tenants as any} />}
            {activeTab === 'admin_reports' && <AdminReportsView key="admin_reports" tenants={tenants as any} />}
            {activeTab === 'admin_audit' && <AdminAuditView key="admin_audit" tenants={tenants as any} />}
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {showQuickLaunch && (
          <QuickLaunchModal onClose={() => setShowQuickLaunch(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
