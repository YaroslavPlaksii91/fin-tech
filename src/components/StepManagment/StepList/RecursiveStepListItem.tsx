import React, { useMemo } from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Typography
} from '@mui/material';

import StepActionsMenu from '../StepActionsMenu/StepActionsMenu';

import StepListItem from './StepListItem';
import { StyledListItem, StyledStepItem } from './styled';

import BezierIcon from '@icons/bezier.svg';
import { StepType } from '@components/FlowManagment/FlowChart/types';
import { ExpandMoreIcon } from '@components/shared/Icons';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledSubAccordionSummary
} from '@components/Sidebar/styled';
import { FlowNode } from '@domain/flow';
import { ActiveStep } from '@contexts/StepContext';

interface RecursiveStepListItemProps {
  step: FlowNode;
  level: number;
  activeStep: ActiveStep;
  setActiveStep: (value: ActiveStep) => void;
  subFlowId?: string;
  isEditMode: boolean;
  isProductionFlow: boolean;
}

const RecursiveStepListItem: React.FC<RecursiveStepListItemProps> = ({
  step,
  activeStep,
  setActiveStep,
  isEditMode,
  subFlowId = null,
  isProductionFlow,
  level
}) => {
  if (step.data.$type !== StepType.SUBFLOW) {
    return (
      <StepListItem
        subFlowId={subFlowId}
        level={level}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        isEditMode={isEditMode}
        isProductionFlow={isProductionFlow}
        step={step}
      />
    );
  }

  const stepsSubflow = useMemo(
    () =>
      step.data?.nodes?.filter(
        (node) =>
          node.data.$type !== StepType.START && node.data.$type !== StepType.END
      ),
    [step]
  );

  return (
    <StyledAccordion key={step.id}>
      <StyledListItem
        sx={{ paddingLeft: `${level * 40}px` }}
        className={activeStep.subFlowId === step.id ? 'active' : undefined}
        onClick={() => {
          setActiveStep({ subFlowId: step.id, stepId: null });
        }}
      >
        <StyledSubAccordionSummary
          sx={{ paddingLeft: 0 }}
          expandIcon={<ExpandMoreIcon fontSize="medium" />}
          aria-controls={`${step.data.name}-content`}
          id={step.data.name}
        >
          <ListItemIcon>
            <BezierIcon />
          </ListItemIcon>
          <Typography sx={{ whiteSpace: 'nowrap' }} variant="body2">
            {step.data.name}
          </Typography>
        </StyledSubAccordionSummary>
        <ListItemSecondaryAction>
          <StepActionsMenu
            subFlowId={step.id}
            flowNode={step}
            showActionMenuButton={true}
            isEditMode={isEditMode}
            setActiveStep={setActiveStep}
            activeStep={activeStep}
          />
        </ListItemSecondaryAction>
      </StyledListItem>
      <StyledAccordionDetails>
        {stepsSubflow?.length === 0 && (
          <ListItem sx={{ paddingLeft: `${level * 40}px` }}>
            <StyledStepItem>
              <Typography variant="body2">No steps</Typography>
            </StyledStepItem>
          </ListItem>
        )}
        {stepsSubflow?.map((node) => (
          <RecursiveStepListItem
            subFlowId={step.id}
            key={node.id}
            step={node}
            level={level + 1}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            isEditMode={isEditMode}
            isProductionFlow={isProductionFlow}
          />
        ))}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default React.memo(RecursiveStepListItem);
