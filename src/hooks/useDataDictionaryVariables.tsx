import { useEffect, useState, useCallback } from 'react';

import { dataDictionaryService } from '@services/data-dictionary';
import {
  CRA_REPORT_VARIABLES,
  DATA_DICTIONARY_GROUP,
  DataDictionaryVariableRecord,
  VARIABLE_SOURCE_TYPE,
  VARIABLE_USAGE_MODE
} from '@domain/dataDictionary';
import { IFlow } from '@domain/flow';

const useDataDictionaryVariables = (flow: IFlow) => {
  const [variables, setVariables] = useState<DataDictionaryVariableRecord>();
  const [integrationVariables, setIntegrationVariables] =
    useState<DataDictionaryVariableRecord>({
      [CRA_REPORT_VARIABLES.craClarityReportVariables]: [],
      [CRA_REPORT_VARIABLES.craFactorTrustReportVariables]: []
    });

  const getVariables = useCallback(async () => {
    const [dataDictionaryVariables, integrationVariables] =
      await Promise.allSettled([
        dataDictionaryService.getDataDictionaryVariables(),
        dataDictionaryService.getIntegrationVariables()
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

    const extendedVariables: DataDictionaryVariableRecord = {};

    if (dataDictionaryVariables.status === 'fulfilled') {
      Object.assign(extendedVariables, dataDictionaryVariables.value);
    }

    if (integrationVariables.status === 'fulfilled') {
      const {
        lmsInputVariables,
        craClarityReportVariables,
        craFactorTrustReportVariables
      } = integrationVariables.value;

      extendedVariables[DATA_DICTIONARY_GROUP.lmsInputVariables] =
        lmsInputVariables;

      setIntegrationVariables({
        craClarityReportVariables,
        craFactorTrustReportVariables
      });
    }

    extendedVariables[DATA_DICTIONARY_GROUP.userDefined] = [
      ...temporaryVariables,
      ...permanentVariables
    ];

    setVariables(extendedVariables);
  }, [flow]);

  useEffect(() => {
    void getVariables();
  }, [getVariables]);

  return { variables, integrationVariables };
};

export default useDataDictionaryVariables;
