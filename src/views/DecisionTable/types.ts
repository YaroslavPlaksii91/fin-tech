import { DATA_TYPE } from '@domain/dataDictionary';
// TODO: should be the same model as from data dictionary
export type VariablesOptionsProps = {
  variableName: string;
  variableType: string;
};

export type VariableRowData = {
  id: string;
  variableName: string;
  variableType: string;
  value?: string;
  operator: string;
  lowerBound?: number;
  upperBound?: number;
};

export type VariableHeaderData = {
  id: string;
  variableName: string;
  dataType: DATA_TYPE | string;
  allowedValues: string | string[];
};

type CategoryEntries = {
  columnClickedId: string;
  columns: VariableHeaderData[];
  rows: VariableRowData[];
};

export type SelectedCategoriesEntries = {
  conditions: CategoryEntries;
  actions: CategoryEntries;
  elseActions: {
    rows: VariableRowData[];
  };
};
