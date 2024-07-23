import { DATA_TYPE_WITHOUT_ENUM } from '@domain/dataDictionary';

export const OPERATORS = {
  Equal: '=',
  In: 'in',
  GreaterAndEqual: '>=',
  LessAndEqual: '<=',
  Between: 'between',
  Any: 'any'
};

export const EQUAL_OPERATOR = {
  key: 'equal-operator',
  value: '='
};

export const NOT_EQUAL_OPERATOR = {
  key: 'not-equal-operator',
  value: '!='
};

export const IN_OPERATOR = {
  key: 'in-operator',
  value: 'in'
};

export const GREATER_OPERATOR = {
  key: 'greater-operator',
  value: '>'
};

export const LESS_OPERATOR = {
  key: 'less-operator',
  value: '<'
};

export const GREATER_AND_EQUAL_OPERATOR = {
  key: 'greater-and-equal-operator',
  value: '>='
};

export const LESS_AND_EQUAL_OPERATOR = {
  key: 'less-and-equal-operator',
  value: '<='
};

export const BETWEEN_OPERATOR = {
  key: 'between-operator',
  value: 'between'
};

export const ANY_OPERATOR = {
  key: 'any-operator',
  value: 'any'
};

export const OBJECT_DATA_TYPES: string[] = [
  'Object', // @TODO need to clarify if we need this
  DATA_TYPE_WITHOUT_ENUM['Object:CraClarity'],
  DATA_TYPE_WITHOUT_ENUM['Object:CraFactorTrust']
];

export enum CATEGORIES {
  Conditions = 'conditions',
  Actions = 'actions',
  DefaultActions = 'defaultActions'
}

export type CATEGORIES_TYPE = `${CATEGORIES}`;

export type CATEGORIES_WITHOUT_ELSE_ACTIONS = Exclude<
  CATEGORIES,
  CATEGORIES.DefaultActions
>;

export const BOOLEAN_OPTIONS = ['true', 'false'];

export const STEP_DETAILS =
  'A decision table is a step that allows to set expressions for columns and rows. The system will go through the table and analyze the values.';

export const INITIAL_ENTRY = {
  name: '',
  operator: '',
  expression: ''
};

export const INITIAL_CASE_ENTRIES = [
  {
    conditions: [],
    actions: [],
    edgeId: null
  }
];
