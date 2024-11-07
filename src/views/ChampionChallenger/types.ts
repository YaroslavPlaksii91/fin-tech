interface Column {
  id: 'split' | 'step' | 'delete';
  label: string;
  minWidth?: number;
  width?: number | string;
  align?: 'left' | 'center';
}

const columns: readonly Column[] = [
  { id: 'split', label: 'User Splits', width: '50%' },
  { id: 'step', label: 'Step', width: '50%' },
  {
    id: 'delete',
    label: '',
    width: 40,
    align: 'center'
  }
];

type Split = {
  percentage: number;
  value: string;
};

type FieldValues = {
  note: string | null;
  splits: Split[];
};

export { columns };
export type { FieldValues, Split };
