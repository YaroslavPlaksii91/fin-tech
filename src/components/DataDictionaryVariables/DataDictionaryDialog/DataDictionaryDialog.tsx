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

import { palette, theme } from '@theme';
import { DataDictionaryVariables } from '@contexts/DataDictionaryContext.tsx';
import { highlightText } from '@utils/text.ts';
import LoadingButton from '@components/shared/LoadingButton.tsx';
import {
  DataDictionaryVariable,
  UserDefinedVariable
} from '@domain/dataDictionary.ts';

const DataDictionaryDialog: React.FC<DataDictionaryDialogProps> = ({
  data,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [query, setQuery] = React.useState<string>('');
  const [selectedDict, setSelectedDict] = React.useState<null | string>(null);
  const [selectedVar, setSelectedVar] = React.useState<
    null | DataDictionaryVariable | UserDefinedVariable
  >(null);

  useEffect(() => {
    setSelectedVar(null);
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedDict(null);
      setSelectedVar(null);
    }
  }, [isOpen]);

  const filteredData: Record<string, DataDictionaryVariable[]> = useMemo(
    () =>
      data
        ? Object.keys(data).reduce((acc, curr) => {
            const filteredVariables = data[curr].filter((i) =>
              i.name.toLowerCase().includes(query.toLowerCase())
            );
            if (filteredVariables.length > 0) {
              return {
                ...acc,
                [curr]: filteredVariables
              };
            }
            return acc;
          }, {})
        : {},
    [data, query]
  );

  const dictsEmptyState = Object.keys(filteredData).length === 0;
  const variablesEmptyState = !selectedDict || !filteredData[selectedDict];

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={onClose}>
      <DialogTitle sx={{ paddingBottom: 1 }}>Add Input Variable</DialogTitle>
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
            <Grid item xs={6}>
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
                  <Box
                    sx={{ backgroundColor: theme.palette.background.default }}
                  >
                    <ListSubheader>Select Source</ListSubheader>
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
              xs={6}
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
                  <Box
                    sx={{ backgroundColor: theme.palette.background.default }}
                  >
                    <ListSubheader>Available Variables</ListSubheader>
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
          </Grid>
        </Box>
      </DialogContent>
      <Box pb={3}>
        <Divider />
      </Box>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          disabled={!selectedVar}
          loading={false}
          variant="contained"
          color="primary"
          onClick={() => {
            onConfirm(selectedVar as DataDictionaryVariable);
            onClose();
          }}
        >
          Confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

interface DataDictionaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (variable: DataDictionaryVariable | UserDefinedVariable) => void;
  data: DataDictionaryVariables;
}

export default DataDictionaryDialog;
