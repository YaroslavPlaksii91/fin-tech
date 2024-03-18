export interface ChangeHistoryDifference {
  name: string;
  stepType: string;
  after: string | null;
  before: string | null;
  id: string;
  changeType: number;
  path: string[];
}

export interface ChangeHistoryRecord {
  id: string;
  originalFlowId: string;
  nameAfter: string;
  nameBefore: string;
  pushedBy: string;
  pushedOn: string;
  note: string;
  diffs: ChangeHistoryDifference[];
}
