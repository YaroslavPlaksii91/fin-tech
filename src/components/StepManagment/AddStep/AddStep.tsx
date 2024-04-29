import { useEffect } from 'react';
import { Button, Stack } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux/es/hooks/useDispatch';
import { cloneDeep } from 'lodash';

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
import { addNode } from '@store/flow/flow';

type FormData = {
  name: string;
};

const defaultValue = {
  [StepType.CHAMPION_CHALLENGER]: 'Champion Challenger',
  [StepType.CALCULATION]: 'Calculation',
  [StepType.DECISION_TABLE]: 'Decision table',
  [StepType.SUBFLOW]: 'Subflow'
};

interface AddStepProps {
  stepType: FunctionalStepType;
  setSelectedStep: (value: FunctionalStepType | null) => void;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  onAddNodeBetweenEdges?: (
    type: FunctionalStepType,
    name: string,
    edgeId: string
  ) => FlowNode;
  edgeId?: string;
  reopenSelectStepModal?: () => void;
}

export const AddStep: React.FC<AddStepProps> = ({
  edgeId,
  stepType,
  setSelectedStep,
  modalOpen,
  setModalOpen,
  reopenSelectStepModal,
  onAddNodeBetweenEdges
}) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema)
  });
  const { setActiveStepId } = useStep();
  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<FormData> = ({ name }) => {
    let createdStep;
    if (edgeId) {
      createdStep = onAddNodeBetweenEdges?.(stepType, name, edgeId);
    }
    if (createdStep) {
      setActiveStepId(createdStep.id);

      // For update list of steps in the sidebar
      dispatch(addNode(cloneDeep(createdStep)));
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStep(null);
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
          <LoadingButton
            loading={isSubmitting}
            disabled={isSubmitting}
            variant="text"
            type="submit"
          >
            Confirm
          </LoadingButton>
          <Button variant="text" onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      </form>
    </Dialog>
  );
};
