import { StepType, StepListData } from '../types';

const getListNodesData = (data: StepListData) => {
  switch (data.$type) {
    case StepType.CHAMPION_CHALLENGER:
      return (data.splits || []).map((split) => ({
        id: split.edgeId,
        value: `${split.percentage}%`
      }));
    case StepType.DECISION_TABLE:
      if (!data.caseEntries?.length) return [];
      return [
        ...(data.caseEntries || []).map((entry) => entry.edgeId),
        data.defaultEdgeId
      ].map((edgeId, i) => ({ id: edgeId, value: `Rule #${i + 1}` }));
    default:
      return [];
  }
};

export { getListNodesData };
