import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useLoading } from '@contexts/LoadingContext';
import Logger from '@utils/logger';
import { PRODUCTION_FLOW_ID } from '@constants/common';
import { selectFlow } from '@store/flow/selectors';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { fetchFlow, fetchProductionFlow } from '@store/flow/asyncThunk';
import { resetFlow } from '@store/flow/flow';

function useInitialFlow() {
  const { id } = useParams();
  const { startLoading, stopLoading } = useLoading();
  const { flow } = useAppSelector(selectFlow);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchInitialData = async (flowId: string) => {
      try {
        startLoading();
        if (id === PRODUCTION_FLOW_ID) {
          await dispatch(fetchProductionFlow());
        } else {
          await dispatch(fetchFlow(flowId));
        }
      } catch (error) {
        Logger.error('Error fetching initial data:', error);
      } finally {
        stopLoading();
      }
    };

    if (id) {
      void fetchInitialData(id);
    } else {
      dispatch(resetFlow());
    }
  }, [id]);

  return { flow };
}

export default useInitialFlow;
