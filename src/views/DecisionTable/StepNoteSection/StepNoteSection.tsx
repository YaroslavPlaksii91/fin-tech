import { useState } from 'react';
import { Stack, TextField } from '@mui/material';

import NoteSection from '@components/StepManagment/NoteSection/NoteSection';
import { NoteForm } from '@components/StepManagment/NoteForm/NoteForm';

const StepNoteSection = ({
  noteValue,
  setNoteValue
}: {
  noteValue: string;
  setNoteValue: (data: string) => void;
}) => {
  const [openNoteModal, setOpenNoteModal] = useState(false);

  return (
    <>
      <Stack sx={{ margin: '16px' }}>
        <NoteSection handleOpenNoteModal={() => setOpenNoteModal(true)}>
          <TextField
            fullWidth
            placeholder="Enter note here"
            disabled
            size="small"
            value={noteValue}
          />
        </NoteSection>
      </Stack>

      {openNoteModal && (
        <NoteForm
          modalOpen={!!openNoteModal}
          handleClose={() => setOpenNoteModal(false)}
          handleSubmitNote={(data) => {
            setNoteValue(data);
            setOpenNoteModal(false);
          }}
          note={noteValue ?? ''}
        />
      )}
    </>
  );
};

export default StepNoteSection;
