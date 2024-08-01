import { Stack, Typography, Card } from '@mui/material';

import { theme } from '@theme';

interface StepNoteSectionProps {
  children: React.ReactNode;
}

const NoteSection = ({ children }: StepNoteSectionProps) => (
  <Card
    elevation={1}
    sx={{
      mt: 2,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: '16px',
      padding: '8px 16px'
    }}
  >
    <Stack sx={{ width: '50%', minWidth: '100px' }}>
      <Typography variant="h6" pb={1}>
        Note for this step
      </Typography>
      {children}
    </Stack>
  </Card>
);

export default NoteSection;
