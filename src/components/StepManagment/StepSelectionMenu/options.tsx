import { StepType } from '@components/FlowManagment/FlowChart/types';
import { LineChartDots } from '@components/shared/Icons';

export const options = [
  {
    label: 'Champion Challenger',
    dataKey: StepType.CHAMPION_CHALLENGER,
    icon: <LineChartDots />
  },
  {
    label: 'Calculation',
    dataKey: StepType.CALCULATION,
    icon: <LineChartDots />
  },
  {
    label: 'Decision table',
    dataKey: StepType.DECISION_TABLE,
    icon: <LineChartDots />
  },
  {
    id: StepType.SUBFLOW,
    dataKey: StepType.SUBFLOW,
    label: 'Subflow',
    icon: <LineChartDots />,
    disabled: true
  }
];
