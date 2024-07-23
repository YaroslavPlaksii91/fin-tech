import { useCallback } from 'react';
import { useBlocker, useBeforeUnload } from 'react-router-dom';
import { Typography } from '@mui/material';

import Dialog from '@components/shared/Modals/Dialog';
import { ROUTER_BLOCKED_STATE } from '@constants/common';
import { useAppSelector } from '@store/hooks';
import { selectFlow } from '@store/flow/selectors';
import { selectFlowList } from '@store/flowList/selectors';

interface LeavePageConfirmationDialogProps {
  isDirty: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

const LeavePageConfirmationDialog: React.FC<
  LeavePageConfirmationDialogProps
> = ({
  isDirty,
  confirmText = 'Yes',
  cancelText = 'No',
  title = 'Leave page?',
  message = 'Changes that you made not be saved.'
}) => {
  const { flow } = useAppSelector(selectFlow);
  const { flowList } = useAppSelector(selectFlowList);

  const isFlowInFlowList = flowList.some((item) => item.id === flow.id);
  const isShowDialog = isDirty && isFlowInFlowList;

  const blocker = useBlocker(isShowDialog);

  const handleClose = useCallback(() => {
    if (blocker.state === ROUTER_BLOCKED_STATE) {
      blocker.reset();
    }
  }, [blocker]);

  const handleConfirm = useCallback(() => {
    if (blocker.state === ROUTER_BLOCKED_STATE) {
      blocker.proceed();
    }
  }, [blocker]);

  useBeforeUnload(
    useCallback(
      (event) => {
        if (isDirty) {
          event.preventDefault();
          event.returnValue = true;
        }
      },
      [isDirty]
    )
  );

  return (
    <Dialog
      open={blocker.state === ROUTER_BLOCKED_STATE}
      title={title}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={handleConfirm}
      onClose={handleClose}
    >
      <Typography variant="body2">{message}</Typography>
    </Dialog>
  );
};

export default LeavePageConfirmationDialog;
