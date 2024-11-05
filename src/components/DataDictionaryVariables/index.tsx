import { useState, useMemo } from 'react';
import { Box, Stack, Typography, Button } from '@mui/material';
import * as _ from 'lodash-es';

import {
  TABS,
  SOURCES_DESCRIPTIONS,
  INITIAL_FILTERS,
  CRA_REPORTS_HEADERS,
  DEFAULT_HEADERS
} from './constants';
import TableList from './TableList/TableList';
import { TAB, TableHeader } from './types';
import Filters from './Filters';
import FlowSelect from './FlowSelect';
import { getFiltersGroup } from './utils';
import { VariableForm } from './VariableForm/VariableForm';
import { DeleteVariable } from './DeleteVariable/DeleteVariable';

import { AddIcon } from '@components/shared/Icons';
import { theme } from '@theme';
import { IFlow } from '@domain/flow';
import {
  VARIABLE_DATA_TYPE,
  DataDictionaryVariable,
  DATA_DICTIONARY_GROUP
} from '@domain/dataDictionary';
import { useHasUserPermission } from '@hooks/useHasUserPermission';
import { checkIsProductionFlow } from '@utils/helpers';
import { permissionsMap } from '@constants/permissions';
import { useAppSelector } from '@store/hooks';
import { selectDataDictionary } from '@store/dataDictionary/selectors';
import Tabs from '@components/shared/Tabs';
import TabPanel from '@components/shared/Tabs/TabPanel';
import FiltersButton from '@components/shared/Buttons/Filters';
import { useVariables } from '@hooks/useVariables';
import { typeSafeObjectEntries } from '@utils/object';
import useFilters from '@hooks/useFilters';

const DataDictionaryVariables = ({ flow }: { flow: IFlow }) => {
  const { enumDataTypes } = useAppSelector(selectDataDictionary);

  const hasUserPermission = useHasUserPermission(permissionsMap.canUpdateFlow);

  const { allVariables, integrationVariables, userDefinedVariables } =
    useVariables();

  const {
    isFiltersOpen,
    filters,
    handleFiltersOpen,
    handleFiltersClose,
    handleFiltersSubmit,
    handleFiltersReset
  } = useFilters(INITIAL_FILTERS);

  const [tab, setTab] = useState<TAB>('laPMSVariables');

  const [selectedVariable, setSelectedVariable] = useState<
    DataDictionaryVariable & {
      index: number;
      variableIsUsed: boolean;
    }
  >();
  const [isVariableModalOpen, setIsVariableModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isProductionFlow = checkIsProductionFlow();
  const isViewMode = isProductionFlow || !hasUserPermission;

  const tableData = useMemo(() => {
    if (tab === 'craReportVariables')
      return Object.values(integrationVariables).flat();

    if (tab === 'all')
      return [
        ...Object.values({ ...allVariables, ...integrationVariables }).flat()
      ];

    return allVariables[tab] || [];
  }, [tab, allVariables, integrationVariables]);

  const headers: TableHeader[] = useMemo(() => {
    if (tab === 'craReportVariables') {
      return CRA_REPORTS_HEADERS;
    }

    if (tab === 'userDefined') {
      const userDefinedHeaders = Object.values(
        _.omitBy(DEFAULT_HEADERS, { key: 'isRequired' })
      ) as TableHeader[];
      return userDefinedHeaders;
    }

    return DEFAULT_HEADERS;
  }, [tab]);

  const filterGroups = useMemo(
    () =>
      getFiltersGroup(enumDataTypes)
        .map((filter) =>
          tab === 'userDefined'
            ? { ...filter, fields: Object.values(VARIABLE_DATA_TYPE) }
            : filter
        )
        .filter(({ applyFor }) => applyFor.includes(tab)),
    [tab, enumDataTypes]
  );

  const filteredBySearch = useMemo(() => {
    const filterBySearch = filters.search.trim().toUpperCase();

    if (filterBySearch)
      return tableData.filter((tableEl) =>
        tableEl.name.toUpperCase().includes(filterBySearch)
      );

    return tableData;
  }, [tableData, filters.search]);

  const filteredBySelects = useMemo(() => {
    const filtersEntries = typeSafeObjectEntries(filters.selects);

    let filteredData = filteredBySearch;

    filtersEntries.forEach(([field, activeFilters]) => {
      if (
        !activeFilters.length ||
        !filterGroups.find(({ filterBy }) => filterBy === field)
      )
        return;

      filteredData = filteredData.filter((el) =>
        activeFilters.includes(el[field])
      );
    });

    return filteredData;
  }, [filteredBySearch, filters.selects]);

  const handleVariableModalClose = () => {
    setSelectedVariable(undefined);
    setIsVariableModalOpen(false);
  };

  const handleDeleteModalClose = () => {
    setSelectedVariable(undefined);
    setIsDeleteModalOpen(false);
  };

  const handleVariable = (
    row: DataDictionaryVariable,
    variableUsageStepIds: string[]
  ) => {
    const userDefinedVariablesGroup = userDefinedVariables[
      DATA_DICTIONARY_GROUP.userDefined
    ].filter(({ sourceType }) => sourceType === row.sourceType);

    const indexOfVariable = _.indexOf(
      _.map(userDefinedVariablesGroup, 'name'),
      row.name
    );

    setSelectedVariable({
      index: indexOfVariable,
      variableIsUsed: !!variableUsageStepIds.length,
      ...row
    });
  };

  const handleEditClick = (
    row: DataDictionaryVariable,
    variableUsageStepIds: string[]
  ) => {
    handleVariable(row, variableUsageStepIds);
    setIsVariableModalOpen(true);
  };

  const handleDeleteClick = (
    row: DataDictionaryVariable,
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
      <Tabs activeTab={tab} tabs={TABS} onChange={setTab} />
      {TABS.map(({ value }) => (
        <TabPanel key={value} value={tab} tabName={value}>
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
                {SOURCES_DESCRIPTIONS[value]}
              </Typography>
              <Stack direction="row" spacing={1}>
                <FiltersButton onClick={handleFiltersOpen} />
                {value === 'userDefined' && !isViewMode && (
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
              tabName={value}
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
        filterGroups={filterGroups}
        onReset={handleFiltersReset}
        onSubmit={handleFiltersSubmit}
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
