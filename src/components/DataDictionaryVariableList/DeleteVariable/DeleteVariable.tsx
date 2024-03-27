import { useState } from 'react';
import { indexOf, map } from 'lodash';
import { Typography } from '@mui/material';

import Dialog from '@components/shared/Modals/Dialog';
import Logger from '@utils/logger';
import {
  UserDefinedVariable,
  DataDictionaryVariable
} from '@domain/dataDictionary';
import { JSONPatchOperation } from '@domain/entity';
import { flowService } from '@services/flow-service';

interface DeleteVariableProps {
  flowId: string;
  variable: { name: string; variableIsUsed: boolean };
  tableList:
    | DataDictionaryVariable[]
    | Pick<
        UserDefinedVariable,
        'name' | 'dataType' | 'defaultValue' | 'description' | 'sourceType'
      >[];
  modalOpen: boolean;
  handleCloseModal: () => void;
  setTableList: (list: UserDefinedVariable[]) => void;
}

export const DeleteVariable = ({
  flowId,
  variable,
  tableList,
  modalOpen,
  handleCloseModal,
  setTableList
}: DeleteVariableProps) => {
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const handleDeleteVariable = async () => {
    try {
      const operations: JSONPatchOperation[] = [
        {
          path: `/temporaryVariables/${indexOf(
            map(tableList, 'name'),
            variable.name
          )}`,
          op: 'remove'
        }
      ];

      setConfirmLoading(true);
      const resultData = await flowService.updateFlow(flowId, operations);

      resultData &&
        setTableList([
          ...(resultData?.temporaryVariables as UserDefinedVariable[]),
          ...(resultData.permanentVariables as UserDefinedVariable[])
        ]);
      handleCloseModal();
    } catch (error) {
      Logger.error(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Dialog
      title={variable.variableIsUsed ? 'Error' : 'Delete variable'}
      open={modalOpen}
      onClose={handleCloseModal}
      onConfirm={handleDeleteVariable}
      confirmText="Delete"
      confirmLoading={confirmLoading}
      isConfirmBtnDisabled={variable.variableIsUsed}
    >
      {variable.variableIsUsed ? (
        <Typography width={416} variant="body2">
          {variable.name} cannot be deleted as it is in use.
        </Typography>
      ) : (
        <Typography width={416} variant="body2">
          Are you sure you want to delete {variable.name} from the flow?
        </Typography>
      )}
    </Dialog>
  );
};
