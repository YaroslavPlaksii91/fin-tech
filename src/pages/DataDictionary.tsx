import { useState, useEffect, createContext } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Breadcrumbs, Stack, Link } from '@mui/material';

import { theme } from '@theme';
import { LayoutContainer } from '@components/Layouts/MainLayout';
import DataDictionaryVariables from '@components/DataDictionaryVariables/DataDictionaryVariables.tsx';
import { IFlow } from '@domain/flow';
import { UserDefinedVariable } from '@domain/dataDictionary';
import { flowService } from '@services/flow-service';
import { useLoading } from '@contexts/LoadingContext';
import routes from '@constants/routes';
import Logger from '@utils/logger';
import { PRODUCTION_FLOW_ID } from '@constants/common';

export type DataDictionaryPageContextType = {
  temporaryVariables: Pick<
    UserDefinedVariable,
    'name' | 'dataType' | 'defaultValue' | 'description'
  >[];
  setFlow: (flow: IFlow) => void;
};

export const DataDictionaryPageContext = createContext<
  DataDictionaryPageContextType | undefined
>(undefined);

export default function DataDictionary() {
  const { id } = useParams();
  const [flow, setFlow] = useState<IFlow | null>(null);
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const fetchInitialData = async (flowId: string) => {
      try {
        startLoading();
        let flow;
        if (flowId === PRODUCTION_FLOW_ID) {
          flow = await flowService.getProductionFlowDetails();
        } else {
          flow = await flowService.getFlow(flowId);
        }
        setFlow(flow);
      } catch (error) {
        Logger.error('Error fetching flow data:', error);
      } finally {
        stopLoading();
      }
    };

    id && void fetchInitialData(id);
  }, [id]);

  const breadcrumbs = [
    <Link
      underline="hover"
      key="main-flow"
      variant="body1"
      color={theme.palette.text.secondary}
      href={`${routes.underwriting.flow.list}/${id}`}
    >
      {flow?.data.name}
    </Link>,
    <Typography
      key="data-dictionary"
      variant="body1"
      color={theme.palette.text.primary}
    >
      Data dictionary
    </Typography>
  ];

  if (!flow) return null;

  const contextValue = {
    temporaryVariables: flow.temporaryVariables,
    setFlow
  };

  return (
    <LayoutContainer>
      <Stack
        px={3}
        pt={2}
        pb={3}
        sx={{ width: '100%', background: theme.palette.background.default }}
      >
        <Stack spacing={2}>
          <Breadcrumbs separator="/" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
        <DataDictionaryPageContext.Provider value={contextValue}>
          <DataDictionaryVariables flow={flow} />
        </DataDictionaryPageContext.Provider>
      </Stack>
    </LayoutContainer>
  );
}
