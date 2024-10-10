import { dataDictionaryService } from '@services/data-dictionary';
import { integrationsService } from '@services/integrations';
import { createAppAsyncThunk } from '@store/utils';

export const fetchVariables = createAppAsyncThunk(
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

export const fetchIntegrationVariables = createAppAsyncThunk(
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

export const fetchControlFiles = createAppAsyncThunk(
  'dataDictionary/fetchControlFiles',
  async (_, { rejectWithValue, getState }) => {
    const {
      dataDictionary: { controlFiles }
    } = getState();

    if (controlFiles.length > 0) return controlFiles;

    try {
      const response = await integrationsService.getCRAClarityControlFiles();
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
