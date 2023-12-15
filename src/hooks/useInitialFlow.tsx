import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Node, Edge } from 'reactflow';

import { useLoading } from '../contexts/LoadingContext';
import { flowService } from '../services/flow-service';

import Logger from '@utils/logger';
import { getUpdatedElementsAfterNodeAddition } from '@components/FlowManagment/FlowChart/utils/workflowElementsUtils';
import { ObjectType } from '@components/FlowManagment/FlowChart/types';

function useInitialFlow() {
  const { id } = useParams();
  const [elements, setElements] = useState<(Node | Edge)[]>([]);
  const { startLoading, stopLoading } = useLoading();

  const [generalData, setGeneralData] = useState({
    viewport: { x: 0, y: 0, zoom: 1 },
    id: '',
    data: { name: '' }
  });

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
          nodes: nodesData,
          edges: edgesData,
          viewport,
          data,
          id
        } = await flowService.getFlow(flowId);
        const nodes = nodesData.map((node) => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: { ...node.data }
        }));
        const edges = edgesData.map((edge) => ({
          id: edge.id,
          type: edge.type,
          source: edge.source,
          target: edge.target,
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
