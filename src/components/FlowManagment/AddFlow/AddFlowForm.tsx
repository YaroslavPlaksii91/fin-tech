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
      // navigate(routes.underwriting.flow.details(res.id));
      navigate(`${routes.underwriting.flow.list}/${res.id}`);
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
        title="Create New Flow"
        open={modalOpen}
        displayConfirmBtn={false}
        displayedCancelBtn={false}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputText
            fullWidth
            name="name"
            control={control}
            label="Flow name*"
            placeholder="Flow Name*"
          />
          <Stack mt={3} spacing={1} direction="row" justifyContent="flex-end">
            <LoadingButton
              loading={isSubmitting}
              disabled={isSubmitting}
              variant="text"
              type="submit"
            >
              Create
            </LoadingButton>
            <Button variant="text" onClick={handleCloseModal}>
              Cancel
            </Button>
          </Stack>
        </form>
      </Dialog>
    </>
  );
};
