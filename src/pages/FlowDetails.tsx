import { Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';

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
import { checkIsProductionFlow } from '@utils/helpers';

function FlowDetailsMain() {
  const { flow } = useInitialFlow();
  const { step, setStep } = useStep();
  const isProductionFlow = checkIsProductionFlow();

  return (
    <LayoutContainer>
      <SideNavContainer
        footer={
          <Button
            component={NavLink}
            to={routes.underwriting.flow.edit(flow?.id)}
            variant="contained"
            color="primary"
            fullWidth
            disabled={isProductionFlow}
            endIcon={<EditNoteOutlinedIcon />}
          >
            Edit flow
          </Button>
        }
        header={
          <NavigateTo
            title="Back to flow list"
            to={routes.underwriting.flow.list}
          />
        }
      >
        <FlowHeader name={flow.data.name} />
        <StepList
          isProductionFlow={isProductionFlow}
          nodes={flow.nodes}
          step={step}
          setStep={setStep}
        />
      </SideNavContainer>
      <MainContainer>
        <FlowChartReadOnlyView
          isProductionFlow={isProductionFlow}
          flow={flow}
        />
      </MainContainer>
    </LayoutContainer>
  );
}

const FlowDetails = () => (
  <StepProvider>
    <ReactFlowProvider>
      <FlowDetailsMain />
    </ReactFlowProvider>
  </StepProvider>
);

export default FlowDetails;
