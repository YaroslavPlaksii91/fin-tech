import { IFlow } from '@domain/flow';
import {
  DATA_DICTIONARY_GROUP,
  VARIABLE_SOURCE_TYPE,
  VARIABLE_USAGE_MODE
} from '@domain/dataDictionary';
import { RootState } from '@store/store';
import { typeSafeObjectEntries } from '@utils/object';
import { REGEX } from '@utils/validation';

export const getUserDefinedVariables = ({
  temporaryVariables,
  permanentVariables
}: IFlow) => ({
  [DATA_DICTIONARY_GROUP.userDefined]: [
    ...temporaryVariables.map((variable) => ({
      ...variable,
      source: VARIABLE_SOURCE_TYPE.TemporaryVariable,
      usageMode: VARIABLE_USAGE_MODE.ReadWrite,
      sourceType: VARIABLE_SOURCE_TYPE.TemporaryVariable,
      destinationType: VARIABLE_SOURCE_TYPE.TemporaryVariable
    })),
    ...permanentVariables.map((variable) => ({
      ...variable,
      source: VARIABLE_SOURCE_TYPE.PermanentVariable,
      usageMode: VARIABLE_USAGE_MODE.ReadWrite,
      sourceType: VARIABLE_SOURCE_TYPE.PermanentVariable,
      destinationType: VARIABLE_SOURCE_TYPE.PermanentVariable
    }))
  ]
});

export const getEnumDataTypes = (state: RootState['dataDictionary']) => {
  const allVariables = typeSafeObjectEntries({
    ...state.variables,
    ...state.integrationVariables
  });

  return allVariables.reduce(
    (acc, [, variables]) => [
      ...acc,
      ...variables
        .filter((variable) => REGEX.ENUM_DATA_TYPE.test(variable.dataType))
        .map(({ dataType }) => dataType)
    ],
    [] as string[]
  );
};
