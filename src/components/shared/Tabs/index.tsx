import { Tabs as MuiTabs, Tab, TabsProps as MuiTabsProps } from '@mui/material';
import { SyntheticEvent } from 'react';

interface TabsProps<T> extends Omit<MuiTabsProps, 'onChange'> {
  tabs: { value: T; label: string }[];
  activeTab?: T;
  onChange: (value: T, event: SyntheticEvent) => void;
}

const Tabs = <T,>({
  tabs,
  activeTab,
  onChange,
  sx,
  ...props
}: TabsProps<T>) => (
  <>
    <MuiTabs
      value={activeTab || false} // Set value to false to avoid warnings in console
      onChange={(event: SyntheticEvent, value: T) => onChange(value, event)} // Reverse params place to avoid providing event every time
      aria-label="tabs"
      variant="scrollable"
      scrollButtons={false}
      sx={{ borderBottom: 1, borderColor: 'divider', ...sx }}
      {...props}
    >
      {tabs.map(({ value, label }) => (
        <Tab
          sx={{ textTransform: 'none', padding: '9px 16px' }}
          key={String(value)}
          label={label}
          value={value}
          id={`tab-${String(value)}`}
          aria-controls={`tabpanel-${String(value)}`}
        />
      ))}
    </MuiTabs>
  </>
);

export default Tabs;
