import { createSlice } from '@reduxjs/toolkit';
// import { v4 as uuidv4 } from 'uuid';

import { fetchFlow, fetchProductionFlow } from './asyncThunk';

import { IFlow } from '@domain/flow';
// import {
//   ADD_BUTTON_ON_EDGE,
//   StepType
// } from '@components/FlowManagment/FlowChart/types';

interface initialStateInterface {
  flow?: IFlow;
}

const initialState: initialStateInterface = {
  flow: undefined
};

export const flowSlicer = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    addNewNode: () => {
      //   const { id, type, name } = action.payload as {
      //     id: string;
      //     type: StepType;
      //     name: string;
      //   };
      //   const newNodeId = uuidv4();
      //   const newEdgeId = uuidv4();
      //   const newNode = {
      //     id: newNodeId,
      //     type,
      //     data: {
      //       $type: type,
      //       objectId: newNodeId,
      //       objectType: type,
      //       name
      //     },
      //     position: { x: 0, y: 0 }
      //   };
      //   const targetEdgeIndex = state?.flow?.edges.findIndex((x) => x.id === id);
      //   const targetEdge = targetEdgeIndex && state.flow?.edges[targetEdgeIndex];
      //   if (targetEdge) {
      //     const { target: targetNodeId } = targetEdge;
      //     const updatedTargetEdge = { ...targetEdge, target: newNodeId };
      //     state.flow.edges[targetEdgeIndex] = updatedTargetEdge;
      //     state?.flow?.nodes.push(newNode);
      //     const newEdge = {
      //       id: newEdgeId,
      //       source: newNodeId,
      //       target: targetNodeId,
      //       type: ADD_BUTTON_ON_EDGE
      //     };
      //     state.flow?.edges.push(newEdge);
      //   }
      // }
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchFlow.fulfilled, (state, action) => {
      state.flow = action.payload;
    });
    builder.addCase(fetchProductionFlow.fulfilled, (state, action) => {
      state.flow = action.payload;
    });
  }
});

export const { addNewNode } = flowSlicer.actions;

export default flowSlicer.reducer;
