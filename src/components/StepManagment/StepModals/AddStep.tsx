import { useEffect } from 'react';
import { Button, Stack } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux/es/hooks/useDispatch';
import { cloneDeep } from 'lodash';

import { validationSchema, FormData } from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import InputText from '@components/shared/Forms/InputText';
import LoadingButton from '@components/shared/LoadingButton';
import {
  FunctionalStepType,
  StepType
} from '@components/FlowManagment/FlowChart/types';
import { FlowNode } from '@domain/flow';
import { addNode } from '@store/flow/flow';

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
  edgeId: string;
  onAddNodeBetweenEdges: (
    type: FunctionalStepType,
    name: string,
    edgeId: string
  ) => { newNode: FlowNode; subFlowId: string };
}

export const AddStep: React.FC<AddStepProps> = ({
  stepType,
  setSelectedStep,
  modalOpen,
  setModalOpen,
  onAddNodeBetweenEdges,
  edgeId
}) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema)
  });
  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<FormData> = ({ name }) => {
    const { newNode, subFlowId } = onAddNodeBetweenEdges(
      stepType,
      name,
      edgeId
    );

    if (newNode) {
      // For update list of steps in the sidebar
      dispatch(addNode({ node: cloneDeep(newNode), subFlowId }));
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStep(null);
  };

  const handleCancel = () => {
    handleCloseModal();
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
