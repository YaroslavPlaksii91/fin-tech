import { BillingReport, BillingReportParams } from '@domain/billingReport';
import {
  DenialReasonsReport,
  DenialReasonsReportParams
} from '@domain/denielReasonsReports';
import {
  LeadRequestReportParams,
  LeadRequestReportResponse
} from '@domain/leadRequestsReports';
import {
  WaterfallReport,
  WaterfallReportParams
} from '@domain/waterfallReport';
import { reportApi } from '@utils/api';

class ReportingService {
  async getLeadRequestsReports(params: LeadRequestReportParams) {
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

  async getLeadRequestsReportsExportCSV({ params }: LeadRequestReportParams) {
    const res = await reportApi.get('/lead-request-processing-history/export', {
      params,
      responseType: 'blob'
    });
    return res;
  }

  async getDenialReasonsReport(params: DenialReasonsReportParams) {
    const { data } = await reportApi.get<DenialReasonsReport[]>(
      `/lead-request-denial-reasons`,
      params
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

  async getDenialReasonsReportExportCSV({ params }: DenialReasonsReportParams) {
    const res = await reportApi.get(`/lead-request-denial-reasons/export`, {
      params,
      responseType: 'blob'
    });
    return res;
  }

  async getWaterfallReport(params: WaterfallReportParams) {
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

  async getWaterfallReportExportCSV({ params }: WaterfallReportParams) {
    const res = await reportApi.get('/waterfall-report/export', {
      params,
      responseType: 'blob'
    });
    return res;
  }

  async getBillingReport({ params }: BillingReportParams) {
    const { data } = await reportApi.get<BillingReport>(`/billing-report`, {
      params
    });
    return data;
  }
}

export const reportingService = new ReportingService();
