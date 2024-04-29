import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';

import FlowChartEditor from '@components/FlowManagment/FlowChart/FlowChartEditor/FlowChartEditor';
import { selectFlow } from '@store/flow/selectors';
import { useAppSelector } from '@store/hooks';
import { IFlow } from '@domain/flow';

function FlowEditMain() {
  const { flow } = useAppSelector(selectFlow);
  const [copyFlow, setCopyFlow] = useState<IFlow>();

  useEffect(() => {
    const flowDeepCopy = cloneDeep(flow);
    setCopyFlow(flowDeepCopy);
  }, [flow.id]);

  return (
    copyFlow && <FlowChartEditor flow={copyFlow} setCopyFlow={setCopyFlow} />
  );
}

const FlowEditor = () => <FlowEditMain />;

export default FlowEditor;
