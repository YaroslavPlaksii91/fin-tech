import { useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';

import { AddStep } from '../AddStep/AddStep';

import { StyledButtonText, StyledSelectionButton } from './styled';

import Dialog from '@components/shared/Modals/Dialog';
import {
  AddIcon,
  ArrowForwardIcon,
  HexagonOutlinedIcon
} from '@components/shared/Icons';
import { StepType } from '@components/FlowManagment/FlowChart/types';

const options: {
  id: Exclude<StepType, StepType.START | StepType.END>;
  label: string;
  helperText: string;
}[] = [
  {
    id: StepType.CHAMPION_CHALLENGER,
    label: 'Champion Challenger',
    helperText:
      'A Champion Challenger is an object that allows you to split traffic into several groups and run experiment.'
  },
  {
    id: StepType.CALCULATION,
    label: 'Calculation',
    helperText:
      'Calculation is an object that allows the User to set a value for the parameter.'
  },
  {
    id: StepType.DECISION_MATRIX,
    label: 'Decision matrix',
    helperText:
      'A decision table is an object that allows to set expressions for columns and rows. The system will go through the table and analyze the values.'
  },
  {
    id: StepType.CONDITION,
    label: 'Condition',
    helperText:
      'A condition is an object that allows the User to break the flow into two mutually exclusive paths.'
  },
  {
    id: StepType.CASE,
    label: 'Case',
    helperText:
      'A case is an object that allows to set multiple conditions. Based on the number of conditions, it breaks the flow into the corresponding number of mutually exclusive paths.'
  },
  {
    id: StepType.SUBFLOW,
    label: 'Subflow',
    helperText: 'Subflow'
  }
];

export const SelectStep: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [addStepModalOpen, setAddStepModalOpen] = useState<boolean>(false);
  const [selectedStep, setSelectedStep] =
    useState<Exclude<StepType, StepType.START | StepType.END>>();

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const openAddStepModalForm = (
    step: Exclude<StepType, StepType.START | StepType.END>
  ) => {
    handleCloseModal();
    setSelectedStep(step);
    setAddStepModalOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleOpenModal}
        variant="contained"
        color="primary"
        endIcon={<AddIcon />}
      >
        Add new step
      </Button>
      <Dialog
        title="Add a new step"
        open={modalOpen}
        onClose={handleCloseModal}
        displayConfirmBtn={false}
        displayedCancelBtn={false}
        isCloseButton
      >
        <Stack direction="column">
          {options.map((option) => (
            <StyledSelectionButton
              key={option.id}
              onClick={() => openAddStepModalForm(option.id)}
            >
              <HexagonOutlinedIcon />
              <StyledButtonText variant="h6">
                {option.label}
                <Typography variant="body2">{option.helperText}</Typography>
              </StyledButtonText>
              <ArrowForwardIcon sx={{ marginLeft: 'auto' }} />
            </StyledSelectionButton>
          ))}
        </Stack>
      </Dialog>
      {selectedStep && (
        <AddStep
          stepType={selectedStep}
          modalOpen={addStepModalOpen}
          setModalOpen={setAddStepModalOpen}
          reopenSelectStepModal={handleOpenModal}
        />
      )}
    </>
  );
};
