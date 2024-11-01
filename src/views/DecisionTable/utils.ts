import { lightGreen, lightBlue } from '@mui/material/colors';
import { mapValues, filter, cloneDeep } from 'lodash';

import {
  CaseEntry,
  Entry,
  Operator,
  OPERATORS,
  CATEGORY,
  FormFieldsProps
} from './types';

import {
  VARIABLE_DATA_TYPE,
  CONTROL_FILES,
  VARIABLE_SOURCE_TYPE,
  VARIABLE_USAGE_MODE,
  Variable
} from '@domain/dataDictionary';
import { checkDataType } from '@components/DataDictionaryVariables/utils';

export const getOperatorOptions = ({
  isWithEnum,
  isString,
  isInteger,
  isDecimal,
  isStringArray
}: ReturnType<typeof checkDataType>) => {
  let operators: Operator[] = [];

  switch (true) {
    case isWithEnum:
      operators = [
        OPERATORS.IN,
        OPERATORS.NOT_IN,
        OPERATORS.EQUAL,
        OPERATORS.NOT_EQUAL
      ];
      break;
    case isString:
      operators = [
        OPERATORS.IN,
        OPERATORS.NOT_IN,
        OPERATORS.CONTAINS,
        OPERATORS.DOESNOTCONTAIN,
        OPERATORS.EQUAL,
        OPERATORS.NOT_EQUAL
      ];
      break;
    case isInteger:
    case isDecimal:
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
    case isStringArray:
      operators = [];
      break;
    default:
      operators = [OPERATORS.EQUAL, OPERATORS.NOT_EQUAL];
  }

  return [...operators, OPERATORS.ANY].map((operator) => ({
    label: operator,
    value: operator
  }));
};

export const getColumns = (
  entries: Entry[],
  variables: Variable[],
  enumDataTypes: string[],
  category: CATEGORY
) =>
  entries.map((el, index) => {
    const variable = variables.find((variable) => variable.name === el.name);

    // if variable enum type we have additional prop with allowedValues
    const allowedValues =
      variable?.dataType &&
      checkDataType(variable.dataType, enumDataTypes).isWithEnum
        ? variable?.allowedValues
        : undefined;

    // pass data type directly to prevent issues with the object properties
    const dataType =
      el.dataType || variable?.dataType || VARIABLE_DATA_TYPE.String;

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
    (
      acc,
      { name, sourceName, sourceType, isDataDictionaryExpression, expression }
    ) => {
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

      acc.push({
        name: sourceName || name,
        sourceType: sourceType || variableSourceType
      });

      if (isDataDictionaryExpression) {
        const variableName = expression.split(/\.(.+)/)[0];
        const isVariableAdded = Boolean(
          acc.find((variableSource) => variableSource.name === variableName)
        );
        const expressionSourceType = variables.find(
          (variable) => variable.name === variableName
        )?.sourceType;

        if (expressionSourceType && !isVariableAdded) {
          acc.push({
            name: variableName,
            sourceType: expressionSourceType
          });
        }
      }

      return acc;
    },
    [] as {
      name: string;
      sourceType: VARIABLE_SOURCE_TYPE | CONTROL_FILES;
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

export const getFormattedOptions = (
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
          variable.dataType !== VARIABLE_DATA_TYPE['Object:CraFactorTrust'] &&
          variable.dataType !== VARIABLE_DATA_TYPE['Object:CraClarity']
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

export const getFormatedValue = (data: FormFieldsProps): string => {
  let formatedValue: string = '';

  switch (data.operator) {
    case OPERATORS.EQUAL:
    case OPERATORS.NOT_EQUAL:
      formatedValue = Array.isArray(data.value)
        ? data.value[0]
        : (data.value ?? '');
      break;
    case OPERATORS.ANY:
      formatedValue = '';
      break;
    case OPERATORS.BETWEEN:
      formatedValue = `${data.lowerBound} and ${data.upperBound}`;
      break;
    default:
      formatedValue = Array.isArray(data.value)
        ? `[${data.value.join(',')}]`
        : (data.value ?? '');
  }

  return formatedValue;
};

export const getFormattedRules = (data: CaseEntry[]) =>
  data.map((rule, index) => {
    const conditions = rule.conditions
      .map((condition) => {
        const { name, operator, expression } = condition;
        const operatorMapping: Record<string, string> = {
          any: 'is any',
          between: 'is between'
        };
        const operatorStr = operatorMapping[operator] || operator;

        return `${name} ${operatorStr} ${expression}`.trim();
      })
      .filter(Boolean);

    const actions = rule.actions
      .map((action) =>
        action.expression
          ? `${action.name} = ${action.expression}`
          : action.name
      )
      .filter(Boolean);

    return {
      keyword:
        index === 0 ? 'If' : index < data.length - 1 ? 'Else if' : 'Else',
      conditions,
      actions,
      edgeId: rule.edgeId
    };
  });
