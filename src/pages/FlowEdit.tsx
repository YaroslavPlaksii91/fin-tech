import {
  LayoutContainer,
  SideNavContainer,
  MainContainer
} from '@components/Layouts/MainLayout';
import FlowChart from '@components/FlowManagment/FlowChart/FlowChart';
import NavigateBack from '@components/shared/Link/NavigateBack';
import useInitialFlow from '@hooks/useInitialFlow';
import FlowHeader from '@components/FlowManagment/FlowHeader';
import { SelectStep } from '@components/StepManagment/StepSelectionDialog/SelectStep';

export default function FlowEdit() {
  const { flow } = useInitialFlow();

  return (
    <LayoutContainer>
      <SideNavContainer
        footer={<SelectStep />}
        header={<NavigateBack title="Back to view mode" />}
      >
        <FlowHeader name={flow?.data?.name || ''} />
      </SideNavContainer>
      <MainContainer>
        {flow && <FlowChart isEditMode={true} flow={flow} />}
      </MainContainer>
    </LayoutContainer>
  );
}
