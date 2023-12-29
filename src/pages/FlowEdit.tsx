import { ListItemSecondaryAction, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

import {
  LayoutContainer,
  SideNavContainer,
  MainContainer
} from '@components/Layouts/MainLayout';
import FlowChart from '@components/FlowManagment/FlowChart/FlowChart';
import NavigateBack from '@components/shared/Link/NavigateBack';
import useInitialFlow from '@hooks/useInitialFlow';
import FlowHeader from '@components/FlowManagment/FlowHeader';
import { SelectStep } from '@components/StepManagment/StepSelectionDialog/SelectStep';
import {
  StyledList,
  StyledListItem,
  StyledListItemText
} from '@components/shared/List/styled';
import { HexagonOutlinedIcon } from '@components/shared/Icons';
import ActionsMenu from '@components/StepManagment/ActionsMenu/ActionsMenu';
import StepConfigureView from '@components/StepManagment/StepConfigureView/StepConfigureView';
import { StepType } from '@components/FlowManagment/FlowChart/types';
import { MAIN_STEP_ID } from '@constants/common';
import { FlowNode } from '@domain/flow';

export default function FlowEdit() {
  const { flow } = useInitialFlow();
  const [step, setStep] = useState<FlowNode | { id: string }>({
    id: MAIN_STEP_ID
  });

  const steps = useMemo(() => {
    const steps = flow.nodes.filter(
      (node) =>
        node.data.$type !== StepType.START && node.data.$type !== StepType.END
    );
    return steps;
  }, [flow.nodes]);

  return (
    <LayoutContainer>
      <SideNavContainer
        footer={<SelectStep />}
        header={<NavigateBack title="Back to view mode" />}
      >
        <FlowHeader name={flow.data.name} />
        <StyledList>
          <StyledListItem
            key={MAIN_STEP_ID}
            onClick={() => setStep({ id: MAIN_STEP_ID })}
          >
            <HexagonOutlinedIcon sx={{ paddingRight: 1 }} />
            <StyledListItemText>Main flow</StyledListItemText>
          </StyledListItem>
          {steps.map((step) => (
            <StyledListItem key={step.id} onClick={() => setStep(step)}>
              <HexagonOutlinedIcon sx={{ paddingRight: 1 }} />
              <Stack>
                <Typography variant="caption">
                  {step.data.tag || 'No tag'}
                </Typography>
                <StyledListItemText>{step.data.name}</StyledListItemText>
              </Stack>
              <ListItemSecondaryAction>
                <ActionsMenu />
              </ListItemSecondaryAction>
            </StyledListItem>
          ))}
        </StyledList>
      </SideNavContainer>
      <MainContainer>
        {step.id === MAIN_STEP_ID ? (
          <FlowChart isEditMode={true} flow={flow} />
        ) : (
          <StepConfigureView step={step as FlowNode} />
        )}
      </MainContainer>
    </LayoutContainer>
  );
}
