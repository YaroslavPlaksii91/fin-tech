import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { LayoutContainer } from '@components/Layouts/MainLayout';
import { IFlow } from '@domain/flow';
import { StepProvider } from '@contexts/StepContext';
import Logger from '@utils/logger';
import { flowService } from '@services/flow-service';
import { useLoading } from '@contexts/LoadingContext';
import FlowChartEditor from '@components/FlowManagment/FlowChart/FlowChartEditor/FlowChartEditor';

function FlowEditMain() {
  const { id } = useParams();
  const [flow, setFlow] = useState<IFlow | null>(null);
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const fetchInitialData = async (flowId: string) => {
      try {
        startLoading();
        const flow = await flowService.getFlow(flowId);
        setFlow(flow);
      } catch (error) {
        Logger.error('Error fetching flow data:', error);
      } finally {
        stopLoading();
      }
    };

    id && void fetchInitialData(id);
  }, [id]);

  return (
    <LayoutContainer>
      {flow && <FlowChartEditor setFlow={setFlow} flow={flow} />}
    </LayoutContainer>
  );
}

const FlowEditor = () => (
  <StepProvider>
    <FlowEditMain />
  </StepProvider>
);

export default FlowEditor;
