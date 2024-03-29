import { map } from 'lodash';

import {
  UserDefinedVariable,
  VariableUsageParams
} from '@domain/dataDictionary';
import { dataDictionaryService } from '@services/data-dictionary';
import { FlowNode } from '@domain/flow';
import Logger from '@utils/logger';

export const getUserDefinedUsage = async (
  flowId: string,
  variables: Pick<
    UserDefinedVariable,
    'name' | 'dataType' | 'defaultValue' | 'description' | 'sourceType'
  >[]
) => {
  try {
    const responseData =
      await dataDictionaryService.getUserDefinedVariableUsage(
        flowId,
        map(variables, 'name')
      );

    return responseData;
  } catch (error) {
    Logger.error('Error fetching variable usage in the flow:', error);
  }
};

export const getUserDefinedUsageNodes = ({
  userDefinedUsage,
  variable,
  flowNodes
}: {
  userDefinedUsage: VariableUsageParams;
  variable: Pick<
    UserDefinedVariable,
    'name' | 'dataType' | 'defaultValue' | 'description' | 'sourceType'
  >;
  flowNodes: FlowNode[];
}) => {
  const usageNodes: FlowNode[] = [];

  userDefinedUsage
    .filter((el) => el.name === variable.name)
    .forEach((variable) => {
      const node = flowNodes.find((node) => node.id === variable.path[0]);
      node && usageNodes.push(node);
    });
  return usageNodes;
};
