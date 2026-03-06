import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ClipboardList, 
  HardHat, 
  Image as ImageIcon, 
  FileText, 
  Plus, 
  Download, 
  Calendar, 
  History, 
  CheckCircle2, 
  AlertTriangle, 
  MoreVertical,
  ChevronRight,
  ArrowUpRight,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Sector360DrawerProps {
  sectorId: string | null;
  onClose: () => void;
}

const historyData = [
  { month: 'Set', score: 45 },
  { month: 'Out', score: 42 },
  { month: 'Nov', score: 48 },
  { month: 'Dez', score: 40 },
  { month: 'Jan', score: 38 },
  { month: 'Fev', score: 35 },
  { month: 'Mar', score: 85 },
];

export function Sector360Drawer({ sectorId, onClose }: Sector360DrawerProps) {
  const [activeTab, setActiveTab] = useState<'risk' | 'evals' | 'projects' | 'actions' | 'evidence'>('risk');

  if (!sectorId) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[80]" onClick={onClose} />
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[90] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center font-black text-xl">
              85
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded-full text-[10px] font-bold uppercase">Risco Alto</span>
                <div className="flex items-center gap-1 text-red-600 text-[10px] font-bold">
                  <TrendingUp size={12} />
                  +5% vs Fev
                </div>
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Montagem Final</h3>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Unidade Sorocaba • Setor 04</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-zinc-200 rounded-xl transition-colors text-zinc-400">
              <Download size={20} />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center gap-6 px-8 border-b border-zinc-100 overflow-x-auto custom-scrollbar">
          {[
            { id: 'risk', label: 'Risco & Histórico', icon: <Activity size={16} /> },
            { id: 'evals', label: 'Avaliações', icon: <ClipboardList size={16} /> },
            { id: 'projects', label: 'Projetos (Eng)', icon: <HardHat size={16} /> },
            { id: 'actions', label: 'Plano de Ação', icon: <CheckCircle2 size={16} /> },
            { id: 'evidence', label: 'Evidências', icon: <ImageIcon size={16} /> },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-emerald-600 text-emerald-600' 
                  : 'border-transparent text-zinc-400 hover:text-zinc-600'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'risk' && (
              <motion.div 
                key="risk"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Score Chart */}
                <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Evolução do Score</h4>
                    <button className="text-[10px] font-bold text-emerald-600 hover:underline">Ver Matriz Completa</button>
                  </div>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 600, fill: '#a1a1aa' }}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 600, fill: '#a1a1aa' }}
                          dx={-10}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#ef4444" 
                          strokeWidth={3} 
                          dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 6, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Update History */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Histórico de Atualizações</h4>
                    <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 transition-colors">
                      Atualizar Risco
                    </button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { date: '02/03/2026', score: 85, reason: 'Nova avaliação biomecânica identificou riscos elevados no posto 04.', user: 'Ricardo Silva' },
                      { date: '01/02/2026', score: 35, reason: 'Manutenção preventiva realizada nas bancadas.', user: 'Ana Paula' },
                      { date: '05/01/2026', score: 38, reason: 'Início do ano - revisão periódica.', user: 'Ricardo Silva' },
                    ].map((update, i) => (
                      <div key={i} className="p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-zinc-900">{update.date}</span>
                            <span className="text-[10px] font-bold text-zinc-400">• {update.user}</span>
                          </div>
                          <span className={`text-xs font-black ${update.score > 70 ? 'text-red-600' : 'text-emerald-600'}`}>{update.score} pts</span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">{update.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'evals' && (
              <motion.div 
                key="evals"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Avaliações do Setor</h4>
                  <button className="px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-[10px] font-bold hover:bg-zinc-800 transition-colors flex items-center gap-2">
                    <Plus size={14} /> Nova Avaliação
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { date: '04/03/2026', post: 'Posto 04', type: 'Biomecânica', risk: 'high', score: 82, status: 'Rascunho' },
                    { date: '25/02/2026', post: 'Posto 02', type: 'Checklist', risk: 'medium', score: 45, status: 'Concluída' },
                    { date: '10/02/2026', post: 'Posto 04', type: 'Visita', risk: 'low', score: 15, status: 'Revisada' },
                  ].map((evalItem, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:border-emerald-200 transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                          evalItem.risk === 'high' ? 'bg-red-50 text-red-600' : evalItem.risk === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {evalItem.score}
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">{evalItem.post}</h5>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase">{evalItem.type} • {evalItem.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          evalItem.status === 'Concluída' ? 'bg-emerald-50 text-emerald-600' : evalItem.status === 'Rascunho' ? 'bg-zinc-100 text-zinc-500' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {evalItem.status}
                        </span>
                        <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'projects' && (
              <motion.div 
                key="projects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Projetos de Engenharia Relacionados</h4>
                  <button className="px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-[10px] font-bold hover:bg-zinc-800 transition-colors flex items-center gap-2">
                    <Plus size={14} /> Novo Projeto
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Linha de Montagem - Posto 04', status: 'Em análise', priority: 'Alta', deadline: '15/03/2026' },
                    { name: 'Ajuste de Bancada - Logística', status: 'Aguardando ajustes', priority: 'Alta', deadline: '10/03/2026' },
                  ].map((project, i) => (
                    <div key={i} className="p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:border-emerald-200 transition-all cursor-pointer group">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                          project.priority === 'Alta' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {project.priority}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-400">{project.deadline}</span>
                      </div>
                      <h5 className="text-sm font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors mb-4">{project.name}</h5>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          project.status === 'Aprovado' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {project.status}
                        </span>
                        <ArrowUpRight size={16} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'actions' && (
              <motion.div 
                key="actions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ações do Plano de Ação</h4>
                  <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2">
                    <Plus size={14} /> Criar Ação
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { action: 'Instalar suporte regulável para monitor', status: 'em andamento', deadline: '15/03/2026', priority: 'medium' },
                    { action: 'Substituir cadeira atual por modelo ergonômico', status: 'atrasado', deadline: '01/03/2026', priority: 'high' },
                  ].map((action, i) => (
                    <div key={i} className="p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:border-emerald-200 transition-all cursor-pointer group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${action.status === 'atrasado' ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`} />
                          <h5 className="text-sm font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">{action.action}</h5>
                        </div>
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                          action.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {action.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          action.status === 'atrasado' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {action.status}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400">
                          <Calendar size={12} />
                          {action.deadline}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'evidence' && (
              <motion.div 
                key="evidence"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Evidências do Setor</h4>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-zinc-100 text-zinc-600 rounded-lg text-[10px] font-bold hover:bg-zinc-200 transition-colors">
                      Ver Galeria
                    </button>
                    <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2">
                      <Plus size={14} /> Adicionar
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { url: 'https://picsum.photos/seed/ergo1/400/300', tag: 'Antes', date: '04/03/2026' },
                    { url: 'https://picsum.photos/seed/ergo2/400/300', tag: 'Depois', date: '04/03/2026' },
                    { url: 'https://picsum.photos/seed/ergo3/400/300', tag: 'Projeto', date: '01/03/2026' },
                    { url: 'https://picsum.photos/seed/ergo4/400/300', tag: 'Audit', date: '25/02/2026' },
                  ].map((item, i) => (
                    <div key={i} className="bg-zinc-50 border border-zinc-100 rounded-2xl overflow-hidden group hover:border-emerald-200 transition-all">
                      <div className="aspect-video relative">
                        <img src={item.url} alt="Evidência" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button className="p-2 bg-white rounded-full text-zinc-900 hover:bg-emerald-500 hover:text-white transition-colors">
                            <ExternalLink size={16} />
                          </button>
                        </div>
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-[8px] font-bold rounded-full uppercase tracking-wider">
                            {item.tag}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 text-center">
                        <span className="text-[10px] font-bold text-zinc-400">{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-zinc-50 border-t border-zinc-100 grid grid-cols-3 gap-3">
          <button className="flex flex-col items-center justify-center gap-1 py-3 bg-white border border-zinc-200 text-zinc-600 rounded-2xl hover:bg-zinc-50 transition-colors">
            <ClipboardList size={18} />
            <span className="text-[10px] font-bold uppercase">Criar Ação</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 py-3 bg-white border border-zinc-200 text-zinc-600 rounded-2xl hover:bg-zinc-50 transition-colors">
            <FileText size={18} />
            <span className="text-[10px] font-bold uppercase">Exportar PDF</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 py-3 bg-white border border-zinc-200 text-zinc-600 rounded-2xl hover:bg-zinc-50 transition-colors">
            <ImageIcon size={18} />
            <span className="text-[10px] font-bold uppercase">Evidência</span>
          </button>
        </div>
      </motion.div>
    </>
  );
}
