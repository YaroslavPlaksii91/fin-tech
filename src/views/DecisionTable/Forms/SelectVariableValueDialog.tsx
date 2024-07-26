import { useEffect } from 'react';
import { Button, Stack, InputAdornment, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { CATEGORIES, CATEGORY, OBJECT_DATA_TYPES } from '../constants';
import { SelectedCell, FormFieldsProps, OPERATORS, Operator } from '../types';
import { getOperatorOptions } from '../utils';

import validationSchema from './validationSchema';

import { palette } from '@theme';
import Dialog from '@components/shared/Modals/Dialog';
import LoadingButton from '@components/shared/LoadingButton';
import { InputText } from '@components/shared/Forms/InputText';
import { SingleSelect } from '@components/shared/Forms/SingleSelect';
import { DATA_TYPE_WITHOUT_ENUM } from '@domain/dataDictionary';

type SelectVariableValueDialogProps = {
  modalOpen: boolean;
  handleClose: () => void;
  selectedRowCell: SelectedCell;
  category: CATEGORY;
  handleSubmitForm: (data: SelectedCell & FormFieldsProps) => void;
};

const SelectVariableValueDialog = ({
  modalOpen,
  handleClose,
  selectedRowCell,
  category,
  handleSubmitForm
}: SelectVariableValueDialogProps) => {
  const bounds =
    selectedRowCell.operator === OPERATORS.BETWEEN
      ? selectedRowCell.expression.split('and')
      : [];

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      dataType: selectedRowCell.dataType as DATA_TYPE_WITHOUT_ENUM,
      name: selectedRowCell.name,
      operator: selectedRowCell.operator as Operator,
      value: selectedRowCell.expression,
      lowerBound: bounds.length > 0 ? +bounds[0] : undefined,
      upperBound: bounds.length > 0 ? +bounds[1] : undefined
    }
  });

  const isObjectDataType = OBJECT_DATA_TYPES.includes(
    selectedRowCell.dataType || ''
  );

  const operatorOptions = getOperatorOptions(selectedRowCell.dataType);

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

    handleSubmitForm({
      ...selectedRowCell,
      ...data,
      value
    });
  };

  useEffect(() => {
    if (category !== CATEGORIES.Conditions) setValue('operator', '=');
    if (isObjectDataType) setValue('value', 'null');
  }, []);

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
            name="name"
            control={control}
            InputProps={{
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
            variant="outlined"
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
                disabled: watchOperator === OPERATORS.ANY || isObjectDataType
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
