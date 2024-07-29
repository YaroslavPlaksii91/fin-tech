import { Box, Stack, Typography, Card, CardContent } from '@mui/material';

import { StyledNestedArea, StyledOverlapArea } from './styled';

import { NoteForm } from '@components/StepManagment/NoteForm/NoteForm';

interface StepNoteSectionProps {
  value: string;
  modalOpen: boolean;
  handleClose: () => void;
  handleOpen: () => void;
  handleSubmit: (data: string) => void;
  renderInput: () => React.ReactNode;
}

const NoteSection = ({
  value,
  modalOpen,
  handleClose,
  handleOpen,
  handleSubmit,
  renderInput
}: StepNoteSectionProps) => (
  <Card variant="outlined" sx={{ mt: 2 }}>
    <CardContent>
      <Stack sx={{ width: '50%', minWidth: '100px' }}>
        <Typography variant="h6" pb={1}>
          Note for this step
        </Typography>
        <Box sx={{ position: 'relative' }}>
          <StyledOverlapArea onClick={handleOpen} />
          <StyledNestedArea>{renderInput()}</StyledNestedArea>
        </Box>
      </Stack>
      <NoteForm
        modalOpen={modalOpen}
        handleClose={handleClose}
        handleSubmitNote={handleSubmit}
        note={value}
      />
    </CardContent>
  </Card>
);

export default NoteSection;
