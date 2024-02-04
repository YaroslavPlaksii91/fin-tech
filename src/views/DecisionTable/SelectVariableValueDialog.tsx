import { useEffect } from 'react';
import { Button, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';

import Dialog from '@components/shared/Modals/Dialog';
import LoadingButton from '@components/shared/LoadingButton';
import { InputText } from '@components/shared/Forms/InputText';

const SelectVariableValueDialog = ({
  modalOpen,
  handleClose,
  selectedRowData
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting }
  } = useForm();

  const onSubmit = () => {
    // console.log('onSubmit_data', data);
    // handleSubmitVariableValue();
  };

  useEffect(() => {
    // console.log('SelectVariableValueDialog_ selectedRowData', selectedRowData);

    if (selectedRowData) {
      reset(selectedRowData);
    }
  }, []);

  return (
    <Dialog
      title="Enter condition"
      open={modalOpen}
      displayConfirmBtn={false}
      displayedCancelBtn={false}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack mt={3} spacing={1} direction="row">
          <InputText name="variableName" control={control} />
          <InputText name="variableValue" control={control} />
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
            Confirm
          </LoadingButton>
        </Stack>
      </form>
    </Dialog>
  );
};

export default SelectVariableValueDialog;
