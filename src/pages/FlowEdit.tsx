import { useState, useEffect } from 'react';
import { Node, Edge } from 'reactflow';
import { Button } from '@mui/material';

import { initialEdges, initialNodes } from '../components/Flows/FlowChart/data';

import {
  LayoutContainer,
  SideNavContainer,
  MainContainer
} from '@components/Layouts/MainLayout';
import { getUpdatedElementsAfterNodeAddition } from '@components/Flows/FlowChart/utils/workflowElementsUtils';
import FlowChartNew from '@components/Flows/FlowChart/FlowChartNew';
import { ObjectType } from '@components/Flows/FlowChart/types';

export default function FlowEdit() {
  const [elements, setElements] = useState<Array<Node | Edge>>([]);

  const onAddNodeCallback = ({
    id,
    type
  }: {
    id: string;
    type: ObjectType;
  }) => {
    setElements((elements) =>
      getUpdatedElementsAfterNodeAddition({
        elements,
        type,
        targetEdgeId: id,
        onAddNodeCallback
      })
    );
  };

  useEffect(() => {
    // Add simular request to get Nodes
    const nodes = initialNodes;
    const edges = initialEdges.map((edge) => ({
      ...edge,
      // TODO: fix after discussion
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: { ...edge.data, onAddNodeCallback }
    }));
    setElements([...nodes, ...edges]);
  }, []);

  return (
    <LayoutContainer>
      <SideNavContainer
        footer={
          <Button variant="contained" color="primary">
            Add new object
          </Button>
        }
        title="Back to view mode"
      >
        Object list
      </SideNavContainer>
      <MainContainer>
        <FlowChartNew elements={elements} />
      </MainContainer>
    </LayoutContainer>
  );
}
