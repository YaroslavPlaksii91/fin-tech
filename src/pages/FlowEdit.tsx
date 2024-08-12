import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';

import { selectFlow } from '@store/flow/selectors';
import { useAppSelector } from '@store/hooks';
import { IFlow } from '@domain/flow';
import useDataDictionaryVariables from '@hooks/useDataDictionaryVariables';
import { DataDictionaryContext } from '@contexts/DataDictionaryContext';
import MainFlowChartEditor from '@components/FlowManagment/FlowChart/FlowChartEditor/MainFlowChartEditor';
import Logger from '@utils/logger';
import { integrationsService } from '@services/integrations';
import { CRAClarityControlFilesContext } from '@contexts/CRAClarityControlFilesContext';
import { IsDirtyProvider } from '@contexts/IsDirtyContext';

function FlowEdit() {
  const { flow } = useAppSelector(selectFlow);
  const [copyFlow, setCopyFlow] = useState<IFlow>();
  const { variables, integrationVariables } = useDataDictionaryVariables(flow);
  const [craClarityControlFiles, setCRAClarityControlFiles] = useState<
    string[]
  >([]);

  useEffect(() => {
    const flowDeepCopy = cloneDeep(flow);
    setCopyFlow(flowDeepCopy);
  }, [flow.id]);

  useEffect(() => {
    const fetchCRAClarityControlFiles = async () => {
      try {
        const data = await integrationsService.getCRAClarityControlFiles();
        setCRAClarityControlFiles(data);
      } catch (error) {
        Logger.error('Error fetching control files data:', error);
      }
    };

    void fetchCRAClarityControlFiles();
  }, []);

  return (
    <DataDictionaryContext.Provider value={{ variables, integrationVariables }}>
      <CRAClarityControlFilesContext.Provider value={craClarityControlFiles}>
        <IsDirtyProvider>
          {copyFlow && (
            <MainFlowChartEditor
              isViewMode={false}
              flow={copyFlow}
              setCopyFlow={setCopyFlow}
            />
          )}
        </IsDirtyProvider>
      </CRAClarityControlFilesContext.Provider>
    </DataDictionaryContext.Provider>
  );
}

export default FlowEdit;
