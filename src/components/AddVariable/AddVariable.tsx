import { useState } from 'react';
import {
  Box,
  IconButton,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

import { palette } from '../../themeConfig';

import { StyledContainer, StyledList } from './styled';

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

function generate(element: React.ReactElement) {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) =>
    React.cloneElement(element, {
      key: value
    })
  );
}

export default function AddVariable() {
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
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <StyledList>
          {generate(
            <ListItem
              secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary="Single-line item" />
            </ListItem>
          )}
        </StyledList>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <StyledList>
          {generate(
            <ListItem
              secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary="Single-line item" />
            </ListItem>
          )}
        </StyledList>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <StyledList>
          {generate(
            <ListItem
              secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary="Single-line item" />
            </ListItem>
          )}
        </StyledList>
      </CustomTabPanel>
    </StyledContainer>
  );
}
