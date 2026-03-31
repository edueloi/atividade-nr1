import React from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard, ClipboardCheck, Stethoscope,
  BrainCircuit, Clock, FileImage,
  Target, Megaphone, Settings, ChevronLeft,
  ChevronRight, LogOut, Briefcase, Home,
  Rocket, HardHat, UserCheck, FileCheck,
  FileDown, ShieldAlert,
  Activity, Building2, Users, FileText, BarChart3, ScrollText
} from 'lucide-react';
import LogoMenu from '../../images/logo.png';
import { NavItem } from './NavItem.js';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string;
  selectedTenant: any | null;
  onLogout: () => void;
  onBackToAdmin?: () => void;
}

export function Sidebar({ collapsed, setCollapsed, activeTab, setActiveTab, userRole, selectedTenant, onLogout, onBackToAdmin }: SidebarProps) {
  const isGlobalPanel = userRole === 'admin_atividade' && !selectedTenant;
  const isTecnicoSST = userRole === 'tecnico_sst';

  return (
    <motion.aside 
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className="bg-white border-r border-zinc-200 flex flex-col h-screen sticky top-0 z-50 shadow-sm"
    >
      <div className="p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center justify-center w-full">
              <img src={LogoMenu} alt="Logo" className="w-[104px] h-[104px] object-contain" />
            </div>
          )}
          {collapsed && (
            <div className="flex items-center justify-center mx-auto">
              <img src={LogoMenu} alt="Logo" className="w-20 h-20 object-contain" />
            </div>
          )}
        </div>

        {onBackToAdmin && !collapsed && (
          <button 
            onClick={onBackToAdmin}
            className="w-full p-3 bg-zinc-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
          >
            <ShieldAlert size={14} />
            Painel Admin
          </button>
        )}
        {onBackToAdmin && collapsed && (
          <button 
            onClick={onBackToAdmin}
            className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center mx-auto hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
            title="Voltar ao Painel Admin"
          >
            <ShieldAlert size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 px-4 py-4 space-y-8 overflow-y-auto custom-scrollbar">
        {/* INÍCIO */}
        <div>
          {!collapsed && <p className="px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Início</p>}
          <NavItem 
            icon={<Home size={20} />} 
            label="Visão Geral" 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
            collapsed={collapsed}
          />
        </div>

        {/* DASHBOARDS */}
        {!isGlobalPanel && !isTecnicoSST && (
          <div>
            {!collapsed && <p className="px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Dashboards</p>}
            <NavItem 
              icon={<LayoutDashboard size={20} />} 
              label="Dash Mensal" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
              collapsed={collapsed}
            />
            <NavItem 
              icon={<Target size={20} />} 
              label="Dash Estratégico" 
              active={activeTab === 'strategic'} 
              onClick={() => setActiveTab('strategic')} 
              collapsed={collapsed}
            />
            <NavItem 
              icon={<Rocket size={20} />} 
              label="Dash Implantação" 
              active={activeTab === 'implementation'} 
              onClick={() => setActiveTab('implementation')} 
              collapsed={collapsed}
            />
          </div>
        )}

        {/* LANÇAMENTOS */}
        {!isGlobalPanel && (
          <div>
            {!collapsed && <p className="px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Lançamentos</p>}
            <NavItem 
              icon={<ClipboardCheck size={20} />} 
              label="Aula + Presença" 
              active={activeTab === 'gym'} 
              onClick={() => setActiveTab('gym')} 
              collapsed={collapsed}
            />
            {!isTecnicoSST && (
              <NavItem 
                icon={<Stethoscope size={20} />} 
                label="Fisioterapia" 
                active={activeTab === 'physio'} 
                onClick={() => setActiveTab('physio')} 
                collapsed={collapsed}
              />
            )}
            <NavItem 
              icon={<Activity size={20} />} 
              label="Queixas" 
              active={activeTab === 'complaints'} 
              onClick={() => setActiveTab('complaints')} 
              collapsed={collapsed}
            />
            <NavItem 
              icon={<Clock size={20} />} 
              label="Absenteísmo" 
              active={activeTab === 'absenteeism'} 
              onClick={() => setActiveTab('absenteeism')} 
              collapsed={collapsed}
            />
            {!isTecnicoSST && (
              <>
                <NavItem 
                  icon={<BrainCircuit size={20} />} 
                  label="NR1 Psicossocial" 
                  active={activeTab === 'nr1'} 
                  onClick={() => setActiveTab('nr1')} 
                  collapsed={collapsed}
                />
                <NavItem 
                  icon={<HardHat size={20} />} 
                  label="Ergonomia / Eng" 
                  active={activeTab === 'ergo'} 
                  onClick={() => setActiveTab('ergo')} 
                  collapsed={collapsed}
                />
              </>
            )}
            <NavItem 
              icon={<UserCheck size={20} />} 
              label="Admissional" 
              active={activeTab === 'admissional'} 
              onClick={() => setActiveTab('admissional')} 
              collapsed={collapsed}
            />
          </div>
        )}

        {/* GESTÃO */}
        {!isGlobalPanel && !isTecnicoSST && (
          <div>
            {!collapsed && <p className="px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Gestão</p>}
            <NavItem 
              icon={<Briefcase size={20} />} 
              label="Plano de Ação" 
              active={activeTab === 'action_plans'} 
              onClick={() => setActiveTab('action_plans')} 
              collapsed={collapsed}
            />
            <NavItem 
              icon={<FileImage size={20} />} 
              label="Evidências" 
              active={activeTab === 'evidence'} 
              onClick={() => setActiveTab('evidence')} 
              collapsed={collapsed}
            />
            <NavItem 
              icon={<Megaphone size={20} />} 
              label="Campanhas" 
              active={activeTab === 'campaigns'} 
              onClick={() => setActiveTab('campaigns')} 
              collapsed={collapsed}
            />
            <NavItem 
              icon={<FileCheck size={20} />} 
              label="Fechamento" 
              active={activeTab === 'closing'} 
              onClick={() => setActiveTab('closing')} 
              collapsed={collapsed}
            />
            <NavItem 
              icon={<FileDown size={20} />} 
              label="Relatórios" 
              active={activeTab === 'reports'} 
              onClick={() => setActiveTab('reports')} 
              collapsed={collapsed}
            />
          </div>
        )}

        {/* ADMIN */}
        {userRole === 'admin_atividade' && (
          <div>
            {!collapsed && <p className="px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Admin</p>}
            <NavItem 
              icon={<LayoutDashboard size={20} />} 
              label="Visão Geral" 
              active={activeTab === 'admin'} 
              onClick={() => setActiveTab('admin')} 
              collapsed={collapsed}
            />
            {isGlobalPanel && (
              <>
                <NavItem 
                  icon={<Building2 size={20} />} 
                  label="Empresas" 
                  active={activeTab === 'admin_companies'} 
                  onClick={() => setActiveTab('admin_companies')} 
                  collapsed={collapsed}
                />
                <NavItem 
                  icon={<Users size={20} />} 
                  label="Usuários & Acessos" 
                  active={activeTab === 'admin_users'} 
                  onClick={() => setActiveTab('admin_users')} 
                  collapsed={collapsed}
                />
                <NavItem 
                  icon={<FileText size={20} />} 
                  label="Formulários Globais" 
                  active={activeTab === 'admin_forms'} 
                  onClick={() => setActiveTab('admin_forms')} 
                  collapsed={collapsed}
                />
                <NavItem 
                  icon={<BarChart3 size={20} />} 
                  label="Relatórios" 
                  active={activeTab === 'admin_reports'} 
                  onClick={() => setActiveTab('admin_reports')} 
                  collapsed={collapsed}
                />
                <NavItem 
                  icon={<ScrollText size={20} />} 
                  label="Auditoria / Logs" 
                  active={activeTab === 'admin_audit'} 
                  onClick={() => setActiveTab('admin_audit')} 
                  collapsed={collapsed}
                />
              </>
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-zinc-100">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-3 hover:bg-zinc-50 rounded-xl text-zinc-400 transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <div className="flex items-center gap-2 font-bold text-xs uppercase"><ChevronLeft size={16} /> Recolher</div>}
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center p-3 hover:bg-red-50 rounded-xl text-red-400 transition-colors mt-2"
        >
          {collapsed ? <LogOut size={20} /> : <div className="flex items-center gap-2 font-bold text-xs uppercase"><LogOut size={16} /> Sair</div>}
        </button>
      </div>
    </motion.aside>
  );
}
