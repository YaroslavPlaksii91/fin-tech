import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';

import FlowChartEditor from '@components/FlowManagment/FlowChart/FlowChartEditor/FlowChartEditor';
import { selectFlow } from '@store/flow/selectors';
import { useAppSelector } from '@store/hooks';
import { IFlow } from '@domain/flow';
import useDataDictionaryVariables from '@hooks/useDataDictionaryVariables';
import { DataDictionaryContext } from '@contexts/DataDictionaryContext';

function FlowEditMain() {
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
        <FlowChartEditor flow={copyFlow} setCopyFlow={setCopyFlow} />
      )}
    </DataDictionaryContext.Provider>
  );
}

const FlowEditor = () => <FlowEditMain />;

export default FlowEditor;
