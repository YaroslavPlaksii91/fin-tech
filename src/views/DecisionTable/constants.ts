import { VariablesOptionsProps } from './types';

export enum ENUM_TYPE {
  Accept = 'Accept',
  Decline = 'Decline'
}
export const VARIABLE_TYPE = {
  Number: 'number',
  String: 'string',
  Enum: ENUM_TYPE
};

export const OPERATORS = {
  Equal: '=',
  In: 'in',
  MoreEqual: '>=',
  LessEqual: '<=',
  Between: 'between',
  Any: 'any'
};

export const inputVariablesOptions: VariablesOptionsProps[] = [
  { variableName: 'LeadSourсe1', variableType: 'string' },
  { variableName: 'LeadSource2', variableType: 'string' },
  { variableName: 'LeadSource3', variableType: 'string' },
  { variableName: 'LeadSource4', variableType: 'string' },
  { variableName: 'LeadSoursce5', variableType: 'string' },
  { variableName: 'LeadPrice', variableType: 'number' },
  { variableName: 'CRA.Claritties.Score', variableType: 'number' }
];

export const outputVariablesOptions: VariablesOptionsProps[] = [
  { variableName: 'Decision', variableType: 'enum' },
  { variableName: 'MaxLoanAmount', variableType: 'number' },
  { variableName: 'MinLoanAmount', variableType: 'number' }
];

export const CATEGORIES = {
  Condition: 'condition',
  Output: 'output',
  OtherwiseCondition: 'otherwise_condition'
};
