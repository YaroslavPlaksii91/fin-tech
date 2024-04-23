import { ListItemSecondaryAction, Typography } from '@mui/material';
import React, { useMemo } from 'react';

import { StyledStepItem, StyledStepItemText } from './styled';

import { StyledList, StyledListItem } from '@components/shared/List/styled';
import { Bezier, HexagonOutlinedIcon } from '@components/shared/Icons';
import { StepType } from '@components/FlowManagment/FlowChart/types';
import { MAIN_STEP_ID, NO_TAG_LABEL } from '@constants/common';
import { FlowNode } from '@domain/flow';
import StepActionsMenu from '@components/StepManagment/StepActionsMenu/StepActionsMenu';
import { useStep } from '@contexts/StepContext';

type StepListProps = {
  nodes: FlowNode[];
  isProductionFlow?: boolean;
};

const StepList: React.FC<StepListProps> = ({
  nodes,
  isProductionFlow = false
}) => {
  const { step, setStep } = useStep();
  const steps = useMemo(
    () =>
      nodes.filter(
        (node) =>
          node.data.$type !== StepType.START && node.data.$type !== StepType.END
      ),
    [nodes]
  );

  // console.log('step:', step.data.name);

  return (
    <StyledList>
      <StyledListItem
        // className={step.id === MAIN_STEP_ID ? 'active' : undefined}
        key={MAIN_STEP_ID}
        // onClick={() => setStep({ id: MAIN_STEP_ID })}
      >
        <Bezier />
        <StyledStepItemText>Main flow</StyledStepItemText>
      </StyledListItem>
      {steps.map((el) => (
        <StyledListItem
          className={step?.id === el.id ? 'active' : undefined}
          key={el.id}
          onClick={() => setStep(el)}
        >
          <HexagonOutlinedIcon sx={{ paddingRight: 1 }} />
          <StyledStepItem>
            <Typography variant="caption">
              {el.data.tag || NO_TAG_LABEL}
            </Typography>
            <StyledStepItemText>{el.data.name}</StyledStepItemText>
          </StyledStepItem>
          {!isProductionFlow && (
            <ListItemSecondaryAction>
              <StepActionsMenu flowNode={el} showActionMenuButton={true} />
            </ListItemSecondaryAction>
          )}
        </StyledListItem>
      ))}
    </StyledList>
  );
};

export default StepList;
