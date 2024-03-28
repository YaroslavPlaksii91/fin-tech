import { useState, useEffect, createContext } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Breadcrumbs, Stack, Link } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { palette } from '../themeConfig.ts';

import { LayoutContainer } from '@components/Layouts/MainLayout';
import DataDictionaryVariableList from '@components/DataDictionaryVariableList/DataDictionaryVariableList.tsx';
import { IFlow } from '@domain/flow';
import { UserDefinedVariable } from '@domain/dataDictionary';
import { flowService } from '@services/flow-service';
import { useLoading } from '@contexts/LoadingContext';
import routes from '@constants/routes';
import Logger from '@utils/logger';

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
        const flow = await flowService.getFlow(flowId);
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
      key="flow-list"
      variant="body2"
      color={palette.gray}
      href={routes.underwriting.flow.list}
    >
      Flow list
    </Link>,
    <Link
      underline="hover"
      key="main-flow"
      variant="body2"
      color={palette.gray}
      href={routes.underwriting.flow.details(id as string)}
    >
      Main flow
    </Link>,
    <Typography key="data-dictionary" variant="body2" color={palette.gray}>
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
      <Stack paddingX={12} sx={{ width: '100%' }}>
        <Stack spacing={2} pt={2} pb={2}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="medium" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
        <DataDictionaryPageContext.Provider value={contextValue}>
          <DataDictionaryVariableList flow={flow} />
        </DataDictionaryPageContext.Provider>
      </Stack>
    </LayoutContainer>
  );
}
