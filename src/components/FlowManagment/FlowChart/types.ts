export enum ObjectType {
  DECISION_TREE = 'desicion-tree',
  CALCULATION = 'calculation',
  DECISION_MATRIX = 'desicion-matrix',
  CONDITION = 'condition',
  CASE = 'case',
  CHAMPION_CHALLENGER = 'champion-challender',
  SUBFLOW = 'subflow'
}

export type EdgeData = {
  onAdd?: (payload: { id: string; type: ObjectType }) => void;
};
