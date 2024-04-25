import { List, ListItemSecondaryAction, Typography } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useReactFlow } from 'reactflow';

import { StyledListItem, StyledStepItem } from './styled';

import { Bezier } from '@components/shared/Icons';
import { StepType } from '@components/FlowManagment/FlowChart/types';
import { NO_TAG_LABEL } from '@constants/common';
import { FlowNode } from '@domain/flow';
import StepActionsMenu from '@components/StepManagment/StepActionsMenu/StepActionsMenu';
import { useStep } from '@contexts/StepContext';

type StepListProps = {
  nodes: FlowNode[];
  isProductionFlow?: boolean;
};

const StepListCopy: React.FC<StepListProps> = ({
  nodes,
  isProductionFlow = false
}) => {
  const { step, setStep } = useStep();
  const location = useLocation();
  const isEditMode = location.pathname.includes('/edit');
  const { getNode } = useReactFlow();

  const steps = useMemo(
    () =>
      nodes.filter(
        (node) =>
          node.data.$type !== StepType.START && node.data.$type !== StepType.END
      ),
    [nodes]
  );

  const handleClick = useCallback((el: FlowNode) => {
    const currentNode = getNode(el.id);
    setStep(currentNode as FlowNode);
  }, []);

  return (
    <List>
      {steps.map((el) => (
        <StyledListItem
          className={step?.id === el.id ? 'active' : undefined}
          key={el.id}
          onClick={() => handleClick(el)}
        >
          <Bezier />
          <StyledStepItem>
            <Typography variant="caption">
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
              />
            </ListItemSecondaryAction>
          )}
        </StyledListItem>
      ))}
    </List>
  );
};

export default StepListCopy;
