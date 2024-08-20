import { lightGreen, lightBlue } from '@mui/material/colors';
import { mapValues, filter, cloneDeep } from 'lodash';

import { OBJECT } from './constants';
import { CaseEntry, Entry, Operator, OPERATORS, CATEGORY } from './types';

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

// OBJECT type separate from other because this type comes only from CRA variables
export const checkDataType = (dataType: DATA_TYPE | typeof OBJECT) => ({
  isWithEnum: Object.values(DATA_TYPE_WITH_ENUM_PREFIX).includes(
    dataType as DATA_TYPE_WITH_ENUM_PREFIX
  ),
  isBoolean: dataType === DATA_TYPE_WITHOUT_ENUM.Boolean,
  isString: dataType === DATA_TYPE_WITHOUT_ENUM.String,
  isObject: dataType === OBJECT
});

export const getColumns = (
  entries: Entry[],
  variables: Variable[],
  category: CATEGORY
) =>
  entries.map((el, index) => {
    const variable = variables.find((variable) => variable.name === el.name);

    // if variable enum type we have additional prop with allowedValues
    const allowedValues =
      variable?.dataType && checkDataType(variable.dataType).isWithEnum
        ? variable?.allowedValues
        : undefined;

    // pass data type directly to prevent issues with the object properties
    const dataType =
      el.dataType || variable?.dataType || DATA_TYPE_WITHOUT_ENUM.String;

    return {
      index,
      category,
      allowedValues,
      dataType,
      name: el.name
    };
  });

export const getVariableSources = (entries: Entry[], variables: Variable[]) =>
  entries.reduce(
    (acc, { name, sourceName, sourceType }) => {
      const isAdded = Boolean(
        acc.find(
          (variableSource) =>
            variableSource.name === name || variableSource.name === sourceName
        )
      );
      const variableSourceType = variables.find(
        (variable) => variable.name === name || variable.name === sourceName
      )?.sourceType;

      if (!name.length || isAdded || !variableSourceType) return acc;

      return [
        ...acc,
        {
          name: sourceName || name,
          sourceType: sourceType || variableSourceType
        }
      ];
    },
    [] as {
      name: string;
      sourceType: VARIABLE_SOURCE_TYPE | INTEGRATION_VARIABLE_SOURCE_SUB_TYPE;
    }[]
  );

export const updateCaseEntry = ({
  caseEntries,
  category,
  start,
  deleteCount = 0,
  insertEntry
}: {
  caseEntries: CaseEntry[];
  category: CATEGORY;
  start: number;
  deleteCount: number;
  insertEntry?: Entry;
}) =>
  caseEntries.map((caseEntry) => {
    const newColumns = [...caseEntry[category]];

    if (insertEntry) newColumns.splice(start, deleteCount, insertEntry);
    else newColumns.splice(start, deleteCount);

    return {
      ...caseEntry,
      [category]: newColumns
    };
  });

export const getHeaderCellBgColor = (category: CATEGORY) => {
  switch (category) {
    case 'conditions':
      return lightBlue[50];
    case 'actions':
    default:
      return lightGreen[50];
  }
};

export const getFormatedOptions = (
  enumTypeSelectOptions: string | string[]
) => {
  // In case API returns array in string "[ContactTime.Morning,ContactTime.Afternoon]"
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
  category: CATEGORY
) => {
  let usageModes: VARIABLE_USAGE_MODE[];
  const copyVariables = cloneDeep(variables);

  switch (category) {
    case 'conditions':
      usageModes = [
        VARIABLE_USAGE_MODE.WriteOnly,
        VARIABLE_USAGE_MODE.ReadWrite,
        VARIABLE_USAGE_MODE.ReadOnly
      ];

      break;
    case 'actions': {
      // User-defined variables with the data types Object:CraClarity and Object:CraFactorTrust should be excluded from Actions.
      const filteredUserDefinedVariables = copyVariables['userDefined'].filter(
        (variable) =>
          variable.dataType !==
            DATA_TYPE_WITHOUT_ENUM['Object:CraFactorTrust'] &&
          variable.dataType !== DATA_TYPE_WITHOUT_ENUM['Object:CraClarity']
      );

      usageModes = [VARIABLE_USAGE_MODE.ReadWrite];
      copyVariables['userDefined'] = filteredUserDefinedVariables;
      break;
    }
  }

  return mapValues(copyVariables, (arr) =>
    filter(arr, (item) => usageModes.includes(item.usageMode))
  );
};

// We should wrap the string with extra double quotes "\"string value\"" because the backend expects this
export const addExtraDoubleQuotes = (string: string) =>
  string.length ? `"${string}"` : '';

// Unwrap extra double quotes
export const removeExtraDoubleQuotes = (string: string) =>
  string.replace(/^"(.*)"$/, '$1');
