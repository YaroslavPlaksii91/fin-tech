export interface GetWaterfallReport {
  params: {
    sort?: string;
    startTime?: string;
    endTime?: string;
    filter?: string;
  };
}

export interface WaterfallReport {
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
