import React from 'react';
import { motion } from 'motion/react';
import { 
  MoreVertical, 
  Link2, 
  Calendar, 
  Tag, 
  MapPin, 
  ClipboardList, 
  Activity, 
  ShieldCheck, 
  Target, 
  User,
  FileText
} from 'lucide-react';
import { Evidence, EvidenceType, EvidenceOrigin } from '../types';

interface EvidenceCardProps {
  evidence: Evidence;
  onClick: () => void;
  key?: React.Key;
}

export function EvidenceCard({ evidence, onClick }: EvidenceCardProps) {
  const typeColors: Record<EvidenceType, string> = {
    'Antes': 'bg-zinc-100 text-zinc-600 border-zinc-200',
    'Depois': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Comprovante': 'bg-purple-50 text-purple-600 border-purple-100',
    'Campanha': 'bg-amber-50 text-amber-600 border-amber-100',
    'Auditoria': 'bg-zinc-900 text-white border-zinc-900',
  };

  const originIcons: Record<EvidenceOrigin, React.ReactNode> = {
    'NR1': <ShieldCheck size={12} />,
    'Ergonomia': <Activity size={12} />,
    'Eng': <Target size={12} />,
    'Plano de Ação': <ClipboardList size={12} />,
    'Aula': <User size={12} />,
    'Fisio': <Activity size={12} />,
    'Absenteísmo': <FileText size={12} />,
    'Campanhas': <Tag size={12} />,
  };

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={onClick}
      className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden cursor-pointer group hover:border-emerald-500 transition-all"
    >
      {/* Thumbnail */}
      <div className="aspect-square relative overflow-hidden bg-zinc-100">
        <img 
          src={evidence.thumbUrl} 
          alt={evidence.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border shadow-sm ${typeColors[evidence.type]}`}>
            {evidence.type}
          </span>
        </div>

        {/* Origin Icon */}
        <div className="absolute top-3 right-3">
          <div className="w-6 h-6 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-zinc-900 shadow-sm border border-zinc-100">
            {originIcons[evidence.origin]}
          </div>
        </div>

        {/* Status Overlay */}
        {evidence.status === 'Vinculada' && (
          <div className="absolute bottom-3 left-3">
            <div className="px-2 py-1 bg-emerald-500/90 backdrop-blur-sm text-white rounded-lg flex items-center gap-1.5 text-[8px] font-black uppercase shadow-sm">
              <Link2 size={10} /> Vinculada
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h4 className="text-xs font-bold text-zinc-900 truncate group-hover:text-emerald-600 transition-colors">{evidence.title}</h4>
          <div className="flex items-center gap-1.5 mt-1 text-zinc-400">
            <MapPin size={10} />
            <span className="text-[10px] font-medium truncate">{evidence.sector} • {evidence.unit}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Calendar size={10} />
            <span className="text-[10px] font-medium">{evidence.date}</span>
          </div>
          <div className="flex -space-x-1 overflow-hidden">
            {evidence.tags.slice(0, 2).map((tag, i) => (
              <div key={i} className="px-1.5 py-0.5 bg-zinc-50 border border-zinc-200 rounded text-[8px] font-bold text-zinc-400 uppercase tracking-tighter">
                {tag}
              </div>
            ))}
            {evidence.tags.length > 2 && (
              <div className="px-1.5 py-0.5 bg-zinc-50 border border-zinc-200 rounded text-[8px] font-bold text-zinc-400 uppercase tracking-tighter">
                +{evidence.tags.length - 2}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
