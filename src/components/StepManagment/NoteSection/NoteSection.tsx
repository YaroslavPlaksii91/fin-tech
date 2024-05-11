import { Box, Stack, Typography } from '@mui/material';

import { StyledNestedArea, StyledOverlapArea } from './styled';

interface NoteSectionProps {
  children: React.ReactNode;
  handleOpenNoteModal: () => void;
}

const NoteSection: React.FC<NoteSectionProps> = ({
  handleOpenNoteModal,
  children
}) => (
  <Stack width="558px">
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
