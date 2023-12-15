import { Button } from '@mui/material';
import { ReactFlowProvider } from 'reactflow';

import {
  LayoutContainer,
  SideNavContainer,
  MainContainer
} from '@components/Layouts/MainLayout';
import FlowChart from '@components/FlowManagment/FlowChart/FlowChart';
import NavigateBack from '@components/shared/Link/NavigateBack';
import useInitialFlow from '@hooks/useInitialFlow';

export default function FlowEdit() {
  const { elements, data } = useInitialFlow();

  return (
    <ReactFlowProvider>
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
          <FlowChart isEditMode={true} elements={elements} data={data} />
        </MainContainer>
      </LayoutContainer>
    </ReactFlowProvider>
  );
}
