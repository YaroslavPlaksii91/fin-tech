//import { useEffect } from 'react';
import { Button, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
//import { yupResolver } from '@hookform/resolvers/yup';

// import { validationSchema } from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import LoadingButton from '@components/shared/LoadingButton';
import { InputText } from '@components/shared/Forms/InputText';

// type FieldsProps = {
//   variableName: string;
//   defaultValue: string;
//   description: string;
// };

type VariableFormProps = {
  title: string;
  modalOpen: boolean;
  //handleSubmitVariableFormData: (data: FieldsProps) => void;
  handleClose: () => void;
};

export const VariableForm: React.FC<VariableFormProps> = ({
  title,
  modalOpen,
  handleClose
}) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm({
    // resolver: yupResolver(validationSchema),
    defaultValues: {
      variableName: '',
      defaultValue: '',
      description: ''
    }
  });

  const onSubmit = () => {};

  // useEffect(() => {
  //   setValue('note', note);
  // }, [modalOpen, note]);

  return (
    <Dialog
      title={title}
      open={modalOpen}
      maxWidth="xs"
      displayConfirmBtn={false}
      displayedCancelBtn={false}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <InputText
            fullWidth
            name="variableName"
            label="Variable Name"
            control={control}
            placeholder="Enter variable name"
          />
          <InputText
            fullWidth
            name="defaultValue"
            label="Default Value"
            control={control}
            placeholder="Enter default value"
          />
          <InputText
            fullWidth
            name="description"
            label="Description"
            control={control}
            placeholder="Enter description"
          />
        </Stack>

        <Stack mt={3} spacing={1} direction="row" justifyContent="flex-end">
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            loading={isSubmitting}
            disabled={isSubmitting}
            variant="contained"
            color="primary"
            type="submit"
          >
            Save Changes
          </LoadingButton>
        </Stack>
      </form>
    </Dialog>
  );
};
