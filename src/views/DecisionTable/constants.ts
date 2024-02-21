export const VARIABLE_TYPE = {
  Number: 'number',
  String: 'string',
  Enum: 'enum',
  Boolean: 'boolean'
};

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

export enum CATEGORIES {
  Conditions = 'conditions',
  Actions = 'actions',
  ElseActions = 'elseActions'
}

export type CATEGORIES_WITHOUT_ELSE_ACTIONS = Exclude<
  CATEGORIES,
  CATEGORIES.ElseActions
>;

export const USAGE_MODE = {
  ReadOnly: 'ReadOnly',
  WriteOnly: 'WriteOnly',
  ReadWrite: 'ReadWrite'
};

export const BOOLEAN_OPTIONS = ['true', 'false'];
