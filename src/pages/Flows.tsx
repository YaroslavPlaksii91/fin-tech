import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { IFlowListItem } from '../types';
import { flowService } from '../services/flow-service';

import {
  LayoutContainer,
  SideNavContainer,
  MainContainer
} from '@components/Layouts/MainLayout';
import { AddFlow } from '@components/FlowManagment/Add/AddFlowForm';
import FlowChart from '@components/FlowManagment/FlowChart/FlowChart';
import Logger from '@utils/logger';

export default function Flows() {
  const [flowList, setFlowList] = useState<IFlowListItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await flowService.getFlows();
        setFlowList(response.data);
      } catch (error) {
        Logger.error('Error fetching data:', error);
      }
    };

    void fetchData();
  }, []);

  return (
    <LayoutContainer>
      <SideNavContainer footer={<AddFlow />} header="Flow list">
        <ul>
          {!!flowList.length &&
            flowList.map((flow, index) => (
              <li key={index}>
                <Link to={`/flow-list/edit/${flow.id}`}>{flow.name}</Link>
              </li>
            ))}
        </ul>
      </SideNavContainer>
      <MainContainer>
        {flowList.length ? <FlowChart elements={[]} /> : <p>Empty page</p>}
      </MainContainer>
    </LayoutContainer>
  );
}
