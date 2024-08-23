import { useEffect } from 'react';
import {
  Button,
  Stack,
  InputAdornment,
  MenuItem,
  Typography
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { BOOLEAN_OPTIONS } from '../constants';
import { SelectedCell, FormFieldsProps, OPERATORS } from '../types';
import {
  checkDataType,
  addExtraDoubleQuotes,
  getOperatorOptions,
  getFormatedOptions
} from '../utils';

import validationSchema from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import LoadingButton from '@components/shared/LoadingButton';
import { InputText } from '@components/shared/Forms/InputText';
import { SingleSelect } from '@components/shared/Forms/SingleSelect';
import { preventIdleTimeout } from '@utils/preventIdleTimeout';

type SelectVariableValueDialogProps = {
  modalOpen: boolean;
  isCondition: boolean;
  selectedCell: SelectedCell;
  handleClose: () => void;
  handleSubmitForm: (data: FormFieldsProps) => void;
};

const SelectVariableValueDialog = ({
  modalOpen,
  isCondition,
  selectedCell,
  handleClose,
  handleSubmitForm
}: SelectVariableValueDialogProps) => {
  const bounds =
    selectedCell.operator === OPERATORS.BETWEEN
      ? selectedCell.expression.split('and')
      : [];

  const dataType = checkDataType(selectedCell.dataType);
  const operatorOptions = getOperatorOptions(selectedCell.dataType);
  const valueSelectOptions = getFormatedOptions(
    dataType.isBoolean ? BOOLEAN_OPTIONS : selectedCell.allowedValues || []
  );

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    watch,
    setValue,
    clearErrors
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      dataType: selectedCell.dataType,
      name: selectedCell.name,
      operator: selectedCell.operator || OPERATORS.EQUAL,
      value: selectedCell.expression,
      lowerBound: bounds.length > 0 ? +bounds[0] : undefined,
      upperBound: bounds.length > 0 ? +bounds[1] : undefined
    }
  });

  const watchOperator = watch('operator');

  const onSubmit = async (data: FormFieldsProps) => {
    let value;

    await preventIdleTimeout();

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

    if (dataType.isString) value = addExtraDoubleQuotes(data.value || '');

    handleSubmitForm({ ...data, value });
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
  }, [watchOperator, dataType.isObject]);

  return (
    <Dialog
      title={isCondition ? 'Enter condition' : 'Enter output'}
      open={modalOpen}
      displayConfirmBtn={false}
      displayedCancelBtn={false}
      fullWidth={true}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2, md: 2 }}
        >
          <InputText
            fullWidth
            disabled
            label="Variable*"
            name="name"
            control={control}
            InputProps={{
              startAdornment: isCondition && (
                <InputAdornment position="start">
                  <Typography variant="body1" sx={{ padding: '0 8x 0 0' }}>
                    IF
                  </Typography>
                </InputAdornment>
              )
            }}
          />
          <SingleSelect
            name="operator"
            control={control}
            disabled={!isCondition}
            sx={{
              width: '280px',
              minWidth: '140px'
            }}
            label="Operator*"
          >
            {operatorOptions.map((option) => (
              <MenuItem key={option.key} value={option.value}>
                {option.value}
              </MenuItem>
            ))}
          </SingleSelect>
          {dataType.isWithEnum || dataType.isBoolean ? (
            <SingleSelect
              name="value"
              control={control}
              fullWidth
              label="Value*"
              disabled={watchOperator === OPERATORS.ANY}
            >
              {valueSelectOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </SingleSelect>
          ) : watchOperator === OPERATORS.BETWEEN ? (
            <>
              <InputText
                fullWidth
                name="lowerBound"
                control={control}
                label="Lowest Value*"
              />
              <InputText
                fullWidth
                name="upperBound"
                control={control}
                label="Highest Value*"
              />
            </>
          ) : (
            <InputText
              fullWidth
              name="value"
              control={control}
              label="Value*"
              disabled={watchOperator === OPERATORS.ANY || dataType.isObject}
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
