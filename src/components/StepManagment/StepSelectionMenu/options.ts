import { StepType } from '@components/FlowManagment/FlowChart/types';

export const options = [
  { label: 'Champion Challenger', dataKey: StepType.CHAMPION_CHALLENGER },
  { label: 'Calculation', dataKey: StepType.CALCULATION },
  {
    label: 'Decision table',
    dataKey: StepType.DECISION_TABLE
  },
  {
    label: 'Condition',
    dataKey: StepType.CONDITION,
    disabled: true
  },
  {
    label: 'Case',
    dataKey: StepType.CASE,
    disabled: true
  },
  {
    id: StepType.SUBFLOW,
    dataKey: StepType.SUBFLOW,
    label: 'Subflow',
    disabled: true
  }
];
