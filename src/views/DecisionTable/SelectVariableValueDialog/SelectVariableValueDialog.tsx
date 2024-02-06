import { useEffect, useState } from 'react';
import { Button, Stack, InputAdornment, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';

import { palette } from '../../../themeConfig';
import { VARIABLE_TYPE, OPERATORS } from '../constants';

import Dialog from '@components/shared/Modals/Dialog';
import LoadingButton from '@components/shared/LoadingButton';
import { InputText } from '@components/shared/Forms/InputText';
import { SingleSelect } from '@components/shared/Forms/SingleSelect';

const SelectVariableValueDialog = ({
  modalOpen,
  handleClose,
  selectedRowData,
  handleSubmitVariableValue
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
    watch
  } = useForm({});
  const [operatorOptions, setOperatorOptions] = useState([]);
  const watchOperator = watch('operator');

  const getOperatorOptions = (variableType) => {
    let operators;
    if (variableType === VARIABLE_TYPE.String) {
      operators = [
        {
          key: 'in',
          value: 'in'
        },
        { key: 'equal', value: '=' },
        { key: 'any', value: 'any' }
      ];
    }
    if (variableType === VARIABLE_TYPE.Number) {
      operators = [
        { key: 'equal', value: '=' },
        {
          key: 'moreEqual',
          value: '>='
        },
        { key: 'lessEqual', value: '<=' },
        { key: 'between', value: 'between' }
      ];
    }

    setOperatorOptions(operators);
  };

  const onSubmit = (data) => {
    //console.log('onSubmit_data', data);
    handleSubmitVariableValue(data);
  };

  useEffect(() => {
    // console.log('SelectVariableValueDialog_ selectedRowData', selectedRowData);

    if (selectedRowData) {
      reset(selectedRowData);
      getOperatorOptions(selectedRowData.variableType);
    }
  }, []);

  return (
    <Dialog
      title="Enter condition"
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
            disabled={true}
            inputProps={{
              startAdornment: (
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
            styles={{ '& .MuiOutlinedInput-root': { paddingLeft: '0' } }}
          />
          <SingleSelect
            name="operator"
            control={control}
            displayEmpty
            fullWidth
            styles={{
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
          {watchOperator === OPERATORS.Between ? (
            <>
              <InputText
                fullWidth
                name="lowestValue"
                control={control}
                placeholder="Enter lowest value"
              />
              <InputText
                fullWidth
                name="highestValue"
                control={control}
                placeholder="Enter highest value"
              />
            </>
          ) : (
            <InputText
              fullWidth
              name="variableValue"
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
