import { useState } from 'react';
import { Button, Stack } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import {
  validationSchema,
  createInitialFlowDataHelper
} from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import { InputText } from '@components/shared/Forms/InputText';
import AddIcon from '@icons/plusSquare.svg';
import Logger from '@utils/logger';
import routes from '@constants/routes';
import LoadingButton from '@components/shared/LoadingButton';
import { useAppDispatch } from '@store/hooks';
import { createFlow } from '@store/flowList/asyncThunk';
import { SnackbarMessage } from '@components/shared/Snackbar/SnackbarMessage';
import { SNACK_TYPE } from '@constants/common';
import { IFlow } from '@domain/flow';

interface FormData {
  name: string;
}

export const AddFlow: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
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
      const { payload } = await dispatch(createFlow(data));
      handleCloseModal();
      const createdFlow = payload as IFlow;
      navigate(`${routes.underwriting.flow.list}/${createdFlow.id}`);
      enqueueSnackbar(
        <SnackbarMessage
          message="Success"
          details={`New "${createdFlow.data.name}" was successfully created.`}
        />,
        { variant: SNACK_TYPE.SUCCESS }
      );
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
        sx={{ marginLeft: '14px' }}
        variant="text"
        startIcon={<AddIcon />}
      >
        Create New Flow
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
