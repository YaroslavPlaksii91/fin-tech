import {
  VARIABLE_TYPE,
  EQUAL_OPERATOR,
  BETWEEN_OPERATOR,
  GREATER_AND_EQUAL_OPERATOR,
  ANY_OPERATOR,
  LESS_AND_EQUAL_OPERATOR,
  IN_OPERATOR
} from './constants';

export const getOperatorOptions = (variableType: string) => {
  let operators: Record<string, string>[] = [];

  switch (variableType) {
    case VARIABLE_TYPE.String:
      operators = [IN_OPERATOR, EQUAL_OPERATOR, ANY_OPERATOR];
      break;
    case VARIABLE_TYPE.Number:
      operators = [
        EQUAL_OPERATOR,
        GREATER_AND_EQUAL_OPERATOR,
        LESS_AND_EQUAL_OPERATOR,
        BETWEEN_OPERATOR,
        ANY_OPERATOR
      ];
      break;
    case VARIABLE_TYPE.Boolean:
      operators = [EQUAL_OPERATOR, ANY_OPERATOR];
      break;

    default:
      operators = [EQUAL_OPERATOR];
  }

  return operators;
};
