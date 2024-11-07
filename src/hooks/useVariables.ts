import { useMemo } from 'react';

import { useAppSelector } from '@store/hooks';
import { selectUserDefinedVariables } from '@store/flow/selectors';
import { selectDataDictionary } from '@store/dataDictionary/selectors';

export const useVariables = () => {
  const { integrationVariables, variables } =
    useAppSelector(selectDataDictionary);
  const userDefinedVariables = useAppSelector(selectUserDefinedVariables);

  const allVariables = useMemo(
    () => ({
      ...variables,
      ...userDefinedVariables
    }),
    [variables, userDefinedVariables]
  );

  return {
    variables,
    integrationVariables,
    userDefinedVariables,
    allVariables
  };
};
