import { CATEGORIES_TYPE, CATEGORIES_WITHOUT_ELSE_ACTIONS } from './constants';

import { DATA_TYPE } from '@domain/dataDictionary';

export type CaseEntry = {
  name: string;
  operator: string;
  expression: string;
  destinationType?: string;
  category?: CATEGORIES_TYPE;
};

export interface CaseEntryColumn extends CaseEntry {
  category?: CATEGORIES_TYPE;
}

export type CaseEntriesDate = {
  conditions: CaseEntry[];
  actions: CaseEntry[];
  edgeId?: string | null;
};

export type VariableRowData = {
  [key: string]: {
    name: string;
    operator: string;
    expression: string;
    edgeId?: string | null;
  };
};

export interface SelectedCell extends CaseEntry {
  category: CATEGORIES_WITHOUT_ELSE_ACTIONS;
  rowIndex: number;
  dataType: DATA_TYPE | string;
}

export type VariableColumnData = {
  name: string;
  dataType: DATA_TYPE | string;
  allowedValues?: string | string[];
};

export type VariableColumnDataUpdate = {
  category: CATEGORIES_WITHOUT_ELSE_ACTIONS;
  name: string;
  dataType: DATA_TYPE | string;
  allowedValues?: string | string[];
  index: number;
};

export type FormFieldsProps = {
  name: string;
  operator?: string;
  value?: string;
  lowerBound?: number | null;
  upperBound?: number | null;
};
