import { useState } from 'react';
import { Box, Tabs, Typography } from '@mui/material';
import React from 'react';

import { palette } from '../../themeConfig';

import { StyledContainer, StyledTab } from './styled';
import List from './List';

import { DataDictionaryVariable } from '@domain/dataDictionary';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const tabLabels: { [key: string]: string } = {
  UserDefined: 'User Defined'
};

const AddVariable: React.FC<{
  data: { [key: string]: DataDictionaryVariable[] };
}> = ({ data }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <StyledContainer>
      <Typography pb={1.5} variant="body1" color={palette.gray}>
        Add Variable from
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {Object.keys(data).map((tabName, index) => (
            <StyledTab
              key={index}
              label={tabLabels[tabName]}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Box>
      {Object.keys(data).map((tabName, index) => (
        <CustomTabPanel key={index} value={value} index={index}>
          <List data={data[tabName]} />
        </CustomTabPanel>
      ))}
    </StyledContainer>
  );
};

export default AddVariable;
