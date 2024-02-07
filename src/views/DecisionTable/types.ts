export type VariablesOptionsProps = {
  variableName: string;
  variableType: string;
};

export type SelectedRowDataProps = {
  id: string;
  variableName: string;
  variableType: string;
  value: string;
  operator: string;
  lowestValue?: string;
  highestValue?: string;
};
