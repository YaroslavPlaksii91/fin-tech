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
  Between: 'between'
};

export const variablesOptions: VariablesOptionsProps[] = [
  { variableName: 'LeadSourse1', variableType: 'string' },
  { variableName: 'LeadSourse2', variableType: 'string' },
  { variableName: 'LeadSourse3', variableType: 'string' },
  { variableName: 'LeadSourse4', variableType: 'string' },
  { variableName: 'LeadSourse5', variableType: 'string' },
  { variableName: 'LeadPrice', variableType: 'number' },
  { variableName: 'CRA.Claritties.Score', variableType: 'number' }
];
