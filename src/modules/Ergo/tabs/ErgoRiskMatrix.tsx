import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  MoreVertical, 
  Info, 
  ImageIcon, 
  ClipboardList, 
  FileDown, 
  History, 
  Archive, 
  Trash2, 
  X,
  ChevronRight
} from 'lucide-react';
import { DataTable } from '../../../components/DataTable';
import { useGrid } from '../../../hooks/useGrid';
import { IGridColumn } from '../../../types/grid';

interface MatrixItem {
  id: string;
  sector: string;
  risk: 'low' | 'medium' | 'high';
  score: number;
  trend: number;
  lastUpdate: string;
}

interface ErgoRiskMatrixProps {
  onOpenSector: (sectorId: string) => void;
}

const mockMatrix: MatrixItem[] = [
  { id: '1', sector: 'Montagem Final', risk: 'high', score: 85, trend: 5, lastUpdate: '02/03/2026' },
  { id: '2', sector: 'Logística Interna', risk: 'high', score: 72, trend: 2, lastUpdate: '01/03/2026' },
  { id: '3', sector: 'Pintura', risk: 'medium', score: 68, trend: -3, lastUpdate: '28/02/2026' },
  { id: '4', sector: 'Solda', risk: 'medium', score: 65, trend: 0, lastUpdate: '25/02/2026' },
  { id: '5', sector: 'Estamparia', risk: 'medium', score: 58, trend: -8, lastUpdate: '20/02/2026' },
  { id: '6', sector: 'Almoxarifado', risk: 'low', score: 25, trend: -2, lastUpdate: '15/02/2026' },
  { id: '7', sector: 'Qualidade', risk: 'low', score: 18, trend: 0, lastUpdate: '10/02/2026' },
];

