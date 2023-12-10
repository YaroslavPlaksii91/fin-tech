import { useState, useEffect } from 'react';
import { Node, Edge } from 'reactflow';
import { Button } from '@mui/material';

import {
  initialEdges,
  initialNodes
} from '../components/FlowManagment/FlowChart/data';

import {
  LayoutContainer,
  SideNavContainer,
  MainContainer
} from '@components/Layouts/MainLayout';
import { getUpdatedElementsAfterNodeAddition } from '@components/FlowManagment/FlowChart/utils/workflowElementsUtils';
import FlowChartNew from '@components/FlowManagment/FlowChart/FlowChartNew';
import { ObjectType } from '@components/FlowManagment/FlowChart/types';
import NavigateBack from '@components/shared/Link/NavigateBack';

export default function FlowEdit() {
  const [elements, setElements] = useState<(Node | Edge)[]>([]);

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
        onAdd: onAddNodeCallback
      })
    );
  };

  useEffect(() => {
    // Add simular request to get Nodes
    const nodes = initialNodes;
    const edges = initialEdges.map((edge) => ({
      ...edge,
      data: { onAdd: onAddNodeCallback }
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
        header={<NavigateBack title="Back to view mode" />}
      >
        Object list
      </SideNavContainer>
      <MainContainer>
        <FlowChartNew isEditMode={true} elements={elements} />
      </MainContainer>
    </LayoutContainer>
  );
}
