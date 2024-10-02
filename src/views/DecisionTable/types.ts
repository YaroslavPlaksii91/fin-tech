import {
  DATA_TYPE_WITHOUT_ENUM,
  INTEGRATION_VARIABLE_SOURCE_SUB_TYPE,
  VARIABLE_SOURCE_TYPE
} from '@domain/dataDictionary';

export type Entry = {
  name: string;
  operator: Operator;
  expression: string;
  destinationType?: string;
  dataType?: DATA_TYPE_WITHOUT_ENUM;
  sourceType?: VARIABLE_SOURCE_TYPE | INTEGRATION_VARIABLE_SOURCE_SUB_TYPE;
  sourceName?: string;
};

export type CaseEntry = {
  conditions: Entry[];
  actions: Entry[];
  edgeId: string | null;
};

export type ColumnData = {
  category: CATEGORY;
  name: string;
  dataType: DATA_TYPE_WITHOUT_ENUM;
  allowedValues?: string | string[];
  index: number;
};

export interface SelectedCell extends Entry, ColumnData {
  rowIndex: number;
  dataType: DATA_TYPE_WITHOUT_ENUM;
  columnIndex: number;
}

export type FormFieldsProps = {
  name: string;
  operator: Operator;
  value?: string | string[];
  lowerBound?: string | null;
  upperBound?: string | null;
  dataType?: string;
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
  ANY = 'any',
  CONTAINS = 'contains',
  DOESNOTCONTAIN = 'does not contain',
  NOT_IN = 'not in'
}

export enum CATEGORIES {
  Conditions = 'conditions',
  Actions = 'actions'
}

export type CATEGORY = `${CATEGORIES}`;
export type Operator = `${OPERATORS}`;
