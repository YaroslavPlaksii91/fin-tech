import { StepType } from '@components/FlowManagment/FlowChart/types';

export interface ChangeHistoryDifference {
  id: string;
  changeType: number;
  path: { id: string; name: string }[];
  name?: string;
  stepType?: StepType;
  after?: string | null;
  before?: string | null;
  sourceName?: string;
  targetName?: string;
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
