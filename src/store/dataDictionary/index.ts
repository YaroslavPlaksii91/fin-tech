import { createSlice } from '@reduxjs/toolkit';

import {
  fetchVariables,
  fetchIntegrationVariables,
  fetchControlFiles
} from './asyncThunk';
import { getEnumDataTypes, getUserDefinedVariables } from './utils';

import {
  CRA_REPORT_VARIABLES,
  DataDictionaryVariables
} from '@domain/dataDictionary';
import { getFlow, getProductionFlow, updateFlow } from '@store/flow/asyncThunk';

const initialState: {
  variables: DataDictionaryVariables;
  integrationVariables: DataDictionaryVariables;
  enumDataTypes: string[];
  controlFiles: string[];
} = {
  variables: {},
  integrationVariables: {
    [CRA_REPORT_VARIABLES.craClarityReportVariables]: [],
    [CRA_REPORT_VARIABLES.craFactorTrustReportVariables]: []
  },
  enumDataTypes: [],
  controlFiles: []
};

const dataDictionarySlice = createSlice({
  name: 'dataDictionary',
  initialState,
  reducers: (create) => ({
    setEnumDataTypes: create.reducer((state) => {
      state.enumDataTypes = getEnumDataTypes(state);
    })
  }),
  extraReducers: (builder) => {
    // @TODO: Find the way do not mix userDefinedVariables with dataDictionary
    builder.addCase(getFlow.fulfilled, (state, { payload }) => {
      state.variables = {
        ...state.variables,
        ...getUserDefinedVariables(payload)
      };
    });
    // @TODO: Find the way do not mix userDefinedVariables with dataDictionary
    builder.addCase(getProductionFlow.fulfilled, (state, { payload }) => {
      state.variables = {
        ...state.variables,
        ...getUserDefinedVariables(payload)
      };
    });
    // @TODO: Find the way do not mix userDefinedVariables with dataDictionary
    builder.addCase(updateFlow.fulfilled, (state, { payload }) => {
      state.variables = {
        ...state.variables,
        ...getUserDefinedVariables(payload)
      };
    });
    builder.addCase(fetchVariables.fulfilled, (state, { payload }) => {
      state.variables = payload;
    });
    builder.addCase(
      fetchIntegrationVariables.fulfilled,
      (state, { payload: { lmsInputVariables, ...integrationVariables } }) => {
        state.variables = { ...state.variables, lmsInputVariables };
        state.integrationVariables = integrationVariables;
      }
    );
    builder.addCase(fetchControlFiles.fulfilled, (state, { payload }) => {
      state.controlFiles = payload;
    });
  }
});

export default dataDictionarySlice.reducer;

export const { setEnumDataTypes } = dataDictionarySlice.actions;
