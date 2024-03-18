import { Expression } from '@domain/flow';

export enum COLUMN_IDS {
  variable = 'variable',
  expression = 'expression',
  delete_edit = 'delete/edit'
}
interface Column {
  id: COLUMN_IDS;
  label: string;
  minWidth?: number;
  width?: number | string;
  align?: 'left' | 'center';
}

const columns: readonly Column[] = [
  { id: COLUMN_IDS.variable, label: 'Variable', width: '40%' },
  { id: COLUMN_IDS.expression, label: 'Expression', width: '60%' },
  {
    id: COLUMN_IDS.delete_edit,
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
