import { List, ListItem, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { StyledStepItem } from './styled';
import RecursiveStepListItem from './RecursiveStepListItem';

import { StepType } from '@components/FlowManagment/FlowChart/types';
import { FlowNode } from '@domain/flow';
import { useStep } from '@contexts/StepContext';

type StepListProps = {
  nodes: FlowNode[];
  isProductionFlow?: boolean;
};

const StepList: React.FC<StepListProps> = ({
  nodes,
  isProductionFlow = false
}) => {
  const { activeStepId, setActiveStepId } = useStep();
  const location = useLocation();
  const isEditMode = location.pathname.includes('/edit');

  const steps = useMemo(
    () =>
      nodes.filter(
        (node) =>
          node.data.$type !== StepType.START && node.data.$type !== StepType.END
      ),
    [nodes]
  );

  return (
    <List>
      {steps.length === 0 && (
        <ListItem sx={{ paddingLeft: '40px' }}>
          <StyledStepItem>
            <Typography variant="body2">No steps</Typography>
          </StyledStepItem>
        </ListItem>
      )}
      {steps.map((step) => (
        <RecursiveStepListItem
          key={step.id}
          step={step}
          level={1}
          isEditMode={isEditMode}
          setActiveStepId={setActiveStepId}
          activeStepId={activeStepId}
          isProductionFlow={isProductionFlow}
        />
      ))}
    </List>
  );
};

{
  /* {steps.map((step) => (
        <RecursiveListItem
          key={step.id}
          node={step}
          level={0}
          setActiveStepId={setActiveStepId}
          isProductionFlow={isProductionFlow}
        />
      ))} */
}
{
  /* {steps.length === 0 && (
        <ListItem sx={{ paddingLeft: '40px' }}>
          <StyledStepItem>
            <Typography variant="body2">No steps</Typography>
          </StyledStepItem>
        </ListItem>
      )}
      {steps.map((el) => (
        <StyledListItem
          className={activeStepId === el.id ? 'active' : undefined}
          key={el.id}
          onClick={() => setActiveStepId(el.id)}
        >
          <ListItemIcon>
            <Bezier />
          </ListItemIcon>
          <StyledStepItem>
            <Typography variant="caption" color="textSecondary">
              {el.data.tag || NO_TAG_LABEL}
            </Typography>
            <Typography variant="body2">{el.data.name}</Typography>
          </StyledStepItem>
          {!isProductionFlow && (
            <ListItemSecondaryAction>
              <StepActionsMenu
                flowNode={el}
                showActionMenuButton={true}
                isEditMode={isEditMode}
                setActiveStepId={setActiveStepId}
                activeStepId={activeStepId}
              />
            </ListItemSecondaryAction>
          )}
        </StyledListItem>
      ))} */
}

export default StepList;
