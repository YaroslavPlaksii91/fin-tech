import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Breadcrumbs, Stack, Link } from '@mui/material';

import { theme } from '@theme';
import DataDictionaryVariables from '@components/DataDictionaryVariables/DataDictionaryVariables';
import { useLoading } from '@contexts/LoadingContext';
import routes from '@constants/routes';
import Logger from '@utils/logger';
import { PRODUCTION_FLOW_ID } from '@constants/common';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { getFlow, getProductionFlow } from '@store/flow/asyncThunk';
import { setInitialFlow } from '@store/flow';
import { selectFlow } from '@store/flow/selectors';
import { Wrapper } from '@components/Layouts/styled';

const DataDictionary = () => {
  const { id } = useParams();
  const { flow } = useAppSelector(selectFlow);
  const { startLoading, stopLoading } = useLoading();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchFlow = async (flowId: string) => {
      try {
        startLoading();
        if (id === PRODUCTION_FLOW_ID) {
          await dispatch(getProductionFlow());
        } else {
          await dispatch(getFlow(flowId));
        }
      } catch (error) {
        Logger.error('Error fetching initial data:', error);
      } finally {
        stopLoading();
      }
    };

    if (id) {
      void fetchFlow(id);
    } else {
      dispatch(setInitialFlow());
    }
  }, []);

  const breadcrumbs = [
    <Link
      underline="hover"
      key="main-flow"
      variant="body1"
      color={theme.palette.text.secondary}
      href={`${routes.underwriting.flow.list(id)}`}
    >
      {flow?.data.name}
    </Link>,
    <Typography
      key="data-dictionary"
      variant="body1"
      color={theme.palette.text.primary}
    >
      Data Dictionary
    </Typography>
  ];

  if (!flow) return null;

  return (
    <Wrapper>
      <Stack spacing={2}>
        <Breadcrumbs separator="/" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
      </Stack>
      <DataDictionaryVariables flow={flow} />
    </Wrapper>
  );
};

export default DataDictionary;
