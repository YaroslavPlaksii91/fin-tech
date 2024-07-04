export interface DenialReasonsReportOData {
  '@odata.context': string;
  '@odata.count': number;
  value: DenialReasonsReport[];
}

export interface DenialReasonsReport {
  denialReason: null | string;
  deniedBy: null | string;
  totalCount: number;
  percentage: number;
}
