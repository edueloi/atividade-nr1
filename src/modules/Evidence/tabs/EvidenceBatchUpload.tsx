import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UploadCloud, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  Tag, 
  MapPin, 
  History,
  RefreshCw,
  FileImage,
  MoreVertical,
  Settings2
} from 'lucide-react';

import { BatchUpload } from '../types';

const mockBatches: BatchUpload[] = [
  {
    id: 'b1',
    date: '06/03/2026 10:30',
    unit: 'Unidade 1',
    sector: 'Montagem',
    origin: 'Plano de Ação',
    type: 'Depois',
    tags: ['ergonomia', 'bancada'],
    filesCount: 12,
    status: 'Concluído'
  },
  {
    id: 'b2',
    date: '05/03/2026 15:45',
    unit: 'Unidade 2',
    sector: 'RH',
    origin: 'NR1',
    type: 'Comprovante',
    tags: ['treinamento', 'nr1'],
    filesCount: 5,
    status: 'Concluído'
  }
];

export function EvidenceBatchUpload() {
  const [batches, setBatches] = useState<BatchUpload[]>(mockBatches);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newBatch: BatchUpload = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toLocaleString('pt-BR'),
        unit: 'Unidade 1',
        sector: 'Logística',
        origin: 'Ergonomia',
        type: 'Depois',
        tags: ['cadeira', 'lote'],
        filesCount: 8,
        status: 'Concluído'
      };
      setBatches([newBatch, ...batches]);
      setIsUploading(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <div className="bg-white p-10 rounded-[40px] border border-zinc-200 shadow-sm space-y-8">
        <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-6">
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-500/10">
            <UploadCloud size={40} className="text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Upload em Lote</h2>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed">
              Arraste várias imagens ou PDFs para criar um lote de evidências. 
              Ideal para subir fotos de treinamentos ou conclusões mensais.
            </p>
          </div>
          
          <div className="w-full border-2 border-dashed border-zinc-200 rounded-[32px] p-12 flex flex-col items-center justify-center gap-4 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all cursor-pointer group">
            <p className="text-sm font-bold text-zinc-900">Selecione até 50 arquivos simultaneamente</p>
            <button 
              onClick={handleUpload}
              disabled={isUploading}
              className="px-10 py-4 bg-zinc-900 text-white rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20 flex items-center gap-2"
            >
              {isUploading ? <RefreshCw size={18} className="animate-spin" /> : <><Plus size={18} /> Selecionar Arquivos</>}
            </button>
          </div>
        </div>

        {/* Batch Config (Visible after selection) */}
        <div className="p-8 bg-zinc-50 rounded-[32px] border border-zinc-100 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Unidade & Setor Padrão</label>
            <div className="grid grid-cols-2 gap-2">
              <select className="px-4 py-3 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700">
                <option>Unidade 1</option>
              </select>
              <select className="px-4 py-3 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700">
                <option>Montagem</option>
              </select>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Origem & Tipo Padrão</label>
            <div className="grid grid-cols-2 gap-2">
              <select className="px-4 py-3 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700">
                <option>Plano de Ação</option>
              </select>
              <select className="px-4 py-3 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700">
                <option>Depois</option>
              </select>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Tags para o Lote</label>
            <input 
              type="text" 
              placeholder="Ex: ergonomia, bancada" 
              className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700"
            />
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white border border-zinc-200 rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <History size={20} className="text-zinc-900" />
              Histórico de Uploads
            </h3>
            <p className="text-xs text-zinc-500">Acompanhe o processamento dos lotes enviados</p>
          </div>
          <button className="p-2.5 hover:bg-zinc-200 rounded-xl transition-colors">
            <Settings2 size={20} className="text-zinc-400" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-200">
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Lote / Data</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Unidade / Setor</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Arquivos</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {batches.map((batch) => (
                <tr key={batch.id} className="group hover:bg-zinc-50/80 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-zinc-100 text-zinc-900 rounded-xl">
                        <FileImage size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900">Lote #{batch.id.toUpperCase()}</p>
                        <p className="text-[10px] text-zinc-500 font-medium">{batch.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-900">{batch.sector}</span>
                      <span className="text-[10px] text-zinc-500 font-medium">{batch.unit}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-black text-zinc-900">{batch.filesCount} arquivos</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-2 w-fit ${
                      batch.status === 'Concluído' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      batch.status === 'Erro' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {batch.status === 'Concluído' ? <CheckCircle2 size={10} /> : <RefreshCw size={10} className="animate-spin" />}
                      {batch.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2.5 hover:bg-zinc-200 rounded-xl transition-colors text-zinc-400 hover:text-zinc-900" title="Editar Lote">
                        <Edit3 size={18} />
                      </button>
                      <button className="p-2.5 hover:bg-rose-100 rounded-xl transition-colors text-zinc-400 hover:text-rose-600" title="Excluir Lote">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
