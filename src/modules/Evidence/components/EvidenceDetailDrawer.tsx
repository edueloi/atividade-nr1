import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Download, 
  Trash2, 
  Edit3, 
  Link2, 
  Calendar, 
  MapPin, 
  Tag, 
  ExternalLink,
  CheckCircle2,
  Clock,
  ShieldCheck,
  User,
  Info,
  FileText,
  Activity,
  Target,
  ClipboardList
} from 'lucide-react';
import { Evidence, EvidenceOrigin, EvidenceType } from '../types';

interface EvidenceDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: Evidence | null;
  onDelete: (id: string) => void;
}

export function EvidenceDetailDrawer({ isOpen, onClose, evidence, onDelete }: EvidenceDetailDrawerProps) {
  if (!evidence) return null;

  const typeColors: Record<EvidenceType, string> = {
    'Antes': 'bg-zinc-100 text-zinc-600 border-zinc-200',
    'Depois': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Comprovante': 'bg-purple-50 text-purple-600 border-purple-100',
    'Campanha': 'bg-amber-50 text-amber-600 border-amber-100',
    'Auditoria': 'bg-zinc-900 text-white border-zinc-900',
  };

  const originIcons: Record<EvidenceOrigin, React.ReactNode> = {
    'NR1': <ShieldCheck size={16} />,
    'Ergonomia': <Activity size={16} />,
    'Eng': <Target size={16} />,
    'Plano de Ação': <ClipboardList size={16} />,
    'Aula': <User size={16} />,
    'Fisio': <Activity size={16} />,
    'Absenteísmo': <FileText size={16} />,
    'Campanhas': <Tag size={16} />,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-[70] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600 text-white rounded-xl">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">Detalhe da Evidência</h3>
                  <p className="text-xs text-zinc-500">ID: {evidence.id} • {evidence.origin}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* Preview */}
              <div className="aspect-video bg-zinc-100 rounded-3xl border border-zinc-200 overflow-hidden relative group">
                <img 
                  src={evidence.fileUrl} 
                  alt={evidence.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="p-3 bg-white text-zinc-900 rounded-full shadow-xl hover:scale-110 transition-transform">
                    <ExternalLink size={24} />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-zinc-900 leading-tight">{evidence.title}</h2>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${typeColors[evidence.type]}`}>
                        {evidence.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${
                        evidence.status === 'Vinculada' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        {evidence.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Data do Registro</p>
                    <h4 className="text-sm font-black text-zinc-900">{evidence.date}</h4>
                  </div>
                </div>

                <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Unidade / Setor</p>
                      <p className="text-sm font-bold text-zinc-900">{evidence.unit} • {evidence.sector}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Origem</p>
                      <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
                        {originIcons[evidence.origin]} {evidence.origin}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Data do Upload</p>
                      <p className="text-sm font-bold text-zinc-900">{evidence.uploadDate}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Enviado por</p>
                      <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
                        <div className="w-5 h-5 rounded-full bg-zinc-200 flex items-center justify-center text-[8px]">{evidence.createdBy.split(' ').map(n => n[0]).join('')}</div>
                        {evidence.createdBy}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-zinc-200">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Descrição</p>
                    <p className="text-sm text-zinc-600 leading-relaxed">{evidence.description || 'Sem descrição adicional.'}</p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-zinc-200">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {evidence.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-white border border-zinc-200 rounded-lg text-[10px] font-bold text-zinc-500 flex items-center gap-1.5">
                          <Tag size={10} /> {tag}
                        </span>
                      ))}
                      <button className="px-2 py-1 border border-dashed border-zinc-300 rounded-lg text-[10px] font-bold text-zinc-400 hover:bg-zinc-100 transition-all">+ Adicionar</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Links / Vínculos */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <Link2 size={18} className="text-zinc-900" />
                    Vínculos ({evidence.links.length})
                  </h4>
                  <button className="text-[10px] font-bold text-emerald-600 hover:underline">+ Novo Vínculo</button>
                </div>
                <div className="space-y-3">
                  {evidence.links.length > 0 ? (
                    evidence.links.map(link => (
                      <div key={link.id} className="p-4 bg-white border border-zinc-200 rounded-2xl flex items-center gap-4 hover:border-emerald-500 transition-all cursor-pointer group">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <ClipboardList size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-xs font-bold text-zinc-900">{link.refName}</p>
                            <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
                              {link.refType}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-500">Vinculado em: {link.createdAt}</p>
                        </div>
                        <ExternalLink size={16} className="text-zinc-300 group-hover:text-emerald-600 transition-colors" />
                      </div>
                    ))
                  ) : (
                    <div className="p-8 bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
                      <Info size={24} className="text-zinc-300" />
                      <p className="text-xs text-zinc-500 font-medium">Esta evidência ainda não está vinculada a nenhum registro.</p>
                      <button className="text-[10px] font-black text-emerald-600 uppercase hover:underline mt-2">Vincular agora</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-zinc-50 border-t border-zinc-100 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <button className="px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/20 flex items-center justify-center gap-2">
                <Edit3 size={16} /> Editar
              </button>
              <button className="px-4 py-2.5 bg-white border border-zinc-200 text-zinc-600 rounded-xl text-xs font-bold hover:bg-zinc-50 transition-all flex items-center justify-center gap-2">
                <Link2 size={16} /> Vincular
              </button>
              <button className="px-4 py-2.5 bg-white border border-zinc-200 text-zinc-600 rounded-xl text-xs font-bold hover:bg-zinc-50 transition-all flex items-center justify-center gap-2">
                <Download size={16} /> Baixar
              </button>
              <button 
                onClick={() => onDelete(evidence.id)}
                className="px-4 py-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> Excluir
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
