import {
  VARIABLE_DATA_TYPE,
  CONTROL_FILES,
  VARIABLE_SOURCE_TYPE
} from '@domain/dataDictionary';

export type Entry = {
  name: string;
  operator: Operator;
  expression: string;
  destinationType?: string;
  dataType?: VARIABLE_DATA_TYPE;
  sourceType?: VARIABLE_SOURCE_TYPE | CONTROL_FILES;
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
  dataType: VARIABLE_DATA_TYPE;
  allowedValues?: string | string[];
  index: number;
};

export interface SelectedCell extends Entry, ColumnData {
  rowIndex: number;
  dataType: VARIABLE_DATA_TYPE;
  columnIndex: number;
}

export type FormFieldsProps = {
  name: string;
  operator: Operator;
  value?: string | string[];
  lowerBound?: string | null;
  upperBound?: string | null;
  dataType?: string;
  type: ValueType;
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

export enum VALUE_TYPES {
  Value = 'Value',
  Variable = 'Variable'
}

export type CATEGORY = `${CATEGORIES}`;
export type Operator = `${OPERATORS}`;
export type ValueType = `${VALUE_TYPES}`;
