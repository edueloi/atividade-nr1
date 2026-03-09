import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, ShieldCheck, Camera, 
  BarChart3, FileArchive, Check,
  Calendar, MapPin, Layers, Lock,
  Info
} from 'lucide-react';
import { ReportType, ReportFormat } from './reportsTypes';

interface ReportsBuilderProps {
  onGenerate: (params: any) => void;
  initialType?: ReportType;
}

export const ReportsBuilder: React.FC<ReportsBuilderProps> = ({ onGenerate, initialType }) => {
  const [type, setType] = useState<ReportType>(initialType || 'EXECUTIVE');
  const [month, setMonth] = useState('2026-03');
  const [unit, setUnit] = useState('unit-1');
  const [sector, setSector] = useState('');
  const [format, setFormat] = useState<ReportFormat>('PDF');
  const [modules, setModules] = useState<string[]>([
    'GYM', 'PHYSIO', 'ABSENTEEISM', 'NR1', 'ERGO', 'ADMISSIONAL', 'CAMPAIGNS', 'ACTION_PLANS', 'EVIDENCE'
  ]);
  const [privacy, setPrivacy] = useState({
    aggregatedOnly: true,
    hideSensitiveAttachments: true,
    minResponsesNR1: 5,
    hideOpenTextNR1: true
  });

  const reportTypes = [
    { id: 'EXECUTIVE', label: 'Executivo', sub: 'Diretoria / Cliente', desc: 'Agregado, sem dados sensíveis, visão macro.', icon: <TrendingUp size={24} />, color: 'emerald' },
    { id: 'TECHNICAL', label: 'Técnico', sub: 'SESMT / Auditoria', desc: 'Detalhamento por setor + plano de ação + trilha.', icon: <ShieldCheck size={24} />, color: 'blue' },
    { id: 'AUDIT', label: 'Auditoria', sub: 'NR1 + Evidências', desc: 'Pacote robusto para auditoria externa.', icon: <FileArchive size={24} />, color: 'purple' },
    { id: 'CSV', label: 'CSV Indicadores', sub: 'Dados para BI', desc: 'Dados agregados tabulares para exportação.', icon: <BarChart3 size={24} />, color: 'amber' },
    { id: 'ZIP', label: 'ZIP Evidências', sub: 'Arquivos Brutos', desc: 'Fotos e PDFs organizados por pasta.', icon: <Camera size={24} />, color: 'rose' },
  ];

  const availableModules = [
    { id: 'GYM', label: 'Aula + Presença' },
    { id: 'PHYSIO', label: 'Fisioterapia' },
    { id: 'COMPLAINTS', label: 'Queixas' },
    { id: 'ABSENTEEISM', label: 'Absenteísmo' },
    { id: 'ERGO', label: 'Ergonomia / Eng' },
    { id: 'NR1', label: 'NR1 Psicossocial' },
    { id: 'ADMISSIONAL', label: 'Admissional' },
    { id: 'CAMPAIGNS', label: 'Campanhas' },
    { id: 'ACTION_PLANS', label: 'Plano de Ação' },
    { id: 'EVIDENCE', label: 'Evidências' },
  ];

  const handleToggleModule = (id: string) => {
    setModules(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      type,
      month,
      unit,
      sector,
      format,
      modules,
      privacy
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-20">
      {/* 1. Select Type */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 ml-1">
          <Layers className="text-zinc-400" size={20} />
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">1. Seleção do Tipo de Relatório</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {reportTypes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setType(t.id as ReportType)}
              className={`p-6 rounded-[32px] border-2 transition-all text-left relative group ${
                type === t.id ? 'border-zinc-900 bg-zinc-900 text-white shadow-xl' : 'border-zinc-100 bg-white hover:border-zinc-200'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                type === t.id ? 'bg-white/10 text-white' : `bg-${t.color}-50 text-${t.color}-600`
              }`}>
                {t.icon}
              </div>
              <h4 className="font-black text-sm uppercase tracking-wider mb-1">{t.label}</h4>
              <p className={`text-[10px] font-medium leading-relaxed ${type === t.id ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {t.desc}
              </p>
              {type === t.id && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3 ml-1">
            <Calendar className="text-zinc-400" size={20} />
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">2. Parâmetros Básicos</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Mês de Referência</label>
              <select 
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 font-bold text-sm"
              >
                <option value="2026-03">Março 2026</option>
                <option value="2026-02">Fevereiro 2026</option>
                <option value="2026-01">Janeiro 2026</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Formato</label>
              <select 
                value={format}
                onChange={(e) => setFormat(e.target.value as ReportFormat)}
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 font-bold text-sm"
              >
                <option value="PDF">PDF (Documento)</option>
                <option value="CSV">CSV (Planilha)</option>
                <option value="ZIP">ZIP (Arquivos)</option>
                <option value="XLSX">Excel (.xlsx)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Unidade</label>
              <select 
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 font-bold text-sm"
              >
                <option value="unit-1">Unidade Matriz</option>
                <option value="unit-2">Filial Sul</option>
                <option value="all">Todas as Unidades</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Setor (Opcional)</label>
              <select 
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 font-bold text-sm"
              >
                <option value="">Todos os Setores</option>
                <option value="adm">Administrativo</option>
                <option value="prod">Produção</option>
                <option value="log">Logística</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 ml-1">
            <Lock className="text-zinc-400" size={20} />
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">3. Privacidade & Filtros</h3>
          </div>
          <div className="p-8 bg-zinc-50 border border-zinc-200 rounded-[40px] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-zinc-900">Somente dados agregados</p>
                <p className="text-[10px] text-zinc-500">Oculta nomes e CPFs individuais.</p>
              </div>
              <button 
                type="button"
                onClick={() => setPrivacy({ ...privacy, aggregatedOnly: !privacy.aggregatedOnly })}
                className={`w-12 h-6 rounded-full transition-all relative ${privacy.aggregatedOnly ? 'bg-emerald-500' : 'bg-zinc-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${privacy.aggregatedOnly ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-zinc-900">Ocultar anexos sensíveis</p>
                <p className="text-[10px] text-zinc-500">Remove atestados e laudos médicos do ZIP.</p>
              </div>
              <button 
                type="button"
                onClick={() => setPrivacy({ ...privacy, hideSensitiveAttachments: !privacy.hideSensitiveAttachments })}
                className={`w-12 h-6 rounded-full transition-all relative ${privacy.hideSensitiveAttachments ? 'bg-emerald-500' : 'bg-zinc-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${privacy.hideSensitiveAttachments ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-zinc-900">Anonimato NR1</p>
                <p className="text-[10px] text-zinc-500">Ocultar campos de texto aberto.</p>
              </div>
              <button 
                type="button"
                onClick={() => setPrivacy({ ...privacy, hideOpenTextNR1: !privacy.hideOpenTextNR1 })}
                className={`w-12 h-6 rounded-full transition-all relative ${privacy.hideOpenTextNR1 ? 'bg-emerald-500' : 'bg-zinc-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${privacy.hideOpenTextNR1 ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <div className="space-y-2 pt-2 border-t border-zinc-100">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Mínimo de Respostas (NR1)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="3" 
                  max="20" 
                  value={privacy.minResponsesNR1}
                  onChange={(e) => setPrivacy({ ...privacy, minResponsesNR1: parseInt(e.target.value) })}
                  className="flex-1 accent-zinc-900"
                />
                <span className="w-10 h-10 bg-white border border-zinc-200 rounded-xl flex items-center justify-center font-black text-xs text-zinc-900 shadow-sm">
                  {privacy.minResponsesNR1}
                </span>
              </div>
              <p className="text-[9px] text-zinc-400 italic">O setor só aparece no relatório se houver pelo menos este número de respostas.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Modules */}
      <div className="space-y-6">
        <div className="flex items-center justify-between ml-1">
          <div className="flex items-center gap-3">
            <Layers className="text-zinc-400" size={20} />
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">4. Módulos a Incluir</h3>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setModules(availableModules.map(m => m.id))} className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-900">Selecionar Todos</button>
            <button type="button" onClick={() => setModules([])} className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-900">Limpar</button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {availableModules.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => handleToggleModule(m.id)}
              className={`p-6 rounded-3xl border-2 transition-all flex items-center gap-4 ${
                modules.includes(m.id) ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-100 bg-white hover:border-zinc-200 text-zinc-600'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                modules.includes(m.id) ? 'bg-emerald-500' : 'bg-zinc-100'
              }`}>
                {modules.includes(m.id) && <Check size={14} className="text-white" />}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-md border-t border-zinc-100 flex items-center justify-center gap-4 z-50">
        <button type="button" className="px-10 py-4 bg-white border border-zinc-200 text-zinc-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-50 transition-all">
          Cancelar
        </button>
        <button 
          type="submit"
          className="px-12 py-4 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 shadow-xl shadow-zinc-200 transition-all flex items-center gap-3"
        >
          <FileText size={18} /> Gerar Relatório
        </button>
      </div>
    </form>
  );
};

// Helper component for icons
function TrendingUp({ size }: { size: number }) {
  return <BarChart3 size={size} />;
}
