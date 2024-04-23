import { useState } from 'react';
import {
  Box,
  Stack,
  Tabs,
  Typography,
  Drawer,
  Button,
  Checkbox,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { StyledTab } from './styled';
import { VARIABLES_TABS, TABS_LABELS, SOURCES_DESCRIPTIONS } from './constants';
import TableList from './TableList/TableList';
import TabPanel from './Tabs/TabPanel';

import useDataDictionaryVariables from '@hooks/useDataDictionaryVariables';
import { IFlow } from '@domain/flow';
import { DATA_TYPE_WITHOUT_ENUM } from '@domain/dataDictionary';
import Logger from '@utils/logger.ts';

const DataDictionaryVariables = ({ flow }: { flow: IFlow }) => {
  const [tab, setTab] = useState(VARIABLES_TABS.laPMSVariables);

  // const filters = useState<{ variableTypes: []; dataTypes: [] }>({
  //   variableTypes: [],
  //   dataTypes: []
  // });
  const [query, setQuery] = useState<string>('');
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

  const { variables } = useDataDictionaryVariables(flow);

  Logger.log(Object.values(DATA_TYPE_WITHOUT_ENUM));

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
            <Button
              size="small"
              color="inherit"
              variant="outlined"
              startIcon={<TuneIcon sx={{ transform: 'rotate(180deg)' }} />}
              onClick={() => setIsFiltersOpen((prev) => !prev)}
            >
              Filters
            </Button>
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
      <Drawer
        anchor="right"
        open={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      >
        <Box sx={{ width: '384px', padding: '8px' }}>
          <Stack spacing={1} alignItems="center" sx={{ padding: '8px 16px' }}>
            <Stack spacing={1} direction="row" alignItems="center" width="100%">
              <ChevronRightIcon sx={{ fontSize: '32px' }} />
              <Typography variant="h4">Filters</Typography>
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'flex-end',
                  gap: '8px'
                }}
              >
                <Button
                  size="small"
                  color="success"
                  variant="contained"
                  onClick={() => null}
                >
                  Apply
                </Button>
                <Button
                  size="small"
                  color="inherit"
                  variant="outlined"
                  onClick={() => null}
                >
                  Reset
                </Button>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" width="100%">
              <TextField
                fullWidth
                placeholder="Search by Keyword"
                size="small"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </Stack>
            <Stack alignItems="center" width="100%">
              <Accordion disableGutters sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="body1">By Variable Type</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox name="check1" />}
                      label="Label"
                    />
                    <FormControlLabel
                      control={<Checkbox name="check2" />}
                      label="Required"
                    />
                    <FormControlLabel
                      control={<Checkbox name="check3" />}
                      label="Disabled"
                    />
                  </FormGroup>
                </AccordionDetails>
              </Accordion>
              <Accordion disableGutters sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="body1">By Data Type</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormGroup>
                    {Object.values(DATA_TYPE_WITHOUT_ENUM).map((type) => (
                      <FormControlLabel
                        key={type}
                        control={<Checkbox name={type} />}
                        label={type}
                      />
                    ))}
                  </FormGroup>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </Stack>
        </Box>
      </Drawer>
    </Stack>
  );
};

export default DataDictionaryVariables;
