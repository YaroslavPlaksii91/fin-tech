import dayjs from 'dayjs';

import { StepType } from '@components/FlowManagment/FlowChart/types';
import { theme } from '@theme';
import FlagTriangleIcon from '@icons/flagTriangle.svg';
import CalculationIcon from '@icons/calculation.svg';
import ChampionChallengerIcon from '@icons/champion-challenger.svg';
import DecisionTableIcon from '@icons/decision-table.svg';
import SubflowIcon from '@icons/subflow.svg';

export const TODAY = dayjs();

export const MUI_LICENSE_KEY = import.meta.env.VITE_MUI_LICENSE_KEY;
export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
export const IAM_SERVICE_URL = import.meta.env.VITE_IAM_SERVICE_URL;
export const LAUNCHER_URL = import.meta.env.VITE_LAUNCHER_URL;

export const FULL_DATE_TIME_FORMAT = 'MM/DD/YYYY hh:mm:ss A';

export const DATE_FORMAT = 'MM/DD/YYYY';

export const PRODUCTION_FLOW_ID = 'production-flow';

export const NO_TAG_LABEL = 'No tag';

export enum SNACK_TYPE {
  SUCCESS = 'success',
  ERROR = 'error'
}

export const GENERAL_SERVER_ERROR = 'Something went wrong';

export const NOT_FOUND = 'Not found';

export const ROUTER_BLOCKED_STATE = 'blocked';

export const KEY_CODES = {
  Dot: '.',
  Escape: 'Escape',
  Minus: '-'
};

export const RULES_LIMIT = 10;

export const SCOPES_LIST = {
  OFFLINE_ACCESS: 'offline_access',
  ROLES: 'roles'
};

export const GRANT_TYPES = {
  AUTH_CODE: 'authorization_code',
  REFRESH_TOKEN: 'refresh_token',
  PASSWORD: 'password',
  CLIENT_CREDENTIALS: 'client_credentials'
};

export const tooltipText = {
  cantUpdateFlow: "You don't have permission to update flow"
};

export const STEP_ICONS = {
  [StepType.START]: <FlagTriangleIcon color={theme.palette.primary.main} />,
  [StepType.END]: <FlagTriangleIcon color={theme.palette.error.main} />,
  [StepType.CHAMPION_CHALLENGER]: <ChampionChallengerIcon />,
  [StepType.CALCULATION]: <CalculationIcon />,
  [StepType.DECISION_TABLE]: <DecisionTableIcon />,
  [StepType.SUBFLOW]: <SubflowIcon />
};

export const BOOLEAN_OPTIONS = ['true', 'false'];
