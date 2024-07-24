import { useEffect } from 'react';
import { Button, Stack, InputAdornment, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  OPERATORS,
  CATEGORIES,
  CATEGORIES_TYPE,
  OBJECT_DATA_TYPES
} from '../constants';
import { SelectedCell, FormFieldsProps } from '../types';
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
  category: CATEGORIES_TYPE;
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
    selectedRowCell.operator === OPERATORS.Between
      ? selectedRowCell.expression.split(' ')
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
      name: selectedRowCell.name,
      operator: selectedRowCell.operator,
      value: selectedRowCell.expression,
      lowerBound: bounds.length > 0 ? +bounds[0] : undefined,
      upperBound: bounds.length > 0 ? +bounds[1] : undefined
    }
  });

  const isObjectDataType = OBJECT_DATA_TYPES.includes(selectedRowCell.dataType);

  const operatorOptions = getOperatorOptions(
    (selectedRowCell.dataType as DATA_TYPE_WITHOUT_ENUM) ?? ''
  );

  const watchOperator = watch('operator');

  useEffect(() => {
    if (category !== CATEGORIES.Conditions) setValue('operator', '=');
    if (isObjectDataType) setValue('value', 'null');
  }, []);

  const onSubmit = (data: FormFieldsProps) => {
    handleSubmitForm({
      ...selectedRowCell,
      ...data
    });
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
                disabled: watchOperator === OPERATORS.Any || isObjectDataType
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
