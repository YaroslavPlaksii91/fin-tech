import { FILTER_BY, TAB } from './types';
import { TABS } from './constants';

import {
  DATA_TYPE_WITHOUT_ENUM,
  INTEGRATION_VARIABLE_SOURCE_SUB_TYPE,
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
  dataType: DATA_TYPE_WITHOUT_ENUM,
  enumDataTypes: string[]
) => ({
  isWithEnum: enumDataTypes.includes(dataType),
  isBoolean: dataType === DATA_TYPE_WITHOUT_ENUM.Boolean,
  isString: dataType === DATA_TYPE_WITHOUT_ENUM.String,
  isInteger: dataType === DATA_TYPE_WITHOUT_ENUM.Integer,
  isDecimal: dataType === DATA_TYPE_WITHOUT_ENUM.Decimal
});

export const getFiltersGroup = (enumDataTypes: string[]) => [
  {
    filterBy: FILTER_BY.dataType,
    text: 'By Data Type',
    fields: [...Object.values(DATA_TYPE_WITHOUT_ENUM), ...enumDataTypes],
    applyFor: Object.values(TABS) as TAB[]
  },
  {
    filterBy: FILTER_BY.source,
    text: 'By CRA',
    fields: Object.values(INTEGRATION_VARIABLE_SOURCE_TYPE),
    applyFor: [TABS.craReportVariables] as TAB[]
  },
  {
    filterBy: FILTER_BY.sourceType,
    text: 'By Report Name',
    fields: Object.values(INTEGRATION_VARIABLE_SOURCE_SUB_TYPE),
    applyFor: [TABS.craReportVariables] as TAB[]
  }
];
