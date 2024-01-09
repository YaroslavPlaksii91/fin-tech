import { useEffect } from 'react';
import { Button, Stack } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { validationSchema } from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import { InputText } from '@components/shared/Forms/InputText';
import LoadingButton from '@components/shared/LoadingButton';
import { StepType } from '@components/FlowManagment/FlowChart/types';
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
  stepType: Exclude<StepType, StepType.START | StepType.END>;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  onAdd?: (type: StepType, name: string) => FlowNode;
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
  onAdd
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
    if (edgeId) {
      const step = onAddNodeBetweenEdges?.(stepType, name, edgeId);
      setStep(step);
    } else {
      const step = onAdd?.(stepType, name);
      setStep(step);
    }
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
