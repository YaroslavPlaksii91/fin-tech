import { useEffect, useState, useCallback } from 'react';

import { dataDictionaryService } from '@services/data-dictionary';
import {
  DataDictionaryVariable,
  VARIABLE_SOURCE_TYPE
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

const useDataDictionaryVariables = (flow: IFlow) => {
  const [variables, setVariables] = useState<DataDictionaryVariable[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const getVariables = useCallback(async () => {
    setIsLoadingData(true);

    const results = await Promise.allSettled([
      dataDictionaryService.getDataDictionaryVariables()
    ]);

    const temporaryVariables = flow.temporaryVariables?.map((variable) => ({
      ...variable,
      source: VARIABLE_SOURCE_TYPE.TemporaryVariable
    }));

    // TODO: think better way to join temporary variables

    const fulfilledValues = results
      .filter(isFulfilled)
      .map((p) => p.value)
      .concat(temporaryVariables);

    if (fulfilledValues.length) {
      setVariables(
        ([] as DataDictionaryVariable[]).concat.apply(
          [],
          fulfilledValues as ConcatArray<DataDictionaryVariable>[]
        )
      );
    }

    setIsLoadingData(false);
  }, []);

  useEffect(() => {
    void getVariables();
  }, [getVariables]);

  return { isLoadingData, variables };
};

export default useDataDictionaryVariables;
