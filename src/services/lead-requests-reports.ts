import { DenialReasonsReportOData } from '@domain/denielReasonsReports';
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

  async getDenialReasonsReport(params: string) {
    const { data } = await reportApi.get<DenialReasonsReportOData>(
      `/lead-request-denial-reasons${params}`,
      {}
    );
    return data;
  }
}

export const reportingService = new ReportingService();
