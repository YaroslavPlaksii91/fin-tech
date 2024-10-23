import { FILTER_BY, TAB } from './types';
import { TABS_KEYS } from './constants';

import {
  VARIABLE_DATA_TYPE,
  CONTROL_FILES,
  INTEGRATION_VARIABLE_SOURCE_TYPE,
  Variable,
  VariableUsageParams
} from '@domain/dataDictionary';
import { dataDictionaryService } from '@services/data-dictionary';
import Logger from '@utils/logger';

export const getUserDefinedUsage = async (
  flowId: string,
  variables: string[]
) => {
  try {
    const responseData =
      await dataDictionaryService.getUserDefinedVariableUsage(
        flowId,
        variables
      );

    return responseData;
  } catch (error) {
    Logger.error('Error fetching variable usage in the flow:', error);
  }
};

export const getProductionUserDefinedUsage = async (variables: string[]) => {
  try {
    const responseData =
      await dataDictionaryService.getProductionUserDefinedVariableUsage(
        variables
      );

    return responseData;
  } catch (error) {
    Logger.error('Error fetching variable usage in the flow:', error);
  }
};

export const getUserDefinedUsageStepIds = ({
  userDefinedUsage,
  variable
}: {
  userDefinedUsage: VariableUsageParams;
  variable: Variable;
}) => {
  const stepIds: string[] = [];

  userDefinedUsage
    .filter((el) => el.name === variable.name)
    .forEach((variable) => {
      const lastStepId = variable.path[variable.path.length - 1];
      stepIds.push(lastStepId);
    });

  return stepIds;
};

export const checkDataType = (
  dataType: VARIABLE_DATA_TYPE,
  enumDataTypes: string[]
) => ({
  isWithEnum: enumDataTypes.includes(dataType),
  isBoolean: dataType === VARIABLE_DATA_TYPE.Boolean,
  isString: dataType === VARIABLE_DATA_TYPE.String,
  isInteger: dataType === VARIABLE_DATA_TYPE.Integer,
  isDecimal: dataType === VARIABLE_DATA_TYPE.Decimal,
  isStringArray: dataType === VARIABLE_DATA_TYPE.StringArray
});

export const getFiltersGroup = (enumDataTypes: string[]) => [
  {
    filterBy: FILTER_BY.dataType,
    text: 'By Data Type',
    fields: [...Object.values(VARIABLE_DATA_TYPE), ...enumDataTypes],
    applyFor: Object.values(TABS_KEYS) as TAB[]
  },
  {
    filterBy: FILTER_BY.source,
    text: 'By CRA',
    fields: Object.values(INTEGRATION_VARIABLE_SOURCE_TYPE),
    applyFor: [TABS_KEYS.craReportVariables] as TAB[]
  },
  {
    filterBy: FILTER_BY.sourceType,
    text: 'By Report Name',
    fields: Object.values(CONTROL_FILES),
    applyFor: [TABS_KEYS.craReportVariables] as TAB[]
  }
];
