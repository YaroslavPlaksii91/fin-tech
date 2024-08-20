import React, { useEffect, useMemo } from 'react';
import {
  Box,
  Dialog,
  Divider,
  Grid,
  List,
  ListItemText,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { startCase } from 'lodash';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import { StyledListItemButton, StyledListSubheader } from './styled';

import { palette } from '@theme';
import { highlightText } from '@utils/text.ts';
import LoadingButton from '@components/shared/LoadingButton.tsx';
import {
  DATA_TYPE,
  DATA_TYPE_WITHOUT_ENUM,
  DataDictionaryVariableRecord,
  Variable
} from '@domain/dataDictionary.ts';

const objectVariableTypes: DATA_TYPE[] = [
  DATA_TYPE_WITHOUT_ENUM['Object:CraClarity'],
  DATA_TYPE_WITHOUT_ENUM['Object:CraFactorTrust']
];

const objectVariablesDataSourceMap: Record<string, string> = {
  [DATA_TYPE_WITHOUT_ENUM['Object:CraClarity']]: 'craClarityReportVariables',
  [DATA_TYPE_WITHOUT_ENUM['Object:CraFactorTrust']]:
    'craFactorTrustReportVariables'
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
        ? Object.keys(data).reduce<DataDictionaryVariableRecord>(
            (acc, curr) => {
              const filteredVariables = data[curr].filter((i) => {
                const nameContainsQuery = i.name
                  .toLowerCase()
                  .includes(query.toLowerCase());

                if (objectVariableTypes.includes(i.dataType)) {
                  const relatedIntegratedDataList =
                    integrationData?.[
                      objectVariablesDataSourceMap[i.dataType]
                    ] || [];

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
            },
            {}
          )
        : {},
    [data, integrationData, query]
  );

  const filteredIntegrationDataList = useMemo(() => {
    const integrationDataList =
      integrationData?.[
        objectVariablesDataSourceMap[selectedVar?.dataType as DATA_TYPE]
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
    objectVariableTypes.includes(selectedVar?.dataType as DATA_TYPE);

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
                sx={{
                  padding: 0,
                  height: 350,
                  maxHeight: '70vh',
                  display: dictsEmptyState ? 'flex' : 'block',
                  flexDirection: 'column',
                  overflowY: 'auto'
                }}
                subheader={
                  <StyledListSubheader>
                    <Typography variant="body1">Select Source</Typography>
                  </StyledListSubheader>
                }
              >
                {dictsEmptyState && (
                  <Stack
                    flexGrow={1}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography
                      sx={{ transform: 'translateY(-40px)' }}
                      textAlign="center"
                      variant="body2"
                      color="gray"
                    >
                      The list is empty. Try to change search query
                    </Typography>
                  </Stack>
                )}
                {Object.keys(filteredData).map((key) => (
                  <StyledListItemButton
                    selected={selectedDict === key}
                    key={key}
                    dense
                    onClick={() => setSelectedDict(key)}
                  >
                    <ListItemText sx={{ margin: 0 }} primary={startCase(key)} />
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
                sx={{
                  padding: 0,
                  height: 350,
                  maxHeight: '70vh',
                  display: variablesEmptyState ? 'flex' : 'block',
                  flexDirection: 'column',
                  overflowY: 'auto'
                }}
                subheader={
                  <StyledListSubheader>
                    <Typography variant="body1">Available Variables</Typography>
                  </StyledListSubheader>
                }
              >
                {variablesEmptyState && (
                  <Stack
                    flexGrow={1}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography
                      sx={{ transform: 'translateY(-40px)' }}
                      textAlign="center"
                      variant="body2"
                      color="gray"
                    >
                      The list is empty. To fill it select item from the another
                      list.
                    </Typography>
                  </Stack>
                )}
                {selectedDict &&
                  filteredData[selectedDict]?.map((variable) => (
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
                  ))}
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
                  sx={{
                    padding: 0,
                    height: 350,
                    maxHeight: '70vh',
                    display:
                      filteredIntegrationDataList.length === 0
                        ? 'flex'
                        : 'block',
                    flexDirection: 'column',
                    overflowY: 'auto'
                  }}
                  subheader={
                    <StyledListSubheader>
                      <Typography variant="body1">
                        Available Attributes
                      </Typography>
                    </StyledListSubheader>
                  }
                >
                  {filteredIntegrationDataList.length === 0 && (
                    <Stack
                      flexGrow={1}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography
                        sx={{ transform: 'translateY(-40px)' }}
                        textAlign="center"
                        variant="body2"
                        color="gray"
                      >
                        The list is empty. To fill it select item from the
                        another list.
                      </Typography>
                    </Stack>
                  )}
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
  data?: DataDictionaryVariableRecord;
  integrationData?: DataDictionaryVariableRecord;
  setSelectedObjectPropertyFunction?: (
    object: Variable,
    property: Variable
  ) => Variable;
}

export default DataDictionaryDialog;
