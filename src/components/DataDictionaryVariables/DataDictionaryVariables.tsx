import { useState, useMemo } from 'react';
import { Box, Stack, Tabs, Typography, Button } from '@mui/material';
import { omitBy, indexOf, map } from 'lodash';

import {
  TABS,
  TABS_LABELS,
  SOURCES_DESCRIPTIONS,
  INITIAL_FILTERS,
  CRA_REPORTS_HEADERS,
  DEFAULT_HEADERS,
  TableHeader
} from './constants';
import TableList from './TableList/TableList';
import TabPanel from './Tabs/TabPanel';
import { StyledTab } from './styled';
import { TAB } from './types';
import Filters, { IFormState } from './Filters';
import FlowSelect from './FlowSelect';
import { getFiltersGroup } from './utils';
import { VariableForm } from './VariableForm/VariableForm';
import { DeleteVariable } from './DeleteVariable/DeleteVariable';

import { AddIcon } from '@components/shared/Icons';
import TuneIcon from '@icons/tune.svg';
import { theme } from '@theme';
import { IFlow } from '@domain/flow';
import {
  DATA_TYPE_WITHOUT_ENUM,
  Variable,
  UserDefinedVariable,
  VARIABLE_SOURCE_TYPE
} from '@domain/dataDictionary';
import useDataDictionaryVariables from '@hooks/useDataDictionaryVariables';
import { useHasUserPermission } from '@hooks/useHasUserPermission';
import { checkIsProductionFlow } from '@utils/helpers';
import { permissionsMap } from '@constants/permissions';
import { useAppSelector } from '@store/hooks';
import { selectFlow } from '@store/flow/selectors';

