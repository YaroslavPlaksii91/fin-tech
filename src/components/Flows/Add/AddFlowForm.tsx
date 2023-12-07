// TODO fix this error
/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from 'react';
import { Button, Stack } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import validationSchema from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import { InputText } from '@components/shared/Forms/InputText';
import { AddIcon } from '@components/shared/Icons';
import Logger from '@utils/logger';

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

  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
    Logger.info('data', data);
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
      <Button
        onClick={handleOpenModal}
        fullWidth
        color="primary"
        variant="contained"
        endIcon={<AddIcon />}
      >
        Add new flow
      </Button>
      <Dialog
        title="Add a new flow"
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
            <Button variant="contained" color="primary" type="submit">
              Confirm
            </Button>
          </Stack>
        </form>
      </Dialog>
    </>
  );
};
