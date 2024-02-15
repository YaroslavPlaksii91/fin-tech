import {
  FunctionalStepType,
  StepType
} from '@components/FlowManagment/FlowChart/types';

export const options: {
  id: FunctionalStepType;
  label: string;
  helperText: string;
  disabled?: boolean;
}[] = [
  {
    id: StepType.CHAMPION_CHALLENGER,
    label: 'Champion Challenger',
    helperText:
      'A Champion Challenger is an step that allows you to split traffic into several groups and run experiment.'
  },
  {
    id: StepType.CALCULATION,
    label: 'Calculation',
    helperText:
      'Calculation is an step that allows the User to set a value for the parameter.',
    disabled: true
  },
  {
    id: StepType.DECISION_TABLE,
    label: 'Decision table',
    helperText:
      'A decision table is a step that allows to set expressions for columns and rows. The system will go through the table and analyze the values.'
  },
  {
    id: StepType.CONDITION,
    label: 'Condition',
    helperText:
      'A condition is an step that allows the User to break the flow into two mutually exclusive paths.',
    disabled: true
  },
  {
    id: StepType.CASE,
    label: 'Case',
    helperText:
      'A case is an step that allows to set multiple conditions. Based on the number of conditions, it breaks the flow into the corresponding number of mutually exclusive paths.',
    disabled: true
  },
  {
    id: StepType.SUBFLOW,
    label: 'Subflow',
    helperText: 'Subflow',
    disabled: true
  }
];
