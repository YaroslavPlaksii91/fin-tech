import { useState, useContext } from 'react';

import { Box, Tabs, Typography } from '@mui/material';

import { palette } from '../../themeConfig';
import TabPanel from '../shared/Tabs/TabPanel';

import { StyledContainer, StyledTab } from './styled';
import TableList from './TableList';

import { DataDictionaryContext } from '@contexts/DataDictionaryContext';

import {
  DataDictionaryVariable,
  UserDefinedVariable
} from '@domain/dataDictionary';

const tabLabels: { [key: string]: string } = {
  userDefined: 'User Defined',
  laPMSVariables: 'Lead and Provider Management System'
};

const AddVariable = () => {
  const [tab, setTab] = useState(0);

  const value = useContext(DataDictionaryContext);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <StyledContainer>
      <Typography variant="h1">Data Dictionary</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={handleChange} aria-label="tabs">
          {value?.variables &&
            Object.keys(value.variables).map((tabName, index) => (
              <StyledTab
                key={index}
                label={tabLabels[tabName]}
                id={`tab-${index}`}
                aria-controls={`tabpanel-${index}`}
              />
            ))}
        </Tabs>
      </Box>
      {value?.variables &&
        Object.keys(value.variables).map((tabName, index) => (
          <TabPanel key={index} value={tab} index={index}>
            {/* <TableList data={value.variables[tabName]} /> */}
          </TabPanel>
        ))}
    </StyledContainer>
  );
};

export default AddVariable;
