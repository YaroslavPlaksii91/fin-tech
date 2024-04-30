import { useState, useMemo } from 'react';
import { Box, Stack, Tabs, Typography, Button } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';

import { IFilters } from './Filters/types';
import { INITIAL_FILTERS } from './Filters/constants';
import { StyledTab } from './styled';
import { VARIABLES_TABS, TABS_LABELS, SOURCES_DESCRIPTIONS } from './constants';
import TableList from './TableList/TableList';
import TabPanel from './Tabs/TabPanel';
import Filters from './Filters/Filters';

import useDataDictionaryVariables from '@hooks/useDataDictionaryVariables';
import { IFlow } from '@domain/flow';

const DataDictionaryVariables = ({ flow }: { flow: IFlow }) => {
  const [tab, setTab] = useState(VARIABLES_TABS.laPMSVariables);
  const [filters, setFilters] = useState<IFilters>(INITIAL_FILTERS);
  const [search, setSearch] = useState<string>('');
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

  const { variables } = useDataDictionaryVariables(flow);

  const tableData = useMemo(() => {
    if (!variables) return [];
    if (tab === VARIABLES_TABS.all)
      return [...variables['userDefined'], ...variables['laPMSVariables']];

    return variables[tab];
  }, [tab, variables]);

  const filteredBySearch = useMemo(() => {
    const filterBySearch = search.trim().toUpperCase();
    if (filterBySearch)
      return tableData.filter((tableEl) =>
        tableEl.name.toUpperCase().includes(filterBySearch)
      );

    return tableData;
  }, [tableData, search]);

  const filteredBySelects = useMemo(() => {
    const filtersEntries = Object.entries(filters) as [
      keyof IFilters,
      string[]
    ][];

    let filteredData = filteredBySearch;

    filtersEntries.forEach(([field, activeFilters]) => {
      if (!activeFilters.length) return;

      filteredData = filteredData.filter((el) =>
        activeFilters.includes(el[field])
      );
    });

    return filteredData;
  }, [filteredBySearch, filters]);

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: VARIABLES_TABS
  ) => {
    setTab(newValue);
  };
  const handleFiltersClose = () => setIsFiltersOpen(false);
  const handleFiltersOpen = () => setIsFiltersOpen(true);

  const handleFiltersReset = () => {
    setSearch('');
    setFilters(INITIAL_FILTERS);
  };

  const handleFiltersApply = ({
    search,
    filters
  }: {
    search: string;
    filters: IFilters;
  }) => {
    setSearch(search);
    setFilters(filters);
    handleFiltersClose();
  };

  if (!variables) return null;

  return (
    <Stack>
      <Typography variant="h3" pb={3}>
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
            <Stack
              alignItems="flex-start"
              justifyContent="space-between"
              direction="row"
              width="100%"
              mt={2}
              spacing={4}
            >
              <Typography variant="body1" color="gray">
                {SOURCES_DESCRIPTIONS[tabName]}
              </Typography>
              <Button
                size="small"
                color="inherit"
                variant="outlined"
                startIcon={<TuneIcon sx={{ transform: 'rotate(180deg)' }} />}
                onClick={handleFiltersOpen}
              >
                Filters
              </Button>
            </Stack>
            <TableList
              tableData={filteredBySelects}
              tabName={tabName as VARIABLES_TABS}
              flowNodes={flow.nodes}
            />
          </>
        </TabPanel>
      ))}
      {tab === VARIABLES_TABS.all && (
        <TabPanel key="all" value={tab} tabName="all">
          <Stack alignItems="flex-end" mt={2}>
            <Button
              size="small"
              color="inherit"
              variant="outlined"
              startIcon={<TuneIcon sx={{ transform: 'rotate(180deg)' }} />}
              onClick={handleFiltersOpen}
            >
              Filters
            </Button>
          </Stack>

          <TableList
            tableData={filteredBySelects}
            tabName={tab as VARIABLES_TABS}
            flowNodes={flow.nodes}
          />
        </TabPanel>
      )}
      <Filters
        isFiltersOpen={isFiltersOpen}
        filters={filters}
        search={search}
        handleReset={handleFiltersReset}
        handleApply={handleFiltersApply}
        handleClose={handleFiltersClose}
      />
    </Stack>
  );
};

export default DataDictionaryVariables;
