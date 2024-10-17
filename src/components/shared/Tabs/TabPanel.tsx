import { Box } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  tabName: string;
  value: string;
}

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  tabName,
  ...props
}) => (
  <div
    role="tabpanel"
    hidden={value !== tabName}
    id={`tabpanel-${tabName}`}
    aria-labelledby={`tab-${tabName}`}
    {...props}
  >
    {value === tabName && <Box>{children}</Box>}
  </div>
);

export default TabPanel;
