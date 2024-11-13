import { List, ListItem, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { StyledStepItem } from './styled';
import RecursiveStepListItem from './RecursiveStepListItem';
import { sortNodesAlphabetically } from './utils';

import { StepType } from '@components/FlowManagment/FlowChart/types';
import { FlowNode } from '@domain/flow';
import { useActiveStep } from '@contexts/StepContext';

interface StepListProps {
  nodes: FlowNode[];
  isProductionFlow?: boolean;
}

const StepList = ({ nodes, isProductionFlow = false }: StepListProps) => {
  const { activeStep, setActiveStep } = useActiveStep();

  const location = useLocation();
  const isEditMode = location.pathname.includes('/edit');

  const steps = useMemo(
    () =>
      sortNodesAlphabetically(nodes).filter(
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
