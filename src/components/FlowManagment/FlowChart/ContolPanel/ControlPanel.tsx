import { useCallback, useState } from 'react';
import { ReactFlowInstance } from 'reactflow';
import { Button, Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

import { StyledPanel } from './styled';

import Logger from '@utils/logger';
import {
  BookmarksOutlinedIcon,
  DeleteOutlineIcon,
  HexagonOutlinedIcon,
  TaskAltOutlinedIcon
} from '@components/shared/Icons';
import { DeleteFlow } from '@components/FlowManagment/DeleteFlow/DeleteFlow';
import { flowService } from '@services/flow-service';
import { IFlow } from '@domain/flow';
import routes from '@constants/routes';

interface ControlPanelProps {
  flow: IFlow;
  isEditMode: boolean;
  rfInstance: ReactFlowInstance | undefined;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  rfInstance,
  flow,
  isEditMode
}) => {
  const [modalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);

  const onSave = useCallback(async () => {
    if (rfInstance && flow) {
      const flowInstance = rfInstance.toObject();
      try {
        await flowService.updateFullFlow({
          ...flow,
          nodes: flowInstance.nodes,
          viewport: flowInstance.viewport
        });
      } catch (error) {
        Logger.error(error);
      }
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
      {isEditMode ? (
        <>
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
        </>
      ) : (
        <Button
          sx={{ marginLeft: 'auto' }}
          variant="contained"
          component={NavLink}
          to={`${routes.underwriting.flowList}/${flow.id}/details`}
          endIcon={<HexagonOutlinedIcon />}
        >
          View flow details
        </Button>
      )}
    </StyledPanel>
  );
};

export default ControlPanel;
