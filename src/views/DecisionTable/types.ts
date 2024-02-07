// TODO: should be the same model as from data dictionary
export type VariablesOptionsProps = {
  variableName: string;
  variableType: string;
};

export type RowDataProps = {
  id: string;
  variableName: string;
  variableType: string;
  value: string;
  operator: string;
  lowestValue?: string;
  highestValue?: string;
};

export type VariablesDataProps = {
  id: string;
  variableName: string;
  variableType: string;
};
