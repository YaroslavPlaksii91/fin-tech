import { useEffect } from 'react';
import { Button, Stack } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { validationSchema } from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import { InputText } from '@components/shared/Forms/InputText';
import LoadingButton from '@components/shared/LoadingButton';
import {
  FunctionalStepType,
  StepType
} from '@components/FlowManagment/FlowChart/types';
import { useStep } from '@contexts/StepContext';
import { FlowNode } from '@domain/flow';

type FormData = {
  name: string;
};

const defaultValue = {
  [StepType.CHAMPION_CHALLENGER]: 'Champion Challenger',
  [StepType.CALCULATION]: 'Calculation',
  [StepType.DECISION_MATRIX]: 'Decision matrix',
  [StepType.CONDITION]: 'Condition',
  [StepType.CASE]: 'Case',
  [StepType.SUBFLOW]: 'Subflow'
};

interface AddStepProps {
  stepType: FunctionalStepType;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  onAddNode?: (type: StepType, name: string) => FlowNode;
  onAddNodeBetweenEdges?: (
    type: StepType,
    name: string,
    edgeId: string
  ) => FlowNode;
  edgeId?: string;
  reopenSelectStepModal?: () => void;
}

export const AddStep: React.FC<AddStepProps> = ({
  edgeId,
  stepType,
  modalOpen,
  setModalOpen,
  reopenSelectStepModal,
  onAddNodeBetweenEdges,
  onAddNode
}) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema)
  });
  const { setStep } = useStep();

  const onSubmit: SubmitHandler<FormData> = ({ name }) => {
    let createdStep;
    if (edgeId) {
      createdStep = onAddNodeBetweenEdges?.(stepType, name, edgeId);
    } else {
      createdStep = onAddNode?.(stepType, name);
    }
    createdStep && setStep(createdStep);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCancel = () => {
    handleCloseModal();
    reopenSelectStepModal?.();
  };

  useEffect(() => {
    setValue('name', defaultValue[stepType]);
  }, [stepType]);

  return (
    <Dialog
      title={`Name this ${defaultValue[stepType]}`}
      open={modalOpen}
      displayConfirmBtn={false}
      displayedCancelBtn={false}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputText
          fullWidth
          name="name"
          control={control}
          label="Name"
          placeholder="Enter name"
        />
        <Stack mt={3} spacing={1} direction="row" justifyContent="flex-end">
          <Button variant="contained" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <LoadingButton
            loading={isSubmitting}
            disabled={isSubmitting}
            variant="contained"
            color="primary"
            type="submit"
          >
            Confirm
          </LoadingButton>
        </Stack>
      </form>
    </Dialog>
  );
};
