import {
  ChangeHistoryDifference,
  ChangeTypeEnum
} from '@domain/changeHistory.ts';

export const getActionType = (row: ChangeHistoryDifference) => {
  const changeType = ChangeTypeEnum[row.changeType];
  if (row.sourceName && row.targetName) {
    return `${changeType} Link`;
  }

  if (row.stepType) {
    const newTag = changeType === ChangeTypeEnum[0] ? 'New' : '';
    return `${changeType} ${newTag} ${row.stepType}`;
  }
  return `${changeType} Flow`;
};

export const getName = (row: ChangeHistoryDifference) => {
  const name = '-';
  if (row.sourceName && row.targetName) {
    return `From "${row.sourceName}" to "${row.targetName}"`;
  }

  if (row.name) {
    return row.name;
  }

  if (row.path) {
    return row.path[0].name;
  }

  return name;
};
