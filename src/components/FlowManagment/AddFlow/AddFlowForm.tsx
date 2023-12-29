import { useState } from 'react';
import { Button, Stack } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';

import {
  validationSchema,
  createInitialFlowDataHelper
} from './validationSchema';

import { flowService } from '@services/flow-service';
import Dialog from '@components/shared/Modals/Dialog';
import { InputText } from '@components/shared/Forms/InputText';
import { AddIcon } from '@components/shared/Icons';
import Logger from '@utils/logger';
import routes from '@constants/routes';
import LoadingButton from '@components/shared/LoadingButton';

interface FormData {
  name: string;
}

export const AddFlow: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: ''
    }
  });

  const onSubmit: SubmitHandler<FormData> = async ({ name }): Promise<void> => {
    try {
      const data = createInitialFlowDataHelper(name);
      const res = await flowService.createFlow(data);
      handleCloseModal();
      navigate(`${routes.underwriting.flowList}/${res.id}/details`);
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
    </>
  );
};
