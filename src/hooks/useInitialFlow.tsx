import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Node, Edge, Viewport } from 'reactflow';

import { useLoading } from '../contexts/LoadingContext';
import { flowService } from '../services/flow-service';

import Logger from '@utils/logger';
import { getUpdatedElementsAfterNodeAddition } from '@components/FlowManagment/FlowChart/utils/workflowElementsUtils';
import { ObjectType } from '@components/FlowManagment/FlowChart/types';
import { FlowData } from '@domain/flow';

const defaultData = {
  id: '',
  viewport: { x: 0, y: 0, zoom: 1 },
  data: {
    id: '',
    name: '',
    createdBy: '',
    createdOn: '',
    editedBy: '',
    editedOn: ''
  }
};

function useInitialFlow() {
  const { id } = useParams();
  const [elements, setElements] = useState<(Node | Edge)[]>([]);
  const { startLoading, stopLoading } = useLoading();

  const [generalData, setGeneralData] = useState<{
    viewport: Viewport;
    id: string;
    data: FlowData;
  }>(defaultData);

  const onAddNodeCallback = ({
    id,
    type
  }: {
    id: string;
    type: ObjectType;
  }) => {
    setElements((prevElements) =>
      getUpdatedElementsAfterNodeAddition({
        elements: prevElements,
        type,
        targetEdgeId: id,
        onAdd: onAddNodeCallback
      })
    );
  };

  useEffect(() => {
    const fetchInitialData = async (flowId: string) => {
      try {
        startLoading();
        const {
          nodes,
          edges: edgesData,
          viewport,
          data,
          id
        } = await flowService.getFlow(flowId);
        const edges = edgesData.map((edge) => ({
          ...edge,
          data: { onAdd: onAddNodeCallback }
        }));
        setElements([...nodes, ...edges]);
        setGeneralData({ viewport, data, id });
      } catch (error) {
        Logger.error('Error fetching initial data:', error);
      } finally {
        stopLoading();
      }
    };

    id && void fetchInitialData(id);
  }, [id]);

  return { elements, data: generalData };
}

export default useInitialFlow;
