import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getFlow, getProductionFlow, saveFlow } from './asyncThunk';
import { addNodeToSubflow, removeNodes, updateNodes } from './utils';

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
          state.flow.nodes = addNodeToSubflow(
            nodes,
            action.payload.flowId,
            action.payload.node
          );
        }
      }
    ),
    deleteNodes: create.reducer(
      (
        state,
        action: PayloadAction<{
          deletedNodes: FlowNode[];
        }>
      ) => {
        const { nodes } = state.flow;
        state.flow.nodes = removeNodes(nodes, action.payload.deletedNodes);
      }
    ),
    updateNodeData: create.reducer(
      (state, action: PayloadAction<{ node: FlowNode }>) => {
        const { nodes } = state.flow;
        state.flow.nodes = updateNodes(nodes, action.payload.node);
      }
    ),
    updateFlowData: create.reducer(
      (state, action: PayloadAction<Omit<FlowData, 'id'>>) => {
        state.flow.data = action.payload;
      }
    ),
    updateFlow: create.reducer((state, action: PayloadAction<IFlow>) => {
      state.flow = action.payload;
    })
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

export const {
  setInitialFlow,
  addNode,
  deleteNodes,
  updateFlowData,
  updateFlow,
  updateNodeData
} = flowSlicer.actions;
