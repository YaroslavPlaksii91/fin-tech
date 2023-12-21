import { useEffect } from 'react';
import { Button, Stack } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { validationSchema } from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import { InputText } from '@components/shared/Forms/InputText';
import Logger from '@utils/logger';
import { IFlowListItem } from '@domain/flow';
import { useAppDispatch } from '@store/hooks';
import { renameFlow } from '@store/flowList/flowList';

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
  const { handleSubmit, control, setValue } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: { name: flow.name }
  });
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<FormData> = async ({ name }): Promise<void> => {
    try {
      await dispatch(
        renameFlow({
          id: flow.id,
          operations: [
            {
              value: name,
              path: 'data/name',
              op: 'replace'
            }
          ]
        })
      );
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
  );
};
