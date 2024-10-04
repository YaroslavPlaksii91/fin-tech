import { createAsyncThunk } from '@reduxjs/toolkit';

import { dataDictionaryService } from '@services/data-dictionary';
import { integrationsService } from '@services/integrations';

export const fetchVariables = createAsyncThunk(
  'dataDictionary/fetchVariables',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dataDictionaryService.getDataDictionaryVariables();
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchIntegrationVariables = createAsyncThunk(
  'dataDictionary/fetchIntegrationVariables',
  async (_, { rejectWithValue }) => {
    try {
      const response = await integrationsService.getIntegrationVariables();
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
