import { useEffect } from 'react';
import { ListItemSecondaryAction, Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

import Header from '@components/shared/Header';
import {
  LayoutContainer,
  MainContainer,
  SideNavContainer
} from '@components/Layouts/MainLayout';
import { AddFlow } from '@components/FlowManagment/AddFlow/AddFlowForm';
import Logger from '@utils/logger';
import {
  StyledList,
  StyledListItemText,
  StyledNavListItem
} from '@components/shared/List/styled';
import { StyledBorderNavLink } from '@components/shared/Link/styled';
import FlowChart from '@components/FlowManagment/FlowChart/FlowChart';
import routes from '@constants/routes';
import useInitialFlow from '@hooks/useInitialFlow';
import ActionsMenu from '@components/FlowManagment/ActionsMenu/ActionMenu';
import { fetchFlowList } from '@store/flowList/asyncThunk';
import { selectFlowList } from '@store/flowList/selectors';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { useLoading } from '@contexts/LoadingContext';

export default function Flows() {
  const { startLoading, stopLoading } = useLoading();
  const { flow } = useInitialFlow();
  const { flowList, flowProduction } = useAppSelector(selectFlowList);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        startLoading();
        await dispatch(fetchFlowList());
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
                {flowProduction?.name}
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
      <MainContainer>{flow && <FlowChart flow={flow} />}</MainContainer>
    </LayoutContainer>
  );
}
