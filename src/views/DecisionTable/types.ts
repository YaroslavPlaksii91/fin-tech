// TODO: should be the same model as from data dictionary
export type VariablesOptionsProps = {
  variableName: string;
  variableType: string;
};

export type VariableValueDataProps = {
  id: string;
  variableName: string;
  variableType: string;
  value?: string | undefined;
  operator?: string | undefined;
  lowerBound?: number | null | undefined;
  upperBound?: number | null | undefined;
};

export type VariableTypeDataProps = {
  id: string;
  variableName: string;
  variableType: string;
};

type EntriesProps = {
  columnClickedId: string;
  columns: VariableTypeDataProps[];
  rows: VariableValueDataProps[];
};

export type SelectedCaseEntriesProps = {
  conditions: EntriesProps;
  actions: EntriesProps;
  elseActions: {
    rows: VariableValueDataProps[];
  };
};
