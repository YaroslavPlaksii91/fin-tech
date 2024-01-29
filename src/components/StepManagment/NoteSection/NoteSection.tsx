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
  <Stack pt="18px" width="558px">
    <Typography variant="h2" pb="16px">
      Note for this step
    </Typography>
    <Box sx={{ position: 'relative' }}>
      <StyledOverlapArea onClick={handleOpenNoteModal} />
      <StyledNestedArea>{children}</StyledNestedArea>
    </Box>
  </Stack>
);

export default NoteSection;
