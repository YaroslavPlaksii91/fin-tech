import { Button, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { validationSchema } from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import LoadingButton from '@components/shared/LoadingButton';
import { Textarea } from '@components/shared/Forms/Textarea';

interface NoteFormProps {
  note: string;
  modalOpen: boolean;
  handleSubmitNote: (note: string) => void;
  handleClose: () => void;
}

export const NoteForm: React.FC<NoteFormProps> = ({
  note,
  modalOpen,
  handleSubmitNote,
  handleClose
}) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm({
    resolver: yupResolver(validationSchema),
    values: { note }
  });

  const onSubmit = ({ note }: { note?: string }) => {
    const parsedNote = note ?? '';
    handleSubmitNote(parsedNote);
  };

  return (
    <Dialog
      title="Note for this step"
      open={modalOpen}
      displayConfirmBtn={false}
      displayedCancelBtn={false}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Textarea
          fullWidth
          name="note"
          control={control}
          label="Note"
          placeholder="Enter note"
        />
        <Stack mt={3} spacing={1} direction="row" justifyContent="flex-end">
          <LoadingButton
            loading={isSubmitting}
            disabled={isSubmitting}
            variant="text"
            color="primary"
            type="submit"
          >
            Confirm
          </LoadingButton>
          <Button variant="text" onClick={handleClose}>
            Cancel
          </Button>
        </Stack>
      </form>
    </Dialog>
  );
};
