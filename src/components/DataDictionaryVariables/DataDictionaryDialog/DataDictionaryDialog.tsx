import React, { useEffect, useMemo } from 'react';
import {
  Box,
  Dialog,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { startCase } from 'lodash';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

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

  const selectVarIsObjectType = objectVariableTypes.includes(
    selectedVar?.dataType as DATA_TYPE
  );

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
      <DialogTitle sx={{ paddingBottom: 1 }}>{title}</DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <Box pt={1}>
          <TextField
            fullWidth
            placeholder="Search by Keyword"
            size="small"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
        </Box>
        <Box mt={3} mx={-3}>
          <Divider />
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
                  <Box>
                    <ListSubheader sx={{ lineHeight: '40px' }}>
                      Select Source
                    </ListSubheader>
                    <Divider />
                  </Box>
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
                  <ListItemButton
                    selected={selectedDict === key}
                    key={key}
                    dense
                    onClick={() => setSelectedDict(key)}
                  >
                    <ListItemText primary={startCase(key)} />
                  </ListItemButton>
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
                  <Box>
                    <ListSubheader sx={{ lineHeight: '40px' }}>
                      Available Variables
                    </ListSubheader>
                    <Divider />
                  </Box>
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
                    <ListItemButton
                      key={variable.name}
                      dense
                      selected={selectedVar?.name === variable.name}
                      onClick={() => {
                        setSelectedVar(variable);
                      }}
                    >
                      <ListItemText
                        primary={
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightText([query], variable.name)
                            }}
                          />
                        }
                      />
                    </ListItemButton>
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
                    <Box>
                      <ListSubheader sx={{ lineHeight: '40px' }}>
                        Available Attributes
                      </ListSubheader>
                      <Divider />
                    </Box>
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
                      <ListItemButton
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
                          primary={
                            <span
                              dangerouslySetInnerHTML={{
                                __html: highlightText([query], title)
                              }}
                            />
                          }
                        />
                      </ListItemButton>
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
      <DialogActions sx={{ paddingBottom: '16px' }}>
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
