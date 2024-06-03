import { lightGreen, lightBlue } from '@mui/material/colors';
import { mapValues, filter, flatMap } from 'lodash';

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
  CATEGORIES_TYPE,
  CATEGORIES_WITHOUT_ELSE_ACTIONS,
  INITIAL_ENTRY,
  INITIAL_CASE_ENTRIES
} from './constants';
import { CaseEntriesDate, CaseEntry } from './types';

import {
  DATA_TYPE,
  DATA_TYPE_WITHOUT_ENUM,
  DATA_TYPE_WITH_ENUM_PREFIX,
  INTEGRATION_VARIABLE_SOURCE_SUB_TYPE,
  VARIABLE_SOURCE_TYPE,
  VARIABLE_USAGE_MODE,
  Variable
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

export const getColumns = (
  caseEntry: CaseEntriesDate,
  variables: Record<string, Variable[]>,
  category: CATEGORIES_WITHOUT_ELSE_ACTIONS
) => {
  const INITIAL_COLUMN = { ...INITIAL_ENTRY, index: 0, category, dataType: '' };

  if (!caseEntry?.[category]?.length)
    return category === CATEGORIES.Conditions ? [INITIAL_COLUMN] : [];

  const combinedVariables = flatMap(variables);

  return caseEntry[category].map((el, index) => {
    const variablesDataTypes = combinedVariables.reduce<
      Record<string, DATA_TYPE>
    >(
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
      ? combinedVariables.find((variable) => variable.name === el.name)
          ?.allowedValues
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

export const setVariableSources = (
  caseEntries: CaseEntry[],
  variables: Record<string, Variable[]>
) => {
  const combinedVariables = flatMap(variables);
  const variablesSourceTypes = combinedVariables.reduce<
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
  insertEntry
}: {
  caseEntries: CaseEntriesDate[];
  category: CATEGORIES_WITHOUT_ELSE_ACTIONS;
  start: number;
  deleteCount: number;
  insertEntry?: CaseEntry;
}) =>
  (caseEntries.length ? caseEntries : INITIAL_CASE_ENTRIES).map((row) => {
    if (!row[category].length)
      return {
        ...row,
        [category]:
          category === CATEGORIES.Actions
            ? [INITIAL_ENTRY]
            : [INITIAL_ENTRY, INITIAL_ENTRY] // Need to add two entries if it is first action after creating the table cause caseEntries is []
      };

    const newColumns = [...row[category]];

    if (insertEntry) newColumns.splice(start, deleteCount, insertEntry);
    else newColumns.splice(start, deleteCount);

    return {
      ...row,
      [category]: newColumns
    };
  });

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

export const filterVariablesByUsageMode = (
  variables: Record<string, Variable[]>,
  category?: CATEGORIES_TYPE
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
