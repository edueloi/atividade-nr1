import React, { useState } from "react";
import LogoBranco from "../../../images/LOGO-BRANCO-ATIVIDADE.png";
import { motion } from "motion/react";
import { Shield, User, ChevronRight, ArrowRight, Lock, Activity, HardHat, Eye, ShieldCheck } from "lucide-react";

interface LoginViewProps {
  tenants: any[];
  onLogin: (role: string, tenantId: string | null) => void;
}

export function LoginView({ tenants, onLogin }: LoginViewProps) {
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [view, setView] = useState<"initial" | "tenant" | "tenant_tecnico" | "tenant_client" | "tenant_auditor">("initial");

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side - Branding & Visual */}
      <div className="lg:w-1/2 bg-zinc-900 p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <img
              src={LogoBranco}
              alt="Logo"
              className="w-24 h-24 object-contain"
            />
          </div>
          <div className="max-w-md">
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[0.9] mb-8 tracking-tighter">
              GESTÃO <br />
              <span className="text-emerald-400">INTELIGENTE</span> <br />
              DE SAÚDE.
            </h1>
            <p className="text-zinc-400 text-lg font-medium leading-relaxed">
              A plataforma definitiva para engenharia de segurança, ergonomia e
              saúde ocupacional.
            </p>
          </div>
        </div>

        {/* ...removido bloco de avatares e texto de empresas... */}
      </div>

      {/* Right Side - Login Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-zinc-50">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 mb-2">
              Bem-vindo de volta
            </h2>
            <p className="text-zinc-500 font-medium">
              Selecione seu perfil de acesso para continuar.
            </p>
          </div>

          <div className="space-y-4">
            {view === "initial" ? (
              <>
                <button
                  onClick={() => onLogin("admin_atividade", null)}
                  className="w-full group p-6 bg-white border border-zinc-200 rounded-[32px] flex items-center gap-6 hover:border-zinc-900 hover:shadow-xl hover:shadow-zinc-200/50 transition-all text-left"
                >
                  <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Shield className="text-white" size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-zinc-900 text-lg">
                      Administrador
                    </h3>
                    <p className="text-zinc-500 text-sm">
                      Gestão global de contratos e usuários
                    </p>
                  </div>
                  <ChevronRight className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                </button>

                <button
                  onClick={() => setView("tenant")}
                  className="w-full group p-6 bg-white border border-zinc-200 rounded-[32px] flex items-center gap-6 hover:border-emerald-600 hover:shadow-xl hover:shadow-emerald-100/50 transition-all text-left"
                >
                  <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <User className="text-emerald-600" size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-zinc-900 text-lg">
                      Profissional
                    </h3>
                    <p className="text-zinc-500 text-sm">
                      Acesso operacional aos contratos
                    </p>
                  </div>
                  <ChevronRight className="text-zinc-300 group-hover:text-emerald-600 transition-colors" />
                </button>

                <button
                  onClick={() => setView("tenant_tecnico")}
                  className="w-full group p-6 bg-white border border-zinc-200 rounded-[32px] flex items-center gap-6 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-100/50 transition-all text-left"
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <HardHat className="text-blue-600" size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-zinc-900 text-lg">
                      Técnico SST
                    </h3>
                    <p className="text-zinc-500 text-sm">
                      Lançamento de dados — absenteísmo, presenças e queixas
                    </p>
                  </div>
                  <ChevronRight className="text-zinc-300 group-hover:text-blue-600 transition-colors" />
                </button>

                <button
                  onClick={() => setView("tenant_client")}
                  className="w-full group p-6 bg-white border border-zinc-200 rounded-[32px] flex items-center gap-6 hover:border-violet-600 hover:shadow-xl hover:shadow-violet-100/50 transition-all text-left"
                >
                  <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Eye className="text-violet-600" size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-zinc-900 text-lg">
                      Cliente
                    </h3>
                    <p className="text-zinc-500 text-sm">
                      Portal do cliente — dashboards e evidências
                    </p>
                  </div>
                  <ChevronRight className="text-zinc-300 group-hover:text-violet-600 transition-colors" />
                </button>

                <button
                  onClick={() => setView("tenant_auditor")}
                  className="w-full group p-6 bg-white border border-zinc-200 rounded-[32px] flex items-center gap-6 hover:border-amber-600 hover:shadow-xl hover:shadow-amber-100/50 transition-all text-left"
                >
                  <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="text-amber-600" size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-zinc-900 text-lg">
                      Auditor
                    </h3>
                    <p className="text-zinc-500 text-sm">
                      Auditoria — trilha, evidências e exportação
                    </p>
                  </div>
                  <ChevronRight className="text-zinc-300 group-hover:text-amber-600 transition-colors" />
                </button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setView("initial")}
                    className="text-sm font-bold text-zinc-400 hover:text-zinc-900 flex items-center gap-2"
                  >
                    <ArrowRight className="rotate-180 w-4 h-4" /> Voltar
                  </button>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    {view === 'tenant_tecnico' ? 'Técnico SST' : view === 'tenant_client' ? 'Cliente' : view === 'tenant_auditor' ? 'Auditor' : 'Profissional'} — Selecionar Contrato
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {tenants.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => onLogin(
                        view === 'tenant_tecnico' ? 'tecnico_sst' : 
                        view === 'tenant_client' ? 'client' : 
                        view === 'tenant_auditor' ? 'auditor' : 'professional', t.id
                      )}
                      className={`w-full p-5 bg-white border border-zinc-200 rounded-2xl flex items-center justify-between transition-all group ${
                        view === 'tenant_tecnico' ? 'hover:border-blue-600 hover:bg-blue-50/30' :
                        view === 'tenant_client' ? 'hover:border-violet-600 hover:bg-violet-50/30' :
                        view === 'tenant_auditor' ? 'hover:border-amber-600 hover:bg-amber-50/30' :
                        'hover:border-emerald-600 hover:bg-emerald-50/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                          <Activity
                            size={20}
                            className={`text-zinc-400 ${view === 'tenant_tecnico' ? 'group-hover:text-blue-600' : 'group-hover:text-emerald-600'}`}
                          />
                        </div>
                        <span className="font-bold text-zinc-700 group-hover:text-zinc-900">
                          {t.name}
                        </span>
                      </div>
                      <ChevronRight
                        size={16}
                        className={`text-zinc-300 ${view === 'tenant_tecnico' ? 'group-hover:text-blue-600' : 'group-hover:text-emerald-600'}`}
                      />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <Lock size={12} /> Conexão Segura SSL
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              v2.5.0
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
