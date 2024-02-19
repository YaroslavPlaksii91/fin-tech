export enum DATA_TYPES {
  Integer = 'Integer',
  Decimal = 'Decimal',
  String = 'String',
  Enum = 'Enum',
  Boolean = 'Boolean',
  DateTime = 'DateTime',
  StringArray = 'StringArray',
  Object = 'Object'
}

export interface DataDictionaryVariable {
  variableName: string;
  source?: string;
  destination?: string;
  variableType: string;
  dataType: DATA_TYPES;
  defaultValue: string;
  isRequired: boolean;
  usageMode: string;
  allowedValues: string | string[];
  description: string;
}
