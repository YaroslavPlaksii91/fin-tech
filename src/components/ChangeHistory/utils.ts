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

  if (row.stepType) {
    return row.after;
  }

  if (row.path) {
    return row.path[0].name;
  }

  return name;
};

export const getInfoForConnections = (row: ChangeHistoryDifference) => {
  if (ChangeTypeEnum[row.changeType] === ChangeTypeEnum[0]) {
    return `Add Link from "${row.sourceName}" to "${row.targetName}"`;
  }
  if (ChangeTypeEnum[row.changeType] === ChangeTypeEnum[1]) {
    return `Remove Link from "${row.sourceName}" to "${row.targetName}"`;
  }
};

export const getInfoForSubflow = (row: ChangeHistoryDifference) => {
  if (ChangeTypeEnum[row.changeType] === ChangeTypeEnum[0]) {
    return `Subflow "${row.name}" was added.`;
  }
  if (ChangeTypeEnum[row.changeType] === ChangeTypeEnum[1]) {
    return `Subflow "${row.name}" was deleted with all the steps it contained.`;
  }
};

export const generalDiffStyles = {
  variables: {
    light: {
      addedBackground: 'none',
      removedBackground: 'none',
      emptyLineBackground: 'none'
    }
  },
  diffContainer: {
    pre: {
      'white-space': 'pre'
    }
  },
  marker: {
    display: 'none'
  }
};

export const oldVersionDiffStyles = {
  diffContainer: {
    pre: {
      'white-space': 'pre'
    }
  },
  diffAdded: {
    display: 'none'
  }
};

export const newVersionDiffStyles = {
  diffContainer: {
    pre: {
      'white-space': 'pre'
    }
  },
  diffRemoved: {
    display: 'none'
  }
};
