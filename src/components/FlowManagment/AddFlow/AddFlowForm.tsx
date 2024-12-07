import { useState } from 'react';
import { Button, Stack } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { unwrapResult } from '@reduxjs/toolkit';

import {
  validationSchema,
  createInitialFlowDataHelper
} from './validationSchema';
import { StyledButton, StyledDiv } from './styled';

import Dialog from '@components/shared/Dialog';
import InputText from '@components/shared/Forms/InputText';
import Logger from '@utils/logger';
import routes from '@constants/routes';
import LoadingButton from '@components/shared/Buttons/Loading';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { createFlow } from '@store/flowList/asyncThunk';
import Message from '@components/shared/Snackbar/Message';
import { SNACK_TYPE } from '@constants/common';
import { permissionsMap } from '@constants/permissions';
import { useHasUserPermission } from '@hooks/useHasUserPermission';
import { selectUserInfo } from '@store/auth';
import { getFullUserName } from '@utils/helpers';
import NewFlowIcon from '@icons/new-flow.svg';

interface FormData {
  name: string;
}

export const AddFlow: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUserInfo);
  const canUserCreateFlow = useHasUserPermission(permissionsMap.canCreateFlow);
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
      const username = getFullUserName(user);
      const data = createInitialFlowDataHelper(name, username);
      const resultAction = await dispatch(createFlow(data));

      handleCloseModal();
      const createdFlow = unwrapResult(resultAction);
      navigate(`${routes.underwriting.flow.list(createdFlow.id)}`);
      enqueueSnackbar(
        <Message
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
      {canUserCreateFlow && (
        <StyledDiv>
          <StyledButton
            onClick={handleOpenModal}
            sx={{ marginLeft: '14px' }}
            variant="text"
            startIcon={<NewFlowIcon width={25} />}
          >
            Create New Flow
          </StyledButton>
        </StyledDiv>
      )}
      {modalOpen && (
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
      )}
    </>
  );
};
