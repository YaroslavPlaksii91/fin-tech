import { StepConfigureViewProps } from '../types';
import ControlPanelSubFlow from '../ContolPanels/ControlPanelSubFlow';

import withFlowChartEditor from './withFlowChartEditor';

import StepConfigureView from '@components/StepManagment/StepConfigureView/StepConfigureView';
import { useActiveStep } from '@contexts/StepContext';

const StepConfigureViewSubFlow: React.FC<StepConfigureViewProps> = ({
  mainFlow,
  rfInstance,
  flow,
  isViewMode
}) => {
  const { activeStep, setActiveStep } = useActiveStep();
  return (
    activeStep.stepId && (
      <StepConfigureView
        flow={flow}
        mainFlow={mainFlow}
        resetActiveStepId={() =>
          setActiveStep({ subFlowId: flow.id, stepId: null })
        }
        rfInstance={rfInstance}
        activeStepId={activeStep.stepId}
        isViewMode={isViewMode}
      />
    )
  );
};

const SubFlowChartEditor = withFlowChartEditor(
  StepConfigureViewSubFlow,
  ControlPanelSubFlow
);

export default SubFlowChartEditor;
