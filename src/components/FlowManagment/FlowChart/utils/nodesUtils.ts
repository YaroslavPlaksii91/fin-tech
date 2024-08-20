import { ReactFlowInstance } from 'reactflow';

import { StepType, StepListData } from '../types';

import { FlowNode } from '@domain/flow';
import { Entry, OPERATORS } from '@views/DecisionTable/types';
import { removeExtraDoubleQuotes } from '@views/DecisionTable/utils';

const getTooltipText = (entries: Entry[]) =>
  entries.reduce((acc, { name, operator, expression }, index) => {
    const textPieces = [];
    const hasDividingWord = index !== entries.length - 1;
    const hasWordsToCompare = name && expression;
    const isAnyOperator = operator === OPERATORS.ANY;
    const anyOperatorText = isAnyOperator && name ? operator : '';
    const defaultOperatorText =
      !isAnyOperator && hasWordsToCompare ? operator || '=' : '';

    textPieces.push(
      acc,
      name,
      anyOperatorText || defaultOperatorText,
      removeExtraDoubleQuotes(expression)
    );

    if (hasDividingWord && name) textPieces.push('and');
    if (!hasDividingWord) textPieces.push('then Go to step');

    return textPieces.join(' ');
  }, '');

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
        const prepairedTooltipText = getTooltipText(entry?.conditions || []);

        return {
          id: entry.edgeId,
          value: `Rule #${i + 1}`,
          tooltipText: `${prepairedTooltipText} ${node?.data?.name || ''}`
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
