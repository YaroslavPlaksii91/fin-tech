import {
  ListItemIcon,
  Typography,
  ListItemSecondaryAction
} from '@mui/material';

import StepActionsMenu from '../StepActionsMenu/StepActionsMenu';

import { StyledListItem, StyledStepItem } from './styled';

import { Bezier } from '@components/shared/Icons';
import { NO_TAG_LABEL } from '@constants/common';
import { FlowNode } from '@domain/flow';

interface StepListItemProps {
  step: FlowNode;
  level: number;
  activeStepId: null | string;
  setActiveStepId: (step: string | null) => void;
  isEditMode: boolean;
  isProductionFlow: boolean;
}

const StepListItem: React.FC<StepListItemProps> = ({
  step,
  activeStepId,
  setActiveStepId,
  isEditMode,
  isProductionFlow,
  level
}) => (
  <StyledListItem
    sx={{ paddingLeft: `${level * 40}px` }}
    key={step.id}
    className={activeStepId === step.id ? 'active' : undefined}
    onClick={() => setActiveStepId(step.id)}
  >
    <ListItemIcon>
      <Bezier />
    </ListItemIcon>
    <StyledStepItem>
      <Typography variant="caption" color="textSecondary">
        {step.data.tag || NO_TAG_LABEL}
      </Typography>
      <Typography variant="body2">{step.data.name}</Typography>
    </StyledStepItem>
    {!isProductionFlow && (
      <ListItemSecondaryAction>
        <StepActionsMenu
          flowNode={step}
          showActionMenuButton={true}
          isEditMode={isEditMode}
          setActiveStepId={setActiveStepId}
          activeStepId={activeStepId}
        />
      </ListItemSecondaryAction>
    )}
  </StyledListItem>
);

export default StepListItem;
