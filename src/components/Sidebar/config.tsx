import DotIcon from '@icons/dot.svg';
import { permissionsMap } from '@constants/permissions';
import { theme } from '@theme';
import routes from '@constants/routes';
import { PRODUCTION_FLOW_ID } from '@constants/common';
import ChangesHistoryIcon from '@icons/changes-history.svg';
import DataDictionaryIcon from '@icons/data-dictionary.svg';

const iconSize = 24;

export const itemIconProps = {
  color: theme.palette.primary.dark,
  height: iconSize,
  width: iconSize
};

const DotActiveIcon = (
  <DotIcon
    height={iconSize}
    width={iconSize}
    color={theme.palette.action.active}
  />
);

export const animationStyles = (expanded: boolean) => ({
  opacity: expanded ? 1 : 0,
  overflow: 'hidden',
  whiteSpace: 'nowrap'
});

export const DEFAULT_SIDEBAR_WIDTH = 256;
export const MIN_SIDEBAR_WIDTH = 48;
export const EXPANDED_FLOW_LIST_KEY = 'expandedFlowList';
export const EXPANDED_REPORTS_KEY = 'expandedReports';

export interface MenuItem {
  icon: React.ReactElement;
  text: string;
  to: string;
  permission: string;
}

export const applicationsPage = {
  icon: <DataDictionaryIcon />,
  text: 'Applications',
  to: routes.underwriting.leadRequest,
  permission: permissionsMap.canViewLeadRequestReport
};

export const pages = [
  {
    icon: <DataDictionaryIcon />,
    text: 'Data Dictionary',
    to: routes.underwriting.flow.dataDictionary(PRODUCTION_FLOW_ID),
    permission: permissionsMap.canViewFlow
  },
  {
    icon: <ChangesHistoryIcon />,
    text: 'Changes History',
    to: routes.underwriting.changeHistory,
    permission: permissionsMap.canViewChangeHistory
  }
];

export const reportPages = [
  {
    icon: DotActiveIcon,
    text: 'Denial Reasons',
    to: routes.underwriting.denialReasons,
    permission: permissionsMap.canViewDenialReasonReport
  },
  {
    icon: DotActiveIcon,
    text: 'Waterfall',
    to: routes.underwriting.waterfall,
    permission: permissionsMap.canViewWaterfallReport
  },
  {
    icon: DotActiveIcon,
    text: 'Billing Report',
    to: routes.underwriting.billingReport,
    permission: permissionsMap.canViewBillingReport
  }
];
