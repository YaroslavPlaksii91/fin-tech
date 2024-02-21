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

enum DataType {
  boolean = 'Boolean'
}

enum VariableDestinationType {
  permanentVariable = 'PermanentVariable',
  temporaryVariable = 'TemporaryVariable',
  Output = 'Output'
}

enum VariableSourceType {
  input = 'Input',
  globalConstant = 'GlobalConstant',
  permanentVariable = 'PermanentVariable',
  temporaryVariable = 'TemporaryVariable'
}

type Expression = {
  outputVariableName: string;
  expressionString: string;
  destinationType: VariableDestinationType;
  destinationDataType: DataType;
  inputVariables: {
    variableName: string;
    sourceType: VariableSourceType;
  }[];
};

type FieldValues = {
  expressions: Expression[];
  note: string | null;
};

export { columns, DataType, VariableSourceType, VariableDestinationType };
export type { FieldValues, Expression };
