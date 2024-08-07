import { CATEGORY } from './constants';

import { DATA_TYPE } from '@domain/dataDictionary';

export type CaseEntry = {
  name: string;
  operator: Operator;
  expression: string;
  destinationType?: string;
};

export type CaseEntries = {
  conditions: CaseEntry[];
  actions: CaseEntry[];
  edgeId: string | null;
};

export interface SelectedCell extends CaseEntry {
  category: CATEGORY;
  rowIndex: number;
  dataType: DATA_TYPE;
  allowedValues?: string | string[];
}

export type VariableColumnData = {
  category: CATEGORY;
  name: string;
  dataType: DATA_TYPE;
  allowedValues?: string | string[];
  index: number;
};

export type FormFieldsProps = {
  name: string;
  operator: Operator;
  value?: string;
  lowerBound?: number | null;
  upperBound?: number | null;
};

export enum OPERATORS {
  Empty = '',
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
