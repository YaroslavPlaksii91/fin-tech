import { useState, useMemo } from 'react';
import { Box, Stack, Tabs, Typography, Button } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { omitBy } from 'lodash';

import {
  VARIABLES_TABS,
  TABS_LABELS,
  SOURCES_DESCRIPTIONS,
  FILTER_GROUPS,
  INITIAL_FILTERS,
  INITIAL_INPUT_FILTERS,
  INPUT_GROUPS,
  CRA_REPORTS_HEADERS,
  DEFAULT_HEADERS,
  TableHeader
} from './constants';
import TableList from './TableList/TableList';
import TabPanel from './Tabs/TabPanel';
import { StyledTab } from './styled';

import Filters from '@components/Filters/Filters';
import { theme } from '@theme';
import { IFlow } from '@domain/flow';
import { DATA_TYPE_WITHOUT_ENUM, Variable } from '@domain/dataDictionary';
import useDataDictionaryVariables from '@hooks/useDataDictionaryVariables';
import useFilters from '@hooks/useFilters';

const DataDictionaryVariables = ({ flow }: { flow: IFlow }) => {
  const [tab, setTab] = useState(VARIABLES_TABS.laPMSVariables);

  const {
    isFiltersOpen,
    handleFiltersOpen,
    handleFiltersClose,
    handleFiltersReset,
    handleFiltersApply,
    filters,
    inputFilters
  } = useFilters({
    initialFilters: INITIAL_FILTERS,
    initialInputFilters: INITIAL_INPUT_FILTERS
  });

  const { variables } = useDataDictionaryVariables(flow);

  const tableData = useMemo(() => {
    if (!variables) return [];
    if (tab === VARIABLES_TABS.all)
      return [
        ...variables['userDefined'],
        ...variables['laPMSVariables'],
        ...variables['craReportVariables']
      ];

    return variables[tab];
  }, [tab, variables]);

  const headers: TableHeader[] = useMemo(() => {
    if (tab === VARIABLES_TABS.craReportVariables) {
      return CRA_REPORTS_HEADERS;
    }

    if (tab === VARIABLES_TABS.userDefined) {
      const userDefinedHeaders = Object.values(
        omitBy(DEFAULT_HEADERS, { key: 'isRequired' })
      ) as TableHeader[];
      return userDefinedHeaders;
    }

    return DEFAULT_HEADERS;
  }, [tab]);

  const filterGroupsToShow = useMemo(
    () =>
      FILTER_GROUPS.map((filter) =>
        tab === VARIABLES_TABS.userDefined
          ? { ...filter, fields: Object.values(DATA_TYPE_WITHOUT_ENUM) }
          : filter
      ).filter(({ applyFor }) => applyFor.includes(tab)),
    [tab]
  );

  const filteredBySearch = useMemo(() => {
    const filterBySearch = inputFilters.search.trim().toUpperCase();

    if (filterBySearch)
      return tableData.filter((tableEl) =>
        tableEl.name.toUpperCase().includes(filterBySearch)
      );

    return tableData;
  }, [tableData, inputFilters]);

  const filteredBySelects = useMemo(() => {
    const filtersEntries = Object.entries(filters) as [
      keyof Variable,
      string[]
    ][];

    let filteredData = filteredBySearch;

    filtersEntries.forEach(([field, activeFilters]) => {
      if (
        !activeFilters.length ||
        !filterGroupsToShow.find(({ filterBy }) => filterBy === field)
      )
        return;

      filteredData = filteredData.filter((el) =>
        activeFilters.includes(el[field] as string)
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

  if (!variables) return null;

  return (
    <Stack>
      <Typography variant="h4" pt={1} pb={1} color={theme.palette.text.primary}>
        Data Dictionary
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tab}
          onChange={handleChange}
          aria-label="tabs"
          variant="scrollable"
        >
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
              my={2}
              spacing={4}
            >
              <Typography variant="body1" color="gray">
                {SOURCES_DESCRIPTIONS[tabName]}
              </Typography>
              <Button
                size="small"
                color="inherit"
                variant="outlined"
                sx={{ minWidth: '80px', borderRadius: '6px' }}
                startIcon={<TuneIcon sx={{ transform: 'rotate(180deg)' }} />}
                onClick={handleFiltersOpen}
              >
                Filters
              </Button>
            </Stack>
            <TableList
              headers={headers}
              tableData={filteredBySelects}
              tabName={tabName as VARIABLES_TABS}
              flowNodes={flow.nodes}
              flowId={flow.id}
            />
          </>
        </TabPanel>
      ))}
      {tab === VARIABLES_TABS.all && (
        <TabPanel key="all" value={tab} tabName="all">
          <Stack alignItems="flex-end" my={2}>
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
            headers={headers}
            tableData={filteredBySelects}
            tabName={tab as VARIABLES_TABS}
            flowNodes={flow.nodes}
            flowId={flow.id}
          />
        </TabPanel>
      )}
      <Filters
        isOpen={isFiltersOpen}
        filters={filters}
        inputFilters={inputFilters}
        inputGroupsToshow={INPUT_GROUPS}
        filterGroupsToShow={filterGroupsToShow}
        handleReset={handleFiltersReset}
        handleApply={handleFiltersApply}
        handleClose={handleFiltersClose}
      />
    </Stack>
  );
};

export default DataDictionaryVariables;
