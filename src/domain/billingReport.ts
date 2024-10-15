export interface BillingReportParams {
  params: {
    pageSize: number;
    pageNumber?: number;
  };
}

export interface BillingReport {
  item1: number;
  item2: { month: string; cost: number; looks: number; vendorName: string }[];
}
