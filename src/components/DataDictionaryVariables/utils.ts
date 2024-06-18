import { Variable, VariableUsageParams } from '@domain/dataDictionary';
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
