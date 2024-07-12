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
    totalApprovalRate: null | string;
    totalCost: null | string;
    totalCpa: null | string;
    totalLeadCost: null | string;
    totalDataCost: null | string;
    totalTimeouts: number;
    totalCostSavings: null | string;
    totalCachedLead: number;
    externalSystemsData: ExternalSystemsData[];
  }[];
}

type ExternalSystemsData = {
  reportType: string;
  name: null | string;
  looks: number;
  approved: number;
  cost: number;
  savings: number;
  timeouts: number;
};
