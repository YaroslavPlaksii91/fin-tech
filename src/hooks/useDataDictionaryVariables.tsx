import { useEffect, useState, useCallback } from 'react';

import { dataDictionaryService } from '@services/data-dictionary';
import {
  DataDictionaryVariable,
  UserDefinedVariable,
  VARIABLE_SOURCE_TYPE,
  VARIABLE_USAGE_MODE
} from '@domain/dataDictionary';
import { IFlow } from '@domain/flow';

enum PROMISE_TYPES {
  Fulfilled = 'fulfilled',
  Rejected = 'rejected'
}

const isFulfilled = function <T>(
  input: PromiseSettledResult<T>
): input is PromiseFulfilledResult<T> {
  return input.status === PROMISE_TYPES.Fulfilled;
};

const useDataDictionaryVariables = (flow?: IFlow) => {
  const [variables, setVariables] =
    useState<
      Record<string, DataDictionaryVariable[] | UserDefinedVariable[]>
    >();
  const [isLoadingData, setIsLoadingData] = useState(false);

  const getVariables = useCallback(async () => {
    setIsLoadingData(true);

    // TODO: extends with new endpoints for getting data dictionary variables
    const results = await Promise.allSettled([
      dataDictionaryService.getDataDictionaryVariables()
    ]);

    const temporaryVariables =
      flow?.temporaryVariables?.map((variable) => ({
        ...variable,
        source: VARIABLE_SOURCE_TYPE.TemporaryVariable,
        usageMode: VARIABLE_USAGE_MODE.ReadWrite,
        sourceType: VARIABLE_SOURCE_TYPE.TemporaryVariable,
        destinationType: VARIABLE_SOURCE_TYPE.TemporaryVariable
      })) ?? [];

    const permanentVariables =
      flow?.permanentVariables?.map((variable) => ({
        ...variable,
        source: VARIABLE_SOURCE_TYPE.PermanentVariable,
        usageMode: VARIABLE_USAGE_MODE.ReadWrite,
        sourceType: VARIABLE_SOURCE_TYPE.PermanentVariable,
        destinationType: VARIABLE_SOURCE_TYPE.PermanentVariable
      })) ?? [];

    const extendedVariables: Record<
      string,
      DataDictionaryVariable[] | UserDefinedVariable[]
    > = {};

    const fulfilledValues = results.filter(isFulfilled).map((p) => p.value);

    fulfilledValues.forEach((obj) => {
      Object.keys(obj).forEach((key) => {
        extendedVariables[key] = obj[key];
      });
    });

    extendedVariables.userDefined = [
      ...temporaryVariables,
      ...permanentVariables
    ];

    if (fulfilledValues.length) {
      setVariables(extendedVariables);
    }

    setIsLoadingData(false);
  }, [flow]);

  useEffect(() => {
    void getVariables();
  }, [getVariables]);

  return { isLoadingData, variables };
};

export default useDataDictionaryVariables;
