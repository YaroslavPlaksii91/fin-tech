export enum StepType {
  DECISION_TREE = 'desicion-tree',
  CALCULATION = 'calculation',
  DECISION_MATRIX = 'desicion-matrix',
  CONDITION = 'condition',
  CASE = 'case',
  CHAMPION_CHALLENGER = 'ChampionChallender',
  SUBFLOW = 'subflow',
  START = 'Start',
  END = 'End'
}

export const ADD_BUTTON_ON_EDGE = 'add-button-on-edge';

export type EdgeData = {
  onAdd?: (payload: { id: string; type: StepType }) => void;
};
