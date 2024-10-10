import { createSlice } from '@reduxjs/toolkit';

import {
  fetchVariables,
  fetchIntegrationVariables,
  fetchControlFiles
} from './asyncThunk';
import { getEnumDataTypes } from './utils';

import {
  CRA_REPORT_VARIABLES,
  DataDictionaryVariables
} from '@domain/dataDictionary';

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
