import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  Typography,
  Stack,
  TableHead,
  TableBody,
  TextField
} from '@mui/material';

import { palette } from '../../themeConfig';

import {
  inputVariablesOptions,
  outputVariablesOptions,
  CATEGORIES
} from './constants';
import {
  StyledPaper,
  StyledTableContainer,
  StyledStack,
  StyledTable
} from './styled';
import TableSkeleton from './TableSkeleton/TableSkeleton';

import { FlowNode } from '@domain/flow';
import StepDetailsHeader from '@components/StepManagment/StepDetailsHeader';
import NoteSection from '@components/StepManagment/NoteSection/NoteSection';
import { NoteForm } from '@components/StepManagment/NoteForm/NoteForm';
import { AddIcon } from '@components/shared/Icons';
import {
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';

type DecisionTableStepProps = {
  step: FlowNode;
};

const DecisionTableStep = ({ step }: DecisionTableStepProps) => {
  // define states for condition obj
  const [inputColumnClickedId, setInputColumnClickedId] =
    useState<string>(uuidv4());
  const [inputColumns, setInputColumns] = useState([
    { id: inputColumnClickedId, variableName: '', variableType: '' }
  ]);
  const [inputRows, setInputRows] = useState([]);

  // define states for output obj
  const [outputColumnClickedId, setOutputColumnClickedId] =
    useState<string>(uuidv4());
  const [outputColumns, setOutputColumns] = useState([
    { id: outputColumnClickedId, variableName: '', variableType: '' }
  ]);
  const [outputRows, setOutputRows] = useState([]);

  // define states for otherwise obj
  const [otherwiseObjColumnClickedId, setOtherwiseObjColumnClickedId] =
    useState<string>(uuidv4());
  const [otherwiseObjColumns, setOtherwiseObjColumns] = useState([
    { id: otherwiseObjColumnClickedId, variableName: '', variableType: '' }
  ]);
  const [otherwiseObjRows, setOtherwiseObjRows] = useState([
    {
      id: uuidv4()
    }
  ]);

  const [openNoteModal, setOpenNoteModal] = useState(false);

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
          <Stack sx={{ width: 'inherit' }}>
            <StyledStack
              sx={{
                borderRight: '1px solid rgba(209, 217, 226, 0.4)',
                borderBottom: '2px solid rgba(209, 217, 226, 0.4)'
              }}
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
          <Stack>
            <StyledStack
              sx={{ borderBottom: '2px solid rgba(209, 217, 226, 0.4)' }}
            >
              Output
            </StyledStack>
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
        sx={{ width: '135px', margin: '16px' }}
        onClick={() => handleAddNewLayer()}
        startIcon={<AddIcon />}
      >
        <Typography variant="body2" color={palette.gray}>
          Add new layer
        </Typography>
      </Button>
      <StepDetailsHeader
        title="Otherwise condition"
        details="A condition used when no rule from previous table was not executed."
        isActionContainerVisible={false}
      />
      {/* Otherwise table */}
      <StyledPaper>
        <StyledTableContainer>
          <StyledTable>
            <TableHead>
              <StyledTableRow sx={{ height: '74px' }}>
                <StyledTableCell> Otherwise Condition</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow>
                <StyledTableCell> Else</StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </StyledTable>
          <TableSkeleton
            columns={otherwiseObjColumns}
            setColumns={setOtherwiseObjColumns}
            rows={otherwiseObjRows}
            setRows={setOtherwiseObjRows}
            variablesOptions={outputVariablesOptions}
            columnClickedId={otherwiseObjColumnClickedId}
            setColumnClickedId={setOtherwiseObjColumnClickedId}
            category={CATEGORIES.OtherwiseCondition}
            handleDeleteRow={() => {}}
          />
        </StyledTableContainer>
      </StyledPaper>
      {/* TODO: submition of note during integration */}
      <Stack sx={{ margin: '16px' }}>
        <NoteSection handleOpenNoteModal={() => setOpenNoteModal(true)}>
          <TextField fullWidth label="Enter note here" disabled size="small" />
        </NoteSection>
      </Stack>

      {/* TODO: submition of note during integration */}
      {openNoteModal && (
        <NoteForm
          modalOpen={!!openNoteModal}
          handleClose={() => setOpenNoteModal(false)}
          handleSubmitNote={() => setOpenNoteModal(false)}
          note=""
        />
      )}
    </>
  );
};

export default DecisionTableStep;
