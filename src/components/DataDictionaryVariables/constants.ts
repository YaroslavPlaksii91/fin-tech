export const TABS_LABELS: { [key: string]: string } = {
  laPMSVariables: 'LaPMS (Input)',
  userDefined: 'User Defined',
  outputVariables: 'Output',
  historicDataVariables: 'Underwriting History'
};

export const SOURCES_DESCRIPTIONS: { [key: string]: string } = {
  laPMSVariables:
    'This source contains all the variables from Lead Request sent to underwriting as input from the Lead and Provider Management System (LaPMS)',
  userDefined:
    'This source contains all the variable that user defined on his own, this list include temporary, permanent variables as well as constants'
};

export enum VARIABLES_TABS {
  laPMSVariables = 'laPMSVariables',
  userDefined = 'userDefined',
  outputVariables = 'outputVariables',
  historicDataVariables = 'historicDataVariables',
  all = 'all'
}
