import { StepType } from '@components/FlowManagment/FlowChart/types';
import CalculationIcon from '@icons/calculation.svg';
import ChampionChallengerIcon from '@icons/champion-challenger.svg';
import DecisionTableIcon from '@icons/decision-table.svg';
import SubflowIcon from '@icons/subflow.svg';

export const options = [
  {
    label: 'Calculation',
    dataKey: StepType.CALCULATION,
    icon: <CalculationIcon />
  },
  {
    label: 'Champion Challenger',
    dataKey: StepType.CHAMPION_CHALLENGER,
    icon: <ChampionChallengerIcon />
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
    icon: <SubflowIcon />
  }
];
