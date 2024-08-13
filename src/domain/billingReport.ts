export interface GetBilingReport {
  params: {
    pageSize: number;
    pageNumber?: number;
  };
}

export interface BilingReport {
  item1: number;
  item2: { month: string; cost: number; looks: number; vendorName: string }[];
}
