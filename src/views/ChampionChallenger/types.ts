interface Column {
  id: 'split' | 'step' | 'delete';
  label: string;
  minWidth?: number;
  width?: number;
  align?: 'left' | 'center';
}

const columns: readonly Column[] = [
  { id: 'split', label: 'User splits', minWidth: 170 },
  { id: 'step', label: 'Step', minWidth: 100 },
  {
    id: 'delete',
    label: '',
    minWidth: 40,
    align: 'center'
  }
];

type Split = {
  percentage: number;
  nodeId: string;
};

type FieldValues = {
  note: string | null;
  splits: Split[];
};

export { columns };
export type { FieldValues, Split };