const DataDictionaryVariables = ({ flow }: { flow: IFlow }) => {
  const [tab, setTab] = useState<TAB>('laPMSVariables');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [selectedVariable, setSelectedVariable] = useState<
    UserDefinedVariable & {
      index: number;
      variableIsUsed: boolean;
    }
  >();
  const [isVariableModalOpen, setIsVariableModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    flow: { temporaryVariables, permanentVariables }
  } = useAppSelector(selectFlow);
  const hasUserPermission = useHasUserPermission(permissionsMap.canUpdateFlow);
  const isProductionFlow = checkIsProductionFlow();
  const isViewMode = isProductionFlow || !hasUserPermission;

  const handleFiltersOpen = () => setIsFiltersOpen(true);

  const handleFiltersClose = () => setIsFiltersOpen(false);

  const handleFiltersReset = () => {
    setFilters(INITIAL_FILTERS);
    setSearch('');
    handleFiltersClose();
  };

  const handleSubmit = (data: IFormState) => {
    setFilters(data.filters);
    setSearch(data.search);

    handleFiltersClose();
  };

  const { variables, integrationVariables, enumsDataTypes } =
    useDataDictionaryVariables(flow);

  const tableData = useMemo(() => {
    if (!variables) return [];

    if (tab === 'craReportVariables') {
      return Object.values(integrationVariables).flat();
    }
    if (tab === 'all') {
      return [
        ...Object.values(variables).flat(),
        ...Object.values(integrationVariables).flat()
      ];
    }

    return variables[tab];
  }, [tab, variables, integrationVariables]);

  const headers: TableHeader[] = useMemo(() => {
    if (tab === 'craReportVariables') {
      return CRA_REPORTS_HEADERS;
    }

    if (tab === 'userDefined') {
      const userDefinedHeaders = Object.values(
        omitBy(DEFAULT_HEADERS, { key: 'isRequired' })
      ) as TableHeader[];
      return userDefinedHeaders;
    }

    return DEFAULT_HEADERS;
  }, [tab]);

  const filterGroups = useMemo(
    () =>
      getFiltersGroup(enumsDataTypes)
        .map((filter) =>
          tab === 'userDefined'
            ? { ...filter, fields: Object.values(DATA_TYPE_WITHOUT_ENUM) }
            : filter
        )
        .filter(({ applyFor }) => applyFor.includes(tab)),
    [tab, enumsDataTypes]
  );

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
      keyof Variable,
      string[]
    ][];

    let filteredData = filteredBySearch;

    filtersEntries.forEach(([field, activeFilters]) => {
      if (
        !activeFilters.length ||
        !filterGroups.find(({ filterBy }) => filterBy === field)
      )
        return;

      filteredData = filteredData.filter((el) =>
        activeFilters.includes(el[field] as string)
      );
    });

    return filteredData;
  }, [filteredBySearch, filters]);

  const handleChange = (_event: React.SyntheticEvent, newValue: TAB) => {
    setTab(newValue);
  };

  if (!variables) return null;

  const handleVariableModalClose = () => {
    setSelectedVariable(undefined);
    setIsVariableModalOpen(false);
  };

  const handleDeleteModalClose = () => {
    setSelectedVariable(undefined);
    setIsDeleteModalOpen(false);
  };

  const handleVariable = (
    row: UserDefinedVariable,
    variableUsageStepIds: string[]
  ) => {
    let variables;

    switch (row.sourceType) {
      case VARIABLE_SOURCE_TYPE.PermanentVariable: {
        variables = permanentVariables;
        break;
      }
      case VARIABLE_SOURCE_TYPE.TemporaryVariable: {
        variables = temporaryVariables;
        break;
      }
    }

    const indexOfVariable = indexOf(map(variables, 'name'), row.name);

    setSelectedVariable({
      index: indexOfVariable,
      variableIsUsed: !!variableUsageStepIds.length,
      ...row
    });
  };

  const handleEditClick = (
    row: UserDefinedVariable,
    variableUsageStepIds: string[]
  ) => {
    handleVariable(row, variableUsageStepIds);
    setIsVariableModalOpen(true);
  };

  const handleDeleteClick = (
    row: UserDefinedVariable,
    variableUsageStepIds: string[]
  ) => {
    handleVariable(row, variableUsageStepIds);
    setIsDeleteModalOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedVariable(undefined);
    setIsVariableModalOpen(true);
  };

  return (
    <Stack>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography
          variant="h4"
          pt={1}
          pb={1}
          color={theme.palette.text.primary}
        >
          Data Dictionary
        </Typography>
        <FlowSelect />
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tab}
          onChange={handleChange}
          aria-label="tabs"
          variant="scrollable"
        >
          {Object.keys(TABS).map((tabName, index) => (
            <StyledTab
              key={index}
              label={TABS_LABELS[tabName]}
              value={tabName}
              id={`tab-${index}`}
              aria-controls={`tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>
      {Object.keys(TABS).map((tabName) => (
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
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  color="inherit"
                  variant="outlined"
                  sx={{ minWidth: '80px', borderRadius: '6px' }}
                  startIcon={<TuneIcon />}
                  onClick={handleFiltersOpen}
                >
                  Filters
                </Button>
                {tabName === 'userDefined' && !isViewMode && (
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ minWidth: '140px', borderRadius: '6px' }}
                    startIcon={<AddIcon />}
                    onClick={handleCreateClick}
                  >
                    Create Variable
                  </Button>
                )}
              </Stack>
            </Stack>
            <TableList
              headers={headers}
              tableData={filteredBySelects}
              tabName={tabName as TAB}
              flowNodes={flow.nodes}
              flowId={flow.id}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </>
        </TabPanel>
      ))}
      <Filters
        isOpen={isFiltersOpen}
        filters={filters}
        search={search}
        filterGroups={filterGroups}
        onReset={handleFiltersReset}
        onSubmit={handleSubmit}
        onClose={handleFiltersClose}
      />
      {isVariableModalOpen && (
        <VariableForm
          flowId={flow.id}
          formData={selectedVariable}
          isOpen={isVariableModalOpen}
          onClose={handleVariableModalClose}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteVariable
          flowId={flow.id}
          variable={selectedVariable!}
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteModalClose}
        />
      )}
    </Stack>
  );
};

export default DataDictionaryVariables;
