import { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Stack, Typography } from '@mui/material';

import { useLoading } from '../contexts/LoadingContext';

import { flowService } from '@services/flow-service';
import {
  LayoutContainer,
  MainContainer,
  SideNavContainer
} from '@components/Layouts/MainLayout';
import { AddFlow } from '@components/FlowManagment/Add/AddFlowForm';
import Logger from '@utils/logger';
import Header from '@components/shared/SubHeader';
import {
  StyledList,
  StyledListItem,
  StyledListItemText
} from '@components/shared/List/styled';
import {
  StyledListItemNavLink,
  StyledBorderNavLink
} from '@components/shared/Link/styled';
import { IFlowListItem } from '@domain/flow';
import FlowChart from '@components/FlowManagment/FlowChart/FlowChart';
import routes from '@constants/routes';
import useInitialFlow from '@hooks/useInitialFlow';
import ActionsMenu from '@components/FlowManagment/ActionsMenu/ActionMenu';

export default function Flows() {
  const [flowList, setFlowList] = useState<IFlowListItem[]>([]);
  const [productionFlow, setProductionFlow] = useState<IFlowListItem>();
  const { startLoading, stopLoading } = useLoading();
  const { elements, data } = useInitialFlow();

  useEffect(() => {
    const fetchData = async () => {
      try {
        startLoading();
        const data = await flowService.getFlows();
        const dataProductionFlow = await flowService.getProductionFlow();
        setFlowList(data);
        setProductionFlow(dataProductionFlow);
      } catch (error) {
        Logger.error('Error fetching data:', error);
      } finally {
        stopLoading();
      }
    };

    void fetchData();
  }, []);

  return (
    <LayoutContainer>
      <SideNavContainer
        footer={<AddFlow />}
        header={
          <Stack spacing={1}>
            <Header text="Flow on production" />
            <StyledBorderNavLink
              to={`${routes.underwriting.flowList}/production-flow`}
            >
              <Typography pb={1} pt={1} pl={2} variant="body2">
                {productionFlow?.name}
              </Typography>
            </StyledBorderNavLink>
          </Stack>
        }
      >
        <StyledList>
          {flowList.map((flow) => (
            <StyledListItemNavLink
              key={flow.id}
              to={`${routes.underwriting.flowList}/${flow.id}`}
            >
              <StyledListItem secondaryAction={<ActionsMenu />}>
                <StyledListItemText>{flow.name}</StyledListItemText>
              </StyledListItem>
            </StyledListItemNavLink>
          ))}
        </StyledList>
      </SideNavContainer>
      <ReactFlowProvider>
        <MainContainer>
          <FlowChart elements={elements} data={data} />
        </MainContainer>
      </ReactFlowProvider>
    </LayoutContainer>
  );
}
