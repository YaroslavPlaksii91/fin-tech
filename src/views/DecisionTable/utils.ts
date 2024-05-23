import { lightGreen, lightBlue } from '@mui/material/colors';

import {
  EQUAL_OPERATOR,
  BETWEEN_OPERATOR,
  GREATER_AND_EQUAL_OPERATOR,
  ANY_OPERATOR,
  LESS_AND_EQUAL_OPERATOR,
  IN_OPERATOR,
  NOT_EQUAL_OPERATOR,
  LESS_OPERATOR,
  GREATER_OPERATOR,
  CATEGORIES,
  CATEGORIES_TYPE
} from './constants';
import { CaseEntry } from './types';

import {
  DATA_TYPE_WITHOUT_ENUM,
  VARIABLE_SOURCE_TYPE
} from '@domain/dataDictionary';

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

export const setVariableSources = (
  caseEntries: CaseEntry[],
  variablesSourceTypes: Record<string, VARIABLE_SOURCE_TYPE>
) =>
  caseEntries.map(({ name }) => ({
    name,
    sourceType: variablesSourceTypes[name]
  }));

export const getHeaderCellBgColor = (category: CATEGORIES_TYPE | null) => {
  switch (category) {
    case CATEGORIES.Actions:
      return lightGreen[50];
    case CATEGORIES.Conditions:
      return lightBlue[50];
    default:
      return lightGreen[50];
  }
};

export const getFormatedOptions = (
  enumTypeSelectOptions: string | string[]
) => {
  // in case API returns array in string "[ContactTime.Morning,ContactTime.Afternoon]"
  if (typeof enumTypeSelectOptions === 'string') {
    return enumTypeSelectOptions
      .replace(/\[|\]/g, '')
      .split(',')
      .map((value) => ({ value, label: value }));
  }

  return enumTypeSelectOptions.map((value) => ({
    value,
    label: value
  }));
};
