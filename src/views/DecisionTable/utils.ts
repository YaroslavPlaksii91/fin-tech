import {
  EQUAL_OPERATOR,
  BETWEEN_OPERATOR,
  GREATER_AND_EQUAL_OPERATOR,
  ANY_OPERATOR,
  LESS_AND_EQUAL_OPERATOR,
  IN_OPERATOR,
  NOT_EQUAL_OPERATOR,
  LESS_OPERATOR,
  GREATER_OPERATOR
} from './constants';
import { CaseEntriesDate, CaseEntry } from './types';

import {
  DATA_TYPE_WITHOUT_ENUM,
  VARIABLE_SOURCE_TYPE
} from '@domain/dataDictionary';

export const getOperatorOptions = (dataType: DATA_TYPE_WITHOUT_ENUM) => {
  const { Integer, Decimal, String } = DATA_TYPE_WITHOUT_ENUM;
  let operators: Record<string, string>[] = [];

  switch (dataType) {
    case String:
      operators = [
        IN_OPERATOR,
        EQUAL_OPERATOR,
        NOT_EQUAL_OPERATOR,
        ANY_OPERATOR
      ];
      break;
    case Integer || Decimal:
      operators = [
        EQUAL_OPERATOR,
        NOT_EQUAL_OPERATOR,
        GREATER_OPERATOR,
        LESS_OPERATOR,
        GREATER_AND_EQUAL_OPERATOR,
        LESS_AND_EQUAL_OPERATOR,
        BETWEEN_OPERATOR,
        ANY_OPERATOR
      ];
      break;

    default:
      operators = [EQUAL_OPERATOR, NOT_EQUAL_OPERATOR, ANY_OPERATOR];
  }

  return operators;
};

export const getSerializedCaseEntries = (caseEntries: CaseEntriesDate[]) =>
  caseEntries.map((row) => {
    const serializedActions = [...row.actions];

    return {
      ...row,
      actions: serializedActions.map((column) => ({
        ...column,
        // set variable destinationType
        destinationType: 'TemporaryVariable'
      }))
    };
  });

export const getSerializedDefaultActions = (defaultActions: CaseEntry[]) =>
  defaultActions.map((element) => ({
    ...element,
    // set variable destinationType
    destinationType: 'TemporaryVariable'
  }));

export const setVariableSources = ({
  caseEntry,
  variablesSourceTypes
}: {
  caseEntry: CaseEntriesDate;
  variablesSourceTypes: Record<string, VARIABLE_SOURCE_TYPE>;
}) => {
  let variableSources: { name: string; sourceType: VARIABLE_SOURCE_TYPE }[] =
    [];

  Object.keys(caseEntry).forEach((obj) => {
    caseEntry[obj as keyof CaseEntriesDate].map(
      (el) =>
        el.name.length &&
        (variableSources = [
          ...variableSources,
          { name: el.name, sourceType: variablesSourceTypes[el.name] }
        ])
    );
  });
  return variableSources;
};
