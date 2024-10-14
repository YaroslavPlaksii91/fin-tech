export interface DenialReasonsReport {
  denialReason: null | string;
  deniedBy: null | string;
  totalCount: number;
  percentage: number;
}

export interface DenialReasonsReportParams {
  params: {
    sort?: string;
    filter?: string;
  };
}
