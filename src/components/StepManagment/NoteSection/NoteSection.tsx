import { Box, Stack, Typography } from '@mui/material';

import { StyledNestedArea, StyledOverlapArea } from './styled';

interface NoteSectionProps {
  children: React.ReactNode;
  handleOpenNoteModal: () => void;
}

const NoteSection = ({ handleOpenNoteModal, children }: NoteSectionProps) => (
  <Stack sx={{ width: '50%', minWidth: '100px' }}>
    <Typography variant="h6" pb={1}>
      Note for this step
    </Typography>
    <Box sx={{ position: 'relative' }}>
      <StyledOverlapArea onClick={handleOpenNoteModal} />
      <StyledNestedArea>{children}</StyledNestedArea>
    </Box>
  </Stack>
);

export default NoteSection;
