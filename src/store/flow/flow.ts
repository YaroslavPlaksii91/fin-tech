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

export const flowSlicer = createSlice({
  name: 'flow',
  initialState,
  reducers: (create) => ({
    setInitialFlow: create.reducer((state) => {
      state.flow = initialFlow;
    }),
    addNode: create.reducer((state, action: PayloadAction<FlowNode>) => {
      state.flow.nodes.push(action.payload);
    }),
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
