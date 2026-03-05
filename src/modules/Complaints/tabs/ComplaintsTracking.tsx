import React, { useState } from 'react';
import { 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  Users, 
  Activity,
  ChevronRight,
  MoreVertical,
  Filter,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';

interface TrackingCase {
  id: string;
  complaint_id: string;
  body_part: string;
  sector: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  target: 'FISIO' | 'AMBULATORY' | 'ERGO' | 'ABSENTEEISM';
  status: 'OPEN' | 'DONE';
  days_open: number;
  assigned_to?: string;
}

export function ComplaintsTracking() {
  const [cases, setCases] = useState<TrackingCase[]>([
    {
      id: '1',
      complaint_id: 'c1',
      body_part: 'Lombar',
      sector: 'Montagem Cross',
      priority: 'HIGH',
      target: 'FISIO',
      status: 'OPEN',
      days_open: 3,
      assigned_to: 'Dra. Juliana'
    },
    {
      id: '2',
      complaint_id: 'c2',
      body_part: 'Ombro',
      sector: 'Logística',
      priority: 'MEDIUM',
      target: 'ERGO',
      status: 'OPEN',
      days_open: 1,
    },
    {
      id: '3',
      complaint_id: 'c3',
      body_part: 'Punho',
      sector: 'Pintura',
      priority: 'LOW',
      target: 'FISIO',
      status: 'DONE',
      days_open: 5,
      assigned_to: 'Dr. Marcos'
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600 bg-red-50 border-red-100';
      case 'MEDIUM': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'LOW': return 'text-zinc-600 bg-zinc-50 border-zinc-100';
      default: return 'text-zinc-600 bg-zinc-50 border-zinc-100';
    }
  };

  const getTargetLabel = (target: string) => {
    switch (target) {
      case 'FISIO': return { label: 'Fisioterapia', icon: Activity, color: 'text-purple-600' };
      case 'AMBULATORY': return { label: 'Ambulatório', icon: Clock, color: 'text-blue-600' };
      case 'ERGO': return { label: 'Ergonomia', icon: AlertCircle, color: 'text-orange-600' };
      case 'ABSENTEEISM': return { label: 'Medicina', icon: Users, color: 'text-red-600' };
      default: return { label: target, icon: Activity, color: 'text-zinc-600' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm">
          <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Pendentes</p>
          <div className="flex items-end gap-2">
            <h4 className="text-3xl font-bold text-zinc-900">08</h4>
            <span className="text-xs font-bold text-red-500 mb-1">Atenção</span>
          </div>
        </div>
        <div className="p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm">
          <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Tempo Médio Triagem</p>
          <div className="flex items-end gap-2">
            <h4 className="text-3xl font-bold text-zinc-900">1.2</h4>
            <span className="text-xs font-bold text-zinc-400 mb-1">Dias</span>
          </div>
        </div>
        <div className="p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm">
          <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Taxa de Resolução</p>
          <div className="flex items-end gap-2">
            <h4 className="text-3xl font-bold text-zinc-900">74%</h4>
            <span className="text-xs font-bold text-emerald-600 mb-1">Meta: 80%</span>
          </div>
        </div>
      </div>

      {/* List Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-zinc-900">Fila de Encaminhamentos</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input type="text" placeholder="Filtrar fila..." className="pl-9 pr-4 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/20" />
          </div>
          <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-xl transition-colors border border-zinc-200">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Tracking Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cases.map((item) => {
          const target = getTargetLabel(item.target);
          return (
            <div 
              key={item.id}
              className={`p-5 bg-white border rounded-3xl transition-all hover:shadow-md group ${item.status === 'DONE' ? 'border-zinc-100 opacity-75' : 'border-zinc-200'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(item.priority)}`}>
                  {item.priority}
                </span>
                <button className="p-1 text-zinc-400 hover:text-zinc-900 transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>

              <div className="space-y-1 mb-6">
                <h4 className="font-bold text-zinc-900">{item.body_part}</h4>
                <p className="text-xs text-zinc-500">{item.sector}</p>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-2xl mb-6">
                <div className="flex items-center gap-2">
                  <target.icon size={16} className={target.color} />
                  <span className="text-xs font-bold text-zinc-700">{target.label}</span>
                </div>
                <ArrowRight size={14} className="text-zinc-300" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-zinc-100 rounded-full flex items-center justify-center text-[10px] font-bold text-zinc-400">
                    {item.assigned_to ? item.assigned_to.charAt(0) : '?'}
                  </div>
                  <span className="text-[10px] font-medium text-zinc-500">
                    {item.assigned_to || 'Não atribuído'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase">
                  <Clock size={12} />
                  {item.days_open}d aberto
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-50 flex gap-2">
                <button className="flex-1 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-bold hover:bg-zinc-800 transition-all">
                  Ver Detalhes
                </button>
                {item.status === 'OPEN' && (
                  <button className="flex-1 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-bold hover:bg-emerald-100 transition-all">
                    Concluir
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
