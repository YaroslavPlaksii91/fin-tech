import ArrowLeftAndRightSquareIcon from '@icons/arrowLeftAndRightSquare.svg';
import LineChartDotsSquareIcon from '@icons/lineChartDotsSquare.svg';
import Calculator from '@icons/calculator.svg';
import BlocksIcon from '@icons/blocks.svg';
import { StepType } from '@components/FlowManagment/FlowChart/types';

export const options = [
  {
    label: 'Calculation',
    dataKey: StepType.CALCULATION,
    icon: <Calculator />
  },
  {
    label: 'Champion Challenger',
    dataKey: StepType.CHAMPION_CHALLENGER,
    icon: <LineChartDotsSquareIcon />
  },
  {
    label: 'Decision table',
    dataKey: StepType.DECISION_TABLE,
    icon: <BlocksIcon />
  },
  {
    id: StepType.SUBFLOW,
    dataKey: StepType.SUBFLOW,
    label: 'Subflow',
    icon: <ArrowLeftAndRightSquareIcon />,
    disabled: true
  }
];
