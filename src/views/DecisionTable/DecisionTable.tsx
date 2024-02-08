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
import { VariablesOptionsProps } from './types';
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
  const firstConditionsColumnId = uuidv4();
  const firstActionsColumnId = uuidv4();

  const [selectedCaseEntries, setSelectedCaseEntries] = useState({
    conditions: {
      columnClickedId: firstConditionsColumnId,
      columns: [
        { id: firstConditionsColumnId, variableName: '', variableType: '' }
      ],
      rows: []
    },
    actions: {
      columnClickedId: firstActionsColumnId,
      columns: [
        { id: firstActionsColumnId, variableName: '', variableType: '' }
      ],
      rows: []
    }
  });

  const [openNoteModal, setOpenNoteModal] = useState(false);

  const handleAddNewLayer = () => {
    const newRowId = uuidv4();

    setSelectedCaseEntries({
      ...selectedCaseEntries,
      conditions: {
        ...selectedCaseEntries.conditions,
        rows: [...selectedCaseEntries.conditions.rows, { id: newRowId }]
      },
      actions: {
        ...selectedCaseEntries.actions,
        rows: [...selectedCaseEntries.actions.rows, { id: newRowId }]
      }
    });
  };

  const handleDeleteLayer = (id: string) => {
    const { conditions, actions } = selectedCaseEntries;

    const newConditionsRows = conditions.rows.filter((item) => item.id !== id);
    const newActionsRows = actions.rows.filter((item) => item.id !== id);

    setSelectedCaseEntries({
      ...selectedCaseEntries,
      conditions: {
        ...selectedCaseEntries.conditions,
        rows: newConditionsRows
      },
      actions: {
        ...selectedCaseEntries.actions,
        rows: newActionsRows
      }
    });
  };

  const handleChangeColumnClickedId = (
    newColumnId: string,
    category: string
  ) => {
    setSelectedCaseEntries({
      ...selectedCaseEntries,
      [category]: {
        ...selectedCaseEntries[category],
        columnClickedId: newColumnId
      }
    });
  };

  const handleInsertingColumn = ({
    columnClickedIndex,
    category
  }: {
    columnClickedIndex: number;
    category: string;
  }) => {
    const newColumns = [...selectedCaseEntries[category].columns];

    newColumns.splice(columnClickedIndex + 1, 0, {
      id: uuidv4(),
      variableName: '',
      variableType: ''
    });

    setSelectedCaseEntries({
      ...selectedCaseEntries,
      [category]: {
        ...selectedCaseEntries[category],
        columns: newColumns
      }
    });
  };

  const handleDeleteCategoryColumn = ({
    columnId,
    category
  }: {
    columnId: string;
    category: string;
  }) => {
    const newColumns = [...selectedCaseEntries[category].columns].filter(
      (item) => item.id !== columnId
    );

    setSelectedCaseEntries({
      ...selectedCaseEntries,
      [category]: {
        ...selectedCaseEntries[category],
        columns: newColumns
      }
    });
  };

  const handleChangeVariable = ({
    columnId,
    newVariable,
    category
  }: {
    columnId: string;
    newVariable: VariablesOptionsProps;
    category: string;
  }) => {
    const updatedColumns = selectedCaseEntries[category].columns.map((item) => {
      if (item.id === columnId) {
        return {
          ...item,
          variableName: newVariable.variableName,
          variableType: newVariable.variableType
        };
      } else {
        return item;
      }
    });

    setSelectedCaseEntries({
      ...selectedCaseEntries,
      [category]: {
        ...selectedCaseEntries[category],
        columns: updatedColumns
      }
    });
  };

  // console.log('selectedCaseEntries', selectedCaseEntries);

  const { conditions, actions } = selectedCaseEntries;
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
              columns={conditions.columns}
              rows={conditions.rows}
              variablesOptions={inputVariablesOptions}
              columnClickedId={conditions.columnClickedId}
              category={CATEGORIES.Conditions}
              handleDeleteRow={handleDeleteLayer}
              handleChangeColumnClickedId={handleChangeColumnClickedId}
              handleInsertingColumn={handleInsertingColumn}
              handleDeleteCategoryColumn={handleDeleteCategoryColumn}
              handleChangeVariable={handleChangeVariable}
            />
          </Stack>
          <Stack>
            <StyledStack
              sx={{ borderBottom: '2px solid rgba(209, 217, 226, 0.4)' }}
            >
              Output
            </StyledStack>
            <TableSkeleton
              columns={actions.columns}
              rows={actions.rows}
              variablesOptions={outputVariablesOptions}
              columnClickedId={actions.columnClickedId}
              category={CATEGORIES.Actions}
              handleDeleteRow={handleDeleteLayer}
              handleChangeColumnClickedId={handleChangeColumnClickedId}
              handleInsertingColumn={handleInsertingColumn}
              handleDeleteCategoryColumn={handleDeleteCategoryColumn}
              handleChangeVariable={handleChangeVariable}
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
        <StyledTableContainer
          sx={{
            '& .MuiTableCell-root': {
              height: '46px'
            }
          }}
        >
          <StyledTable>
            <TableHead>
              <StyledTableRow>
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
            columns={actions.columns}
            rows={[{ id: uuidv4() }]}
            variablesOptions={outputVariablesOptions}
            category={CATEGORIES.ElseActions}
          />
        </StyledTableContainer>
      </StyledPaper>

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
