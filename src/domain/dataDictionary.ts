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
  DateTime = 'DateTime'
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

export enum VARIABLE_USAGE_MODE {
  ReadOnly = 'ReadOnly',
  WriteOnly = 'WriteOnly',
  ReadWrite = 'ReadWrite'
}

export interface DataDictionaryVariable {
  name: string;
  source: VARIABLE_SOURCE_TYPE;
  destinationType: string;
  sourceType: VARIABLE_SOURCE_TYPE;
  dataType: DATA_TYPE;
  defaultValue?: string;
  isRequired?: boolean;
  usageMode?: string;
  allowedValues?: string | string[];
  description?: string;
}

export type UserDefinedVariable = {
  name: string;
  dataType: DATA_TYPE;
  defaultValue?: string;
  description?: string;
  destinationType: string;
  sourceType: VARIABLE_SOURCE_TYPE;
  allowedValues?: string | string[];
  usageMode?: string;
};

export type ExpressionValidateParams = { name: string; dataType: DATA_TYPE }[];

export type ExpressionValidate = {
  expression: string;
  targetDataType: string;
  params: ExpressionValidateParams;
};

export type VariableUsageParams = {
  name: string;
  path: string[];
  place: string;
}[];
