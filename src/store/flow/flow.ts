import { createSlice } from '@reduxjs/toolkit';

import { getFlow, getProductionFlow } from './asyncThunk';

import { IFlow } from '@domain/flow';

// const mockData = {
//   nodes: [
//     {
//       id: 'd41e8b25-9e91-487d-bc32-08cd3526484b',
//       position: {
//         x: 100,
//         y: 500
//       },
//       data: {
//         $type: 'Start',
//         stepId: 'd41e8b25-9e91-487d-bc32-08cd3526484b',
//         stepType: 'Start',
//         name: 'Start'
//       },
//       type: 'Start',
//       width: 40,
//       height: 40,
//       deletable: false
//     },
//     {
//       id: 'a996a266-72d4-4870-a499-457fe94c4b23',
//       position: {
//         x: 600,
//         y: 450
//       },
//       data: {
//         $type: 'Subflow',
//         stepId: 'a996a266-72d4-4870-a499-457fe94c4b23',
//         stepType: 'Subflow',
//         name: 'Subflow',
//         note: 'subflow name',
//         nodes: [
//           {
//             id: '5941d111-39e1-4f6e-b9a9-ac99edf487f7',
//             position: {
//               x: 100,
//               y: 500
//             },
//             data: {
//               $type: 'Start',
//               stepId: '5941d111-39e1-4f6e-b9a9-ac99edf487f7',
//               stepType: 'Start',
//               name: 'Start'
//             },
//             type: 'Start',
//             width: 40,
//             height: 40,
//             deletable: false
//           },
//           {
//             id: 'c6133e85-52eb-418f-ab4e-c05f8dc5995d',
//             position: {
//               x: 600,
//               y: 450
//             },
//             data: {
//               $type: 'Subflow',
//               stepId: 'c6133e85-52eb-418f-ab4e-c05f8dc5995d',
//               stepType: 'Subflow',
//               name: 'Subflow',
//               note: 'subflow name',
//               nodes: [
//                 {
//                   id: '12457549-0683-44bb-bc4a-d3136bd8e6d2',
//                   position: {
//                     x: 100,
//                     y: 500
//                   },
//                   data: {
//                     $type: 'Start',
//                     stepId: '12457549-0683-44bb-bc4a-d3136bd8e6d2',
//                     stepType: 'Start',
//                     name: 'Start'
//                   },
//                   type: 'Start',
//                   width: 40,
//                   height: 40,
//                   deletable: false
//                 },
//                 {
//                   id: '57e4192a-51c3-4c16-9fff-de7cf46a6f56',
//                   position: {
//                     x: 600,
//                     y: 450
//                   },
//                   data: {
//                     $type: 'ChampionChallenger',
//                     stepId: '57e4192a-51c3-4c16-9fff-de7cf46a6f56',
//                     stepType: 'ChampionChallenger',
//                     name: 'ChampionChallenger1',
//                     note: 'blabla1',
//                     splits: [
//                       {
//                         edgeId: '54b703f8-834c-482a-be0f-c64b0d369b01',
//                         percentage: 100
//                       }
//                     ]
//                   },
//                   type: 'ChampionChallenger',
//                   width: 40,
//                   height: 40
//                 },
//                 {
//                   id: '68ab89be-aee5-4ec4-a37f-9cba6fc5d24d',
//                   position: {
//                     x: 500,
//                     y: 500
//                   },
//                   data: {
//                     $type: 'End',
//                     stepId: '68ab89be-aee5-4ec4-a37f-9cba6fc5d24d',
//                     stepType: 'End',
//                     name: 'End'
//                   },
//                   type: 'End',
//                   width: 40,
//                   height: 40,
//                   deletable: false
//                 }
//               ],
//               edges: [
//                 {
//                   id: '04bb4ec3-86eb-4f07-b62a-e73d0c47caf0',
//                   type: 'start-champ',
//                   source: '12457549-0683-44bb-bc4a-d3136bd8e6d2',
//                   target: '57e4192a-51c3-4c16-9fff-de7cf46a6f56'
//                 },
//                 {
//                   id: '54b703f8-834c-482a-be0f-c64b0d369b01',
//                   type: 'champ-end',
//                   source: '57e4192a-51c3-4c16-9fff-de7cf46a6f56',
//                   target: '68ab89be-aee5-4ec4-a37f-9cba6fc5d24d'
//                 }
//               ],
//               viewport: {
//                 x: 100,
//                 y: 200,
//                 zoom: 10
//               }
//             },
//             type: 'subflow',
//             width: 40,
//             height: 40
//           },
//           {
//             id: '80b84eef-135c-4afa-9e1d-5a4194d373d6',
//             position: {
//               x: 500,
//               y: 500
//             },
//             data: {
//               $type: 'End',
//               stepId: '80b84eef-135c-4afa-9e1d-5a4194d373d6',
//               stepType: 'End',
//               name: 'End'
//             },
//             type: 'End',
//             width: 40,
//             height: 40,
//             deletable: false
//           }
//         ],
//         edges: [
//           {
//             id: '6397c3fc-111c-4a5b-b18e-4d8446a031a5',
//             type: 'start-subflow',
//             source: '5941d111-39e1-4f6e-b9a9-ac99edf487f7',
//             target: 'c6133e85-52eb-418f-ab4e-c05f8dc5995d'
//           },
//           {
//             id: '80b84eef-135c-4afa-9e1d-5a4194d373d6',
//             type: 'subflow-end',
//             source: 'c6133e85-52eb-418f-ab4e-c05f8dc5995d',
//             target: '80b84eef-135c-4afa-9e1d-5a4194d373d6'
//           }
//         ],
//         viewport: {
//           x: 100,
//           y: 200,
//           zoom: 10
//         }
//       },
//       type: 'subflow',
//       width: 40,
//       height: 40
//     },
//     {
//       id: 'bbefad64-48a0-42f2-8a47-f2981cf7c4ae',
//       position: {
//         x: 500,
//         y: 500
//       },
//       data: {
//         $type: 'End',
//         stepId: 'bbefad64-48a0-42f2-8a47-f2981cf7c4ae',
//         stepType: 'End',
//         name: 'End'
//       },
//       type: 'End',
//       width: 40,
//       height: 40,
//       deletable: false
//     }
//   ],
//   edges: [
//     {
//       id: '27443478-0542-4390-a990-0e07afece209',
//       type: 'start-subflow',
//       source: 'd41e8b25-9e91-487d-bc32-08cd3526484b',
//       target: 'a996a266-72d4-4870-a499-457fe94c4b23'
//     },
//     {
//       id: 'd5cf83f4-f078-432b-9b3b-9aece85dc3a6',
//       type: 'subflow-end',
//       source: 'a996a266-72d4-4870-a499-457fe94c4b23',
//       target: 'bbefad64-48a0-42f2-8a47-f2981cf7c4ae'
//     }
//   ],
//   constants: [
//     {
//       variableType: 'String',
//       variableName: 'const',
//       variableValue: 'blablabla'
//     }
//   ],
//   temporaryVariables: [
//     {
//       variableType: 'Integer',
//       variableName: 'intVariable',
//       variableValue: '100'
//     }
//   ],
//   permanentVariables: [
//     {
//       variableType: 'Boolean',
//       variableName: 'boolValue',
//       variableValue: 'true'
//     }
//   ],
//   viewport: {
//     x: 100,
//     y: 200,
//     zoom: 10
//   },
//   data: {
//     name: 'flowName',
//     createdBy: 'user'
//   },
//   id: '123'
// };

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
  reducers: {
    setInitialFlow(state) {
      state.flow = initialFlow;
    }
  },
  extraReducers(builder) {
    builder.addCase(getFlow.fulfilled, (state, action) => {
      state.flow = action.payload;
    });
    builder.addCase(getProductionFlow.fulfilled, (state, action) => {
      state.flow = action.payload;
    });
  }
});

export default flowSlicer.reducer;

export const { setInitialFlow } = flowSlicer.actions;
