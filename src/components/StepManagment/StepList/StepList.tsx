import { ListItemSecondaryAction, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';

import { StyledStepItem, StyledStepItemText } from './styled';

import { StyledList, StyledListItem } from '@components/shared/List/styled';
import { HexagonOutlinedIcon } from '@components/shared/Icons';
import { StepType } from '@components/FlowManagment/FlowChart/types';
import { MAIN_STEP_ID, NO_TAG_LABEL } from '@constants/common';
import { FlowNode } from '@domain/flow';
import { StepContextType } from '@contexts/StepContext';
import StepActionsMenu from '@components/StepManagment/StepActionsMenu/StepActionsMenu';

type StepListProps = {
  nodes: FlowNode[];
} & StepContextType;

const StepList: React.FC<StepListProps> = ({ nodes, setStep, step }) => {
  const [menu, setMenu] = useState<HTMLElement | null>(null);

  const steps = useMemo(() => {
    const steps = nodes.filter(
      (node) =>
        node.data.$type !== StepType.START && node.data.$type !== StepType.END
    );
    return steps;
  }, [nodes]);

  return (
    <StyledList>
      <StyledListItem
        className={step.id === MAIN_STEP_ID ? 'active' : undefined}
        key={MAIN_STEP_ID}
        onClick={() => setStep({ id: MAIN_STEP_ID })}
      >
        <HexagonOutlinedIcon sx={{ paddingRight: 1 }} />
        <StyledStepItemText>Main flow</StyledStepItemText>
      </StyledListItem>
      {steps.map((el) => (
        <StyledListItem
          className={step.id === el.id ? 'active' : undefined}
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

          <ListItemSecondaryAction>
            <StepActionsMenu
              showActionMenuButton={true}
              anchorEl={menu}
              setAnchorEl={setMenu}
            />
          </ListItemSecondaryAction>
        </StyledListItem>
      ))}
    </StyledList>
  );
};

export default StepList;
