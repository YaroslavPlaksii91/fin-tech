import { useState } from 'react';
import { Box, Stack, Tabs, Typography } from '@mui/material';

import { StyledTab } from './styled';
import { VARIABLES_TABS } from './constants';
import TableList from './TableList/TableList';
import TabPanel from './Tabs/TabPanel';

import {
  DataDictionaryVariable,
  UserDefinedVariable
} from '@domain/dataDictionary';

const tabLabels: { [key: string]: string } = {
  laPMSVariables: 'LaPMS (Input)',
  userDefined: 'User Defined'
};

const DataDictionaryVariableList = ({
  variables
}: {
  variables: Record<string, DataDictionaryVariable[] | UserDefinedVariable[]>;
}) => {
  const [tab, setTab] = useState('laPMSVariables');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  return (
    <Stack>
      <Typography variant="h1" pb={3}>
        Data Dictionary
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={handleChange} aria-label="tabs">
          {Object.keys(variables).map((tabName, index) => (
            <StyledTab
              key={index}
              label={tabLabels[tabName]}
              value={tabName}
              id={`tab-${index}`}
              aria-controls={`tabpanel-${index}`}
            />
          ))}
          <StyledTab
            key="all"
            label="All"
            value="all"
            id="tab-all"
            aria-controls="tabpanel-all"
          />
        </Tabs>
      </Box>
      {Object.keys(variables).map((tabName) => (
        <TabPanel key={tabName} value={tab} tabName={tabName}>
          <TableList
            data={variables[tabName]}
            tabName={tabName as VARIABLES_TABS}
          />
        </TabPanel>
      ))}
    </Stack>
  );
};

export default DataDictionaryVariableList;
