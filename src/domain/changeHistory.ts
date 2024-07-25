export interface ChangeHistoryDifference {
  id: string;
  changeType: number;
  path: { id: string; name: string }[];
  // not required for steps
  name: string;
  stepType: string;
  after: string | null;
  before: string | null;

  // not required for edges
  sourceName: string;
  targetName: string;
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
  0: 'Add',
  1: 'Remove',
  2: 'Edit',
  3: 'Rename'
};
