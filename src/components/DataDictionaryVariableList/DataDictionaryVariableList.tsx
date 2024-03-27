import { useState, useEffect } from 'react';
import { Box, Stack, Tabs, Typography } from '@mui/material';

import { StyledTab } from './styled';
import { VARIABLES_TABS } from './constants';
import TableList from './TableList/TableList';
import TabPanel from './Tabs/TabPanel';

import useDataDictionaryVariables from '@hooks/useDataDictionaryVariables';
import { IFlow } from '@domain/flow';
import {
  DataDictionaryVariable,
  UserDefinedVariable
} from '@domain/dataDictionary';

const tabLabels: { [key: string]: string } = {
  laPMSVariables: 'LaPMS (Input)',
  userDefined: 'User Defined'
};

const DataDictionaryVariableList = ({ flow }: { flow: IFlow }) => {
  const [tab, setTab] = useState(VARIABLES_TABS.laPMSVariables);
  const [tableList, setTableList] = useState<
    | DataDictionaryVariable[]
    | Pick<
        UserDefinedVariable,
        'name' | 'dataType' | 'defaultValue' | 'description' | 'sourceType'
      >[]
  >([]);

  const { variables } = useDataDictionaryVariables(flow);

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: VARIABLES_TABS
  ) => {
    setTab(newValue);
    variables && setTableList(variables[newValue]);
  };

  useEffect(() => {
    if (variables) {
      setTableList(variables[tab]);
    }
  }, [variables]);

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
            tableList={tableList}
            setTableList={setTableList}
            tabName={tabName as VARIABLES_TABS}
            flowNodes={flow.nodes}
          />
        </TabPanel>
      ))}
      {tab === VARIABLES_TABS.all && (
        <TabPanel key="all" value={tab} tabName="all">
          <TableList
            tableList={[
              ...variables['userDefined'],
              ...variables['laPMSVariables']
            ]}
            tabName={tab as VARIABLES_TABS}
            flowNodes={flow.nodes}
            setTableList={setTableList}
          />
        </TabPanel>
      )}
    </Stack>
  );
};

export default DataDictionaryVariableList;
