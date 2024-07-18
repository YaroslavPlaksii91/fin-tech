import { integrationApi } from '@utils/api';

class IntegrationsService {
  async getCRAClarityControlFiles() {
    const { data } = await integrationApi.get<string[]>(
      '/cra-clarity/controlfiles'
    );

    return data;
  }
}

export const integrationsService = new IntegrationsService();
