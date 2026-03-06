import { useState, useCallback, useMemo } from 'react';
import _ from 'lodash';
import { IGridColumn } from '../types/grid';

export function useGrid(initialColumns: IGridColumn[]) {
  const [columns, setColumns] = useState<IGridColumn[]>(
    initialColumns.sort((a, b) => a.order - b.order)
  );

  const defineColumnAutoWidth = useCallback((rowList: any[]) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      let atualGroup = '';
      let totalGroupColumnsWidth = 0;

      newColumns.forEach((column, index) => {
        if (column.autoWidth) {
          if (column.groupName !== atualGroup) {
            atualGroup = column.groupName || '';
            totalGroupColumnsWidth = 0;
          }

          let stringLength = 0;
          rowList.forEach((row) => {
            let value = row[column.field];
            if (Array.isArray(value)) {
              if (value.length === 1) {
                value = value[0];
              }
            }

            if (typeof value === 'string') {
              stringLength = value.length > stringLength ? value.length : stringLength;
            } else if (typeof value === 'number') {
              const cloneValue = JSON.stringify(value);
              stringLength = cloneValue.length > stringLength ? cloneValue.length : stringLength;
            } else if (typeof value === 'object' && value !== null) {
              if (column?.formatterData?.singleField && value.hasOwnProperty(column?.formatterData?.singleField)) {
                stringLength = value[column?.formatterData?.singleField]?.length > stringLength ? value[column?.formatterData?.singleField]?.length : stringLength;
              } else {
                const text = Object.values(value).map(v => (typeof v === 'string' ? v.length : 0));
                if (text.length > 0) {
                  stringLength = Math.max(stringLength, ...text);
                }
              }
            }
          });

          const groupMinWidth = ((column.groupName || '').length * ((column.groupName || '').length > 100 ? 6 : 7)) + 35;
          const measuredWidth = (stringLength * 7) + 35;
          totalGroupColumnsWidth += measuredWidth;

          let headerMeasuredWidth = column.autoHeaderName ? (column.autoHeaderName.length * (column.autoHeaderName.length > 100 ? 6 : 7)) + 30 : 0;
          
          if (newColumns[index + 1]?.groupName !== atualGroup) {
            headerMeasuredWidth = totalGroupColumnsWidth > groupMinWidth ? headerMeasuredWidth : groupMinWidth;
          }

          if (column.isSortable) headerMeasuredWidth += 38;
          if (column.isFilterable) headerMeasuredWidth += 38;

          column.width = column.minAutoWidth && column.minAutoWidth > measuredWidth ? column.minAutoWidth :
            column.maxAutoWidth && column.maxAutoWidth < measuredWidth ? column.maxAutoWidth :
            measuredWidth > headerMeasuredWidth ? measuredWidth : headerMeasuredWidth;
        }
      });
      return newColumns;
    });
  }, []);

  const toggleSort = useCallback((field: string) => {
    setColumns(prev => prev.map(col => {
      if (col.field === field) {
        const nextSort = col.sort === 'asc' ? 'desc' : col.sort === 'desc' ? null : 'asc';
        return { ...col, sort: nextSort };
      }
      return { ...col, sort: null }; // Single sort by default
    }));
  }, []);

  const updateFilter = useCallback((field: string, value: any) => {
    setColumns(prev => prev.map(col => {
      if (col.field === field) {
        return { ...col, filter: value, filtering: !!value };
      }
      return col;
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setColumns(prev => prev.map(col => ({
      ...col,
      filtering: false,
      filter: col.filterSelectionMode === 'range' ? ['', ''] : ''
    })));
  }, []);

  const visibleColumns = useMemo(() => columns.filter(c => !c.hidden), [columns]);

  return {
    columns,
    visibleColumns,
    setColumns,
    defineColumnAutoWidth,
    toggleSort,
    updateFilter,
    resetFilters
  };
}
