import { useEffect } from 'react';
import { Button, Stack, InputAdornment, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { CATEGORIES } from '../constants';
import { SelectedCell, FormFieldsProps, OPERATORS, Operator } from '../types';
import {
  checkDataType,
  convertToStringFormat,
  getOperatorOptions
} from '../utils';

import validationSchema from './validationSchema';

import { palette } from '@theme';
import Dialog from '@components/shared/Modals/Dialog';
import LoadingButton from '@components/shared/LoadingButton';
import { InputText } from '@components/shared/Forms/InputText';
import { SingleSelect } from '@components/shared/Forms/SingleSelect';

type SelectVariableValueDialogProps = {
  modalOpen: boolean;
  handleClose: () => void;
  selectedCell: SelectedCell;
  handleSubmitForm: (data: SelectedCell & FormFieldsProps) => void;
};

const SelectVariableValueDialog = ({
  modalOpen,
  handleClose,
  selectedCell,
  handleSubmitForm
}: SelectVariableValueDialogProps) => {
  const bounds =
    selectedCell.operator === OPERATORS.BETWEEN
      ? selectedCell.expression.split('and')
      : [];

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    watch,
    setValue,
    clearErrors
  } = useForm({
    resolver:
      selectedCell.category === CATEGORIES.Conditions
        ? yupResolver(validationSchema)
        : undefined,
    defaultValues: {
      dataType: selectedCell.dataType,
      name: selectedCell.name,
      operator:
        selectedCell.category !== CATEGORIES.Conditions
          ? OPERATORS.EQUAL
          : (selectedCell.operator as Operator),
      value: selectedCell.expression,
      lowerBound: bounds.length > 0 ? +bounds[0] : undefined,
      upperBound: bounds.length > 0 ? +bounds[1] : undefined
    }
  });

  const dataType = checkDataType(selectedCell.dataType);
  const operatorOptions = getOperatorOptions(selectedCell.dataType);

  const watchOperator = watch('operator');

  const onSubmit = (data: FormFieldsProps) => {
    let value;

    switch (data.operator) {
      case OPERATORS.BETWEEN:
        value = `${data.lowerBound} and ${data.upperBound}`;
        break;
      case OPERATORS.ANY:
        value = '';
        break;
      default:
        value = data.value;
    }

    if (dataType.isString) value = convertToStringFormat(data.value || '');

    handleSubmitForm({
      ...selectedCell,
      ...data,
      value
    });
  };

  useEffect(() => {
    clearErrors();
  }, [watchOperator]);

  useEffect(() => {
    if (watchOperator === OPERATORS.ANY) {
      setValue('value', '');
      return;
    }

    if (dataType.isObject) setValue('value', 'null');
  }, [dataType.isObject, watchOperator]);

  return (
    <Dialog
      title={
        selectedCell.category !== CATEGORIES.Conditions
          ? 'Enter output'
          : 'Enter condition'
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
            name="name"
            control={control}
            InputProps={{
              startAdornment: selectedCell.category ===
                CATEGORIES.Conditions && (
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
            variant="outlined"
            name="operator"
            control={control}
            displayEmpty
            fullWidth
            disabled={selectedCell.category !== CATEGORIES.Conditions}
            sx={{
              width: '280px',
              minWidth: '110px',
              '& .MuiInputBase-root ': {
                height: '40px'
              }
            }}
          >
            {operatorOptions.map((option) => (
              <MenuItem key={option.key} value={option.value}>
                {option.value}
              </MenuItem>
            ))}
          </SingleSelect>
          {watchOperator === OPERATORS.BETWEEN ? (
            <>
              <InputText
                fullWidth
                name="lowerBound"
                control={control}
                placeholder="Lowest Value*"
              />
              <InputText
                fullWidth
                name="upperBound"
                control={control}
                placeholder="Highest Value*"
              />
            </>
          ) : (
            <InputText
              fullWidth
              name="value"
              control={control}
              placeholder="Value*"
              InputProps={{
                disabled: watchOperator === OPERATORS.ANY || dataType.isObject
              }}
            />
          )}
        </Stack>

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

export default SelectVariableValueDialog;
