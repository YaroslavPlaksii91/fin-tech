import {
  DataDictionaryVariable,
  UserDefinedVariable
} from '@domain/dataDictionary';

type Variable = DataDictionaryVariable | UserDefinedVariable;

export type FieldValues = {
  variable: Variable;
  expressionString: string;
};
