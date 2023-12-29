import { useEffect } from 'react';
import { Button, Stack } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { validationSchema } from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import { InputText } from '@components/shared/Forms/InputText';
import Logger from '@utils/logger';
import LoadingButton from '@components/shared/LoadingButton';
import { StepType } from '@components/FlowManagment/FlowChart/types';
import { useAppDispatch } from '@store/hooks';
import { addNewNodeWithEdges, addNewNode } from '@store/flow/flow';

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
  edgeId?: string;
  reopenSelectStepModal?: () => void;
}

export const AddStep: React.FC<AddStepProps> = ({
  edgeId,
  stepType,
  modalOpen,
  setModalOpen,
  reopenSelectStepModal
}) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema)
  });
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<FormData> = ({ name }) => {
    if (edgeId) {
      dispatch(addNewNodeWithEdges({ name, id: edgeId, type: stepType }));
    } else {
      dispatch(addNewNode({ name, type: stepType }));
    }
    handleCloseModal();
    Logger.info('add new step redirect to new page', name, edgeId, stepType);
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
