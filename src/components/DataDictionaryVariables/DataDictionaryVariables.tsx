import { useState } from 'react';
import { Box, Stack, Tabs, Typography } from '@mui/material';

import { StyledTab } from './styled';
import { VARIABLES_TABS, TABS_LABELS, SOURCES_DESCRIPTIONS } from './constants';
import TableList from './TableList/TableList';
import TabPanel from './Tabs/TabPanel';

import useDataDictionaryVariables from '@hooks/useDataDictionaryVariables';
import { IFlow } from '@domain/flow';

const DataDictionaryVariables = ({ flow }: { flow: IFlow }) => {
  const [tab, setTab] = useState(VARIABLES_TABS.laPMSVariables);

  const { variables } = useDataDictionaryVariables(flow);

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: VARIABLES_TABS
  ) => {
    setTab(newValue);
  };

  if (!variables) return null;

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
              label={TABS_LABELS[tabName]}
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
          <>
            <Typography variant="body2" color="gray" mt={2}>
              {SOURCES_DESCRIPTIONS[tabName]}
            </Typography>
            <TableList
              tableData={variables[tabName]}
              tabName={tabName as VARIABLES_TABS}
              flowNodes={flow.nodes}
            />
          </>
        </TabPanel>
      ))}
      {tab === VARIABLES_TABS.all && (
        <TabPanel key="all" value={tab} tabName="all">
          <TableList
            tableData={[
              ...variables['userDefined'],
              ...variables['laPMSVariables']
            ]}
            tabName={tab as VARIABLES_TABS}
            flowNodes={flow.nodes}
          />
        </TabPanel>
      )}
    </Stack>
  );
};

export default DataDictionaryVariables;
