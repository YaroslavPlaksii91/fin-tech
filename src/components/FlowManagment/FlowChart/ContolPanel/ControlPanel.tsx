import { useCallback, useState } from 'react';
import { ReactFlowInstance } from 'reactflow';
import { Button, Stack, Typography } from '@mui/material';

import { StyledPanel } from './styled';

import Logger from '@utils/logger';
import {
  BookmarksOutlinedIcon,
  DeleteOutlineIcon,
  TaskAltOutlinedIcon
} from '@components/shared/Icons';
import { DeleteFlow } from '@components/FlowManagment/DeleteFlow/DeleteFlow';
// import { flowService } from '@services/flow-service';
import { IFlow } from '@domain/flow';

interface ControlPanelProps {
  flow: IFlow;
  rfInstance: ReactFlowInstance | undefined;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ rfInstance, flow }) => {
  const [modalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);

  const onSave = useCallback(() => {
    if (rfInstance && flow) {
      // const flowInstance = rfInstance.toObject();
      // try {
      //   // console.log('flowInstance', flowInstance);
      //   // console.log('flow', flow);
      //   await flowService.updateFullFlow({
      //     ...flow,
      //     nodes: flowInstance.nodes.map((node) => ({
      //       ...node,
      //       position: {
      //         x: node.position.x.toFixed(),
      //         y: node.position.y.toFixed()
      //       }
      //     })),
      //     viewport: flowInstance.viewport
      //   });
      // } catch (error) {
      //   Logger.error(error);
      // }
      localStorage.setItem(flow.id, JSON.stringify(flow));
    }
  }, [rfInstance, flow]);

  const onDelete = useCallback(() => {
    setModalDeleteOpen(true);
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
          onClick={onDelete}
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
      <DeleteFlow
        isEditMode
        flowId={flow.id}
        modalOpen={modalDeleteOpen}
        setModalOpen={setModalDeleteOpen}
      />
    </StyledPanel>
  );
};

export default ControlPanel;
