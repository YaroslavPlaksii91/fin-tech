import { ReactFlowProvider } from 'reactflow';
import { Button } from '@mui/material';

import {
  LayoutContainer,
  SideNavContainer,
  MainContainer
} from '@components/Layouts/MainLayout';
import NavigateBack from '@components/shared/Link/NavigateBack';

export default function FlowDetails() {
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
        <MainContainer>flow details</MainContainer>
      </ReactFlowProvider>
    </LayoutContainer>
  );
}
