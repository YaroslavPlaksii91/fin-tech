import { CustomReactFlowInstance } from '../types';
import ControlPanelSubflowEdit from '../ContolPanels/ControlPanelEditSubflow';

import withFlowChartEditor from './withFlowChartEditor';

import StepConfigureView from '@components/StepManagment/StepConfigureView/StepConfigureView';
import { useActiveStep } from '@contexts/StepContext';
import { IFlow } from '@domain/flow';

interface StepConfigureViewProps {
  flow: IFlow;
  rfInstance: CustomReactFlowInstance;
}

const StepConfigureViewSubFlow: React.FC<StepConfigureViewProps> = ({
  rfInstance,
  flow
}) => {
  const { activeStep, setActiveStep } = useActiveStep();
  return (
    rfInstance &&
    activeStep.stepId && (
      <StepConfigureView
        flow={flow}
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
