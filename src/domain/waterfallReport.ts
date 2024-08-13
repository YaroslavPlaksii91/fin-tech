export interface GetWaterfallReport {
  params: {
    pageSize: number;
    pageNumber?: number;
    sortBy?: string;
    startTime?: string;
    endTime?: string;
    stack?: string;
    campaign?: string;
  };
}

export interface WaterfallReport {
  item1: number;
  item2: {
    stack: null | string;
    campaignId: null | string;
    totalLooks: number;
    totalApproved: number;
    totalApprovalRate: null | number;
    totalCost: null | number;
    totalCpa: null | number;
    totalLeadCost: null | number;
    totalDataCost: null | number;
    totalTimeouts: number;
    totalCostSavings: null | string;
    totalCachedLead: number;
    externalSystemsData: ExternalSystemsData[];
  }[];
}

export type ExternalSystemsData = {
  reportType: string;
  name: null | string;
  looks: number;
  approved: number;
  cost: number;
  savings: number;
  timeouts: number;
};
