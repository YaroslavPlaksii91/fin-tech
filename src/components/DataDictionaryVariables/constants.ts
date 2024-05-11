export const TABS_LABELS: { [key: string]: string } = {
  laPMSVariables: 'LaPMS (Input)',
  userDefined: 'User Defined',
  outputVariables: 'Output',
  historicDataVariables: 'Underwriting History',
  craReportVariables: 'CRA Reports'
};

export const SOURCES_DESCRIPTIONS: { [key: string]: string } = {
  laPMSVariables:
    'This source contains all the variables from Lead Request sent to underwriting as input from the Lead and Provider Management System (LaPMS)',
  userDefined:
    'This source contains all the variable that user defined on his own, this list include temporary, permanent variables as well as constants',
  historicDataVariables:
    'This source contains variables that are calculated from the underwriting history and decision engine reporting.',
  outputVariables:
    'This source contains variables that the Risk Manager must initialize and the Underwriting Platform must include in the request to the Loan Management System (LMS), otherwise the flow will not be production-ready.'
};

export enum VARIABLES_TABS {
  laPMSVariables = 'laPMSVariables',
  userDefined = 'userDefined',
  outputVariables = 'outputVariables',
  historicDataVariables = 'historicDataVariables',
  craReportVariables = 'craReportVariables',
  all = 'all'
}
