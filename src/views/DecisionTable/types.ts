import { CATEGORY, CATEGORIES_WITHOUT_DEFAULT_ACTIONS } from './constants';

import { DATA_TYPE } from '@domain/dataDictionary';

export type CaseEntry = {
  name: string;
  operator: Operator | '';
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

export type VariableRowData = {
  [key: string]: {
    name: string;
    operator: Operator | '';
    expression: string;
    edgeId?: string | null;
  };
};

export interface SelectedCell extends CaseEntry {
  category: CATEGORIES_WITHOUT_DEFAULT_ACTIONS;
  rowIndex: number;
  dataType: DATA_TYPE | null;
}

export type VariableColumnData = {
  name: string;
  dataType: DATA_TYPE | null;
  allowedValues?: string | string[];
};

export type VariableColumnDataUpdate = {
  category: CATEGORIES_WITHOUT_DEFAULT_ACTIONS;
  name: string;
  dataType: DATA_TYPE | null;
  allowedValues?: string | string[];
  index: number;
};

export type FormFieldsProps = {
  name: string;
  operator: Operator | '';
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
