import { useCallback, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { unwrapResult } from '@reduxjs/toolkit';
import * as _ from 'lodash-es';
import { NavLink } from 'react-router-dom';

import {
  formatFlowOnSave,
  parseFlowValidationErrors
} from '../utils/flowUtils';
import { ControlPanelProps } from '../types';

import { StyledPanel } from './styled';

import {
  SnackbarErrorMessage,
  SnackbarMessage
} from '@components/shared/Snackbar/SnackbarMessage';
import Dialog from '@components/shared/Modals/Dialog';
import { SNACK_TYPE } from '@constants/common';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { saveFlow } from '@store/flow/asyncThunk';
import { pushProductionFlow } from '@store/flowList/asyncThunk';
import { selectFlowData } from '@store/flow/selectors';
import { selectUserInfo } from '@store/auth';
import { permissionsMap } from '@constants/permissions';
import { checkIsProductionFlow, getFullUserName } from '@utils/helpers';
import { updateFlowListItem } from '@store/flowList';
import { useHasUserPermission } from '@hooks/useHasUserPermission';
import routes from '@constants/routes';

const ControlPanelMainFlow = ({
  rfInstance,
  flow,
  isDirty,
  setCopyFlow,
  isViewMode
}: ControlPanelProps) => {
  const [loading, setLoading] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

  const dispatch = useAppDispatch();
  const flowData = useAppSelector(selectFlowData);
  const user = useAppSelector(selectUserInfo);
  const username = getFullUserName(user);
  const isProductionFlow = checkIsProductionFlow();

  const canPushFlowToProduction = useHasUserPermission(
    permissionsMap.canPushFlowToProduction
  );

  const canUpdateFlow = useHasUserPermission(permissionsMap.canUpdateFlow);

  const handleWarningModalOpen = () => setIsWarningModalOpen(true);

  const handleWarningModalClose = () => setIsWarningModalOpen(false);

  const onSave = useCallback(async () => {
    try {
      setLoading(true);
      const formattedData = formatFlowOnSave({
        flow: {
          ...flow,
          data: { ...flowData, editedBy: username }
        },
        rfInstance
      });
      const resultAction = await dispatch(saveFlow(formattedData));
      const savedFlow = unwrapResult(resultAction);
      setCopyFlow(_.cloneDeep(savedFlow));
      dispatch(updateFlowListItem({ ...savedFlow.data, id: savedFlow.id }));

      enqueueSnackbar(
        <SnackbarMessage
          message="Success"
          details={`Changes for the "${savedFlow.data.name}" flow were successfully saved.`}
        />,
        { variant: SNACK_TYPE.SUCCESS }
      );
    } catch (error) {
      enqueueSnackbar(<SnackbarErrorMessage message="Error" error={error} />, {
        variant: SNACK_TYPE.ERROR
      });
    } finally {
      setLoading(false);
    }
  }, [rfInstance, flow, flowData]);

  const handlePushToProduction = useCallback(async () => {
    try {
      setLoading(true);
      const formattedData = formatFlowOnSave({
        flow: { ...flow, data: flowData },
        rfInstance
      });
      const resultAction = await dispatch(
        pushProductionFlow({
          flow: formattedData,
          params: { pushedBy: username, note: '' }
        })
      );
      const pushedFlow = unwrapResult(resultAction);

      enqueueSnackbar(
        <SnackbarMessage
          message="Success"
          details={`"${pushedFlow.data.name}" flow is published into the production successfully.`}
        />,
        { variant: SNACK_TYPE.SUCCESS }
      );
    } catch (error) {
      const errors = parseFlowValidationErrors(
        error,
        rfInstance.toObject().nodes
      );
      enqueueSnackbar(
        <SnackbarErrorMessage
          message="Error"
          parsedErrors={errors}
          error={error}
        />,
        {
          variant: SNACK_TYPE.ERROR
        }
      );
    } finally {
      setLoading(false);
    }
  }, [rfInstance, flow, flowData]);

  const handleConfirm = async () => {
    await handlePushToProduction();
    setIsWarningModalOpen(false);
  };

  return (
    <StyledPanel position="top-right">
      <Box>
        <Typography variant="body1" mb={1}>
          {isProductionFlow ? 'Flow on Production' : 'Draft Flow'}
        </Typography>
        <Typography variant="h4">{flowData.name}</Typography>
      </Box>
      <Stack spacing={1} direction="row" justifyContent="flex-end">
        {!isProductionFlow && canUpdateFlow && isViewMode ? (
          <Button
            sx={{ marginLeft: 'auto' }}
            variant="contained"
            size="small"
            component={NavLink}
            to={routes.underwriting.flow.edit(flow.id)}
          >
            Edit Flow
          </Button>
        ) : null}
        {canUpdateFlow && !isViewMode ? (
          <Button
            size="small"
            variant="outlined"
            onClick={onSave}
            disabled={loading}
          >
            Save changes
          </Button>
        ) : null}
        {canPushFlowToProduction && !isProductionFlow ? (
          <Button
            size="small"
            variant="contained"
            disabled={isDirty}
            onClick={
              isViewMode ? handleWarningModalOpen : handlePushToProduction
            }
          >
            Push To Production
          </Button>
        ) : null}
      </Stack>
      <Dialog
        title="Push Flow"
        open={isWarningModalOpen}
        onConfirm={handleConfirm}
        onClose={handleWarningModalClose}
        confirmText="Confirm"
        confirmLoading={loading}
        cancelText="Cancel"
      >
        <Typography sx={{ maxWidth: '416px' }} variant="body2">
          This action will push the flow <b>{flow.data.name}</b> into
          production. To confirm, please click <b>Confirm</b> button.
        </Typography>
      </Dialog>
    </StyledPanel>
  );
};

export default ControlPanelMainFlow;
