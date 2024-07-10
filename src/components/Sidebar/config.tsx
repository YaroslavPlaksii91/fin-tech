import DotIcon from '@icons/dot.svg';
import TimePastIcon from '@icons/timePast.svg';
import { permissionsMap } from '@constants/permissions';
import { theme } from '@theme';
import routes from '@constants/routes';

export const itemIconProps = {
  color: theme.palette.primary.dark,
  height: 24,
  width: 24
};

export const animationStyles = (expanded: boolean) => ({
  opacity: expanded ? 1 : 0,
  overflow: 'hidden',
  whiteSpace: 'nowrap'
});

export const DEFAULT_SIDEBAR_WIDTH = 256;
export const MIN_SIDEBAR_WIDTH = 48;

export interface MenuItem {
  icon: React.ReactElement;
  text: string;
  to: string;
  permission: string;
}

export const pages = [
  {
    icon: <TimePastIcon {...itemIconProps} />,
    text: 'Changes History',
    to: routes.underwriting.changeHistory,
    permission: permissionsMap.canViewChangeHistory
  }
];

export const reportPages = [
  {
    icon: <DotIcon {...itemIconProps} />,
    text: 'Lead Requests',
    to: routes.underwriting.leadRequest,
    permission: permissionsMap.canViewLeadRequestReport
  },
  {
    icon: <DotIcon {...itemIconProps} />,
    text: 'Denial Reasons',
    to: routes.underwriting.denialReasons,
    permission: permissionsMap.canViewDenialReasonReport
  }
];
