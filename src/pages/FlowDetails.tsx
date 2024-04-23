import { ReactFlowProvider } from 'reactflow';

import { LayoutContainer, MainContainer } from '@components/Layouts/MainLayout';
import useInitialFlow from '@hooks/useInitialFlow';
import FlowHeader from '@components/FlowManagment/FlowHeader';
import { StepProvider, useStep } from '@contexts/StepContext';
import StepList from '@components/StepManagment/StepList/StepList';
import FlowChartReadOnlyView from '@components/FlowManagment/FlowChart/FlowChartReadOnlyView';
import { checkIsProductionFlow } from '@utils/helpers';

function FlowDetailsMain() {
  const { flow } = useInitialFlow();
  const { step, setStep } = useStep();
  const isProductionFlow = checkIsProductionFlow();

  return (
    <LayoutContainer>
      <FlowHeader name={flow.data.name} />
      <StepList
        isProductionFlow={isProductionFlow}
        nodes={flow.nodes}
        step={step}
        setStep={setStep}
      />
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
