import { useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';

import { AddStep } from '../AddStep/AddStep';

import { StyledButtonText, StyledSelectionButton } from './styled';
import { options } from './options';

import Dialog from '@components/shared/Modals/Dialog';
import {
  AddIcon,
  ArrowForwardIcon,
  HexagonOutlinedIcon
} from '@components/shared/Icons';
import {
  FunctionalStepType,
  StepType
} from '@components/FlowManagment/FlowChart/types';
import { FlowNode } from '@domain/flow';

interface SelectStepProps {
  onAddNode?: (type: StepType, name: string) => FlowNode;
}

export const SelectStep: React.FC<SelectStepProps> = ({ onAddNode }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [addStepModalOpen, setAddStepModalOpen] = useState<boolean>(false);
  const [selectedStep, setSelectedStep] = useState<FunctionalStepType | null>();

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedStep(null);
    setModalOpen(false);
  };

  const openAddStepModalForm = (step: FunctionalStepType) => {
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
              disabled={option.disabled}
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
          onAddNode={onAddNode}
          stepType={selectedStep}
          setSelectedStep={setSelectedStep}
          modalOpen={addStepModalOpen}
          setModalOpen={setAddStepModalOpen}
          reopenSelectStepModal={handleOpenModal}
        />
      )}
    </>
  );
};
