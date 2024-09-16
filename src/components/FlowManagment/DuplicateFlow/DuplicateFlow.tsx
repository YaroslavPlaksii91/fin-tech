import { Button, Stack } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { unwrapResult } from '@reduxjs/toolkit';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { createDuplicateFlowData } from './createDuplicateFlowData';
import { validationSchema, FormData } from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import { IFlowListItem } from '@domain/flow';
import { flowService } from '@services/flow-service';
import {
  SnackbarErrorMessage,
  SnackbarMessage
} from '@components/shared/Snackbar/SnackbarMessage';
import { SNACK_TYPE } from '@constants/common';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { createFlow } from '@store/flowList/asyncThunk';
import { selectUserInfo } from '@store/auth/auth';
import { getFullUserName } from '@utils/helpers';
import InputText from '@components/shared/Forms/InputText';
import LoadingButton from '@components/shared/LoadingButton';

interface DuplicateFlowProps {
  flow: IFlowListItem;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

export const DuplicateFlow: React.FC<DuplicateFlowProps> = ({
  flow,
  modalOpen,
  setModalOpen
}) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm<FormData>({
    defaultValues: { name: flow.name },
    resolver: yupResolver(validationSchema)
  });

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUserInfo);

  const onSubmit = async ({ name }: FormData) => {
    const username = getFullUserName(user);
    try {
      const flowDetails = await flowService.getFlow(flow.id);
      const flowDuplicateData = createDuplicateFlowData(
        flowDetails,
        username,
        name
      );
      const resultAction = await dispatch(createFlow(flowDuplicateData));
      const createdFlow = unwrapResult(resultAction);
      enqueueSnackbar(
        <SnackbarMessage
          message="Success"
          details={`"${createdFlow.data.name}" was successfully duplicated.`}
        />,
        { variant: SNACK_TYPE.SUCCESS }
      );
    } catch (error) {
      enqueueSnackbar(<SnackbarErrorMessage message="Error" error={error} />, {
        variant: SNACK_TYPE.ERROR
      });
    } finally {
      handleCancel();
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <Dialog
      title="Duplicate flow?"
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
