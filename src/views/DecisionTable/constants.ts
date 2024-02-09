import { VariablesOptionsProps } from './types';

export enum ENUM_TYPE {
  Accept = 'Accept',
  Decline = 'Decline'
}
export const VARIABLE_TYPE = {
  Number: 'number',
  String: 'string',
  Enum: 'enum'
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
  { variableName: 'LeadSourсe', variableType: 'string' },
  { variableName: 'NextPayDate', variableType: 'string' },
  { variableName: 'LeadPrice', variableType: 'number' },
  { variableName: 'CRA.Claritties.Score', variableType: 'number' }
];

export const outputVariablesOptions: VariablesOptionsProps[] = [
  { variableName: 'Decision', variableType: 'enum' },
  { variableName: 'MaxLoanAmount', variableType: 'number' },
  { variableName: 'MinLoanAmount', variableType: 'number' }
];

export const CATEGORIES = {
  Conditions: 'conditions',
  Actions: 'actions',
  ElseActions: 'elseActions'
};

export const DECISION_OPTIONS = [
  {
    value: 'accept',
    label: 'Accept'
  },
  { value: 'denied', label: 'Denied' }
];
