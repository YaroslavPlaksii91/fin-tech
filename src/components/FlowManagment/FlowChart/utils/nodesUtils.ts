import { ReactFlowInstance } from 'reactflow';

import { StepType, StepListData } from '../types';

import { FlowNode } from '@domain/flow';

const getListNodesData = (
  data: StepListData,
  rfInstance: ReactFlowInstance
) => {
  switch (data.$type) {
    case StepType.CHAMPION_CHALLENGER:
      return (data.splits || []).map((split) => ({
        id: split.edgeId,
        value: `${split.percentage}%`,
        tooltipText: ''
      }));
    case StepType.DECISION_TABLE: {
      if (!data.caseEntries?.length) return [];

      const defaultStepId = rfInstance.getEdge(
        data.defaultEdgeId || ''
      )?.target;
      const defaultNode = rfInstance.getNode(defaultStepId || '') as FlowNode;

      const caseEntriesData = data.caseEntries.map((entry, i) => {
        const stepId = rfInstance.getEdge(entry.edgeId || '')?.target;
        const node = rfInstance.getNode(stepId || '') as FlowNode;

        const prepairedTooltipText = entry.conditions.reduce(
          (acc, action) =>
            `${acc} ${action.name} ${action.operator} ${action.expression} and`,
          'If'
        );

        return {
          id: entry.edgeId,
          value: `Rule #${i + 1}`,
          tooltipText: `${prepairedTooltipText} then Go to step ${node?.data?.name || ''}`
        };
      });

      const defaultEntriesData = {
        id: data.defaultEdgeId,
        value: `Else`,
        tooltipText: `Go to step ${defaultNode?.data?.name || ''}`
      };

      return [...caseEntriesData, defaultEntriesData];
    }
    default:
      return [];
  }
};

export { getListNodesData };
