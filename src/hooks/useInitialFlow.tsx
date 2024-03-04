import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useLoading } from '@contexts/LoadingContext';
import Logger from '@utils/logger';
import { PRODUCTION_FLOW_ID } from '@constants/common';
import { flowService } from '@services/flow-service';
import { IFlow } from '@domain/flow';

const initialFlow: IFlow = {
  id: '',
  nodes: [],
  edges: [],
  data: {
    name: '',
    createdBy: '',
    createdOn: '',
    editedBy: '',
    editedOn: ''
  },
  temporaryVariables: [],
  permanentVariables: [],
  viewport: { x: 0, y: 0, zoom: 1 }
};

function useInitialFlow() {
  const { id } = useParams();
  const [flow, setFlow] = useState<IFlow>(initialFlow);
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const fetchInitialData = async (flowId: string) => {
      try {
        startLoading();
        let data;
        if (id === PRODUCTION_FLOW_ID) {
          data = await flowService.getProductionFlowDetails();
        } else {
          data = await flowService.getFlow(flowId);
        }
        setFlow(data);
      } catch (error) {
        Logger.error('Error fetching initial data:', error);
      } finally {
        stopLoading();
      }
    };

    if (id) {
      void fetchInitialData(id);
    } else {
      setFlow(initialFlow);
    }
  }, [id]);

  return { flow };
}

export default useInitialFlow;
