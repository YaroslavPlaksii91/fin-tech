import { useState } from 'react';
import {
  Button,
  Stack,
  Table,
  TableBody,
  TableHead,
  Typography
} from '@mui/material';

// import { StyledPaper, StyledTableContainer } from './styled';

import { columns } from './types';

import { FlowNode, IFlow } from '@domain/flow';
import StepDetailsHeader from '@components/StepManagment/StepDetailsHeader';
import { CustomReactFlowInstance } from '@components/FlowManagment/FlowChart/types';
import { MAIN_STEP_ID } from '@constants/common';
import Dialog from '@components/shared/Modals/Dialog';
import {
  StyledTableRow,
  StyledTableCell
} from '@components/shared/Table/styled';
import { StyledPaper } from '@views/ChampionChallenger/styled';
import { StyledTableContainer } from '@views/DecisionTable/styled';
import {
  AddIcon,
  DeleteOutlineIcon,
  EditNoteOutlinedIcon
} from '@components/shared/Icons';

// const STEPS_LIMIT = 10;

interface CalculationProps {
  step: FlowNode;
  setStep: (step: FlowNode | { id: typeof MAIN_STEP_ID }) => void;
  rfInstance: CustomReactFlowInstance;
  flow: IFlow;
}

const Calculation: React.FC<CalculationProps> = ({
  step,
  setStep
  //   flow,
  // rfInstance,
}) => {
  //   const [openNoteModal, setOpenNoteModal] = useState<boolean>(false);
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);

  //   const handleOpenNoteModal = () => {
  //     setOpenNoteModal(true);
  //   };

  //   const handleSubmitNote = (note: string) => {
  //     setValue('note', note);
  //     setOpenNoteModal(false);
  //   };

  //   const handleCloseNoteModal = () => {
  //     setValue('note', getValues('note'));
  //     setOpenNoteModal(false);
  //   };

  const handleDiscardChanges = () => setStep({ id: MAIN_STEP_ID });

  return (
    <>
      <StepDetailsHeader
        title={step.data.name}
        details="Calculation is a step that allows the User to set a value for the parameter."
        onDiscard={() => setOpenDiscardModal(true)}
        disabled={false}
        isSubmitting={false}
      />
      <Stack pl={3} pr={3}>
        <StyledPaper>
          <StyledTableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <StyledTableRow>
                  {columns.map((column) => (
                    <StyledTableCell
                      key={column.id}
                      align={column.align}
                      style={{ width: column.width }}
                    >
                      {column.label}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableHead>
              <TableBody>
                <StyledTableRow>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell sx={{ padding: 0 }} width={40}>
                    <Stack direction="row">
                      <Button
                        fullWidth
                        sx={{ padding: '10px' }}
                        onClick={() => {
                          // console.log('edit');
                        }}
                      >
                        <EditNoteOutlinedIcon />
                      </Button>
                      <Button
                        fullWidth
                        sx={{ padding: '10px' }}
                        onClick={() => {
                          // console.log('remove');
                        }}
                      >
                        <DeleteOutlineIcon />
                      </Button>
                    </Stack>
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </StyledTableContainer>
        </StyledPaper>
        <Button
          sx={{ width: '190px' }}
          onClick={() => {
            // console.log('add new row');
          }}
          startIcon={<AddIcon />}
        >
          Add new business rule
        </Button>
      </Stack>

      <Dialog
        title="Discard changes"
        open={openDiscardModal}
        onConfirm={handleDiscardChanges}
        onClose={() => setOpenDiscardModal(false)}
        confirmText="Discard changes"
      >
        <Typography sx={{ maxWidth: '416px' }} variant="body2">
          Discarding changes will delete all edits in this step, this action
          cannot be canceled. Are you sure you want to cancel the changes?
        </Typography>
      </Dialog>
    </>
  );
};

export default Calculation;
