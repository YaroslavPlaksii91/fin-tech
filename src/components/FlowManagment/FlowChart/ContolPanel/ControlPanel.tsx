import { useCallback, useState } from 'react';
import { ReactFlowInstance } from 'reactflow';
import { Button, Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

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
import {
  SnackbarErrorMessage,
  SnackbarMessage
} from '@components/shared/Snackbar/SnackbarMessage';
import { SNACK_TYPE } from '@constants/common';

interface ControlPanelProps {
  flow: IFlow;
  setFlow: (flow: IFlow) => void;
  isEditMode: boolean;
  isViewMode: boolean;
  rfInstance: ReactFlowInstance | undefined;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  rfInstance,
  flow,
  setFlow,
  isEditMode,
  isViewMode
}) => {
  const [modalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onSave = useCallback(async () => {
    if (rfInstance && flow) {
      const flowInstance = rfInstance.toObject();
      try {
        setLoading(true);
        const data = await flowService.updateFullFlow({
          ...flow,
          edges: flowInstance.edges.map((edge) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type
          })),
          nodes: flowInstance.nodes,
          viewport: flowInstance.viewport
        });
        setFlow(data);
        enqueueSnackbar(
          <SnackbarMessage
            message="Success"
            details={`Changes for the "${flow.data.name}" flow were successfully saved.`}
          />,
          { variant: SNACK_TYPE.SUCCESS }
        );
      } catch (error) {
        enqueueSnackbar(
          <SnackbarErrorMessage message="Error" error={error} />,
          {
            variant: SNACK_TYPE.ERROR
          }
        );
      } finally {
        setLoading(false);
      }
    }
  }, [rfInstance, flow]);

  const onDelete = useCallback(() => {
    setModalDeleteOpen(true);
  }, []);

  const onPushFlow = useCallback(() => {
    Logger.info('Push changes');
  }, []);

  return (
    <>
      {isEditMode && (
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
              disabled={loading}
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
      )}
      {isViewMode && (
        <StyledPanel position="top-right">
          <Button
            sx={{ marginLeft: 'auto' }}
            variant="contained"
            component={NavLink}
            to={`${routes.underwriting.flowList}/${flow.id}/details`}
            endIcon={<HexagonOutlinedIcon />}
          >
            View flow details
          </Button>
        </StyledPanel>
      )}
    </>
  );
};

export default ControlPanel;
