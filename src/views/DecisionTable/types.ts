import { CATEGORY, CATEGORIES_WITHOUT_DEFAULT_ACTIONS } from './constants';

import { DATA_TYPE } from '@domain/dataDictionary';

export type CaseEntry = {
  name: string;
  operator: Operator | null;
  expression: string;
  destinationType?: string;
};

export interface CaseEntryColumn extends CaseEntry {
  category?: CATEGORY;
}

export type CaseEntries = {
  conditions: CaseEntry[];
  actions: CaseEntry[];
  edgeId?: string | null;
};

export interface SelectedCell extends CaseEntry {
  category: CATEGORIES_WITHOUT_DEFAULT_ACTIONS;
  rowIndex: number;
  dataType: DATA_TYPE;
}

export type VariableColumnData = {
  category: CATEGORIES_WITHOUT_DEFAULT_ACTIONS;
  name: string;
  dataType: DATA_TYPE;
  allowedValues?: string | string[];
  index: number;
};

export type FormFieldsProps = {
  name: string;
  operator: Operator | null;
  value?: string;
  lowerBound?: number | null;
  upperBound?: number | null;
};

export enum OPERATORS {
  EQUAL = '=',
  NOT_EQUAL = '!=',
  IN = 'in',
  GREATER = '>',
  LESS = '<',
  GREATER_AND_EQUAL = '>=',
  LESS_AND_EQUAL = '<=',
  BETWEEN = 'between',
  ANY = 'any'
}

export type Operator = `${OPERATORS}`;
