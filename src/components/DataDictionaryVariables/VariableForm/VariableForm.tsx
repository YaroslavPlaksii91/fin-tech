import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, MenuItem } from '@mui/material';

import { validationSchema } from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import LoadingButton from '@components/shared/LoadingButton';
import { InputText } from '@components/shared/Forms/InputText';
import { Textarea } from '@components/shared/Forms/Textarea';
import { SingleSelect } from '@components/shared/Forms/SingleSelect';
import { DataDictionaryPageContext } from '@pages/DataDictionary';
import {
  VARIABLE_SOURCE_TYPE,
  DATA_TYPE_WITHOUT_ENUM,
  UserDefinedVariable
} from '@domain/dataDictionary';
import { JSONPatchOperation } from '@domain/entity';
import { flowService } from '@services/flow-service';
import Logger from '@utils/logger';

type VariableFormProps = {
  flowId: string;
  modalOpen: boolean;
  formData:
    | (Pick<
        UserDefinedVariable,
        'name' | 'dataType' | 'defaultValue' | 'description' | 'sourceType'
      > & { index: number; variableIsUsed: boolean })
    | undefined;
  handleClose: () => void;
};

// TODO: Add other sources as an array
const variableSourceTypeOptions = {
  key: VARIABLE_SOURCE_TYPE.TemporaryVariable,
  value: VARIABLE_SOURCE_TYPE.TemporaryVariable
};

export const VariableForm: React.FC<VariableFormProps> = ({
  flowId,
  modalOpen,
  handleClose,
  formData
}) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: formData ? formData.name : '',
      sourceType: variableSourceTypeOptions.value,
      dataType: formData ? formData.dataType : DATA_TYPE_WITHOUT_ENUM.String,
      defaultValue: formData ? formData.defaultValue : '',
      description: formData ? formData.description : ''
    }
  });

  const value = useContext(DataDictionaryPageContext);

  const onSubmit = async (
    data: Pick<
      UserDefinedVariable,
      'name' | 'dataType' | 'defaultValue' | 'description' | 'sourceType'
    >
  ) => {
    let operations: JSONPatchOperation[];

    if (formData) {
      // operations to update variable
      operations = [
        {
          value: data,
          path: `/temporaryVariables/${formData.index}`,
          op: 'replace'
        }
      ];
    } else {
      // Patch operations to add variable
      operations = [
        {
          value: data,
          path: '/temporaryVariables/-',
          op: 'add'
        }
      ];
    }

    try {
      const newFlowData =
        flowId && (await flowService.updateFlow(flowId, operations));

      newFlowData && value?.setFlow(newFlowData);
    } catch (error) {
      Logger.error('Error updating temporary variables in the flow:', error);
    }

    handleClose();
  };

  return (
    <Dialog
      title={formData ? 'Edit variable' : 'Create variable'}
      open={modalOpen}
      maxWidth="xs"
      displayConfirmBtn={false}
      displayedCancelBtn={false}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <InputText
            fullWidth
            name="name"
            label="Variable Name"
            control={control}
            disabled={formData && formData.variableIsUsed}
          />
          <SingleSelect
            variant="outlined"
            name="sourceType"
            label="Source Type"
            control={control}
            displayEmpty
            fullWidth
            disabled
            sx={{
              '& .MuiInputBase-root ': {
                height: '40px'
              }
            }}
          >
            <MenuItem
              key={variableSourceTypeOptions.key}
              value={variableSourceTypeOptions.value}
            >
              {variableSourceTypeOptions.value}
            </MenuItem>
          </SingleSelect>
          <SingleSelect
            variant="outlined"
            name="dataType"
            label="Data Type"
            control={control}
            disabled={formData && formData.variableIsUsed}
            displayEmpty
            fullWidth
            sx={{
              '& .MuiInputBase-root ': {
                height: '40px'
              }
            }}
          >
            {(
              Object.keys(DATA_TYPE_WITHOUT_ENUM) as Array<
                keyof typeof DATA_TYPE_WITHOUT_ENUM
              >
            ).map((dataType, index) => (
              <MenuItem key={index} value={dataType}>
                {dataType}
              </MenuItem>
            ))}
          </SingleSelect>
          <InputText
            fullWidth
            name="defaultValue"
            label="Default Value"
            control={control}
          />
          <Textarea
            fullWidth
            name="description"
            label="Description"
            control={control}
            minRows={4}
          />
        </Stack>

        <Stack mt={3} spacing={1} direction="row" justifyContent="flex-end">
          <Button variant="outlined" onClick={handleClose}>
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
