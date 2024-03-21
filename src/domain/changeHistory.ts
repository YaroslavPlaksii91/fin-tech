export interface ChangeHistoryDifference {
  name: string;
  stepType: string;
  after: string | null;
  before: string | null;
  id: string;
  changeType: number;
  path: { id: string; name: string }[];
}

export interface ChangeHistoryRecord {
  id: string;
  originalFlowId: string;
  name: string;
  pushedBy: string;
  pushedOn: string;
  note: string;
  diffs: ChangeHistoryDifference[];
}

export const ChangeTypeEnum: Record<string | number, string> = {
  0: 'Created',
  1: 'Deleted',
  2: 'Edited',
  3: 'Renamed'
};
