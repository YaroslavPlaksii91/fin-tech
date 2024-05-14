import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getFlow, getProductionFlow, saveFlow } from './asyncThunk';

import { FlowData, FlowNode, IFlow } from '@domain/flow';

const initialFlow: IFlow = {
  id: '',
  nodes: [],
  edges: [],
  data: {
    name: '',
    createdBy: '',
    createdOn: '',
    editedBy: '',
    editedOn: ''
  },
  temporaryVariables: [],
  permanentVariables: [],
  viewport: { x: 0, y: 0, zoom: 1 }
};

interface initialStateInterface {
  flow: IFlow;
}

const initialState: initialStateInterface = {
  flow: initialFlow
};

function addNodeToSubflow(
  nodes: FlowNode[],
  subflowId: string,
  newNode: FlowNode
): void {
  for (const node of nodes) {
    if (node.id === subflowId) {
      node.data.nodes.push(newNode);
      return;
    }
    if (node.data.nodes) {
      addNodeToSubflow(node.data.nodes, subflowId, newNode);
    }
  }
}

function removeNodesInSubflow(
  nodes: FlowNode[],
  deleteNodes: FlowNode[],
  subflowId: string
): FlowNode[] {
  return nodes.map((node) => {
    if (node.id === subflowId) {
      return {
        ...node,
        data: {
          ...node.data,
          nodes: node.data.nodes.filter(
            (node) => !deleteNodes.find((item) => item.id === node.id)
          )
        }
      };
    } else if (node.data.nodes) {
      return {
        ...node,
        nodes: removeNodesInSubflow(node.data.nodes, deleteNodes, subflowId)
      };
    }
    return node;
  });
}

export const flowSlicer = createSlice({
  name: 'flow',
  initialState,
  reducers: (create) => ({
    setInitialFlow: create.reducer((state) => {
      state.flow = initialFlow;
    }),
    addNode: create.reducer(
      (state, action: PayloadAction<{ node: FlowNode; flowId: string }>) => {
        if (state.flow.id === action.payload.flowId) {
          state.flow.nodes.push(action.payload.node);
        } else {
          const { nodes } = state.flow;
          addNodeToSubflow(nodes, action.payload.flowId, action.payload.node);
        }
      }
    ),
    deleteNodes: create.reducer(
      (
        state,
        action: PayloadAction<{ deletedNodes: FlowNode[]; flowId: string }>
      ) => {
        if (state.flow.id === action.payload.flowId) {
          state.flow.nodes = state.flow.nodes.filter((node) =>
            action.payload.deletedNodes.find((item) => item.id !== node.id)
          );
        } else {
          const { nodes } = state.flow;
          state.flow.nodes = removeNodesInSubflow(
            nodes,
            action.payload.deletedNodes,
            action.payload.flowId
          );
        }
      }
    ),
    updateFlowData: create.reducer(
      (state, action: PayloadAction<Omit<FlowData, 'id'>>) => {
        state.flow.data = action.payload;
      }
    )
  }),
  extraReducers(builder) {
    builder.addCase(getFlow.fulfilled, (state, action) => {
      state.flow = action.payload;
    });
    builder.addCase(getProductionFlow.fulfilled, (state, action) => {
      state.flow = action.payload;
    });
    builder.addCase(saveFlow.fulfilled, (state, action) => {
      state.flow = action.payload;
    });
  }
});

export default flowSlicer.reducer;

export const { setInitialFlow, addNode, deleteNodes, updateFlowData } =
  flowSlicer.actions;
