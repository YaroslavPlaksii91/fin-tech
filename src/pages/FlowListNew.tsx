import FlowChartView from '@components/FlowManagment/FlowChart/FlowChartReadOnlyView';
import { selectFlow } from '@store/flow/selectors';
import { useAppSelector } from '@store/hooks';
import { checkIsProductionFlow } from '@utils/helpers';

export default function FlowsNew() {
  const { flow } = useAppSelector(selectFlow);
  const isProductionFlow = checkIsProductionFlow();

  return (
    <FlowChartView
      isProductionFlow={isProductionFlow}
      flow={flow}
      showControlPanel={!!flow.id}
    />
  );
}
