import { LeadRequestsReportsOData } from '@domain/leadRequestsReports';
import { reportApi } from '@utils/api.ts';

class ReportingService {
  async getLeadRequestsReports(params: string) {
    const { data } = await reportApi.get<LeadRequestsReportsOData>(
      `/lead-request-processing-history${params}`,
      {}
    );
    return data;
  }
}

export const reportingService = new ReportingService();
