import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, MenuItem } from '@mui/material';

import { SelectedVariable } from '../TableList/TableList';

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
import { modifyFirstLetter } from '@utils/text';

type VariableFormProps = {
  flowId: string;
  isOpen: boolean;
  formData?: SelectedVariable;
  onClose: () => void;
};

const VARIABLE_SOURCE_TYPE_OPTIONS = [
  {
    key: VARIABLE_SOURCE_TYPE.TemporaryVariable,
    value: VARIABLE_SOURCE_TYPE.TemporaryVariable
  },
  {
    key: VARIABLE_SOURCE_TYPE.PermanentVariable,
    value: VARIABLE_SOURCE_TYPE.PermanentVariable
  }
];

export const VariableForm: React.FC<VariableFormProps> = ({
  flowId,
  isOpen,
  onClose,
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
      sourceType: VARIABLE_SOURCE_TYPE_OPTIONS[0].value,
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
    const operations: JSONPatchOperation[] = [
      {
        value: data,
        path: formData
          ? `/${modifyFirstLetter(formData.sourceType)}s/${formData.index}`
          : `/${modifyFirstLetter(data.sourceType)}s/-`,
        op: formData ? 'replace' : 'add'
      }
    ];

    try {
      const newFlowData =
        flowId && (await flowService.updateFlow(flowId, operations));

      newFlowData && value?.setFlow(newFlowData);
    } catch (error) {
      Logger.error('Error updating temporary variables in the flow:', error);
    }

    onClose();
  };

  return (
    <Dialog
      fullWidth
      title={formData ? 'Edit variable' : 'Create variable'}
      open={isOpen}
      maxWidth="sm"
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
            disabled={Boolean(formData)}
            sx={{
              '& .MuiInputBase-root ': {
                height: '40px'
              }
            }}
          >
            {VARIABLE_SOURCE_TYPE_OPTIONS.map((sourceType) => (
              <MenuItem key={sourceType.key} value={sourceType.value}>
                {sourceType.value}
              </MenuItem>
            ))}
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
          <LoadingButton
            loading={isSubmitting}
            disabled={isSubmitting}
            variant="text"
            type="submit"
          >
            Save Changes
          </LoadingButton>
          <Button variant="text" onClick={onClose}>
            Cancel
          </Button>
        </Stack>
      </form>
    </Dialog>
  );
};
