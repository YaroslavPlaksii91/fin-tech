import { useEffect, useState } from 'react';
import * as _ from 'lodash-es';

import { selectFlow } from '@store/flow/selectors';
import { useAppSelector } from '@store/hooks';
import { IFlow } from '@domain/flow';
import MainFlowChartEditor from '@components/FlowManagment/FlowChart/FlowChartEditor/MainFlowChartEditor';
import { IsDirtyProvider } from '@contexts/IsDirtyContext';

const FlowEdit = () => {
  const { flow } = useAppSelector(selectFlow);

  const [copyFlow, setCopyFlow] = useState<IFlow>();

  useEffect(() => {
    const flowDeepCopy = _.cloneDeep(flow);
    setCopyFlow(flowDeepCopy);
  }, [flow.id]);

  return (
    <IsDirtyProvider>
      {copyFlow && (
        <MainFlowChartEditor
          isViewMode={false}
          flow={copyFlow}
          setCopyFlow={setCopyFlow}
        />
      )}
    </IsDirtyProvider>
  );
};

export default FlowEdit;
