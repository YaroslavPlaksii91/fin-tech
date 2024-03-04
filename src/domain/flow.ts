import { Edge, Node, Viewport } from '@reactflow/core';

import { IEntity } from './entity';
import {
  DATA_TYPE,
  TemporaryVariable,
  VARIABLE_DESTINATION_TYPE,
  VARIABLE_SOURCE_TYPE
} from './dataDictionary';

import { StepType } from '@components/FlowManagment/FlowChart/types';

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
  $type: StepType;
  stepId: string;
  stepType: StepType;
  name: string;
  tag?: string;
  note?: string | null;
};

export type ChampionChallengerData = {
  splits?: { edgeId: string | null; percentage: number }[];
};

export type Expression = {
  outputVariableName: string;
  expressionString: string;
  destinationType: VARIABLE_DESTINATION_TYPE;
  destinationDataType: DATA_TYPE;
  inputVariables: {
    variableName: string;
    sourceType: VARIABLE_SOURCE_TYPE;
  }[];
};

export type CalculationData = {
  expressions?: Expression[];
};

export type FlowNode = Node<
  NodeData & ChampionChallengerData & CalculationData
>;

export interface IFlow {
  id: string;
  nodes: FlowNode[];
  edges: Edge[];
  viewport: Viewport;
  data: Omit<FlowData, 'id'>;
  temporaryVariables: TemporaryVariable[];
  permanentVariables: null;
}

type FlowDataCreate = Pick<FlowData, 'name' | 'createdBy' | 'editedBy'>;

export type IFlowDataCreate = Omit<IFlow, 'id' | 'data'> & {
  data: FlowDataCreate;
};
