import { lightGreen, lightBlue } from '@mui/material/colors';
import { mapValues, filter } from 'lodash';

import {
  CATEGORIES,
  CATEGORY,
  CATEGORIES_WITHOUT_DEFAULT_ACTIONS,
  INITIAL_ENTRY,
  INITIAL_CASE_ENTRIES
} from './constants';
import { CaseEntries, CaseEntry, Operator, OPERATORS } from './types';

import {
  DATA_TYPE,
  DATA_TYPE_WITHOUT_ENUM,
  DATA_TYPE_WITH_ENUM_PREFIX,
  INTEGRATION_VARIABLE_SOURCE_SUB_TYPE,
  VARIABLE_SOURCE_TYPE,
  VARIABLE_USAGE_MODE,
  Variable
} from '@domain/dataDictionary';

export const getOperatorOptions = (dataType: DATA_TYPE) => {
  const { Integer, Decimal, String } = DATA_TYPE_WITHOUT_ENUM;
  let operators: Operator[] = [];

  switch (dataType) {
    case String:
      operators = [OPERATORS.IN, OPERATORS.EQUAL, OPERATORS.NOT_EQUAL];
      break;
    case Integer:
    case Decimal:
      operators = [
        OPERATORS.EQUAL,
        OPERATORS.NOT_EQUAL,
        OPERATORS.GREATER,
        OPERATORS.LESS,
        OPERATORS.GREATER_AND_EQUAL,
        OPERATORS.LESS_AND_EQUAL,
        OPERATORS.BETWEEN
      ];
      break;
    default:
      operators = [OPERATORS.EQUAL, OPERATORS.NOT_EQUAL];
  }

  return [...operators, OPERATORS.ANY].map((operator) => ({
    key: operator,
    value: operator
  }));
};

export const getColumns = (
  caseEntry: CaseEntries,
  variables: Variable[],
  category: CATEGORIES_WITHOUT_DEFAULT_ACTIONS
) => {
  const INITIAL_COLUMN = {
    ...INITIAL_ENTRY,
    index: 0,
    category,
    dataType: DATA_TYPE_WITHOUT_ENUM.String
  };

  if (!caseEntry?.[category]?.length)
    return category === CATEGORIES.Conditions ? [INITIAL_COLUMN] : [];

  return caseEntry[category].map((el, index) => {
    const variablesDataTypes = variables.reduce<Record<string, DATA_TYPE>>(
      (acc, current) => ({
        ...acc,
        [current.name]: current.dataType
      }),
      {}
    );

    const isDataTypeWithEnum = Object.values<string>(
      DATA_TYPE_WITH_ENUM_PREFIX
    ).includes(variablesDataTypes[el.name]);

    // if variable enum type we have additional prop with allowedValues
    const allowedValues = isDataTypeWithEnum
      ? variables.find((variable) => variable.name === el.name)?.allowedValues
      : undefined;

    return {
      ...el,
      index,
      category,
      allowedValues,
      name: el.name,
      dataType: variablesDataTypes[el.name]
    };
  });
};

export const getVariableSources = (
  caseEntries: CaseEntry[],
  variables: Variable[]
) => {
  const variablesSourceTypes = variables.reduce<
    Record<string, VARIABLE_SOURCE_TYPE | INTEGRATION_VARIABLE_SOURCE_SUB_TYPE>
  >(
    (acc, current) => ({
      ...acc,
      [current.name]: current.sourceType
    }),
    {}
  );

  return caseEntries.map(({ name }) => ({
    name,
    sourceType: variablesSourceTypes[name]
  }));
};

export const updateCaseEntry = ({
  caseEntries,
  category,
  start,
  deleteCount = 0,
  insertEntry,
  initialEntries = [] // We need to provide initial entries for rows in case when we don`t have any already created Entries
}: {
  caseEntries: CaseEntries[];
  category: CATEGORIES_WITHOUT_DEFAULT_ACTIONS;
  start: number;
  deleteCount: number;
  insertEntry?: CaseEntry;
  initialEntries?: CaseEntry[];
}) =>
  (caseEntries.length ? caseEntries : INITIAL_CASE_ENTRIES).map((row) => {
    if (!row[category].length)
      return {
        ...row,
        [category]: initialEntries
      };

    const newColumns = [...row[category]];

    if (insertEntry) newColumns.splice(start, deleteCount, insertEntry);
    else newColumns.splice(start, deleteCount);

    return {
      ...row,
      [category]: newColumns
    };
  });

export const getHeaderCellBgColor = (category: CATEGORY) => {
  switch (category) {
    case CATEGORIES.Conditions:
      return lightBlue[50];
    case CATEGORIES.Actions:
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

export const filterVariablesByUsageMode = (
  variables: Record<string, Variable[]>,
  category?: CATEGORY
) => {
  let usageMode: VARIABLE_USAGE_MODE;

  switch (category) {
    case CATEGORIES.Conditions:
      usageMode = VARIABLE_USAGE_MODE.WriteOnly;
      break;
    case CATEGORIES.DefaultActions:
    case CATEGORIES.Actions:
      usageMode = VARIABLE_USAGE_MODE.ReadOnly;
      break;
  }

  return mapValues(variables, (arr) =>
    filter(arr, (item) => item.usageMode !== usageMode)
  );
};

export const checkDataType = (dataType: DATA_TYPE) => ({
  isWithoutEnum: Object.values(DATA_TYPE_WITHOUT_ENUM).includes(
    dataType as DATA_TYPE_WITHOUT_ENUM
  ),
  isBoolean: dataType === DATA_TYPE_WITHOUT_ENUM.Boolean,
  isString: dataType === DATA_TYPE_WITHOUT_ENUM.String,
  isObject:
    dataType === DATA_TYPE_WITHOUT_ENUM['Object:CraClarity'] ||
    dataType === DATA_TYPE_WITHOUT_ENUM['Object:CraFactorTrust']
});
// We need to convert with string in "\"stringValue\"" format since the backend expects it
export const convertToStringFormat = (string: string) =>
  // eslint-disable-next-line no-useless-escape
  string.length ? `\\\"${string}\\\"` : '';

// Parse to basic string format
export const parseStringFormat = (formattedString: string) => {
  // eslint-disable-next-line no-useless-escape
  const match = formattedString.match(/^\\\"(.*)\\\"$/);

  return match ? match[1] : formattedString;
};
