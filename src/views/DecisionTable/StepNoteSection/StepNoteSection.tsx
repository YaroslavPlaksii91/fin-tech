import { ReactElement } from 'react';
import { Card, CardContent, Stack } from '@mui/material';

import NoteSection from '@components/StepManagment/NoteSection/NoteSection';
import { NoteForm } from '@components/StepManagment/NoteForm/NoteForm';

interface StepNoteSectionProps {
  modalOpen: boolean;
  handleCloseModal: () => void;
  handleOpenModal: () => void;
  noteValue: string;
  handleSubmitNote: (data: string) => void;
  renderInput: () => ReactElement;
}

const StepNoteSection = ({
  modalOpen,
  handleCloseModal,
  handleOpenModal,
  noteValue,
  handleSubmitNote,
  renderInput
}: StepNoteSectionProps) => (
  <Card variant="outlined" sx={{ mt: 2 }}>
    <CardContent>
      <Stack>
        <NoteSection handleOpenNoteModal={handleOpenModal}>
          {renderInput()}
        </NoteSection>
      </Stack>
      <NoteForm
        modalOpen={modalOpen}
        handleClose={handleCloseModal}
        handleSubmitNote={handleSubmitNote}
        note={noteValue}
      />
    </CardContent>
  </Card>
);

export default StepNoteSection;
