import {
  EQUAL_OPERATOR,
  BETWEEN_OPERATOR,
  GREATER_AND_EQUAL_OPERATOR,
  ANY_OPERATOR,
  LESS_AND_EQUAL_OPERATOR,
  IN_OPERATOR,
  NOT_EQUAL_OPERATOR,
  LESS_OPERATOR,
  GREATER_OPERATOR
} from './constants';

import { DATA_TYPE_WITHOUT_ENUM } from '@domain/dataDictionary';

export const getOperatorOptions = (dataType: DATA_TYPE_WITHOUT_ENUM) => {
  const { Integer, Decimal, String } = DATA_TYPE_WITHOUT_ENUM;
  let operators: Record<string, string>[] = [];

  switch (dataType) {
    case String:
      operators = [
        IN_OPERATOR,
        EQUAL_OPERATOR,
        NOT_EQUAL_OPERATOR,
        ANY_OPERATOR
      ];
      break;
    case Integer || Decimal:
      operators = [
        EQUAL_OPERATOR,
        NOT_EQUAL_OPERATOR,
        GREATER_OPERATOR,
        LESS_OPERATOR,
        GREATER_AND_EQUAL_OPERATOR,
        LESS_AND_EQUAL_OPERATOR,
        BETWEEN_OPERATOR,
        ANY_OPERATOR
      ];
      break;

    default:
      operators = [EQUAL_OPERATOR, NOT_EQUAL_OPERATOR, ANY_OPERATOR];
  }

  return operators;
};
