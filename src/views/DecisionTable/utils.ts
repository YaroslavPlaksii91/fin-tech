import { VARIABLE_TYPE } from './constants';

// TODO: make method more reusable and presentable

export const getOperatorOptions = (variableType: string) => {
  let operators = [];
  if (variableType === VARIABLE_TYPE.String) {
    operators = [
      {
        key: 'in',
        value: 'in'
      },
      { key: 'equal', value: '=' },
      { key: 'any', value: 'any' }
    ];
  }
  if (variableType === VARIABLE_TYPE.Number) {
    operators = [
      { key: 'equal', value: '=' },
      {
        key: 'moreEqual',
        value: '>='
      },
      { key: 'lessEqual', value: '<=' },
      { key: 'between', value: 'between' },
      { key: 'any', value: 'any' }
    ];
  }

  return operators;
};
