import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';

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

const addNodeToSubflowHelper = (
  nodes: FlowNode[],
  subflowId: string,
  newNode: FlowNode
): FlowNode[] =>
  nodes.map((node) => {
    if (node.id === subflowId && node.data.nodes) {
      return {
        ...node,
        nodes: [...node.data.nodes, newNode]
      };
    }
    if (node.data.nodes) {
      return {
        ...node,
        nodes: addNodeToSubflowHelper(node.data.nodes, subflowId, newNode)
      };
    }
    return node;
  });

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
          const nodes = addNodeToSubflowHelper(
            current(state.flow.nodes),
            action.payload.flowId,
            action.payload.node
          );
          state.flow = {
            ...state.flow,
            nodes
          };
        }
      }
    ),
    deleteNodes: create.reducer((state, action: PayloadAction<FlowNode[]>) => {
      state.flow.nodes = state.flow.nodes.filter((node) =>
        action.payload.find((item) => item.id !== node.id)
      );
    }),
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
