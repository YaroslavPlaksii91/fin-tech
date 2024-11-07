import { Operator } from '@views/DecisionTable/types';

export enum VARIABLE_DATA_TYPE {
  Integer = 'Integer',
  Decimal = 'Decimal',
  String = 'String',
  StringArray = 'StringArray',
  Boolean = 'Boolean',
  DateTime = 'DateTime',
  'Object:CraClarity' = 'Object:CraClarity',
  'Object:CraFactorTrust' = 'Object:CraFactorTrust'
}

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

export enum INTEGRATION_VARIABLE_SOURCE_TYPE {
  CraClarity = 'CraClarity',
  CraFactorTrust = 'CraFactorTrust'
}

export enum CONTROL_FILES {
  OFAC = 'OFAC',
  ClearCreditRisk = 'ClearCreditRisk',
  ClearFraudInsight = 'ClearFraudInsight',
  ClearRecentHistory = 'ClearRecentHistory'
}

export interface DataDictionaryVariable {
  name: string;
  source: VARIABLE_SOURCE_TYPE | INTEGRATION_VARIABLE_SOURCE_TYPE;
  destinationType: string;
  sourceType: VARIABLE_SOURCE_TYPE | CONTROL_FILES;
  dataType: VARIABLE_DATA_TYPE;
  defaultValue?: string;
  isRequired?: boolean;
  usageMode: VARIABLE_USAGE_MODE;
  allowedValues?: string | string[];
  description?: string;
  sourceName?: string;
}

export type DataDictionaryVariables = Record<string, DataDictionaryVariable[]>;

export type ExpressionValidateParams = {
  name: string;
  dataType: VARIABLE_DATA_TYPE;
}[];

export type Condition = {
  name: string;
  operator: Operator;
  expression: string;
};

export type ExpressionValidate = {
  expression: string;
  targetDataType: string;
  params: ExpressionValidateParams;
};

export type ConditionValidate = {
  condition: Condition;
  params: ExpressionValidateParams;
};

export type VariableUsageParams = {
  name: string;
  path: string[];
  place: string;
}[];

// UserDefined group contains temporary and permanent variables
// CraReportVariables group contains craClarityReportVariables and craFactorTrustReportVariables
export enum DATA_DICTIONARY_GROUP {
  laPMSVariables = 'laPMSVariables',
  outputVariables = 'outputVariables',
  historicDataVariables = 'historicDataVariables',
  craReportVariables = 'craReportVariables',
  lmsInputVariables = 'lmsInputVariables',
  userDefined = 'userDefined'
}

export enum CRA_REPORT_VARIABLES {
  craClarityReportVariables = 'craClarityReportVariables',
  craFactorTrustReportVariables = 'craFactorTrustReportVariables'
}
