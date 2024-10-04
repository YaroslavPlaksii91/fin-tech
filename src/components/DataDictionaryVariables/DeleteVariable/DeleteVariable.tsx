import { useState } from 'react';
import { Typography } from '@mui/material';

import Dialog from '@components/shared/Modals/Dialog';
import Logger from '@utils/logger';
import { JSONPatchOperation } from '@domain/entity';
import { modifyFirstLetter } from '@utils/text';
import { Variable } from '@domain/dataDictionary';
import { updateFlow } from '@store/flow/asyncThunk';
import { useAppDispatch } from '@store/hooks';

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
  const dispatch = useAppDispatch();

  const handleDeleteVariable = () => {
    try {
      const operations: JSONPatchOperation[] = [
        {
          path: `/${modifyFirstLetter(variable.sourceType)}s/${variable.index}`,
          op: 'remove'
        }
      ];

      setConfirmLoading(true);

      void dispatch(updateFlow({ operations, id: flowId }));
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
