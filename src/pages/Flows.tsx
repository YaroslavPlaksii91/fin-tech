import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import {
  LayoutContainer,
  SideNavContainer,
  MainContainer
} from '@components/Layouts/MainLayout';
import { AddFlow } from '@components/FlowManagment/Add/AddFlowForm';
import FlowChartNew from '@components/FlowManagment/FlowChart/FlowChartNew';

export default function Flows() {
  const [flowList, setFlowList] = useState([
    { id: 1, name: 'flow 1' },
    { id: 2, name: 'flow 2' }
  ]);

  const getFlowList = () => [
    { id: 1, name: 'flow 1' },
    { id: 2, name: 'flow 2' }
  ];

  useEffect(() => {
    const data = getFlowList();
    setFlowList(data);
  }, []);

  return (
    <LayoutContainer>
      <SideNavContainer footer={<AddFlow />} title="Flow list">
        <ul>
          {flowList.length &&
            flowList.map((flow, index) => (
              <li key={index}>
                <Link to={`/flow-list/${flow.id}`}>{flow.name}</Link>
              </li>
            ))}
        </ul>
      </SideNavContainer>
      <MainContainer>
        {flowList.length ? <FlowChartNew elements={[]} /> : <p>Empty page</p>}
      </MainContainer>
    </LayoutContainer>
  );
}
