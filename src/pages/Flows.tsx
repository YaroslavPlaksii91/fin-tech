import { useState, useEffect } from 'react';

import { flowService } from '../services/flow-service';
import { useLoading } from '../contexts/LoadingContext';

import {
  LayoutContainer,
  SideNavContainer,
  MainContainer
} from '@components/Layouts/MainLayout';
import { AddFlow } from '@components/FlowManagment/Add/AddFlowForm';
import Logger from '@utils/logger';
import Header from '@components/shared/SubHeader';
import List from '@components/shared/List/List';

export default function Flows() {
  const [flowList, setFlowList] = useState<{ value: string; id: string }[]>([]);
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const fetchData = async () => {
      try {
        startLoading();
        const response = await flowService.getFlows();
        const formatedList = response.data.map((el) => ({
          id: el.id,
          value: el.name
        }));
        setFlowList(formatedList);
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
        header={<Header text="Flow list" />}
      >
        <List items={flowList} />
      </SideNavContainer>
      <MainContainer>
        <p>Empty page</p>
      </MainContainer>
    </LayoutContainer>
  );
}
