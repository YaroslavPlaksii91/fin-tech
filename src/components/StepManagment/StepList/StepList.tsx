import { List, ListItem, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { StyledStepItem } from './styled';
import RecursiveStepListItem from './RecursiveStepListItem';

import { StepType } from '@components/FlowManagment/FlowChart/types';
import { FlowNode } from '@domain/flow';
import { useActiveStep } from '@contexts/StepContext';

type StepListProps = {
  nodes: FlowNode[];
  isProductionFlow?: boolean;
};

const StepList: React.FC<StepListProps> = ({
  nodes,
  isProductionFlow = false
}) => {
  const { activeStep, setActiveStep } = useActiveStep();

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
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          isProductionFlow={isProductionFlow}
        />
      ))}
    </List>
  );
};

export default StepList;
