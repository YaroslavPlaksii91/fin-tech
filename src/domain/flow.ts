import { Edge, Node, Viewport } from '@reactflow/core';

import { IEntity } from './entity';
import {
  VARIABLE_DATA_TYPE,
  CONTROL_FILES,
  DataDictionaryVariable,
  VARIABLE_SOURCE_TYPE
} from './dataDictionary';

import { StepType } from '@components/FlowManagment/FlowChart/types';
import { CaseEntry, Entry } from '@views/DecisionTable/types';

export interface IFlowListItem extends IEntity {
  name: string;
}

export type FlowData = {
  id: string;
  name: string;
  createdBy: string;
  createdOn: string;
  editedBy: string;
  editedOn: string;
};

export type NodeData = {
  $type: `${StepType}`;
  stepId: string;
  stepType: `${StepType}`;
  name: string;
  editedBy: string;
  editedOn: string;
  tag?: string;
  note?: string | null;
};

export type ChampionChallengerData = {
  splits?: { edgeId: string | null; percentage: number }[];
};

export type DecisionTableData = {
  caseEntries?: CaseEntry[];
  defaultActions?: Entry[];
  variableSources?: {
    name: string;
    sourceType: VARIABLE_SOURCE_TYPE | CONTROL_FILES;
  }[];
  defaultEdgeId?: string | null;
};

export type ExpressionVariableSources = {
  name: string;
  sourceType: VARIABLE_SOURCE_TYPE | CONTROL_FILES;
}[];

export type Expression = {
  outputName: string;
  expressionString: string;
  destinationType: string;
  destinationDataType: VARIABLE_DATA_TYPE;
  variableSources: ExpressionVariableSources;
};

export type CalculationData = {
  expressions?: Expression[];
};

export type SubFlowData = {
  nodes: FlowNode[];
  edges: Edge[];
  viewport: Viewport;
};

export type FlowNode = Node<
  NodeData &
    ChampionChallengerData &
    CalculationData &
    DecisionTableData &
    Optional<SubFlowData, 'nodes' | 'edges' | 'viewport'>
>;

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export interface IFlow {
  id: string;
  nodes: FlowNode[];
  edges: Edge[];
  viewport: Viewport;
  data: Omit<FlowData, 'id'>;
  temporaryVariables: Pick<
    DataDictionaryVariable,
    'dataType' | 'defaultValue' | 'description' | 'name'
  >[];
  permanentVariables: Pick<
    DataDictionaryVariable,
    'dataType' | 'defaultValue' | 'description' | 'name'
  >[];
}

type FlowDataCreate = Pick<FlowData, 'name' | 'createdBy' | 'editedBy'>;

export type IFlowDataCreate = Omit<IFlow, 'id' | 'data'> & {
  data: FlowDataCreate;
};
