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
  TextField
} from '@mui/material';
import { startCase } from 'lodash';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import { theme } from '../../../themeConfig.ts';

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

  const filteredData: Record<string, DataDictionaryVariable[]> = useMemo(
    () =>
      data
        ? Object.keys(data).reduce((acc, curr) => {
            const filteredVariables = data[curr].filter((i) =>
              i.name.toLowerCase().includes(query)
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
            <Grid item xs={6} sx={{ position: 'relative' }}>
              <List
                sx={{ padding: 0, height: 600, maxHeight: '70vh' }}
                subheader={
                  <Box
                    sx={{ backgroundColor: theme.palette.background.default }}
                  >
                    <ListSubheader>Select Source</ListSubheader>
                    <Divider />
                  </Box>
                }
              >
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
              <Divider
                orientation="vertical"
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 2
                }}
              />
            </Grid>
            <Grid item xs={6}>
              {selectedDict && filteredData[selectedDict] && (
                <List
                  sx={{ padding: 0, height: 300 }}
                  subheader={
                    <Box
                      sx={{ backgroundColor: theme.palette.background.default }}
                    >
                      <ListSubheader>Available Variables</ListSubheader>
                      <Divider />
                    </Box>
                  }
                >
                  {filteredData[selectedDict].map((variable) => (
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
              )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <Box pb={3}>
        <Divider />
      </Box>
      <DialogActions>
        <Button variant="contained" color="secondary" onClick={onClose}>
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
