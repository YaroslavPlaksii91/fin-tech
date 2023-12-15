export enum ObjectType {
  DECISION_TREE = 'desicion-tree',
  CALCULATION = 'calculation',
  DECISION_MATRIX = 'desicion-matrix',
  CONDITION = 'condition',
  CASE = 'case',
  CHAMPION_CHALLENGER = 'champion-challender',
  SUBFLOW = 'subflow',
  START = 'StartObject',
  END = 'EndObject'
}

export const ADD_BUTTON_ON_EDGE = 'add-button-on-edge';

export type EdgeData = {
  onAdd?: (payload: { id: string; type: ObjectType }) => void;
};
