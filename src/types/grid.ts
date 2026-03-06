import { ReactNode } from 'react';

export type FilterType = 'date' | 'hours' | 'currency' | 'currency_exchange' | 'only_numbers' | 'multipleImp' | 'boolean';
export type FilterSelectionMode = 'single' | 'range';

export interface IGridColumn {
  id: string | number;
  name: string;
  field: string;
  groupName?: string;
  order: number;
  hidden?: boolean;
  width?: number;
  minAutoWidth?: number;
  maxAutoWidth?: number;
  autoWidth?: boolean;
  autoHeaderName?: string;
  isSortable?: boolean;
  isFilterable?: boolean;
  isDropdownFilterable?: boolean;
  sortName?: string;
  filterName?: string;
  sort?: 'asc' | 'desc' | null;
  preSortable?: 'asc' | 'desc' | null;
  informative?: string;
  informativeDirection?: 'left' | 'right';
  dropdownOptions?: any[];
  selectedDropdownOptions?: any[];
  filtering?: boolean;
  filter?: any;
  filterType?: FilterType;
  filterSelectionMode?: FilterSelectionMode;
  filterPlaceholder?: string;
  filterDigits?: number;
  filterRadixPoint?: string;
  allowNegative?: boolean;
  acceptSpecialCharacters?: boolean;
  filterSwitchValues?: [string, string];
  headerCssClass?: string;
  cssClass?: string;
  formatterType?: string;
  formatterData?: any;
  isExchangeable?: boolean;
  render?: (row: any) => ReactNode;
}

export interface IGridOptions {
  frozenColumn?: number;
  emptyFilter?: boolean;
}
