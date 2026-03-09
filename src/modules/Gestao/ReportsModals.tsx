import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Share2, Shield, Calendar, 
  Copy, CheckCircle2, AlertCircle,
  FileText, Download, Eye, RefreshCw, Star
} from 'lucide-react';
import { ReportJob, ReportTemplate } from './reportsTypes';

interface ShareModalProps {
  job: ReportJob;
  onClose: () => void;
  onShare: (data: any) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ job, onClose, onShare }) => {
  const [expiresIn, setExpiresIn] = useState('7');
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  const handleGenerate = () => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn));
    
    // In a real app, this would call the API
    const token = Math.random().toString(36).substring(2, 15);
    setGeneratedToken(token);
    onShare({
      report_id: job.id,
      report_name: job.name,
      expires_at: expiresAt.toISOString(),
      has_password: hasPassword,
      password: hasPassword ? password : null
    });
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-[48px] w-full max-w-lg overflow-hidden shadow-2xl border border-zinc-200"
      >
        <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Share2 size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-zinc-900 tracking-tight">Compartilhar Relatório</h3>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Link Seguro & Temporário</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 text-zinc-400 hover:text-zinc-900 hover:bg-white rounded-2xl transition-all shadow-sm">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {!generatedToken ? (
            <>
              <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                <p className="text-xs font-bold text-zinc-900 mb-1">{job.name}</p>
                <p className="text-[10px] text-zinc-500">{job.type} • {new Date(job.created_at).toLocaleDateString()}</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Expiração do Link</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['7', '15', '30'].map((days) => (
                      <button 
                        key={days}
                        onClick={() => setExpiresIn(days)}
                        className={`py-3 rounded-2xl text-xs font-bold transition-all border ${expiresIn === days ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-900'}`}
                      >
                        {days} Dias
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <div className="flex items-center gap-3">
                      <Shield size={18} className={hasPassword ? 'text-emerald-500' : 'text-zinc-400'} />
                      <div>
                        <p className="text-xs font-bold text-zinc-900">Proteção por Senha</p>
                        <p className="text-[10px] text-zinc-500">Exigir senha para visualizar.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setHasPassword(!hasPassword)}
                      className={`w-12 h-6 rounded-full transition-all relative ${hasPassword ? 'bg-emerald-500' : 'bg-zinc-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${hasPassword ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  {hasPassword && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                      <input 
                        type="password" 
                        placeholder="Defina uma senha forte..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-6 py-4 bg-white border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                      />
                    </motion.div>
                  )}
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                className="w-full py-5 bg-zinc-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20 active:scale-[0.98]"
              >
                Gerar Link Seguro
              </button>
            </>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h4 className="text-2xl font-black text-zinc-900">Link Gerado!</h4>
                <p className="text-zinc-500 text-sm">O link expira em {expiresIn} dias.</p>
              </div>
              <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-200 flex items-center justify-between gap-4 group">
                <code className="text-xs font-mono text-zinc-600 truncate">{`https://atividade.app/s/${generatedToken}`}</code>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`https://atividade.app/s/${generatedToken}`);
                    alert('Link copiado!');
                  }}
                  className="p-3 bg-white text-zinc-900 rounded-xl hover:bg-zinc-900 hover:text-white transition-all shadow-sm"
                >
                  <Copy size={16} />
                </button>
              </div>
              <button 
                onClick={onClose}
                className="w-full py-4 bg-zinc-100 text-zinc-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all"
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

interface PreviewModalProps {
  job: ReportJob;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ job, onClose }) => {
  return (
    <div className="fixed inset-0 bg-zinc-900/80 backdrop-blur-md z-50 flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-[48px] w-full max-w-5xl h-full overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Eye size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-zinc-900 tracking-tight">Visualização do Relatório</h3>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{job.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-6 py-3 bg-zinc-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-lg shadow-zinc-900/20">
              <Download size={16} /> Baixar PDF
            </button>
            <button onClick={onClose} className="p-3 text-zinc-400 hover:text-zinc-900 hover:bg-white rounded-2xl transition-all shadow-sm">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-zinc-200 p-8 overflow-y-auto flex justify-center">
          {/* Mock PDF View */}
          <div className="w-[800px] bg-white shadow-2xl rounded-sm p-16 space-y-12 min-h-[1100px]">
            <div className="flex justify-between items-start border-b-4 border-zinc-900 pb-8">
              <div>
                <h1 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">Relatório {job.type}</h1>
                <p className="text-zinc-500 font-bold">Competência: {job.params.month}</p>
              </div>
              <div className="w-24 h-24 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-300 font-black text-xs">LOGO</div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Participação</p>
                <p className="text-3xl font-black text-zinc-900">84.2%</p>
              </div>
              <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Queixas</p>
                <p className="text-3xl font-black text-zinc-900">142</p>
              </div>
              <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Afastamentos</p>
                <p className="text-3xl font-black text-zinc-900">12</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-black text-zinc-900 border-l-4 border-emerald-500 pl-4 uppercase tracking-tight">Resumo Executivo</h2>
              <p className="text-zinc-600 leading-relaxed">
                Durante o período de {job.params.month}, observamos uma estabilidade nos indicadores de saúde ocupacional. 
                A adesão às aulas de ginástica laboral manteve-se acima da meta de 80%, com destaque para o setor de Montagem Cross.
                As queixas osteomusculares concentram-se majoritariamente na região lombar (42%), sugerindo a necessidade de reforço nas pausas ativas.
              </p>
            </div>

            <div className="h-64 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200 flex items-center justify-center">
              <p className="text-zinc-400 font-bold italic">Gráficos e Tabelas Detalhadas...</p>
            </div>

            <div className="pt-12 border-t border-zinc-100 flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              <span>Gerado por: {job.generated_by}</span>
              <span>Página 1 de 12</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface TemplateModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: ReportTemplate;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({ onClose, onSave, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState(initialData?.type || 'EXECUTIVE');
  const [isDefault, setIsDefault] = useState(initialData?.isDefault || false);

  const handleSave = () => {
    onSave({
      name,
      type,
      isDefault,
      // In a real app, we'd also collect modules and privacy here
      // For now, we'll use defaults or the initialData
      modules: initialData?.modules || ['QUEIXAS', 'ABSENTEISMO'],
      privacy: initialData?.privacy || { aggregatedOnly: true, hideSensitiveAttachments: true, minResponsesNR1: 5, hideOpenTextNR1: true }
    });
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-[48px] w-full max-w-lg overflow-hidden shadow-2xl border border-zinc-200"
      >
        <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Star size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-zinc-900 tracking-tight">{initialData ? 'Editar Modelo' : 'Novo Modelo'}</h3>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Configuração de Atalho</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 text-zinc-400 hover:text-zinc-900 hover:bg-white rounded-2xl transition-all shadow-sm">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nome do Modelo</label>
              <input 
                type="text" 
                placeholder="Ex: Relatório Mensal Diretoria..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Tipo de Relatório</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 font-bold appearance-none"
              >
                <option value="EXECUTIVE">Executivo</option>
                <option value="TECHNICAL">Técnico</option>
                <option value="AUDIT">Auditoria</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <div className="flex items-center gap-3">
                <Star size={18} className={isDefault ? 'text-amber-500' : 'text-zinc-400'} />
                <div>
                  <p className="text-xs font-bold text-zinc-900">Modelo Padrão</p>
                  <p className="text-[10px] text-zinc-500">Definir como padrão do contrato.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDefault(!isDefault)}
                className={`w-12 h-6 rounded-full transition-all relative ${isDefault ? 'bg-amber-500' : 'bg-zinc-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDefault ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full py-5 bg-zinc-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20 active:scale-[0.98]"
          >
            Salvar Modelo
          </button>
        </div>
      </motion.div>
    </div>
  );
};