export function ErgoRiskMatrix({ onOpenSector }: ErgoRiskMatrixProps) {
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedSectorForUpdate, setSelectedSectorForUpdate] = useState<MatrixItem | null>(null);

  const initialColumns: IGridColumn[] = [
    { 
      id: 'sector', 
      name: 'Setor', 
      field: 'sector', 
      order: 1, 
      isSortable: true, 
      isFilterable: true,
      informative: 'Nome do setor operacional'
    },
    { 
      id: 'risk', 
      name: 'Risco', 
      field: 'risk', 
      order: 2, 
      isSortable: true, 
      isFilterable: true,
      filterType: 'boolean',
      filterSwitchValues: ['Baixo', 'Alto'],
      render: (row: MatrixItem) => {
        const colors = {
          low: 'text-emerald-600 bg-emerald-50 border-emerald-100',
          medium: 'text-amber-600 bg-amber-50 border-amber-100',
          high: 'text-red-600 bg-red-50 border-red-100',
        };
        const labels = { low: 'Baixo', medium: 'Médio', high: 'Alto' };
        return (
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${colors[row.risk]}`}>
            {labels[row.risk]}
          </span>
        );
      }
    },
    { 
      id: 'score', 
      name: 'Score (0-100)', 
      field: 'score', 
      order: 3, 
      isSortable: true, 
      isFilterable: true,
      filterSelectionMode: 'range',
      render: (row: MatrixItem) => (
        <div className="flex items-center gap-3">
          <div className="flex-1 max-w-[100px] h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${row.risk === 'high' ? 'bg-red-500' : row.risk === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${row.score}%` }}
            />
          </div>
          <span className="text-xs font-bold text-zinc-600">{row.score}</span>
        </div>
      )
    },
    { 
      id: 'trend', 
      name: 'Tendência', 
      field: 'trend', 
      order: 4, 
      isSortable: true,
      render: (row: MatrixItem) => (
        <div className={`flex items-center gap-1 text-xs font-bold ${
          row.trend > 0 ? 'text-red-600' : row.trend < 0 ? 'text-emerald-600' : 'text-zinc-400'
        }`}>
          {row.trend > 0 ? <TrendingUp size={14} /> : row.trend < 0 ? <TrendingDown size={14} /> : null}
          {row.trend === 0 ? 'Estável' : `${Math.abs(row.trend)}%`}
        </div>
      )
    },
    { 
      id: 'lastUpdate', 
      name: 'Última Atualização', 
      field: 'lastUpdate', 
      order: 5, 
      isSortable: true, 
      isFilterable: true,
      filterType: 'date'
    },
  ];

  const { visibleColumns, toggleSort, updateFilter, columns } = useGrid(initialColumns);

  const filteredData = useMemo(() => {
    return mockMatrix.filter(item => {
      return columns.every(col => {
        if (!col.filter) return true;
        const val = String(item[col.field as keyof MatrixItem]).toLowerCase();
        
        if (col.filterSelectionMode === 'range') {
          const [min, max] = col.filter;
          const score = item.score;
          if (min && score < Number(min)) return false;
          if (max && score > Number(max)) return false;
          return true;
        }

        if (col.filterType === 'boolean') {
          const label = { low: 'Baixo', medium: 'Médio', high: 'Alto' }[item.risk];
          return label === col.filter;
        }

        return val.includes(String(col.filter).toLowerCase());
      });
    }).sort((a, b) => {
      const activeSort = columns.find(c => c.sort);
      if (!activeSort) return 0;
      const field = activeSort.field as keyof MatrixItem;
      const factor = activeSort.sort === 'asc' ? 1 : -1;
      return a[field] > b[field] ? factor : -factor;
    });
  }, [columns]);

  return (
    <div className="space-y-6">
      {/* Top Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200">
            <button className="px-3 py-1.5 text-[10px] font-bold rounded-lg bg-white text-zinc-900 shadow-sm">Mar/2026</button>
            <button className="px-3 py-1.5 text-[10px] font-bold rounded-lg text-zinc-500 hover:text-zinc-700">Fev/2026</button>
          </div>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <Plus size={18} />
            Atualizar Matriz
          </button>
        </div>
      </div>

      {/* New DataTable */}
      <DataTable 
        columns={visibleColumns}
        data={filteredData}
        onSort={toggleSort}
        onFilter={updateFilter}
        onRowClick={(row) => onOpenSector(row.id)}
        actions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActionMenu(showActionMenu === row.id ? null : row.id);
                }}
                className="p-2 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-400"
              >
                <MoreVertical size={18} />
              </button>
              
              <AnimatePresence>
                {showActionMenu === row.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(null)} />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-zinc-100 z-20 overflow-hidden py-2"
                    >
                      <button 
                        onClick={(e) => { e.stopPropagation(); onOpenSector(row.id); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                      >
                        <Info size={16} className="text-zinc-400" /> Ver Detalhes
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedSectorForUpdate(row); setShowUpdateModal(true); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                      >
                        <TrendingUp size={16} className="text-emerald-500" /> Atualizar Risco
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                      >
                        <ImageIcon size={16} className="text-zinc-400" /> Adicionar Evidência
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                      >
                        <ClipboardList size={16} className="text-emerald-500" /> Criar Plano de Ação
                      </button>
                      <div className="h-px bg-zinc-100 my-1" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                      >
                        <FileDown size={16} className="text-zinc-400" /> Gerar Relatório (PDF)
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                      >
                        <History size={16} className="text-zinc-400" /> Histórico do Setor
                      </button>
                      <div className="h-px bg-zinc-100 my-1" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-3"
                      >
                        <Archive size={16} className="text-zinc-400" /> Arquivar Setor
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-3"
                      >
                        <Trash2 size={16} /> Excluir Atualização
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <ChevronRight size={18} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
          </div>
        )}
      />

      {/* Update Risk Modal */}
      <AnimatePresence>
        {showUpdateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">Atualizar Risco</h3>
                    <p className="text-xs text-zinc-500">{selectedSectorForUpdate?.sector}</p>
                  </div>
                </div>
                <button onClick={() => setShowUpdateModal(false)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Mês de Referência</label>
                  <select className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                    <option>Março / 2026</option>
                    <option>Abril / 2026</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Score de Risco</label>
                    <span className="text-lg font-black text-emerald-600">75</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    defaultValue="75"
                    className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase">
                    <span>Baixo</span>
                    <span>Médio</span>
                    <span>Alto</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Motivo da Alteração</label>
                  <textarea 
                    rows={3}
                    placeholder="Descreva o motivo da mudança no score..."
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Categorias Críticas</label>
                  <div className="flex flex-wrap gap-2">
                    {['Postura', 'Repetitividade', 'Carga', 'Ritmo', 'Mobiliário'].map(cat => (
                      <button key={cat} className="px-3 py-1 bg-zinc-100 hover:bg-emerald-100 hover:text-emerald-600 rounded-full text-[10px] font-bold transition-colors">
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setShowUpdateModal(false)} className="px-6 py-2 text-zinc-600 text-sm font-bold hover:bg-zinc-200 rounded-xl transition-colors">Cancelar</button>
                <button 
                  onClick={() => setShowUpdateModal(false)}
                  className="px-8 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Salvar Atualização
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
