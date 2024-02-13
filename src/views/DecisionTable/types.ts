// TODO: should be the same model as from data dictionary
export type VariablesOptionsProps = {
  variableName: string;
  variableType: string;
};

export type VariableValueDataProps = {
  id: string;
  variableName: string | undefined;
  variableType: string | undefined;
  value?: string | undefined;
  operator: string | undefined;
  lowestValue?: string | undefined;
  highestValue?: string | undefined;
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
