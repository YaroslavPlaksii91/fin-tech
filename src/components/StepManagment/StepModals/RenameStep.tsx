import { useEffect } from 'react';
import { Button, Stack } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { confirmable, createConfirmation } from 'react-confirm';
import { ThemeProvider } from '@emotion/react';

import { validationSchema, FormData } from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import { InputText } from '@components/shared/Forms/InputText';
import LoadingButton from '@components/shared/LoadingButton';
import { theme } from '@theme';

interface RenameConfirmDialogProps {
  show?: boolean;
  proceed?: (newName: string | null) => void;
  initialName: string;
}

export const RenameStep: React.FC<RenameConfirmDialogProps> = ({
  show,
  proceed,
  initialName
}) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema)
  });

  useEffect(() => {
    setValue('name', initialName);
  }, [initialName, setValue]);

  const onSubmit: SubmitHandler<FormData> = ({ name }) => {
    proceed && proceed(name);
  };

  const handleCancel = () => {
    proceed && proceed(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        title="Rename Step"
        open={Boolean(show)}
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
    </ThemeProvider>
  );
};

export const renameConfirmDialog = createConfirmation<
  RenameConfirmDialogProps,
  string | null
>(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  confirmable(RenameStep)
);
