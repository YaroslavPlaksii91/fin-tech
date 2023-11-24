import {
  LayoutContainer,
  SideNavContainer,
  MainContainer
} from '@components/Layouts/MainLayout';
import { AddFlow } from '@components/Flows/Add/AddFlowForm';
import FlowChart from '@components/Flows/FlowChart/FlowChart';

export default function Flows() {
  return (
    <LayoutContainer>
      <SideNavContainer footer={<AddFlow />} title="Flow list">
        Test
      </SideNavContainer>
      <MainContainer>
        <FlowChart />
      </MainContainer>
    </LayoutContainer>
  );
}
