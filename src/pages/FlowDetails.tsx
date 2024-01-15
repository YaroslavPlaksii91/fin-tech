import { Button } from '@mui/material';
import { NavLink, useParams } from 'react-router-dom';

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
import { PRODUCTION_FLOW_ID } from '@constants/common';

function FlowDetailsMain() {
  const { flow } = useInitialFlow();
  const { id } = useParams();
  const { step, setStep } = useStep();

  return (
    <LayoutContainer>
      <SideNavContainer
        footer={
          <NavLink
            to={routes.underwriting.flow.edit(flow?.id)}
            state={{
              from: routes.underwriting.flow.details(flow?.id)
            }}
          >
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={id === PRODUCTION_FLOW_ID}
              endIcon={<EditNoteOutlinedIcon />}
            >
              Edit flow
            </Button>
          </NavLink>
        }
        header={
          <NavigateTo
            title="Back to flow list"
            to={routes.underwriting.flow.list}
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
