import { useEffect } from 'react';
import { Button, Stack, InputAdornment, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { palette } from '../../../themeConfig';
import { OPERATORS, CATEGORIES } from '../constants';
import { VariableValueDataProps } from '../types';
import { getOperatorOptions } from '../utils';

import validationSchema from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import LoadingButton from '@components/shared/LoadingButton';
import { InputText } from '@components/shared/Forms/InputText';
import { SingleSelect } from '@components/shared/Forms/SingleSelect';

type SelectVariableValueDialogProps = {
  modalOpen: boolean;
  handleClose: () => void;
  selectedRowData: VariableValueDataProps;
  category: string;
  handleSubmitVariableValue: (data: VariableValueDataProps) => void;
};

const SelectVariableValueDialog = ({
  modalOpen,
  handleClose,
  selectedRowData,
  category,
  handleSubmitVariableValue
}: SelectVariableValueDialogProps) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const operatorOptions = getOperatorOptions(selectedRowData.variableType);

  const watchOperator = watch('operator');

  useEffect(() => {
    if (selectedRowData) {
      reset(selectedRowData);
    }
  }, []);

  useEffect(() => {
    if (category !== CATEGORIES.Conditions) {
      setValue('operator', '=');
    }
  }, []);

  const onSubmit = (data: VariableValueDataProps) => {
    handleSubmitVariableValue(data);
  };

  return (
    <Dialog
      title={
        category !== CATEGORIES.Conditions ? 'Enter output' : 'Enter condition'
      }
      open={modalOpen}
      displayConfirmBtn={false}
      displayedCancelBtn={false}
      fullWidth={true}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          mt={3}
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2, md: 2 }}
        >
          <InputText
            fullWidth
            name="variableName"
            control={control}
            inputProps={{
              startAdornment: category === CATEGORIES.Conditions && (
                <InputAdornment
                  position="start"
                  sx={{
                    justifyContent: 'center',
                    backgroundColor: palette.secondary,
                    color: palette.gray,
                    height: '100%',
                    maxHeight: '100%',
                    width: '40px',
                    borderRadius: '10px 0 0 10px'
                  }}
                >
                  If
                </InputAdornment>
              ),
              disabled: true
            }}
            sx={{ '& .MuiOutlinedInput-root': { paddingLeft: '0' } }}
          />
          <SingleSelect
            name="operator"
            control={control}
            displayEmpty
            fullWidth
            disabled={category !== CATEGORIES.Conditions}
            sx={{
              width: '280px',
              minWidth: '110px',
              '& .MuiInputBase-root ': {
                height: '40px'
              }
            }}
          >
            {operatorOptions.map((option: Record<string, string>) => (
              <MenuItem key={option.key} value={option.value}>
                {option.value}
              </MenuItem>
            ))}
          </SingleSelect>
          {watchOperator === OPERATORS.Between ? (
            <>
              <InputText
                fullWidth
                name="lowestValue"
                control={control}
                placeholder="Enter lower bound"
              />
              <InputText
                fullWidth
                name="highestValue"
                control={control}
                placeholder="Enter upper bound"
              />
            </>
          ) : (
            <InputText
              fullWidth
              name="value"
              control={control}
              placeholder="Enter value"
              inputProps={{ disabled: watchOperator === OPERATORS.Any }}
            />
          )}
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
