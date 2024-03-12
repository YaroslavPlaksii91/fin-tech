import { useState } from 'react';
import { Box, Stack, Tabs, Typography } from '@mui/material';

import TabPanel from '../shared/Tabs/TabPanel';

import { StyledTab } from './styled';
import TableList from './TableList';

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
  const [tab, setTab] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
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
              id={`tab-${index}`}
              aria-controls={`tabpanel-${index}`}
            />
          ))}
          <StyledTab
            key="all-variables"
            label="All"
            id="tab-all"
            aria-controls="tabpanel-all"
          />
        </Tabs>
      </Box>
      {Object.keys(variables).map((tabName, index) => (
        <TabPanel key={tabName} value={tab} index={index}>
          <TableList data={variables[tabName]} />
        </TabPanel>
      ))}
    </Stack>
  );
};

export default DataDictionaryVariableList;
