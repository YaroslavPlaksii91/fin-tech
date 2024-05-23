import { cloneDeep } from 'lodash';
import { useState, useEffect } from 'react';

import FlowChartReadOnlyView from '@components/FlowManagment/FlowChart/FlowChartReadOnlyView';
import { IFlow } from '@domain/flow';
import { selectFlow } from '@store/flow/selectors';
import { useAppSelector } from '@store/hooks';
import { checkIsProductionFlow } from '@utils/helpers';

export default function FlowsNew() {
  const { flow } = useAppSelector(selectFlow);
  const [copyFlow, setCopyFlow] = useState<IFlow>();
  const isProductionFlow = checkIsProductionFlow();

  useEffect(() => {
    const flowDeepCopy = cloneDeep(flow);
    setCopyFlow(flowDeepCopy);
  }, [flow.id]);

  return (
    copyFlow && (
      <FlowChartReadOnlyView
        showControlPanel={!!copyFlow.id}
        flow={copyFlow}
        isProductionFlow={isProductionFlow}
      />
    )
  );
}
