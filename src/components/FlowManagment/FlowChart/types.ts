import { ReactFlowInstance, XYPosition } from 'reactflow';

import {
  ChampionChallengerData,
  DecisionTableData,
  FlowNode,
  NodeData,
  IFlow
} from '@domain/flow';

export enum StepType {
  DECISION_TABLE = 'DecisionTable',
  CALCULATION = 'Calculation',
  CHAMPION_CHALLENGER = 'ChampionChallenger',
  SUBFLOW = 'Subflow',
  START = 'Start',
  END = 'End'
}

// TODO: Rename functional step type
export type FunctionalStepType = Exclude<
  StepType,
  StepType.START | StepType.END
>;

export const ADD_BUTTON_ON_EDGE = 'add-button-on-edge';

export const DEFAULT_EDGE_TYPE = 'smoothstep';

export type EdgeData = {
  onAdd: (
    type: StepType,
    name: string,
    id: string
  ) => { newNode: FlowNode; subFlowId: string };
  animated?: boolean;
};

export type CustomReactFlowInstance = ReactFlowInstance & {
  onAddNodeBetweenEdges: (
    type: StepType,
    name: string,
    edgeId: string,
    nodePosition: XYPosition
  ) => void;
};

export type StepListData = NodeData &
  ChampionChallengerData &
  DecisionTableData;
export interface StepConfigureViewProps {
  flow: IFlow;
  rfInstance: CustomReactFlowInstance;
  isViewMode: boolean;
  mainFlowRfInstance?: CustomReactFlowInstance;
  mainFlow?: IFlow;
}

export interface ControlPanelProps {
  flow: IFlow;
  mainFlow?: IFlow;
  isDirty: boolean;
  setCopyFlow: (flow: IFlow) => void;
  rfInstance: CustomReactFlowInstance;
  isViewMode: boolean;
}

export type CustomEventDetail = { subFlowId: string; deleteNodes: FlowNode[] };
