import { useCallback, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { unwrapResult } from '@reduxjs/toolkit';
import cloneDeep from 'lodash/cloneDeep';
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

const ControlPanelMainFlow: React.FC<ControlPanelProps> = ({
  rfInstance,
  flow,
  isDirty,
  setCopyFlow,
  isViewMode
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const flowData = useAppSelector(selectFlowData);
  const user = useAppSelector(selectUserInfo);
  const username = getFullUserName(user);
  const isProductionFlow = checkIsProductionFlow();

  const canPushFlowToProduction = useHasUserPermission(
    permissionsMap.canPushFlowToProduction
  );

  const canUpdateFlow = useHasUserPermission(permissionsMap.canUpdateFlow);

  const onSave = useCallback(async () => {
    if (rfInstance && flow) {
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
        setCopyFlow(cloneDeep(savedFlow));
        dispatch(updateFlowListItem({ ...savedFlow.data, id: savedFlow.id }));

        enqueueSnackbar(
          <SnackbarMessage
            message="Success"
            details={`Changes for the "${savedFlow.data.name}" flow were successfully saved.`}
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
  }, [rfInstance, flow, flowData]);

  const onPushFlow = useCallback(async () => {
    if (rfInstance && flow) {
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
    }
  }, [rfInstance, flow, flowData]);

  return (
    <StyledPanel position="top-right">
      <Box>
        <Typography variant="body1" mb={1}>
          {isProductionFlow ? 'Flow on Production' : 'Draft Flow'}
        </Typography>
        <Typography variant="h4">{flowData.name}</Typography>
      </Box>
      <Stack spacing={1} direction="row" justifyContent="flex-end">
        {isViewMode ? (
          !isProductionFlow &&
          canUpdateFlow && (
            <Button
              sx={{ marginLeft: 'auto' }}
              variant="contained"
              size="small"
              component={NavLink}
              to={routes.underwriting.flow.edit(flow.id)}
            >
              Edit Flow
            </Button>
          )
        ) : (
          <>
            {canUpdateFlow && (
              <Button
                size="small"
                variant="outlined"
                onClick={onSave}
                disabled={loading}
              >
                Save changes
              </Button>
            )}
            {canPushFlowToProduction && (
              <Button
                size="small"
                variant="contained"
                disabled={isDirty}
                onClick={onPushFlow}
              >
                Push changes
              </Button>
            )}
          </>
        )}
      </Stack>
    </StyledPanel>
  );
};

export default ControlPanelMainFlow;
