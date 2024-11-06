import { TABS_KEYS } from './constants';

import { DataDictionaryVariable } from '@domain/dataDictionary';

export type TAB = keyof typeof TABS_KEYS;

export enum FILTER_BY {
  dataType = 'dataType',
  sourceType = 'sourceType',
  source = 'source'
}

export type IFilters = {
  selects: {
    [FILTER_BY.dataType]: string[];
    [FILTER_BY.sourceType]: string[];
    [FILTER_BY.source]: string[];
  };
  search: string;
};

export interface TableHeader {
  key: keyof DataDictionaryVariable;
  label?: string;
  maxWidth?: string;
  render?: (row: DataDictionaryVariable) => void;
}
