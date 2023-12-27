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
import { addNewNode } from '@store/flow/flow';

type FormData = {
  name: string;
};

interface AddStepProps {
  edgeId: string;
  stepType: StepType;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

export const AddStep: React.FC<AddStepProps> = ({
  edgeId,
  stepType,
  modalOpen,
  setModalOpen
}) => {
  // const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: 'Champion Challenger'
    }
  });
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<FormData> = ({ name }) => {
    dispatch(addNewNode({ name, id: edgeId, type: stepType }));
    Logger.info('add new step redirect to new page', name, edgeId, stepType);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Dialog
      title="Name this Champion Challenger"
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
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseModal}
          >
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
