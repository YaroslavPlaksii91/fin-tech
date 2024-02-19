import { ReactFlowInstance } from 'reactflow';

import { FlowNode } from '@domain/flow';

export enum StepType {
  CALCULATION = 'Calculation',
  DECISION_TABLE = 'desicion-table',
  CONDITION = 'condition',
  CASE = 'case',
  CHAMPION_CHALLENGER = 'ChampionChallenger',
  SUBFLOW = 'subflow',
  START = 'Start',
  END = 'End'
}

export type FunctionalStepType = Exclude<
  StepType,
  StepType.START | StepType.END
>;

export const ADD_BUTTON_ON_EDGE = 'add-button-on-edge';

export const DEFAULT_EDGE_TYPE = 'smoothstep';

export type EdgeData = {
  onAdd?: (type: StepType, name: string, id: string) => FlowNode;
  animated?: boolean;
};

export type CustomReactFlowInstance = ReactFlowInstance & {
  onAddNodeBetweenEdges: (type: StepType, name: string, edgeId: string) => void;
};
