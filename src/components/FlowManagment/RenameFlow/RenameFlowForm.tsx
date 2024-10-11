import { useEffect } from 'react';
import { Button, Stack } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { updateFlowDataHelper, validationSchema } from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import InputText from '@components/shared/Forms/InputText';
import Logger from '@utils/logger';
import { IFlow, IFlowListItem } from '@domain/flow';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { renameFlow } from '@store/flowList/asyncThunk';
import LoadingButton from '@components/shared/LoadingButton';
import { updateFlowData } from '@store/flow';
import { selectUserInfo } from '@store/auth';
import { getFullUserName } from '@utils/helpers';

type FormData = {
  name: string;
};

interface RenameFlowProps {
  flow: IFlowListItem;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

export const RenameFlow: React.FC<RenameFlowProps> = ({
  flow,
  modalOpen,
  setModalOpen
}) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: { name: flow.name }
  });
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUserInfo);

  const onSubmit: SubmitHandler<FormData> = async ({ name }): Promise<void> => {
    const username = getFullUserName(user);
    const reqData = updateFlowDataHelper(flow.id, name, username);
    try {
      const { payload } = await dispatch(renameFlow(reqData));
      const updatedFlow = payload as IFlow;
      dispatch(updateFlowData(updatedFlow.data));
      handleCloseModal();
    } catch (error) {
      Logger.error(error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    setValue('name', flow.name);
  }, [flow.name]);

  return (
    <Dialog
      title="Rename flow"
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
            Confirm
          </LoadingButton>
          <Button variant="text" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Stack>
      </form>
    </Dialog>
  );
};
