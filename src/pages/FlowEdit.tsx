import { Button } from '@mui/material';

import {
  LayoutContainer,
  SideNavContainer,
  MainContainer
} from '@components/Layouts/MainLayout';
import FlowChart from '@components/FlowManagment/FlowChart/FlowChart';
import NavigateBack from '@components/shared/Link/NavigateBack';
import useInitialFlow from '@hooks/useInitialFlow';
import FlowHeader from '@components/FlowManagment/FlowHeader';

export default function FlowEdit() {
  const { elements, data } = useInitialFlow();

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
        <FlowHeader name={data.data.name} />
      </SideNavContainer>
      <MainContainer>
        <FlowChart isEditMode={true} elements={elements} data={data} />
      </MainContainer>
    </LayoutContainer>
  );
}
