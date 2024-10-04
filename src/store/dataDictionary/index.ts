import { createSlice } from '@reduxjs/toolkit';

import { fetchVariables, fetchIntegrationVariables } from './asyncThunk';
import { getEnumDataTypes, getUserDefinedVariables } from './utils';

import {
  CRA_REPORT_VARIABLES,
  DataDictionaryVariables
} from '@domain/dataDictionary';
import { getFlow, getProductionFlow } from '@store/flow/asyncThunk';

const initialState: {
  variables: DataDictionaryVariables;
  integrationVariables: DataDictionaryVariables;
  enumDataTypes: string[];
} = {
  variables: {},
  integrationVariables: {
    [CRA_REPORT_VARIABLES.craClarityReportVariables]: [],
    [CRA_REPORT_VARIABLES.craFactorTrustReportVariables]: []
  },
  enumDataTypes: []
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
    builder.addCase(getFlow.fulfilled, (state, { payload }) => {
      state.variables = {
        ...state.variables,
        ...getUserDefinedVariables(payload)
      };
    });
    builder.addCase(getProductionFlow.fulfilled, (state, { payload }) => {
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
  }
});

export default dataDictionarySlice.reducer;

export const { setEnumDataTypes } = dataDictionarySlice.actions;
