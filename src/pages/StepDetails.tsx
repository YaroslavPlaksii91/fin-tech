import {
  LayoutContainer,
  SideNavContainer,
  MainContainer
} from '@components/Layouts/MainLayout';
import NavigateBack from '@components/shared/Link/NavigateBack';
import useInitialFlow from '@hooks/useInitialFlow';
import FlowHeader from '@components/FlowManagment/FlowHeader';
import { SelectStep } from '@components/StepManagment/SelectStep/SelectStep';

export default function StepDetails() {
  const { data } = useInitialFlow();
  return (
    <LayoutContainer>
      <SideNavContainer
        footer={<SelectStep />}
        header={<NavigateBack title="Back to edit mode" />}
      >
        <FlowHeader name={data.data.name} />
      </SideNavContainer>
      <MainContainer>
        <p>new step added</p>
      </MainContainer>
    </LayoutContainer>
  );
}
