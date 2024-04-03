import { reportApi } from '@utils/api.ts';

class ReportingService {
  async getLeadRequestsReports(pageNumber: number = 1, pageSize: number = 10) {
    const { data } = await reportApi.get('/lead-request-history-processing', {
      params: {
        pageNumber,
        pageSize
      }
    });
    return data;
  }
}

export const reportingService = new ReportingService();
