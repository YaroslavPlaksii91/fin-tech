import {
  LayoutContainer,
  SideNavContainer,
  MainContainer
} from '@components/Layouts/MainLayout';
import FlowChart from '@components/FlowManagment/FlowChart/FlowChartView';
import NavigateBack from '@components/shared/Link/NavigateBack';
import useInitialFlow from '@hooks/useInitialFlow';
import FlowHeader from '@components/FlowManagment/FlowHeader';
import { SelectStep } from '@components/StepManagment/StepSelectionDialog/SelectStep';
import StepConfigureView from '@components/StepManagment/StepConfigureView/StepConfigureView';
import { MAIN_STEP_ID } from '@constants/common';
import { FlowNode } from '@domain/flow';
import { useStep, StepProvider } from '@contexts/StepContext';
import StepList from '@components/StepManagment/StepList/StepList';

function FlowEditMain() {
  const { flow } = useInitialFlow();
  const { step, setStep } = useStep();

  return (
    <LayoutContainer>
      <SideNavContainer
        footer={<SelectStep />}
        header={<NavigateBack title="Back to view mode" />}
      >
        <FlowHeader name={flow.data.name} />
        <StepList nodes={flow.nodes} step={step} setStep={setStep} />
      </SideNavContainer>
      <MainContainer>
        <FlowChart isViewMode={false} flow={flow} />
        {step.id !== MAIN_STEP_ID && (
          <StepConfigureView step={step as FlowNode} />
        )}
      </MainContainer>
    </LayoutContainer>
  );
}

const FlowEdit = () => (
  <StepProvider>
    <FlowEditMain />
  </StepProvider>
);

export default FlowEdit;
