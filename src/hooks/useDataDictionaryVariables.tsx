import { useEffect, useState, useCallback, useMemo } from 'react';

import { dataDictionaryService } from '@services/data-dictionary';
import {
  CRA_REPORT_VARIABLES,
  DATA_DICTIONARY_GROUP,
  VARIABLE_SOURCE_TYPE,
  VARIABLE_USAGE_MODE
} from '@domain/dataDictionary';
import { IFlow } from '@domain/flow';
import { integrationsService } from '@services/integrations';
import { typeSafeObjectEntries } from '@utils/object';
import { REGEX } from '@utils/validation';
import { DataDictionaryVariables } from '@contexts/DataDictionaryContext';

// TODO: rewrite with redux and call getVariables globally once
const useDataDictionaryVariables = (flow: IFlow) => {
  const [variables, setVariables] = useState<
    DataDictionaryVariables | undefined
  >();
  const [integrationVariables, setIntegrationVariables] =
    useState<DataDictionaryVariables>({
      [CRA_REPORT_VARIABLES.craClarityReportVariables]: [],
      [CRA_REPORT_VARIABLES.craFactorTrustReportVariables]: []
    });

  const enumsDataTypes = useMemo(() => {
    const allVariables = typeSafeObjectEntries({
      ...variables,
      ...integrationVariables
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
  }, [variables, integrationVariables]);

  const getVariables = useCallback(async () => {
    const [dataDictionaryVariables, integrationVariables] =
      await Promise.allSettled([
        dataDictionaryService.getDataDictionaryVariables(),
        integrationsService.getIntegrationVariables()
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

    const extendedVariables: DataDictionaryVariables = {};

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
  }, [flow.temporaryVariables, flow.permanentVariables]);

  useEffect(() => {
    void getVariables();
  }, [getVariables]);

  return { variables, integrationVariables, enumsDataTypes };
};

export default useDataDictionaryVariables;
