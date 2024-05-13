import { useState, useContext } from 'react';
import { Typography } from '@mui/material';

import Dialog from '@components/shared/Modals/Dialog';
import Logger from '@utils/logger';
import { JSONPatchOperation } from '@domain/entity';
import { flowService } from '@services/flow-service';
import { DataDictionaryPageContext } from '@pages/DataDictionary';
import { modifyFirstLetter } from '@utils/text';
import { Variable } from '@domain/dataDictionary';

interface DeleteVariableProps {
  flowId: string;
  variable: Variable & { index: number; variableIsUsed: boolean };
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteVariable = ({
  flowId,
  variable,
  isOpen,
  onClose
}: DeleteVariableProps) => {
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const value = useContext(DataDictionaryPageContext);

  const handleDeleteVariable = async () => {
    try {
      const operations: JSONPatchOperation[] = [
        {
          path: `/${modifyFirstLetter(variable.sourceType)}s/${variable.index}`,
          op: 'remove'
        }
      ];

      setConfirmLoading(true);
      const newFlowData = await flowService.updateFlow(flowId, operations);

      newFlowData && value?.setFlow(newFlowData);
      onClose();
    } catch (error) {
      Logger.error(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Dialog
      title={variable.variableIsUsed ? 'Error' : 'Delete variable'}
      open={isOpen}
      onClose={onClose}
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
