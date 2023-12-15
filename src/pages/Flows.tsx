import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { IFlowListItem } from '../types';
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

export default function Flows() {
  const [flowList, setFlowList] = useState<IFlowListItem[]>([]);
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const fetchData = async () => {
      try {
        startLoading();
        const response = await flowService.getFlows();
        setFlowList(response.data);
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
        <ul>
          {!!flowList.length &&
            flowList.map((flow, index) => (
              <li key={index}>
                <Link to={`/flow-list/details/${flow.id}`}>{flow.name}</Link>
              </li>
            ))}
        </ul>
      </SideNavContainer>
      <MainContainer>
        <p>Empty page</p>
      </MainContainer>
    </LayoutContainer>
  );
}
