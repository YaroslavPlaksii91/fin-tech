import React, { useEffect, useMemo, useState, ReactNode } from 'react';
import {
  Box,
  Dialog,
  Divider,
  Grid,
  ListItemText,
  Typography
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
  setSelectedObjectPropertyFunction,
  onSelect,
  activeVariable,
  activeProperty,
  children,
  maxWidth = 'md'
}) => {
  const [querySource, setQuerySource] = useState('');
  const [queryVariable, setQueryVariable] = useState('');
  const [queryAttribute, setQueryAttribute] = useState('');
  const [selectedDict, setSelectedDict] = useState<null | string>(null);
  const [selectedVariable, setSelectedVariable] = useState<null | Variable>(
    null
  );
  const [selectedObjectProperty, setSelectedObjectProperty] =
    useState<null | Variable>(null);

  const filteredSource = useMemo(() => {
    if (!data) {
      return [];
    }
    const filteredData = Object.keys(data).filter(
      (key) =>
        key.toLowerCase().includes(querySource.toLowerCase()) &&
        data[key].length > 0
    );
    return filteredData;
  }, [data, querySource]);

  const filteredData = useMemo(() => {
    if (!data) return {};
    return Object.keys(data).reduce<DataDictionaryVariables>((acc, curr) => {
      if (curr !== selectedDict) {
        return { ...acc, [curr]: data[curr] };
      }
      const filteredVariables = data[curr].filter((i) => {
        const nameContainsQuery = i.name
          .toLowerCase()
          .includes(queryVariable.toLowerCase());

        return nameContainsQuery;
      });

      if (filteredVariables.length > 0) {
        return {
          ...acc,
          [curr]: filteredVariables
        };
      }

      return acc;
    }, {});
  }, [data, queryVariable]);

  const filteredIntegrationDataList = useMemo(() => {
    const integrationDataList =
      integrationData?.[
        objectVariablesDataSourceMap[
          selectedVariable?.dataType as VARIABLE_DATA_TYPE
        ]
      ];

    if (!integrationDataList) {
      return [];
    }

    if (!queryAttribute) {
      return integrationDataList;
    }

    return integrationDataList.filter((property) =>
      property.name.toLowerCase().includes(queryAttribute.toLowerCase())
    );
  }, [integrationData, selectedVariable, queryAttribute]);

  const dictsEmptyState = filteredSource.length === 0;
  const variablesEmptyState = !selectedDict || !filteredData[selectedDict];

  // Need to set user-defined variables with data types Object:CraClarity and Object:CraFactorTrust without attributes for saving the result of the GET REPORT function
  const selectVarIsObjectType =
    showAttributes &&
    objectVariableTypes.includes(
      selectedVariable?.dataType as VARIABLE_DATA_TYPE
    );

  const getVariable = () =>
    selectVarIsObjectType
      ? {
          ...selectedObjectProperty,
          name: [selectedVariable?.name, selectedObjectProperty?.name].join('.')
        }
      : selectedVariable;

  const handleConfirmClick = () => {
    onConfirm(getVariable() as Variable);
    onClose();
  };

  const handleSourceChange = (key: string) => {
    setSelectedDict(key);
    setQueryVariable('');
    setSelectedVariable(null);
  };

  const handleVariableChange = (variable: Variable) => {
    setSelectedVariable(variable);
  };

  const handleAttributeChange = (property: Variable) => {
    if (setSelectedObjectPropertyFunction && selectedVariable) {
      setSelectedObjectProperty(
        setSelectedObjectPropertyFunction(selectedVariable, property)
      );
    } else {
      setSelectedObjectProperty(property);
    }
  };

  useEffect(() => {
    setSelectedVariable(null);
    setSelectedObjectProperty(null);
  }, [querySource]);

  useEffect(() => {
    if (!isOpen) {
      setQuerySource('');
      setQueryVariable('');
      setQueryAttribute('');
      setSelectedDict(null);
      setSelectedVariable(null);
      setSelectedObjectProperty(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (data) {
      const activeDict =
        Object.keys(data).find((key) =>
          data[key].find((i) => i.sourceType === activeVariable?.sourceType)
        ) || null;
      setSelectedDict(activeDict);
    }
    setSelectedVariable(activeVariable || null);
    setSelectedObjectProperty(activeProperty || null);
  }, []);

  useEffect(() => {
    if (onSelect) onSelect(getVariable() as Variable);
  }, [selectedVariable, selectedObjectProperty]);

  return (
    <Dialog fullWidth maxWidth={maxWidth} open={isOpen} onClose={onClose}>
      {children}
      <DialogTitle>{title}</DialogTitle>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mx: 3, mb: 1.5 }}
      >
        If you can&apos;t find a suitable variable for your needs, you can
        create one in the Data Dictionary for this flow. Note that the created
        variable for this flow will exist only for this flow. For other flows,
        you will need to create this variable separately again.
      </Typography>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <Box mt={1} mx={-3}>
          <Grid container>
            <Grid item xs={selectVarIsObjectType ? 4 : 6}>
              <List
                isEmpty={dictsEmptyState}
                emptyStateText="The list is empty. Try to change search query"
                title="Select Source"
                subtitle="Choose a source of data you want to use in calculations."
                searchQuery={querySource}
                onSearch={setQuerySource}
              >
                {filteredSource.map((key) => (
                  <StyledListItemButton
                    selected={selectedDict === key}
                    key={key}
                    dense
                    onClick={() => handleSourceChange(key)}
                  >
                    <ListItemText
                      sx={{ margin: 0 }}
                      primary={
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightText([querySource], startCase(key))
                          }}
                        />
                      }
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
                subtitle="Choose a variable you want to use in calculations."
                searchQuery={queryVariable}
                onSearch={setQueryVariable}
              >
                {(selectedDict ? filteredData[selectedDict] : [])?.map(
                  (variable) => (
                    <StyledListItemButton
                      key={variable.name}
                      dense
                      selected={selectedVariable?.name === variable.name}
                      onClick={() => handleVariableChange(variable)}
                    >
                      <ListItemText
                        sx={{ margin: 0 }}
                        primary={
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightText(
                                [queryVariable],
                                variable.name
                              )
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
                  subtitle="Choose an inner attribute or score you want to use in calculations."
                  emptyStateText="The list is empty. To fill it select item from the another list."
                  isEmpty={filteredIntegrationDataList.length === 0}
                  searchQuery={queryAttribute}
                  onSearch={setQueryAttribute}
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
                        onClick={() => handleAttributeChange(property)}
                        title={title}
                      >
                        <ListItemText
                          sx={{ margin: 0 }}
                          primary={
                            <span
                              dangerouslySetInnerHTML={{
                                __html: highlightText([queryAttribute], title)
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
            !selectedVariable ||
            (selectVarIsObjectType && !selectedObjectProperty)
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
  onSelect?: (variable: Variable | null) => void;
  activeVariable?: Variable;
  activeProperty?: Variable;
  children?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default DataDictionaryDialog;
