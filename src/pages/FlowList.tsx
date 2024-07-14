import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import FlowChartReadOnlyView from '@components/FlowManagment/FlowChart/FlowChartReadOnlyView';
import { selectFlow } from '@store/flow/selectors';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { PRODUCTION_FLOW_ID } from '@constants/common';
import { useLoading } from '@contexts/LoadingContext';
import { getProductionFlow, getFlow } from '@store/flow/asyncThunk';
import { setInitialFlow } from '@store/flow/flow';
import { useActiveStep } from '@contexts/StepContext';
import Logger from '@utils/logger';

export default function FlowsNew() {
  const { id } = useParams();
  const { flow } = useAppSelector(selectFlow);
  const dispatch = useAppDispatch();
  const { resetActive } = useActiveStep();
  const { startLoading, stopLoading } = useLoading();

  const isProductionFlow = id === PRODUCTION_FLOW_ID;

  useEffect(() => {
    const fetchFlow = async (flowId: string) => {
      try {
        startLoading();
        if (id === PRODUCTION_FLOW_ID) {
          await dispatch(getProductionFlow());
        } else {
          await dispatch(getFlow(flowId));
        }
      } catch (error) {
        Logger.error('Error fetching initial data:', error);
      } finally {
        stopLoading();
      }
    };

    resetActive();
    if (id) {
      void fetchFlow(id);
    } else {
      dispatch(setInitialFlow());
    }
  }, []);

  return (
    flow && (
      <FlowChartReadOnlyView
        showControlPanel={!!flow.id}
        flow={flow}
        isProductionFlow={isProductionFlow}
      />
    )
  );
}
