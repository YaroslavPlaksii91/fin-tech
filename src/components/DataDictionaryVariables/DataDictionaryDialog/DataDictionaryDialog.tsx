import React, { useEffect, useMemo } from 'react';
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
import { highlightText } from '@utils/text.ts';
import LoadingButton from '@components/shared/LoadingButton.tsx';
import {
  CRA_REPORT_VARIABLES,
  DATA_TYPE_WITHOUT_ENUM,
  Variable
} from '@domain/dataDictionary.ts';
import { DataDictionaryVariables } from '@contexts/DataDictionaryContext';

const objectVariableTypes = [
  DATA_TYPE_WITHOUT_ENUM['Object:CraClarity'],
  DATA_TYPE_WITHOUT_ENUM['Object:CraFactorTrust']
];

const objectVariablesDataSourceMap: Record<string, string> = {
  [DATA_TYPE_WITHOUT_ENUM['Object:CraClarity']]:
    CRA_REPORT_VARIABLES.craClarityReportVariables,
  [DATA_TYPE_WITHOUT_ENUM['Object:CraFactorTrust']]:
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
  handleSelectVariable,
  mode = 'withModal'
}) => {
  const [querySource, setQuerySource] = React.useState<string>('');
  const [queryVariable, setQueryVariable] = React.useState<string>('');
  const [queryAttribute, setQueryAttribute] = React.useState<string>('');
  const [selectedDict, setSelectedDict] = React.useState<null | string>(null);
  const [selectedVar, setSelectedVar] = React.useState<null | Variable>(null);
  const [selectedObjectProperty, setSelectedObjectProperty] =
    React.useState<null | Variable>(null);

  useEffect(() => {
    setSelectedVar(null);
    setSelectedObjectProperty(null);
  }, [querySource]);

  useEffect(() => {
    setSelectedObjectProperty(null);
  }, [selectedDict, selectedVar]);

  useEffect(() => {
    if (!isOpen) {
      setQuerySource('');
      setQueryVariable('');
      setQueryAttribute('');
      setSelectedDict(null);
      setSelectedVar(null);
      setSelectedObjectProperty(null);
    }
  }, [isOpen]);

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
          selectedVar?.dataType as DATA_TYPE_WITHOUT_ENUM
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
  }, [integrationData, selectedVar, queryAttribute]);

  const dictsEmptyState = filteredSource.length === 0;
  const variablesEmptyState = !selectedDict || !filteredData[selectedDict];

  // Need to set user-defined variables with data types Object:CraClarity and Object:CraFactorTrust without attributes for saving the result of the GET REPORT function
  const selectVarIsObjectType =
    showAttributes &&
    objectVariableTypes.includes(
      selectedVar?.dataType as DATA_TYPE_WITHOUT_ENUM
    );

  const handleConfirmClick = () => {
    const value = selectVarIsObjectType
      ? {
          ...selectedObjectProperty,
          name: [selectedVar?.name, selectedObjectProperty?.name].join('.')
        }
      : selectedVar;
    onConfirm && onConfirm(value! as Variable);
    onClose && onClose();
  };

  const handleSourceChange = (key: string) => {
    setSelectedDict(key);
    setQueryVariable('');
    setSelectedVar(null);
    if (handleSelectVariable) {
      handleSelectVariable(null);
    }
  };

  const handleVariableChange = (variable: Variable) => {
    const objType = objectVariableTypes.includes(variable.dataType);
    setSelectedVar(variable);
    if (handleSelectVariable) {
      handleSelectVariable(objType ? null : variable);
    }
  };

  const handleAttributeChange = (property: Variable) => {
    if (setSelectedObjectPropertyFunction && selectedVar) {
      setSelectedObjectProperty(
        setSelectedObjectPropertyFunction(selectedVar, property)
      );
    } else {
      setSelectedObjectProperty(property);
    }
    if (handleSelectVariable) {
      handleSelectVariable(property);
    }
  };

  const content = (
    <Box m={mode === 'withModal' ? 0 : '0 -24px'}>
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
                subtitle="Some self explanatory text what this column is, no longer than 2 lines."
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
                subtitle="Some self explanatory text what this column is, no longer than 2 lines."
                searchQuery={queryVariable}
                onSearch={setQueryVariable}
              >
                {(selectedDict ? filteredData[selectedDict] : [])?.map(
                  (variable) => (
                    <StyledListItemButton
                      key={variable.name}
                      dense
                      selected={selectedVar?.name === variable.name}
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
                  subtitle="Some self explanatory text what this column is, no longer than 2 lines."
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
    </Box>
  );

  return mode === 'withModal' ? (
    <Dialog fullWidth maxWidth="md" open={Boolean(isOpen)} onClose={onClose}>
      {content}
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
  ) : (
    content
  );
};

interface DataDictionaryDialogProps {
  title?: string;
  isOpen?: boolean;
  showAttributes?: boolean;
  onClose?: () => void;
  onConfirm?: (variable: Variable) => void;
  data?: DataDictionaryVariables;
  integrationData?: DataDictionaryVariables;
  setSelectedObjectPropertyFunction?: (
    object: Variable,
    property: Variable
  ) => Variable;
  handleSelectVariable?: (variable: Variable | null) => void;
  mode?: 'withModal' | 'withoutModal';
}

export default DataDictionaryDialog;
