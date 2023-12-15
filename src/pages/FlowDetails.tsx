import { ReactFlowProvider } from 'reactflow';
import { Button } from '@mui/material';

import {
  LayoutContainer,
  SideNavContainer,
  MainContainer
} from '@components/Layouts/MainLayout';
import NavigateBack from '@components/shared/Link/NavigateBack';
import FlowChart from '@components/FlowManagment/FlowChart/FlowChart';
import useInitialFlow from '@hooks/useInitialFlow';

export default function FlowDetails() {
  const { elements, data } = useInitialFlow();
  return (
    <LayoutContainer>
      <ReactFlowProvider>
        <SideNavContainer
          footer={
            <Button variant="contained" color="primary">
              Edit flow
            </Button>
          }
          header={<NavigateBack title="Back to flow list" />}
        >
          Object list
        </SideNavContainer>
        <MainContainer>
          <FlowChart isEditMode data={data} elements={elements} />
        </MainContainer>
      </ReactFlowProvider>
    </LayoutContainer>
  );
}
