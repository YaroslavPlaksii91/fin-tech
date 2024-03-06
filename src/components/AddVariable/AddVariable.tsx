import { useState } from 'react';
import { Box, Tabs, Typography } from '@mui/material';
import React from 'react';

import { palette } from '../../themeConfig';
import TabPanel from '../shared/Tabs/TabPanel';

import { StyledContainer, StyledTab } from './styled';
import List from './List';

import {
  DataDictionaryVariable,
  UserDefinedVariable
} from '@domain/dataDictionary';
import { DATA_DICTIONARY_LABELS } from '@constants/common';

type AddVariableType = {
  data: Record<string, DataDictionaryVariable[] | UserDefinedVariable[]>;
};

const AddVariable: React.FC<AddVariableType> = ({ data }) => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <StyledContainer>
      <Typography variant="body1" color={palette.gray}>
        Add Variable from
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="tabs">
          {Object.keys(data).map((tabName, index) => (
            <StyledTab
              key={index}
              label={DATA_DICTIONARY_LABELS[tabName]}
              id={`tab-${index}`}
              aria-controls={`tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>
      {Object.keys(data).map((tabName, index) => (
        <TabPanel key={index} value={value} index={index}>
          <List data={data[tabName]} />
        </TabPanel>
      ))}
    </StyledContainer>
  );
};

export default AddVariable;
