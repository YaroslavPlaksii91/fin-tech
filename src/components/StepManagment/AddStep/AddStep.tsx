import { Button, Stack } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { validationSchema } from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import { InputText } from '@components/shared/Forms/InputText';
import Logger from '@utils/logger';
import LoadingButton from '@components/shared/LoadingButton';

type FormData = {
  name: string;
};

interface AddStepProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

export const AddStep: React.FC<AddStepProps> = ({
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

  const onSubmit: SubmitHandler<FormData> = ({ name }) => {
    Logger.info('add new step redirect to new page', name);
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
      <form onSubmit={void handleSubmit(onSubmit)}>
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
