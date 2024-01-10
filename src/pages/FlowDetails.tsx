import { Button } from '@mui/material';
import { NavLink } from 'react-router-dom';

import {
  LayoutContainer,
  SideNavContainer,
  MainContainer
} from '@components/Layouts/MainLayout';
import useInitialFlow from '@hooks/useInitialFlow';
import { EditNoteOutlinedIcon } from '@components/shared/Icons';
import routes from '@constants/routes';
import FlowHeader from '@components/FlowManagment/FlowHeader';
import { StepProvider, useStep } from '@contexts/StepContext';
import StepList from '@components/StepManagment/StepList/StepList';
import FlowChartReadOnlyView from '@components/FlowManagment/FlowChart/FlowChartReadOnlyView';
import NavigateTo from '@components/shared/Link/NavigateTo';

function FlowDetailsMain() {
  const { flow } = useInitialFlow();
  const { step, setStep } = useStep();

  return (
    <LayoutContainer>
      <SideNavContainer
        footer={
          <NavLink
            to={`${routes.underwriting.flowList}/${flow?.id}/edit`}
            state={{
              from: `${routes.underwriting.flowList}/${flow?.id}/details`
            }}
          >
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
        header={
          <NavigateTo
            title="Back to flow list"
            to={routes.underwriting.flowList}
          />
        }
      >
        <FlowHeader name={flow.data.name} />
        <StepList nodes={flow.nodes} step={step} setStep={setStep} />
      </SideNavContainer>
      <MainContainer>
        <FlowChartReadOnlyView flow={flow} />
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
