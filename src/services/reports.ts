import { DenialReasonsReportOData } from '@domain/denielReasonsReports';
import { LeadRequestsReportsOData } from '@domain/leadRequestsReports';
import { GetWaterfallReport, WaterfallReport } from '@domain/waterfallReport';
import { reportApi, reportOdataApi } from '@utils/api.ts';

class ReportingService {
  async getLeadRequestsReports(params: string) {
    const { data } = await reportOdataApi.get<LeadRequestsReportsOData>(
      `/lead-request-processing-history${params}`,
      {}
    );
    return data;
  }

  async getDenialReasonsReport(params: string) {
    const { data } = await reportOdataApi.get<DenialReasonsReportOData>(
      `/lead-request-denial-reasons${params}`,
      {}
    );
    return data;
  }

  async getWaterfallReport({ params }: GetWaterfallReport) {
    const { data } = await reportApi.get<WaterfallReport>(`/waterfall-report`, {
      params
    });
    return data;
  }
}

export const reportingService = new ReportingService();
