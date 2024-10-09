import { BilingReport, GetBilingReport } from '@domain/billingReport';
import { DenialReasonsReportOData } from '@domain/denielReasonsReports';
import {
  GetLeadRequestReport,
  LeadRequestReportResponse
} from '@domain/leadRequestsReports';
import { GetWaterfallReport, WaterfallReport } from '@domain/waterfallReport';
import { reportApi, reportOdataApi } from '@utils/api.ts';

class ReportingService {
  async getLeadRequestsReports(params: GetLeadRequestReport) {
    const { data } = await reportApi.get<LeadRequestReportResponse>(
      '/lead-request-processing-history',
      params
    );
    return data;
  }

  async getLeadRequestsReportsFieldOptions(field: string) {
    const encodedField = encodeURIComponent(field);
    const { data } = await reportApi.get<string[]>(
      `/lead-request-processing-history/${encodedField}`
    );
    return data;
  }

  async getLeadRequestsReportsExportCSV({ params }: GetLeadRequestReport) {
    const res = await reportApi.get('/lead-request-processing-history/export', {
      params,
      responseType: 'blob'
    });
    return res;
  }

  async getDenialReasonsReport(params: string) {
    const { data } = await reportOdataApi.get<DenialReasonsReportOData>(
      `/lead-request-denial-reasons${params}`,
      {}
    );
    return data;
  }

  async getDenialReasonsReportsFieldOptions(field: string) {
    const encodedField = encodeURIComponent(field);
    const { data } = await reportApi.get<string[]>(
      `/lead-request-denial-reasons/${encodedField}`
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

  async getWaterfallReport(params: GetWaterfallReport) {
    const { data } = await reportApi.get<WaterfallReport[]>(
      `/waterfall-report`,
      params
    );
    return data;
  }

  async getWaterfallReportFieldOptions(field: string) {
    const { data } = await reportApi.get<string[]>(
      `/waterfall-report/${field}`
    );
    return data;
  }

  async getWaterfallReportExportCSV({ params }: GetWaterfallReport) {
    const res = await reportApi.get('/waterfall-report/export', {
      params,
      responseType: 'blob'
    });
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
