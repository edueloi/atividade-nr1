import React from 'react';
import { 
  Settings, 
  Database, 
  ShieldCheck, 
  Bell, 
  ChevronRight, 
  Activity, 
  Stethoscope, 
  AlertCircle,
  Plus
} from 'lucide-react';

export function ComplaintsConfig() {
  const sections = [
    {
      title: 'Catálogos de Saúde',
      icon: Database,
      items: [
        { label: 'Estruturas Corporais', count: 24, desc: 'Mapeamento de regiões do corpo para registro.' },
        { label: 'Condutas Iniciais', count: 12, desc: 'Ações padrões sugeridas no momento do registro.' },
        { label: 'Fatores Prováveis', count: 8, desc: 'Causas raízes (postura, repetição, etc).' },
      ]
    },
    {
      title: 'Workflow e Regras',
      icon: Settings,
      items: [
        { label: 'Status do Caso', count: 6, desc: 'Definição do fluxo de vida de uma queixa.' },
        { label: 'Regras de Encaminhamento', count: 4, desc: 'Automação de destinos por severidade/tipo.' },
        { label: 'SLA de Triagem', count: '24h', desc: 'Tempo máximo para o primeiro atendimento.' },
      ]
    },
    {
      title: 'Segurança e Privacidade',
      icon: ShieldCheck,
      items: [
        { label: 'Anonimização de Dados', status: 'Ativo', desc: 'Regras para ocultar dados sensíveis do cliente.' },
        { label: 'Trilha de Auditoria', status: 'Ativo', desc: 'Registro de todas as alterações no módulo.' },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, i) => (
          <div key={i} className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <section.icon size={18} className="text-zinc-400" />
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{section.title}</h4>
            </div>
            <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="divide-y divide-zinc-100">
                {section.items.map((item, j) => (
                  <button key={j} className="w-full p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors text-left group">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-900">{item.label}</span>
                        {item.count !== undefined && (
                          <span className="px-1.5 py-0.5 bg-zinc-100 text-zinc-500 text-[10px] font-bold rounded-md">{item.count}</span>
                        )}
                        {item.status && (
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md">{item.status}</span>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-relaxed">{item.desc}</p>
                    </div>
                    <ChevronRight size={14} className="text-zinc-300 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
              <button className="w-full p-3 bg-zinc-50 text-[10px] font-bold text-zinc-500 hover:text-zinc-900 transition-colors border-t border-zinc-100 flex items-center justify-center gap-2">
                <Plus size={14} />
                Gerenciar Seção
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Notification Settings */}
      <div className="p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Bell size={20} />
          </div>
          <div>
            <h4 className="font-bold text-zinc-900">Alertas e Notificações</h4>
            <p className="text-xs text-zinc-500">Configure quem recebe avisos sobre novas queixas ou casos críticos.</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: 'Notificar Admin em Queixas Críticas', default: true },
            { label: 'Aviso de SLA de Triagem Expirado', default: true },
            { label: 'Resumo Semanal de Queixas por Setor', default: false },
            { label: 'Alerta de Alta Recorrência (Setor)', default: true },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 hover:bg-zinc-50 rounded-2xl transition-colors">
              <span className="text-sm font-medium text-zinc-700">{item.label}</span>
              <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${item.default ? 'bg-emerald-500' : 'bg-zinc-200'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${item.default ? 'right-1' : 'left-1'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
