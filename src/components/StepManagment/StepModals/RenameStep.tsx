import { useEffect } from 'react';
import { Button, Stack } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import { useDispatch } from 'react-redux/es/hooks/useDispatch';

import { validationSchema, FormData } from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import { InputText } from '@components/shared/Forms/InputText';
import LoadingButton from '@components/shared/LoadingButton';
// import { FunctionalStepType } from '@components/FlowManagment/FlowChart/types';
// import { FlowNode } from '@domain/flow';
// import { addNode } from '@store/flow/flow';

interface RenameStepProps {
  initialName: string;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  handleRenameStep: (name: string) => void;
}

export const RenameStep: React.FC<RenameStepProps> = ({
  initialName,
  modalOpen,
  setModalOpen,
  handleRenameStep
}) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit: SubmitHandler<FormData> = ({ name }) => {
    handleRenameStep(name);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCancel = () => {
    handleCloseModal();
  };

  useEffect(() => {
    setValue('name', initialName);
  }, [initialName]);

  return (
    <Dialog
      title="Rename Step"
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
