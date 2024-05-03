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

import { StepType } from '@components/FlowManagment/FlowChart/types';
import { Bezier, ExpandMoreIcon } from '@components/shared/Icons';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledSubAccordionSummary
} from '@components/Sidebar/styled';
import { FlowNode } from '@domain/flow';

interface RecursiveStepListItemProps {
  step: FlowNode;
  level: number;
  activeStepId: null | string;
  setActiveStepId: (step: string | null) => void;
  isEditMode: boolean;
  isProductionFlow: boolean;
}

const RecursiveStepListItem: React.FC<RecursiveStepListItemProps> = ({
  step,
  activeStepId,
  setActiveStepId,
  isEditMode,
  isProductionFlow,
  level
}) => {
  if (step.data.$type !== StepType.SUBFLOW) {
    return (
      <StepListItem
        level={level}
        activeStepId={activeStepId}
        setActiveStepId={setActiveStepId}
        isEditMode={isEditMode}
        isProductionFlow={isProductionFlow}
        step={step}
      />
    );
  }

  const stepsSubflow: FlowNode[] = useMemo(
    () =>
      step.data?.nodes.filter(
        (node) =>
          node.data.$type !== StepType.START && node.data.$type !== StepType.END
      ),
    [step]
  );

  return (
    <StyledAccordion key={step.id}>
      <StyledListItem
        sx={{ paddingLeft: `${level * 40}px` }}
        className={activeStepId === step.id ? 'active' : undefined}
        onClick={() => setActiveStepId(step.id)}
      >
        <StyledSubAccordionSummary
          sx={{ paddingLeft: 0 }}
          expandIcon={<ExpandMoreIcon fontSize="medium" />}
          aria-controls={`${step.data.name}-content`}
          id={step.data.name}
        >
          <ListItemIcon>
            <Bezier />
          </ListItemIcon>
          <Typography variant="body2"> {step.data.name}</Typography>
        </StyledSubAccordionSummary>
        <ListItemSecondaryAction>
          <StepActionsMenu
            flowNode={step}
            showActionMenuButton={true}
            isEditMode={isEditMode}
            setActiveStepId={setActiveStepId}
            activeStepId={activeStepId}
          />
        </ListItemSecondaryAction>
      </StyledListItem>
      <StyledAccordionDetails>
        {stepsSubflow?.length === 0 && (
          <ListItem sx={{ paddingLeft: '40px' }}>
            <StyledStepItem>
              <Typography variant="body2">No steps</Typography>
            </StyledStepItem>
          </ListItem>
        )}
        {stepsSubflow.map((node) => (
          <RecursiveStepListItem
            key={node.id}
            step={node}
            level={level + 1}
            activeStepId={activeStepId}
            setActiveStepId={setActiveStepId}
            isEditMode={isEditMode}
            isProductionFlow={isProductionFlow}
          />
        ))}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default RecursiveStepListItem;
