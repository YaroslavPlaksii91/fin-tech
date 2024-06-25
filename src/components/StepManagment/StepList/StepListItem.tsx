import {
  ListItemIcon,
  Typography,
  ListItemSecondaryAction
} from '@mui/material';

import StepActionsMenu from '../StepActionsMenu/StepActionsMenu';

import { StyledListItem, StyledStepItem } from './styled';

import BezierIcon from '@icons/bezier.svg';
import { NO_TAG_LABEL } from '@constants/common';
import { FlowNode } from '@domain/flow';
import { ActiveStep } from '@contexts/StepContext';

interface StepListItemProps {
  step: FlowNode;
  level: number;
  subFlowId: string | null;
  activeStep: ActiveStep;
  setActiveStep: (value: ActiveStep) => void;
  isEditMode: boolean;
  isProductionFlow: boolean;
}

const StepListItem: React.FC<StepListItemProps> = ({
  step,
  activeStep,
  setActiveStep,
  isEditMode,
  subFlowId = null,
  isProductionFlow,
  level
}) => (
  <StyledListItem
    sx={{ paddingLeft: `${level * 40}px` }}
    key={step.id}
    className={activeStep.stepId === step.id ? 'active' : undefined}
    onClick={() => setActiveStep({ subFlowId, stepId: step.id })}
  >
    <ListItemIcon>
      <BezierIcon />
    </ListItemIcon>
    <StyledStepItem>
      <Typography variant="caption" color="textSecondary">
        {step.data.tag || NO_TAG_LABEL}
      </Typography>
      <Typography sx={{ whiteSpace: 'nowrap' }} variant="body2">
        {step.data.name}
      </Typography>
    </StyledStepItem>
    {!isProductionFlow && (
      <ListItemSecondaryAction>
        <StepActionsMenu
          subFlowId={subFlowId}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          flowNode={step}
          showActionMenuButton={true}
          isEditMode={isEditMode}
        />
      </ListItemSecondaryAction>
    )}
  </StyledListItem>
);

export default StepListItem;
