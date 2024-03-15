import {
  DataDictionaryVariable,
  UserDefinedVariable
} from '@domain/dataDictionary';

type Variable = DataDictionaryVariable | UserDefinedVariable;

export type Option = Variable & { group: string };

export type FieldValues = {
  variable: Option;
  expressionString: string;
};
