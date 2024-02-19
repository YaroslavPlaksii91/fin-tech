import { useEffect, useState, useCallback } from 'react';

import { dataDictionaryService } from '@services/data-dictionary';
import { DataDictionaryVariable } from '@domain/dataDictionary';

enum PROMISE_TYPES {
  Fulfilled = 'fulfilled',
  Rejected = 'rejected'
}

const isFulfilled = function <T>(
  input: PromiseSettledResult<T>
): input is PromiseFulfilledResult<T> {
  return input.status === PROMISE_TYPES.Fulfilled;
};

const useDataDictionaryVariables = () => {
  const [variables, setVariables] = useState<DataDictionaryVariable[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const getVariables = useCallback(async () => {
    setIsLoadingData(true);

    const results = await Promise.allSettled([
      dataDictionaryService.getDataDictionaryVariables(),
      dataDictionaryService.getUserDefinedVariables()
    ]);

    const fulfilledValues = results.filter(isFulfilled).map((p) => p.value);

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
