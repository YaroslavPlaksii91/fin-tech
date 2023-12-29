import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import { fetchFlow, fetchProductionFlow } from './asyncThunk';

import { IFlow } from '@domain/flow';
import {
  ADD_BUTTON_ON_EDGE,
  StepType
} from '@components/FlowManagment/FlowChart/types';

interface initialStateInterface {
  flow: IFlow;
}

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
  viewport: { x: 0, y: 0, zoom: 1 }
};

const initialState: initialStateInterface = {
  flow: initialFlow
};

export const flowSlicer = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    addNewNodeWithEdges: (state, action) => {
      const { id, type, name } = action.payload as {
        id: string;
        type: StepType;
        name: string;
      };
      const newNodeId = uuidv4();
      const newEdgeId = uuidv4();
      const newNode = {
        id: newNodeId,
        type,
        data: {
          $type: type,
          stepId: newNodeId,
          stepType: type,
          name,
          splits: [
            {
              edgeId: newEdgeId,
              percentage: 100
            }
          ]
        },
        position: { x: 0, y: 0 }
      };
      const targetEdgeIndex = state.flow.edges.findIndex((x) => x.id === id);
      const targetEdge = state.flow.edges[targetEdgeIndex];
      if (targetEdge) {
        const { target: targetNodeId } = targetEdge;
        const updatedTargetEdge = { ...targetEdge, target: newNodeId };
        state.flow.edges[targetEdgeIndex] = updatedTargetEdge;
        state.flow.nodes.push(newNode);
        const newEdge = {
          id: newEdgeId,
          source: newNodeId,
          target: targetNodeId,
          type: ADD_BUTTON_ON_EDGE
        };
        state.flow?.edges.push(newEdge);
      }
    },
    addNewNode: (state, action) => {
      const { type, name } = action.payload as {
        type: StepType;
        name: string;
      };
      const newNodeId = uuidv4();
      const newNode = {
        id: newNodeId,
        type,
        data: {
          $type: type,
          stepId: newNodeId,
          stepType: type,
          name
        },
        position: { x: 100, y: -100 }
      };

      state.flow.nodes.push(newNode);
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

export const { addNewNodeWithEdges, addNewNode } = flowSlicer.actions;

export default flowSlicer.reducer;
