import { CATEGORIES_TYPE } from './constants';

import { DATA_TYPE } from '@domain/dataDictionary';

export type CaseEntry = {
  name: string;
  operator: string;
  expression: string;
  destinationType?: string;
};

export interface CaseEntryUpdate extends CaseEntry {
  category?: CATEGORIES_TYPE;
}

export type CaseEntriesDate = {
  conditions: CaseEntry[];
  actions: CaseEntry[];
  edgeId: null;
};

export type CaseEntriesDataUpdate = {
  conditions: CaseEntryUpdate[];
  actions: CaseEntryUpdate[];
  defaultActions: CaseEntryUpdate[];
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

export type SelectedCellInRowData = {
  rowIndex: number;
  variableName: string;
  dataType: string;
};

export type VariableColumnData = {
  name: string;
  dataType: DATA_TYPE | string;
  allowedValues?: string | string[];
};

export type VariableColumnDataUpdate = {
  category: CATEGORIES_TYPE;
  name: string;
  dataType: DATA_TYPE | string;
  allowedValues?: string | string[];
  index: number;
};

export type FormFieldsProps = {
  variableName: string;
  operator: string;
  value?: string;
  lowerBound?: number | null;
  upperBound?: number | null;
};
