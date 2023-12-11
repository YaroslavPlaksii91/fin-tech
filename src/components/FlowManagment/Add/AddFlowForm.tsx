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

// TODO: mock request
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const AddFlow: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { handleSubmit, reset, control } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: ''
    }
  });

  const onSubmit: SubmitHandler<FormData> = async (data): Promise<void> => {
    try {
      await sleep(2000);
      Logger.info(data);
    } catch (error) {
      Logger.error(error);
    }
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
        <form onSubmit={() => void handleSubmit(onSubmit)}>
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
