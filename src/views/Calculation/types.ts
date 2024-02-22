import { Expression } from '@domain/flow';

interface Column {
  id: 'variable' | 'expression' | 'delete/edit';
  label: string;
  minWidth?: number;
  width?: number | string;
  align?: 'left' | 'center';
}

const columns: readonly Column[] = [
  { id: 'variable', label: 'Variable', width: '40%' },
  { id: 'expression', label: 'Expression', width: '60%' },
  {
    id: 'delete/edit',
    label: '',
    width: 40,
    align: 'center'
  }
];

type FieldValues = {
  expressions: Expression[];
  note: string | null;
};

export { columns };
export type { FieldValues, Expression };
