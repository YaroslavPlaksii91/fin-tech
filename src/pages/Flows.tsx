import { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { ListItemSecondaryAction, Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

import { useLoading } from '../contexts/LoadingContext';

import Header from '@components/shared/Header';
import { flowService } from '@services/flow-service';
import {
  LayoutContainer,
  MainContainer,
  SideNavContainer
} from '@components/Layouts/MainLayout';
import { AddFlow } from '@components/FlowManagment/Add/AddFlowForm';
import Logger from '@utils/logger';
import {
  StyledList,
  StyledListItemText,
  StyledNavListItem
} from '@components/shared/List/styled';
import { StyledBorderNavLink } from '@components/shared/Link/styled';
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
        <Header pb={1} text="Flow list" />
        <StyledList>
          {flowList.map((flow) => (
            <StyledNavListItem
              key={flow.id}
              component={NavLink}
              to={`${routes.underwriting.flowList}/${flow.id}`}
            >
              <StyledListItemText>{flow.name}</StyledListItemText>
              <ListItemSecondaryAction>
                <ActionsMenu flow={flow} />
              </ListItemSecondaryAction>
            </StyledNavListItem>
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
