import {
  DATA_DICTIONARY_GROUP,
  DataDictionaryVariables,
  VARIABLE_SOURCE_TYPE,
  VARIABLE_USAGE_MODE
} from '@domain/dataDictionary';
import { FlowNode, IFlow } from '@domain/flow';

export function addNodeToSubflow(
  nodes: FlowNode[],
  subflowId: string,
  newNode: FlowNode
): FlowNode[] {
  return nodes.map((node) => {
    if (node.id === subflowId) {
      return {
        ...node,
        data: {
          ...node.data,
          nodes: [...(node.data.nodes ?? []), newNode]
        }
      };
    }
    if (node.data.nodes) {
      return {
        ...node,
        data: {
          ...node.data,
          nodes: addNodeToSubflow(node.data.nodes, subflowId, newNode)
        }
      };
    }
    return node;
  });
}

export function removeNodes(nodes: FlowNode[], deleteNodes: FlowNode[]) {
  const deleteIds = new Set(deleteNodes.map((node) => node.id));

  function filterNodes(node: FlowNode) {
    if (deleteIds.has(node.id)) {
      return null;
    }

    if (node.data?.nodes) {
      node.data.nodes = node.data.nodes
        .map((node) => filterNodes(node))
        .filter((node) => node !== null) as FlowNode[];
    }

    return node;
  }

  return nodes
    .map((node) => filterNodes(node))
    .filter((node) => node !== null) as FlowNode[];
}

export function updateNodes(
  nodes: FlowNode[],
  updateNode: FlowNode
): FlowNode[] {
  function update(nodes: FlowNode[]): FlowNode[] {
    return nodes.map((node) => {
      if (node.id === updateNode.id) {
        return {
          ...node,
          data: {
            ...node.data,
            name: updateNode.data.name
          }
        };
      }

      if (node.data?.nodes) {
        return {
          ...node,
          data: {
            ...node.data,
            nodes: update(node.data.nodes)
          }
        };
      }

      return node;
    });
  }

  return update(nodes);
}

export const getExtendedUserDefinedVariables = ({
  temporaryVariables,
  permanentVariables
}: IFlow): DataDictionaryVariables => ({
  [DATA_DICTIONARY_GROUP.userDefined]: [
    ...temporaryVariables.map((variable) => ({
      ...variable,
      source: VARIABLE_SOURCE_TYPE.TemporaryVariable,
      usageMode: VARIABLE_USAGE_MODE.ReadWrite,
      sourceType: VARIABLE_SOURCE_TYPE.TemporaryVariable,
      destinationType: VARIABLE_SOURCE_TYPE.TemporaryVariable
    })),
    ...permanentVariables.map((variable) => ({
      ...variable,
      source: VARIABLE_SOURCE_TYPE.PermanentVariable,
      usageMode: VARIABLE_USAGE_MODE.ReadWrite,
      sourceType: VARIABLE_SOURCE_TYPE.PermanentVariable,
      destinationType: VARIABLE_SOURCE_TYPE.PermanentVariable
    }))
  ]
});
