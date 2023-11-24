// TODO fix this error
/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import validationSchema from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import { InputText } from '@components/shared/Forms/InputText';

interface FormData {
  name: string;
}

export const AddFlow: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { handleSubmit, reset, control } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: ''
    }
  });

  const onSubmit: SubmitHandler<FormData> = () => {
    handleCloseModal();
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    reset();
  };

  return (
    <>
      <Button onClick={handleOpenModal} variant="contained">
        Add new flow
      </Button>
      <Dialog
        title="Add a new flow"
        open={modalOpen}
        displayConfirmBtn={false}
        displayedCancelBtn={false}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputText name="name" control={control} label="name" />
          <Box>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit">Confirm</Button>
          </Box>
        </form>
      </Dialog>
    </>
  );
};
