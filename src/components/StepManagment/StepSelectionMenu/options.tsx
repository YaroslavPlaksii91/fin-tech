import { StepType } from '@components/FlowManagment/FlowChart/types';
import {
  ArrowLeftArrowRightSquare,
  Calculator,
  DecisionTableIcon,
  LineChartDots
} from '@components/shared/Icons';

export const options = [
  {
    label: 'Champion Challenger',
    dataKey: StepType.CHAMPION_CHALLENGER,
    icon: <ArrowLeftArrowRightSquare />
  },
  {
    label: 'Calculation',
    dataKey: StepType.CALCULATION,
    icon: <Calculator />
  },
  {
    label: 'Decision table',
    dataKey: StepType.DECISION_TABLE,
    icon: <DecisionTableIcon />
  },
  {
    id: StepType.SUBFLOW,
    dataKey: StepType.SUBFLOW,
    label: 'Subflow',
    icon: <LineChartDots />,
    disabled: true
  }
];
