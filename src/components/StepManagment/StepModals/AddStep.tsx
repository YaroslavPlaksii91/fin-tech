import { Button, Stack } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as _ from 'lodash-es';
import { XYPosition } from 'reactflow';

import { validationSchema, FormData } from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import InputText from '@components/shared/Forms/InputText';
import LoadingButton from '@components/shared/Buttons/Loading';
import {
  FunctionalStepType,
  StepType
} from '@components/FlowManagment/FlowChart/types';
import { FlowNode } from '@domain/flow';
import { addNode } from '@store/flow/';
import { useAppDispatch } from '@store/hooks';

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
  nodePosition: XYPosition;
  onAddNodeBetweenEdges: (
    type: FunctionalStepType,
    name: string,
    edgeId: string,
    nodePosition: XYPosition
  ) => { newNode: FlowNode; subFlowId: string };
}

export const AddStep: React.FC<AddStepProps> = ({
  stepType,
  setSelectedStep,
  modalOpen,
  setModalOpen,
  onAddNodeBetweenEdges,
  edgeId,
  nodePosition
}) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema)
  });
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<FormData> = ({ name }) => {
    const { newNode, subFlowId } = onAddNodeBetweenEdges(
      stepType,
      name,
      edgeId,
      nodePosition
    );

    if (newNode) {
      // For update list of steps in the sidebar
      dispatch(addNode({ node: _.cloneDeep(newNode), subFlowId }));
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
          label="Step Name*"
          placeholder="Step Name*"
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
