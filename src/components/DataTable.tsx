import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ArrowUp, 
  ArrowDown, 
  Info, 
  X, 
  Filter,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import Inputmask from 'inputmask';
import { IGridColumn } from '../types/grid';

interface DataTableProps {
  columns: IGridColumn[];
  data: any[];
  onSort: (field: string) => void;
  onFilter: (field: string, value: any) => void;
  onRowClick?: (row: any) => void;
  onActionClick?: (row: any, action: string) => void;
  actions?: (row: any) => React.ReactNode;
}

export function DataTable({ 
  columns, 
  data, 
  onSort, 
  onFilter, 
  onRowClick,
  onActionClick,
  actions 
}: DataTableProps) {
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    columns.forEach(column => {
      if (column.isFilterable && !column.acceptSpecialCharacters) {
        let mask: any;
        if (column.filterType === 'date') {
          mask = Inputmask({ mask: '99/99/9999' });
        } else if (column.filterType === 'hours') {
          mask = Inputmask({ mask: '99:99' });
        } else if (column.filterType === 'currency') {
          mask = Inputmask('decimal', {
            numericInput: true,
            alias: 'numeric',
            groupSeparator: '.',
            autoGroup: true,
            digits: column.filterDigits || 2,
            radixPoint: column.filterRadixPoint || ',',
            digitsOptional: false,
            allowMinus: column.allowNegative || false,
            placeholder: column.filterPlaceholder || '0,00',
          } as any);
        } else if (column.filterType === 'only_numbers') {
          mask = Inputmask({ regex: "[0-9-.,]*" });
        }

        if (mask) {
          if (column.filterSelectionMode === 'range') {
            const start = inputRefs.current[`${column.field}-start`];
            const end = inputRefs.current[`${column.field}-end`];
            if (start) mask.mask(start);
            if (end) mask.mask(end);
          } else {
            const input = inputRefs.current[column.field];
            if (input) mask.mask(input);
          }
        }
      }
    });
  }, [columns]);

  const renderFilterInput = (column: IGridColumn) => {
    if (!column.isFilterable) return null;

    if (column.filterType === 'boolean' && column.filterSwitchValues) {
      const [off, on] = column.filterSwitchValues;
      const isNeutral = column.filter !== off && column.filter !== on;
      const isOn = column.filter === on;

      return (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] font-bold text-zinc-400 uppercase">{off}</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              const next = isNeutral ? on : isOn ? off : on;
              onFilter(column.field, next);
            }}
            className={`w-8 h-4 rounded-full relative transition-colors ${
              isNeutral ? 'bg-zinc-200' : isOn ? 'bg-emerald-500' : 'bg-zinc-400'
            }`}
          >
            <motion.div 
              animate={{ x: isNeutral ? 8 : isOn ? 16 : 0 }}
              className="absolute left-1 top-1 w-2 h-2 bg-white rounded-full shadow-sm"
            />
          </button>
          <span className="text-[10px] font-bold text-zinc-400 uppercase">{on}</span>
        </div>
      );
    }

    if (column.filterSelectionMode === 'range') {
      return (
        <div className="flex flex-col gap-1 mt-2" onClick={e => e.stopPropagation()}>
          <input 
            ref={el => inputRefs.current[`${column.field}-start`] = el}
            type="text"
            placeholder="De:"
            value={column.filter?.[0] || ''}
            onChange={e => onFilter(column.field, [e.target.value, column.filter?.[1] || ''])}
            className="w-full px-2 py-1 bg-white border border-zinc-200 rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
          />
          <input 
            ref={el => inputRefs.current[`${column.field}-end`] = el}
            type="text"
            placeholder="Até:"
            value={column.filter?.[1] || ''}
            onChange={e => onFilter(column.field, [column.filter?.[0] || '', e.target.value])}
            className="w-full px-2 py-1 bg-white border border-zinc-200 rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
          />
        </div>
      );
    }

    return (
      <div className="relative mt-2" onClick={e => e.stopPropagation()}>
        <input 
          ref={el => inputRefs.current[column.field] = el}
          type="text"
          placeholder={column.filterName || column.name}
          value={column.filter || ''}
          onChange={e => onFilter(column.field, e.target.value)}
          className="w-full pl-7 pr-2 py-1 bg-white border border-zinc-200 rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
        />
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400" size={12} />
        {column.filter && (
          <button 
            onClick={() => onFilter(column.field, '')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            <X size={12} />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-200">
              {columns.map((column) => (
                <th 
                  key={column.field} 
                  className="px-6 py-4 min-w-[150px] align-top"
                  style={column.width ? { width: column.width } : {}}
                >
                  <div 
                    className={`flex items-center gap-2 cursor-pointer group ${column.isSortable ? 'hover:text-emerald-600' : ''}`}
                    onClick={() => column.isSortable && onSort(column.field)}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider group-hover:text-inherit transition-colors">
                          {column.name}
                        </span>
                        {column.isSortable && (
                          <div className="flex flex-col -space-y-1">
                            <ArrowUp size={10} className={column.sort === 'asc' ? 'text-emerald-600' : 'text-zinc-300'} />
                            <ArrowDown size={10} className={column.sort === 'desc' ? 'text-emerald-600' : 'text-zinc-300'} />
                          </div>
                        )}
                        {column.informative && (
                          <div className="relative group/tooltip">
                            <Info size={12} className="text-zinc-300" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-zinc-900 text-white text-[10px] rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50">
                              {column.informative}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
                            </div>
                          </div>
                        )}
                      </div>
                      {renderFilterInput(column)}
                    </div>
                  </div>
                </th>
              ))}
              {actions && <th className="px-6 py-4 text-right text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Ações</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {data.map((row, i) => (
              <tr 
                key={i}
                onClick={() => onRowClick?.(row)}
                className="group hover:bg-zinc-50/80 transition-colors cursor-pointer"
              >
                {columns.map((column) => (
                  <td key={column.field} className="px-6 py-4">
                    {column.render ? column.render(row) : (
                      <span className="text-sm font-medium text-zinc-900">
                        {row[column.field]}
                      </span>
                    )}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 text-right">
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
