import { useCallback } from 'react';
import { ReactFlowInstance } from 'reactflow';
import { Button, Stack, Typography } from '@mui/material';

import { StyledPanel } from './styled';

import Logger from '@utils/logger';
import {
  BookmarksOutlinedIcon,
  DeleteOutlineIcon,
  TaskAltOutlinedIcon
} from '@components/shared/Icons';

interface ControlPanelProps {
  flowKey: string;
  rfInstance: ReactFlowInstance | undefined;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ rfInstance, flowKey }) => {
  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    Logger.info('Restore flow');
  }, []);

  const onPushFlow = useCallback(() => {
    Logger.info('Push changes');
  }, []);

  return (
    <StyledPanel position="top-right">
      <Typography variant="h2">Edit mode</Typography>
      <Stack spacing={1} direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          color="secondary"
          onClick={onRestore}
          endIcon={<DeleteOutlineIcon />}
        >
          Delete Flow
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={onSave}
          endIcon={<BookmarksOutlinedIcon />}
        >
          Save changes
        </Button>
        <Button
          variant="contained"
          onClick={onPushFlow}
          endIcon={<TaskAltOutlinedIcon />}
        >
          Push changes
        </Button>
      </Stack>
    </StyledPanel>
  );
};

export default ControlPanel;
