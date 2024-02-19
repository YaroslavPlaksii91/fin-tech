export enum VARIABLE_TYPES {
  Integer = 'Integer',
  Decimal = 'Decimal',
  String = 'String',
  Enum = 'Enum',
  Boolean = 'Boolean'
}

export interface DataDictionaryVariable {
  variableName: string;
  source?: string;
  destination?: string;
  variableType: string;
  dataType: VARIABLE_TYPES;
  defaultValue: string;
  isRequired: boolean;
  usageMode: string;
  allowedValues: string | string[];
  description: string;
}
