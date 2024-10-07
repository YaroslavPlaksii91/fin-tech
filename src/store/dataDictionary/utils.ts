import { RootState } from '@store/store';
import { typeSafeObjectEntries } from '@utils/object';
import { REGEX } from '@utils/validation';

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
