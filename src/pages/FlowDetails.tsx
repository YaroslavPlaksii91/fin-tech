import { Button } from '@mui/material';
import { NavLink } from 'react-router-dom';

import {
  LayoutContainer,
  SideNavContainer,
  MainContainer
} from '@components/Layouts/MainLayout';
import NavigateBack from '@components/shared/Link/NavigateBack';
import FlowChart from '@components/FlowManagment/FlowChart/FlowChart';
import useInitialFlow from '@hooks/useInitialFlow';
import { EditNoteOutlinedIcon } from '@components/shared/Icons';
import routes from '@constants/routes';
import FlowHeader from '@components/FlowManagment/FlowHeader';

export default function FlowDetails() {
  const { elements, data } = useInitialFlow();
  return (
    <LayoutContainer>
      <SideNavContainer
        footer={
          <NavLink to={`${routes.underwriting.flowList}/${data.id}/edit`}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              endIcon={<EditNoteOutlinedIcon />}
            >
              Edit flow
            </Button>
          </NavLink>
        }
        header={<NavigateBack title="Back to flow list" />}
      >
        <FlowHeader name={data.data.name} />
      </SideNavContainer>
      <MainContainer>
        <FlowChart data={data} elements={elements} />
      </MainContainer>
    </LayoutContainer>
  );
}
