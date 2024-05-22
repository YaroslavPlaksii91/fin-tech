import { StepConfigureViewProps } from '../types';
import ControlPanelSubflowEdit from '../ContolPanels/ControlPanelEditSubflow';

import withFlowChartEditor from './withFlowChartEditor';

import StepConfigureView from '@components/StepManagment/StepConfigureView/StepConfigureView';
import { useActiveStep } from '@contexts/StepContext';

const StepConfigureViewSubFlow: React.FC<StepConfigureViewProps> = ({
  mainFlow,
  rfInstance,
  flow
}) => {
  const { activeStep, setActiveStep } = useActiveStep();
  return (
    rfInstance &&
    activeStep.stepId && (
      <StepConfigureView
        flow={flow}
        mainFlow={mainFlow}
        resetActiveStepId={() =>
          setActiveStep({ subFlowId: flow.id, stepId: null })
        }
        rfInstance={rfInstance}
        activeStepId={activeStep.stepId}
      />
    )
  );
};

const SubFlowChartEditor = withFlowChartEditor(
  StepConfigureViewSubFlow,
  ControlPanelSubflowEdit
);

export default SubFlowChartEditor;
