import {
  LayoutContainer,
  SideNavContainer,
  MainContainer
} from '@components/Layouts/MainLayout';
import NavigateBack from '@components/shared/Link/NavigateBack';
import { SelectStep } from '@components/StepManagment/StepSelectionDialog/SelectStep';

export default function StepDetails() {
  return (
    <LayoutContainer>
      <SideNavContainer
        footer={<SelectStep />}
        header={<NavigateBack title="Back to edit mode" />}
      >
        object
      </SideNavContainer>
      <MainContainer>
        <p>new step added</p>
      </MainContainer>
    </LayoutContainer>
  );
}
