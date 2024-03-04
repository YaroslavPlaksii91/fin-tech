export enum DATA_TYPE_WITH_ENUM_PREFIX {
  Gender = 'Enum:Gender',
  ContactTime = 'Enum:ContactTime',
  ResidenceType = 'Enum:ResidenceType',
  IncomeType = 'Enum:IncomeType',
  PaymentType = 'Enum:PaymentType',
  EmploymentType = 'Enum:EmploymentType',
  WorkShift = 'Enum:WorkShift',
  PayFrequency = 'Enum:PayFrequency',
  BankAccountType = 'Enum:BankAccountType',
  ReferenceRelationship = 'Enum:ReferenceRelationship',
  /*for mocked data*/
  Store = 'Enum:Store',
  LoyaltyTier = 'Enum:LoyaltyTier',
  Promocode = 'Enum:Promocode'
}

export enum DATA_TYPE_WITHOUT_ENUM {
  Integer = 'Integer',
  Decimal = 'Decimal',
  String = 'String',
  Boolean = 'Boolean',
  DateTime = 'DateTime',
  StringArray = 'StringArray',
  Object = 'Object'
}

export type DATA_TYPE = DATA_TYPE_WITHOUT_ENUM | DATA_TYPE_WITH_ENUM_PREFIX;

export enum VARIABLE_DESTINATION_TYPE {
  PermanentVariable = 'PermanentVariable',
  TemporaryVariable = 'TemporaryVariable',
  Output = 'Output'
}

export enum VARIABLE_SOURCE_TYPE {
  Input = 'Input',
  GlobalConstant = 'GlobalConstant',
  PermanentVariable = 'PermanentVariable',
  TemporaryVariable = 'TemporaryVariable'
}

export interface DataDictionaryVariable {
  variableName: string;
  source: VARIABLE_SOURCE_TYPE;
  variableDestinationType?: string;
  variableSourceType: string;
  dataType?: DATA_TYPE;
  defaultValue?: string;
  isRequired?: boolean;
  usageMode?: string;
  allowedValues?: string | string[];
  description?: string;
}

export type UserDefinedVariable = {
  dataType: DATA_TYPE;
  name: string;
  defaultValue: string;
  description: string;
};
