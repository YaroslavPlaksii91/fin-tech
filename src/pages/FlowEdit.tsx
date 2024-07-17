import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';

import { selectFlow } from '@store/flow/selectors';
import { useAppSelector } from '@store/hooks';
import { IFlow } from '@domain/flow';
import useDataDictionaryVariables from '@hooks/useDataDictionaryVariables';
import { DataDictionaryContext } from '@contexts/DataDictionaryContext';
import MainFlowChartEditor from '@components/FlowManagment/FlowChart/FlowChartEditor/MainFlowChartEditor';

function FlowEdit() {
  const { flow } = useAppSelector(selectFlow);
  const [copyFlow, setCopyFlow] = useState<IFlow>();
  const { variables } = useDataDictionaryVariables(flow);

  useEffect(() => {
    const flowDeepCopy = cloneDeep(flow);
    setCopyFlow(flowDeepCopy);
  }, [flow.id]);

  return (
    <DataDictionaryContext.Provider value={{ variables }}>
      {copyFlow && (
        <MainFlowChartEditor
          isViewMode={false}
          flow={copyFlow}
          setCopyFlow={setCopyFlow}
        />
      )}
    </DataDictionaryContext.Provider>
  );
}

export default FlowEdit;
