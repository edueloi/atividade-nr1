import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, AlertCircle, AlertTriangle, Info, Settings2 } from 'lucide-react';
import { ClosingRule, IssueSeverity } from './types';

interface ClosingValidationsProps {
  rules: ClosingRule[];
  onToggleRule: (id: string) => void;
  onUpdateSeverity: (id: string, severity: IssueSeverity) => void;
}

export const ClosingValidations: React.FC<ClosingValidationsProps> = ({
  rules,
  onToggleRule,
  onUpdateSeverity
}) => {
  const getSeverityColor = (severity: IssueSeverity) => {
    switch (severity) {
      case 'CRITICAL': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'IMPORTANT': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'INFO': return 'text-zinc-500 bg-zinc-50 border-zinc-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-zinc-200">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">Regras de Validação</h2>
            <p className="text-sm text-zinc-500">Defina quais pendências bloqueiam o fechamento do mês.</p>
          </div>
        </div>
        <button className="p-3 bg-white border border-zinc-200 rounded-2xl text-zinc-400 hover:text-zinc-900 transition-all">
          <Settings2 size={24} />
        </button>
      </div>

      <div className="bg-white rounded-[48px] border border-zinc-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-zinc-100">
          {rules.map((rule) => (
            <div key={rule.id} className="p-8 flex items-center justify-between group hover:bg-zinc-50/50 transition-all">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-bold text-zinc-900">{rule.label}</h4>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase border ${getSeverityColor(rule.severity)}`}>
                    {rule.severity === 'CRITICAL' ? 'Crítica' : rule.severity === 'IMPORTANT' ? 'Importante' : 'Informativa'}
                  </span>
                </div>
                <p className="text-sm text-zinc-500 max-w-xl leading-relaxed">{rule.description}</p>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Severidade</span>
                  <div className="flex bg-zinc-100 p-1 rounded-xl">
                    {(['CRITICAL', 'IMPORTANT', 'INFO'] as IssueSeverity[]).map((s) => (
                      <button 
                        key={s}
                        onClick={() => onUpdateSeverity(rule.id, s)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                          rule.severity === s ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'
                        }`}
                      >
                        {s.substring(0, 4)}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => onToggleRule(rule.id)}
                  className={`relative w-14 h-8 rounded-full transition-all ${rule.is_enabled ? 'bg-emerald-500' : 'bg-zinc-200'}`}
                >
                  <motion.div 
                    animate={{ x: rule.is_enabled ? 28 : 4 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 bg-zinc-900 text-white rounded-[40px] shadow-xl shadow-zinc-200 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-emerald-400">
            <Info size={28} />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold">Dica de Configuração</h4>
            <p className="text-sm text-zinc-400 max-w-md">Regras marcadas como <span className="text-rose-400 font-bold">Críticas</span> impedem totalmente o fechamento se houver pendências abertas.</p>
          </div>
        </div>
        <button className="px-8 py-3 bg-zinc-800 text-white rounded-2xl font-bold text-sm hover:bg-zinc-700 transition-all">
          Saber Mais
        </button>
      </div>
    </div>
  );
};
