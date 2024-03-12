import {
  DataDictionaryVariable,
  UserDefinedVariable
} from '@domain/dataDictionary';

type Variable = DataDictionaryVariable | UserDefinedVariable;

export type Option = Variable & { group: string };
