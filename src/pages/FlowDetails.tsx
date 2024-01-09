import { Button } from '@mui/material';
import { NavLink } from 'react-router-dom';

import {
  LayoutContainer,
  SideNavContainer,
  MainContainer
} from '@components/Layouts/MainLayout';
import NavigateBack from '@components/shared/Link/NavigateBack';
import FlowChart from '@components/FlowManagment/FlowChart/FlowChartView';
import useInitialFlow from '@hooks/useInitialFlow';
import { EditNoteOutlinedIcon } from '@components/shared/Icons';
import routes from '@constants/routes';
import FlowHeader from '@components/FlowManagment/FlowHeader';
import { StepProvider, useStep } from '@contexts/StepContext';
import StepList from '@components/StepManagment/StepList/StepList';

function FlowDetailsMain() {
  const { flow } = useInitialFlow();
  const { step, setStep } = useStep();

  return (
    <LayoutContainer>
      <SideNavContainer
        footer={
          <NavLink to={`${routes.underwriting.flowList}/${flow?.id}/edit`}>
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
        <FlowHeader name={flow.data.name} />
        <StepList nodes={flow.nodes} step={step} setStep={setStep} />
      </SideNavContainer>
      <MainContainer>
        <FlowChart isViewMode={false} flow={flow} />
      </MainContainer>
    </LayoutContainer>
  );
}

const FlowDetails = () => (
  <StepProvider>
    <FlowDetailsMain />
  </StepProvider>
);

export default FlowDetails;
