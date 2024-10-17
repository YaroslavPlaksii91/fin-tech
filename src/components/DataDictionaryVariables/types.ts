import { TABS_KEYS } from './constants';

import { Variable } from '@domain/dataDictionary';

export type TAB = keyof typeof TABS_KEYS;

export enum FILTER_BY {
  dataType = 'dataType',
  sourceType = 'sourceType',
  source = 'source'
}

export interface TableHeader {
  key: keyof Variable;
  label?: string;
  maxWidth?: string;
  render?: (row: Variable) => void;
}
