import { StepConfigureViewProps } from '../types';
import ControlPanelEdit from '../ContolPanels/ControlPanelEdit';

import withFlowChartEditor from './withFlowChartEditor';

import StepConfigureView from '@components/StepManagment/StepConfigureView/StepConfigureView';
import { useActiveStep } from '@contexts/StepContext';
import Subflow from '@views/Subflow/Subflow';

const StepConfigureViewMainFlow: React.FC<StepConfigureViewProps> = ({
  flow,
  rfInstance
}) => {
  const { activeStep, resetActive } = useActiveStep();
  return (
    <>
      {rfInstance && activeStep?.stepId && !activeStep?.subFlowId && (
        <StepConfigureView
          flow={flow}
          resetActiveStepId={resetActive}
          rfInstance={rfInstance}
          activeStepId={activeStep.stepId}
        />
      )}
      {rfInstance && activeStep?.subFlowId && (
        <Subflow
          resetActiveStepId={resetActive}
          activeStepId={activeStep.subFlowId}
          rfInstance={rfInstance}
          mainFlow={flow}
        />
      )}
    </>
  );
};

const MainFlowChartEditor = withFlowChartEditor(
  StepConfigureViewMainFlow,
  ControlPanelEdit
);

export default MainFlowChartEditor;
