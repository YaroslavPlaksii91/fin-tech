import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button, Typography, Stack } from '@mui/material';
import { palette } from '../../themeConfig';

import {
  inputVariablesOptions,
  outputVariablesOptions,
  CATEGORIES
} from './constants';

import { StyledPaper, StyledTableContainer, StyledStack } from './styled';
import TableSkeleton from './TableSkeleton/TableSkeleton';

import StepDetailsHeader from '@components/StepManagment/StepDetailsHeader';
import { AddIcon } from '@components/shared/Icons';

const DecisionTableStep = ({ step }) => {
  // define states for condition obj
  const [inputColumnClickedId, setInputColumnClickedId] =
    useState<string>(uuidv4());
  const [inputColumns, setInputColumns] = useState([
    { id: inputColumnClickedId, variableName: '', variableType: '' }
  ]);
  const [inputRows, setInputRows] = useState([]);

  // define states for condition obj
  const [outputColumnClickedId, setOutputColumnClickedId] =
    useState<string>(uuidv4());
  const [outputColumns, setOutputColumns] = useState([
    { id: outputColumnClickedId, variableName: '', variableType: '' }
  ]);
  const [outputRows, setOutputRows] = useState([]);

  const handleAddNewLayer = () => {
    const newRowId = uuidv4();
    setInputRows([...inputRows, { id: newRowId }]);
    setOutputRows([...outputRows, { id: newRowId }]);
  };

  const handleDeleteLayer = (id: string) => {
    const newOutputRows = outputRows.filter((item) => item.id !== id);
    const newInputRows = inputRows.filter((item) => item.id !== id);

    setInputRows(newInputRows);
    setOutputRows(newOutputRows);
  };

  return (
    <>
      <StepDetailsHeader
        title={step.data.name}
        details="A decision table is an object that allows to set expressions for
        columns and rows. The system will go through the table and analyze the
        values."
      />
      <StyledPaper>
        <StyledTableContainer>
          <Stack sx={{ width: '50%' }}>
            <StyledStack
              sx={{ borderRight: '1px solid rgba(209, 217, 226, 0.4)' }}
            >
              Condition
            </StyledStack>
            <TableSkeleton
              columns={inputColumns}
              setColumns={setInputColumns}
              rows={inputRows}
              setRows={setInputRows}
              variablesOptions={inputVariablesOptions}
              columnClickedId={inputColumnClickedId}
              setColumnClickedId={setInputColumnClickedId}
              category={CATEGORIES.Condition}
              handleDeleteRow={handleDeleteLayer}
            />
          </Stack>
          <Stack sx={{ width: '50%' }}>
            <StyledStack>Output</StyledStack>
            <TableSkeleton
              columns={outputColumns}
              setColumns={setOutputColumns}
              rows={outputRows}
              setRows={setOutputRows}
              variablesOptions={outputVariablesOptions}
              columnClickedId={outputColumnClickedId}
              setColumnClickedId={setOutputColumnClickedId}
              category={CATEGORIES.Output}
              handleDeleteRow={handleDeleteLayer}
            />
          </Stack>
        </StyledTableContainer>
      </StyledPaper>

      <Button
        sx={{ width: '135px' }}
        onClick={() => handleAddNewLayer()}
        startIcon={<AddIcon />}
      >
        <Typography variant="body2" color={palette.gray}>
          Add new layer
        </Typography>
      </Button>
    </>
  );
};

export default DecisionTableStep;
