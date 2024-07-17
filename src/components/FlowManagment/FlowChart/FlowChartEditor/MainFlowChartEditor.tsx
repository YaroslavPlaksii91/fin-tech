import { StepConfigureViewProps } from '../types';
import ControlPanelMainFlow from '../ContolPanels/ControlPanelMainFlow';

import withFlowChartEditor from './withFlowChartEditor';

import StepConfigureView from '@components/StepManagment/StepConfigureView/StepConfigureView';
import { useActiveStep } from '@contexts/StepContext';
import Subflow from '@views/Subflow/Subflow';

const StepConfigureViewMainFlow: React.FC<StepConfigureViewProps> = ({
  flow,
  rfInstance,
  isViewMode
}) => {
  const { activeStep, resetActive } = useActiveStep();
  return (
    <>
      {activeStep.stepId && !activeStep.subFlowId && (
        <StepConfigureView
          flow={flow}
          resetActiveStepId={resetActive}
          rfInstance={rfInstance}
          activeStepId={activeStep.stepId}
          isViewMode={isViewMode}
        />
      )}
      {activeStep.subFlowId && (
        <Subflow
          mainFlow={flow}
          resetActiveStepId={resetActive}
          activeStepId={activeStep.subFlowId}
          rfInstance={rfInstance}
          isViewMode={isViewMode}
        />
      )}
    </>
  );
};

const MainFlowChartEditor = withFlowChartEditor(
  StepConfigureViewMainFlow,
  ControlPanelMainFlow
);

export default MainFlowChartEditor;
