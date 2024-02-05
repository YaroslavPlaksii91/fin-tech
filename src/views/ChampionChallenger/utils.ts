import { FlowNode } from '@domain/flow';
import { StepType } from '@components/FlowManagment/FlowChart/types';

export const getConnectableNodes = (nodes: FlowNode[], currentNodeId: string) =>
  nodes.filter(
    (node) => node.id !== currentNodeId && node.type !== StepType.START
  );
