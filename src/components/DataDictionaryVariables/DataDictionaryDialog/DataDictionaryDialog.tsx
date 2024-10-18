import React, { useEffect, useMemo } from 'react';
import {
  Box,
  Dialog,
  Divider,
  Grid,
  ListItemText,
  TextField
} from '@mui/material';
import { startCase } from 'lodash';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import { StyledListItemButton } from './styled';
import List from './List';

import { palette } from '@theme';
import { highlightText } from '@utils/text';
import LoadingButton from '@components/shared/LoadingButton';
import {
  CRA_REPORT_VARIABLES,
  VARIABLE_DATA_TYPE,
  Variable,
  DataDictionaryVariables
} from '@domain/dataDictionary';

const objectVariableTypes = [
  VARIABLE_DATA_TYPE['Object:CraClarity'],
  VARIABLE_DATA_TYPE['Object:CraFactorTrust']
];

const objectVariablesDataSourceMap: Record<string, string> = {
  [VARIABLE_DATA_TYPE['Object:CraClarity']]:
    CRA_REPORT_VARIABLES.craClarityReportVariables,
  [VARIABLE_DATA_TYPE['Object:CraFactorTrust']]:
    CRA_REPORT_VARIABLES.craFactorTrustReportVariables
};

const DataDictionaryDialog: React.FC<DataDictionaryDialogProps> = ({
  title = 'Add Input Variable',
  showAttributes = true,
  data,
  integrationData,
  isOpen,
  onClose,
  onConfirm,
  setSelectedObjectPropertyFunction
}) => {
  const [query, setQuery] = React.useState<string>('');
  const [selectedDict, setSelectedDict] = React.useState<null | string>(null);
  const [selectedVar, setSelectedVar] = React.useState<null | Variable>(null);
  const [selectedObjectProperty, setSelectedObjectProperty] =
    React.useState<null | Variable>(null);

  useEffect(() => {
    setSelectedVar(null);
    setSelectedObjectProperty(null);
  }, [query]);

  useEffect(() => {
    setSelectedObjectProperty(null);
  }, [selectedDict, selectedVar]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedDict(null);
      setSelectedVar(null);
      setSelectedObjectProperty(null);
    }
  }, [isOpen]);

  const filteredData = useMemo(
    () =>
      data
        ? Object.keys(data).reduce<DataDictionaryVariables>((acc, curr) => {
            const filteredVariables = data[curr].filter((i) => {
              const nameContainsQuery = i.name
                .toLowerCase()
                .includes(query.toLowerCase());

              if (objectVariableTypes.includes(i.dataType)) {
                const relatedIntegratedDataList =
                  integrationData?.[objectVariablesDataSourceMap[i.dataType]] ||
                  [];

                return (
                  nameContainsQuery ||
                  relatedIntegratedDataList.some((property) =>
                    property.name.toLowerCase().includes(query.toLowerCase())
                  )
                );
              }

              return nameContainsQuery;
            });

            if (filteredVariables.length > 0) {
              return {
                ...acc,
                [curr]: filteredVariables
              };
            }

            return acc;
          }, {})
        : {},
    [data, integrationData, query]
  );

  const filteredIntegrationDataList = useMemo(() => {
    const integrationDataList =
      integrationData?.[
        objectVariablesDataSourceMap[
          selectedVar?.dataType as VARIABLE_DATA_TYPE
        ]
      ];

    if (!integrationDataList) {
      return [];
    }

    if (!query) {
      return integrationDataList;
    }

    return integrationDataList.filter((property) =>
      property.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [integrationData, selectedVar, query]);

  const dictsEmptyState = Object.keys(filteredData).length === 0;
  const variablesEmptyState = !selectedDict || !filteredData[selectedDict];

  // Need to set user-defined variables with data types Object:CraClarity and Object:CraFactorTrust without attributes for saving the result of the GET REPORT function
  const selectVarIsObjectType =
    showAttributes &&
    objectVariableTypes.includes(selectedVar?.dataType as VARIABLE_DATA_TYPE);

  const handleConfirmClick = () => {
    const value = selectVarIsObjectType
      ? {
          ...selectedObjectProperty,
          name: [selectedVar?.name, selectedObjectProperty?.name].join('.')
        }
      : selectedVar;
    onConfirm(value! as Variable);
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="md" open={isOpen} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <TextField
          fullWidth
          placeholder="Search by Keyword"
          size="small"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        <Box mt={1} mx={-3}>
          <Grid container>
            <Grid item xs={selectVarIsObjectType ? 4 : 6}>
              <List
                isEmpty={dictsEmptyState}
                emptyStateText="The list is empty. Try to change search query"
                title="Select Source"
              >
                {Object.keys(filteredData).map((key) => (
                  <StyledListItemButton
                    selected={selectedDict === key}
                    key={key}
                    dense
                    onClick={() => setSelectedDict(key)}
                  >
                    <ListItemText
                      sx={{ margin: 0 }}
                      primary={startCase(
                        key === 'laPMSVariables' ? 'applicationVariables' : key
                      )}
                    />
                  </StyledListItemButton>
                ))}
              </List>
            </Grid>
            <Grid
              item
              xs={selectVarIsObjectType ? 4 : 6}
              sx={{
                position: 'relative',
                borderLeft: `1px solid ${palette.grayBorder}`
              }}
            >
              <List
                isEmpty={variablesEmptyState}
                emptyStateText="The list is empty. To fill it select item from the another list."
                title="Available Variables"
              >
                {(selectedDict ? filteredData[selectedDict] : [])?.map(
                  (variable) => (
                    <StyledListItemButton
                      key={variable.name}
                      dense
                      selected={selectedVar?.name === variable.name}
                      onClick={() => {
                        setSelectedVar(variable);
                      }}
                    >
                      <ListItemText
                        sx={{ margin: 0 }}
                        primary={
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightText([query], variable.name)
                            }}
                          />
                        }
                      />
                    </StyledListItemButton>
                  )
                )}
              </List>
            </Grid>
            {selectVarIsObjectType && (
              <Grid
                item
                xs={4}
                sx={{
                  position: 'relative',
                  borderLeft: `1px solid ${palette.grayBorder}`
                }}
              >
                <List
                  title="Available Attributes"
                  emptyStateText="The list is empty. To fill it select item from the another list."
                  isEmpty={filteredIntegrationDataList.length === 0}
                >
                  {filteredIntegrationDataList.map((property) => {
                    const title = [property.source, property.name].join('.');
                    return (
                      <StyledListItemButton
                        selected={
                          selectedObjectProperty?.name === property.name
                        }
                        key={property.name}
                        dense
                        onClick={() => {
                          if (
                            setSelectedObjectPropertyFunction &&
                            selectedVar
                          ) {
                            setSelectedObjectProperty(
                              setSelectedObjectPropertyFunction(
                                selectedVar,
                                property
                              )
                            );
                          } else {
                            setSelectedObjectProperty(property);
                          }
                        }}
                        title={title}
                      >
                        <ListItemText
                          sx={{ margin: 0 }}
                          primary={
                            <span
                              dangerouslySetInnerHTML={{
                                __html: highlightText([query], title)
                              }}
                            />
                          }
                        />
                      </StyledListItemButton>
                    );
                  })}
                </List>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <Box>
        <Divider />
      </Box>
      <DialogActions sx={{ padding: '8px 16px' }}>
        <LoadingButton
          disabled={
            !selectedVar || (selectVarIsObjectType && !selectedObjectProperty)
          }
          loading={false}
          variant="text"
          color="primary"
          onClick={handleConfirmClick}
        >
          Confirm
        </LoadingButton>
        <Button variant="text" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface DataDictionaryDialogProps {
  title?: string;
  isOpen: boolean;
  showAttributes?: boolean;
  onClose: () => void;
  onConfirm: (variable: Variable) => void;
  data?: DataDictionaryVariables;
  integrationData?: DataDictionaryVariables;
  setSelectedObjectPropertyFunction?: (
    object: Variable,
    property: Variable
  ) => Variable;
}

export default DataDictionaryDialog;
