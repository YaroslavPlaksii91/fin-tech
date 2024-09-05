import { TABS } from './constants';

export type TAB = keyof typeof TABS;

export enum FILTER_BY {
  dataType = 'dataType',
  sourceType = 'sourceType',
  source = 'source'
}
