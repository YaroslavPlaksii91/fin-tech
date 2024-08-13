import { BilingReport, GetBilingReport } from '@domain/billingReport';
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

  async getLeadRequestsReportsExportCSV(params: string) {
    const res = await reportOdataApi.get(
      `/lead-request-processing-history/export${params}`,
      { responseType: 'blob' }
    );
    return res;
  }

  async getDenialReasonsReport(params: string) {
    const { data } = await reportOdataApi.get<DenialReasonsReportOData>(
      `/lead-request-denial-reasons${params}`,
      {}
    );
    return data;
  }

  async getDenialReasonsReportExportCSV(params: string) {
    const res = await reportOdataApi.get<DenialReasonsReportOData>(
      `/lead-request-denial-reasons/export${params}`,
      { responseType: 'blob' }
    );
    return res;
  }

  async getWaterfallReport({ params }: GetWaterfallReport) {
    const { data } = await reportApi.get<WaterfallReport>(`/waterfall-report`, {
      params
    });
    return data;
  }

  async getWaterfallReportExportCSV({ params }: GetWaterfallReport) {
    const res = await reportApi.get<WaterfallReport>(
      `/waterfall-report/export`,
      {
        params,
        responseType: 'blob'
      }
    );
    return res;
  }

  async getBillingReport({ params }: GetBilingReport) {
    const { data } = await reportApi.get<BilingReport>(`/billing-report`, {
      params
    });
    return data;
  }
}

export const reportingService = new ReportingService();
