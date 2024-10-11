import { DataDictionaryVariable } from '@domain/dataDictionary';
import { integrationApi } from '@utils/api';

class IntegrationsService {
  async getCRAClarityControlFiles() {
    const { data } = await integrationApi.get<string[]>(
      '/cra-clarity/controlfiles'
    );

    return data;
  }

  async getIntegrationVariables() {
    const { data } =
      await integrationApi.get<Record<string, DataDictionaryVariable[]>>(
        '/data-dictionary'
      );
    return data;
  }
}

export const integrationsService = new IntegrationsService();
